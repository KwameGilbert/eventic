import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';
import { cn } from '../../../lib/utils';

const EventCalendar = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

    // Generate calendar days
    const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1).getDay();

    // Get previous month days to fill the first week
    const prevMonthDays = new Date(currentYear, currentDate.getMonth(), 0).getDate();

    const days = [];

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, isCurrentMonth: true });
    }

    // Next month days to complete the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        days.push({ day: i, isCurrentMonth: false });
    }

    const today = new Date();
    const isToday = (day) =>
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentYear === today.getFullYear();

    const eventDays = [5, 14, 23, 30]; // Days with events

    const navigateMonth = (direction) => {
        setCurrentDate(new Date(currentYear, currentDate.getMonth() + direction, 1));
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Technology': 'bg-blue-500',
            'Music': 'bg-purple-500',
            'Fashion': 'bg-pink-500',
            'Sports': 'bg-green-500'
        };
        return colors[category] || 'bg-gray-500';
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                        {currentMonth} <span className="text-[--brand-primary]">{currentYear}</span>
                    </CardTitle>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => navigateMonth(-1)}
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => navigateMonth(1)}
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center mb-4">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="text-xs font-medium text-gray-400 py-2">
                            {day}
                        </div>
                    ))}
                    {days.map((item, index) => (
                        <div
                            key={index}
                            className={cn(
                                "text-sm py-2 rounded-lg cursor-pointer transition-all relative",
                                !item.isCurrentMonth && "text-gray-300",
                                item.isCurrentMonth && "text-gray-700 hover:bg-gray-100",
                                item.isCurrentMonth && isToday(item.day) && "bg-[--brand-primary] text-white font-semibold hover:bg-[--brand-primary]/90"
                            )}
                        >
                            {item.day}
                            {item.isCurrentMonth && eventDays.includes(item.day) && !isToday(item.day) && (
                                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[--brand-primary] rounded-full" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Upcoming Events */}
                <div className="space-y-3 border-t border-gray-100 pt-4">
                    {events.slice(0, 3).map((event, index) => (
                        <div
                            key={index}
                            className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                        >
                            <div className="w-10 h-10 bg-[--brand-primary]/10 rounded-lg flex flex-col items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-[--brand-primary]">{event.day}</span>
                                <span className="text-[10px] text-[--brand-primary]/70">{event.dayName}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-[--brand-primary] transition-colors truncate">
                                    {event.name}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex items-center gap-1.5">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", getCategoryColor(event.category))} />
                                        <span className="text-xs text-gray-500">{event.category}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                        <Clock size={10} />
                                        <span>{event.time}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

EventCalendar.propTypes = {
    events: PropTypes.arrayOf(
        PropTypes.shape({
            day: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            dayName: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            category: PropTypes.string.isRequired,
            time: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default EventCalendar;
