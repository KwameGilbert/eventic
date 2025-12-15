import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Home as HomeIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/events/FilterSidebar';
import EventCard from '../components/events/EventCard';
import eventService from '../services/eventService';
import PageHeader from '../components/common/PageHeader';
import ResultsHeader from '../components/common/ResultsHeader';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';

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
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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

    // Retry loading
    const handleRetry = () => {
        fetchEvents(currentFilters, pagination.page);
    };

    // Count active filters
    const filterCount = Object.keys(currentFilters).filter(k => currentFilters[k] && currentFilters[k] !== 'Ghana').length;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Page Header */}
            <PageHeader
                title="Events"
                breadcrumbs={[
                    { icon: <HomeIcon size={16} />, path: '/' },
                    { label: 'Events' }
                ]}
            />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Mobile Filter Drawer */}
                <FilterSidebar
                    onFilterChange={handleFilterChange}
                    initialFilters={currentFilters}
                    isOpen={isMobileFilterOpen}
                    onClose={() => setIsMobileFilterOpen(false)}
                    isMobile={true}
                />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filter Sidebar - Desktop Only */}
                    <div className="hidden lg:block lg:col-span-1">
                        <FilterSidebar
                            onFilterChange={handleFilterChange}
                            initialFilters={currentFilters}
                        />
                    </div>

                    {/* Events Grid */}
                    <div className="lg:col-span-3">
                        {/* Results Header */}
                        <ResultsHeader
                            isLoading={isLoading}
                            totalCount={pagination.total}
                            itemType="event(s)"
                            filterCount={filterCount}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            onFilterClick={() => setIsMobileFilterOpen(true)}
                        />

                        {/* Loading State */}
                        {isLoading && <LoadingState message="Loading events..." />}

                        {/* Error State */}
                        {error && !isLoading && (
                            <ErrorState
                                title="Failed to Load Events"
                                message={error}
                                onRetry={handleRetry}
                            />
                        )}

                        {/* Empty State */}
                        {!isLoading && !error && events.length === 0 && (
                            <EmptyState
                                icon={Calendar}
                                title="No Events Found"
                                message="Try adjusting your filters or check back later for new events."
                                actionLabel="Clear Filters"
                                onAction={() => handleFilterChange({})}
                            />
                        )}

                        {/* Event Cards */}
                        {!isLoading && !error && events.length > 0 && (
                            <>
                                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                                    {events.map((event) => (
                                        <EventCard key={event.id} event={event} viewMode={viewMode} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrowseEvents;
