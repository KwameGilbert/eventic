import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    Copy,
    Calendar,
    MapPin,
    Users,
    TicketCheck,
    TrendingUp,
    LayoutGrid,
    List,
    ChevronDown
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';

const Events = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [openDropdown, setOpenDropdown] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Stats
    const stats = [
        { label: 'Total Events', value: '48', icon: Calendar, color: '#3b82f6' },
        { label: 'Published', value: '32', icon: TrendingUp, color: '#22c55e' },
        { label: 'Draft', value: '12', icon: Edit, color: '#f59e0b' },
        { label: 'Completed', value: '4', icon: TicketCheck, color: '#8b5cf6' },
    ];

    // Tabs
    const tabs = [
        { id: 'all', label: 'All Events', count: 48 },
        { id: 'published', label: 'Published', count: 32 },
        { id: 'draft', label: 'Draft', count: 12 },
        { id: 'completed', label: 'Completed', count: 4 },
    ];

    // Mock events data
    const events = [
        {
            id: 1,
            name: 'Summer Music Festival 2024',
            image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=200&fit=crop',
            date: 'Jun 15, 2024',
            time: '6:00 PM',
            location: 'Central Park, New York',
            category: 'Music',
            status: 'Published',
            ticketsSold: 423,
            totalTickets: 500,
            revenue: 25380
        },
        {
            id: 2,
            name: 'Tech Conference 2024',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop',
            date: 'May 20, 2024',
            time: '9:00 AM',
            location: 'Convention Center, San Francisco',
            category: 'Technology',
            status: 'Published',
            ticketsSold: 267,
            totalTickets: 300,
            revenue: 40050
        },
        {
            id: 3,
            name: 'Art Exhibition Opening',
            image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=300&h=200&fit=crop',
            date: 'Jul 10, 2024',
            time: '2:00 PM',
            location: 'Modern Art Gallery, LA',
            category: 'Art',
            status: 'Draft',
            ticketsSold: 0,
            totalTickets: 150,
            revenue: 0
        },
        {
            id: 4,
            name: 'Food & Wine Tasting',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop',
            date: 'Jun 22, 2024',
            time: '7:00 PM',
            location: 'Grand Hotel, Chicago',
            category: 'Food & Drink',
            status: 'Published',
            ticketsSold: 156,
            totalTickets: 200,
            revenue: 10920
        },
        {
            id: 5,
            name: 'Startup Pitch Night',
            image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&h=200&fit=crop',
            date: 'Apr 15, 2024',
            time: '5:00 PM',
            location: 'Innovation Hub, Austin',
            category: 'Business',
            status: 'Completed',
            ticketsSold: 180,
            totalTickets: 180,
            revenue: 5400
        },
        {
            id: 6,
            name: 'Yoga & Wellness Retreat',
            image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&h=200&fit=crop',
            date: 'Aug 5, 2024',
            time: '8:00 AM',
            location: 'Mountain Resort, Denver',
            category: 'Health',
            status: 'Draft',
            ticketsSold: 0,
            totalTickets: 50,
            revenue: 0
        },
    ];

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'published': return 'success';
            case 'draft': return 'warning';
            case 'completed': return 'info';
            case 'cancelled': return 'destructive';
            default: return 'secondary';
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesTab = activeTab === 'all' || event.status.toLowerCase() === activeTab;
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const toggleDropdown = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    // Grid View Component
    const GridView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden group">
                    {/* Event Image */}
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={event.image}
                            alt={event.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                            <Badge variant={getStatusStyle(event.status)}>
                                {event.status}
                            </Badge>
                            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-700">
                                {event.category}
                            </Badge>
                        </div>
                        {/* Actions Dropdown */}
                        <div className="absolute top-3 right-3">
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown(event.id)}
                                    className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                                >
                                    <MoreVertical size={16} className="text-gray-700" />
                                </button>
                                {openDropdown === event.id && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                                        <Link
                                            to={`/organizer/events/${event.id}`}
                                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <Eye size={14} />
                                            View Details
                                        </Link>
                                        <Link
                                            to={`/organizer/events/${event.id}/edit`}
                                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <Edit size={14} />
                                            Edit Event
                                        </Link>
                                        <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                            <Copy size={14} />
                                            Duplicate
                                        </button>
                                        <hr className="my-1" />
                                        <button className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Event Content */}
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 group-hover:text-(--brand-primary) transition-colors line-clamp-1">
                            {event.name}
                        </h3>

                        <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar size={14} />
                                <span>{event.date} at {event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin size={14} />
                                <span className="truncate">{event.location}</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <Users size={14} />
                                    <span>{event.ticketsSold}/{event.totalTickets} sold</span>
                                </div>
                                <span className="text-sm font-semibold text-(--brand-primary)">
                                    ${event.revenue.toLocaleString()}
                                </span>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-(--brand-primary) rounded-full transition-all"
                                    style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    // Table/List View Component
    const ListView = () => (
        <Card>
            <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[210px]">Event</th>
                            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[120px]">Date & Time</th>
                            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[120px]">Location</th>
                            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Status</th>
                            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Tickets</th>
                            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[100px]">Revenue</th>
                            <th className="text-right py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[60px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map((event) => (
                            <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                {/* Event */}
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={event.image}
                                            alt={event.name}
                                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-gray-900 truncate group-hover:text-(--brand-primary) transition-colors" title={event.name}>
                                                {event.name}
                                            </p>
                                            <p className="text-xs text-gray-500">{event.category}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Date & Time */}
                                <td className="py-4 px-4">
                                    <p className="text-sm text-gray-900 whitespace-nowrap">{event.date}</p>
                                    <p className="text-xs text-gray-500">{event.time}</p>
                                </td>

                                {/* Location */}
                                <td className="py-4 px-4">
                                    <p className="text-sm text-gray-600 truncate" title={event.location}>{event.location}</p>
                                </td>

                                {/* Status */}
                                <td className="py-4 px-4">
                                    <Badge variant={getStatusStyle(event.status)}>
                                        {event.status}
                                    </Badge>
                                </td>

                                {/* Tickets */}
                                <td className="py-4 px-4">
                                    <div className="space-y-1">
                                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-(--brand-primary) rounded-full"
                                                style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-900">
                                            {event.ticketsSold}/{event.totalTickets}
                                        </span>
                                    </div>
                                </td>

                                {/* Revenue */}
                                <td className="py-4 px-4">
                                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                        ${event.revenue.toLocaleString()}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="py-4 px-4">
                                    <div className="flex items-center justify-end">
                                        <div className="relative">
                                            <button
                                                onClick={() => toggleDropdown(`list-${event.id}`)}
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                            {openDropdown === `list-${event.id}` && (
                                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                                                    <Link
                                                        to={`/organizer/events/${event.id}`}
                                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <Eye size={14} />
                                                        View Details
                                                    </Link>
                                                    <Link
                                                        to={`/organizer/events/${event.id}/edit`}
                                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <Edit size={14} />
                                                        Edit Event
                                                    </Link>
                                                    <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                        <Copy size={14} />
                                                        Duplicate
                                                    </button>
                                                    <hr className="my-1" />
                                                    <button className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Events</h1>
                    <p className="text-gray-500 mt-1">Manage and monitor all your events</p>
                </div>
                <Link to="/organizer/events/create">
                    <Button className="gap-2">
                        <Plus size={18} />
                        Create Event
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${stat.color}15` }}
                                    >
                                        <Icon size={20} style={{ color: stat.color }} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <p className="text-xs text-gray-500">{stat.label}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filters & Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Tabs */}
                        <div className="flex gap-1 overflow-x-auto pb-2 lg:pb-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors",
                                        activeTab === tab.id
                                            ? "bg-(--brand-primary) text-white"
                                            : "text-gray-600 hover:bg-gray-100"
                                    )}
                                >
                                    {tab.label}
                                    <span className={cn(
                                        "ml-2 px-1.5 py-0.5 text-xs rounded-full",
                                        activeTab === tab.id
                                            ? "bg-white/20 text-white"
                                            : "bg-gray-100 text-gray-600"
                                    )}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search, View Toggle & Filter */}
                        <div className="flex gap-2">
                            <div className="relative flex-1 lg:w-64">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/20 focus:border-(--brand-primary)"
                                />
                            </div>

                            {/* View Toggle */}
                            <div className="flex bg-gray-100 rounded-lg p-0.5">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        "p-2 rounded-md transition-all",
                                        viewMode === 'grid'
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    )}
                                    title="Grid view"
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "p-2 rounded-md transition-all",
                                        viewMode === 'list'
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    )}
                                    title="List view"
                                >
                                    <List size={18} />
                                </button>
                            </div>

                            <Button variant="outline" size="icon">
                                <Filter size={16} />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Events View */}
            {viewMode === 'grid' ? <GridView /> : <ListView />}

            {/* Empty State */}
            {filteredEvents.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
                        <p className="text-gray-500 mb-4">
                            {searchQuery
                                ? "Try adjusting your search terms"
                                : "Get started by creating your first event"
                            }
                        </p>
                        <Link to="/organizer/events/create">
                            <Button className="gap-2">
                                <Plus size={18} />
                                Create Event
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Events;
