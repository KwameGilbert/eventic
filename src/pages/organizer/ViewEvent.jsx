import React, { useState } from 'react';
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
    ShoppingCart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const ViewEvent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [openDropdown, setOpenDropdown] = useState(false);

    // Mock event data - would be fetched from API
    const event = {
        id: 1,
        name: 'Summer Music Festival 2024',
        description: 'Join us for the biggest music festival of the summer! Featuring top artists from around the world, delicious food vendors, and an unforgettable atmosphere. This three-day event will include multiple stages, VIP experiences, and exclusive merchandise.',
        category: 'Music',
        audience: 'Everyone',
        status: 'Published',
        date: '2024-06-15',
        startTime: '18:00',
        endTime: '23:00',
        venue: 'Central Park Amphitheater',
        address: '123 Park Avenue',
        city: 'New York',
        country: 'United States',
        mapsUrl: 'https://maps.google.com/?q=Central+Park',
        mainImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
        photos: [
            'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=200&fit=crop',
        ],
        videoUrl: 'https://youtube.com/watch?v=example',
        tags: ['music', 'festival', 'summer', 'outdoor', 'live'],
        website: 'https://summerfest2024.com',
        facebook: 'https://facebook.com/summerfest',
        twitter: 'https://twitter.com/summerfest',
        instagram: 'https://instagram.com/summerfest',
        phone: '+1 234 567 8900',
        tickets: [
            { id: 1, name: 'General Admission', price: 59, promoPrice: 49, saleStartDate: '2024-05-01', saleEndDate: '2024-05-15', quantity: 500, sold: 423, maxPerOrder: 10 },
            { id: 2, name: 'VIP Pass', price: 150, promoPrice: null, saleStartDate: null, saleEndDate: null, quantity: 100, sold: 87, maxPerOrder: 4 },
            { id: 3, name: 'Backstage Experience', price: 300, promoPrice: 250, saleStartDate: '2024-05-01', saleEndDate: '2024-05-31', quantity: 50, sold: 32, maxPerOrder: 2 },
        ],
        stats: {
            totalRevenue: 45380,
            ticketsSold: 542,
            totalTickets: 650,
            views: 12450,
            orders: 234
        },
        createdAt: '2024-01-15',
        updatedAt: '2024-05-20'
    };

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'published': return 'success';
            case 'draft': return 'warning';
            case 'completed': return 'info';
            case 'cancelled': return 'destructive';
            default: return 'secondary';
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

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
                                <p className="text-2xl font-bold text-gray-900">${event.stats.totalRevenue.toLocaleString()}</p>
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
                                <p className="text-2xl font-bold text-gray-900">{event.stats.ticketsSold}</p>
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
                                <p className="text-2xl font-bold text-gray-900">{event.stats.orders}</p>
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
                                <p className="text-2xl font-bold text-gray-900">{event.stats.views.toLocaleString()}</p>
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
                                <p className="text-2xl font-bold text-gray-900">{Math.round((event.stats.ticketsSold / event.stats.totalTickets) * 100)}%</p>
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
                        <img
                            src={event.mainImage}
                            alt={event.name}
                            className="w-full h-64 object-cover"
                        />
                        {event.photos.length > 0 && (
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
                            <p className="text-gray-600 whitespace-pre-line">{event.description}</p>

                            {/* Tags */}
                            {event.tags.length > 0 && (
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
                            {event.tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="p-4 border border-gray-200 rounded-lg"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{ticket.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-lg font-bold text-(--brand-primary)">
                                                    ${ticket.price}
                                                </span>
                                                {ticket.promoPrice && (
                                                    <span className="text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                                        Sale: ${ticket.promoPrice}
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
                                            style={{ width: `${(ticket.sold / ticket.quantity) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Contact & Social */}
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
                                    <p className="font-medium text-gray-900">{event.venue}</p>
                                    <p className="text-sm text-gray-500">{event.address}</p>
                                    <p className="text-sm text-gray-500">{event.city}, {event.country}</p>
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
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <ExternalLink size={16} />
                                View Public Page
                            </Button>
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
