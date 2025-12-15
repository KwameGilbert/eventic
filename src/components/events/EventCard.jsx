import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';

/**
 * Event Card Component
 * Displays event summary in grid/list views
 */
const EventCard = ({ event, viewMode = 'grid' }) => {
    const isGridView = viewMode === 'grid';

    // Format date for display
    const formatEventDate = (dateString) => {
        if (!dateString) return { month: '---', day: '--', fullDate: 'TBA' };
        const date = new Date(dateString);
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const day = date.getDate();
        const fullDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        return { month, day, fullDate };
    };

    const { month, day, fullDate } = formatEventDate(event.date);

    if (isGridView) {
        return (
            <Link
                to={`/event/${event.eventSlug}`}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group block"
            >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img
                        src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80';
                        }}
                    />

                    {/* Category Badge - Top Left */}
                    {event.categoryName && (
                        <div className="absolute top-3 left-3">
                            <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                                {event.categoryName}
                            </span>
                        </div>
                    )}

                    {/* Date Badge - Top Right */}
                    <div className="absolute top-3 right-3 bg-white rounded-lg overflow-hidden shadow-md">
                        <div className="bg-(--brand-primary) text-white text-xs font-bold px-3 py-1 text-center">
                            {month}
                        </div>
                        <div className="bg-white text-gray-900 text-xl font-bold px-3 py-1 text-center">
                            {day}
                        </div>
                    </div>
                </div>

                {/* Event Details */}
                <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-(--brand-primary) transition-colors line-clamp-2">
                        {event.title}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400 shrink-0" />
                            <span className="truncate">{event.venue || event.location || 'TBA'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400 shrink-0" />
                            <span>{event.date} {event.time ? `• ${event.time}` : ''}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-lg font-bold text-(--brand-primary)">
                            {event.price || 'Free'}
                        </span>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-(--brand-primary) transition-colors">
                            View Details →
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    // List View
    return (
        <Link
            to={`/event/${event.eventSlug}`}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-(--brand-primary)/20 flex"
        >
            {/* Event Image */}
            <div className="relative w-48 shrink-0 overflow-hidden bg-gray-200">
                <img
                    src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80';
                    }}
                />
            </div>

            {/* Event Details */}
            <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-(--brand-primary) transition-colors">
                            {event.title}
                        </h3>
                        {event.categoryName && (
                            <span className="ml-4 bg-gray-100 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full shrink-0">
                                {event.categoryName}
                            </span>
                        )}
                    </div>

                    {event.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {event.description}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            <span>{fullDate}</span>
                        </div>
                        {event.time && (
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" />
                                <span>{event.time}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span>{event.venue || event.location || 'TBA'}</span>
                        </div>
                        {event.attendees && (
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-gray-400" />
                                <span>{event.attendees} attendees</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-lg font-bold text-(--brand-primary)">
                        {event.price || 'Free'}
                    </span>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-(--brand-primary) transition-colors">
                        View Details →
                    </span>
                </div>
            </div>
        </Link>
    );
};

EventCard.propTypes = {
    event: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        eventSlug: PropTypes.string,
        image: PropTypes.string,
        description: PropTypes.string,
        categoryName: PropTypes.string,
        date: PropTypes.string,
        time: PropTypes.string,
        venue: PropTypes.string,
        location: PropTypes.string,
        price: PropTypes.string,
        attendees: PropTypes.number,
    }).isRequired,
    viewMode: PropTypes.oneOf(['grid', 'list']),
};

export default EventCard;
