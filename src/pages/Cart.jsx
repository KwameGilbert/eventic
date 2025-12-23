import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Calendar, MapPin, Ticket, ArrowLeft, CreditCard, AlertTriangle, Minus, Plus, Shield, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, clearCart, getCartCount, updateCartItemQuantity, getCartTotal } = useCart();

    const calculateItemTotal = (item) => {
        return Object.entries(item.tickets).reduce((total, [ticketName, qty]) => {
            const ticketType = item.event.ticketTypes?.find(t => t.name === ticketName);
            const price = ticketType?.price || 0;
            return total + (qty * price);
        }, 0);
    };

    const subtotal = getCartTotal();
    const fees = Math.round(subtotal * 0.015 * 100) / 100; // 1.5% fee
    const total = subtotal + fees;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleQuantityChange = (itemId, ticketName, change) => {
        const item = cartItems.find(i => i.id === itemId);
        const currentQty = item.tickets[ticketName];
        const newQty = Math.max(0, currentQty + change);

        // Get max allowed from ticket type
        const ticketType = item.event.ticketTypes?.find(t => t.name === ticketName);
        const maxAllowed = ticketType?.maxPerAttendee || 10;

        updateCartItemQuantity(itemId, ticketName, Math.min(newQty, maxAllowed));
    };

    // Empty Cart State
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 pb-12">
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <ShoppingCart size={80} className="mx-auto text-gray-300 mb-6" />
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Looks like you haven't added any tickets to your cart yet. Browse our events to find something you'll love!
                        </p>
                        <Link
                            to="/events"
                            className="inline-flex items-center gap-2 bg-[var(--brand-primary)] text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-opacity"
                        >
                            <ArrowLeft size={20} />
                            Browse Ticketing Events
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Shopping Cart
                            <span className="text-base text-gray-500 ml-3">
                                ({getCartCount()} {getCartCount() === 1 ? 'ticket' : 'tickets'})
                            </span>
                        </h1>
                        <button
                            onClick={clearCart}
                            className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition-colors"
                        >
                            <Trash2 size={18} />
                            <span className="hidden sm:inline">Clear Cart</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Back Link */}
                        <Link
                            to="/events"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Continue Shopping
                        </Link>

                        {/* Warning Banner */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                            <AlertTriangle size={24} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-amber-900 mb-1">Tickets are not reserved</h4>
                                <p className="text-sm text-amber-800">
                                    Complete your checkout soon! The tickets you want might not be available if you don't proceed quickly.
                                </p>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                                    <div className="p-6">
                                        <div className="flex flex-col sm:flex-row gap-6">
                                            {/* Event Image */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={item.event.image}
                                                    alt={item.event.title}
                                                    className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg"
                                                />
                                            </div>

                                            {/* Event Details */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <Link
                                                            to={`/event/${item.event.eventSlug}`}
                                                            className="text-xl font-bold text-gray-900 hover:text-[var(--brand-primary)] transition-colors"
                                                        >
                                                            {item.event.title}
                                                        </Link>
                                                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar size={16} className="text-gray-400" />
                                                                <span>{formatDate(item.event.date)} • {item.event.time}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin size={16} className="text-gray-400" />
                                                                <span>{item.event.venue}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                                        title="Remove from cart"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>

                                                {/* Ticket Details */}
                                                <div className="space-y-2">
                                                    {Object.entries(item.tickets).map(([ticketName, qty]) => {
                                                        const ticketType = item.event.ticketTypes?.find(t => t.name === ticketName);
                                                        const price = ticketType?.price || 0;

                                                        return (
                                                            <div
                                                                key={ticketName}
                                                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 px-4 bg-gray-50 rounded-lg"
                                                            >
                                                                <div className="flex items-center gap-3 flex-1">
                                                                    <Ticket size={16} className="text-[var(--brand-primary)]" />
                                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 flex-1">
                                                                        <span className="font-medium text-gray-900">{ticketName}</span>
                                                                        <span className="text-sm text-gray-500">GH₵{price} each</span>
                                                                    </div>
                                                                </div>

                                                                {/* Quantity Controls */}
                                                                <div className="flex items-center justify-between sm:justify-end gap-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            onClick={() => handleQuantityChange(item.id, ticketName, -1)}
                                                                            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
                                                                        >
                                                                            <Minus size={14} />
                                                                        </button>
                                                                        <span className="w-10 text-center font-bold text-gray-900">
                                                                            {qty}
                                                                        </span>
                                                                        <button
                                                                            onClick={() => handleQuantityChange(item.id, ticketName, 1)}
                                                                            className="w-8 h-8 rounded-full border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] flex items-center justify-center hover:bg-[var(--brand-primary)] hover:text-white transition-all"
                                                                        >
                                                                            <Plus size={14} />
                                                                        </button>
                                                                    </div>
                                                                    <span className="font-bold text-gray-900 min-w-[100px] text-right">
                                                                        GH₵{(price * qty).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Item Total */}
                                                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                                                    <span className="text-gray-600 font-medium">Item Total:</span>
                                                    <span className="text-xl font-bold text-[var(--brand-primary)]">
                                                        GH₵{calculateItemTotal(item).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-6">
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">GH₵{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-gray-600">
                                        <span>Processing Fee (1.5%)</span>
                                        <span className="font-semibold">GH₵{fees.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold text-[var(--brand-primary)]">
                                                GH₵{total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-[var(--brand-primary)] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[var(--brand-primary)]/30 flex items-center justify-center gap-2 mb-4"
                                >
                                    <CreditCard size={20} />
                                    Proceed to Checkout
                                </button>

                                <Link
                                    to="/events"
                                    className="block w-full text-center border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Continue Shopping
                                </Link>

                                {/* Security Info */}
                                <div className="mt-6 flex items-start gap-3 p-3 bg-green-50 rounded-lg text-sm text-green-800">
                                    <CheckCircle size={16} className="shrink-0 mt-0.5" />
                                    <p>Secure checkout with Paystack. Your payment is protected.</p>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <Shield size={20} className="text-green-600" />
                                    <span className="font-semibold text-gray-900">Secure Payment</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    We accept the following payment methods:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <div className="px-3 py-1.5 bg-gray-100 rounded text-xs font-medium text-gray-700">Visa</div>
                                    <div className="px-3 py-1.5 bg-gray-100 rounded text-xs font-medium text-gray-700">Mastercard</div>
                                    <div className="px-3 py-1.5 bg-gray-100 rounded text-xs font-medium text-gray-700">Mobile Money</div>
                                    <div className="px-3 py-1.5 bg-gray-100 rounded text-xs font-medium text-gray-700">Bank Transfer</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
