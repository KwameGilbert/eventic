import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Search,
    Filter,
    Download,
    Mail,
    ChevronDown,
    CheckCircle,
    XCircle,
    Calendar,
    TicketCheck,
    MoreVertical,
    UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';

const Attendees = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [eventFilter, setEventFilter] = useState('all');
    const [selectedAttendees, setSelectedAttendees] = useState([]);

    // Stats
    const stats = {
        totalAttendees: 1247,
        checkedIn: 856,
        notCheckedIn: 391,
        uniqueEvents: 12
    };

    // Mock events for filter
    const events = [
        { id: 1, name: 'Summer Music Festival 2024' },
        { id: 2, name: 'Tech Conference 2024' },
        { id: 3, name: 'Art Exhibition Opening' },
        { id: 4, name: 'Food & Wine Festival' },
    ];

    // Mock attendees data
    const attendees = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+233 24 123 4567',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff',
            event: 'Summer Music Festival 2024',
            eventId: 1,
            ticketType: 'VIP Pass',
            ticketCount: 2,
            orderId: 'ORD-001248',
            orderDate: '2024-05-28',
            checkedIn: true,
            checkInTime: '2024-06-15T17:45:00'
        },
        {
            id: 2,
            name: 'Sarah Wilson',
            email: 'sarah.w@email.com',
            phone: '+233 24 234 5678',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=22c55e&color=fff',
            event: 'Summer Music Festival 2024',
            eventId: 1,
            ticketType: 'General Admission',
            ticketCount: 4,
            orderId: 'ORD-001247',
            orderDate: '2024-05-27',
            checkedIn: true,
            checkInTime: '2024-06-15T18:02:00'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike.j@email.com',
            phone: '+233 24 345 6789',
            avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff',
            event: 'Tech Conference 2024',
            eventId: 2,
            ticketType: 'Early Bird',
            ticketCount: 1,
            orderId: 'ORD-001246',
            orderDate: '2024-05-26',
            checkedIn: false,
            checkInTime: null
        },
        {
            id: 4,
            name: 'Emily Brown',
            email: 'emily.b@email.com',
            phone: '+233 24 456 7890',
            avatar: 'https://ui-avatars.com/api/?name=Emily+Brown&background=8b5cf6&color=fff',
            event: 'Art Exhibition Opening',
            eventId: 3,
            ticketType: 'Standard',
            ticketCount: 2,
            orderId: 'ORD-001245',
            orderDate: '2024-05-25',
            checkedIn: true,
            checkInTime: '2024-07-10T10:30:00'
        },
        {
            id: 5,
            name: 'David Lee',
            email: 'david.lee@email.com',
            phone: '+233 24 567 8901',
            avatar: 'https://ui-avatars.com/api/?name=David+Lee&background=ef4444&color=fff',
            event: 'Summer Music Festival 2024',
            eventId: 1,
            ticketType: 'Backstage Experience',
            ticketCount: 1,
            orderId: 'ORD-001244',
            orderDate: '2024-05-24',
            checkedIn: false,
            checkInTime: null
        },
        {
            id: 6,
            name: 'Lisa Chen',
            email: 'lisa.c@email.com',
            phone: '+233 24 678 9012',
            avatar: 'https://ui-avatars.com/api/?name=Lisa+Chen&background=ec4899&color=fff',
            event: 'Tech Conference 2024',
            eventId: 2,
            ticketType: 'VIP',
            ticketCount: 2,
            orderId: 'ORD-001243',
            orderDate: '2024-05-23',
            checkedIn: true,
            checkInTime: '2024-05-20T09:15:00'
        },
        {
            id: 7,
            name: 'James Smith',
            email: 'james.s@email.com',
            phone: '+233 24 789 0123',
            avatar: 'https://ui-avatars.com/api/?name=James+Smith&background=14b8a6&color=fff',
            event: 'Food & Wine Festival',
            eventId: 4,
            ticketType: 'Premium Tasting',
            ticketCount: 2,
            orderId: 'ORD-001242',
            orderDate: '2024-05-22',
            checkedIn: false,
            checkInTime: null
        },
        {
            id: 8,
            name: 'Anna Garcia',
            email: 'anna.g@email.com',
            phone: '+233 24 890 1234',
            avatar: 'https://ui-avatars.com/api/?name=Anna+Garcia&background=6366f1&color=fff',
            event: 'Summer Music Festival 2024',
            eventId: 1,
            ticketType: 'General Admission',
            ticketCount: 3,
            orderId: 'ORD-001241',
            orderDate: '2024-05-21',
            checkedIn: true,
            checkInTime: '2024-06-15T18:30:00'
        },
    ];

    // Filter attendees
    const filteredAttendees = attendees.filter(attendee => {
        const matchesSearch = attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            attendee.orderId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'checked-in' && attendee.checkedIn) ||
            (statusFilter === 'not-checked-in' && !attendee.checkedIn);
        const matchesEvent = eventFilter === 'all' || attendee.eventId === parseInt(eventFilter);
        return matchesSearch && matchesStatus && matchesEvent;
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
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attendees</h1>
                    <p className="text-gray-500 mt-1">Manage attendees across all your events</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
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
                                <p className="text-2xl font-bold text-gray-900">{stats.totalAttendees.toLocaleString()}</p>
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
                                <p className="text-2xl font-bold text-gray-900">{stats.checkedIn}</p>
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
                                <p className="text-2xl font-bold text-gray-900">{stats.notCheckedIn}</p>
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
                                <p className="text-2xl font-bold text-gray-900">{stats.uniqueEvents}</p>
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
                                                to={`/organizer/events/${attendee.eventId}`}
                                                className="text-sm text-(--brand-primary) hover:underline"
                                            >
                                                {attendee.event}
                                            </Link>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{attendee.ticketType}</p>
                                                <p className="text-xs text-gray-500">× {attendee.ticketCount}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <Link
                                                to={`/organizer/orders/${attendee.orderId}`}
                                                className="text-sm text-(--brand-primary) hover:underline"
                                            >
                                                {attendee.orderId}
                                            </Link>
                                            <p className="text-xs text-gray-500">{formatDate(attendee.orderDate)}</p>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {attendee.checkedIn ? (
                                                <div className="flex flex-col items-center">
                                                    <Badge variant="success" className="gap-1">
                                                        <CheckCircle size={12} />
                                                        Checked In
                                                    </Badge>
                                                    <span className="text-xs text-gray-500 mt-1">
                                                        {formatDateTime(attendee.checkInTime)}
                                                    </span>
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

                    {filteredAttendees.length === 0 && (
                        <div className="text-center py-12">
                            <Users size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No attendees found</h3>
                            <p className="text-gray-500">Try adjusting your search or filters</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredAttendees.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Showing {filteredAttendees.length} of {attendees.length} attendees
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled>
                                    Previous
                                </Button>
                                <Button variant="outline" size="sm">
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Attendees;
