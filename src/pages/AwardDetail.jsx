import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Share2,
  Heart,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import awardService from "../services/awardService";
import AwardStatusBadge from "../components/awards/AwardStatusBadge";
import AwardCategoryCard from "../components/awards/AwardCategoryCard";
import AwardOrganizerInfo from "../components/awards/AwardOrganizerInfo";
import AwardLocationMap from "../components/awards/AwardLocationMap";
import AwardContactInfo from "../components/awards/AwardContactInfo";
import PageLoader from "../components/ui/PageLoader";
import SEO from "../components/common/SEO";

const AwardDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [award, setAward] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

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
        console.error("Failed to fetch award:", err);
        setError("Failed to load award details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAward();
  }, [slug]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    awardService
      .getBySlug(slug)
      .then((response) => {
        const awardData = response?.data || response;
        setAward(awardData);
        setCategories(awardData.categories || []);
      })
      .catch((err) => {
        console.error("Failed to fetch award:", err);
        setError("Failed to load award details. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getVotingStatus = () => {
    // 1. Check if backend explicitly says voting is open
    if (award?.voting_status === "open") return "voting_open";

    // 2. Check manual voting status toggle
    if (award?.voting_status === "closed") return "voting_closed";

    // 3. Check overall award status
    if (award?.status === "completed") return "completed";

    // 4. Date-based logic as fallback/refinement
    if (!award?.voting_start || !award?.voting_end) return "upcoming";

    const now = new Date();
    const votingStart = new Date(award.voting_start);
    const votingEnd = new Date(award.voting_end);
    const ceremonyDate = award.ceremony_date
      ? new Date(award.ceremony_date)
      : null;

    // Check if ceremony has passed
    if (ceremonyDate && now > ceremonyDate) return "completed";

    // Check voting window
    if (now < votingStart) return "upcoming";
    if (now > votingEnd) return "voting_closed";

    return award.status || "upcoming";
  };

  const handleVoteClick = (category) => {
    navigate(`/award/${slug}/category/${category.id}`);
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error Loading Award
          </h2>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Award Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The award you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/awards"
            className="text-(--brand-primary) hover:underline font-semibold"
          >
            Browse all awards →
          </Link>
        </div>
      </div>
    );
  }

  const votingStatus = getVotingStatus();

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO
        title={award.title}
        description={
          award.description ||
          `Vote for your favorite nominees at ${award.title}. Management by ${award.organizer?.name}.`
        }
        image={award.banner_image || award.image}
        type="article"
      />
      {/* Page Header with Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {award.title}
            </h1>

            {/* View Results Button */}
            {award.show_results && (
              <Link
                to={`/award/${slug}/results`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors text-sm"
              >
                <TrendingUp size={16} />
                View Results
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6">
        {/* Categories Section - Full Width */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Trophy className="text-(--brand-primary)" size={28} />
              <h2 className="text-2xl font-bold text-gray-900">
                Award Categories
              </h2>
              <AwardStatusBadge
                status={votingStatus}
                className="text-[10px] px-2 py-0.5"
              />
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent transition-all text-sm font-medium"
              />
            </div>
          </div>

          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <AwardCategoryCard
                  key={category.id}
                  category={category}
                  votingStatus={votingStatus}
                  onVoteClick={handleVoteClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium text-lg">
                {searchTerm
                  ? `No categories matching "${searchTerm}"`
                  : "No categories available yet"}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {searchTerm
                  ? "Try a different search term"
                  : "Check back later once categories are published."}
              </p>
            </div>
          )}
        </div>

        {/* Award Information Section - Two columns on desktop, single column on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Column 1: Banner + Event Details */}
          <div className="space-y-6">
            {/* Banner Image Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={
                    award.banner_image ||
                    award.image ||
                    "/placeholder-award.jpg"
                  }
                  alt={award.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <AwardStatusBadge status={votingStatus} />
                </div>
              </div>
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {award.title}
                </h1>
                {award.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {award.description}
                  </p>
                )}
              </div>
            </div>

            {/* Event Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-3">
                Event Details
              </h3>

              <div className="space-y-4">
                {award.ceremony_date && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                      <Calendar className="text-(--brand-primary)" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        Ceremony Date
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {formatDate(award.ceremony_date)}
                      </p>
                    </div>
                  </div>
                )}

                {award.venue_name && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <MapPin className="text-blue-600" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        Venue
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {award.venue_name}
                      </p>
                      {award.location && (
                        <p className="text-gray-600 text-xs mt-0.5">
                          {award.location}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {(award.voting_start || award.voting_end) && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                      <TrendingUp className="text-green-600" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        Voting Period
                      </p>
                      <p className="text-gray-900 font-semibold text-sm">
                        {formatDate(award.voting_start)} -{" "}
                        {formatDate(award.voting_end)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                    <Users className="text-purple-600" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                      Categories
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {categories.length} Total
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <AwardLocationMap mapUrl={award.mapUrl} />
          </div>

          {/* Column 2: Voting Status + Organizer + Contact + Share */}
          <div className="space-y-6">
            {/* Voting Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-4">
                Voting Status
              </h3>
              <div className="mb-4">
                <AwardStatusBadge
                  status={votingStatus}
                  className="w-full justify-center py-2.5"
                />
              </div>
              {votingStatus === "voting_open" && (
                <p className="text-xs text-gray-500 text-center italic mb-4">
                  Voting is currently active. Select a category above to vote.
                </p>
              )}
              {award.show_results && (
                <Link
                  to={`/award/${slug}/results`}
                  className="w-full block text-center bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                >
                  View Results
                </Link>
              )}
              {votingStatus === "voting_closed" && !award.show_results && (
                <p className="text-xs text-gray-500 text-center italic">
                  Results will be announced soon.
                </p>
              )}
            </div>

            {/* Organizer Info */}
            <AwardOrganizerInfo organizer={award.organizer} />

            {/* Contact & Social Media */}
            <AwardContactInfo
              contact={award.contact}
              socialMedia={award.socialMedia}
            />

            {/* Share Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Share This Award
              </h2>
              <div className="flex items-center gap-3 flex-wrap">
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold transition-all flex items-center gap-2 shadow-sm">
                  <Share2 size={16} />
                  Share
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 border ${
                    isFavorite
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <Heart
                    size={16}
                    className={isFavorite ? "fill-current" : ""}
                  />
                  {isFavorite ? "Favorited" : "Add to Favorites"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voting Modal removed in favor of pages */}
    </div>
  );
};

export default AwardDetail;
