import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Calendar, MapPin, Ticket, ArrowLeft, CreditCard, AlertTriangle, User, Minus, Plus, Heart, Star, Users, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, clearCart, getCartCount, updateCartItemQuantity } = useCart();
    const { isAuthenticated } = useAuth();

    // Redirect to home if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/signin', { state: { from: '/cart' } });
        }
    }, [isAuthenticated, navigate]);

    const calculateItemTotal = (item) => {
        return Object.entries(item.tickets).reduce((total, [ticketName, qty]) => {
            const ticketType = item.event.ticketTypes?.find(t => t.name === ticketName);
            const price = ticketType?.price || 0;
            return total + (qty * price);
        }, 0);
    };

    const calculateCartTotal = () => {
        return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
    };

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

    const sidebarMenuItems = [
        { path: '/my-tickets', label: 'My Tickets', icon: Ticket, active: false },
        { path: '/cart', label: 'My Cart', icon: ShoppingCart, active: true },
        { path: '/favorites', label: 'My Favorites', icon: Heart, active: false },
        { path: '/reviews', label: 'My Reviews', icon: Star, active: false },
        { path: '/following', label: 'Following', icon: Users, active: false },
        { path: '/account', label: 'Account', icon: Settings, active: false },
    ];

    if (cartItems.length === 0) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar - Hidden on mobile */}
                        <div className="hidden lg:block lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">My Account</h3>
                                <nav className="space-y-1">
                                    {sidebarMenuItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${item.active
                                                    ? 'bg-[var(--brand-primary)] text-white'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <Icon size={20} />
                                                <span className="font-medium">{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>

                        {/* Empty State */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                <ShoppingCart size={80} className="mx-auto text-gray-300 mb-6" />
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                                <p className="text-gray-600 mb-8">
                                    Looks like you haven't added any tickets to your cart yet.
                                </p>
                                <Link
                                    to="/events"
                                    className="inline-flex items-center gap-2 bg-[var(--brand-primary)] text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-opacity"
                                >
                                    <ArrowLeft size={20} />
                                    Browse Events
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Menu - Hidden on mobile */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">My Account</h3>
                            <nav className="space-y-1">
                                {sidebarMenuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${item.active
                                                ? 'bg-[var(--brand-primary)] text-white shadow-sm'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon size={20} />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Header */}
                        <div>
                            <Link
                                to="/events"
                                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-4 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                Continue Shopping
                            </Link>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    Shopping Cart
                                    <span className="text-base sm:text-xl text-gray-500 ml-2 sm:ml-3">
                                        ({getCartCount()} {getCartCount() === 1 ? 'ticket' : 'tickets'})
                                    </span>
                                </h1>
                                {cartItems.length > 0 && (
                                    <button
                                        onClick={clearCart}
                                        className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition-colors w-fit"
                                    >
                                        <Trash2 size={18} />
                                        <span className="hidden sm:inline">Clear Cart</span>
                                        <span className="sm:hidden">Clear</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Warning Banner */}
                        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 flex gap-3">
                            <AlertTriangle size={24} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-amber-900 mb-1">Important Notice</h4>
                                <p className="text-sm text-amber-800">
                                    Your tickets are <strong>not reserved</strong> until checkout. The quantity you intend to buy might not be available if you do not proceed to checkout right away.
                                </p>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    <div className="p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
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
                                                            className="text-lg sm:text-xl font-bold text-gray-900 hover:text-[var(--brand-primary)] transition-colors"
                                                        >
                                                            {item.event.title}
                                                        </Link>
                                                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                                            <User size={14} />
                                                            <span>by {item.event.organizer.name}</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar size={16} className="text-gray-400" />
                                                                <span>{formatDate(item.event.date)} • {item.event.time}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin size={16} className="text-gray-400" />
                                                                <span>{item.event.venue}, {item.event.location}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                                        title="Remove from cart"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>

                                                {/* Ticket Details with Quantity Controls */}
                                                <div className="space-y-2">
                                                    {Object.entries(item.tickets).map(([ticketName, qty]) => {
                                                        const ticketType = item.event.ticketTypes?.find(t => t.name === ticketName);
                                                        const price = ticketType?.price || 0;

                                                        return (
                                                            <div
                                                                key={ticketName}
                                                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 px-3 sm:px-4 bg-gray-50 rounded-lg"
                                                            >
                                                                <div className="flex items-center gap-3 flex-1">
                                                                    <Ticket size={16} className="text-[var(--brand-primary)]" />
                                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 flex-1">
                                                                        <span className="font-medium text-gray-900">{ticketName}</span>
                                                                        <span className="text-sm text-gray-500">${price} each</span>
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
                                                                    <span className="font-semibold text-gray-900 min-w-[80px] text-right">
                                                                        ${price * qty}
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
                                                        ${calculateItemTotal(item)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">${calculateCartTotal()}</span>
                                </div>
                                <div className="flex items-center justify-between text-gray-600">
                                    <span>Service Fee</span>
                                    <span className="font-semibold">$0</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-[var(--brand-primary)]">
                                            ${calculateCartTotal()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-[var(--brand-primary)] text-white font-bold py-4 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-4"
                            >
                                <CreditCard size={20} />
                                Proceed to Checkout
                            </button>

                            <Link
                                to="/events"
                                className="block w-full text-center border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-full hover:bg-gray-50 transition-colors"
                            >
                                Continue Shopping
                            </Link>

                            {/* Info */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <p className="text-xs text-blue-800">
                                    <strong>Secure Checkout</strong><br />
                                    Your payment information is encrypted and secure
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
