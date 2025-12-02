import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

const UpcomingEvents = ({ events }) => {
    const formatEventDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const day = date.getDate();
        return { month, day };
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
                <p className="text-gray-600">Discover amazing events happening near you</p>
            </div>

            {/* Event Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => {
                    const { month, day } = formatEventDate(event.date);

                    return (
                        <div
                            key={event.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            {/* Event Image */}
                            <div className="relative h-48 overflow-hidden bg-gray-200">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />

                                {/* Category Badge - Top Left */}
                                <div className="absolute top-3 left-3">
                                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                                        {event.category}
                                    </span>
                                </div>

                                {/* Date Badge - Top Right */}
                                <div className="absolute top-3 right-3 bg-white rounded-lg overflow-hidden shadow-md">
                                    <div className="bg-[var(--brand-primary)] text-white text-xs font-bold px-3 py-1 text-center">
                                        {month}
                                    </div>
                                    <div className="bg-white text-gray-900 text-xl font-bold px-3 py-1 text-center">
                                        {day}
                                    </div>
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="p-5">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[var(--brand-primary)] transition-colors">
                                    {event.title}
                                </h3>

                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                                        <span>{event.venue}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                                        <span>{event.date} • {event.time}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-lg font-bold text-[var(--brand-primary)]">
                                        {event.price}
                                    </span>
                                    <button className="text-sm font-semibold text-gray-700 hover:text-[var(--brand-primary)] transition-colors">
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* View All Button */}
            <div className="mt-10 text-center">
                <button className="bg-[var(--brand-primary)] hover:opacity-90 text-white font-semibold py-3 px-8 rounded-full transition-opacity">
                    View All Events
                </button>
            </div>
        </div>
    );
};

export default UpcomingEvents;
