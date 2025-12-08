import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    Download,
    Mail,
    Calendar,
    DollarSign,
    ShoppingCart,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronDown,
    RefreshCw,
    TicketCheck,
    Loader2
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import organizerService from '../../services/organizerService';

const Orders = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);
    const [dateFilter, setDateFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, perPage: 20, total: 0 });

    // Fetch orders from API
    useEffect(() => {
        fetchOrders();
    }, [activeTab, searchQuery]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const params = {
                status: activeTab === 'all' ? undefined : activeTab,
                search: searchQuery || undefined,
                page: pagination.page,
                per_page: pagination.perPage,
            };

            const response = await organizerService.getOrders(params);

            if (response.success) {
                setOrders(response.data.orders || []);
                setStats(response.data.stats || {});
                setPagination(response.data.pagination || { page: 1, perPage: 20, total: 0 });
            } else {
                setError(response.message || 'Failed to load orders');
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('An error occurred while loading orders');
        } finally {
            setIsLoading(false);
        }
    };

    // Format stats for display
    const statsDisplay = stats ? [
        { label: 'Total Orders', value: stats.totalOrders?.toString() || '0', icon: ShoppingCart, color: '#3b82f6', change: '+12%' },
        { label: 'Total Revenue', value: `GH₵${(stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: '#22c55e', change: '+8%' },
        { label: 'Completed', value: stats.completed?.toString() || '0', icon: CheckCircle, color: '#8b5cf6', change: '+15%' },
        { label: 'Pending', value: stats.pending?.toString() || '0', icon: Clock, color: '#f59e0b', change: '-5%' },
    ] : [];

    // Tabs
    const tabs = stats ? [
        { id: 'all', label: 'All Orders', count: stats.totalOrders || 0 },
        { id: 'paid', label: 'Completed', count: stats.completed || 0 },
        { id: 'pending', label: 'Pending', count: stats.pending || 0 },
        { id: 'cancelled', label: 'Cancelled', count: stats.cancelled || 0 },
        { id: 'refunded', label: 'Refunded', count: stats.refunded || 0 },
    ] : [];


    // Date filters
    const dateFilters = [
        { id: 'all', label: 'All Time' },
        { id: 'today', label: 'Today' },
        { id: 'week', label: 'This Week' },
        { id: 'month', label: 'This Month' },
        { id: 'year', label: 'This Year' },
    ];

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'paid': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'destructive';
            case 'refunded': return 'info';
            default: return 'secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'paid': return <CheckCircle size={14} />;
            case 'pending': return <Clock size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            case 'refunded': return <RefreshCw size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    const toggleDropdown = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Loading state
    if (isLoading && !orders.length) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-(--brand-primary) mx-auto mb-4" />
                    <p className="text-gray-500">Loading orders...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <Button onClick={fetchOrders}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-500 mt-1">Manage and track all your ticket orders</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download size={18} />
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statsDisplay.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                        <p className={cn(
                                            "text-xs mt-1",
                                            stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                        )}>
                                            {stat.change} from last month
                                        </p>
                                    </div>
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${stat.color}15` }}
                                    >
                                        <Icon size={24} style={{ color: stat.color }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search orders by ID, customer, or event..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                    />
                </div>

                {/* Date Filter */}
                <div className="relative">
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="appearance-none bg-white pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                    >
                        {dateFilters.map((filter) => (
                            <option key={filter.id} value={filter.id}>{filter.label}</option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-6 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 pb-3 border-b-2 whitespace-nowrap transition-colors",
                                activeTab === tab.id
                                    ? "border-(--brand-primary) text-(--brand-primary)"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {tab.label}
                            <span className={cn(
                                "px-2 py-0.5 text-xs rounded-full",
                                activeTab === tab.id
                                    ? "bg-(--brand-primary) text-white"
                                    : "bg-gray-100 text-gray-600"
                            )}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Order ID</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Customer</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Event</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Tickets</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Amount</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Status</th>
                                <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date</th>
                                <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    {/* Order ID */}
                                    <td className="py-4 px-4">
                                        <Link
                                            to={`/organizer/orders/${order.id}`}
                                            className="font-medium text-(--brand-primary) hover:underline"
                                        >
                                            {order.id}
                                        </Link>
                                    </td>

                                    {/* Customer */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={order.customer.avatar}
                                                alt={order.customer.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{order.customer.name}</p>
                                                <p className="text-xs text-gray-500">{order.customer.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Event */}
                                    <td className="py-4 px-4">
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm truncate max-w-[200px]" title={order.event.name}>
                                                {order.event.name}
                                            </p>
                                            <p className="text-xs text-gray-500">{order.event.date}</p>
                                        </div>
                                    </td>

                                    {/* Tickets */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <TicketCheck size={14} className="text-gray-400" />
                                            <span className="text-sm text-gray-600">
                                                {order.tickets.reduce((sum, t) => sum + t.quantity, 0)} tickets
                                            </span>
                                        </div>
                                    </td>

                                    {/* Amount */}
                                    <td className="py-4 px-4">
                                        <span className="font-semibold text-gray-900">
                                            ${order.totalAmount.toLocaleString()}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="py-4 px-4">
                                        <Badge variant={getStatusStyle(order.status)} className="gap-1">
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </Badge>
                                    </td>

                                    {/* Date */}
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-gray-600 whitespace-nowrap">
                                            {formatDate(order.orderDate)}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-end">
                                            <div className="relative">
                                                <button
                                                    onClick={() => toggleDropdown(order.id)}
                                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
                                                {openDropdown === order.id && (
                                                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                                                        <Link
                                                            to={`/organizer/orders/${order.id}`}
                                                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            <Eye size={14} />
                                                            View Details
                                                        </Link>
                                                        <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                            <Download size={14} />
                                                            Download Invoice
                                                        </button>
                                                        <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                            <Mail size={14} />
                                                            Resend Confirmation
                                                        </button>
                                                        {order.status === 'Completed' && (
                                                            <>
                                                                <hr className="my-1" />
                                                                <button className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                                    <RefreshCw size={14} />
                                                                    Process Refund
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {orders.length === 0 && (
                    <div className="text-center py-12">
                        <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                )}

                {/* Pagination */}
                {orders.length > 0 && (
                    <div className="flex items-center justify-between p-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Showing {orders.length} of {pagination.total} orders
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled>
                                Previous
                            </Button>
                            <Button variant="outline" size="sm">
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div >
    );
};

export default Orders;
