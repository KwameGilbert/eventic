import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Ticket, Minus, Plus } from 'lucide-react';

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
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
                    isAnimating ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className={`relative bg-white rounded-xl shadow-2xl w-full max-w-3xl transition-all duration-300 ${
                    isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}>
                    {/* Compact Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Ticket size={20} className="text-[var(--brand-primary)]" />
                            Select Tickets
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Compact Event Info */}
                    <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-2 text-base">{event.title}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-gray-400" />
                                <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-gray-400" />
                                <span>{event.venue}, {event.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Ticket Types - Scrollable */}
                    <div className="px-5 py-4 max-h-[50vh] overflow-y-auto">
                        {event.ticketTypes && event.ticketTypes.length > 0 ? (
                            <div className="space-y-3">
                                {event.ticketTypes.map((ticket, index) => {
                                    const quantity = selectedTickets[ticket.name] || 0;
                                    const isAvailable = ticket.available && (ticket.availableQuantity > 0 || !ticket.availableQuantity);

                                    return (
                                        <div
                                            key={index}
                                            className={`border-2 rounded-lg p-3.5 transition-all ${
                                                isAvailable
                                                    ? quantity > 0 
                                                        ? 'border-[var(--brand-primary)] bg-blue-50'
                                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                                    : 'border-gray-200 bg-gray-50 opacity-60'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                {/* Ticket Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <h4 className="font-bold text-gray-900 text-sm">{ticket.name}</h4>
                                                        <div className="flex items-baseline gap-1.5 ml-2">
                                                            <span className="text-lg font-bold text-[var(--brand-primary)]">
                                                                ${ticket.price}
                                                            </span>
                                                            {ticket.originalPrice && ticket.originalPrice > ticket.price && (
                                                                <span className="text-xs text-gray-400 line-through">
                                                                    ${ticket.originalPrice}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {ticket.description && (
                                                        <p className="text-xs text-gray-600 mb-2 line-clamp-1">{ticket.description}</p>
                                                    )}
                                                    
                                                    {/* Compact Info Tags */}
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {ticket.availableQuantity && (
                                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                                                {ticket.availableQuantity} left
                                                            </span>
                                                        )}
                                                        {ticket.maxPerAttendee && (
                                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                                                                Max {ticket.maxPerAttendee}
                                                            </span>
                                                        )}
                                                        {!isAvailable && (
                                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                                                                Sold Out
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Quantity Selector */}
                                                {isAvailable && (
                                                    <div className="flex flex-col items-end gap-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleQuantityChange(ticket.name, -1)}
                                                                disabled={quantity === 0}
                                                                className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                                                                    quantity === 0
                                                                        ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                                                        : 'border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white active:scale-90'
                                                                }`}
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="w-7 text-center font-bold text-gray-900 text-sm">
                                                                {quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => handleQuantityChange(ticket.name, 1)}
                                                                className="w-7 h-7 rounded-full flex items-center justify-center border border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-all active:scale-90"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                        {quantity > 0 && (
                                                            <span className="text-xs font-semibold text-gray-700">
                                                                ${ticket.price * quantity}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-12">No tickets available</p>
                        )}
                    </div>

                    {/* Compact Footer */}
                    <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between gap-4">
                            {/* Total */}
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5">Total Amount</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${getTotalAmount()}
                                    {getTotalTickets() > 0 && (
                                        <span className="text-sm text-gray-500 font-normal ml-2">
                                            {getTotalTickets()} {getTotalTickets() === 1 ? 'ticket' : 'tickets'}
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={getTotalTickets() === 0}
                                    className={`px-6 py-2.5 font-semibold text-sm rounded-lg transition-all ${
                                        getTotalTickets() === 0
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-[var(--brand-primary)] text-white hover:opacity-90 shadow-md hover:shadow-lg active:scale-95'
                                    }`}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketModal;
