import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    MapPin,
    Clock,
    DollarSign,
    Users,
    Loader2,
    AlertCircle,
    ArrowLeft,
    Save,
    Star,
    Edit3,
    CheckCircle,
    XCircle,
    Percent,
    Image as ImageIcon,
    ExternalLink,
    Calendar,
    Tag,
    ShoppingCart,
    Eye,
    TicketCheck,
    RefreshCw,
    Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import adminService from '../../services/adminService';
import { showSuccess, showError } from '../../utils/toast';

const AdminEventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        venue_name: '',
        address: '',
        city: '',
        country: '',
        start_time: '',
        end_time: '',
        status: '',
        is_featured: false,
        platform_fee_percentage: 1.5,
        banner_image: ''
    });

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await adminService.getEventDetails(id);

            if (response.success) {
                const eventData = response.data.event;
                setEvent(eventData);

                // Populate form data
                setFormData({
                    title: eventData.title || '',
                    description: eventData.description || '',
                    venue_name: eventData.venue_name || '',
                    address: eventData.address || '',
                    city: eventData.city || '',
                    country: eventData.country || '',
                    start_time: eventData.start_time ? eventData.start_time.substring(0, 16) : '',
                    end_time: eventData.end_time ? eventData.end_time.substring(0, 16) : '',
                    status: eventData.status || 'draft',
                    is_featured: eventData.is_featured || false,
                    platform_fee_percentage: eventData.platform_fee_percentage || 1.5,
                    banner_image: eventData.banner_image || ''
                });
            } else {
                setError(response.message || 'Failed to fetch event details');
            }
        } catch (err) {
            console.error('Error fetching event details:', err);
            setError(err.message || 'An error occurred while fetching event details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const response = await adminService.updateEvent(id, formData);

            if (response.success) {
                showSuccess('Event updated successfully');
                setIsEditing(false);
                fetchEventDetails();
            } else {
                showError(response.message || 'Failed to update event');
            }
        } catch (err) {
            showError(err.message || 'Failed to update event');
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return `GH₵${(amount || 0).toLocaleString()}`;
    };

    const getStatusColor = (status) => {
        const colors = {
            published: 'bg-green-100 text-green-800 border-green-200',
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            draft: 'bg-gray-100 text-gray-800 border-gray-200',
            cancelled: 'bg-red-100 text-red-800 border-red-200',
            completed: 'bg-blue-100 text-blue-800 border-blue-200',
        };
        return colors[status] || colors.draft;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => navigate('/admin/events')}>
                        <ArrowLeft size={16} />
                        Back to Events
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
                        <div>
                            <h3 className="font-semibold text-red-800 mb-1">Error Loading Event</h3>
                            <p className="text-red-700">{error}</p>
                            <button
                                onClick={fetchEventDetails}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Eye },
        { id: 'tickets', label: 'Tickets', icon: Tag },
        { id: 'settings', label: 'Settings', icon: Edit3 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => navigate('/admin/events')}>
                        <ArrowLeft size={16} />
                        Back
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{event?.title}</h1>
                            <Badge className={getStatusColor(event?.status)}>
                                {event?.status?.toUpperCase()}
                            </Badge>
                            {event?.is_featured && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                    <Star size={12} className="fill-yellow-500 mr-1" />
                                    Featured
                                </Badge>
                            )}
                        </div>
                        <p className="text-gray-500 mt-1 text-sm">Event ID: #{event?.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link to={`/event/${event?.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                            <ExternalLink size={16} />
                            <span className="hidden sm:inline">View Public Page</span>
                        </Button>
                    </Link>
                    <Button onClick={fetchEventDetails} variant="outline" size="sm">
                        <RefreshCw size={16} />
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                                <DollarSign size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(event?.total_revenue)}</p>
                                <p className="text-xs text-gray-500">Total Revenue</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                <TicketCheck size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{event?.tickets_sold || 0}</p>
                                <p className="text-xs text-gray-500">Tickets Sold</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                                <ShoppingCart size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{event?.orders_count || 0}</p>
                                <p className="text-xs text-gray-500">Total Orders</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                                <Percent size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{event?.platform_fee_percentage || 1.5}%</p>
                                <p className="text-xs text-gray-500">Platform Fee</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                                <DollarSign size={20} className="text-red-600" />
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {formatCurrency((event?.total_revenue || 0) * (event?.platform_fee_percentage || 1.5) / 100)}
                                </p>
                                <p className="text-xs text-gray-500">Platform Earnings</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-4 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'border-red-600 text-red-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Banner Image */}
                        <Card className="overflow-hidden">
                            {event?.banner_image ? (
                                <img
                                    src={event.banner_image}
                                    alt={event.title}
                                    className="w-full h-48 sm:h-64 object-cover"
                                />
                            ) : (
                                <div className="w-full h-48 sm:h-64 bg-gray-100 flex items-center justify-center">
                                    <ImageIcon size={48} className="text-gray-400" />
                                </div>
                            )}
                        </Card>

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About This Event</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-wrap">{event?.description || 'No description'}</p>
                            </CardContent>
                        </Card>

                        {/* Ticket Types */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Tag size={20} className="text-red-600" />
                                    Ticket Types
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {event?.ticket_types && event.ticket_types.length > 0 ? (
                                    event.ticket_types.map((ticket) => (
                                        <div key={ticket.id} className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">{ticket.name}</h4>
                                                    {ticket.description && (
                                                        <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                                                    )}
                                                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                                                        <span className="text-lg font-bold text-red-600">
                                                            {formatCurrency(ticket.price)}
                                                        </span>
                                                        {ticket.sale_price && (
                                                            <span className="text-sm text-gray-500 line-through">
                                                                {formatCurrency(ticket.original_price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-semibold">{ticket.sold || 0}</span> / {ticket.quantity} sold
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Revenue: {formatCurrency((ticket.sold || 0) * ticket.price)}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Progress bar */}
                                            <div className="mt-3 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-red-600 rounded-full transition-all"
                                                    style={{ width: `${ticket.quantity > 0 ? (ticket.sold / ticket.quantity) * 100 : 0}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Tag size={32} className="mx-auto text-gray-300 mb-2" />
                                        <p className="text-gray-500 text-sm">No ticket types available</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - 1 column */}
                    <div className="space-y-6">
                        {/* Event Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar size={18} className="text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900">{formatDate(event?.start_time)}</p>
                                        <p className="text-sm text-gray-500">Start Time</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock size={18} className="text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900">{formatDate(event?.end_time)}</p>
                                        <p className="text-sm text-gray-500">End Time</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900">{event?.venue_name || 'Not specified'}</p>
                                        <p className="text-sm text-gray-500">{event?.address}</p>
                                        <p className="text-sm text-gray-500">{event?.city}, {event?.country}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Organizer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Organizer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                        <Users size={24} className="text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{event?.organizer_name}</p>
                                        <p className="text-sm text-gray-500">Organizer ID: #{event?.organizer_id}</p>
                                    </div>
                                </div>
                                {event?.organizer_email && (
                                    <a href={`mailto:${event.organizer_email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                                        <Mail size={14} />
                                        {event.organizer_email}
                                    </a>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status & Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Platform Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Status</span>
                                    <Badge className={getStatusColor(event?.status)}>
                                        {event?.status?.toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Featured</span>
                                    {event?.is_featured ? (
                                        <CheckCircle size={20} className="text-green-600" />
                                    ) : (
                                        <XCircle size={20} className="text-gray-400" />
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Platform Fee</span>
                                    <span className="font-semibold text-gray-900">{event?.platform_fee_percentage || 1.5}%</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <Card>
                            <CardContent className="p-4 text-sm text-gray-500 space-y-1">
                                <p>Created: {formatDate(event?.created_at)}</p>
                                <p>Updated: {formatDate(event?.updated_at)}</p>
                                <p className="font-mono text-xs break-all">Slug: {event?.slug}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'tickets' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tag size={20} className="text-red-600" />
                            All Ticket Types
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {event?.ticket_types && event.ticket_types.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-medium text-gray-600">Ticket Name</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-600">Price</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-600">Quantity</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-600">Sold</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-600">Revenue</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-600">% Sold</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {event.ticket_types.map((ticket) => (
                                            <tr key={ticket.id} className="border-b border-gray-100">
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{ticket.name}</p>
                                                        {ticket.description && (
                                                            <p className="text-xs text-gray-500 truncate max-w-xs">{ticket.description}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="text-right py-3 px-4 font-semibold">{formatCurrency(ticket.price)}</td>
                                                <td className="text-right py-3 px-4">{ticket.quantity}</td>
                                                <td className="text-right py-3 px-4">{ticket.sold || 0}</td>
                                                <td className="text-right py-3 px-4 font-semibold text-green-600">
                                                    {formatCurrency((ticket.sold || 0) * ticket.price)}
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-red-600 rounded-full"
                                                                style={{ width: `${ticket.quantity > 0 ? (ticket.sold / ticket.quantity) * 100 : 0}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm">
                                                            {ticket.quantity > 0 ? Math.round((ticket.sold / ticket.quantity) * 100) : 0}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-50 font-semibold">
                                            <td className="py-3 px-4">Total</td>
                                            <td className="text-right py-3 px-4">-</td>
                                            <td className="text-right py-3 px-4">
                                                {event.ticket_types.reduce((sum, t) => sum + t.quantity, 0)}
                                            </td>
                                            <td className="text-right py-3 px-4">
                                                {event.ticket_types.reduce((sum, t) => sum + (t.sold || 0), 0)}
                                            </td>
                                            <td className="text-right py-3 px-4 text-green-600">
                                                {formatCurrency(event.ticket_types.reduce((sum, t) => sum + ((t.sold || 0) * t.price), 0))}
                                            </td>
                                            <td className="text-right py-3 px-4">-</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Tag size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">No ticket types available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {activeTab === 'settings' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Edit Form */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Edit Event</CardTitle>
                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <Button onClick={() => setIsEditing(true)}>
                                        <Edit3 size={16} />
                                        Edit
                                    </Button>
                                ) : (
                                    <>
                                        <Button variant="outline" onClick={() => {
                                            setIsEditing(false);
                                            fetchEventDetails();
                                        }}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSave} disabled={isSaving}>
                                            {isSaving ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Save size={16} />
                                            )}
                                            Save
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                    <input
                                        type="datetime-local"
                                        name="end_time"
                                        value={formData.end_time}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name</label>
                                <input
                                    type="text"
                                    name="venue_name"
                                    value={formData.venue_name}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image URL</label>
                                <input
                                    type="url"
                                    name="banner_image"
                                    value={formData.banner_image}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Platform Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Platform Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="pending">Pending</option>
                                    <option value="published">Published</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Featured Event</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1 ml-8">Featured events appear prominently on the homepage</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Percent size={14} className="inline mr-1" />
                                    Platform Fee Percentage
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        name="platform_fee_percentage"
                                        value={formData.platform_fee_percentage}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50"
                                    />
                                    <span className="text-gray-600 font-medium">%</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Platform commission on ticket sales. Current fee: {formData.platform_fee_percentage}%
                                </p>
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm">
                                        <span className="text-gray-600">Estimated Platform Earnings:</span>
                                        <span className="font-bold text-green-600 ml-2">
                                            {formatCurrency((event?.total_revenue || 0) * formData.platform_fee_percentage / 100)}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AdminEventDetail;
