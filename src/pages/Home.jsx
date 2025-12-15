import React, { useState, useEffect } from 'react';
import HeroCarousel from '../components/home/HeroCarousel';
// import FeaturedAwards from '../components/home/FeaturedAwards';
import FeaturedCategories from '../components/home/FeaturedCategories';
import UpcomingEvents from '../components/home/UpcomingEvents';
import AwardCard from '../components/awards/AwardCard';
import eventService from '../services/eventService';
import awardService from '../services/awardService';
import { featuredCategories } from '../data/mockEvents';
import PageLoader from '../components/ui/PageLoader';

const Home = () => {
    const [featuredAwards, setFeaturedAwards] = useState([]);
    const [upcomingAwards, setUpcomingAwards] = useState([]);
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Fetch featured awards (primary content)
                const awardsResponse = await awardService.getFeatured({ per_page: 8 });
                const awards = awardsResponse?.data?.awards || awardsResponse?.awards || [];

                // Fetch upcoming awards
                const upcomingAwardsResponse = await awardService.getUpcoming({ per_page: 12 });
                const upcomingAwardsData = upcomingAwardsResponse?.data?.awards || upcomingAwardsResponse?.awards || [];

                // Fetch featured events for carousel
                const featuredEventsResponse = await eventService.getFeatured(5);
                const featuredEventsData = featuredEventsResponse?.data || featuredEventsResponse || [];

                // Fetch upcoming events
                const upcomingResponse = await eventService.getUpcoming({ per_page: 12 });
                const upcoming = upcomingResponse?.data?.events || upcomingResponse?.events || [];

                setFeaturedAwards(Array.isArray(awards) ? awards : []);
                setUpcomingAwards(Array.isArray(upcomingAwardsData) ? upcomingAwardsData : []);
                setFeaturedEvents(Array.isArray(featuredEventsData) ? featuredEventsData : []);
                setUpcomingEvents(Array.isArray(upcoming) ? upcoming : []);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to load content. Please try again later.');

                // Fallback to empty arrays
                setFeaturedAwards([]);
                setUpcomingAwards([]);
                setFeaturedEvents([]);
                setUpcomingEvents([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <PageLoader message="Loading content..." />;
    }

    // Combine awards and events for carousel (awards first)
    const carouselItems = [
        ...featuredAwards.slice(0, 3).map(award => ({ ...award, type: 'award' })),
        ...featuredEvents.slice(0, 2).map(event => ({ ...event, type: 'event' }))
    ];

    return (
        <div className="min-h-screen">
            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border-b border-red-200 px-4 py-3 text-center text-red-700">
                    {error}
                </div>
            )}

            {/* Hero Carousel - Awards & Events */}
            {carouselItems.length > 0 ? (
                <HeroCarousel items={carouselItems} />
            ) : (
                <div className="h-[500px] bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h2 className="text-3xl font-bold mb-2">Welcome to Eventic</h2>
                        <p className="text-gray-300">Discover amazing awards and events</p>
                    </div>
                </div>
            )}

            {/* Featured Awards Section (Primary) */}
            {/* {featuredAwards.length > 0 && (
                <FeaturedAwards awards={featuredAwards} />
            )} */}

            {/* Upcoming Awards Section */}
            {upcomingAwards.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Upcoming Awards</h2>
                            <a
                                href="/awards"
                                className="text-(--brand-primary) hover:underline font-semibold"
                            >
                                View All Awards →
                            </a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {upcomingAwards.slice(0, 8).map((award) => (
                                <AwardCard key={award.id} award={award} viewMode="grid" />
                            ))}
                        </div>
                    </div>
                </section>
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
