import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Heart,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import awardService from "../services/awardService";
import PageLoader from "../components/ui/PageLoader";
import AwardStatusBadge from "../components/awards/AwardStatusBadge";
import { showWarning } from "../utils/toast";

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
    // Rely on backend's calculated is_voting_open
    if (award?.voting_status === "open") return "voting_open";

    // Fallback to manual check if is_voting_open is missing
    if (award?.voting_status === "closed") return "voting_closed";
    if (award?.status === "completed") return "completed";

    if (!award?.voting_start || !award?.voting_end) return "upcoming";

    const now = new Date();
    const votingStart = new Date(award.voting_start);
    const votingEnd = new Date(award.voting_end);

    if (now < votingStart) return "upcoming";
    if (now > votingEnd) return "voting_closed";

    return "voting_open";
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

  const handleNomineeClick = (nominee) => {
    const isCategoryOpen =
      votingStatus === "voting_open" && category?.voting_status === "open";

    if (isCategoryOpen) {
      navigate(`/award/${slug}/nominee/${nominee.id}`);
    } else {
      showWarning("Voting is currently closed for this category.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/award/${slug}`)}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-gray-900 leading-none">
                {category.name}
              </h1>
              <span className="text-xs text-gray-500 mt-1">{award.title}</span>
            </div>
          </div>
          <div>
            <AwardStatusBadge
              status={
                votingStatus === "voting_open" &&
                category?.voting_status === "open"
                  ? "voting_open"
                  : "voting_closed"
              }
              className="text-xs px-3 py-1"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder={`Search nominees...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Nominees Grid - Smaller Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredNominees.map((nominee) => (
            <div
              key={nominee.id}
              onClick={() => handleNomineeClick(nominee)}
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
