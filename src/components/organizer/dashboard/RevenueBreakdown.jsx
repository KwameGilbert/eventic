import React from 'react';

const RevenueBreakdown = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const values = [45, 72, 58, 85, 68, 90];
    const maxValue = Math.max(...values);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Revenue Breakdown</h3>
                <button className="text-sm text-[--brand-primary] font-medium hover:underline">
                    See details
                </button>
            </div>

            <div className="p-4">
                {/* Bar Chart */}
                <div className="h-48 flex items-end justify-between gap-3 mb-6 px-2">
                    {months.map((month, index) => (
                        <div key={month} className="flex-1 flex flex-col items-center gap-2">
                            <div
                                className="w-full bg-[--brand-primary]/20 rounded-t-lg relative overflow-hidden transition-all hover:bg-[--brand-primary]/30"
                                style={{ height: `${(values[index] / maxValue) * 100}%` }}
                            >
                                <div
                                    className="absolute bottom-0 w-full bg-[--brand-primary] rounded-t-lg transition-all"
                                    style={{ height: '100%' }}
                                />
                            </div>
                            <span className="text-xs text-gray-500">{month}</span>
                        </div>
                    ))}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-[--brand-primary] rounded-full" />
                            <span className="text-xs text-gray-500">Total Revenue Summary</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs text-gray-400">YTD Revenue</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400">Top Source</span>
                        </div>
                        <div className="flex items-baseline gap-3 mt-1">
                            <span className="text-xl font-bold text-gray-900">$85,320.00</span>
                            <span className="text-sm font-medium text-[--brand-primary]">VIP - 72%</span>
                        </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-xs text-gray-500">Month-over-Month Change</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs text-gray-400">% Growth</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400">Top Month</span>
                        </div>
                        <div className="flex items-baseline gap-3 mt-1">
                            <span className="text-xl font-bold text-green-600">+12.5%</span>
                            <span className="text-sm font-medium text-gray-600">June − $10K</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueBreakdown;
