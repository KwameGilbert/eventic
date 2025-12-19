import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Search,
    Download,
    Mail,
    ChevronDown,
    CheckCircle,
    XCircle,
    Calendar,
    MoreVertical,
    UserCheck,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import attendeeService from '../../services/attendeeService';
import { showError } from '../../utils/toast';

const Attendees = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [eventFilter, setEventFilter] = useState('all');
    const [selectedAttendees, setSelectedAttendees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Data from API
    const [attendees, setAttendees] = useState([]);
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({
        total_attendees: 0,
        checked_in: 0,
        not_checked_in: 0,
        total_events: 0
    });

    // Fetch attendees from API
    useEffect(() => {
        fetchAttendees();
    }, [eventFilter, statusFilter]);

    const fetchAttendees = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const params = {};
            if (eventFilter !== 'all') {
                params.event_id = eventFilter;
            }
            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }
            if (searchQuery) {
                params.search = searchQuery;
            }

            const response = await attendeeService.getOrganizerAttendees(params);

            if (response.success) {
                setAttendees(response.data.attendees || []);
                setStats(response.data.stats || {
                    total_attendees: 0,
                    checked_in: 0,
                    not_checked_in: 0,
                    total_events: 0
                });
                setEvents(response.data.events || []);
            } else {
                setError(response.message || 'Failed to fetch attendees');
            }
        } catch (err) {
            console.error('Error fetching attendees:', err);
            setError(err.message || 'Failed to fetch attendees');
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                fetchAttendees();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Filter attendees based on search (client-side for faster UX)
    const filteredAttendees = attendees.filter(attendee => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            attendee.name?.toLowerCase().includes(query) ||
            attendee.email?.toLowerCase().includes(query) ||
            attendee.order_reference?.toLowerCase().includes(query) ||
            attendee.ticket_code?.toLowerCase().includes(query)
        );
    });

    const handleSelectAll = () => {
        if (selectedAttendees.length === filteredAttendees.length) {
            setSelectedAttendees([]);
        } else {
            setSelectedAttendees(filteredAttendees.map(a => a.id));
        }
    };

    const handleSelectAttendee = (id) => {
        setSelectedAttendees(prev =>
            prev.includes(id)
                ? prev.filter(a => a !== id)
                : [...prev, id]
        );
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        showError('Export functionality coming soon!');
    };

    // Loading state
    if (isLoading && attendees.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin text-(--brand-primary) mx-auto mb-4" />
                    <p className="text-gray-600">Loading attendees...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && attendees.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Attendees</h1>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
                        <div>
                            <h3 className="font-semibold text-red-800 mb-1">Error Loading Attendees</h3>
                            <p className="text-red-700">{error}</p>
                            <button
                                onClick={fetchAttendees}
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
                    <h1 className="text-2xl font-bold text-gray-900">Attendees</h1>
                    <p className="text-gray-500 mt-1">Manage attendees across all your events</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
                        <Download size={18} />
                        Export
                    </Button>
                    {selectedAttendees.length > 0 && (
                        <Button variant="outline" className="gap-2">
                            <Mail size={18} />
                            Email Selected ({selectedAttendees.length})
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Users size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_attendees.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Total Attendees</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <UserCheck size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.checked_in}</p>
                                <p className="text-xs text-gray-500">Checked In</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <XCircle size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.not_checked_in}</p>
                                <p className="text-xs text-gray-500">Not Checked In</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Calendar size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_events}</p>
                                <p className="text-xs text-gray-500">Events</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, email, or order ID..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                            />
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <select
                                    value={eventFilter}
                                    onChange={(e) => setEventFilter(e.target.value)}
                                    className="appearance-none bg-white pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 min-w-[200px]"
                                >
                                    <option value="all">All Events</option>
                                    {events.map((event) => (
                                        <option key={event.id} value={event.id}>{event.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="appearance-none bg-white pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20"
                                >
                                    <option value="all">All Status</option>
                                    <option value="checked-in">Checked In</option>
                                    <option value="not-checked-in">Not Checked In</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Attendees Table */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={32} className="animate-spin text-(--brand-primary)" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-4 px-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                                                onChange={handleSelectAll}
                                                className="w-4 h-4 text-(--brand-primary) rounded"
                                            />
                                        </th>
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Attendee</th>
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Event</th>
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Ticket</th>
                                        <th className="text-left py-4 px-4 text-sm font-medium text-gray-500">Order</th>
                                        <th className="text-center py-4 px-4 text-sm font-medium text-gray-500">Status</th>
                                        <th className="text-right py-4 px-4 text-sm font-medium text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAttendees.map((attendee) => (
                                        <tr key={attendee.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAttendees.includes(attendee.id)}
                                                    onChange={() => handleSelectAttendee(attendee.id)}
                                                    className="w-4 h-4 text-(--brand-primary) rounded"
                                                />
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={attendee.avatar}
                                                        alt={attendee.name}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{attendee.name}</p>
                                                        <p className="text-sm text-gray-500">{attendee.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Link
                                                    to={`/organizer/events/${attendee.event_id}`}
                                                    className="text-sm text-(--brand-primary) hover:underline"
                                                >
                                                    {attendee.event}
                                                </Link>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{attendee.ticket_type}</p>
                                                    <p className="text-xs text-gray-500 font-mono">{attendee.ticket_code}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Link
                                                    to={`/organizer/orders/${attendee.order_id}`}
                                                    className="text-sm text-(--brand-primary) hover:underline"
                                                >
                                                    {attendee.order_reference}
                                                </Link>
                                                <p className="text-xs text-gray-500">{formatDate(attendee.order_date)}</p>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {attendee.checked_in ? (
                                                    <div className="flex flex-col items-center">
                                                        <Badge variant="success" className="gap-1">
                                                            <CheckCircle size={12} />
                                                            Checked In
                                                        </Badge>
                                                        {attendee.check_in_time && (
                                                            <span className="text-xs text-gray-500 mt-1">
                                                                {formatDateTime(attendee.check_in_time)}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <Badge variant="secondary" className="gap-1">
                                                        <XCircle size={12} />
                                                        Not Checked In
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="outline" size="sm">
                                                        <Mail size={14} />
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <MoreVertical size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!isLoading && filteredAttendees.length === 0 && (
                        <div className="text-center py-12">
                            <Users size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No attendees found</h3>
                            <p className="text-gray-500">
                                {searchQuery || eventFilter !== 'all' || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'Attendees will appear here when tickets are purchased'}
                            </p>
                        </div>
                    )}

                    {/* Pagination Info */}
                    {!isLoading && filteredAttendees.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Showing {filteredAttendees.length} of {stats.total_attendees} attendees
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Attendees;
