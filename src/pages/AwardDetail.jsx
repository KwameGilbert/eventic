import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  Home as HomeIcon,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Share2,
  Heart,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import awardService from "../services/awardService";
import AwardStatusBadge from "../components/awards/AwardStatusBadge";
import AwardCategoryCard from "../components/awards/AwardCategoryCard";
import AwardOrganizerInfo from "../components/awards/AwardOrganizerInfo";
import AwardLocationMap from "../components/awards/AwardLocationMap";
import AwardContactInfo from "../components/awards/AwardContactInfo";
import PageLoader from "../components/ui/PageLoader";

const AwardDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [award, setAward] = useState(null);
  const [categories, setCategories] = useState([]);
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
    if (!award?.voting_start || !award?.voting_end) return "upcoming";

    const now = new Date();
    const votingStart = new Date(award.voting_start);
    const votingEnd = new Date(award.voting_end);
    const ceremonyDate = award.ceremony_date
      ? new Date(award.ceremony_date)
      : null;

    // Check if ceremony has passed - show "completed"
    if (ceremonyDate && now > ceremonyDate) return "completed";

    // Check voting status
    if (now < votingStart) return "upcoming";
    if (now >= votingStart && now <= votingEnd) return "voting_open";
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

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header with Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {award.title}
            </h1>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-(--brand-primary)">
                <HomeIcon size={16} />
              </Link>
              <span>/</span>
              <Link to="/awards" className="hover:text-(--brand-primary)">
                Award Events
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium truncate max-w-[200px]">
                {award.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Categories */}
          <div className="lg:w-2/3 order-1 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Trophy className="text-(--brand-primary)" size={28} />
                Award Categories
              </h2>

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
                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium text-lg">
                    No categories available yet
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Check back later once categories are published.
                  </p>
                </div>
              )}

              {/* Additional Sections below categories */}
              <div className="mt-12 space-y-12">
                {/* Mobile-only Award Banner, Title & Description */}
                <div className="lg:hidden border-t border-gray-100 pt-8 -mt-4 mb-8">
                  <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 mb-8">
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

                  {/* Mobile-only Award Details */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6 mb-8">
                    <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-3">
                      Event Details
                    </h3>
                    <div className="space-y-4">
                      {award.ceremony_date && (
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                            <Calendar
                              className="text-(--brand-primary)"
                              size={18}
                            />
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

                  {/* Mobile-only Voting Status */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
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
                        Voting is currently active. Select a category to vote.
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
                  </div>

                  {/* Mobile-only Organizer Info */}
                  <AwardOrganizerInfo organizer={award.organizer} />
                </div>

                {/* Map Section */}
                <AwardLocationMap mapUrl={award.mapUrl} />

                {/* Contact & Social Media */}
                <AwardContactInfo
                  contact={award.contact}
                  socialMedia={award.socialMedia}
                />

                {/* Share Buttons */}
                <div className="pt-8 border-t border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
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

          {/* Right Column - Award Info & Banner */}
          <div className="lg:w-1/3 order-2 lg:order-2 space-y-6">
            {/* Banner Image Card - Desktop Only */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 hover:line-clamp-none transition-all duration-300">
                    {award.description}
                  </p>
                )}
              </div>
            </div>

            {/* Award Details Card - Desktop Only */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
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

            {/* Status Card - Desktop Only */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
                  Voting is currently active. Select a category to vote.
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

            {/* Organizer Info - Desktop Only */}
            <div className="hidden lg:block">
              <AwardOrganizerInfo organizer={award.organizer} />
            </div>
          </div>
        </div>
      </div>

      {/* Voting Modal removed in favor of pages */}
    </div>
  );
};

export default AwardDetail;
