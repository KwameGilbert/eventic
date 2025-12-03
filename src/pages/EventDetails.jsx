import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Home as HomeIcon, Heart, Globe, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Calendar, Ticket, Users, Eye, CalendarPlus, FolderOpen } from 'lucide-react';
import { upcomingEvents } from '../data/mockEvents';
import TicketModal from '../components/modals/TicketModal';

const EventDetails = () => {
    const { slug } = useParams();

    // Find event by slug
    const event = upcomingEvents.find(e => e.eventSlug === slug);

    const [isFavorite, setIsFavorite] = useState(false);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
                    <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
                    <Link to="/events" className="text-[var(--brand-primary)] hover:underline">
                        Browse all events →
                    </Link>
                </div>
            </div>
        );
    }

    const formatEventDate = (dateString) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            year: date.getFullYear()
        };
    };

    const { day, month, year } = formatEventDate(event.date);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Page Header with Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Link to="/" className="hover:text-[var(--brand-primary)]">
                                <HomeIcon size={16} />
                            </Link>
                            <span>/</span>
                            <Link to="/events" className="hover:text-[var(--brand-primary)]">Events</Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">{event.title}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Image */}
            <div className="w-full h-[600px] overflow-hidden bg-gray-200">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Event Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                            {/* Title */}
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-3">{event.title}</h1>
                                <span className="inline-block px-4 py-2 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] rounded-full text-sm font-semibold">
                                    {event.category}
                                </span>
                            </div>

                            {/* Description */}
                            {event.description && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">About This Event</h2>
                                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                                </div>
                            )}

                            {/* Event Info Grid */}
                            <div className="mb-8 grid grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                        <Calendar size={16} />
                                        <h3>Date & Time</h3>
                                    </div>
                                    <p className="text-gray-900 font-medium">{event.date}</p>
                                    <p className="text-gray-600 text-sm">{event.time}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                        <MapPin size={16} />
                                        <h3>Venue</h3>
                                    </div>
                                    <p className="text-gray-900 font-medium">{event.venue}</p>
                                    <p className="text-gray-600 text-sm">{event.location}, {event.country}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                        <Ticket size={16} />
                                        <h3>Starting Price</h3>
                                    </div>
                                    <p className="text-gray-900 font-bold text-xl">{event.price}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                        <Globe size={16} />
                                        <h3>Event Type</h3>
                                    </div>
                                    <p className="text-gray-900 font-medium">{event.isOnline ? 'Online Event' : 'In-Person Event'}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                        <FolderOpen size={16} />
                                        <h3>Category</h3>
                                    </div>
                                    <p className="text-gray-900 font-medium">{event.category}</p>
                                </div>
                                {event.audience && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                            <Users size={16} />
                                            <h3>Audience</h3>
                                        </div>
                                        <p className="text-gray-900 font-medium">{event.audience}</p>
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            {event.tags && event.tags.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">Tags</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {event.tags.map((tag, index) => (
                                            <span key={index} className="px-4 py-2 bg-gray-100text-gray-700 rounded-full font-semibold text-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Event Photos */}
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Event Photos</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <img src={event.image} alt={event.title} className="w-full h-32 object-cover rounded-lg" />
                                    <img src={event.image} alt={event.title} className="w-full h-32 object-cover rounded-lg" />
                                    <img src={event.image} alt={event.title} className="w-full h-32 object-cover rounded-lg" />
                                </div>
                            </div>

                            {/* Event Video */}
                            {event.videoUrl && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Event Video</h2>
                                    <div className="relative w-full rounded-lg overflow-hidden bg-black" style={{ paddingBottom: '56.25%' }}>
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full"
                                            src={event.videoUrl}
                                            title={`${event.title} Video`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            )}

                            {/* Contact & Social Media */}
                            {(event.contact || event.socialMedia) && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Contact & Social Media</h2>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        {/* Contact Information */}
                                        {event.contact?.website && (
                                            <a href={event.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--brand-primary)] hover:underline">
                                                <Globe size={16} />
                                                <span>Visit Website</span>
                                            </a>
                                        )}
                                        {event.contact?.email && (
                                            <a href={`mailto:${event.contact.email}`} className="flex items-center gap-2 text-[var(--brand-primary)] hover:underline">
                                                <Mail size={16} />
                                                <span>{event.contact.email}</span>
                                            </a>
                                        )}
                                        {event.contact?.phone && (
                                            <a href={`tel:${event.contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-[var(--brand-primary)] hover:underline">
                                                <Phone size={16} />
                                                <span>{event.contact.phone}</span>
                                            </a>
                                        )}

                                        {/* Social Media Links */}
                                        {event.socialMedia?.facebook && (
                                            <a href={event.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--brand-primary)] hover:underline">
                                                <Facebook size={16} />
                                                <span>Facebook</span>
                                            </a>
                                        )}
                                        {event.socialMedia?.twitter && (
                                            <a href={event.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--brand-primary)] hover:underline">
                                                <Twitter size={16} />
                                                <span>Twitter</span>
                                            </a>
                                        )}
                                        {event.socialMedia?.instagram && (
                                            <a href={event.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--brand-primary)] hover:underline">
                                                <Instagram size={16} />
                                                <span>Instagram</span>
                                            </a>
                                        )}
                                        {event.socialMedia?.linkedin && (
                                            <a href={event.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--brand-primary)] hover:underline">
                                                <Linkedin size={16} />
                                                <span>LinkedIn</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Share Buttons */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Share This Event</h2>
                                <div className="flex items-center gap-3">
                                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition-colors">
                                        Share on Facebook
                                    </button>
                                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded text-sm font-semibold transition-colors">
                                        Share on X
                                    </button>
                                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-semibold transition-colors">
                                        Share on LinkedIn
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            {/* Date Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-sm font-semibold text-gray-500 mb-4">Event Date</h3>
                                <div className="text-center mb-4">
                                    <div className="text-5xl font-bold text-[var(--brand-primary)]">{day}</div>
                                    <div className="text-lg text-gray-600 font-medium">{month} {year}</div>
                                    <div className="text-sm text-gray-500 mt-2">{event.time}</div>
                                </div>
                                <button className="w-full text-[var(--brand-primary)] text-sm font-semibold hover:underline flex items-center justify-center gap-1">
                                    <CalendarPlus size={16} />
                                    Add to Calendar
                                </button>
                            </div>

                            {/* Venue Card with Map */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-sm font-semibold text-gray-500 mb-4">Venue</h3>
                                <h4 className="font-bold text-gray-900 mb-2">{event.venue.toUpperCase()}</h4>
                                <p className="text-sm text-gray-600 mb-4">{event.location}, {event.country}</p>

                                {/* Map - Embedded or Placeholder */}
                                {event.mapUrl ? (
                                    <div className="rounded-lg overflow-hidden h-48 mb-4">
                                        <iframe
                                            src={event.mapUrl}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Event Location Map"
                                        ></iframe>
                                    </div>
                                ) : (
                                    <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500">
                                        <MapPin size={48} />
                                    </div>
                                )}
                            </div>

                            {/* Tickets Card with Multiple Types */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-sm font-semibold text-gray-500 mb-4">Tickets</h3>

                                {/* Ticket Types */}
                                {event.ticketTypes && event.ticketTypes.length > 0 ? (
                                    <div className="space-y-3 mb-6">
                                        {event.ticketTypes.map((ticket, index) => (
                                            <div key={index} className={`p-4 rounded-lg border-2 ${ticket.available ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5' : 'border-gray-300 bg-gray-50'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-gray-900">{ticket.name}</span>
                                                    <span className="text-lg font-bold text-[var(--brand-primary)]">${ticket.price}</span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {ticket.available ? (
                                                        <span className="text-green-600 font-semibold">✓ Available</span>
                                                    ) : (
                                                        <span className="text-red-500 font-semibold">✗ Sold Out</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mb-6">
                                        <div className="text-center">
                                            <span className="text-4xl font-bold text-[var(--brand-primary)]">{event.price}</span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => setIsTicketModalOpen(true)}
                                    className="w-full bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold py-3 px-4 rounded-full transition-opacity mb-3 flex items-center justify-center gap-2"
                                >
                                    <Ticket size={18} />
                                    GET TICKETS
                                </button>

                                <button
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className={`w-full border-2 ${isFavorite ? 'border-red-500 text-red-500 bg-red-50' : 'border-[var(--brand-primary)] text-[var(--brand-primary)]'} hover:bg-[var(--brand-primary)] hover:text-white hover:border-[var(--brand-primary)] font-bold py-3 px-4 rounded-full transition-colors flex items-center justify-center gap-2`}
                                >
                                    <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                                    {isFavorite ? 'FAVORITED' : 'ADD TO FAVORITES'}
                                </button>
                            </div>

                            {/* Organizer Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-sm font-semibold text-gray-500 mb-4">Organizer</h3>

                                <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&q=80"
                                        alt="Organizer"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                        <h4 className="text-white font-bold">Eventic Organizers</h4>
                                    </div>
                                </div>

                                <button className="w-full bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold py-2 px-4 rounded-full transition-opacity flex items-center justify-center gap-2">
                                    <Mail size={16} />
                                    FOLLOW ORGANIZER
                                </button>
                            </div>

                            {/* Attendees Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-500">Attendees</h3>
                                    <button className="text-[var(--brand-primary)] text-sm font-semibold hover:underline flex items-center gap-1">
                                        <Eye size={14} />
                                        See all
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <img src="https://ui-avatars.com/api/?name=User+1&background=ff6b35" alt="User" className="w-10 h-10 rounded-full" />
                                    <img src="https://ui-avatars.com/api/?name=User+2&background=f7931e" alt="User" className="w-10 h-10 rounded-full" />
                                    <img src="https://ui-avatars.com/api/?name=User+3&background=004e89" alt="User" className="w-10 h-10 rounded-full" />
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                                        +47
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-3">50 people are attending</p>
                            </div>

                            {/* Newsletter Card */}
                            <div className="bg-[var(--brand-primary)] rounded-lg p-6 text-white">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Mail size={18} />
                                    <span>Subscribe to Updates</span>
                                </h3>
                                <p className="text-sm mb-4 opacity-90">Get notified about similar events</p>
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="w-full px-3 py-2 mb-3 rounded-lg text-gray-900 focus:outline-none"
                                />
                                <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                                    SUBSCRIBE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ticket Modal */}
            <TicketModal
                isOpen={isTicketModalOpen}
                onClose={() => setIsTicketModalOpen(false)}
                event={event}
            />
        </div>
    );
};

export default EventDetails;
