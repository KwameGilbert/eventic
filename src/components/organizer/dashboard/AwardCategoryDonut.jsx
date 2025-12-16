import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899', '#6366f1'];

const AwardCategoryDonut = ({ data = [] }) => {
    const hasData = data && data.length > 0 && data.some(item => item.value > 0);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Votes by Category</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Trophy className="w-4 h-4" />
                        <span>All Time</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {hasData ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '12px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[250px] flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No category data available</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

AwardCategoryDonut.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        })
    ),
};

export default AwardCategoryDonut;
