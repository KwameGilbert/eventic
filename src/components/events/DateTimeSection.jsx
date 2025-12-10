import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const DateTimeSection = ({ eventData, handleEventChange }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar size={20} className="text-(--brand-primary)" />
                    Date & Time
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Start Date *
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={eventData.startDate}
                            onChange={handleEventChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            End Date *
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={eventData.endDate}
                            onChange={handleEventChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Start Time *
                        </label>
                        <input
                            type="time"
                            name="startTime"
                            value={eventData.startTime}
                            onChange={handleEventChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            End Time *
                        </label>
                        <input
                            type="time"
                            name="endTime"
                            value={eventData.endTime}
                            onChange={handleEventChange}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                            required
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DateTimeSection;
