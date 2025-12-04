import React from 'react';
import { Calendar, ShoppingBag, TicketCheck, DollarSign } from 'lucide-react';
import StatCard from '../../components/organizer/dashboard/StatCard';
import TicketSalesDonut from '../../components/organizer/dashboard/TicketSalesDonut';
import SalesRevenueChart from '../../components/organizer/dashboard/SalesRevenueChart';
import RecentActivities from '../../components/organizer/dashboard/RecentActivities';
import RecentOrders from '../../components/organizer/dashboard/RecentOrders';
import EventCalendar from '../../components/organizer/dashboard/EventCalendar';

const Dashboard = () => {
    // Stats data
    const stats = [
        {
            label: 'Total Events',
            value: '48',
            change: '12%',
            icon: Calendar,
            color: '#3b82f6',
            trend: 'up',
            ringProgress: 72
        },
        {
            label: 'Total Orders',
            value: '2,847',
            change: '18%',
            icon: ShoppingBag,
            color: '#8b5cf6',
            trend: 'up',
            ringProgress: 85
        },
        {
            label: 'Tickets Sold',
            value: '5,293',
            change: '24%',
            icon: TicketCheck,
            color: '#22c55e',
            trend: 'up',
            ringProgress: 78
        },
        {
            label: 'Total Revenue',
            value: '$128,450',
            change: '32%',
            icon: DollarSign,
            color: '#f97316',
            trend: 'up',
            ringProgress: 90
        },
    ];

    // Ticket type sales data (This Week)
    const ticketSalesData = [
        { name: 'VIP', value: 302 },
        { name: 'Regular', value: 845 },
        { name: 'Early Bird', value: 423 },
        { name: 'Student', value: 198 },
    ];

    // Sales revenue data - Weekly
    const weeklyRevenueData = [
        { day: 'Mon', revenue: 8 },
        { day: 'Tue', revenue: 12 },
        { day: 'Wed', revenue: 15 },
        { day: 'Thu', revenue: 9 },
        { day: 'Fri', revenue: 18 },
        { day: 'Sat', revenue: 22 },
        { day: 'Sun', revenue: 14 },
    ];

    // Sales revenue data - Monthly
    const monthlyRevenueData = [
        { month: 'Jan', revenue: 25 },
        { month: 'Feb', revenue: 35 },
        { month: 'Mar', revenue: 28 },
        { month: 'Apr', revenue: 45 },
        { month: 'May', revenue: 38 },
        { month: 'Jun', revenue: 52 },
        { month: 'Jul', revenue: 48 },
        { month: 'Aug', revenue: 55 },
    ];

    // Recent activities data
    const activities = [
        {
            type: 'refund',
            title: '5 attendees',
            description: 'requested refunds',
            time: 'Mon, Feb 24 · 3:12 PM'
        },
        {
            type: 'feedback',
            title: '12 guests',
            description: 'left feedback in ABC concert',
            time: 'Mon, Feb 24 · 3:45 PM'
        },
        {
            type: 'signup',
            title: '2 events',
            description: 'are over capacity',
            time: 'Mon, Feb 24 · 4:18 PM'
        }
    ];

    // Calendar events
    const calendarEvents = [
        {
            day: '3',
            dayName: 'Sat',
            name: 'Panel Discussion',
            category: 'Technology',
            time: '10:00 AM - 12:00 PM'
        },
        {
            day: '5',
            dayName: 'Mon',
            name: 'Live Concert',
            category: 'Music',
            time: '6:00 PM - 11:00 PM'
        },
        {
            day: '23',
            dayName: 'Wed',
            name: 'Fashion Showcase',
            category: 'Fashion',
            time: '2:00 PM - 8:00 PM'
        }
    ];

    // Recent orders data
    const recentOrders = [
        {
            customer: 'Sarah Johnson',
            event: 'Summer Music Festival',
            tickets: 3,
            amount: 180,
            status: 'Completed',
            time: '2 min ago'
        },
        {
            customer: 'Michael Chen',
            event: 'Tech Conference 2024',
            tickets: 2,
            amount: 250,
            status: 'Completed',
            time: '15 min ago'
        },
        {
            customer: 'Emma Davis',
            event: 'Art Exhibition Opening',
            tickets: 1,
            amount: 45,
            status: 'Pending',
            time: '32 min ago'
        },
        {
            customer: 'James Wilson',
            event: 'Food & Wine Tasting',
            tickets: 4,
            amount: 280,
            status: 'Completed',
            time: '1 hr ago'
        },
        {
            customer: 'Olivia Martinez',
            event: 'Summer Music Festival',
            tickets: 2,
            amount: 120,
            status: 'Completed',
            time: '2 hr ago'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Hello Tife, welcome back!</p>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="col-span-12 xl:col-span-8 space-y-6">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <StatCard key={index} {...stat} />
                        ))}
                    </div>

                    {/* Charts Row */}
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
                    {/* Quick Stats Summary */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Upcoming Event</h3>
                            <button className="text-gray-400 hover:text-gray-600">•••</button>
                        </div>
                        <div className="relative rounded-xl overflow-hidden mb-4">
                            <img src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=200&fit=crop"
                                alt="Upcoming Event"
                                className="w-full h-40 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
                                Music
                            </span>
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                                <h4 className="font-bold text-lg">Rhythm & Beats Music Festival</h4>
                                <p className="text-xs text-white/80 mt-1">Sunset Park, Los Angeles, CA</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            Immerse yourself in electrifying performances by world-renowned artists.
                        </p>
                        <div className="flex items-center justify-between text-sm mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-(--brand-primary)/10 flex items-center justify-center">
                                    <Calendar size={12} className="text-(--brand-primary)" />
                                </div>
                                <span className="text-gray-600">Apr 20, 2029</span>
                            </div>
                            <span className="text-gray-400">12:00 PM - 11:00 PM</span>
                        </div>
                        <button className="w-full py-2.5 bg-(--brand-primary) text-white rounded-lg text-sm font-semibold hover:bg-(--brand-primary)/90 transition-colors">
                            View Details
                        </button>
                    </div>

                    {/* Calendar */}
                    <EventCalendar events={calendarEvents} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
