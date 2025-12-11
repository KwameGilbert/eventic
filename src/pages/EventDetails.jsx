import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Home as HomeIcon, Heart, Globe, Phone, Mail, Facebook, Twitter, Instagram, Calendar, Ticket, Users, CalendarPlus, FolderOpen, AlertCircle, RefreshCw } from 'lucide-react';
import TicketModal from '../components/modals/TicketModal';
import eventService from '../services/eventService';
import PageLoader from '../components/ui/PageLoader';

const EventDetails = () => {
    const { slug } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await eventService.getBySlug(slug);
                const eventData = response?.data || response;
                setEvent(eventData);

                // Track view count
                if (eventData && eventData.id) {
                    eventService.incrementViews(eventData.id);
                }
            } catch (err) {
                console.error('Failed to fetch event:', err);
                setError('Failed to load event details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();
    }, [slug]);

    const handleRetry = () => {
        setIsLoading(true);
        setError(null);
        eventService.getBySlug(slug)
            .then(response => {
                const eventData = response?.data || response;
                setEvent(eventData);

                if (eventData && eventData.id) {
                    eventService.incrementViews(eventData.id);
                }
            })
            .catch(err => {
                console.error('Failed to fetch event:', err);
                setError('Failed to load event details. Please try again.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Loading State
    if (isLoading) {
        return <PageLoader message="Loading event details..." />;
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Event</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={handleRetry}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-(--brand-primary) text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <RefreshCw size={18} />
                            Try Again
                        </button>
                        <Link
                            to="/events"
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Browse Events
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Not Found State
    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
                    <p className="text-gray-600 mb-6">The event you are looking for does not exist or has been removed.</p>
                    <Link to="/events" className="text-(--brand-primary) hover:underline font-semibold">
                        Browse all events →
                    </Link>
                </div>
            </div>
        );
    }

    const formatEventDate = (dateString) => {
        if (!dateString) return { day: '--', month: '---', year: '----' };
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
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <h1 className="text-2xl font-bold text-gray-900 truncate">{event.title}</h1>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Link to="/" className="hover:text-(--brand-primary)">
                                <HomeIcon size={16} />
                            </Link>
                            <span>/</span>
                            <Link to="/events" className="hover:text-(--brand-primary)">Events</Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium truncate max-w-[200px]">{event.title}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Image */}
            <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-200">
                <img
                    src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1920&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1920&q=80';
                    }}
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
                                {event.category && (
                                    <span className="inline-block px-4 py-2 bg-(--brand-primary)/10 text-(--brand-primary) rounded-full text-sm font-semibold">
                                        {event.categoryName}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            {event.description && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">About This Event</h2>
                                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                                </div>
                            )}

                            {/* Event Info Grid */}
                            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                        <Calendar size={16} />
                                        <h3>Date & Time</h3>
                                    </div>
                                    <p className="text-gray-900 font-medium">{event.date || 'TBA'}</p>
                                    <p className="text-gray-600 text-sm">{event.time || ''}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                        <MapPin size={16} />
                                        <h3>Location</h3>
                                    </div>
                                    <p className="text-gray-900 font-medium">{event.venue || 'TBA'}</p>
                                    <p className="text-gray-600 text-sm">
                                        {[event.location, event.city, event.region, event.country]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                        <Ticket size={16} />
                                        <h3>Starting Price</h3>
                                    </div>
                                    <p className="text-gray-900 font-bold text-xl">{event.price || 'Free'}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                        <FolderOpen size={16} />
                                        <h3>Category</h3>
                                    </div>
                                    <p className="text-gray-900 font-medium">{event.categoryName || 'General'}</p>
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
                                {event.language && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                            <Globe size={16} />
                                            <h3>Language</h3>
                                        </div>
                                        <p className="text-gray-900 font-medium">{event.language}</p>
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            {event.tags && event.tags.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">Tags</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {event.tags.map((tag, index) => (
                                            <span key={index} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-semibold text-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Event Photos */}
                            {event.images && event.images.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Event Photos</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {event.images.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`${event.title} - Photo ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Event Video */}
                            {event.videoUrl && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Event Video</h2>
                                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                                        <iframe
                                            src={event.videoUrl.includes('youtu.be')
                                                ? event.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/').split('?')[0]
                                                : event.videoUrl.includes('youtube.com/watch')
                                                    ? event.videoUrl.replace('watch?v=', 'embed/').split('&')[0]
                                                    : event.videoUrl
                                            }
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title="Event Video"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Contact Information */}
                            {(event.contact || event.phone || event.email || event.website) && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                                    <div className="space-y-3">
                                        {(event.contact?.email || event.email) && (
                                            <div className="flex items-center gap-3 text-gray-700">
                                                <Mail size={18} className="text-(--brand-primary)" />
                                                <a href={`mailto:${event.contact?.email || event.email}`} className="hover:text-(--brand-primary) hover:underline">
                                                    {event.contact?.email || event.email}
                                                </a>
                                            </div>
                                        )}
                                        {(event.contact?.phone || event.phone) && (
                                            <div className="flex items-center gap-3 text-gray-700">
                                                <Phone size={18} className="text-(--brand-primary)" />
                                                <a href={`tel:${event.contact?.phone || event.phone}`} className="hover:text-(--brand-primary) hover:underline">
                                                    {event.contact?.phone || event.phone}
                                                </a>
                                            </div>
                                        )}
                                        {(event.contact?.website || event.website) && (
                                            <div className="flex items-center gap-3 text-gray-700">
                                                <Globe size={18} className="text-(--brand-primary)" />
                                                <a href={event.contact?.website || event.website} target="_blank" rel="noopener noreferrer" className="hover:text-(--brand-primary) hover:underline">
                                                    {event.contact?.website || event.website}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Social Media Links */}
                            {(event.socialMedia || event.facebook || event.twitter || event.instagram) && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Follow Us</h2>
                                    <div className="flex items-center gap-4">
                                        {(event.socialMedia?.facebook || event.facebook) && (
                                            <a
                                                href={event.socialMedia?.facebook || event.facebook}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                                                aria-label="Facebook"
                                            >
                                                <Facebook size={20} />
                                            </a>
                                        )}
                                        {(event.socialMedia?.twitter || event.twitter) && (
                                            <a
                                                href={event.socialMedia?.twitter || event.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-colors"
                                                aria-label="Twitter/X"
                                            >
                                                <Twitter size={20} />
                                            </a>
                                        )}
                                        {(event.socialMedia?.instagram || event.instagram) && (
                                            <a
                                                href={event.socialMedia?.instagram || event.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full flex items-center justify-center transition-all"
                                                aria-label="Instagram"
                                            >
                                                <Instagram size={20} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Share Buttons */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Share This Event</h2>
                                <div className="flex items-center gap-3 flex-wrap">
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
                                    <div className="text-5xl font-bold text-(--brand-primary)">{day}</div>
                                    <div className="text-lg text-gray-600 font-medium">{month} {year}</div>
                                    <div className="text-sm text-gray-500 mt-2">{event.time}</div>
                                </div>
                                <button className="w-full text-(--brand-primary) text-sm font-semibold hover:underline flex items-center justify-center gap-1">
                                    <CalendarPlus size={16} />
                                    Add to Calendar
                                </button>
                            </div>

                            {/* Venue Card with Map */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-sm font-semibold text-gray-500 mb-4">Venue</h3>
                                <h4 className="font-bold text-gray-900 mb-2">{(event.venue || 'TBA').toUpperCase()}</h4>
                                <p className="text-sm text-gray-600 mb-4">{event.location}{event.country ? `, ${event.country}` : ''}</p>

                                {/* Map */}
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

                            {/* Tickets Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-sm font-semibold text-gray-500 mb-4">Tickets</h3>

                                {/* Ticket Types */}
                                {event.ticketTypes && event.ticketTypes.length > 0 ? (
                                    <div className="space-y-3 mb-6">
                                        {event.ticketTypes.map((ticket, index) => (
                                            <div key={ticket.id || index} className={`p-4 rounded-lg border-2 ${ticket.availableQuantity > 0 ? 'border-(--brand-primary) bg-(--brand-primary)/5' : 'border-gray-300 bg-gray-50'}`}>
                                                {/* Ticket Image */}
                                                {ticket.ticketImage && (
                                                    <img
                                                        src={ticket.ticketImage}
                                                        alt={ticket.name}
                                                        className="w-full h-32 object-cover rounded-lg mb-3"
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                )}

                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-gray-900">{ticket.name}</span>
                                                    <div className="text-right">
                                                        {ticket.onSale && ticket.salePrice ? (
                                                            <>
                                                                <div className="text-lg font-bold text-(--brand-primary)">GH₵{ticket.salePrice}</div>
                                                                <div className="text-sm text-gray-500 line-through">GH₵{ticket.price}</div>
                                                            </>
                                                        ) : (
                                                            <span className="text-lg font-bold text-(--brand-primary)">GH₵{ticket.price}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Ticket Description */}
                                                {ticket.description && (
                                                    <p className="text-xs text-gray-600 mb-2">{ticket.description}</p>
                                                )}

                                                {/* Sale Period */}
                                                {ticket.onSale && ticket.saleStartDate && ticket.saleEndDate && (
                                                    <div className="text-xs text-(--brand-primary) font-semibold mb-2">
                                                        🔥 Sale ends {new Date(ticket.saleEndDate).toLocaleDateString()}
                                                    </div>
                                                )}

                                                <div className="text-xs text-gray-500">
                                                    {ticket.availableQuantity > 0 ? (
                                                        <span className="text-green-600 font-semibold">✓ {ticket.availableQuantity} left</span>
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
                                            <span className="text-4xl font-bold text-(--brand-primary)">{event.price || 'Free'}</span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => setIsTicketModalOpen(true)}
                                    className="w-full bg-(--brand-primary) hover:opacity-90 text-white font-bold py-3 px-4 rounded-full transition-opacity mb-3 flex items-center justify-center gap-2"
                                >
                                    <Ticket size={18} />
                                    GET TICKETS
                                </button>

                                <button
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className={`w-full border-2 ${isFavorite ? 'border-red-500 text-red-500 bg-red-50' : 'border-(--brand-primary) text-(--brand-primary)'} hover:bg-(--brand-primary) hover:text-white hover:border-(--brand-primary) font-bold py-3 px-4 rounded-full transition-colors flex items-center justify-center gap-2`}
                                >
                                    <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                                    {isFavorite ? 'FAVORITED' : 'ADD TO FAVORITES'}
                                </button>
                            </div>

                            {/* Organizer Card */}
                            {event.organizer && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-sm font-semibold text-gray-500 mb-4">Organizer</h3>

                                    <div className="flex items-center gap-4 mb-4">
                                        <img
                                            src={event.organizer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(event.organizer.name)}&background=ff6b35&color=fff`}
                                            alt={event.organizer.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="font-bold text-gray-900">{event.organizer.name}</h4>
                                            <p className="text-sm text-gray-600">{event.organizer.eventsOrganized || 0} events organized</p>
                                        </div>
                                    </div>

                                    {event.organizer.bio && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{event.organizer.bio}</p>
                                    )}

                                    <button className="w-full bg-(--brand-primary) hover:opacity-90 text-white font-bold py-2 px-4 rounded-full transition-opacity flex items-center justify-center gap-2">
                                        <Mail size={16} />
                                        FOLLOW ORGANIZER
                                    </button>
                                </div>
                            )}

                            {/* Newsletter Card */}
                            <div className="bg-(--brand-primary) rounded-lg p-6 text-white">
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
