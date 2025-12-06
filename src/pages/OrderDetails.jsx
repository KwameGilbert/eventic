import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Home, ChevronRight, ArrowLeft, Calendar, CreditCard, MapPin, Clock, Ticket, Download, Share2, AlertCircle, CheckCircle, XCircle, Package } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import PageLoader from '../components/ui/PageLoader';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { getOrder } = useTickets();

    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/signin', { state: { from: `/orders/${id}` } });
            return;
        }

        const fetchOrder = async () => {
            setIsLoading(true);
            try {
                const data = await getOrder(id);
                setOrder(data);
            } catch (err) {
                console.error('Failed to fetch order:', err);
                setError('Failed to load order details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [id, isAuthenticated, navigate, getOrder]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount) => {
        return `GH₵${parseFloat(amount || 0).toFixed(2)}`;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid': return <CheckCircle className="text-green-500" size={24} />;
            case 'pending': return <Clock className="text-yellow-500" size={24} />;
            case 'failed': return <XCircle className="text-red-500" size={24} />;
            case 'cancelled': return <XCircle className="text-gray-500" size={24} />;
            default: return <Package className="text-gray-500" size={24} />;
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            paid: 'bg-green-100 text-green-700 border-green-200',
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            failed: 'bg-red-100 text-red-700 border-red-200',
            cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
            refunded: 'bg-purple-100 text-purple-700 border-purple-200',
        };
        return styles[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    // Get ticket status badge based on ticket.status (active, used, cancelled)
    const getTicketStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return {
                    icon: '✓',
                    text: 'Valid',
                    className: 'text-green-600'
                };
            case 'used':
                return {
                    icon: '✗',
                    text: 'Used',
                    className: 'text-blue-600'
                };
            case 'cancelled':
                return {
                    icon: '✗',
                    text: 'Cancelled',
                    className: 'text-red-600'
                };
            default:
                return {
                    icon: '?',
                    text: status || 'Unknown',
                    className: 'text-gray-600'
                };
        }
    };

    if (isLoading) {
        return <PageLoader message="Loading order details..." />;
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                    <p className="text-gray-500 mb-6">{error || "The order you're looking for doesn't exist."}</p>
                    <Link
                        to="/my-orders"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/my-orders')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                                <p className="text-gray-500 mt-1">Placed on {formatDateTime(order.created_at)}</p>
                            </div>
                        </div>
                        <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                            <Link to="/" className="hover:text-orange-500 flex items-center gap-1">
                                <Home size={16} />
                            </Link>
                            <ChevronRight size={16} />
                            <Link to="/my-orders" className="hover:text-orange-500">My Orders</Link>
                            <ChevronRight size={16} />
                            <span className="text-gray-900 font-medium">Order #{order.id}</span>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-4">
                                {getStatusIcon(order.status)}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {order.status === 'paid' ? 'Payment Successful' :
                                            order.status === 'pending' ? 'Payment Pending' :
                                                order.status === 'failed' ? 'Payment Failed' :
                                                    order.status === 'cancelled' ? 'Order Cancelled' :
                                                        'Order Status'}
                                    </h3>
                                    <p className="text-gray-500">
                                        {order.status === 'paid'
                                            ? `Paid on ${formatDateTime(order.paid_at || order.updated_at)}`
                                            : `Last updated ${formatDateTime(order.updated_at)}`
                                        }
                                    </p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusBadge(order.status)}`}>
                                    {order.status?.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Order Items</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="p-6 flex items-center gap-4">
                                        <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                                            <Ticket className="text-orange-500" size={28} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900">
                                                {item.ticket_type?.name || item.ticketType?.name || 'Ticket'}
                                            </h4>
                                            <p className="text-sm text-gray-500 truncate">
                                                {item.ticket_type?.event?.title || item.ticketType?.event?.title || 'Event'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                {formatCurrency(item.unit_price)} × {item.quantity}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatCurrency(item.total_price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tickets (if paid) */}
                        {order.status === 'paid' && order.tickets && order.tickets.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-gray-900">Your Tickets</h3>
                                    <Link
                                        to="/my-tickets"
                                        className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                                    >
                                        View All Tickets →
                                    </Link>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {order.tickets.map((ticket, idx) => (
                                        <div key={idx} className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-24 h-24 bg-white p-2 rounded-lg border border-gray-200 shrink-0">
                                                    <img
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.qr_code || ticket.id}`}
                                                        alt="Ticket QR Code"
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                                            #{ticket.id}
                                                        </span>
                                                        {(() => {
                                                            const ticketStatus = getTicketStatusBadge(ticket.status);
                                                            return (
                                                                <span className={`text-sm font-medium ${ticketStatus.className}`}>
                                                                    {ticketStatus.icon} {ticketStatus.text}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>
                                                    <h4 className="font-semibold text-gray-900">
                                                        {ticket.ticket_type?.name || ticket.ticketType?.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {ticket.event?.title || ticket.ticketType?.event?.title}
                                                    </p>
                                                    {ticket.event && (
                                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar size={14} />
                                                                {formatDate(ticket.event.start_time)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <MapPin size={14} />
                                                                {ticket.event.venue_name}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Service Fee</span>
                                    <span className="text-gray-900">{formatCurrency(order.fees)}</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-xl text-gray-900">
                                        {formatCurrency(order.total_amount)}
                                    </span>
                                </div>
                            </div>

                            {/* Payment Info */}
                            {order.payment_reference && (
                                <div className="px-6 pb-6">
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Payment Method</span>
                                            <span className="text-gray-900">Paystack</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Reference</span>
                                            <span className="font-mono text-xs text-gray-900">{order.payment_reference}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Customer Info */}
                            <div className="px-6 pb-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Customer Details</h4>
                                <div className="space-y-2 text-sm">
                                    {order.customer_name && (
                                        <p className="text-gray-600">{order.customer_name}</p>
                                    )}
                                    {order.customer_email && (
                                        <p className="text-gray-600">{order.customer_email}</p>
                                    )}
                                    {order.customer_phone && (
                                        <p className="text-gray-600">{order.customer_phone}</p>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-6 pb-6">
                                <Link
                                    to="/my-orders"
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <ArrowLeft size={18} />
                                    Back to Orders
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
