import React, { useState, useEffect } from 'react';
import {
    Users,
    Calendar,
    Trophy,
    DollarSign,
    TrendingUp,
    Ticket,
    Vote,
    Building2,
    MapPin,
    ShoppingCart,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    PieChart,
    Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import adminService from '../../services/adminService';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState('30days');

    const periods = [
        { value: '7days', label: '7 Days' },
        { value: '30days', label: '30 Days' },
        { value: '90days', label: '90 Days' },
        { value: '12months', label: '12 Months' },
        { value: 'all', label: 'All Time' },
    ];

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminService.getAnalytics({ period });
            console.log('Analytics Response:', response);

            // Check if response exists and has the expected structure
            if (response && response.data) {
                if (response.success) {
                    console.log('Setting analytics data:', response.data.data);
                    setData(response.data);
                } else {
                    console.error('API returned success: false', response.data);
                    setError(response.message || 'Failed to load analytics data');
                }
            } else {
                console.error('Unexpected response structure:', response);
                setError('Invalid response format');
            }
        } catch (err) {
            console.error('Analytics fetch error:', err);
            setError(err.message || 'Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const formatCurrency = (amount) => {
        return `GH₵${(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatCompactCurrency = (amount) => {
        if (amount >= 1000000) {
            return `GH₵${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `GH₵${(amount / 1000).toFixed(1)}K`;
        }
        return `GH₵${amount?.toFixed(0) || 0}`;
    };

    const formatNumber = (num) => {
        return (num || 0).toLocaleString();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getGrowthBadge = (growth) => {
        if (growth > 0) {
            return (
                <Badge className="bg-green-100 text-green-700 gap-1">
                    <ArrowUpRight size={12} />
                    +{growth}%
                </Badge>
            );
        } else if (growth < 0) {
            return (
                <Badge className="bg-red-100 text-red-700 gap-1">
                    <ArrowDownRight size={12} />
                    {growth}%
                </Badge>
            );
        }
        return (
            <Badge className="bg-gray-100 text-gray-700">
                0%
            </Badge>
        );
    };

    const getStatusColor = (status) => {
        const colors = {
            published: 'bg-green-500',
            draft: 'bg-gray-400',
            pending: 'bg-yellow-500',
            cancelled: 'bg-red-500',
            completed: 'bg-blue-500',
            closed: 'bg-purple-500',
        };
        return colors[status] || 'bg-gray-400';
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-red-600">{error}</p>
                <Button onClick={fetchAnalytics} variant="outline" className="gap-2">
                    <RefreshCw size={16} />
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                        <Clock size={14} />
                        {data?.period?.start && data?.period?.end && (
                            <>
                                {formatDate(data.period.start)} - {formatDate(data.period.end)}
                                <span className="text-gray-400">•</span>
                                {data.period.days} days
                            </>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Period Selector */}
                    <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto">
                        {periods.map((p) => (
                            <button
                                key={p.value}
                                onClick={() => setPeriod(p.value)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${period === p.value
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    <Button
                        onClick={fetchAnalytics}
                        variant="outline"
                        size="icon"
                        disabled={loading}
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Total Users</p>
                                <p className="text-3xl font-bold mt-1">{formatNumber(data?.overview?.total_users)}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm text-blue-100">+{formatNumber(data?.users?.new_users)} new</span>
                                    {getGrowthBadge(data?.users?.growth)}
                                </div>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Users size={28} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Revenue</p>
                                <p className="text-3xl font-bold mt-1">{formatCompactCurrency(data?.revenue?.total)}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    {getGrowthBadge(data?.revenue?.growth)}
                                </div>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <DollarSign size={28} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Ticket Events</p>
                                <p className="text-3xl font-bold mt-1">{formatNumber(data?.overview?.total_events)}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm text-purple-100">+{formatNumber(data?.events?.new_events)} new</span>
                                    {getGrowthBadge(data?.events?.growth)}
                                </div>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Calendar size={28} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm">Award Events</p>
                                <p className="text-3xl font-bold mt-1">{formatNumber(data?.overview?.total_awards)}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm text-orange-100">+{formatNumber(data?.awards?.new_awards)} new</span>
                                    {getGrowthBadge(data?.awards?.growth)}
                                </div>
                            </div>
                            <div className="bg-white/20 p-3 rounded-xl">
                                <Trophy size={28} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Trend Chart */}
            {data?.revenue?.daily_trend?.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <TrendingUp size={20} className="text-gray-500" />
                                Revenue Trend
                            </span>
                            <span className="text-2xl font-bold text-green-600">{formatCurrency(data?.revenue?.total)}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex items-end gap-1">
                            {data?.revenue?.daily_trend?.map((day) => {
                                const maxValue = Math.max(...data.revenue.daily_trend.map(d => d.total), 1);
                                const ticketHeight = maxValue > 0 ? (day.tickets / maxValue) * 100 : 0;
                                const voteHeight = maxValue > 0 ? (day.votes / maxValue) * 100 : 0;

                                return (
                                    <div
                                        key={day.date}
                                        className="flex-1 flex flex-col justify-end gap-0.5 group relative"
                                    >
                                        <div
                                            className="bg-blue-500 rounded-t transition-all hover:bg-blue-400"
                                            style={{ height: `${Math.max(ticketHeight, day.tickets > 0 ? 4 : 0)}%` }}
                                        />
                                        <div
                                            className="bg-purple-500 rounded-t transition-all hover:bg-purple-400"
                                            style={{ height: `${Math.max(voteHeight, day.votes > 0 ? 4 : 0)}%` }}
                                        />
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                            <p className="font-medium">{formatDate(day.date)}</p>
                                            <p>Tickets: {formatCurrency(day.tickets)}</p>
                                            <p>Votes: {formatCurrency(day.votes)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-blue-500"></div>
                                <span className="text-gray-600">Ticket Sales ({formatCurrency(data?.revenue?.tickets)})</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-purple-500"></div>
                                <span className="text-gray-600">Award Votes ({formatCurrency(data?.revenue?.votes)})</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Transaction Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <ShoppingCart size={24} className="mx-auto text-blue-500 mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(data?.transactions?.total_orders)}</p>
                        <p className="text-sm text-gray-500">Orders</p>
                        {getGrowthBadge(data?.transactions?.orders_growth)}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Ticket size={24} className="mx-auto text-green-500 mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(data?.transactions?.tickets_sold)}</p>
                        <p className="text-sm text-gray-500">Tickets Sold</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Vote size={24} className="mx-auto text-purple-500 mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{formatNumber(data?.transactions?.votes_cast)}</p>
                        <p className="text-sm text-gray-500">Votes Cast</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <DollarSign size={24} className="mx-auto text-yellow-500 mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(data?.transactions?.avg_order_value)}</p>
                        <p className="text-sm text-gray-500">Avg Order Value</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <TrendingUp size={24} className="mx-auto text-red-500 mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{data?.transactions?.conversion_rate || 0}%</p>
                        <p className="text-sm text-gray-500">Conversion Rate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Breakdown & Users by Role */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Revenue by Source */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart size={20} className="text-gray-500" />
                            Revenue by Source
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-gray-700">Ticket Sales</span>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">{formatCurrency(data?.revenue?.tickets)}</p>
                                <p className="text-xs text-gray-500">
                                    {data?.revenue?.total > 0
                                        ? Math.round((data?.revenue?.tickets / data?.revenue?.total) * 100)
                                        : 0}%
                                </p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                                style={{
                                    width: `${data?.revenue?.total > 0
                                        ? (data?.revenue?.tickets / data?.revenue?.total) * 100
                                        : 0}%`
                                }}
                            ></div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span className="text-sm text-gray-700">Award Votes</span>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">{formatCurrency(data?.revenue?.votes)}</p>
                                <p className="text-xs text-gray-500">
                                    {data?.revenue?.total > 0
                                        ? Math.round((data?.revenue?.votes / data?.revenue?.total) * 100)
                                        : 0}%
                                </p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                                style={{
                                    width: `${data?.revenue?.total > 0
                                        ? (data?.revenue?.votes / data?.revenue?.total) * 100
                                        : 0}%`
                                }}
                            ></div>
                        </div>

                        <div className="mt-6 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700">Total Revenue</span>
                                <span className="text-xl font-bold text-gray-900">{formatCurrency(data?.revenue?.total)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Users by Role */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users size={20} className="text-gray-500" />
                            Users by Role
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Object.entries(data?.users?.by_role || {}).map(([role, count]) => {
                                const total = Object.values(data?.users?.by_role || {}).reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? (count / total) * 100 : 0;
                                const colors = {
                                    attendee: 'bg-blue-500',
                                    organizer: 'bg-green-500',
                                    admin: 'bg-red-500',
                                    super_admin: 'bg-purple-500',
                                    support: 'bg-yellow-500',
                                    scanner: 'bg-cyan-500',
                                    pos: 'bg-orange-500',
                                };
                                return (
                                    <div key={role}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${colors[role] || 'bg-gray-500'}`}></div>
                                                <span className="text-sm text-gray-700 capitalize">{role.replace('_', ' ')}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-semibold text-gray-900">{formatNumber(count)}</span>
                                                <span className="text-xs text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`${colors[role] || 'bg-gray-500'} h-2 rounded-full transition-all duration-500`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Status Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Events by Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar size={20} className="text-gray-500" />
                            Events by Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {Object.entries(data?.events?.by_status || {}).map(([status, count]) => (
                                <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} mx-auto mb-2`}></div>
                                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                                    <p className="text-sm text-gray-500 capitalize">{status}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Awards by Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy size={20} className="text-gray-500" />
                            Awards by Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {Object.entries(data?.awards?.by_status || {}).map(([status, count]) => (
                                <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} mx-auto mb-2`}></div>
                                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                                    <p className="text-sm text-gray-500 capitalize">{status}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Performers */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Events */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp size={20} className="text-gray-500" />
                            Top Performing Events
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data?.events?.top_performing?.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No event data available</p>
                        ) : (
                            <div className="space-y-3">
                                {data?.events?.top_performing?.slice(0, 5).map((event, index) => (
                                    <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-sm font-bold text-gray-600 shrink-0">
                                            {index + 1}
                                        </div>
                                        {event.banner_image ? (
                                            <img
                                                src={event.banner_image}
                                                alt=""
                                                className="w-12 h-12 rounded-lg object-cover shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shrink-0">
                                                <Calendar size={20} className="text-white" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{event.title}</p>
                                            <p className="text-sm text-gray-500">{formatNumber(event.tickets_sold)} tickets sold</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-semibold text-green-600">{formatCurrency(event.revenue)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Awards */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy size={20} className="text-gray-500" />
                            Top Performing Awards
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data?.awards?.top_performing?.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No award data available</p>
                        ) : (
                            <div className="space-y-3">
                                {data?.awards?.top_performing?.slice(0, 5).map((award, index) => (
                                    <div key={award.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-sm font-bold text-gray-600 shrink-0">
                                            {index + 1}
                                        </div>
                                        {award.banner_image ? (
                                            <img
                                                src={award.banner_image}
                                                alt=""
                                                className="w-12 h-12 rounded-lg object-cover shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shrink-0">
                                                <Trophy size={20} className="text-white" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{award.title}</p>
                                            <p className="text-sm text-gray-500">{formatNumber(award.total_votes)} votes</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-semibold text-green-600">{formatCurrency(award.revenue)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Geographic & Organizers */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Events by City */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin size={20} className="text-gray-500" />
                            Events by City
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data?.geographic?.events_by_city?.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No location data available</p>
                        ) : (
                            <div className="space-y-3">
                                {data?.geographic?.events_by_city?.map((city) => {
                                    const maxCount = data?.geographic?.events_by_city?.[0]?.count || 1;
                                    const percentage = (city.count / maxCount) * 100;
                                    return (
                                        <div key={city.city}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-gray-700">{city.city || 'Unknown'}</span>
                                                <span className="font-semibold text-gray-900">{city.count} {city.count === 1 ? 'event' : 'events'}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Organizers */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 size={20} className="text-gray-500" />
                            Top Organizers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data?.top_organizers?.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No organizer data available</p>
                        ) : (
                            <div className="space-y-3">
                                {data?.top_organizers?.slice(0, 5).map((org) => (
                                    <div key={org.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
                                            {org.logo ? (
                                                <img src={org.logo} alt="" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                org.name?.charAt(0) || 'O'
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{org.name}</p>
                                            <p className="text-sm text-gray-500">{org.events_count} {org.events_count === 1 ? 'event' : 'events'}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-semibold text-green-600">{formatCurrency(org.revenue)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Events by Type */}
            {data?.events?.by_type?.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 size={20} className="text-gray-500" />
                            Events by Category
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {data?.events?.by_type?.map((type, index) => {
                                const colors = [
                                    'bg-blue-500', 'bg-green-500', 'bg-purple-500',
                                    'bg-yellow-500', 'bg-red-500', 'bg-cyan-500'
                                ];
                                return (
                                    <div key={type.type} className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]} mx-auto mb-2`}></div>
                                        <p className="text-2xl font-bold text-gray-900">{type.count}</p>
                                        <p className="text-sm text-gray-500">{type.type}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Analytics;
