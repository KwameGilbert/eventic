import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';

const TicketSalesDonut = ({ data, period = "This Week" }) => {
    const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a855f7', '#ec4899'];
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base">Ticket Type Sales</CardTitle>
                        <p className="text-xs text-gray-500 mt-0.5">Sales breakdown by ticket type</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                        {period} ↓
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center">
                    {/* Donut Chart */}
                    <div className="relative w-44 h-44">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            className="hover:opacity-80 transition-opacity cursor-pointer"
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xs text-gray-500">Total Sold</span>
                            <span className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 w-full">
                        {data.map((item, index) => {
                            const percentage = Math.round((item.value / total) * 100);
                            return (
                                <div key={index} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 truncate">{item.name}</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {item.value.toLocaleString()}
                                            <span className="text-xs text-gray-400 ml-1">{percentage}%</span>
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TicketSalesDonut;
