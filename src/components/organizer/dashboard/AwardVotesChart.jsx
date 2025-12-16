import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

const AwardVotesChart = ({ weeklyData = [] }) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Award Votes Trend</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Award className="w-4 h-4" />
                        <span>Last 7 Days</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {weeklyData && weeklyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 12 }}
                                stroke="#888"
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                stroke="#888"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="votes"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Votes"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[250px] flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No vote data available</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

AwardVotesChart.propTypes = {
    weeklyData: PropTypes.arrayOf(
        PropTypes.shape({
            day: PropTypes.string,
            votes: PropTypes.number
        })
    )
};

export default AwardVotesChart;

