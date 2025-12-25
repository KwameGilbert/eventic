import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Ticket, Calendar, MapPin, Clock, RefreshCw, AlertCircle, QrCode } from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import PageLoader from '../components/ui/PageLoader';
import TicketModal from '../components/TicketModal';

const MyTickets = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { tickets, isLoading, error, refreshOrders } = useTickets();
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [filter, setFilter] = useState('upcoming');

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

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isUpcoming = (eventDate) => {
        if (!eventDate) return true;
        return new Date(eventDate) >= new Date();
    };

    // Get ticket status styling
    const getTicketStatusStyle = (status) => {
        switch (status) {
            case 'active':
                return { bg: 'bg-green-50', text: 'text-green-600', dot: 'bg-green-500', label: 'Active' };
            case 'used':
                return { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500', label: 'Used' };
            case 'cancelled':
                return { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500', label: 'Cancelled' };
            case 'expired':
                return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-500', label: 'Expired' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-500', label: status || 'Unknown' };
        }
    };

    // Filter tickets
    const filteredTickets = tickets.filter(ticket => {
        const eventDate = ticket.event?.start_time || ticket.event?.date;
        if (filter === 'upcoming') return isUpcoming(eventDate);
        if (filter === 'past') return !isUpcoming(eventDate);
        return true;
    });

    if (isLoading) {
        return <PageLoader message="Loading your tickets..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
                            <p className="text-gray-500 mt-1">Your event tickets with QR codes for entry</p>
                        </div>
                        <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                            <Link to="/" className="hover:text-orange-500 flex items-center gap-1">
                                <Home size={16} />
                            </Link>
                            <ChevronRight size={16} />
                            <span className="text-gray-900 font-medium">My Tickets</span>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="text-red-500" size={20} />
                        <span className="text-red-700">{error}</span>
                        <button
                            onClick={refreshOrders}
                            className="ml-auto text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                        >
                            <RefreshCw size={16} />
                            Retry
                        </button>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="flex items-center gap-4 mb-6">
                    {['all', 'upcoming', 'past'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filter === status
                                ? 'bg-orange-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {status === 'all' ? 'All Tickets' :
                                status === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
                        </button>
                    ))}
                    <button
                        onClick={refreshOrders}
                        className="ml-auto p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Refresh tickets"
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>

                {filteredTickets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Ticket size={40} className="text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {filter === 'all' ? 'No tickets yet' :
                                filter === 'upcoming' ? 'No upcoming events' : 'No past events'}
                        </h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            {filter === 'all'
                                ? "You haven't purchased any tickets yet. Browse our events and find something you love!"
                                : filter === 'upcoming'
                                    ? "You don't have any upcoming events. Time to find your next adventure!"
                                    : "No past event tickets found."
                            }
                        </p>
                        <Link
                            to="/events"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30"
                        >
                            Browse Ticketing Events
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTickets.map((ticket, idx) => {
                            const eventDate = ticket.event?.start_time || ticket.event?.date;
                            const isPast = !isUpcoming(eventDate);

                            return (
                                <div
                                    key={ticket.id || idx}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group ${isPast ? 'opacity-75' : ''}`}
                                >
                                    <div className="relative h-48">
                                        <img
                                            src={ticket.event?.banner_image || ticket.event?.image || '/images/event-placeholder.jpg'}
                                            alt={ticket.event?.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => { e.target.src = '/images/event-placeholder.jpg'; }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h3 className="text-white font-bold text-lg line-clamp-1">{ticket.event?.title || 'Event'}</h3>
                                            <p className="text-white/90 text-sm font-medium">{ticket.ticketName || ticket.ticket_type?.name || 'General'}</p>
                                        </div>
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                                            #{String(ticket.id).toUpperCase()}
                                        </div>
                                        {isPast && (
                                            <div className="absolute top-4 left-4 bg-gray-900/80 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                Past Event
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-orange-500" />
                                                <span>{formatDate(eventDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-orange-500" />
                                                <span>{formatTime(ticket.event?.start_time) || ticket.event?.time || 'TBD'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-orange-500" />
                                                <span className="line-clamp-1">{ticket.event?.venue_name || ticket.event?.venue || 'TBD'}</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                            {(() => {
                                                const statusStyle = getTicketStatusStyle(ticket.status);
                                                return (
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                                                        {isPast && ticket.status === 'active' ? 'Event Ended' : statusStyle.label}
                                                    </span>
                                                );
                                            })()}
                                            <span className="text-sm font-bold text-orange-500 flex items-center gap-1">
                                                <QrCode size={16} />
                                                View Ticket
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Ticket Modal Component */}
            {selectedTicket && (
                <TicketModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                />
            )}
        </div>
    );
};

export default MyTickets;

