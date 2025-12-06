import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ChevronRight, ShoppingBag, Calendar, CreditCard, Clock, Eye, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { orders, isLoading, error, refreshOrders } = useTickets();
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/signin', { state: { from: '/my-orders' } });
        }
    }, [isAuthenticated, navigate]);

    const formatDate = (dateString) => {
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

    const formatCurrency = (amount) => {
        return `GH₵${parseFloat(amount || 0).toFixed(2)}`;
    };

    const getStatusBadge = (status) => {
        const styles = {
            paid: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            failed: 'bg-red-100 text-red-700',
            cancelled: 'bg-gray-100 text-gray-700',
            refunded: 'bg-purple-100 text-purple-700',
        };
        return styles[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusLabel = (status) => {
        const labels = {
            paid: 'Paid',
            pending: 'Pending',
            failed: 'Failed',
            cancelled: 'Cancelled',
            refunded: 'Refunded',
        };
        return labels[status] || status;
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.status === filter);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your orders...</p>
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
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                            <p className="text-gray-500 mt-1">View and track all your ticket purchases</p>
                        </div>
                        <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                            <Link to="/" className="hover:text-orange-500 flex items-center gap-1">
                                <Home size={16} />
                            </Link>
                            <ChevronRight size={16} />
                            <span className="text-gray-900 font-medium">My Orders</span>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="text-red-500" size={20} />
                        <span className="text-red-700">{error}</span>
                        <button
                            onClick={refreshOrders}
                            className="ml-auto text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                        >
                            <RefreshCw size={16} />
                            Retry
                        </button>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
                    {['all', 'paid', 'pending', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${filter === status
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {status === 'all' ? 'All Orders' : getStatusLabel(status)}
                            {status !== 'all' && (
                                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                    {orders.filter(o => o.status === status).length}
                                </span>
                            )}
                        </button>
                    ))}
                    <button
                        onClick={refreshOrders}
                        className="ml-auto p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Refresh orders"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={40} className="text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
                        </h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            {filter === 'all'
                                ? "You haven't made any purchases yet. Browse our events and find something you love!"
                                : `You don't have any ${filter} orders.`
                            }
                        </p>
                        <Link
                            to="/events"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30"
                        >
                            Browse Events
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        {/* Order Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-lg font-bold text-gray-900">
                                                    Order #{order.id}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} />
                                                    <span>{formatDate(order.created_at)}</span>
                                                </div>
                                                {order.payment_reference && (
                                                    <div className="flex items-center gap-1.5">
                                                        <CreditCard size={14} />
                                                        <span className="font-mono text-xs">{order.payment_reference}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} />
                                                    <span>{order.ticket_count || order.items?.length || 0} ticket(s)</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Amount & Actions */}
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Total Amount</p>
                                                <p className="text-xl font-bold text-gray-900">
                                                    {formatCurrency(order.total_amount)}
                                                </p>
                                            </div>
                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 font-medium transition-colors"
                                            >
                                                <Eye size={18} />
                                                <span>View Details</span>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Order Items Preview */}
                                    {order.items && order.items.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex flex-wrap gap-2">
                                                {order.items.slice(0, 3).map((item, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                                                    >
                                                        <span className="font-medium">{item.quantity}x</span>
                                                        <span className="text-gray-600">
                                                            {item.ticket_type?.name || item.ticketType?.name || 'Ticket'}
                                                        </span>
                                                    </span>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <span className="text-sm text-gray-500 px-2 py-1">
                                                        +{order.items.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
