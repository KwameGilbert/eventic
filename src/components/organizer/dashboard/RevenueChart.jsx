import React from 'react';
import { TrendingUp } from 'lucide-react';

const RevenueChart = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Revenue & Sales Analytics</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Track your earnings over time</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        7D
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-white bg-(--brand-primary) rounded-lg">
                        30D
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        90D
                    </button>
                </div>
            </div>

            <div className="h-80 bg-gradient-to-br from-orange-50 to-purple-50 rounded-xl flex items-center justify-center border border-dashed border-gray-300">
                <div className="text-center text-gray-400">
                    <TrendingUp size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Chart Visualization</p>
                    <p className="text-sm mt-1">Revenue trends will appear here</p>
                </div>
            </div>
        </div>
    );
};

export default RevenueChart;
