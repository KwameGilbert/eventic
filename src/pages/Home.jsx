import React from 'react';
import EventCarousel from '../components/home/EventCarousel';
import FeaturedCategories from '../components/home/FeaturedCategories';
import UpcomingEvents from '../components/home/UpcomingEvents';
import { featuredEvents, upcomingEvents, featuredCategories } from '../data/mockEvents';

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Featured Events Carousel */}
            <EventCarousel events={featuredEvents} />

            {/* Upcoming Events Section */}
            <UpcomingEvents events={upcomingEvents} />

            {/* Featured Categories Section */}
            <FeaturedCategories categories={featuredCategories} />
        </div>
    );
};

export default Home;
