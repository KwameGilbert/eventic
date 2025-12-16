import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { cn } from '../../../lib/utils';
import PropTypes from 'prop-types';

const SalesRevenueChart = ({ weeklyData, monthlyData }) => {
    const [period, setPeriod] = useState('monthly');

    const data = period === 'weekly' ? weeklyData : monthlyData;
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
                    <p className="text-xs text-(--brand-primary)">
                        Revenue: ${payload[0].value}K
                    </p>
                </div>
            );
        }
        return null;
    };

    CustomTooltip.propTypes = {
        active: PropTypes.bool,
        payload: PropTypes.arrayOf(PropTypes.object),
        label: PropTypes.string,
    };

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base">Sales Revenue</CardTitle>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-bold text-gray-900">
                                ${(totalRevenue * 1000).toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500">Total Revenue</span>
                        </div>
                    </div>
                    {/* Period Toggle Buttons */}
                    <div className="flex bg-gray-100 rounded-lg p-0.5">
                        <button
                            onClick={() => setPeriod('weekly')}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                period === 'weekly'
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setPeriod('monthly')}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                period === 'monthly'
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            Monthly
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barGap={2}>
                            <XAxis
                                dataKey={period === 'weekly' ? 'day' : 'month'}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#9ca3af' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#9ca3af' }}
                                tickFormatter={(value) => `${value}K`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="revenue"
                                fill="#f97316"
                                radius={[4, 4, 0, 0]}
                                name="Revenue"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

SalesRevenueChart.propTypes = {
    weeklyData: PropTypes.arrayOf(
        PropTypes.shape({
            day: PropTypes.string.isRequired,
            revenue: PropTypes.number.isRequired,
        })
    ).isRequired,
    monthlyData: PropTypes.arrayOf(
        PropTypes.shape({
            month: PropTypes.string.isRequired,
            revenue: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default SalesRevenueChart;
