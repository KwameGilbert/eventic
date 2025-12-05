import React, { useState } from 'react';
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
    TicketCheck
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';

const Orders = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);
    const [dateFilter, setDateFilter] = useState('all');

    // Stats
    const stats = [
        { label: 'Total Orders', value: '1,248', icon: ShoppingCart, color: '#3b82f6', change: '+12%' },
        { label: 'Total Revenue', value: '$86,420', icon: DollarSign, color: '#22c55e', change: '+8%' },
        { label: 'Completed', value: '1,156', icon: CheckCircle, color: '#8b5cf6', change: '+15%' },
        { label: 'Pending', value: '48', icon: Clock, color: '#f59e0b', change: '-5%' },
    ];

    // Tabs
    const tabs = [
        { id: 'all', label: 'All Orders', count: 1248 },
        { id: 'completed', label: 'Completed', count: 1156 },
        { id: 'pending', label: 'Pending', count: 48 },
        { id: 'cancelled', label: 'Cancelled', count: 32 },
        { id: 'refunded', label: 'Refunded', count: 12 },
    ];

    // Date filters
    const dateFilters = [
        { id: 'all', label: 'All Time' },
        { id: 'today', label: 'Today' },
        { id: 'week', label: 'This Week' },
        { id: 'month', label: 'This Month' },
        { id: 'year', label: 'This Year' },
    ];

    // Mock orders data
    const orders = [
        {
            id: 'ORD-001248',
            customer: {
                name: 'John Doe',
                email: 'john.doe@email.com',
                avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff'
            },
            event: {
                id: 1,
                name: 'Summer Music Festival 2024',
                date: 'Jun 15, 2024'
            },
            tickets: [
                { name: 'VIP Pass', quantity: 2, price: 150 },
                { name: 'General Admission', quantity: 1, price: 59 }
            ],
            totalAmount: 359,
            status: 'Completed',
            paymentMethod: 'Credit Card',
            orderDate: '2024-05-28 14:32',
        },
        {
            id: 'ORD-001247',
            customer: {
                name: 'Sarah Wilson',
                email: 'sarah.w@email.com',
                avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=22c55e&color=fff'
            },
            event: {
                id: 2,
                name: 'Tech Conference 2024',
                date: 'May 20, 2024'
            },
            tickets: [
                { name: 'Full Access', quantity: 1, price: 299 }
            ],
            totalAmount: 299,
            status: 'Completed',
            paymentMethod: 'PayPal',
            orderDate: '2024-05-28 12:15',
        },
        {
            id: 'ORD-001246',
            customer: {
                name: 'Mike Johnson',
                email: 'mike.j@email.com',
                avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff'
            },
            event: {
                id: 3,
                name: 'Art Exhibition Opening',
                date: 'Jul 10, 2024'
            },
            tickets: [
                { name: 'Standard Entry', quantity: 4, price: 25 }
            ],
            totalAmount: 100,
            status: 'Pending',
            paymentMethod: 'Bank Transfer',
            orderDate: '2024-05-28 10:45',
        },
        {
            id: 'ORD-001245',
            customer: {
                name: 'Emily Brown',
                email: 'emily.b@email.com',
                avatar: 'https://ui-avatars.com/api/?name=Emily+Brown&background=8b5cf6&color=fff'
            },
            event: {
                id: 1,
                name: 'Summer Music Festival 2024',
                date: 'Jun 15, 2024'
            },
            tickets: [
                { name: 'Backstage Experience', quantity: 2, price: 300 }
            ],
            totalAmount: 600,
            status: 'Completed',
            paymentMethod: 'Credit Card',
            orderDate: '2024-05-27 18:22',
        },
        {
            id: 'ORD-001244',
            customer: {
                name: 'David Lee',
                email: 'david.lee@email.com',
                avatar: 'https://ui-avatars.com/api/?name=David+Lee&background=ef4444&color=fff'
            },
            event: {
                id: 4,
                name: 'Food & Wine Festival',
                date: 'Aug 5, 2024'
            },
            tickets: [
                { name: 'Tasting Pass', quantity: 2, price: 75 }
            ],
            totalAmount: 150,
            status: 'Cancelled',
            paymentMethod: 'Credit Card',
            orderDate: '2024-05-27 15:08',
        },
        {
            id: 'ORD-001243',
            customer: {
                name: 'Lisa Chen',
                email: 'lisa.c@email.com',
                avatar: 'https://ui-avatars.com/api/?name=Lisa+Chen&background=ec4899&color=fff'
            },
            event: {
                id: 2,
                name: 'Tech Conference 2024',
                date: 'May 20, 2024'
            },
            tickets: [
                { name: 'Workshop Only', quantity: 1, price: 149 }
            ],
            totalAmount: 149,
            status: 'Refunded',
            paymentMethod: 'PayPal',
            orderDate: '2024-05-26 11:30',
        },
    ];

    // Filter orders based on active tab and search
    const filteredOrders = orders.filter(order => {
        const matchesTab = activeTab === 'all' || order.status.toLowerCase() === activeTab;
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.event.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'destructive';
            case 'refunded': return 'info';
            default: return 'secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return <CheckCircle size={14} />;
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
                {stats.map((stat, index) => {
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
                            {filteredOrders.map((order) => (
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
                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                )}

                {/* Pagination */}
                {filteredOrders.length > 0 && (
                    <div className="flex items-center justify-between p-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Showing {filteredOrders.length} of {orders.length} orders
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
        </div>
    );
};

export default Orders;
