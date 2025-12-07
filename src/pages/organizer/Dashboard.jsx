import React, { useState, useEffect } from 'react';
import { Calendar, ShoppingBag, TicketCheck, DollarSign, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/organizer/dashboard/StatCard';
import TicketSalesDonut from '../../components/organizer/dashboard/TicketSalesDonut';
import SalesRevenueChart from '../../components/organizer/dashboard/SalesRevenueChart';
import RecentActivities from '../../components/organizer/dashboard/RecentActivities';
import RecentOrders from '../../components/organizer/dashboard/RecentOrders';
import EventCalendar from '../../components/organizer/dashboard/EventCalendar';
import organizerService from '../../services/organizerService';

// Icon mapping for stats
const iconMap = {
    'Total Events': Calendar,
    'Total Orders': ShoppingBag,
    'Tickets Sold': TicketCheck,
    'Total Revenue': DollarSign,
};

// Color mapping for stats
const colorMap = {
    'Total Events': '#3b82f6',
    'Total Orders': '#8b5cf6',
    'Tickets Sold': '#22c55e',
    'Total Revenue': '#f97316',
};

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await organizerService.getDashboard();

                // Handle the API response structure
                const data = response?.data || response;

                // Add icons and colors to stats
                if (data.stats) {
                    data.stats = data.stats.map(stat => ({
                        ...stat,
                        icon: iconMap[stat.label] || Calendar,
                        color: colorMap[stat.label] || '#3b82f6',
                    }));
                }

                setDashboardData(data);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError(err.message || 'Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-(--brand-primary) mx-auto mb-4" />
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-500 text-2xl">!</span>
                    </div>
                    <p className="text-gray-900 font-medium mb-2">Failed to load dashboard</p>
                    <p className="text-gray-500 text-sm mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-(--brand-primary) text-white rounded-lg text-sm hover:opacity-90"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Destructure dashboard data with defaults
    const {
        user = {},
        stats = [],
        ticketSalesData = [],
        weeklyRevenueData = [],
        monthlyRevenueData = [],
        activities = [],
        recentOrders = [],
        upcomingEvent = null,
        calendarEvents = [],
    } = dashboardData || {};

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Hello {user.firstName || 'there'}, welcome back!</p>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="col-span-12 xl:col-span-8 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <StatCard key={index} {...stat} />
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TicketSalesDonut data={ticketSalesData} />
                        <SalesRevenueChart weeklyData={weeklyRevenueData} monthlyData={monthlyRevenueData} />
                    </div>

                    {/* Recent Activities & Orders */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RecentActivities activities={activities} />
                        <RecentOrders orders={recentOrders} />
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-12 xl:col-span-4 space-y-6">
                    {/* Upcoming Event */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Upcoming Event</h3>
                            <button className="text-gray-400 hover:text-gray-600">•••</button>
                        </div>

                        {upcomingEvent ? (
                            <>
                                <div className="relative rounded-xl overflow-hidden mb-4">
                                    <img
                                        src={upcomingEvent.image}
                                        alt={upcomingEvent.title}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
                                        {upcomingEvent.category}
                                    </span>
                                    <div className="absolute bottom-3 left-3 right-3 text-white">
                                        <h4 className="font-bold text-lg">{upcomingEvent.title}</h4>
                                        <p className="text-xs text-white/80 mt-1">{upcomingEvent.location}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mb-4">
                                    {upcomingEvent.description}
                                </p>
                                <div className="flex items-center justify-between text-sm mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-(--brand-primary)/10 flex items-center justify-center">
                                            <Calendar size={12} className="text-(--brand-primary)" />
                                        </div>
                                        <span className="text-gray-600">{upcomingEvent.date}</span>
                                    </div>
                                    <span className="text-gray-400">{upcomingEvent.time}</span>
                                </div>
                                <Link
                                    to={`/organizer/events/${upcomingEvent.id}`}
                                    className="block w-full py-2.5 bg-(--brand-primary) text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-colors text-center"
                                >
                                    View Details
                                </Link>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar size={24} className="text-gray-400" />
                                </div>
                                <p className="text-gray-500 mb-4">No upcoming events</p>
                                <Link
                                    to="/organizer/events/create"
                                    className="inline-block px-4 py-2 bg-(--brand-primary) text-white rounded-lg text-sm font-semibold hover:opacity-90"
                                >
                                    Create Event
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Calendar */}
                    <EventCalendar events={calendarEvents} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
