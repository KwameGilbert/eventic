import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    Calendar,
    Trophy,
    Loader2,
    AlertCircle,
    Smartphone,
    Building2,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    TrendingUp,
    Ticket,
    Vote,
    Users,
    Wallet,
    PieChart,
    BarChart3,
    Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import adminService from '../../services/adminService';
import { showSuccess, showError } from '../../utils/toast';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RechartsPie,
    Pie,
    Cell,
    Legend,
    Area,
    AreaChart
} from 'recharts';



const PIE_COLORS = ['#dc2626', '#f97316', '#22c55e', '#3b82f6'];

const AdminFinance = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [financeData, setFinanceData] = useState(null);
    const [payouts, setPayouts] = useState([]);
    const [error, setError] = useState(null);
    const [processingPayouts, setProcessingPayouts] = useState({});
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [rejectionModal, setRejectionModal] = useState({ isOpen: false, payoutId: null });
    const [rejectionReason, setRejectionReason] = useState('');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: PieChart },
        { id: 'revenue', label: 'Revenue Analytics', icon: BarChart3 },
        { id: 'payouts', label: 'Payout Management', icon: Wallet, count: financeData?.payouts?.pending_count || 0 },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [financeResponse, payoutsResponse] = await Promise.all([
                adminService.getFinanceOverview(),
                adminService.getPayouts()
            ]);

            if (financeResponse.success) {
                setFinanceData(financeResponse.data);
            }

            if (payoutsResponse.success) {
                setPayouts(payoutsResponse.data.payouts || []);
            }

        } catch (err) {
            console.error('Error fetching finance data:', err);
            setError(err.message || 'An error occurred while fetching finance data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprovePayout = async (payoutId) => {
        try {
            setProcessingPayouts(prev => ({ ...prev, [payoutId]: 'approving' }));
            const response = await adminService.approvePayout(payoutId);

            if (response.success) {
                showSuccess('Payout approved and marked as processing');
                fetchData();
            } else {
                showError(response.message || 'Failed to approve payout');
            }
        } catch (err) {
            showError(err.message || 'Failed to approve payout');
        } finally {
            setProcessingPayouts(prev => ({ ...prev, [payoutId]: null }));
        }
    };

    const handleRejectPayout = async () => {
        if (!rejectionReason.trim()) {
            showError('Please provide a rejection reason');
            return;
        }

        try {
            setProcessingPayouts(prev => ({ ...prev, [rejectionModal.payoutId]: 'rejecting' }));
            const response = await adminService.rejectPayout(rejectionModal.payoutId, rejectionReason);

            if (response.success) {
                showSuccess('Payout rejected');
                setRejectionModal({ isOpen: false, payoutId: null });
                setRejectionReason('');
                fetchData();
            } else {
                showError(response.message || 'Failed to reject payout');
            }
        } catch (err) {
            showError(err.message || 'Failed to reject payout');
        } finally {
            setProcessingPayouts(prev => ({ ...prev, [rejectionModal.payoutId]: null }));
        }
    };

    const handleCompletePayout = async (payoutId) => {
        try {
            setProcessingPayouts(prev => ({ ...prev, [payoutId]: 'completing' }));
            const response = await adminService.completePayout(payoutId);

            if (response.success) {
                showSuccess('Payout marked as completed');
                fetchData();
            } else {
                showError(response.message || 'Failed to complete payout');
            }
        } catch (err) {
            showError(err.message || 'Failed to complete payout');
        } finally {
            setProcessingPayouts(prev => ({ ...prev, [payoutId]: null }));
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'rejected': return 'destructive';
            default: return 'secondary';
        }
    };

    const getFilteredPayouts = () => {
        let filtered = payouts;

        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === statusFilter);
        }
        if (typeFilter !== 'all') {
            filtered = filtered.filter(p => p.payout_type === typeFilter);
        }

        return filtered;
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading finance data...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
                        <div>
                            <h3 className="font-semibold text-red-800 mb-1">Error Loading Finance Data</h3>
                            <p className="text-red-700">{error}</p>
                            <button
                                onClick={fetchData}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const filteredPayouts = getFilteredPayouts();
    const summary = financeData?.summary || {};
    const revenueBreakdown = financeData?.revenue_breakdown || {};
    const transactions = financeData?.transactions || {};
    const monthlyTrend = financeData?.monthly_trend || [];
    const topEvents = financeData?.top_events || [];
    const topAwards = financeData?.top_awards || [];
    const organizerBalances = financeData?.organizer_balances || {};
    const payoutData = financeData?.payouts || {};

    // Prepare pie chart data
    const pieData = [
        { name: 'Tickets', value: revenueBreakdown.tickets?.gross_revenue || 0 },
        { name: 'Votes', value: revenueBreakdown.votes?.gross_revenue || 0 },
    ].filter(item => item.value > 0);



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
                    <p className="text-gray-500 mt-1">Platform revenue, analytics, and payout management</p>
                </div>
                <Button variant="outline" className="gap-2" onClick={fetchData}>
                    <RefreshCw size={18} />
                    Refresh
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Revenue */}
                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full" />
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {adminService.formatCurrency(summary.total_gross_revenue || 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">All time</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <DollarSign size={20} className="text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Platform Fees */}
                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/20 to-transparent rounded-bl-full" />
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Platform Earnings</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {adminService.formatCurrency(summary.total_platform_fees || 0)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Commission fees</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <TrendingUp size={20} className="text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* This Month */}
                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full" />
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">This Month</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {adminService.formatCurrency(summary.this_month_revenue || 0)}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    {summary.monthly_growth_percent >= 0 ? (
                                        <ArrowUpRight size={14} className="text-green-600" />
                                    ) : (
                                        <ArrowDownRight size={14} className="text-red-600" />
                                    )}
                                    <span className={cn(
                                        "text-xs font-medium",
                                        summary.monthly_growth_percent >= 0 ? "text-green-600" : "text-red-600"
                                    )}>
                                        {Math.abs(summary.monthly_growth_percent || 0)}% vs last month
                                    </span>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Activity size={20} className="text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Payouts */}
                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-bl-full" />
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Pending Payouts</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {payoutData.pending_count || 0}
                                </p>
                                <p className="text-xs text-yellow-600 font-medium mt-1">
                                    {adminService.formatCurrency(payoutData.pending_amount || 0)} awaiting
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <Clock size={20} className="text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-1 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors font-medium",
                                    activeTab === tab.id
                                        ? "border-red-600 text-red-600 bg-red-50/50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                <Icon size={18} />
                                {tab.label}
                                {tab.count > 0 && (
                                    <Badge variant="warning" className="rounded-full px-2 py-0.5 text-xs">
                                        {tab.count}
                                    </Badge>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-12 gap-6">
                    {/* Revenue Breakdown Pie Chart */}
                    <Card className="col-span-12 lg:col-span-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart size={20} className="text-gray-500" />
                                Revenue Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pieData.length > 0 ? (
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPie>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => adminService.formatCurrency(value)} />
                                        </RechartsPie>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-64 flex items-center justify-center text-gray-500">
                                    <p>No revenue data yet</p>
                                </div>
                            )}
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Ticket size={16} className="text-red-600" />
                                        <span className="text-sm font-medium text-gray-700">Ticket Sales</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">
                                        {adminService.formatCurrency(revenueBreakdown.tickets?.gross_revenue || 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Vote size={16} className="text-orange-600" />
                                        <span className="text-sm font-medium text-gray-700">Vote Purchases</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">
                                        {adminService.formatCurrency(revenueBreakdown.votes?.gross_revenue || 0)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Monthly Revenue Chart */}
                    <Card className="col-span-12 lg:col-span-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 size={20} className="text-gray-500" />
                                Revenue Trend (Last 6 Months)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyTrend}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} tickFormatter={(val) => `GH₵${val / 1000}k`} />
                                        <Tooltip
                                            formatter={(value, name) => [adminService.formatCurrency(value), name === 'total_revenue' ? 'Total Revenue' : 'Platform Fees']}
                                            labelStyle={{ fontWeight: 'bold' }}
                                        />
                                        <Area type="monotone" dataKey="total_revenue" stroke="#dc2626" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} name="Total Revenue" />
                                        <Area type="monotone" dataKey="platform_fees" stroke="#22c55e" fillOpacity={1} fill="url(#colorFees)" strokeWidth={2} name="Platform Fees" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transaction Stats */}
                    <Card className="col-span-12 lg:col-span-6">
                        <CardHeader>
                            <CardTitle>Transaction Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Ticket size={18} className="text-blue-600" />
                                        <span className="text-sm text-blue-700">Orders</span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-900">{transactions.total_orders || 0}</p>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Ticket size={18} className="text-green-600" />
                                        <span className="text-sm text-green-700">Tickets Sold</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-900">{transactions.total_tickets_sold || 0}</p>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Vote size={18} className="text-purple-600" />
                                        <span className="text-sm text-purple-700">Total Votes</span>
                                    </div>
                                    <p className="text-2xl font-bold text-purple-900">{transactions.total_votes?.toLocaleString() || 0}</p>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Vote size={18} className="text-orange-600" />
                                        <span className="text-sm text-orange-700">Vote Transactions</span>
                                    </div>
                                    <p className="text-2xl font-bold text-orange-900">{transactions.total_vote_transactions || 0}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Organizer Balances Overview */}
                    <Card className="col-span-12 lg:col-span-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users size={20} className="text-gray-500" />
                                Organizer Funds
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                    <div>
                                        <p className="text-sm text-yellow-700">Pending Balance</p>
                                        <p className="text-xl font-bold text-yellow-900">
                                            {adminService.formatCurrency(organizerBalances.total_pending || 0)}
                                        </p>
                                    </div>
                                    <Clock size={28} className="text-yellow-600" />
                                </div>
                                <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-200">
                                    <div>
                                        <p className="text-sm text-green-700">Available for Payout</p>
                                        <p className="text-xl font-bold text-green-900">
                                            {adminService.formatCurrency(organizerBalances.total_available || 0)}
                                        </p>
                                    </div>
                                    <Wallet size={28} className="text-green-600" />
                                </div>
                                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <div>
                                        <p className="text-sm text-blue-700">Total Withdrawn</p>
                                        <p className="text-xl font-bold text-blue-900">
                                            {adminService.formatCurrency(organizerBalances.total_withdrawn || 0)}
                                        </p>
                                    </div>
                                    <CheckCircle size={28} className="text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Events */}
                    <Card className="col-span-12 lg:col-span-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar size={20} className="text-gray-500" />
                                    Top Events by Revenue
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {topEvents.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Calendar size={32} className="mx-auto mb-2 text-gray-300" />
                                    <p>No event revenue yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {topEvents.map((event, index) => (
                                        <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm",
                                                index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-amber-600" : "bg-gray-300"
                                            )}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{event.title}</p>
                                                <p className="text-xs text-gray-500">{event.orders_count} orders</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">{adminService.formatCurrency(event.total_revenue)}</p>
                                                <p className="text-xs text-green-600">+{adminService.formatCurrency(event.platform_fees)} fees</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Top Awards */}
                    <Card className="col-span-12 lg:col-span-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy size={20} className="text-gray-500" />
                                    Top Awards by Revenue
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {topAwards.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <Trophy size={32} className="mx-auto mb-2 text-gray-300" />
                                    <p>No award revenue yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {topAwards.map((award, index) => (
                                        <div key={award.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm",
                                                index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-amber-600" : "bg-gray-300"
                                            )}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{award.title}</p>
                                                <p className="text-xs text-gray-500">{award.total_votes?.toLocaleString()} votes</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">{adminService.formatCurrency(award.total_revenue)}</p>
                                                <p className="text-xs text-green-600">+{adminService.formatCurrency(award.platform_fees)} fees</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* REVENUE ANALYTICS TAB */}
            {activeTab === 'revenue' && (
                <div className="grid grid-cols-12 gap-6">
                    {/* Revenue by Source Bar Chart */}
                    <Card className="col-span-12">
                        <CardHeader>
                            <CardTitle>Monthly Revenue Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} tickFormatter={(val) => `GH₵${val / 1000}k`} />
                                        <Tooltip formatter={(value) => adminService.formatCurrency(value)} />
                                        <Legend />
                                        <Bar dataKey="ticket_revenue" name="Ticket Revenue" fill="#dc2626" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="vote_revenue" name="Vote Revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="platform_fees" name="Platform Fees" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed Breakdown Cards */}
                    <Card className="col-span-12 lg:col-span-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Ticket size={20} className="text-red-600" />
                                Ticket Sales Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Gross Revenue</span>
                                <span className="font-semibold">{adminService.formatCurrency(revenueBreakdown.tickets?.gross_revenue || 0)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                                <span className="text-green-700">Platform Fees</span>
                                <span className="font-semibold text-green-700">{adminService.formatCurrency(revenueBreakdown.tickets?.platform_fees || 0)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                                <span className="text-blue-700">Organizer Share</span>
                                <span className="font-semibold text-blue-700">{adminService.formatCurrency(revenueBreakdown.tickets?.organizer_share || 0)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                                <span className="text-purple-700">Revenue Share</span>
                                <span className="font-semibold text-purple-700">{revenueBreakdown.tickets?.percentage || 0}%</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-12 lg:col-span-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Vote size={20} className="text-orange-600" />
                                Vote Sales Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Gross Revenue</span>
                                <span className="font-semibold">{adminService.formatCurrency(revenueBreakdown.votes?.gross_revenue || 0)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                                <span className="text-green-700">Platform Fees</span>
                                <span className="font-semibold text-green-700">{adminService.formatCurrency(revenueBreakdown.votes?.platform_fees || 0)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                                <span className="text-blue-700">Organizer Share</span>
                                <span className="font-semibold text-blue-700">{adminService.formatCurrency(revenueBreakdown.votes?.organizer_share || 0)}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                                <span className="text-purple-700">Revenue Share</span>
                                <span className="font-semibold text-purple-700">{revenueBreakdown.votes?.percentage || 0}%</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* PAYOUTS TAB */}
            {activeTab === 'payouts' && (
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle>Payout Requests</CardTitle>
                            <div className="flex gap-2 flex-wrap">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="all">All Types</option>
                                    <option value="event">Events</option>
                                    <option value="award">Awards</option>
                                </select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredPayouts.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No payouts found</h3>
                                <p>No payouts match your filters</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50">
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Organizer</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Source</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Type</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Payment Method</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Amount</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Status</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date</th>
                                            <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPayouts.map((payout) => (
                                            <tr key={payout.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{payout.organizer?.name || 'Unknown'}</p>
                                                        <p className="text-sm text-gray-500">{payout.organizer?.email}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        {payout.payout_type === 'event' ? (
                                                            <Calendar size={14} className="text-blue-600" />
                                                        ) : (
                                                            <Trophy size={14} className="text-purple-600" />
                                                        )}
                                                        <span className="text-sm text-gray-900">{payout.source_name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge variant={payout.payout_type === 'event' ? 'info' : 'secondary'} className="capitalize">
                                                        {payout.payout_type}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        {payout.payment_method === 'Mobile Money' ? (
                                                            <Smartphone size={14} className="text-gray-400" />
                                                        ) : (
                                                            <Building2 size={14} className="text-gray-400" />
                                                        )}
                                                        <div>
                                                            <p>{payout.bank_name}</p>
                                                            <p className="text-xs text-gray-500">{payout.account_name} •••• {payout.account_number?.slice(-4)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="font-semibold text-gray-900">
                                                        {adminService.formatCurrency(payout.amount)}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge variant={getStatusVariant(payout.status)} className="capitalize">
                                                        {payout.status_label || payout.status}
                                                    </Badge>
                                                    {payout.rejection_reason && (
                                                        <p className="text-xs text-red-600 mt-1 max-w-[150px] truncate" title={payout.rejection_reason}>
                                                            {payout.rejection_reason}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600">
                                                    {formatDate(payout.created_at)}
                                                    {payout.processed_at && (
                                                        <p className="text-xs text-gray-500">
                                                            Processed: {formatDate(payout.processed_at)}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex justify-end gap-2">
                                                        {payout.status === 'pending' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleApprovePayout(payout.id)}
                                                                    disabled={!!processingPayouts[payout.id]}
                                                                    className="bg-green-600 hover:bg-green-700"
                                                                >
                                                                    {processingPayouts[payout.id] === 'approving' ? (
                                                                        <Loader2 size={14} className="animate-spin" />
                                                                    ) : (
                                                                        <CheckCircle size={14} />
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => setRejectionModal({ isOpen: true, payoutId: payout.id })}
                                                                    disabled={!!processingPayouts[payout.id]}
                                                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                                                >
                                                                    {processingPayouts[payout.id] === 'rejecting' ? (
                                                                        <Loader2 size={14} className="animate-spin" />
                                                                    ) : (
                                                                        <XCircle size={14} />
                                                                    )}
                                                                </Button>
                                                            </>
                                                        )}
                                                        {payout.status === 'processing' && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleCompletePayout(payout.id)}
                                                                disabled={!!processingPayouts[payout.id]}
                                                                className="bg-blue-600 hover:bg-blue-700"
                                                            >
                                                                {processingPayouts[payout.id] === 'completing' ? (
                                                                    <Loader2 size={14} className="animate-spin" />
                                                                ) : (
                                                                    <>
                                                                        <CheckCircle size={14} />
                                                                        <span className="ml-1">Complete</span>
                                                                    </>
                                                                )}
                                                            </Button>
                                                        )}
                                                        {(payout.status === 'completed' || payout.status === 'rejected') && (
                                                            <span className="text-xs text-gray-400 italic">No actions</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Rejection Modal */}
            {rejectionModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Payout Request</h3>
                        <p className="text-gray-600 mb-4">Please provide a reason for rejecting this payout request. This will be visible to the organizer.</p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            rows={4}
                        />
                        <div className="flex gap-3 mt-4">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setRejectionModal({ isOpen: false, payoutId: null });
                                    setRejectionReason('');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-red-600 hover:bg-red-700"
                                onClick={handleRejectPayout}
                                disabled={!rejectionReason.trim() || processingPayouts[rejectionModal.payoutId] === 'rejecting'}
                            >
                                {processingPayouts[rejectionModal.payoutId] === 'rejecting' ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    'Reject Payout'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFinance;
