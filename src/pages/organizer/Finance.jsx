import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    Calendar,
    ChevronRight,
    Download,
    Plus,
    Search,
    Filter,
    X,
    CreditCard,
    Smartphone,
    Building2,
    AlertCircle,
    ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';

const Finance = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('mobile_money');
    const [paymentDetails, setPaymentDetails] = useState({
        mobileNetwork: '',
        mobileNumber: '',
        bankName: '',
        accountName: '',
        accountNumber: '',
        swiftCode: ''
    });

    // Stats
    const stats = {
        totalRevenue: 125840,
        availableBalance: 45380,
        pendingPayouts: 12500,
        completedPayouts: 67960,
        platformFees: 6292
    };

    // Events with revenue
    const events = [
        {
            id: 1,
            name: 'Summer Music Festival 2024',
            date: '2024-06-15',
            status: 'Published',
            totalRevenue: 45380,
            platformFee: 2269,
            netRevenue: 43111,
            ticketsSold: 542,
            orders: 234,
            isPaidOut: false
        },
        {
            id: 2,
            name: 'Tech Conference 2024',
            date: '2024-05-20',
            status: 'Completed',
            totalRevenue: 40050,
            platformFee: 2002.50,
            netRevenue: 38047.50,
            ticketsSold: 267,
            orders: 189,
            isPaidOut: true
        },
        {
            id: 3,
            name: 'Art Exhibition Opening',
            date: '2024-07-10',
            status: 'Published',
            totalRevenue: 12500,
            platformFee: 625,
            netRevenue: 11875,
            ticketsSold: 156,
            orders: 98,
            isPaidOut: false
        },
        {
            id: 4,
            name: 'Food & Wine Festival',
            date: '2024-04-15',
            status: 'Completed',
            totalRevenue: 27910,
            platformFee: 1395.50,
            netRevenue: 26514.50,
            ticketsSold: 312,
            orders: 145,
            isPaidOut: true
        },
    ];

    // Payout history
    const payouts = [
        {
            id: 'PAY-001',
            date: '2024-05-25',
            amount: 38047.50,
            method: 'Bank Transfer',
            accountEnding: '4521',
            status: 'Completed',
            events: ['Tech Conference 2024']
        },
        {
            id: 'PAY-002',
            date: '2024-04-20',
            amount: 26514.50,
            method: 'Mobile Money',
            accountEnding: '7890',
            status: 'Completed',
            events: ['Food & Wine Festival']
        },
        {
            id: 'PAY-003',
            date: '2024-03-15',
            amount: 15000,
            method: 'Bank Transfer',
            accountEnding: '4521',
            status: 'Completed',
            events: ['Winter Gala 2024']
        },
    ];

    // Mobile networks
    const mobileNetworks = [
        'MTN Mobile Money',
        'Vodafone Cash',
        'AirtelTigo Money'
    ];

    // Banks
    const banks = [
        'Ghana Commercial Bank',
        'Ecobank Ghana',
        'Stanbic Bank',
        'Zenith Bank',
        'Fidelity Bank',
        'Access Bank',
        'Standard Chartered',
        'Absa Bank'
    ];

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'events', label: 'Event Revenue' },
        { id: 'payouts', label: 'Payout History' },
    ];

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'failed': return 'destructive';
            default: return 'secondary';
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleEventSelect = (eventId) => {
        setSelectedEvents(prev =>
            prev.includes(eventId)
                ? prev.filter(id => id !== eventId)
                : [...prev, eventId]
        );
    };

    const getSelectedTotal = () => {
        return events
            .filter(e => selectedEvents.includes(e.id) && !e.isPaidOut)
            .reduce((sum, e) => sum + e.netRevenue, 0);
    };

    const handlePayoutSubmit = () => {
        setShowPayoutModal(false);
        setSelectedEvents([]);
    };

    const availableForPayout = events.filter(e => !e.isPaidOut);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
                    <p className="text-gray-500 mt-1">Track your revenue and manage payouts</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download size={18} />
                        Export Report
                    </Button>
                    <Button
                        className="gap-2"
                        onClick={() => setShowPayoutModal(true)}
                        disabled={availableForPayout.length === 0}
                    >
                        <Plus size={18} />
                        Request Payout
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <DollarSign size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Total Revenue</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <TrendingUp size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">${stats.availableBalance.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Available Balance</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Clock size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">${stats.pendingPayouts.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Pending Payouts</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <CheckCircle size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">${stats.completedPayouts.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Paid Out</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <CreditCard size={20} className="text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">${stats.platformFees.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Platform Fees</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-6 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "pb-3 border-b-2 whitespace-nowrap transition-colors",
                                activeTab === tab.id
                                    ? "border-(--brand-primary) text-(--brand-primary)"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-12 gap-6">
                    {/* Recent Events Revenue */}
                    <div className="col-span-12 lg:col-span-8">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Event Revenue</CardTitle>
                                    <button
                                        onClick={() => setActiveTab('events')}
                                        className="text-sm text-(--brand-primary) hover:underline"
                                    >
                                        View All
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {events.slice(0, 4).map((event) => (
                                        <Link
                                            key={event.id}
                                            to={`/organizer/finance/events/${event.id}`}
                                            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-gray-900">{event.name}</h4>
                                                    {event.isPaidOut ? (
                                                        <Badge variant="success" className="text-xs">Paid</Badge>
                                                    ) : (
                                                        <Badge variant="warning" className="text-xs">Pending</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {formatDate(event.date)} • {event.orders} orders
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">${event.netRevenue.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">Net revenue</p>
                                            </div>
                                            <ChevronRight size={20} className="text-gray-400 ml-4" />
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Payouts */}
                    <div className="col-span-12 lg:col-span-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Recent Payouts</CardTitle>
                                    <button
                                        onClick={() => setActiveTab('payouts')}
                                        className="text-sm text-(--brand-primary) hover:underline"
                                    >
                                        View All
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {payouts.slice(0, 3).map((payout) => (
                                        <div key={payout.id} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                <CheckCircle size={18} className="text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">${payout.amount.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">{formatDate(payout.date)}</p>
                                            </div>
                                            <Badge variant="success">{payout.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Event</th>
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date</th>
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Orders</th>
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Gross Revenue</th>
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Platform Fee</th>
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Net Revenue</th>
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Status</th>
                                        <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event) => (
                                        <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-4">
                                                <Link
                                                    to={`/organizer/finance/events/${event.id}`}
                                                    className="font-medium text-gray-900 hover:text-(--brand-primary)"
                                                >
                                                    {event.name}
                                                </Link>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {formatDate(event.date)}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {event.orders}
                                            </td>
                                            <td className="py-4 px-4 font-medium text-gray-900">
                                                ${event.totalRevenue.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-red-600">
                                                -${event.platformFee.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-4 font-semibold text-green-600">
                                                ${event.netRevenue.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-4">
                                                {event.isPaidOut ? (
                                                    <Badge variant="success">Paid Out</Badge>
                                                ) : (
                                                    <Badge variant="warning">Pending</Badge>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <Link to={`/organizer/finance/events/${event.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Payouts Tab */}
            {activeTab === 'payouts' && (
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Payout ID</th>
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date</th>
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Events</th>
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Method</th>
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Amount</th>
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payouts.map((payout) => (
                                        <tr key={payout.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-4">
                                                <span className="font-medium text-gray-900">{payout.id}</span>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {formatDate(payout.date)}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                {payout.events.join(', ')}
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    {payout.method === 'Mobile Money' ? (
                                                        <Smartphone size={14} className="text-gray-400" />
                                                    ) : (
                                                        <Building2 size={14} className="text-gray-400" />
                                                    )}
                                                    {payout.method} •••• {payout.accountEnding}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 font-semibold text-gray-900">
                                                ${payout.amount.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge variant={getStatusStyle(payout.status)}>{payout.status}</Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {payouts.length === 0 && (
                            <div className="text-center py-12">
                                <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No payouts yet</h3>
                                <p className="text-gray-500">Request your first payout to see it here</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Payout Request Modal */}
            {showPayoutModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Request Payout</h2>
                                <button
                                    onClick={() => setShowPayoutModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Select Events */}
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Select Events to Withdraw</h3>
                                <div className="space-y-2">
                                    {availableForPayout.map((event) => (
                                        <label
                                            key={event.id}
                                            className={cn(
                                                "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors",
                                                selectedEvents.includes(event.id)
                                                    ? "border-(--brand-primary) bg-(--brand-primary)/5"
                                                    : "border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEvents.includes(event.id)}
                                                    onChange={() => handleEventSelect(event.id)}
                                                    className="w-4 h-4 text-(--brand-primary) rounded"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900">{event.name}</p>
                                                    <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                                                </div>
                                            </div>
                                            <p className="font-semibold text-green-600">${event.netRevenue.toLocaleString()}</p>
                                        </label>
                                    ))}
                                </div>

                                {selectedEvents.length > 0 && (
                                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-green-800">Total Payout Amount</span>
                                            <span className="text-2xl font-bold text-green-600">
                                                ${getSelectedTotal().toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Payment Method */}
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setPaymentMethod('mobile_money')}
                                        className={cn(
                                            "p-4 border-2 rounded-lg text-left transition-colors",
                                            paymentMethod === 'mobile_money'
                                                ? "border-(--brand-primary) bg-(--brand-primary)/5"
                                                : "border-gray-200 hover:border-gray-300"
                                        )}
                                    >
                                        <Smartphone size={24} className={paymentMethod === 'mobile_money' ? "text-(--brand-primary)" : "text-gray-400"} />
                                        <p className="font-medium text-gray-900 mt-2">Mobile Money</p>
                                        <p className="text-sm text-gray-500">MTN, Vodafone, AirtelTigo</p>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('bank')}
                                        className={cn(
                                            "p-4 border-2 rounded-lg text-left transition-colors",
                                            paymentMethod === 'bank'
                                                ? "border-(--brand-primary) bg-(--brand-primary)/5"
                                                : "border-gray-200 hover:border-gray-300"
                                        )}
                                    >
                                        <Building2 size={24} className={paymentMethod === 'bank' ? "text-(--brand-primary)" : "text-gray-400"} />
                                        <p className="font-medium text-gray-900 mt-2">Bank Transfer</p>
                                        <p className="text-sm text-gray-500">Direct bank deposit</p>
                                    </button>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Payment Details</h3>

                                {paymentMethod === 'mobile_money' ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Mobile Network *
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={paymentDetails.mobileNetwork}
                                                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, mobileNetwork: e.target.value }))}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary) appearance-none bg-white"
                                                >
                                                    <option value="">Select network</option>
                                                    {mobileNetworks.map((network) => (
                                                        <option key={network} value={network}>{network}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Mobile Number *
                                            </label>
                                            <input
                                                type="tel"
                                                value={paymentDetails.mobileNumber}
                                                onChange={(e) => setPaymentDetails(prev => ({ ...prev, mobileNumber: e.target.value }))}
                                                placeholder="0XX XXX XXXX"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Bank Name *
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={paymentDetails.bankName}
                                                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, bankName: e.target.value }))}
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary) appearance-none bg-white"
                                                >
                                                    <option value="">Select bank</option>
                                                    {banks.map((bank) => (
                                                        <option key={bank} value={bank}>{bank}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Account Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentDetails.accountName}
                                                onChange={(e) => setPaymentDetails(prev => ({ ...prev, accountName: e.target.value }))}
                                                placeholder="Enter account name"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Account Number *
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentDetails.accountNumber}
                                                onChange={(e) => setPaymentDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                                                placeholder="Enter account number"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                SWIFT/BIC Code (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentDetails.swiftCode}
                                                onChange={(e) => setPaymentDetails(prev => ({ ...prev, swiftCode: e.target.value }))}
                                                placeholder="Enter SWIFT code"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Notice */}
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                                <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-800">
                                    <p className="font-medium">Processing Time</p>
                                    <p className="mt-1">
                                        Payouts are processed within 1-3 business days.
                                        You will receive a confirmation email once the transfer is complete.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowPayoutModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handlePayoutSubmit}
                                disabled={selectedEvents.length === 0}
                            >
                                Request Payout ${getSelectedTotal().toLocaleString()}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Finance;
