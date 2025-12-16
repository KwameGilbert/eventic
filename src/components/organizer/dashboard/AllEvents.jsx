import React from 'react';
import PropTypes from 'prop-types';
import { MapPin, ArrowRight } from 'lucide-react';

const AllEvents = ({ events }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900">All Events</h3>
                    <button className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors">
                        + Create event
                    </button>
                </div>
                <button className="text-sm text-(--brand-primary) font-medium hover:underline flex items-center gap-1">
                    View All Event
                    <ArrowRight size={14} />
                </button>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event, index) => (
                        <div key={index} className="group cursor-pointer">
                            <div className="relative rounded-xl overflow-hidden mb-3">
                                <img
                                    src={event.image}
                                    alt={event.name}
                                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800">
                                        {event.category}
                                    </span>
                                </div>
                            </div>
                            <h4 className="font-semibold text-gray-900 group-hover:text-(--brand-primary) transition-colors line-clamp-1">
                                {event.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <MapPin size={12} />
                                {event.location}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

AllEvents.propTypes = {
    events: PropTypes.arrayOf(
        PropTypes.shape({
            image: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            category: PropTypes.string.isRequired,
            location: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default AllEvents;

