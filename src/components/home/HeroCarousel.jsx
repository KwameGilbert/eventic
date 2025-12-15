import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Clock, Ticket, Trophy, Users } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * HeroCarousel Component
 * Flexible carousel that can display both awards and events
 */
const HeroCarousel = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || !items || items.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === items.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [currentIndex, isAutoPlaying, items]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? items.length - 1 : prevIndex - 1
        );
        setIsAutoPlaying(false);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === items.length - 1 ? 0 : prevIndex + 1
        );
        setIsAutoPlaying(false);
    };

    if (!items || items.length === 0) {
        return null;
    }

    const currentItem = items[currentIndex];
    const isAward = currentItem.type === 'award' || currentItem.ceremony_date !== undefined;

    // Determine image URL
    const imageUrl = currentItem.banner_image || currentItem.image || '/placeholder.jpg';

    // Determine link destination
    const linkTo = isAward
        ? `/award/${currentItem.slug || currentItem.id}`
        : `/event/${currentItem.eventSlug || currentItem.slug || currentItem.id}`;

    // Get display data based on type
    const getDisplayData = () => {
        if (isAward) {
            return {
                icon: Trophy,
                ctaText: 'VOTE NOW',
                metadata: [
                    {
                        icon: MapPin,
                        text: currentItem.venue_name || currentItem.venue || 'Venue TBA'
                    },
                    {
                        icon: Clock,
                        text: currentItem.ceremony_date
                            ? new Date(currentItem.ceremony_date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })
                            : 'Date TBA'
                    },
                    ...(currentItem.categories_count ? [{
                        icon: Users,
                        text: `${currentItem.categories_count} Categories`
                    }] : [])
                ]
            };
        } else {
            return {
                icon: Ticket,
                ctaText: 'BUY TICKETS',
                metadata: [
                    {
                        icon: MapPin,
                        text: currentItem.venue || currentItem.venue_name || 'Venue TBA'
                    },
                    {
                        icon: Clock,
                        text: currentItem.date || currentItem.start_time
                            ? (currentItem.date || new Date(currentItem.start_time).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }))
                            : 'Date TBA'
                    }
                ]
            };
        }
    };

    const displayData = getDisplayData();
    const Icon = displayData.icon;

    return (
        <div className="relative w-full h-[600px] overflow-hidden group">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                style={{
                    backgroundImage: `url(${imageUrl})`,
                }}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            </div>

            {/* Type Badge */}
            {items.length > 1 && (
                <div className="absolute top-6 left-6 z-10">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md ${isAward
                            ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30'
                            : 'bg-blue-500/20 text-blue-100 border border-blue-400/30'
                        }`}>
                        <Icon size={16} />
                        {isAward ? 'Award' : 'Event'}
                    </span>
                </div>
            )}

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-center h-full max-w-2xl">
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg transition-all duration-900">
                        {currentItem.title}
                    </h1>

                    {/* Description (if available) */}
                    {currentItem.description && (
                        <p className="text-white/90 text-lg mb-6 line-clamp-2">
                            {currentItem.description}
                        </p>
                    )}

                    {/* Metadata */}
                    <div className="space-y-3 mb-8">
                        {displayData.metadata.map((meta, idx) => {
                            const MetaIcon = meta.icon;
                            return (
                                <div key={idx} className="flex items-center gap-2 text-white text-lg">
                                    <MetaIcon size={20} className="flex-shrink-0" />
                                    <span>{meta.text}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA Button */}
                    <div>
                        <Link
                            to={linkTo}
                            className="bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-8 rounded-full inline-flex items-center gap-2 transition-colors shadow-lg"
                        >
                            <Icon size={20} />
                            {displayData.ctaText}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            {items.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {/* Dot Indicators */}
            {items.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                    ? 'bg-white w-4'
                                    : 'bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

HeroCarousel.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            title: PropTypes.string.isRequired,
            slug: PropTypes.string,
            description: PropTypes.string,
            image: PropTypes.string,
            banner_image: PropTypes.string,
            type: PropTypes.string,
            // Event-specific
            venue: PropTypes.string,
            date: PropTypes.string,
            eventSlug: PropTypes.string,
            start_time: PropTypes.string,
            // Award-specific
            ceremony_date: PropTypes.string,
            venue_name: PropTypes.string,
            categories_count: PropTypes.number,
        })
    ).isRequired,
};

export default HeroCarousel;
