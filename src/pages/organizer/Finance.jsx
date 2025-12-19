import React, { useState, useEffect } from 'react';
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
    X,
    CreditCard,
    Smartphone,
    Building2,
    AlertCircle,
    ChevronDown,
    Trophy,
    Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import financeService from '../../services/financeService';
import { showError, showSuccess } from '../../utils/toast';

const Finance = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showPayoutModal, setShowPayoutModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState({ events: [], awards: [] });
    const [paymentMethod, setPaymentMethod] = useState('mobile_money');
    const [payoutFilter, setPayoutFilter] = useState('all'); // all, events, awards
    const [paymentDetails, setPaymentDetails] = useState({
        mobileNetwork: '',
        mobileNumber: '',
        bankName: '',
        accountName: '',
        accountNumber: '',
        swiftCode: ''
    });

    // Data states
    const [isLoading, setIsLoading] = useState(true);
    const [overview, setOverview] = useState(null);
    const [eventsData, setEventsData] = useState([]);
    const [awardsData, setAwardsData] = useState([]);
    const [error, setError] = useState(null);

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
        { id: 'awards', label: 'Awards Revenue' },
        { id: 'payouts', label: 'Payout History' },
    ];

    // Fetch financial data on mount
    useEffect(() => {
        fetchFinancialOverview();
    }, []);

    const fetchFinancialOverview = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await financeService.getOverview();

            if (response.success) {
                setOverview(response.data);
            } else {
                setError(response.message || 'Failed to fetch financial data');
            }
        } catch (err) {
            console.error('Error fetching financial overview:', err);
            setError(err.message || 'An error occurred while fetching financial data');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEventsRevenue = async () => {
        try {
            const response = await financeService.getEventsRevenue();
            if (response.success) {
                setEventsData(response.data.events || []);
            }
        } catch (err) {
            console.error('Error fetching events revenue:', err);
            showError('Failed to fetch events revenue');
        }
    };

    const fetchAwardsRevenue = async () => {
        try {
            const response = await financeService.getAwardsRevenue();
            if (response.success) {
                setAwardsData(response.data.awards || []);
            }
        } catch (err) {
            console.error('Error fetching awards revenue:', err);
            showError('Failed to fetch awards revenue');
        }
    };

    const handleTabChange = async (tabId) => {
        setActiveTab(tabId);

        // Fetch data when switching to specific tabs
        if (tabId === 'events' && eventsData.length === 0) {
            await fetchEventsRevenue();
        } else if (tabId === 'awards' && awardsData.length === 0) {
            await fetchAwardsRevenue();
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'failed': return 'destructive';
            default: return 'secondary';
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleItemSelect = (type, itemId) => {
        setSelectedItems(prev => ({
            ...prev,
            [type]: prev[type].includes(itemId)
                ? prev[type].filter(id => id !== itemId)
                : [...prev[type], itemId]
        }));
    };

    const getSelectedTotal = () => {
        const selectedEvents = eventsData.filter(e =>
            selectedItems.events.includes(e.event_id) && e.is_eligible_for_payout
        );
        const selectedAwards = awardsData.filter(a =>
            selectedItems.awards.includes(a.award_id) && a.is_eligible_for_payout
        );

        return financeService.calculateSelectedTotal(selectedEvents, selectedAwards);
    };

    const handlePayoutSubmit = () => {
        // TODO: Implement actual payout request
        showSuccess('Payout request submitted successfully');
        setShowPayoutModal(false);
        setSelectedItems({ events: [], awards: [] });
    };

    // Get eligible items for payout based on filter
    const getEligibleItems = () => {
        const eligibleEvents = eventsData.filter(e => e.is_eligible_for_payout);
        const eligibleAwards = awardsData.filter(a => a.is_eligible_for_payout);

        if (payoutFilter === 'events') return { events: eligibleEvents, awards: [] };
        if (payoutFilter === 'awards') return { events: [], awards: eligibleAwards };
        return { events: eligibleEvents, awards: eligibleAwards };
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-(--brand-primary) mx-auto mb-4" />
                    <p className="text-gray-600">Loading financial data...</p>
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
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
                        <div>
                            <h3 className="font-semibold text-red-800 mb-1">Error Loading Financial Data</h3>
                            <p className="text-red-700">{error}</p>
                            <button
                                onClick={fetchFinancialOverview}
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

    const stats = overview?.summary || {};
    const revenueBreakdown = overview?.revenue_breakdown || {};
    const availableForPayout = [...(eventsData.filter(e => e.is_eligible_for_payout) || []), ...(awardsData.filter(a => a.is_eligible_for_payout) || [])];

    // Payouts placeholder - will be replaced with real data
    const payouts = [];

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
                        onClick={() => {
                            // Fetch latest data for payout modal
                            if (eventsData.length === 0) fetchEventsRevenue();
                            if (awardsData.length === 0) fetchAwardsRevenue();
                            setShowPayoutModal(true);
                        }}
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
                                <p className="text-2xl font-bold text-gray-900">
                                    {financeService.formatCurrency(stats.total_gross_revenue || 0)}
                                </p>
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
                                <p className="text-2xl font-bold text-gray-900">
                                    {financeService.formatCurrency(stats.available_balance || 0)}
                                </p>
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
                                <p className="text-2xl font-bold text-gray-900">
                                    {financeService.formatCurrency(stats.pending_balance || 0)}
                                </p>
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
                                <p className="text-2xl font-bold text-gray-900">
                                    {financeService.formatCurrency(stats.completed_payouts || 0)}
                                </p>
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
                                <p className="text-2xl font-bold text-gray-900">
                                    {financeService.formatCurrency(stats.total_platform_fees || 0)}
                                </p>
                                <p className="text-xs text-gray-500">Platform Fees</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Breakdown Card */}
            {revenueBreakdown.events_revenue && revenueBreakdown.awards_revenue && (
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue by Source</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-blue-900">Events Ticketing</span>
                                    <span className="text-xs font-semibold text-blue-700">
                                        {revenueBreakdown.events_revenue.percentage}%
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-blue-900">
                                    {financeService.formatCurrency(revenueBreakdown.events_revenue.net || 0)}
                                </p>
                                <p className="text-xs text-blue-700 mt-1">
                                    Gross: {financeService.formatCurrency(revenueBreakdown.events_revenue.gross || 0)}
                                </p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-purple-900">Awards Voting</span>
                                    <span className="text-xs font-semibold text-purple-700">
                                        {revenueBreakdown.awards_revenue.percentage}%
                                    </span>
                                </div>
                                <p className="text-2xl font-bold text-purple-900">
                                    {financeService.formatCurrency(revenueBreakdown.awards_revenue.net || 0)}
                                </p>
                                <p className="text-xs text-purple-700 mt-1">
                                    Gross: {financeService.formatCurrency(revenueBreakdown.awards_revenue.gross || 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-6 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
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
                    {/* Top Performers */}
                    <div className="col-span-12">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Performers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {overview?.top_performers?.top_event && (
                                        <div className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar size={16} className="text-blue-600" />
                                                <span className="text-sm font-medium text-gray-600">Top Event</span>
                                            </div>
                                            <h4 className="font-bold text-gray-900">{overview.top_performers.top_event.name}</h4>
                                            <p className="text-2xl font-bold text-blue-600 mt-2">
                                                {financeService.formatCurrency(overview.top_performers.top_event.revenue)}
                                            </p>
                                        </div>
                                    )}
                                    {overview?.top_performers?.top_award && (
                                        <div className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Trophy size={16} className="text-purple-600" />
                                                <span className="text-sm font-medium text-gray-600">Top Award</span>
                                            </div>
                                            <h4 className="font-bold text-gray-900">{overview.top_performers.top_award.name}</h4>
                                            <p className="text-2xl font-bold text-purple-600 mt-2">
                                                {financeService.formatCurrency(overview.top_performers.top_award.revenue)}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {overview.top_performers.top_award.votes.toLocaleString()} votes
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Events Revenue */}
                    <div className="col-span-12 lg:col-span-8">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Recent Event Revenue</CardTitle>
                                    <button
                                        onClick={() => handleTabChange('events')}
                                        className="text-sm text-(--brand-primary) hover:underline"
                                    >
                                        View All
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {eventsData.length === 0 ? (
                                    <button
                                        onClick={fetchEventsRevenue}
                                        className="w-full py-4 text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        Click to load events
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        {eventsData.slice(0, 4).map((event) => (
                                            <Link
                                                key={event.event_id}
                                                to={`/organizer/finance/events/${event.event_id}`}
                                                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium text-gray-900">{event.event_name}</h4>
                                                        {event.payout_status === 'completed' ? (
                                                            <Badge variant="success" className="text-xs">Paid</Badge>
                                                        ) : (
                                                            <Badge variant="warning" className="text-xs">Pending</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {formatDate(event.event_date)} • {event.total_orders} orders
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">
                                                        {financeService.formatCurrency(event.net_revenue)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Net revenue</p>
                                                </div>
                                                <ChevronRight size={20} className="text-gray-400 ml-4" />
                                            </Link>
                                        ))}
                                    </div>
                                )}
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
                                        onClick={() => handleTabChange('payouts')}
                                        className="text-sm text-(--brand-primary) hover:underline"
                                    >
                                        View All
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {payouts.length === 0 ? (
                                    <div className="text-center py-8">
                                        <DollarSign size={32} className="mx-auto text-gray-300 mb-2" />
                                        <p className="text-sm text-gray-500">No payouts yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {payouts.slice(0, 3).map((payout) => (
                                            <div key={payout.id} className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                                    <CheckCircle size={18} className="text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {financeService.formatCurrency(payout.amount)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{formatDate(payout.date)}</p>
                                                </div>
                                                <Badge variant="success">{payout.status}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
                <Card>
                    <CardContent className="p-0">
                        {eventsData.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No events yet</h3>
                                <p className="text-gray-500">Create your first event to see revenue here</p>
                            </div>
                        ) : (
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
                                        {eventsData.map((event) => (
                                            <tr key={event.event_id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <Link
                                                        to={`/organizer/events/${event.event_slug}`}
                                                        className="font-medium text-gray-900 hover:text-(--brand-primary)"
                                                    >
                                                        {event.event_name}
                                                    </Link>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600">
                                                    {formatDate(event.event_date)}
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600">
                                                    {event.total_orders}
                                                </td>
                                                <td className="py-4 px-4 font-medium text-gray-900">
                                                    {financeService.formatCurrency(event.gross_revenue)}
                                                </td>
                                                <td className="py-4 px-4 text-sm text-red-600">
                                                    -{financeService.formatCurrency(event.platform_fee)}
                                                </td>
                                                <td className="py-4 px-4 font-semibold text-green-600">
                                                    {financeService.formatCurrency(event.net_revenue)}
                                                </td>
                                                <td className="py-4 px-4">
                                                    {event.payout_status === 'completed' ? (
                                                        <Badge variant="success">Paid Out</Badge>
                                                    ) : event.is_eligible_for_payout ? (
                                                        <Badge variant="warning">Available</Badge>
                                                    ) : (
                                                        <Badge variant="secondary">Pending</Badge>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <Link to={`/organizer/events/${event.event_slug}`}>
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
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Awards Tab - NEW! */}
            {activeTab === 'awards' && (
                <Card>
                    <CardContent className="p-0">
                        {awardsData.length === 0 ? (
                            <div className="text-center py-12">
                                <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No awards yet</h3>
                                <p className="text-gray-500">Create your first award to see voting revenue here</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Award</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Votes</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Gross Revenue</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Platform Fee</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Net Revenue</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Status</th>
                                            <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {awardsData.map((award) => (
                                            <tr key={award.award_id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <Link
                                                        to={`/organizer/awards/${award.award_slug}`}
                                                        className="font-medium text-gray-900 hover:text-(--brand-primary)"
                                                    >
                                                        {award.award_title}
                                                    </Link>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600">
                                                    {formatDate(award.ceremony_date)}
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-600">
                                                    {award.total_votes.toLocaleString()}
                                                    <span className="text-xs text-gray-500 ml-1">
                                                        ({award.total_voters} voters)
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 font-medium text-gray-900">
                                                    {financeService.formatCurrency(award.gross_revenue)}
                                                </td>
                                                <td className="py-4 px-4 text-sm text-red-600">
                                                    -{financeService.formatCurrency(award.platform_fee)}
                                                </td>
                                                <td className="py-4 px-4 font-semibold text-green-600">
                                                    {financeService.formatCurrency(award.net_revenue)}
                                                </td>
                                                <td className="py-4 px-4">
                                                    {award.payout_status === 'completed' ? (
                                                        <Badge variant="success">Paid Out</Badge>
                                                    ) : award.is_eligible_for_payout ? (
                                                        <Badge variant="warning">Available</Badge>
                                                    ) : (
                                                        <Badge variant="secondary">Pending</Badge>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <Link to={`/organizer/awards/${award.award_slug}`}>
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
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Payouts Tab */}
            {activeTab === 'payouts' && (
                <Card>
                    <CardContent className="p-0">
                        {payouts.length === 0 ? (
                            <div className="text-center py-12">
                                <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No payouts yet</h3>
                                <p className="text-gray-500">Request your first payout to see it here</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Payout ID</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Date</th>
                                            <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Items</th>
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
                                                    {financeService.formatCurrency(payout.amount)}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge variant={getStatusStyle(payout.status)}>{payout.status}</Badge>
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

            {/* Payout Request Modal - ENHANCED */}
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
                            {/* Filter Tabs - NEW! */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Source</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => setPayoutFilter('all')}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                            payoutFilter === 'all'
                                                ? "bg-(--brand-primary) text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        )}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setPayoutFilter('events')}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                            payoutFilter === 'events'
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        )}
                                    >
                                        Events Only
                                    </button>
                                    <button
                                        onClick={() => setPayoutFilter('awards')}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                            payoutFilter === 'awards'
                                                ? "bg-purple-600 text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        )}
                                    >
                                        Awards Only
                                    </button>
                                </div>
                            </div>

                            {/* Select Items - ENHANCED */}
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Select Items to Withdraw</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {/* Events */}
                                    {getEligibleItems().events.map((event) => (
                                        <label
                                            key={`event-${event.event_id}`}
                                            className={cn(
                                                "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors",
                                                selectedItems.events.includes(event.event_id)
                                                    ? "border-blue-600 bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.events.includes(event.event_id)}
                                                    onChange={() => handleItemSelect('events', event.event_id)}
                                                    className="w-4 h-4 text-blue-600 rounded"
                                                />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-gray-900">{event.event_name}</p>
                                                        <Badge variant="info" className="text-xs">Event</Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{formatDate(event.event_date)}</p>
                                                </div>
                                            </div>
                                            <p className="font-semibold text-green-600">
                                                {financeService.formatCurrency(event.net_revenue)}
                                            </p>
                                        </label>
                                    ))}

                                    {/* Awards */}
                                    {getEligibleItems().awards.map((award) => (
                                        <label
                                            key={`award-${award.award_id}`}
                                            className={cn(
                                                "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors",
                                                selectedItems.awards.includes(award.award_id)
                                                    ? "border-purple-600 bg-purple-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.awards.includes(award.award_id)}
                                                    onChange={() => handleItemSelect('awards', award.award_id)}
                                                    className="w-4 h-4 text-purple-600 rounded"
                                                />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-gray-900">{award.award_title}</p>
                                                        <Badge className="text-xs bg-purple-100 text-purple-700">Award</Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{formatDate(award.ceremony_date)}</p>
                                                </div>
                                            </div>
                                            <p className="font-semibold text-green-600">
                                                {financeService.formatCurrency(award.net_revenue)}
                                            </p>
                                        </label>
                                    ))}

                                    {getEligibleItems().events.length === 0 && getEligibleItems().awards.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>No eligible items for payout</p>
                                            <p className="text-sm mt-1">Items become eligible 7 days after completion</p>
                                        </div>
                                    )}
                                </div>

                                {(selectedItems.events.length > 0 || selectedItems.awards.length > 0) && (
                                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="space-y-2">
                                            {selectedItems.events.length > 0 && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-green-800">Events ({selectedItems.events.length})</span>
                                                    <span className="font-semibold text-green-900">
                                                        {financeService.formatCurrency(getSelectedTotal().events)}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedItems.awards.length > 0 && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-green-800">Awards ({selectedItems.awards.length})</span>
                                                    <span className="font-semibold text-green-900">
                                                        {financeService.formatCurrency(getSelectedTotal().awards)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="pt-2 border-t border-green-300">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-green-800">Total Payout Amount</span>
                                                    <span className="text-2xl font-bold text-green-600">
                                                        {financeService.formatCurrency(getSelectedTotal().total)}
                                                    </span>
                                                </div>
                                            </div>
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
                                disabled={selectedItems.events.length === 0 && selectedItems.awards.length === 0}
                            >
                                Request Payout {financeService.formatCurrency(getSelectedTotal().total)}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Finance;
