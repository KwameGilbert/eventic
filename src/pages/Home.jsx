import React, { useState, useEffect } from 'react';
import EventCarousel from '../components/home/EventCarousel';
import FeaturedCategories from '../components/home/FeaturedCategories';
import UpcomingEvents from '../components/home/UpcomingEvents';
import eventService from '../services/eventService';
import { featuredCategories } from '../data/mockEvents';
import PageLoader from '../components/ui/PageLoader';

const Home = () => {
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch featured events for carousel
                const featuredResponse = await eventService.getFeatured(5);
                const featured = featuredResponse?.data || featuredResponse || [];

                // Fetch upcoming events
                const upcomingResponse = await eventService.getUpcoming({ per_page: 12 });
                const upcoming = upcomingResponse?.data?.events || upcomingResponse?.events || [];

                setFeaturedEvents(Array.isArray(featured) ? featured : []);
                setUpcomingEvents(Array.isArray(upcoming) ? upcoming : []);
            } catch (err) {
                console.error('Failed to fetch events:', err);
                setError('Failed to load events. Please try again later.');

                // Fallback to empty arrays
                setFeaturedEvents([]);
                setUpcomingEvents([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (isLoading) {
        return <PageLoader message="Loading events..." />;
    }

    return (
        <div className="min-h-screen">
            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border-b border-red-200 px-4 py-3 text-center text-red-700">
                    {error}
                </div>
            )}

            {/* Featured Events Carousel */}
            {featuredEvents.length > 0 ? (
                <EventCarousel events={featuredEvents} />
            ) : (
                <div className="h-[500px] bg-linear-to-r from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h2 className="text-3xl font-bold mb-2">Welcome to Eventic</h2>
                        <p className="text-gray-300">Discover amazing events near you</p>
                    </div>
                </div>
            )}

            {/* Upcoming Events Section */}
            {upcomingEvents.length > 0 ? (
                <UpcomingEvents events={upcomingEvents} />
            ) : (
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Upcoming Events</h2>
                        <p className="text-gray-600">Check back soon for exciting events!</p>
                    </div>
                </section>
            )}

            {/* Featured Categories Section */}
            <FeaturedCategories categories={featuredCategories} />
        </div>
    );
};

export default Home;
