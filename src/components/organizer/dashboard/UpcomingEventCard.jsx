import React from 'react';
import { Clock, MapPin, ArrowRight } from 'lucide-react';

const UpcomingEventCard = ({ event }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Upcoming Event</h3>
                <button className="text-gray-400 hover:text-gray-600">•••</button>
            </div>

            <div className="relative">
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800">
                        {event.category}
                    </span>
                </div>

                {/* Event Info */}
                <div className="p-4">
                    <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                        {event.name}
                    </h4>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {event.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-(--brand-primary)/10 flex items-center justify-center">
                                <Clock size={12} className="text-(--brand-primary)" />
                            </div>
                            <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-(--brand-primary)/10 flex items-center justify-center">
                                <MapPin size={12} className="text-(--brand-primary)" />
                            </div>
                            <span className="truncate">{event.time}</span>
                        </div>
                    </div>

                    <button className="w-full py-2.5 bg-(--brand-primary) text-white rounded-lg text-sm font-semibold hover:bg-(--brand-primary)/90 transition-colors flex items-center justify-center gap-2">
                        View Details
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpcomingEventCard;
