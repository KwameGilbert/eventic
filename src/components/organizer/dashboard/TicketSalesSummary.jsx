import React from 'react';

const TicketSalesSummary = ({ events }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Ticket Sales Summary</h3>
                <button className="text-sm text-(--brand-primary) font-medium hover:underline">
                    See Details
                </button>
            </div>

            {/* Total Tickets */}
            <div className="px-4 pt-4 pb-2">
                <p className="text-4xl font-bold text-gray-900">382,495</p>
                <p className="text-sm text-gray-500">Tickets Sold</p>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-3 flex gap-2">
                <button className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-xs font-medium">
                    Top event
                </button>
                <button className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded-full text-xs font-medium transition-colors">
                    Ticket Type
                </button>
                <button className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded-full text-xs font-medium transition-colors">
                    Event Category
                </button>
            </div>

            {/* Events List */}
            <div className="px-4 pb-4 space-y-3">
                {events.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <img
                            src={event.image}
                            alt={event.name}
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{event.name}</p>
                            <p className="text-xs text-gray-500">{event.location} · {event.ticketsSold} tickets sold</p>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-(--brand-primary) rounded-full transition-all"
                                    style={{ width: `${event.percentage}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{event.percentage}%</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TicketSalesSummary;
