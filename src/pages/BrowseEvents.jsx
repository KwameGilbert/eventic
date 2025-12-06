import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, MapPin, Grid, List, Home as HomeIcon, ThumbsUp, Bookmark, Rss, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/events/FilterSidebar';
import eventService from '../services/eventService';

const BrowseEvents = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState('grid');
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        perPage: 12,
        total: 0,
        totalPages: 0
    });
    const [currentFilters, setCurrentFilters] = useState({});

    // Fetch events from API
    const fetchEvents = useCallback(async (filters = {}, page = 1) => {
        setIsLoading(true);
        setError(null);

        try {
            const params = {
                page,
                per_page: pagination.perPage,
                upcoming: 'true',
                ...filters
            };

            // Add search param if exists
            if (filters.keyword) {
                params.search = filters.keyword;
                delete params.keyword;
            }

            // Add category filter
            if (filters.category) {
                params.category = filters.category;
            }

            // Add location filter
            if (filters.location) {
                params.location = filters.location;
            }

            const response = await eventService.getAll(params);
            const data = response?.data || response;

            setEvents(data?.events || []);
            setPagination(prev => ({
                ...prev,
                page: data?.page || 1,
                total: data?.total || 0,
                totalPages: data?.total_pages || 1
            }));
        } catch (err) {
            console.error('Failed to fetch events:', err);
            setError('Failed to load events. Please try again.');
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.perPage]);

    // Initial load
    useEffect(() => {
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        const initialFilters = {};
        if (category) initialFilters.category = category;
        if (search) initialFilters.keyword = search;

        setCurrentFilters(initialFilters);
        fetchEvents(initialFilters);
    }, [searchParams, fetchEvents]);

    // Handle filter changes
    const handleFilterChange = (filters) => {
        setCurrentFilters(filters);

        // Update URL params
        const params = new URLSearchParams();
        if (filters.category) params.set('category', filters.category);
        if (filters.keyword) params.set('search', filters.keyword);
        setSearchParams(params);

        // Fetch with new filters
        fetchEvents(filters, 1);
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        fetchEvents(currentFilters, newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Format date for display
    const formatEventDate = (dateString) => {
        if (!dateString) return { month: '---', day: '--' };
        const date = new Date(dateString);
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const day = date.getDate();
        return { month, day };
    };

    // Retry loading
    const handleRetry = () => {
        fetchEvents(currentFilters, pagination.page);
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
                            <Link to="/" className="hover:text-(--brand-primary)">
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
                        <FilterSidebar
                            onFilterChange={handleFilterChange}
                            initialFilters={currentFilters}
                        />
                    </div>

                    {/* Events Grid */}
                    <div className="lg:col-span-3">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                {isLoading ? (
                                    <span>Loading events...</span>
                                ) : (
                                    <>
                                        <span className="font-semibold text-(--brand-primary)">{pagination.total} event(s)</span> found
                                    </>
                                )}
                            </p>

                            <div className="flex items-center gap-2">
                                {/* Action Buttons */}
                                <button
                                    className="p-2.5 bg-(--brand-primary) hover:opacity-90 text-white rounded-full transition-opacity"
                                    title="Like"
                                >
                                    <ThumbsUp size={20} />
                                </button>
                                <button
                                    className="p-2.5 bg-(--brand-primary) hover:opacity-90 text-white rounded-full transition-opacity"
                                    title="Bookmark"
                                >
                                    <Bookmark size={20} />
                                </button>
                                <button
                                    className="p-2.5 bg-(--brand-primary) hover:opacity-90 text-white rounded-full transition-opacity"
                                    title="RSS Feed"
                                >
                                    <Rss size={20} />
                                </button>

                                {/* View Toggle */}
                                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1 ml-3">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-(--brand-primary) text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <Grid size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-(--brand-primary) text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <List size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-center">
                                    <Loader2 className="w-10 h-10 animate-spin text-(--brand-primary) mx-auto mb-4" />
                                    <p className="text-gray-600">Loading events...</p>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && !isLoading && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Events</h3>
                                <p className="text-red-600 mb-4">{error}</p>
                                <button
                                    onClick={handleRetry}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <RefreshCw size={18} />
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && !error && events.length === 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
                                <p className="text-gray-600 mb-6">Try adjusting your filters or check back later for new events.</p>
                                <button
                                    onClick={() => handleFilterChange({})}
                                    className="px-4 py-2 bg-(--brand-primary) text-white rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}

                        {/* Event Cards */}
                        {!isLoading && !error && events.length > 0 && (
                            <>
                                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                                    {events.map((event) => {
                                        const { month, day } = formatEventDate(event.date);

                                        return (
                                            <Link
                                                key={event.id}
                                                to={`/event/${event.eventSlug}`}
                                                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group block"
                                            >
                                                {/* Event Image */}
                                                <div className="relative h-48 overflow-hidden bg-gray-200">
                                                    <img
                                                        src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80'}
                                                        alt={event.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80';
                                                        }}
                                                    />

                                                    {/* Category Badge - Top Left */}
                                                    {event.category && (
                                                        <div className="absolute top-3 left-3">
                                                            <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                                                                {event.category}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Date Badge - Top Right */}
                                                    <div className="absolute top-3 right-3 bg-white rounded-lg overflow-hidden shadow-md">
                                                        <div className="bg-(--brand-primary) text-white text-xs font-bold px-3 py-1 text-center">
                                                            {month}
                                                        </div>
                                                        <div className="bg-white text-gray-900 text-xl font-bold px-3 py-1 text-center">
                                                            {day}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Event Details */}
                                                <div className="p-5">
                                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-(--brand-primary) transition-colors line-clamp-2">
                                                        {event.title}
                                                    </h3>

                                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin size={16} className="text-gray-400 shrink-0" />
                                                            <span className="truncate">{event.venue || event.location || 'TBA'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={16} className="text-gray-400 shrink-0" />
                                                            <span>{event.date} {event.time ? `• ${event.time}` : ''}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                        <span className="text-lg font-bold text-(--brand-primary)">
                                                            {event.price || 'Free'}
                                                        </span>
                                                        <span className="text-sm font-semibold text-gray-700 group-hover:text-(--brand-primary) transition-colors">
                                                            View Details →
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-10">
                                        <button
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page <= 1}
                                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (pagination.totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (pagination.page <= 3) {
                                                    pageNum = i + 1;
                                                } else if (pagination.page >= pagination.totalPages - 2) {
                                                    pageNum = pagination.totalPages - 4 + i;
                                                } else {
                                                    pageNum = pagination.page - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`w-10 h-10 rounded-lg font-medium ${pagination.page === pageNum
                                                                ? 'bg-(--brand-primary) text-white'
                                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page >= pagination.totalPages}
                                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrowseEvents;
