import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Users,
    DollarSign,
    Tag,
    Edit,
    Trash2,
    Share2,
    Copy,
    ExternalLink,
    MoreVertical,
    Globe,
    Phone,
    Facebook,
    Instagram,
    Twitter,
    Video,
    Map,
    TicketCheck,
    TrendingUp,
    Eye,
    ShoppingCart,
    Search,
    Mail,
    CheckCircle,
    XCircle,
    Download,
    UserCheck,
    Filter,
    ChevronDown,
    Loader2,
    AlertTriangle,
    Image
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import organizerService from '../../services/organizerService';

const ViewEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [openDropdown, setOpenDropdown] = useState(false);
    const [attendeeSearch, setAttendeeSearch] = useState('');
    const [attendeeFilter, setAttendeeFilter] = useState('all');

    // Loading and error states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Event data from API
    const [event, setEvent] = useState(null);

    // Fetch event data
    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await organizerService.getEventDetails(id);

                if (response.success && response.data) {
                    setEvent(response.data);
                } else {
                    setError(response.message || 'Failed to load event details');
                }
            } catch (err) {
                console.error('Error fetching event details:', err);
                setError(err.message || 'An error occurred while loading event details');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchEventDetails();
        }
    }, [id]);

    // Filter attendees
    const filteredAttendees = event?.attendees?.filter(attendee => {
        const matchesSearch = attendee.name?.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
            attendee.email?.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
            attendee.orderId?.toLowerCase().includes(attendeeSearch.toLowerCase());
        const matchesFilter = attendeeFilter === 'all' ||
            (attendeeFilter === 'checked-in' && attendee.checkedIn) ||
            (attendeeFilter === 'not-checked-in' && !attendee.checkedIn);
        return matchesSearch && matchesFilter;
    }) || [];

    const checkedInCount = event?.attendees?.filter(a => a.checkedIn).length || 0;

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'published': return 'success';
            case 'draft': return 'warning';
            case 'completed': return 'info';
            case 'cancelled': return 'destructive';
            default: return 'secondary';
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '—';
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-(--brand-primary) mx-auto mb-4" />
                    <p className="text-gray-500">Loading event details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md w-full">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Event</h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <Button onClick={() => navigate('/organizer/events')}>
                            Back to Events
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // No event found
    if (!event) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md w-full">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Not Found</h3>
                        <p className="text-gray-500 mb-4">The event you're looking for doesn't exist.</p>
                        <Button onClick={() => navigate('/organizer/events')}>
                            Back to Events
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/organizer/events')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
                            <Badge variant={getStatusStyle(event.status)}>{event.status.toUpperCase()}</Badge>
                        </div>
                        <p className="text-gray-500 mt-1">Event ID: #{event.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Share2 size={16} />
                        Share
                    </Button>
                    <Link to={`/organizer/events/${event.id}/edit`}>
                        <Button size="sm" className="gap-2">
                            <Edit size={16} />
                            Edit Event
                        </Button>
                    </Link>
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setOpenDropdown(!openDropdown)}
                        >
                            <MoreVertical size={16} />
                        </Button>
                        {openDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                                <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <ExternalLink size={14} />
                                    View Public Page
                                </button>
                                <hr className="my-1" />
                                <button className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
                                    <Trash2 size={14} />
                                    Delete Event
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <DollarSign size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">GH₵{event.stats?.totalRevenue?.toLocaleString() || 0}</p>
                                <p className="text-xs text-gray-500">Total Revenue</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <TicketCheck size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{event.stats?.ticketsSold || 0}</p>
                                <p className="text-xs text-gray-500">Tickets Sold</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <ShoppingCart size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{event.stats?.orders || 0}</p>
                                <p className="text-xs text-gray-500">Total Orders</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Eye size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{event.stats?.views?.toLocaleString() || 0}</p>
                                <p className="text-xs text-gray-500">Page Views</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                                <TrendingUp size={20} className="text-teal-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {event.stats?.totalTickets > 0
                                        ? Math.round((event.stats.ticketsSold / event.stats.totalTickets) * 100)
                                        : 0}%
                                </p>
                                <p className="text-xs text-gray-500">Sold Out</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Column */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    {/* Main Image */}
                    <Card className="overflow-hidden">
                        {event.image ? (
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-64 object-cover"
                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                                <Image size={48} className="text-gray-300" />
                            </div>
                        )}
                        {event.images && event.images.length > 0 && (
                            <CardContent className="p-4">
                                <p className="text-sm font-medium text-gray-700 mb-3">Event Photos</p>
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {event.images.map((photo, index) => (
                                        <img
                                            key={index}
                                            src={photo}
                                            alt={`Event photo ${index + 1}`}
                                            className="w-24 h-16 object-cover rounded-lg shrink-0"
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        )}
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">About This Event</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 whitespace-pre-line">{event.description || 'No description provided.'}</p>

                            {/* Tags */}
                            {event.tags && event.tags.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {event.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Event Video */}
                    {event.videoUrl && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Video size={20} className="text-(--brand-primary)" />
                                    Event Video
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                                    <iframe
                                        src={event.videoUrl.includes('youtu.be')
                                            ? event.videoUrl.replace('youtu.be/', 'www.youtube.com/embed/').split('?')[0]
                                            : event.videoUrl.includes('youtube.com/watch')
                                                ? event.videoUrl.replace('watch?v=', 'embed/')
                                                : event.videoUrl
                                        }
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title="Event Video"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Tickets */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Tag size={20} className="text-(--brand-primary)" />
                                Ticket Types
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {event.ticketTypes && event.ticketTypes.length > 0 ? (
                                event.ticketTypes.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="p-4 border border-gray-200 rounded-lg"
                                    >
                                        {/* Ticket Image */}
                                        {ticket.ticketImage && (
                                            <img
                                                src={ticket.ticketImage}
                                                alt={ticket.name}
                                                className="w-full h-32 object-cover rounded-lg mb-3"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        )}

                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{ticket.name}</h4>
                                                {ticket.description && (
                                                    <p className="text-xs text-gray-600 mt-1">{ticket.description}</p>
                                                )}
                                                <div className="flex items-center gap-3 mt-1">
                                                    {ticket.salePrice ? (
                                                        <>
                                                            <span className="text-lg font-bold text-(--brand-primary)">
                                                                GH₵{ticket.salePrice}
                                                            </span>
                                                            <span className="text-sm text-gray-500 line-through">
                                                                GH₵{ticket.price}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-lg font-bold text-(--brand-primary)">
                                                            GH₵{ticket.price}
                                                        </span>
                                                    )}
                                                </div>
                                                {ticket.saleStartDate && ticket.saleEndDate && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Sale: {new Date(ticket.saleStartDate).toLocaleDateString()} - {new Date(ticket.saleEndDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-semibold">{ticket.sold}</span> / {ticket.quantity} sold
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Max {ticket.maxPerAttendee || 10} per order
                                                </p>
                                            </div>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="mt-3 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-(--brand-primary) rounded-full transition-all"
                                                style={{ width: `${ticket.quantity > 0 ? (ticket.sold / ticket.quantity) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Tag size={32} className="mx-auto text-gray-300 mb-2" />
                                    <p className="text-gray-500 text-sm">No ticket types created yet</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Contact & Social */}
                    {(event.contact || event.socialMedia || event.phone || event.website || event.facebook || event.twitter || event.instagram || event.videoUrl) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Globe size={20} className="text-(--brand-primary)" />
                                    Contact & Social Media
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {(event.contact?.email || event.organizer?.contact?.email) && (
                                        <a href={`mailto:${event.contact?.email || event.organizer?.contact?.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-(--brand-primary)">
                                            <Mail size={16} />
                                            Email
                                        </a>
                                    )}
                                    {(event.contact?.phone || event.phone) && (
                                        <a href={`tel:${event.contact?.phone || event.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-(--brand-primary)">
                                            <Phone size={16} />
                                            {event.contact?.phone || event.phone}
                                        </a>
                                    )}
                                    {(event.contact?.website || event.website) && (
                                        <a href={`http://${event.contact?.website || event.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-(--brand-primary)">
                                            <Globe size={16} />
                                            Website
                                        </a>
                                    )}
                                    {(event.socialMedia?.facebook || event.facebook) && (
                                        <a href={event.socialMedia?.facebook || event.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                                            <Facebook size={16} />
                                            Facebook
                                        </a>
                                    )}
                                    {(event.socialMedia?.twitter || event.twitter) && (
                                        <a href={event.socialMedia?.twitter || event.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-sky-500">
                                            <Twitter size={16} />
                                            Twitter / X
                                        </a>
                                    )}
                                    {(event.socialMedia?.instagram || event.instagram) && (
                                        <a href={event.socialMedia?.instagram || event.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-pink-600">
                                            <Instagram size={16} />
                                            Instagram
                                        </a>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    
                </div>

                {/* Right Column */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Event Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Event Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar size={18} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                                    <p className="text-sm text-gray-500">
                                        {formatDateTime(event.start_time)} - {formatDateTime(event.end_time)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">{event.venue || '—'}</p>
                                    <p className="text-sm text-gray-500">{event.location || '—'}</p>
                                    {event.mapUrl && (
                                        <a
                                            href={event.mapUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-(--brand-primary) hover:underline flex items-center gap-1 mt-1"
                                        >
                                            <Map size={14} />
                                            View on Maps
                                        </a>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Tag size={18} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">{event.category}</p>
                                    <p className="text-sm text-gray-500">Category</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users size={18} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">{event.audience}</p>
                                    <p className="text-sm text-gray-500">Audience</p>
                                </div>
                            </div>
                            {event.language && (
                                <div className="flex items-start gap-3">
                                    <Globe size={18} className="text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-gray-900">{event.language}</p>
                                        <p className="text-sm text-gray-500">Language</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link to={`/organizer/events/edit/${event.id}`} className="block">
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <Edit size={16} />
                                    Edit Event
                                </Button>
                            </Link>
                            <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                                <Trash2 size={16} />
                                Delete Event
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card>
                        <CardContent className="p-4 text-sm text-gray-500 space-y-1">
                            <p>Created: {formatDate(event.createdAt)}</p>
                            <p>Last updated: {formatDate(event.updatedAt)}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ViewEvent;
