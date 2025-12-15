import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Home as HomeIcon, TrendingUp, Medal, Award, Crown, Users, Download, AlertCircle, RefreshCw } from 'lucide-react';
import awardService from '../services/awardService';
import PageLoader from '../components/ui/PageLoader';

const AwardLeaderboard = () => {
    const { slug } = useParams();
    const [award, setAward] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const awardResponse = await awardService.getBySlug(slug);
                const awardData = awardResponse?.data || awardResponse;
                setAward(awardData);

                // Fetch leaderboard data
                const leaderboardResponse = await awardService.getLeaderboard(awardData.id);
                const leaderboardData = leaderboardResponse?.data || leaderboardResponse;
                setLeaderboard(leaderboardData.leaderboard || []);
            } catch (err) {
                console.error('Failed to fetch leaderboard:', err);
                setError('Failed to load leaderboard data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, [slug]);

    const handleRetry = () => {
        setIsLoading(true);
        setError(null);
        awardService.getBySlug(slug)
            .then(async (awardResponse) => {
                const awardData = awardResponse?.data || awardResponse;
                setAward(awardData);

                const leaderboardResponse = await awardService.getLeaderboard(awardData.id);
                const leaderboardData = leaderboardResponse?.data || leaderboardResponse;
                setLeaderboard(leaderboardData.leaderboard || []);
            })
            .catch(err => {
                console.error('Failed to fetch leaderboard:', err);
                setError('Failed to load leaderboard data. Please try again.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const downloadResults = () => {
        // Download results as CSV or PDF
        console.log('Downloading results...');
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Crown className="text-yellow-500" size={24} />;
            case 2:
                return <Medal className="text-gray-400" size={24} />;
            case 3:
                return <Award className="text-orange-400" size={24} />;
            default:
                return null;
        }
    };

    // Loading State
    if (isLoading) {
        return <PageLoader message="Loading leaderboard..." />;
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Leaderboard</h2>
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
                            to={`/award/${slug}`}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Back to Award
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!award) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Award Not Found</h2>
                    <Link to="/awards" className="text-(--brand-primary) hover:underline font-semibold">
                        Browse all awards →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">Results & Leaderboard</h1>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Link to="/" className="hover:text-(--brand-primary)">
                                <HomeIcon size={16} />
                            </Link>
                            <span>/</span>
                            <Link to="/awards" className="hover:text-(--brand-primary)">Awards</Link>
                            <span>/</span>
                            <Link to={`/award/${slug}`} className="hover:text-(--brand-primary)">{award.title}</Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">Results</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Award Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <Trophy className="text-(--brand-primary)" size={32} />
                                <h1 className="text-3xl font-bold text-gray-900">{award.title}</h1>
                            </div>
                            <p className="text-gray-600 mb-4">{award.description}</p>

                            {/* Stats */}
                            <div className="flex items-center gap-6 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="text-(--brand-primary)" size={20} />
                                    <span className="text-sm font-medium text-gray-600">
                                        {award.total_votes?.toLocaleString() || 0} Total Votes
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="text-(--brand-primary)" size={20} />
                                    <span className="text-sm font-medium text-gray-600">
                                        {award.categories_count || 0} Categories
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={downloadResults}
                            className="flex items-center gap-2 px-4 py-2 bg-(--brand-primary) text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                        >
                            <Download size={18} />
                            Download Results
                        </button>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedCategory === 'all'
                                ? 'bg-(--brand-primary) text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            All Categories
                        </button>
                        {leaderboard.map((category) => (
                            <button
                                key={category.category_id}
                                onClick={() => setSelectedCategory(category.category_id)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedCategory === category.category_id
                                    ? 'bg-(--brand-primary) text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {category.category_name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Check if results are allowed to be shown */}
                {award.show_results === false ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Trophy className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">Results Currently Hidden</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            The organizer has temporarily hidden the voting results. Results will be displayed when made available.
                        </p>
                        <Link
                            to={`/award/${slug}`}
                            className="inline-block px-6 py-3 bg-(--brand-primary) text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
                        >
                            Back to Award Details
                        </Link>
                    </div>
                ) : leaderboard.length > 0 ? (
                    <div className="space-y-6">
                        {leaderboard
                            .filter(cat => selectedCategory === 'all' || cat.category_id === selectedCategory)
                            .map((category) => (
                                <div key={category.category_id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    {/* Category Header */}
                                    <div className="bg-gradient-to-r from-(--brand-primary) to-orange-600 text-white p-6">
                                        <h2 className="text-2xl font-bold mb-2">{category.category_name}</h2>
                                        <p className="text-white/90 text-sm">{category.total_votes?.toLocaleString() || 0} votes</p>
                                    </div>

                                    {/* Nominees List */}
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {category.nominees?.map((nominee, index) => (
                                                <div
                                                    key={nominee.id}
                                                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${index === 0
                                                        ? 'bg-yellow-50 border-2 border-yellow-400'
                                                        : index === 1
                                                            ? 'bg-gray-50 border-2 border-gray-300'
                                                            : index === 2
                                                                ? 'bg-orange-50 border-2 border-orange-300'
                                                                : 'bg-gray-50 border border-gray-200'
                                                        }`}
                                                >
                                                    {/* Rank */}
                                                    <div className="flex items-center justify-center w-12 h-12 shrink-0">
                                                        {getRankIcon(index + 1) || (
                                                            <span className="text-xl font-bold text-gray-400">#{index + 1}</span>
                                                        )}
                                                    </div>

                                                    {/* Nominee Info */}
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-gray-900 text-lg">{nominee.name}</h3>
                                                        {nominee.description && (
                                                            <p className="text-sm text-gray-600 line-clamp-1">{nominee.description}</p>
                                                        )}
                                                    </div>

                                                    {/* Vote Count */}
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-(--brand-primary)">
                                                            {nominee.votes?.toLocaleString() || 0}
                                                        </div>
                                                        <div className="text-sm text-gray-600">votes</div>
                                                        {nominee.percentage && (
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {nominee.percentage}%
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Yet</h3>
                        <p className="text-gray-600">Voting results will appear here when available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AwardLeaderboard;
