import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Home as HomeIcon, Calendar, MapPin, Users, TrendingUp, Share2, Heart, AlertCircle, RefreshCw } from 'lucide-react';
import awardService from '../services/awardService';
import AwardStatusBadge from '../components/awards/AwardStatusBadge';
import AwardCategoryCard from '../components/awards/AwardCategoryCard';
import AwardOrganizerInfo from '../components/awards/AwardOrganizerInfo';
import AwardLocationMap from '../components/awards/AwardLocationMap';
import AwardContactInfo from '../components/awards/AwardContactInfo';
import VotingModal from '../components/awards/VotingModal';
import PageLoader from '../components/ui/PageLoader';

const AwardDetail = () => {
    const { slug } = useParams();
    const [award, setAward] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);

    useEffect(() => {
        const fetchAward = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await awardService.getBySlug(slug);
                const awardData = response?.data || response;
                setAward(awardData);

                // Fetch categories for this award
                if (awardData?.id) {
                    // Categories would come from the award data or separate endpoint
                    setCategories(awardData.categories || []);
                }
            } catch (err) {
                console.error('Failed to fetch award:', err);
                setError('Failed to load award details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAward();
    }, [slug]);

    const handleRetry = () => {
        setIsLoading(true);
        setError(null);
        awardService.getBySlug(slug)
            .then(response => {
                const awardData = response?.data || response;
                setAward(awardData);
                setCategories(awardData.categories || []);
            })
            .catch(err => {
                console.error('Failed to fetch award:', err);
                setError('Failed to load award details. Please try again.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getVotingStatus = () => {
        if (!award?.voting_start || !award?.voting_end) return 'upcoming';

        const now = new Date();
        const votingStart = new Date(award.voting_start);
        const votingEnd = new Date(award.voting_end);

        if (now < votingStart) return 'upcoming';
        if (now >= votingStart && now <= votingEnd) return 'voting_open';
        if (now > votingEnd) return 'voting_closed';

        return award.status || 'upcoming';
    };

    const handleVoteClick = (category) => {
        setSelectedCategory(category);
        setIsVotingModalOpen(true);
    };

    // Loading State
    if (isLoading) {
        return <PageLoader message="Loading award details..." />;
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Award</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={handleRetry}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-(--brand-primary) text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <RefreshCw size={18} />
                            Try Again
                        </button>
                        <Link
                            to="/awards"
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Browse Awards
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Not Found State
    if (!award) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Award Not Found</h2>
                    <p className="text-gray-600 mb-6">The award you are looking for does not exist or has been removed.</p>
                    <Link to="/awards" className="text-(--brand-primary) hover:underline font-semibold">
                        Browse all awards →
                    </Link>
                </div>
            </div>
        );
    }

    const votingStatus = getVotingStatus();

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Page Header with Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <h1 className="text-2xl font-bold text-gray-900 truncate">{award.title}</h1>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Link to="/" className="hover:text-(--brand-primary)">
                                <HomeIcon size={16} />
                            </Link>
                            <span>/</span>
                            <Link to="/awards" className="hover:text-(--brand-primary)">Awards</Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium truncate max-w-[200px]">{award.title}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Banner */}
            <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-200 relative">
                <img
                    src={award.banner_image || award.image || '/placeholder-award.jpg'}
                    alt={award.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-6 right-6">
                    <AwardStatusBadge status={votingStatus} className="text-lg px-6 py-3" />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Award Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            {/* Title & Description */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">{award.title}</h1>
                                {award.description && (
                                    <p className="text-gray-700 leading-relaxed">{award.description}</p>
                                )}
                            </div>

                            {/* Award Info Grid */}
                            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {award.ceremony_date && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                            <Calendar size={16} />
                                            <h3>Ceremony Date</h3>
                                        </div>
                                        <p className="text-gray-900 font-medium">{formatDate(award.ceremony_date)}</p>
                                    </div>
                                )}
                                {award.venue && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                            <MapPin size={16} />
                                            <h3>Venue</h3>
                                        </div>
                                        <p className="text-gray-900 font-medium">{award.venue_name}</p>
                                        {award.location && (
                                            <p className="text-gray-600 text-sm mt-1">{award.location}</p>
                                        )}
                                        {award.city && (
                                            <p className="text-gray-600 text-sm">{award.city}, {award.region}, {award.country}</p>
                                        )}
                                    </div>
                                )}
                                {(award.voting_start || award.voting_end) && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                            <Calendar size={16} />
                                            <h3>Voting Period</h3>
                                        </div>
                                        <p className="text-gray-900 font-medium text-sm">
                                            {formatDate(award.voting_start)} - {formatDate(award.voting_end)}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                        <Users size={16} />
                                        <h3>Categories</h3>
                                    </div>
                                    <p className="text-gray-900 font-medium">{categories.length} Categories</p>
                                </div>
                                {award.total_votes !== undefined && (
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                                            <TrendingUp size={16} />
                                            <h3>Total Votes</h3>
                                        </div>
                                        <p className="text-gray-900 font-bold text-xl">{award.total_votes.toLocaleString()}</p>
                                    </div>
                                )}
                            </div>

                            {/* Categories Section */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Award Categories</h2>

                                {categories.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {categories.map((category) => (
                                            <AwardCategoryCard
                                                key={category.id}
                                                category={category}
                                                votingStatus={votingStatus}
                                                onVoteClick={handleVoteClick}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-600">No categories available yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Map Section */}
                            <AwardLocationMap mapUrl={award.mapUrl} />

                            {/* Contact & Social Media */}
                            <AwardContactInfo
                                contact={award.contact}
                                socialMedia={award.socialMedia}
                            />

                            {/* Share Buttons */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Share This Award</h2>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition-colors flex items-center gap-2">
                                        <Share2 size={16} />
                                        Share
                                    </button>
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`px-4 py-2 rounded text-sm font-semibold transition-colors flex items-center gap-2 ${isFavorite ? 'bg-red-50 text-red-600 border-2 border-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
                                        {isFavorite ? 'Favorited' : 'Add to Favorites'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6 sticky top-6">
                            {/* Voting CTA Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-sm font-semibold text-gray-500 mb-4">Voting Status</h3>

                                <div className="mb-6">
                                    <AwardStatusBadge status={votingStatus} className="w-full justify-center py-3 text-base" />
                                </div>

                                {votingStatus === 'voting_open' && (
                                    <>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Voting closes on {formatDate(award.voting_end)}
                                        </p>
                                        <button className="w-full bg-(--brand-primary) hover:opacity-90 text-white font-bold py-3 px-4 rounded-full transition-opacity flex items-center justify-center gap-2">
                                            <Trophy size={18} />
                                            VOTE NOW
                                        </button>
                                    </>
                                )}

                                {votingStatus === 'upcoming' && award.voting_start && (
                                    <p className="text-sm text-gray-600 text-center">
                                        Voting starts on {formatDate(award.voting_start)}
                                    </p>
                                )}

                                {votingStatus === 'voting_closed' && (
                                    <Link to={`/award/${slug}/results`}
                                        className="w-full block text-center bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-full transition-colors"
                                    >
                                        View Results
                                    </Link>
                                )}
                            </div>

                            {/* Stats Card - Conditional based on show_results */}
                            {award.show_results && award.total_votes !== undefined && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-sm font-semibold text-gray-500 mb-4">Voting Statistics</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-3xl font-bold text-(--brand-primary) mb-1">
                                                {award.total_votes.toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-600">Total Votes</div>
                                        </div>
                                        {award.total_revenue !== undefined && (
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                                    GH₵{award.total_revenue.toLocaleString()}
                                                </div>
                                                <div className="text-sm text-gray-600">Total Revenue</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Results Hidden Message */}
                            {award.show_results === false && (
                                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                                    <div className="text-center">
                                        <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <h3 className="font-semibold text-gray-900 mb-2">Results Hidden</h3>
                                        <p className="text-sm text-gray-600">
                                            Voting results are currently hidden by the organizer
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Organizer Info - Sidebar */}
                            <AwardOrganizerInfo organizer={award.organizer} />

                            {/* Quick Links */}
                            <div className="bg-(--brand-primary) rounded-lg p-6 text-white">
                                <h3 className="font-bold mb-4">Interested in This Award?</h3>
                                <p className="text-sm mb-4 opacity-90">Get notified about updates and results</p>
                                <button className="w-full bg-white text-(--brand-primary) font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                                    Follow Award
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Voting Modal */}
            <VotingModal
                isOpen={isVotingModalOpen}
                onClose={() => setIsVotingModalOpen(false)}
                award={award}
                category={selectedCategory}
            />
        </div>
    );
};

export default AwardDetail;
