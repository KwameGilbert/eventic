import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '../../ui/card';
import PropTypes from 'prop-types';

const StatCard = ({ label, value, icon: Icon, color = '#f97316', ringProgress = 75 }) => {
    const chartData = [
        { name: 'progress', value: ringProgress, fill: color },
    ];

    return (
        <Card className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
                <div className="flex items-center gap-2">
                    {/* Ring Progress Indicator using Recharts */}
                    <div className="relative w-12 h-12 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                cx="50%"
                                cy="50%"
                                innerRadius="70%"
                                outerRadius="100%"
                                barSize={6}
                                data={chartData}
                                startAngle={90}
                                endAngle={-270}
                            >
                                <RadialBar
                                    background={{ fill: '#f3f4f6' }}
                                    dataKey="value"
                                    cornerRadius={10}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${color}15` }}
                            >
                                <Icon size={16} style={{ color }} />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 font-medium">{label}</p>
                        <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

StatCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    color: PropTypes.string,
    ringProgress: PropTypes.number,
};

export default StatCard;
