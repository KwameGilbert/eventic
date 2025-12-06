import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Clock, CreditCard, MapPin, Calendar, CheckCircle, Loader2, Shield, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { showOrderCreated, showPaymentSuccess, showError as showErrorToast, showLoading, hideLoading } from '../utils/toast';

// Paystack public key
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();

    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
    const [isProcessing, setIsProcessing] = useState(false);
    const [paystackLoaded, setPaystackLoaded] = useState(false);
    const [error, setError] = useState('');

    // Ref to track if payment was completed successfully (prevents empty cart redirect)
    const paymentCompleteRef = useRef(false);

    // Billing form state
    const [billingInfo, setBillingInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    // Initialize billing info from user data
    useEffect(() => {
        if (user) {
            const nameParts = (user.name || '').split(' ');
            setBillingInfo({
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    // Load Paystack script
    useEffect(() => {
        const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');

        if (existingScript) {
            setPaystackLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        script.onload = () => setPaystackLoaded(true);
        document.body.appendChild(script);

        return () => {
            // Don't remove script on unmount as it might be needed later
        };
    }, []);

    // Redirect if cart is empty (but not after successful payment)
    useEffect(() => {
        if (cartItems.length === 0 && !paymentCompleteRef.current) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    // Timer countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    navigate('/cart', { state: { message: 'Your session expired. Please try again.' } });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate totals using orderService
    const { subtotal, fees, total, itemCount } = orderService.calculateTotal(cartItems);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBillingInfo(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    // Handle Paystack payment
    const handlePaystackPayment = async () => {
        // Validate billing info
        if (!billingInfo.email || !billingInfo.firstName) {
            showErrorToast('Please fill in your name and email address');
            return;
        }

        if (!paystackLoaded || !window.PaystackPop) {
            showErrorToast('Payment system is loading. Please try again.');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            // Show loading
            showLoading('Creating your order...');

            // Create order on backend first
            const result = await orderService.processCheckout(cartItems, billingInfo);

            hideLoading();

            if (!result.success) {
                showErrorToast(result.error || 'Failed to create order. Please try again.');
                setIsProcessing(false);
                return;
            }

            const { order, paystack } = result;

            // Validate required fields for Paystack
            if (!paystack.email || !paystack.amount || !paystack.reference) {
                console.error('Missing Paystack required fields:', paystack);
                showErrorToast('Missing payment information. Please try again.');
                setIsProcessing(false);
                return;
            }

            // Format amount for display
            const formattedAmount = `GH₵${(paystack.amount / 100).toFixed(2)}`;

            // Calculate item count
            const itemCount = cartItems.reduce((total, item) => {
                return total + Object.values(item.tickets || {}).reduce((sum, qty) => sum + qty, 0);
            }, 0);

            // Show order created confirmation
            const confirmResult = await showOrderCreated({
                orderId: paystack.orderId,
                amount: formattedAmount,
            });

            // If user cancels, cancel the order on backend
            if (!confirmResult.isConfirmed) {
                // Cancel order to restore ticket quantities
                try {
                    showLoading('Cancelling order...');
                    await orderService.cancelOrder(paystack.orderId);
                    hideLoading();
                } catch (cancelError) {
                    console.error('Failed to cancel order:', cancelError);
                    hideLoading();
                }
                setIsProcessing(false);
                return;
            }

            // Initialize Paystack popup
            const handler = window.PaystackPop.setup({
                key: PAYSTACK_PUBLIC_KEY,
                email: paystack.email,
                amount: paystack.amount,
                currency: 'GHS',
                ref: paystack.reference,
                metadata: {
                    order_id: paystack.orderId,
                    customer_name: `${billingInfo.firstName} ${billingInfo.lastName}`,
                    custom_fields: [
                        {
                            display_name: "Order ID",
                            variable_name: "order_id",
                            value: String(paystack.orderId || '')
                        },
                        {
                            display_name: "Customer Phone",
                            variable_name: "phone",
                            value: billingInfo.phone || 'N/A'
                        }
                    ]
                },
                callback: function (response) {
                    showLoading('Verifying payment...');

                    // Verify payment with backend
                    orderService.verifyPayment(paystack.orderId, response.reference)
                        .then(verifyResult => {
                            hideLoading();

                            if (verifyResult.success || verifyResult.data?.status === 'paid') {
                                // Mark payment as complete to prevent empty cart redirect
                                paymentCompleteRef.current = true;

                                // Show success notification
                                showPaymentSuccess({
                                    reference: response.reference,
                                    orderId: paystack.orderId,
                                }).then(() => {
                                    // Payment successful - redirect
                                    clearCart();
                                    navigate('/my-tickets', {
                                        state: {
                                            paymentSuccess: true,
                                            orderId: paystack.orderId,
                                            reference: response.reference
                                        }
                                    });
                                });
                            } else {
                                showErrorToast('Payment verification failed. Please contact support.');
                            }
                        })
                        .catch(() => {
                            hideLoading();
                            // Mark payment as complete to prevent empty cart redirect
                            paymentCompleteRef.current = true;

                            // Even if verification fails, payment might be successful
                            showPaymentSuccess({
                                reference: response.reference,
                                orderId: paystack.orderId,
                            }).then(() => {
                                clearCart();
                                navigate('/my-tickets', {
                                    state: {
                                        paymentSuccess: true,
                                        reference: response.reference,
                                        message: 'Payment completed. Your tickets will appear shortly.'
                                    }
                                });
                            });
                        })
                        .finally(() => {
                            setIsProcessing(false);
                        });
                },
                onClose: function () {
                    setIsProcessing(false);
                    // Don't show error - user intentionally closed
                }
            });

            handler.openIframe();

        } catch (err) {
            hideLoading();
            console.error('Checkout error:', err);
            showErrorToast(err.message || 'Something went wrong. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Mobile Sticky Timer */}
            <div className="lg:hidden sticky top-0 z-10 bg-orange-500 text-white px-4 py-3 text-center font-bold shadow-md flex items-center justify-center gap-2">
                <Clock size={18} />
                <span>{formatTime(timeLeft)} left to complete purchase</span>
            </div>

            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                        <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                            <Link to="/" className="hover:text-[var(--brand-primary)] flex items-center gap-1">
                                <Home size={16} />
                            </Link>
                            <ChevronRight size={16} />
                            <Link to="/cart" className="hover:text-[var(--brand-primary)]">My cart</Link>
                            <ChevronRight size={16} />
                            <span className="text-gray-900 font-medium">Checkout</span>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Alert */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-semibold text-red-800">Error</h4>
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Summary */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-900">Order summary</h2>
                                <span className="text-sm text-gray-500">{itemCount} tickets</span>
                            </div>
                            <div className="p-6">
                                {/* Desktop Header */}
                                <div className="hidden md:grid grid-cols-12 text-sm font-medium text-gray-500 mb-4 pb-2 border-b border-gray-100">
                                    <div className="col-span-6">Event / Ticket</div>
                                    <div className="col-span-2 text-center">Price</div>
                                    <div className="col-span-2 text-center">Quantity</div>
                                    <div className="col-span-2 text-right">Subtotal</div>
                                </div>

                                <div className="space-y-6">
                                    {cartItems.map((item) => (
                                        Object.entries(item.tickets).map(([ticketName, qty]) => {
                                            if (qty === 0) return null;
                                            const ticketType = item.event.ticketTypes?.find(t => t.name === ticketName);
                                            const price = ticketType?.price || 0;

                                            return (
                                                <div key={`${item.id}-${ticketName}`} className="flex flex-col md:grid md:grid-cols-12 gap-4 border-b border-gray-100 last:border-0 pb-6 md:pb-0">
                                                    <div className="col-span-6">
                                                        <div className="flex gap-4">
                                                            <img
                                                                src={item.event.image}
                                                                alt={item.event.title}
                                                                className="w-20 h-20 md:w-16 md:h-16 object-cover rounded-lg shrink-0 shadow-sm"
                                                            />
                                                            <div className="flex-1">
                                                                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{item.event.title}</h3>
                                                                <p className="text-sm text-[var(--brand-primary)] font-medium mb-2">{ticketName}</p>

                                                                {/* Mobile Price/Qty Row */}
                                                                <div className="flex md:hidden items-center justify-between mt-2 bg-gray-50 p-2 rounded-lg">
                                                                    <span className="text-sm text-gray-600">GH₵{price} × {qty}</span>
                                                                    <span className="font-bold text-gray-900">GH₵{(price * qty).toFixed(2)}</span>
                                                                </div>

                                                                <div className="hidden md:block space-y-1 text-xs text-gray-500 mt-1">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Calendar size={12} />
                                                                        <span>{formatDate(item.event.date)}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <MapPin size={12} />
                                                                        <span className="line-clamp-1">{item.event.venue}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="hidden md:flex col-span-2 items-center justify-center text-gray-900">
                                                        GH₵{price.toFixed(2)}
                                                    </div>
                                                    <div className="hidden md:flex col-span-2 items-center justify-center text-gray-900">
                                                        {qty}
                                                    </div>
                                                    <div className="hidden md:flex col-span-2 items-center justify-end font-bold text-[var(--brand-primary)]">
                                                        GH₵{(price * qty).toFixed(2)}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">First name*</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={billingInfo.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all outline-none"
                                            placeholder="John"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Last name*</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={billingInfo.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all outline-none"
                                            placeholder="Doe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Email*</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={billingInfo.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all outline-none"
                                            placeholder="yourmail@gmail.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone (optional)</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={billingInfo.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all outline-none"
                                            placeholder="+233 XX XXX XXXX"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">Payment</h2>
                            </div>
                            <div className="p-6">
                                {/* Paystack Info */}
                                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
                                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                        <Shield className="text-white" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-green-800">Secure Payment with Paystack</h3>
                                        <p className="text-sm text-green-700">Pay securely using your card, mobile money, or bank transfer</p>
                                    </div>
                                </div>

                                {/* Accepted Payment Methods */}
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className="text-sm text-gray-500">We accept:</span>
                                    <div className="flex gap-2">
                                        <div className="px-3 py-1.5 bg-gray-100 rounded text-xs font-medium text-gray-700">Visa</div>
                                        <div className="px-3 py-1.5 bg-gray-100 rounded text-xs font-medium text-gray-700">Mastercard</div>
                                        <div className="px-3 py-1.5 bg-gray-100 rounded text-xs font-medium text-gray-700">MTN MoMo</div>
                                        <div className="px-3 py-1.5 bg-gray-100 rounded text-xs font-medium text-gray-700">Vodafone Cash</div>
                                    </div>
                                </div>

                                {/* Pay Button */}
                                <button
                                    onClick={handlePaystackPayment}
                                    disabled={isProcessing || !paystackLoaded}
                                    className="w-full bg-[var(--brand-primary)] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--brand-primary)]/30 flex items-center justify-center gap-2 text-lg uppercase transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="animate-spin" size={24} />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard size={24} />
                                            Pay GH₵{total.toFixed(2)} Now
                                        </>
                                    )}
                                </button>

                                {!paystackLoaded && (
                                    <p className="text-center text-sm text-gray-500 mt-2">
                                        <Loader2 className="inline animate-spin mr-1" size={14} />
                                        Loading payment system...
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">
                            {/* Desktop Timer */}
                            <div className="hidden lg:flex bg-orange-400 text-white p-4 rounded-xl items-center justify-center gap-2 font-bold shadow-md">
                                <Clock size={20} />
                                <span>{formatTime(timeLeft)} left</span>
                            </div>

                            {/* Total Summary */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-gray-600 font-medium">
                                        <span>Subtotal ({itemCount} tickets)</span>
                                        <span>GH₵{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-gray-600 font-medium">
                                        <span>Processing Fee (1.5%)</span>
                                        <span>GH₵{fees.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                        <span className="text-xl font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-[var(--brand-primary)]">GH₵{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg text-sm text-green-800">
                                    <CheckCircle size={16} className="shrink-0 mt-0.5" />
                                    <p>Your transaction is secured with SSL encryption.</p>
                                </div>
                            </div>

                            {/* Refund Policy */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2">Refund Policy</h3>
                                <p className="text-sm text-gray-600">
                                    Tickets are non-refundable. However, you may transfer your ticket to another person up to 24 hours before the event.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
