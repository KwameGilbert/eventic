import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar,
    Search,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Star,
    StarOff,
    Loader2,
    AlertCircle,
    MapPin,
    Clock,
    DollarSign,
    Users,
    RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import adminService from '../../services/adminService';
import { showSuccess, showError, showConfirm } from '../../utils/toast';

const AdminEvents = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [featuredFilter, setFeaturedFilter] = useState('all');
    const [processingActions, setProcessingActions] = useState({});
    const [stats, setStats] = useState({
        total: 0,
        published: 0,
        pending: 0,
        featured: 0,
        cancelled: 0
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [events, searchTerm, statusFilter, featuredFilter]);

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await adminService.getEvents();

            if (response.success) {
                const eventsData = response.data.events || [];
                setEvents(eventsData);

                // Calculate stats
                setStats({
                    total: eventsData.length,
                    published: eventsData.filter(e => e.status === 'published').length,
                    pending: eventsData.filter(e => e.status === 'pending').length,
                    featured: eventsData.filter(e => e.is_featured).length,
                    cancelled: eventsData.filter(e => e.status === 'cancelled').length,
                });
            } else {
                setError(response.message || 'Failed to fetch events');
            }
        } catch (err) {
            console.error('Error fetching events:', err);
            setError(err.message || 'An error occurred while fetching events');
        } finally {
            setIsLoading(false);
        }
    };

    const filterEvents = () => {
        let filtered = [...events];

        // Search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(event =>
                event.title?.toLowerCase().includes(search) ||
                event.organizer_name?.toLowerCase().includes(search) ||
                event.slug?.toLowerCase().includes(search)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(event => event.status === statusFilter);
        }

        // Featured filter
        if (featuredFilter === 'featured') {
            filtered = filtered.filter(event => event.is_featured);
        } else if (featuredFilter === 'not-featured') {
            filtered = filtered.filter(event => !event.is_featured);
        }

        setFilteredEvents(filtered);
    };

    const handleApproveEvent = async (eventId) => {
        try {
            setProcessingActions(prev => ({ ...prev, [`approve-${eventId}`]: true }));
            const response = await adminService.approveEvent(eventId);

            if (response.success) {
                showSuccess('Event approved successfully');
                fetchEvents();
            } else {
                showError(response.message || 'Failed to approve event');
            }
        } catch (err) {
            showError(err.message || 'Failed to approve event');
        } finally {
            setProcessingActions(prev => ({ ...prev, [`approve-${eventId}`]: false }));
        }
    };

    const handleRejectEvent = async (eventId) => {
        const result = await showConfirm({
            title: 'Reject Event',
            text: 'Are you sure you want to reject this event? This action cannot be undone.',
            confirmButtonText: 'Yes, reject',
            icon: 'warning'
        });

        if (!result.isConfirmed) return;

        try {
            setProcessingActions(prev => ({ ...prev, [`reject-${eventId}`]: true }));
            const response = await adminService.rejectEvent(eventId);

            if (response.success) {
                showSuccess('Event rejected successfully');
                fetchEvents();
            } else {
                showError(response.message || 'Failed to reject event');
            }
        } catch (err) {
            showError(err.message || 'Failed to reject event');
        } finally {
            setProcessingActions(prev => ({ ...prev, [`reject-${eventId}`]: false }));
        }
    };

    const handleToggleFeatured = async (eventId, currentStatus) => {
        try {
            setProcessingActions(prev => ({ ...prev, [`feature-${eventId}`]: true }));
            const response = await adminService.toggleEventFeatured(eventId, !currentStatus);

            if (response.success) {
                showSuccess(currentStatus ? 'Event unfeatured' : 'Event featured');
                fetchEvents();
            } else {
                showError(response.message || 'Failed to update feature status');
            }
        } catch (err) {
            showError(err.message || 'Failed to update feature status');
        } finally {
            setProcessingActions(prev => ({ ...prev, [`feature-${eventId}`]: false }));
        }
    };

    const handleChangeStatus = async (eventId, newStatus) => {
        try {
            setProcessingActions(prev => ({ ...prev, [`status-${eventId}`]: true }));
            const response = await adminService.updateEventStatus(eventId, newStatus);

            if (response.success) {
                showSuccess(`Event status changed to ${newStatus}`);
                fetchEvents();
            } else {
                showError(response.message || 'Failed to change status');
            }
        } catch (err) {
            showError(err.message || 'Failed to change status');
        } finally {
            setProcessingActions(prev => ({ ...prev, [`status-${eventId}`]: false }));
        }
    };

    const handleDeleteEvent = async (eventId) => {
        const result = await showConfirm({
            title: 'Delete Event',
            text: 'Are you sure you want to delete this event? This action cannot be undone and will delete all associated tickets and orders.',
            confirmButtonText: 'Yes, delete',
            icon: 'warning'
        });

        if (!result.isConfirmed) return;

        try {
            setProcessingActions(prev => ({ ...prev, [`delete-${eventId}`]: true }));
            const response = await adminService.deleteEvent(eventId);

            if (response.success) {
                showSuccess('Event deleted successfully');
                fetchEvents();
            } else {
                showError(response.message || 'Failed to delete event');
            }
        } catch (err) {
            showError(err.message || 'Failed to delete event');
        } finally {
            setProcessingActions(prev => ({ ...prev, [`delete-${eventId}`]: false }));
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading events...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Ticketing Events</h1>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
                        <div>
                            <h3 className="font-semibold text-red-800 mb-1">Error Loading Events</h3>
                            <p className="text-red-700">{error}</p>
                            <button
                                onClick={fetchEvents}
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Ticketing Events</h1>
                    <p className="text-gray-500 mt-1">Manage all events on the platform</p>
                </div>
                <Button onClick={fetchEvents} variant="outline" size="sm">
                    <RefreshCw size={16} />
                    Refresh
                </Button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                <Calendar size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-xs text-gray-500">Total Events</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                                <CheckCircle size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
                                <p className="text-xs text-gray-500">Published</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0">
                                <Clock size={20} className="text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                                <p className="text-xs text-gray-500">Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                                <Star size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.featured}</p>
                                <p className="text-xs text-gray-500">Featured</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                                <XCircle size={20} className="text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
                                <p className="text-xs text-gray-500">Cancelled</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="published">Published</option>
                            <option value="pending">Pending</option>
                            <option value="draft">Draft</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                        </select>

                        {/* Featured Filter */}
                        <select
                            value={featuredFilter}
                            onChange={(e) => setFeaturedFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="all">All Events</option>
                            <option value="featured">Featured Only</option>
                            <option value="not-featured">Not Featured</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Events List */}
            <Card>
                <CardHeader>
                    <CardTitle>Events ({filteredEvents.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">No events found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                                        {/* Event Image */}
                                        <div className="w-full sm:w-20 md:w-24 h-20 md:h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                            {event.banner_image ? (
                                                <img
                                                    src={event.banner_image}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Calendar size={32} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Event Details */}
                                        <div className="flex-1 min-w-0 w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                                                            {event.title}
                                                        </h3>
                                                        {event.is_featured && (
                                                            <Star size={16} className="text-yellow-500 fill-yellow-500 shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        by {event.organizer_name || 'Unknown Organizer'}
                                                    </p>
                                                </div>
                                                <Badge className={getStatusColor(event.status)}>
                                                    {event.status}
                                                </Badge>
                                            </div>

                                            {/* Event Meta */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3">
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <Clock size={14} className="shrink-0" />
                                                    <span className="truncate">{formatDate(event.start_time)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <MapPin size={14} className="shrink-0" />
                                                    <span className="truncate">{event.venue_name || 'No venue'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <Users size={14} className="shrink-0" />
                                                    <span>{event.tickets_sold || 0} tickets sold</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                                    <DollarSign size={14} className="shrink-0" />
                                                    <span>{adminService.formatCurrency(event.total_revenue || 0)}</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-2">
                                                {/* View Event */}
                                                <Link to={`/event/${event.slug}`} target="_blank">
                                                    <Button size="sm" variant="outline" className="text-xs sm:text-sm">
                                                        <Eye size={14} />
                                                        <span className="hidden sm:inline">Public View</span>
                                                    </Button>
                                                </Link>

                                                {/* Edit Event */}
                                                <Link to={`/admin/events/${event.id}`}>
                                                    <Button size="sm" variant="outline" className="text-xs sm:text-sm">
                                                        <Edit size={14} />
                                                        <span className="hidden sm:inline">Admin View</span>
                                                    </Button>
                                                </Link>

                                                {/* Approve/Reject for pending events */}
                                                {event.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleApproveEvent(event.id)}
                                                            disabled={processingActions[`approve-${event.id}`]}
                                                            className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                                                        >
                                                            {processingActions[`approve-${event.id}`] ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : (
                                                                <CheckCircle size={14} />
                                                            )}
                                                            <span className="hidden sm:inline">Approve</span>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleRejectEvent(event.id)}
                                                            disabled={processingActions[`reject-${event.id}`]}
                                                            className="text-red-600 border-red-600 hover:bg-red-50 text-xs sm:text-sm"
                                                        >
                                                            {processingActions[`reject-${event.id}`] ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : (
                                                                <XCircle size={14} />
                                                            )}
                                                            <span className="hidden sm:inline">Reject</span>
                                                        </Button>
                                                    </>
                                                )}

                                                {/* Toggle Featured */}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleToggleFeatured(event.id, event.is_featured)}
                                                    disabled={processingActions[`feature-${event.id}`]}
                                                    className="text-xs sm:text-sm"
                                                >
                                                    {processingActions[`feature-${event.id}`] ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : event.is_featured ? (
                                                        <StarOff size={14} />
                                                    ) : (
                                                        <Star size={14} />
                                                    )}
                                                    <span className="hidden md:inline">{event.is_featured ? 'Unfeature' : 'Feature'}</span>
                                                </Button>

                                                {/* Status Change Dropdown */}
                                                <select
                                                    value={event.status}
                                                    onChange={(e) => handleChangeStatus(event.id, e.target.value)}
                                                    disabled={processingActions[`status-${event.id}`]}
                                                    className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                >
                                                    <option value="draft">Draft</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="published">Published</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>

                                                {/* Delete Event */}
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDeleteEvent(event.id)}
                                                    disabled={processingActions[`delete-${event.id}`]}
                                                    className="text-red-600 border-red-600 hover:bg-red-50 text-xs sm:text-sm"
                                                >
                                                    {processingActions[`delete-${event.id}`] ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={14} />
                                                    )}
                                                    <span className="hidden sm:inline">Delete</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminEvents;
