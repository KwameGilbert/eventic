import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { MessageSquare, UserPlus, Calendar, Bell, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

const RecentActivities = ({ activities }) => {
    const getActivityIcon = (type) => {
        switch (type) {
            case 'event': return Calendar;
            case 'refund': return AlertTriangle;
            case 'feedback': return MessageSquare;
            case 'signup': return UserPlus;
            default: return Bell;
        }
    };

    const getActivityStyle = (type) => {
        switch (type) {
            case 'event': return { bg: 'bg-blue-100', text: 'text-blue-600' };
            case 'refund': return { bg: 'bg-red-100', text: 'text-red-600' };
            case 'feedback': return { bg: 'bg-purple-100', text: 'text-purple-600' };
            case 'signup': return { bg: 'bg-green-100', text: 'text-green-600' };
            default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
        }
    };

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Recent Activities</CardTitle>
                    <Button variant="link" size="sm" className="text-xs">
                        See Details
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {/* Activity Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="success">Webinar</Badge>
                    <Badge variant="purple">Concert</Badge>
                    <Badge className="bg-(--brand-primary)/10 text-(--brand-primary) border-0">
                        Meetup
                    </Badge>
                </div>

                {/* Event Update Header */}
                <div className="mb-4">
                    <p className="text-xs text-gray-500">Event Update</p>
                    <p className="text-sm text-gray-900">
                        <span className="font-semibold">John</span> created a new event: Music Fest
                    </p>
                </div>

                {/* Activities List */}
                <div className="space-y-3">
                    {activities.map((activity, index) => {
                        const Icon = getActivityIcon(activity.type);
                        const style = getActivityStyle(activity.type);

                        return (
                            <div
                                key={index}
                                className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                            >
                                <div className={cn(
                                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                                    style.bg
                                )}>
                                    <Icon size={16} className={style.text} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 group-hover:text-(--brand-primary) transition-colors">
                                        <span className="font-semibold">{activity.title}</span>
                                        {' '}{activity.description}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* View More */}
                <Button
                    variant="ghost"
                    className="w-full mt-4 text-gray-600 hover:text-(--brand-primary)"
                >
                    View more activities
                    <ArrowRight size={14} />
                </Button>
            </CardContent>
        </Card>
    );
};

export default RecentActivities;
