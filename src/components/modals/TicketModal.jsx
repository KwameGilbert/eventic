import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Ticket, Minus, Plus, Clock } from 'lucide-react';

const TicketModal = ({ isOpen, onClose, event }) => {
    const [selectedTickets, setSelectedTickets] = useState({});
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            setTimeout(() => setShouldRender(false), 300);
        }
    }, [isOpen]);

    if (!shouldRender || !event) return null;

    const handleQuantityChange = (ticketName, change) => {
        setSelectedTickets(prev => {
            const currentQty = prev[ticketName] || 0;
            const newQty = Math.max(0, currentQty + change);

            // Check max per attendee limit
            const ticket = event.ticketTypes.find(t => t.name === ticketName);
            const maxAllowed = ticket?.maxPerAttendee || 10;

            return {
                ...prev,
                [ticketName]: Math.min(newQty, maxAllowed)
            };
        });
    };

    const getTotalAmount = () => {
        return Object.entries(selectedTickets).reduce((total, [ticketName, qty]) => {
            const ticket = event.ticketTypes.find(t => t.name === ticketName);
            return total + (ticket?.price || 0) * qty;
        }, 0);
    };

    const getTotalTickets = () => {
        return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }) + ', ' + event.time;
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className={`relative bg-white rounded-lg shadow-xl w-full max-w-2xl transition-all duration-300 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <Ticket size={20} className="text-gray-700" />
                            <h2 className="text-xl font-bold text-gray-900">Tickets</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Event Info */}
                    <div className="p-6 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">{event.title}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <span>{event.venue}, {event.location}, {event.country}</span>
                            </div>
                        </div>
                    </div>

                    {/* Ticket Types */}
                    <div className="p-6 max-h-96 overflow-y-auto">
                        {event.ticketTypes && event.ticketTypes.length > 0 ? (
                            <div className="space-y-4">
                                {event.ticketTypes.map((ticket, index) => {
                                    const quantity = selectedTickets[ticket.name] || 0;
                                    const isAvailable = ticket.available && (ticket.availableQuantity > 0 || !ticket.availableQuantity);

                                    return (
                                        <div
                                            key={index}
                                            className={`border-2 rounded-lg p-4 ${isAvailable
                                                ? 'border-gray-200 bg-white hover:border-[var(--brand-primary)] transition-colors'
                                                : 'border-gray-200 bg-gray-50 opacity-60'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 mb-1">{ticket.name}</h4>
                                                    {ticket.description && (
                                                        <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                                                    )}
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-2xl font-bold text-[var(--brand-primary)]">
                                                            ${ticket.price}
                                                        </span>
                                                        {ticket.originalPrice && ticket.originalPrice > ticket.price && (
                                                            <span className="text-sm text-gray-400 line-through">
                                                                ${ticket.originalPrice}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ticket Info */}
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {ticket.availableQuantity && (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                                        {ticket.availableQuantity} tickets left
                                                    </span>
                                                )}
                                                {ticket.maxPerAttendee && (
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                                                        {ticket.maxPerAttendee} per person
                                                    </span>
                                                )}
                                                {!isAvailable && (
                                                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                                                        Sold Out
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quantity Selector */}
                                            {isAvailable && (
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleQuantityChange(ticket.name, -1)}
                                                            disabled={quantity === 0}
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${quantity === 0
                                                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                                                : 'border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white'
                                                                }`}
                                                        >
                                                            <Minus size={16} />
                                                        </button>
                                                        <span className="w-8 text-center font-bold text-gray-900">
                                                            {quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => handleQuantityChange(ticket.name, 1)}
                                                            className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors"
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    </div>
                                                    {quantity > 0 && (
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            ${ticket.price * quantity}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No tickets available</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${getTotalAmount()}
                                    {getTotalTickets() > 0 && (
                                        <span className="text-sm text-gray-600 ml-2">
                                            ({getTotalTickets()} {getTotalTickets() === 1 ? 'ticket' : 'tickets'})
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                CLOSE
                            </button>
                            <button
                                disabled={getTotalTickets() === 0}
                                className={`flex-1 px-6 py-3 font-bold rounded-lg transition-colors ${getTotalTickets() === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-[var(--brand-primary)] text-white hover:opacity-90'
                                    }`}
                            >
                                ADD TO CART
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketModal;
