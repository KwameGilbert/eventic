import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  ArrowLeft,
  Users,
  TrendingUp,
  Heart,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import awardService from "../services/awardService";
import PageLoader from "../components/ui/PageLoader";
import AwardStatusBadge from "../components/awards/AwardStatusBadge";

/**
 * Category Nominees Page
 * Displays all nominees for a specific category within an award
 */
const CategoryNominees = () => {
  const { slug, categoryId } = useParams();
  const navigate = useNavigate();
  const [award, setAward] = useState(null);
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await awardService.getBySlug(slug);
        const awardData = response?.data || response;
        setAward(awardData);

        // Find the category
        if (awardData?.categories) {
          const foundCategory = awardData.categories.find(
            (c) => String(c.id) === String(categoryId) || c.slug === categoryId,
          );
          if (foundCategory) {
            setCategory(foundCategory);
          } else {
            setError("Category not found");
          }
        } else {
          setError("Award categories not found");
        }
      } catch (err) {
        console.error("Failed to fetch award/category data:", err);
        setError("Failed to load nominees. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, categoryId]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setAward(null); // Force reload
  };

  const getVotingStatus = () => {
    if (!award?.voting_start || !award?.voting_end) return "upcoming";

    const now = new Date();
    const votingStart = new Date(award.voting_start);
    const votingEnd = new Date(award.voting_end);

    if (now < votingStart) return "upcoming";
    if (now >= votingStart && now <= votingEnd) return "voting_open";
    return "voting_closed";
  };

  const filteredNominees = useMemo(() => {
    if (!category?.nominees) return [];
    return category.nominees.filter(
      (n) =>
        n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (n.nominee_code &&
          n.nominee_code.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [category, searchTerm]);

  if (isLoading) {
    return <PageLoader message="Loading nominees..." />;
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">
            {error || "Something went wrong"}
          </p>
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

  const votingStatus = getVotingStatus();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Dynamic Background Header */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gray-900">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover opacity-60 scale-105 blur-[2px]"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-gray-900 via-gray-800 to-black" />
          )}
        </div>

        {/* Abstract Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-gray-50 via-gray-950/40 to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(`/award/${slug}`)}
              className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/80 text-xs font-bold uppercase tracking-widest">
              {award.title}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-white/80 text-lg line-clamp-2 md:line-clamp-none leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <AwardStatusBadge
                status={votingStatus}
                className="text-sm px-5 py-2"
              />
              <div className="flex items-center gap-4 text-white/60 text-sm font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-orange-400" />
                  <span>{category.nominees?.length || 0} Nominees</span>
                </div>
                {category.cost_per_vote > 0 && (
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-yellow-400" />
                    <span>GH₵{category.cost_per_vote.toFixed(2)}/vote</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-4 mb-10 border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder={`Search nominees in ${category.name}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 font-semibold text-gray-700 placeholder:text-gray-400 transition-all"
            />
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-xl border border-orange-100">
            <TrendingUp size={18} className="text-orange-500" />
            <span className="text-orange-700 font-bold text-sm whitespace-nowrap">
              Active voting {category.nominees?.length > 0 ? "live" : "pending"}
            </span>
          </div>
        </div>

        {/* Nominees Grid - Smaller Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredNominees.map((nominee) => (
            <div
              key={nominee.id}
              onClick={() =>
                votingStatus === "voting_open" &&
                navigate(`/award/${slug}/nominee/${nominee.id}`)
              }
              className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-200/40 transition-all duration-500 cursor-pointer flex flex-col`}
            >
              {/* Nominee Image Container - Smaller Aspect */}
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                {nominee.image || nominee.nominee_image ? (
                  <img
                    src={nominee.image || nominee.nominee_image}
                    alt={nominee.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 font-black text-4xl">
                    {nominee.name.charAt(0)}
                  </div>
                )}

                {/* Badge Overlay */}
                {nominee.nominee_code && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-md border border-white/20 rounded-lg text-[10px] font-mono font-black text-gray-800 shadow-sm uppercase tracking-tighter">
                      {nominee.nominee_code}
                    </span>
                  </div>
                )}

                {/* Hover States */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <span className="inline-flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest bg-orange-500 px-4 py-2 rounded-full shadow-lg">
                      <Heart size={14} className="fill-current" />
                      Vote Now
                    </span>
                  </div>
                </div>
              </div>

              {/* Nominee Info - More Compact */}
              <div className="p-4 flex-1 flex flex-col justify-center">
                <h3 className="text-base md:text-lg font-black text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {nominee.name}
                </h3>

                {/* Simplified Stats */}
                {award.show_results &&
                  (nominee.total_votes !== undefined ||
                    nominee.votes !== undefined) && (
                    <div className="mt-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
                        <span className="truncate">
                          {(
                            nominee.total_votes ||
                            nominee.votes ||
                            0
                          ).toLocaleString()}{" "}
                          votes
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {(!category.nominees || category.nominees.length === 0) && (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
            <Users size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Nominees Found
            </h3>
            <p className="text-gray-500">
              There are no nominees currently listed for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryNominees;
