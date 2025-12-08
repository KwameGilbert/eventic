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
                            <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
                            <Badge variant={getStatusStyle(event.status)}>{event.status}</Badge>
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
                                    <Copy size={14} />
                                    Duplicate Event
                                </button>
                                <Link
                                    to={`/events/${event.slug || event.id}`}
                                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <ExternalLink size={14} />
                                    View Public Page
                                </Link>
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
                        {event.mainImage ? (
                            <img
                                src={event.mainImage}
                                alt={event.name}
                                className="w-full h-64 object-cover"
                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                                <Image size={48} className="text-gray-300" />
                            </div>
                        )}
                        {event.photos && event.photos.length > 0 && (
                            <CardContent className="p-4">
                                <p className="text-sm font-medium text-gray-700 mb-3">Event Photos</p>
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {event.photos.map((photo, index) => (
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

                    {/* Tickets */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Tag size={20} className="text-(--brand-primary)" />
                                Ticket Types
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {event.tickets && event.tickets.length > 0 ? (
                                event.tickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="p-4 border border-gray-200 rounded-lg"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{ticket.name}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-lg font-bold text-(--brand-primary)">
                                                        GH₵{ticket.price}
                                                    </span>
                                                    {ticket.promoPrice && (
                                                        <span className="text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                                            Sale: GH₵{ticket.promoPrice}
                                                        </span>
                                                    )}
                                                </div>
                                                {ticket.saleStartDate && ticket.saleEndDate && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Sale: {ticket.saleStartDate} - {ticket.saleEndDate}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-semibold">{ticket.sold}</span> / {ticket.quantity} sold
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Max {ticket.maxPerOrder} per order
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

                    {/* Attendees */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Users size={20} className="text-(--brand-primary)" />
                                    Attendees ({event.attendees?.length || 0})
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge variant="success" className="gap-1">
                                        <UserCheck size={12} />
                                        {checkedInCount} checked in
                                    </Badge>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        <Download size={14} />
                                        Export
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Search and Filter */}
                            <div className="flex gap-3 mb-4">
                                <div className="flex-1 relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={attendeeSearch}
                                        onChange={(e) => setAttendeeSearch(e.target.value)}
                                        placeholder="Search attendees..."
                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        value={attendeeFilter}
                                        onChange={(e) => setAttendeeFilter(e.target.value)}
                                        className="appearance-none bg-white pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                    >
                                        <option value="all">All</option>
                                        <option value="checked-in">Checked In</option>
                                        <option value="not-checked-in">Not Checked In</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Attendees List */}
                            <div className="space-y-3">
                                {filteredAttendees.map((attendee) => (
                                    <div
                                        key={attendee.id}
                                        className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <img
                                            src={attendee.avatar}
                                            alt={attendee.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-gray-900">{attendee.name}</p>
                                                {attendee.checkedIn ? (
                                                    <Badge variant="success" className="gap-1 text-xs py-0">
                                                        <CheckCircle size={10} />
                                                        Checked in
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="gap-1 text-xs py-0">
                                                        <XCircle size={10} />
                                                        Not checked in
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                <span>{attendee.email}</span>
                                                <span>•</span>
                                                <span>{attendee.ticketType} × {attendee.ticketCount}</span>
                                            </div>
                                        </div>
                                        <div className="text-right text-xs text-gray-500">
                                            <p className="text-(--brand-primary) font-medium">
                                                {attendee.orderId}
                                            </p>
                                            {attendee.checkedIn && attendee.checkInTime && (
                                                <p className="mt-1">
                                                    Checked in {formatDateTime(attendee.checkInTime)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {filteredAttendees.length === 0 && (
                                    <div className="text-center py-8">
                                        <Users size={32} className="mx-auto text-gray-300 mb-2" />
                                        <p className="text-gray-500 text-sm">No attendees found</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact & Social */}
                    {(event.phone || event.website || event.facebook || event.twitter || event.instagram || event.videoUrl) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Globe size={20} className="text-(--brand-primary)" />
                                    Contact & Social Media
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {event.phone && (
                                        <a href={`tel:${event.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-(--brand-primary)">
                                            <Phone size={16} />
                                            {event.phone}
                                        </a>
                                    )}
                                    {event.website && (
                                        <a href={event.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-(--brand-primary)">
                                            <Globe size={16} />
                                            Website
                                        </a>
                                    )}
                                    {event.facebook && (
                                        <a href={event.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                                            <Facebook size={16} />
                                            Facebook
                                        </a>
                                    )}
                                    {event.twitter && (
                                        <a href={event.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-sky-500">
                                            <Twitter size={16} />
                                            Twitter / X
                                        </a>
                                    )}
                                    {event.instagram && (
                                        <a href={event.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-pink-600">
                                            <Instagram size={16} />
                                            Instagram
                                        </a>
                                    )}
                                    {event.videoUrl && (
                                        <a href={event.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600">
                                            <Video size={16} />
                                            Video
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
                                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-gray-400 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-900">{event.venue || '—'}</p>
                                    <p className="text-sm text-gray-500">{event.address || '—'}</p>
                                    {event.mapsUrl && (
                                        <a
                                            href={event.mapsUrl}
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
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link to={`/organizer/events/${event.id}/edit`} className="block">
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <Edit size={16} />
                                    Edit Event
                                </Button>
                            </Link>
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Copy size={16} />
                                Duplicate Event
                            </Button>
                            <Link to={`/events/${event.slug || event.id}`} className="block">
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <ExternalLink size={16} />
                                    View Public Page
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
