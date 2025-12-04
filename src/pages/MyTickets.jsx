import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Ticket, Calendar, MapPin, Clock, X, Download, Share2 } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';

const MyTickets = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { tickets } = useTickets();
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/signin', { state: { from: '/my-tickets' } });
        }
    }, [isAuthenticated, navigate]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
                        <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                            <Link to="/" className="hover:text-[var(--brand-primary)] flex items-center gap-1">
                                <Home size={16} />
                            </Link>
                            <ChevronRight size={16} />
                            <span>Dashboard</span>
                            <ChevronRight size={16} />
                            <span className="text-gray-900 font-medium">My Tickets</span>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {tickets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Ticket size={40} className="text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No tickets yet</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            You haven't purchased any tickets yet. Browse our events and find something you love!
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[var(--brand-primary)] hover:opacity-90 transition-all shadow-lg shadow-[var(--brand-primary)]/30"
                        >
                            Browse Events
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="relative h-48">
                                    <img
                                        src={ticket.event.image}
                                        alt={ticket.event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-white font-bold text-lg line-clamp-1">{ticket.event.title}</h3>
                                        <p className="text-white/90 text-sm font-medium">{ticket.ticketName}</p>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                                        #{ticket.id.toUpperCase()}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-[var(--brand-primary)]" />
                                            <span>{formatDate(ticket.event.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-[var(--brand-primary)]" />
                                            <span>{ticket.event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-[var(--brand-primary)]" />
                                            <span className="line-clamp-1">{ticket.event.venue}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            Valid Ticket
                                        </span>
                                        <span className="text-sm font-bold text-[var(--brand-primary)]">View Ticket</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Ticket Detail Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedTicket(null)}></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                            {/* Ticket Header */}
                            <div className="relative h-48 bg-gray-900">
                                <img
                                    src={selectedTicket.event.image}
                                    alt={selectedTicket.event.title}
                                    className="w-full h-full object-cover opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h2 className="text-2xl font-bold text-white mb-1">{selectedTicket.event.title}</h2>
                                    <p className="text-white/80 font-medium">{selectedTicket.ticketName}</p>
                                </div>
                            </div>

                            {/* Ticket Body */}
                            <div className="p-6 relative">
                                {/* Perforated Line Effect */}
                                <div className="absolute -top-3 left-0 right-0 flex justify-between items-center px-2">
                                    {Array(20).fill().map((_, i) => (
                                        <div key={i} className="w-3 h-3 rounded-full bg-gray-50 -mt-1.5"></div>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Date</p>
                                            <p className="font-semibold text-gray-900">{formatDate(selectedTicket.event.date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Time</p>
                                            <p className="font-semibold text-gray-900">{selectedTicket.event.time}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Venue</p>
                                            <p className="font-semibold text-gray-900">{selectedTicket.event.venue}</p>
                                            <p className="text-sm text-gray-500">{selectedTicket.event.location}</p>
                                        </div>
                                    </div>

                                    {/* QR Code Area */}
                                    <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                        <div className="w-48 h-48 bg-white p-2 rounded-lg shadow-sm mb-3">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedTicket.qrCode}`}
                                                alt="Ticket QR Code"
                                                className="w-full h-full"
                                            />
                                        </div>
                                        <p className="text-xs font-mono text-gray-500">ID: {selectedTicket.id.toUpperCase()}</p>
                                        <p className="text-xs text-gray-400 mt-1">Scan at entrance</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                                            <Download size={18} />
                                            <span>Save</span>
                                        </button>
                                        <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                                            <Share2 size={18} />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTickets;
