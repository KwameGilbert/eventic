import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, TrendingUp } from 'lucide-react';
import AwardStatusBadge from './AwardStatusBadge';

/**
 * Award Card Component
 * Displays award summary in grid/list views
 */
const AwardCard = ({ award, viewMode = 'grid' }) => {
    const isGridView = viewMode === 'grid';

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Determine voting status
    const getVotingStatus = () => {
        if (!award.voting_start || !award.voting_end) return 'upcoming';

        const now = new Date();
        const votingStart = new Date(award.voting_start);
        const votingEnd = new Date(award.voting_end);
        const ceremonyDate = award.ceremony_date ? new Date(award.ceremony_date) : null;

        // Check if ceremony has passed - show "completed"
        if (ceremonyDate && now > ceremonyDate) return 'completed';

        // Check voting status
        if (now < votingStart) return 'upcoming';
        if (now >= votingStart && now <= votingEnd) return 'voting_open';
        if (now > votingEnd) return 'voting_closed';

        return award.status || 'upcoming';
    };

    const votingStatus = getVotingStatus();

    if (isGridView) {
        return (
            <Link
                to={`/award/${award.slug || award.id}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200"
            >
                {/* Award Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img
                        src={award.banner_image || award.image || '/placeholder-award.jpg'}
                        alt={award.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Status Badge - Top Left */}
                    <div className="absolute top-3 left-3">
                        <AwardStatusBadge status={votingStatus} />
                    </div>

                    {/* Date Badge - Top Right */}
                    {award.ceremony_date && (
                        <div className="absolute top-3 right-3 bg-white rounded-lg overflow-hidden shadow-md">
                            <div className="bg-(--brand-primary) text-white text-xs font-bold px-3 py-1 text-center">
                                {new Date(award.ceremony_date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                            </div>
                            <div className="bg-white text-gray-900 text-xl font-bold px-3 py-1 text-center">
                                {new Date(award.ceremony_date).getDate()}
                            </div>
                        </div>
                    )}
                </div>

                {/* Award Details */}
                <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {award.title}
                    </h3>

                    {/* Metadata */}
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                        {(award.city || award.location) && (
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="flex-shrink-0 text-gray-400" />
                                <span className="truncate">{award.city || award.location}</span>
                            </div>
                        )}
                        {award.organizer?.name && (
                            <div className="flex items-center gap-2">
                                <Users size={16} className="shrink-0 text-gray-400" />
                                <span className="truncate">By {award.organizer.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-primary-600 font-semibold group-hover:text-primary-700 transition-colors">
                            View Details →
                        </span>
                    </div>
                </div>
            </Link>
        );
    }

    // List View
    return (
        <Link
            to={`/award/${award.slug || award.id}`}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200 flex"
        >
            {/* Award Image */}
            <div className="relative w-48 flex-shrink-0 overflow-hidden bg-gray-200">
                <img
                    src={award.banner_image || award.image || '/placeholder-award.jpg'}
                    alt={award.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Award Details */}
            <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary-600 transition-colors">
                            {award.title}
                        </h3>
                        <AwardStatusBadge status={votingStatus} className="ml-4" />
                    </div>

                    {award.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {award.description}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {award.venue_name && (
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-gray-400" />
                                <span>{award.venue_name}</span>
                            </div>
                        )}
                        {award.ceremony_date && (
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                <span>{formatDate(award.ceremony_date)}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-gray-400" />
                            <span>{award.categories_count || 0} Categories</span>
                        </div>
                        {award.total_votes !== undefined && (
                            <div className="flex items-center gap-2 text-primary-600 font-medium">
                                <TrendingUp size={16} />
                                <span>{award.total_votes.toLocaleString()} Votes</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

AwardCard.propTypes = {
    award: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        slug: PropTypes.string,
        banner_image: PropTypes.string,
        image: PropTypes.string,
        description: PropTypes.string,
        venue_name: PropTypes.string,
        ceremony_date: PropTypes.string,
        voting_start: PropTypes.string,
        voting_end: PropTypes.string,
        status: PropTypes.string,
        categories_count: PropTypes.number,
        total_votes: PropTypes.number,
        city: PropTypes.string,
        location: PropTypes.string,
        organizer: PropTypes.shape({
            name: PropTypes.string,
        }),
    }).isRequired,
    viewMode: PropTypes.oneOf(['grid', 'list']),
};

export default AwardCard;
