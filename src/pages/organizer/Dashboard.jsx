import React from 'react';
import { Calendar, ShoppingBag, Users, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const stats = [
        { label: 'Total Events', value: '12', icon: Calendar, color: 'bg-blue-500' },
        { label: 'Total Orders', value: '1,234', icon: ShoppingBag, color: 'bg-purple-500' },
        { label: 'Total Attendees', value: '3,567', icon: Users, color: 'bg-green-500' },
        { label: 'Total Revenue', value: '$45,678', icon: DollarSign, color: 'bg-orange-500' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your events.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white shadow-lg shadow-gray-200`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Placeholder */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Revenue Analytics</h2>
                        <button className="text-sm text-(--brand-primary) font-medium hover:underline">View Report</button>
                    </div>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
                        <div className="text-center text-gray-400">
                            <TrendingUp size={32} className="mx-auto mb-2" />
                            <p>Chart Visualization Placeholder</p>
                        </div>
                    </div>
                </div>

                {/* Recent Orders Placeholder */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h2>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                                    JD
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                                    <p className="text-xs text-gray-500">Bought 2 tickets</p>
                                </div>
                                <span className="text-sm font-semibold text-green-600">+$120</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
