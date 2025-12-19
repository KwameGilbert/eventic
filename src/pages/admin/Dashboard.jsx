import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Calendar,
    Trophy,
    DollarSign,
    TrendingUp,
    ShoppingCart,
    UserCheck,
    CheckCircle,
    XCircle,
    Eye,
    Loader2,
    AlertCircle,
    Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import adminService from '../../services/adminService';
import { showSuccess, showError } from '../../utils/toast';

const AdminDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [dashboard, setDashboard] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [processingApprovals, setProcessingApprovals] = useState({});

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await adminService.getDashboard();

            if (response.success) {
                setDashboard(response.data);
            } else {
                setError(response.message || 'Failed to fetch dashboard data');
            }
        } catch (err) {
            console.error('Error fetching admin dashboard:', err);
            setError(err.message || 'An error occurred while fetching dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApproveEvent = async (eventId) => {
        try {
            setProcessingApprovals(prev => ({ ...prev, [`event-${eventId}`]: true }));
            const response = await adminService.approveEvent(eventId);

            if (response.success) {
                showSuccess('Event approved successfully');
                fetchDashboardData(); // Refresh data
            } else {
                showError(response.message || 'Failed to approve event');
            }
        } catch (err) {
            showError(err.message || 'Failed to approve event');
        } finally {
            setProcessingApprovals(prev => ({ ...prev, [`event-${eventId}`]: false }));
        }
    };

    const handleRejectEvent = async (eventId) => {
        try {
            setProcessingApprovals(prev => ({ ...prev, [`event-${eventId}`]: true }));
            const response = await adminService.rejectEvent(eventId);

            if (response.success) {
                showSuccess('Event rejected successfully');
                fetchDashboardData(); // Refresh data
            } else {
                showError(response.message || 'Failed to reject event');
            }
        } catch (err) {
            showError(err.message || 'Failed to reject event');
        } finally {
            setProcessingApprovals(prev => ({ ...prev, [`event-${eventId}`]: false }));
        }
    };

    const handleApproveAward = async (awardId) => {
        try {
            setProcessingApprovals(prev => ({ ...prev, [`award-${awardId}`]: true }));
            const response = await adminService.approveAward(awardId);

            if (response.success) {
                showSuccess('Award approved successfully');
                fetchDashboardData(); // Refresh data
            } else {
                showError(response.message || 'Failed to approve award');
            }
        } catch (err) {
            showError(err.message || 'Failed to approve award');
        } finally {
            setProcessingApprovals(prev => ({ ...prev, [`award-${awardId}`]: false }));
        }
    };

    const handleRejectAward = async (awardId) => {
        try {
            setProcessingApprovals(prev => ({ ...prev, [`award-${awardId}`]: true }));
            const response = await adminService.rejectAward(awardId);

            if (response.success) {
                showSuccess('Award rejected successfully');
                fetchDashboardData(); // Refresh data
            } else {
                showError(response.message || 'Failed to reject award');
            }
        } catch (err) {
            showError(err.message || 'Failed to reject award');
        } finally {
            setProcessingApprovals(prev => ({ ...prev, [`award-${awardId}`]: false }));
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

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'approvals', label: 'Pending Approvals', count: dashboard?.pending_approvals?.total_pending || 0 },
        { id: 'activity', label: 'Recent Activity' },
    ];

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-(--brand-primary) mx-auto mb-4" />
                    <p className="text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
                        <div>
                            <h3 className="font-semibold text-red-800 mb-1">Error Loading Dashboard</h3>
                            <p className="text-red-700">{error}</p>
                            <button
                                onClick={fetchDashboardData}
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

    const platformStats = dashboard?.platform_stats || {};
    const revenueStats = dashboard?.revenue_stats || {};
    const statusBreakdown = dashboard?.status_breakdown || {};
    const pendingApprovals = dashboard?.pending_approvals || {};
    const recentActivity = dashboard?.recent_activity || {};
    const topPerformers = dashboard?.top_performers || {};

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Platform overview and management</p>
                </div>
                {pendingApprovals.total_pending > 0 && (
                    <Badge variant="warning" className="text-base px-4 py-2">
                        {pendingApprovals.total_pending} Pending Approvals
                    </Badge>
                )}
            </div>

            {/* Key Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Total Users */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Users size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {platformStats.total_users?.toLocaleString() || 0}
                                </p>
                                <p className="text-xs text-gray-500">Total Users</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Events */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <Calendar size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {platformStats.total_events?.toLocaleString() || 0}
                                </p>
                                <p className="text-xs text-gray-500">Total Events</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Awards */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Trophy size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {platformStats.total_awards?.toLocaleString() || 0}
                                </p>
                                <p className="text-xs text-gray-500">Total Awards</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Revenue */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <DollarSign size={20} className="text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {adminService.formatCurrency(revenueStats.total_revenue || 0)}
                                </p>
                                <p className="text-xs text-gray-500">Total Revenue</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Platform Fees */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <TrendingUp size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {adminService.formatCurrency(revenueStats.platform_fees || 0)}
                                </p>
                                <p className="text-xs text-gray-500">Platform Fees</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <UserCheck size={18} className="text-gray-600" />
                            <div className="flex-1">
                                <p className="text-lg font-bold text-gray-900">
                                    {platformStats.organizers?.toLocaleString() || 0}
                                </p>
                                <p className="text-xs text-gray-500">Organizers</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <ShoppingCart size={18} className="text-gray-600" />
                            <div className="flex-1">
                                <p className="text-lg font-bold text-gray-900">
                                    {platformStats.total_orders?.toLocaleString() || 0}
                                </p>
                                <p className="text-xs text-gray-500">Orders</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Activity size={18} className="text-gray-600" />
                            <div className="flex-1">
                                <p className="text-lg font-bold text-gray-900">
                                    {platformStats.total_votes_cast?.toLocaleString() || 0}
                                </p>
                                <p className="text-xs text-gray-500">Votes Cast</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-900">Events Ticketing</span>
                                <span className="text-xs font-semibold text-blue-700">
                                    {revenueStats.revenue_breakdown?.events_percentage || 0}%
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-blue-900">
                                {adminService.formatCurrency(revenueStats.ticket_revenue || 0)}
                            </p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-purple-900">Awards Voting</span>
                                <span className="text-xs font-semibold text-purple-700">
                                    {revenueStats.revenue_breakdown?.awards_percentage || 0}%
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-purple-900">
                                {adminService.formatCurrency(revenueStats.vote_revenue || 0)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-6 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "pb-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2",
                                activeTab === tab.id
                                    ? "border-(--brand-primary) text-(--brand-primary)"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <Badge variant="warning" className="rounded-full px-2 py-0.5 text-xs">
                                    {tab.count}
                                </Badge>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-12 gap-6">
                    {/* Status Breakdown */}
                    <div className="col-span-12 lg:col-span-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Events by Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Object.entries(statusBreakdown?.events || {}).map(([status, count]) => (
                                        <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium text-gray-700 capitalize">{status}</span>
                                            <Badge variant={status === 'published' ? 'success' : status === 'pending' ? 'warning' : 'secondary'}>
                                                {count}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="col-span-12 lg:col-span-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Awards by Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Object.entries(statusBreakdown?.awards || {}).map(([status, count]) => (
                                        <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium text-gray-700 capitalize">{status}</span>
                                            <Badge variant={status === 'published' ? 'success' : status === 'pending' ? 'warning' : 'secondary'}>
                                                {count}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top Performers */}
                    <div className="col-span-12">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Performers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Top Events */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Calendar size={18} className="text-blue-600" />
                                            Top Events
                                        </h4>
                                        <div className="space-y-2">
                                            {topPerformers?.events?.slice(0, 5).map((event, index) => (
                                                <div key={event.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                                                        <span className="text-sm text-gray-900">{event.title}</span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-blue-600">
                                                        {event.tickets_sold} tickets
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Top Awards */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Trophy size={18} className="text-purple-600" />
                                            Top Awards
                                        </h4>
                                        <div className="space-y-2">
                                            {topPerformers?.awards?.slice(0, 5).map((award, index) => (
                                                <div key={award.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                                                        <span className="text-sm text-gray-900">{award.title}</span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-purple-600">
                                                        {award.votes?.toLocaleString()} votes
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Top Organizers */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <UserCheck size={18} className="text-green-600" />
                                            Top Organizers
                                        </h4>
                                        <div className="space-y-2">
                                            {topPerformers?.organizers?.slice(0, 5).map((organizer, index) => (
                                                <div key={organizer.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                                                        <span className="text-sm text-gray-900">{organizer.name}</span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-green-600">
                                                        {organizer.events_count}/{organizer.awards_count}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Approvals Tab */}
            {activeTab === 'approvals' && (
                <div className="grid grid-cols-12 gap-6">
                    {/* Pending Events */}
                    <div className="col-span-12 lg:col-span-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Pending Events ({pendingApprovals?.events?.length || 0})</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {pendingApprovals?.events?.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
                                        <p>No pending events</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {pendingApprovals?.events?.map((event) => (
                                            <div key={event.id} className="p-4 border border-gray-200 rounded-lg">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            by {event.organizer_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {formatDate(event.start_time)} • Created {formatDate(event.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-3">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApproveEvent(event.id)}
                                                        disabled={processingApprovals[`event-${event.id}`]}
                                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                                    >
                                                        {processingApprovals[`event-${event.id}`] ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <>
                                                                <CheckCircle size={16} />
                                                                Approve
                                                            </>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleRejectEvent(event.id)}
                                                        disabled={processingApprovals[`event-${event.id}`]}
                                                        className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                                                    >
                                                        {processingApprovals[`event-${event.id}`] ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <>
                                                                <XCircle size={16} />
                                                                Reject
                                                            </>
                                                        )}
                                                    </Button>
                                                    <Link to={`/events/${event.slug}`}>
                                                        <Button size="sm" variant="ghost">
                                                            <Eye size={16} />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Pending Awards */}
                    <div className="col-span-12 lg:col-span-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Pending Awards ({pendingApprovals?.awards?.length || 0})</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {pendingApprovals?.awards?.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
                                        <p>No pending awards</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {pendingApprovals?.awards?.map((award) => (
                                            <div key={award.id} className="p-4 border border-gray-200 rounded-lg">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900">{award.title}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            by {award.organizer_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {formatDate(award.ceremony_date)} • Created {formatDate(award.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-3">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApproveAward(award.id)}
                                                        disabled={processingApprovals[`award-${award.id}`]}
                                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                                    >
                                                        {processingApprovals[`award-${award.id}`] ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <>
                                                                <CheckCircle size={16} />
                                                                Approve
                                                            </>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleRejectAward(award.id)}
                                                        disabled={processingApprovals[`award-${award.id}`]}
                                                        className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                                                    >
                                                        {processingApprovals[`award-${award.id}`] ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <>
                                                                <XCircle size={16} />
                                                                Reject
                                                            </>
                                                        )}
                                                    </Button>
                                                    <Link to={`/awards/${award.slug}`}>
                                                        <Button size="sm" variant="ghost">
                                                            <Eye size={16} />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Recent Activity Tab */}
            {activeTab === 'activity' && (
                <div className="grid grid-cols-12 gap-6">
                    {/* Recent Orders */}
                    <div className="col-span-12 lg:col-span-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Orders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentActivity?.orders?.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <ShoppingCart size={32} className="mx-auto mb-2" />
                                        <p>No recent orders</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {recentActivity?.orders?.map((order) => (
                                            <div key={order.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{order.order_number}</p>
                                                        <p className="text-sm text-gray-600">{order.user_name}</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {formatDate(order.created_at)} • {order.items_count} items
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">
                                                            {adminService.formatCurrency(order.total_amount)}
                                                        </p>
                                                        <Badge variant={order.status === 'paid' ? 'success' : 'secondary'} className="mt-1">
                                                            {order.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Votes */}
                    <div className="col-span-12 lg:col-span-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Votes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentActivity?.votes?.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Trophy size={32} className="mx-auto mb-2" />
                                        <p>No recent votes</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {recentActivity?.votes?.map((vote) => (
                                            <div key={vote.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{vote.nominee_name}</p>
                                                        <p className="text-sm text-gray-600">{vote.category_name}</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {formatDate(vote.created_at)} • {vote.voter_email}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-purple-600">
                                                            {vote.number_of_votes} {vote.number_of_votes === 1 ? 'vote' : 'votes'}
                                                        </p>
                                                        <Badge variant={vote.status === 'paid' ? 'success' : 'secondary'} className="mt-1">
                                                            {vote.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
