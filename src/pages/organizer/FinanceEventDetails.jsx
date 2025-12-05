import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    DollarSign,
    TrendingUp,
    Download,
    Search,
    ChevronDown,
    Eye,
    TicketCheck,
    ShoppingCart,
    Users,
    Clock,
    CheckCircle,
    XCircle,
    RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';

const FinanceEventDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock event data
    const event = {
        id: 1,
        name: 'Summer Music Festival 2024',
        date: '2024-06-15',
        status: 'Published',
        totalRevenue: 45380,
        platformFee: 2269,
        netRevenue: 43111,
        ticketsSold: 542,
        totalTickets: 650,
        ordersCount: 234,
        isPaidOut: false,
        payoutStatus: 'Pending'
    };

    // Mock orders data
    const orders = [
        {
            id: 'ORD-001248',
            customer: {
                name: 'John Doe',
                email: 'john.doe@email.com'
            },
            tickets: [
                { name: 'VIP Pass', quantity: 2, price: 150 },
                { name: 'General Admission', quantity: 1, price: 59 }
            ],
            subtotal: 359,
            serviceFee: 17.95,
            platformFee: 10.77,
            total: 376.95,
            netAmount: 348.23,
            status: 'Completed',
            paymentMethod: 'Credit Card',
            orderDate: '2024-05-28T14:32:00'
        },
        {
            id: 'ORD-001247',
            customer: {
                name: 'Sarah Wilson',
                email: 'sarah.w@email.com'
            },
            tickets: [
                { name: 'General Admission', quantity: 4, price: 59 }
            ],
            subtotal: 236,
            serviceFee: 11.80,
            platformFee: 7.08,
            total: 247.80,
            netAmount: 228.92,
            status: 'Completed',
            paymentMethod: 'PayPal',
            orderDate: '2024-05-28T12:15:00'
        },
        {
            id: 'ORD-001246',
            customer: {
                name: 'Mike Johnson',
                email: 'mike.j@email.com'
            },
            tickets: [
                { name: 'Backstage Experience', quantity: 2, price: 300 }
            ],
            subtotal: 600,
            serviceFee: 30.00,
            platformFee: 18.00,
            total: 630.00,
            netAmount: 582.00,
            status: 'Completed',
            paymentMethod: 'Credit Card',
            orderDate: '2024-05-27T18:22:00'
        },
        {
            id: 'ORD-001245',
            customer: {
                name: 'Emily Brown',
                email: 'emily.b@email.com'
            },
            tickets: [
                { name: 'VIP Pass', quantity: 1, price: 150 }
            ],
            subtotal: 150,
            serviceFee: 7.50,
            platformFee: 4.50,
            total: 157.50,
            netAmount: 145.50,
            status: 'Refunded',
            paymentMethod: 'Credit Card',
            orderDate: '2024-05-27T15:08:00'
        },
        {
            id: 'ORD-001244',
            customer: {
                name: 'David Lee',
                email: 'david.lee@email.com'
            },
            tickets: [
                { name: 'General Admission', quantity: 3, price: 59 }
            ],
            subtotal: 177,
            serviceFee: 8.85,
            platformFee: 5.31,
            total: 185.85,
            netAmount: 171.69,
            status: 'Completed',
            paymentMethod: 'Mobile Money',
            orderDate: '2024-05-26T11:30:00'
        },
        {
            id: 'ORD-001243',
            customer: {
                name: 'Lisa Chen',
                email: 'lisa.c@email.com'
            },
            tickets: [
                { name: 'VIP Pass', quantity: 2, price: 150 },
                { name: 'General Admission', quantity: 2, price: 59 }
            ],
            subtotal: 418,
            serviceFee: 20.90,
            platformFee: 12.54,
            total: 438.90,
            netAmount: 405.46,
            status: 'Pending',
            paymentMethod: 'Bank Transfer',
            orderDate: '2024-05-25T09:45:00'
        }
    ];

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Calculate totals
    const totals = {
        subtotal: orders.filter(o => o.status !== 'Refunded').reduce((sum, o) => sum + o.subtotal, 0),
        serviceFees: orders.filter(o => o.status !== 'Refunded').reduce((sum, o) => sum + o.serviceFee, 0),
        platformFees: orders.filter(o => o.status !== 'Refunded').reduce((sum, o) => sum + o.platformFee, 0),
        total: orders.filter(o => o.status !== 'Refunded').reduce((sum, o) => sum + o.total, 0),
        netAmount: orders.filter(o => o.status !== 'Refunded').reduce((sum, o) => sum + o.netAmount, 0),
        refunded: orders.filter(o => o.status === 'Refunded').reduce((sum, o) => sum + o.subtotal, 0)
    };

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'refunded': return 'info';
            case 'cancelled': return 'destructive';
            default: return 'secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return <CheckCircle size={14} />;
            case 'pending': return <Clock size={14} />;
            case 'refunded': return <RefreshCw size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return null;
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-US', {
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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/organizer/finance')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-gray-500">{formatDate(event.date)}</span>
                            <span className="text-gray-300">•</span>
                            <Badge variant={event.isPaidOut ? 'success' : 'warning'}>
                                {event.isPaidOut ? 'Paid Out' : 'Payout Pending'}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download size={18} />
                        Export Report
                    </Button>
                    <Link to={`/organizer/events/${event.id}`}>
                        <Button variant="outline" className="gap-2">
                            <Eye size={18} />
                            View Event
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Revenue Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <DollarSign size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">${event.totalRevenue.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Gross Revenue</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <TrendingUp size={20} className="text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">-${event.platformFee.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Platform Fee (5%)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <DollarSign size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">${event.netRevenue.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Net Revenue</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <ShoppingCart size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{event.ordersCount}</p>
                                <p className="text-xs text-gray-500">Total Orders</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <TicketCheck size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{event.ticketsSold}</p>
                                <p className="text-xs text-gray-500">Tickets Sold</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Financial Breakdown */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8">
                    {/* Orders List */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <CardTitle className="text-lg">Order Breakdown</CardTitle>
                                <div className="flex gap-3">
                                    <div className="relative flex-1 min-w-[200px]">
                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search orders..."
                                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20"
                                        />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="appearance-none bg-white pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="completed">Completed</option>
                                            <option value="pending">Pending</option>
                                            <option value="refunded">Refunded</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-3 px-3 text-xs font-medium text-gray-500">Order ID</th>
                                            <th className="text-left py-3 px-3 text-xs font-medium text-gray-500">Customer</th>
                                            <th className="text-left py-3 px-3 text-xs font-medium text-gray-500">Date</th>
                                            <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">Subtotal</th>
                                            <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">Service Fee</th>
                                            <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">Platform Fee</th>
                                            <th className="text-right py-3 px-3 text-xs font-medium text-gray-500">Net Amount</th>
                                            <th className="text-center py-3 px-3 text-xs font-medium text-gray-500">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-3 px-3">
                                                    <Link
                                                        to={`/organizer/orders/${order.id}`}
                                                        className="font-medium text-(--brand-primary) hover:underline text-sm"
                                                    >
                                                        {order.id}
                                                    </Link>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                                                        <p className="text-xs text-gray-500">{order.customer.email}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3 text-sm text-gray-600">
                                                    {formatDateTime(order.orderDate)}
                                                </td>
                                                <td className="py-3 px-3 text-sm text-gray-900 text-right">
                                                    ${order.subtotal.toFixed(2)}
                                                </td>
                                                <td className="py-3 px-3 text-sm text-gray-600 text-right">
                                                    ${order.serviceFee.toFixed(2)}
                                                </td>
                                                <td className="py-3 px-3 text-sm text-red-600 text-right">
                                                    -${order.platformFee.toFixed(2)}
                                                </td>
                                                <td className="py-3 px-3 text-sm font-semibold text-green-600 text-right">
                                                    {order.status === 'Refunded' ? (
                                                        <span className="text-gray-400 line-through">${order.netAmount.toFixed(2)}</span>
                                                    ) : (
                                                        `$${order.netAmount.toFixed(2)}`
                                                    )}
                                                </td>
                                                <td className="py-3 px-3 text-center">
                                                    <Badge variant={getStatusStyle(order.status)} className="gap-1 text-xs">
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredOrders.length === 0 && (
                                <div className="text-center py-8">
                                    <ShoppingCart size={32} className="mx-auto text-gray-300 mb-2" />
                                    <p className="text-gray-500 text-sm">No orders found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Financial Summary */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Financial Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Gross Sales</span>
                                <span className="font-medium text-gray-900">${totals.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Service Fees (Buyer)</span>
                                <span className="text-gray-600">+${totals.serviceFees.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Collected</span>
                                <span className="font-medium text-gray-900">${totals.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Platform Fee (5%)</span>
                                <span className="text-red-600">-${totals.platformFees.toFixed(2)}</span>
                            </div>
                            {totals.refunded > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Refunds</span>
                                    <span className="text-red-600">-${totals.refunded.toFixed(2)}</span>
                                </div>
                            )}
                            <hr />
                            <div className="flex justify-between text-lg font-semibold">
                                <span className="text-gray-900">Your Earnings</span>
                                <span className="text-green-600">${totals.netAmount.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fee Breakdown Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Fee Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-900">Platform Fee</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    5% of ticket sales is deducted as platform fee. This covers payment processing, hosting, and support.
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-900">Service Fee</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Service fees are charged to buyers and cover transaction costs. This does not affect your earnings.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payout Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Payout Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {event.isPaidOut ? (
                                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <CheckCircle size={24} className="text-green-600" />
                                    <div>
                                        <p className="font-medium text-green-800">Paid Out</p>
                                        <p className="text-sm text-green-600">Funds have been transferred to your account</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                    <Clock size={24} className="text-amber-600" />
                                    <div>
                                        <p className="font-medium text-amber-800">Pending Payout</p>
                                        <p className="text-sm text-amber-600">Request payout from the Finance page</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FinanceEventDetails;
