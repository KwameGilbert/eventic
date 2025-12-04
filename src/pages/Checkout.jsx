import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Clock, CreditCard, Building, MapPin, Calendar, User, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const { addTickets } = useTickets();
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
    const [paymentMethod, setPaymentMethod] = useState('paypal');

    // Redirect if cart is empty or not authenticated
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/signin', { state: { from: '/checkout' } });
        } else if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [isAuthenticated, cartItems, navigate]);

    // Timer countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    // Handle timeout (e.g., release tickets)
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const subtotal = getCartTotal();
    const fees = 3; // Hardcoded fee from design
    const total = subtotal + fees;

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

    const handlePayment = () => {
        // Process payment (mock)
        // Create ticket objects from cart items
        const newTickets = cartItems.flatMap(item => {
            return Object.entries(item.tickets).map(([ticketName, qty]) => {
                if (qty === 0) return null;
                const ticketType = item.event.ticketTypes?.find(t => t.name === ticketName);

                // Create individual tickets based on quantity
                return Array(qty).fill().map(() => ({
                    id: Math.random().toString(36).substr(2, 9),
                    eventId: item.event.id,
                    event: item.event,
                    ticketName: ticketName,
                    price: ticketType?.price || 0,
                    purchaseDate: new Date().toISOString(),
                    status: 'valid',
                    qrCode: Math.random().toString(36).substr(2, 9) // Mock QR code
                }));
            }).filter(Boolean).flat();
        });

        addTickets(newTickets);
        clearCart();
        navigate('/my-tickets');
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
                            <Link to="/" className="hover:text-(--brand-primary) flex items-center gap-1">
                                <Home size={16} />
                            </Link>
                            <ChevronRight size={16} />
                            <span>Dashboard</span>
                            <ChevronRight size={16} />
                            <Link to="/cart" className="hover:text-(--brand-primary)">My cart</Link>
                            <ChevronRight size={16} />
                            <span className="text-gray-900 font-medium">Checkout</span>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Summary */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-900">Order summary</h2>
                                <span className="text-sm text-gray-500">{cartItems.length} items</span>
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
                                                                <p className="text-sm text-(--brand-primary) font-medium mb-2">{ticketName}</p>

                                                                {/* Mobile Price/Qty Row */}
                                                                <div className="flex md:hidden items-center justify-between mt-2 bg-gray-50 p-2 rounded-lg">
                                                                    <span className="text-sm text-gray-600">${price} × {qty}</span>
                                                                    <span className="font-bold text-gray-900">${price * qty}</span>
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
                                                    <div className="hidden md:block col-span-2 text-center py-2 text-gray-900">
                                                        ${price}
                                                    </div>
                                                    <div className="hidden md:block col-span-2 text-center py-2 text-gray-900">
                                                        {qty}
                                                    </div>
                                                    <div className="hidden md:block col-span-2 text-right py-2 font-bold text-(--brand-primary)">
                                                        ${price * qty}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Billing Information */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">Billing information</h2>
                            </div>
                            <div className="p-6">
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">First name*</label>
                                        <input
                                            type="text"
                                            defaultValue={user?.firstName || ''}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-(--brand-primary) focus:ring-2 focus:ring-(--brand-primary)/20 transition-all outline-none"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Last name*</label>
                                        <input
                                            type="text"
                                            defaultValue={user?.lastName || ''}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-(--brand-primary) focus:ring-2 focus:ring-(--brand-primary)/20 transition-all outline-none"
                                            placeholder="Doe"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Email*</label>
                                        <input
                                            type="email"
                                            defaultValue={user?.email || ''}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-(--brand-primary) focus:ring-2 focus:ring-(--brand-primary)/20 transition-all outline-none"
                                            placeholder="yourmail@gmail.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Country*</label>
                                        <select className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-(--brand-primary) focus:ring-2 focus:ring-(--brand-primary)/20 transition-all outline-none">
                                            <option>United States</option>
                                            <option>United Kingdom</option>
                                            <option>Ghana</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">State*</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-(--brand-primary) focus:ring-2 focus:ring-(--brand-primary)/20 transition-all outline-none"
                                            placeholder="State"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">City*</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-(--brand-primary) focus:ring-2 focus:ring-(--brand-primary)/20 transition-all outline-none"
                                            placeholder="City"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Postal code*</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-(--brand-primary) focus:ring-2 focus:ring-(--brand-primary)/20 transition-all outline-none"
                                            placeholder="Postal code"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Street*</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-(--brand-primary) focus:ring-2 focus:ring-(--brand-primary)/20 transition-all outline-none"
                                            placeholder="Street address"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Street 2</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-(--brand-primary) focus:ring-2 focus:ring-(--brand-primary)/20 transition-all outline-none"
                                            placeholder="Apartment, suite, etc."
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">Payment method</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { id: 'paypal', label: 'Paypal Express Checkout' },
                                        { id: 'stripe', label: 'Stripe Checkout' },
                                        { id: 'mercadopago', label: 'Mercado Pago' },
                                        { id: 'flutterwave', label: 'Flutterwave' },
                                        { id: 'bank', label: 'Bank Transfer' }
                                    ].map((method) => (
                                        <label
                                            key={method.id}
                                            className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === method.id
                                                ? 'border-(--brand-primary) bg-blue-50 ring-1 ring-(--brand-primary)'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value={method.id}
                                                    checked={paymentMethod === method.id}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-(--brand-primary) checked:border-4 transition-all"
                                                />
                                            </div>
                                            <span className={`font-bold ${paymentMethod === method.id ? 'text-(--brand-primary)' : 'text-gray-700'}`}>
                                                {method.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            className="w-full bg-(--brand-primary) text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-(--brand-primary)/30 flex items-center justify-center gap-2 text-lg uppercase transform hover:-translate-y-0.5"
                        >
                            <CreditCard size={24} />
                            Pay Now
                        </button>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">
                            {/* Desktop Timer */}
                            <div className="hidden lg:flex bg-orange-400 text-white p-4 rounded-xl items-center justify-center gap-2 font-bold shadow-md">
                                <Clock size={20} />
                                <span>{formatTime(timeLeft)} left before tickets are released</span>
                            </div>

                            {/* Total Summary */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-gray-600 font-medium">
                                        <span>Tickets ({cartItems.length})</span>
                                        <span>${subtotal}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-gray-600 font-medium">
                                        <span>Fees</span>
                                        <span>${fees}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                        <span className="text-xl font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-(--brand-primary)">${total}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 justify-center opacity-60 grayscale hover:grayscale-0 transition-all">
                                    {/* Placeholder icons for payment methods */}
                                    <div className="h-8 w-12 bg-blue-600 rounded"></div>
                                    <div className="h-8 w-12 bg-blue-800 rounded"></div>
                                    <div className="h-8 w-12 bg-red-600 rounded"></div>
                                    <div className="h-8 w-12 bg-orange-500 rounded"></div>
                                </div>

                                <div className="mt-6 flex items-start gap-3 p-3 bg-green-50 rounded-lg text-sm text-green-800">
                                    <CheckCircle size={16} className="shrink-0 mt-0.5" />
                                    <p>Your transaction is secured with SSL encryption.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
