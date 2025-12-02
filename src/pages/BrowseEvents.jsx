import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Grid, List, Home as HomeIcon, ThumbsUp, Bookmark, Rss } from 'lucide-react';
import { Link } from 'react-router-dom';
import FilterSidebar from '../components/events/FilterSidebar';
import { upcomingEvents } from '../data/mockEvents';

const BrowseEvents = () => {
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [filteredEvents, setFilteredEvents] = useState(upcomingEvents);
    const [currentFilters, setCurrentFilters] = useState(null);

    const handleFilterChange = (filters) => {
        setCurrentFilters(filters);

        // Apply all filters
        let filtered = upcomingEvents.filter(event => {
            // Keyword filter
            if (filters.keyword && filters.keyword.trim() !== '') {
                const keyword = filters.keyword.toLowerCase();
                const matchesKeyword =
                    event.title.toLowerCase().includes(keyword) ||
                    event.venue.toLowerCase().includes(keyword) ||
                    event.category.toLowerCase().includes(keyword);

                if (!matchesKeyword) return false;
            }

            // Category filter
            if (filters.category && filters.category !== '') {
                if (event.slug !== filters.category) return false;
            }

            // Location filter
            if (filters.location && filters.location !== '') {
                if (event.location.toLowerCase() !== filters.location.toLowerCase()) return false;
            }

            // Online events only
            if (filters.onlineOnly && !event.isOnline) return false;

            // Local events only (Ghana)
            if (filters.localOnly && event.country !== 'Ghana') return false;

            // Country filter
            if (filters.country && filters.country !== '') {
                if (event.country !== filters.country) return false;
            }

            // Date filter
            if (filters.date && filters.date !== '') {
                const eventDate = new Date(event.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                switch (filters.date) {
                    case 'today':
                        const todayEnd = new Date(today);
                        todayEnd.setHours(23, 59, 59, 999);
                        if (eventDate < today || eventDate > todayEnd) return false;
                        break;

                    case 'tomorrow':
                        const tomorrow = new Date(today);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const tomorrowEnd = new Date(tomorrow);
                        tomorrowEnd.setHours(23, 59, 59, 999);
                        if (eventDate < tomorrow || eventDate > tomorrowEnd) return false;
                        break;

                    case 'this-weekend':
                        const dayOfWeek = today.getDay();
                        const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
                        const saturday = new Date(today);
                        saturday.setDate(today.getDate() + daysUntilSaturday);
                        const sunday = new Date(saturday);
                        sunday.setDate(saturday.getDate() + 1);
                        sunday.setHours(23, 59, 59, 999);
                        if (eventDate < saturday || eventDate > sunday) return false;
                        break;

                    case 'this-week':
                        const weekEnd = new Date(today);
                        weekEnd.setDate(today.getDate() + (7 - today.getDay()));
                        weekEnd.setHours(23, 59, 59, 999);
                        if (eventDate < today || eventDate > weekEnd) return false;
                        break;

                    case 'next-week':
                        const nextWeekStart = new Date(today);
                        nextWeekStart.setDate(today.getDate() + (7 - today.getDay() + 1));
                        const nextWeekEnd = new Date(nextWeekStart);
                        nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
                        nextWeekEnd.setHours(23, 59, 59, 999);
                        if (eventDate < nextWeekStart || eventDate > nextWeekEnd) return false;
                        break;

                    case 'this-month':
                        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
                        if (eventDate < today || eventDate > monthEnd) return false;
                        break;

                    case 'next-month':
                        const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
                        const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0, 23, 59, 59, 999);
                        if (eventDate < nextMonthStart || eventDate > nextMonthEnd) return false;
                        break;
                }
            }

            // Price range filter
            if (filters.priceMin !== undefined && filters.priceMax !== undefined) {
                if (event.numericPrice < filters.priceMin || event.numericPrice > filters.priceMax) {
                    return false;
                }
            }

            return true;
        });

        setFilteredEvents(filtered);
    };

    const formatEventDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const day = date.getDate();
        return { month, day };
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">Events</h1>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Link to="/" className="hover:text-[var(--brand-primary)]">
                                <HomeIcon size={16} />
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">Events</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filter Sidebar */}
                    <div className="lg:col-span-1">
                        <FilterSidebar onFilterChange={handleFilterChange} />
                    </div>

                    {/* Events Grid */}
                    <div className="lg:col-span-3">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                <span className="font-semibold text-[var(--brand-primary)]">{filteredEvents.length} event(s)</span> found
                            </p>

                            <div className="flex items-center gap-2">
                                {/* Action Buttons */}
                                <button
                                    className="p-2.5 bg-[var(--brand-primary)] hover:opacity-90 text-white rounded-full transition-opacity"
                                    title="Like"
                                >
                                    <ThumbsUp size={20} />
                                </button>
                                <button
                                    className="p-2.5 bg-[var(--brand-primary)] hover:opacity-90 text-white rounded-full transition-opacity"
                                    title="Bookmark"
                                >
                                    <Bookmark size={20} />
                                </button>
                                <button
                                    className="p-2.5 bg-[var(--brand-primary)] hover:opacity-90 text-white rounded-full transition-opacity"
                                    title="RSS Feed"
                                >
                                    <Rss size={20} />
                                </button>

                                {/* View Toggle */}
                                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1 ml-3">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[var(--brand-primary)] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <Grid size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-[var(--brand-primary)] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <List size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Event Cards */}
                        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                            {filteredEvents.map((event) => {
                                const { month, day } = formatEventDate(event.date);

                                return (
                                    <div
                                        key={event.id}
                                        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                                    >
                                        {/* Event Image */}
                                        <div className="relative h-48 overflow-hidden bg-gray-200">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />

                                            {/* Category Badge - Top Left */}
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                                                    {event.category}
                                                </span>
                                            </div>

                                            {/* Date Badge - Top Right */}
                                            <div className="absolute top-3 right-3 bg-white rounded-lg overflow-hidden shadow-md">
                                                <div className="bg-[var(--brand-primary)] text-white text-xs font-bold px-3 py-1 text-center">
                                                    {month}
                                                </div>
                                                <div className="bg-white text-gray-900 text-xl font-bold px-3 py-1 text-center">
                                                    {day}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Event Details */}
                                        <div className="p-5">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[var(--brand-primary)] transition-colors">
                                                {event.title}
                                            </h3>

                                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                                                    <span>{event.venue}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                                                    <span>{event.date} • {event.time}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <span className="text-lg font-bold text-[var(--brand-primary)]">
                                                    {event.price}
                                                </span>
                                                <button className="text-sm font-semibold text-gray-700 hover:text-[var(--brand-primary)] transition-colors">
                                                    View Details →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrowseEvents;
