import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight } from 'lucide-react';
import AwardCard from '../awards/AwardCard';

/**
 * FeaturedAwards Component
 * Displays a grid of featured awards on the home page
 */
const FeaturedAwards = ({ awards }) => {
    if (!awards || awards.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Trophy className="text-(--brand-primary)" size={20} />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Featured Awards
                            </h2>
                        </div>
                        <p className="text-gray-600">
                            Vote for your favorites and support excellence
                        </p>
                    </div>

                    {/* View All Link - Desktop */}
                    <Link
                        to="/awards"
                        className="hidden md:inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors group"
                    >
                        View All Awards
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Awards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {awards.map((award) => (
                        <AwardCard key={award.id} award={award} viewMode="grid" />
                    ))}
                </div>

                {/* View All Link - Mobile */}
                <div className="mt-8 text-center md:hidden">
                    <Link
                        to="/awards"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                    >
                        View All Awards
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

FeaturedAwards.propTypes = {
    awards: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            title: PropTypes.string.isRequired,
            slug: PropTypes.string,
            banner_image: PropTypes.string,
            venue_name: PropTypes.string,
            ceremony_date: PropTypes.string,
            categories_count: PropTypes.number,
            total_votes: PropTypes.number,
        })
    ).isRequired,
};

export default FeaturedAwards;
