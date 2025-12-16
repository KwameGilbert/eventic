import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, Edit, Trash2, MoreVertical, FileText } from 'lucide-react';

const EventsTable = ({ events }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const getPercentageSold = (sold, total) => {
        return Math.round((sold / total) * 100);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Recent Events</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage and track your events</p>
                </div>
                <button className="text-sm text-(--brand-primary) font-medium hover:underline">
                    View All
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Event
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Tickets
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Sales
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {events.map((event) => {
                            const percentSold = getPercentageSold(event.soldTickets, event.totalTickets);
                            return (
                                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={event.image}
                                                alt={event.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="max-w-xs">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {event.name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-gray-600">
                                            {new Date(event.date).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">
                                            <p className="font-medium text-gray-900">
                                                {event.soldTickets} / {event.totalTickets}
                                            </p>
                                            <div className="mt-1 w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-(--brand-primary) transition-all"
                                                    style={{ width: `${percentSold}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-sm font-semibold ${percentSold >= 80 ? 'text-green-600' :
                                            percentSold >= 50 ? 'text-yellow-600' : 'text-gray-600'
                                            }`}>
                                            {percentSold}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2.5 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="relative inline-block">
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === event.id ? null : event.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <MoreVertical size={18} className="text-gray-500" />
                                            </button>
                                            {activeDropdown === event.id && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={() => setActiveDropdown(null)}
                                                    />
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                            <Eye size={16} />
                                                            View Details
                                                        </button>
                                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                            <Edit size={16} />
                                                            Edit Event
                                                        </button>
                                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                            <FileText size={16} />
                                                            Move to Draft
                                                        </button>
                                                        <hr className="my-1" />
                                                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                            <Trash2 size={16} />
                                                            Delete Event
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

EventsTable.propTypes = {
    events: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            image: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            soldTickets: PropTypes.number.isRequired,
            totalTickets: PropTypes.number.isRequired,
            status: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default EventsTable;
