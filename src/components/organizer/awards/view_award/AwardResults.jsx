import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  ChevronDown,
  Search,
  Users,
  Eye,
  RefreshCw,
  Loader2,
  BarChart3,
  Table,
} from "lucide-react";
import awardService from "../../../../services/awardService";

/**
 * AwardResults - Leaderboard/Results tab for Admin and Organizer Award Detail pages
 * Shows voting results grouped by category with nominees ranked by vote count
 */
const AwardResults = ({ award }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState({});

  const fetchLeaderboard = async () => {
    if (!award?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await awardService.getLeaderboard(award.id);
      const data = response?.data || response;
      const leaderboardData = data.leaderboard || [];
      setLeaderboard(leaderboardData);

      // Auto-expand the first category
      if (leaderboardData.length > 0) {
        setExpandedCategories({ [leaderboardData[0].category_id]: true });
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      setError("Failed to load results data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [award?.id]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const filteredLeaderboard = useMemo(() => {
    return leaderboard
      .filter(
        (cat) =>
          selectedCategory === "all" ||
          String(cat.category_id) === String(selectedCategory),
      )
      .map((cat) => {
        const allNomineesSorted = (cat.nominees || [])
          .sort((a, b) => (b.total_votes || 0) - (a.total_votes || 0))
          .map((n, idx) => ({ ...n, rank: idx + 1 }));

        const filteredNominees = allNomineesSorted.filter(
          (n) =>
            n.nominee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (n.nominee_code &&
              n.nominee_code.toLowerCase().includes(searchTerm.toLowerCase())),
        );

        return { ...cat, nominees: filteredNominees };
      })
      .filter((cat) => cat.nominees.length > 0);
  }, [leaderboard, selectedCategory, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-orange-500" />
        <span className="ml-3 text-gray-500">Loading results...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 mb-3">{error}</p>
        <button
          onClick={fetchLeaderboard}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!award?.show_results) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye size={28} className="text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Results Visibility Off
        </h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Results are currently hidden from the public. You can still view them
          here. Toggle this in Settings to make results visible to voters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {leaderboard.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="relative flex-1 sm:w-60">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search nominees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={fetchLeaderboard}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Results */}
      {filteredLeaderboard.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Users size={40} className="mx-auto text-gray-200 mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No Results Yet
          </h3>
          <p className="text-gray-500 text-sm">
            {searchTerm
              ? "No nominees match your search."
              : "No votes have been cast yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeaderboard.map((category) => {
            const isExpanded = expandedCategories[category.category_id];
            const categoryTotalVotes = category.nominees.reduce(
              (sum, n) => sum + (n.total_votes || 0),
              0,
            );

            return (
              <div
                key={category.category_id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                {/* Category Header */}
                <div
                  onClick={() => toggleCategory(category.category_id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        isExpanded
                          ? "bg-orange-50 text-orange-600"
                          : "bg-gray-50 text-gray-400"
                      }`}
                    >
                      <Trophy size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        {category.category_name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {category.nominees.length} Nominees •{" "}
                        {categoryTotalVotes.toLocaleString()} Votes
                      </p>
                    </div>
                  </div>
                  <div
                    className={`p-1.5 rounded-lg transition-transform ${
                      isExpanded
                        ? "rotate-180 text-orange-600"
                        : "text-gray-400"
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </div>

                {/* Nominees Table */}
                {isExpanded && (
                  <div className="border-t border-gray-100">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/80">
                            <th className="px-4 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-14">
                              Rank
                            </th>
                            <th className="px-4 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                              Nominee
                            </th>
                            <th className="px-4 py-2.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                              Code
                            </th>
                            <th className="px-4 py-2.5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest w-24">
                              Votes
                            </th>
                            <th className="px-4 py-2.5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest w-20">
                              Share
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {category.nominees.map((nominee, index) => {
                            const voteShare =
                              categoryTotalVotes > 0
                                ? (
                                    ((nominee.total_votes || 0) /
                                      categoryTotalVotes) *
                                    100
                                  ).toFixed(1)
                                : "0.0";

                            return (
                              <tr
                                key={nominee.nominee_id}
                                className={`group hover:bg-gray-50/50 transition-colors ${
                                  index === 0 ? "bg-orange-50/30" : ""
                                }`}
                              >
                                <td className="px-4 py-3">
                                  <div
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                                      nominee.rank === 1
                                        ? "bg-yellow-100 text-yellow-700"
                                        : nominee.rank === 2
                                          ? "bg-gray-100 text-gray-600"
                                          : nominee.rank === 3
                                            ? "bg-orange-50 text-orange-600"
                                            : "text-gray-400"
                                    }`}
                                  >
                                    {nominee.rank}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2.5">
                                    {nominee.nominee_image ? (
                                      <img
                                        src={nominee.nominee_image}
                                        alt={nominee.nominee_name}
                                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                      />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">
                                        {nominee.nominee_name?.charAt(0)}
                                      </div>
                                    )}
                                    <span className="font-semibold text-sm text-gray-900 truncate max-w-[180px]">
                                      {nominee.nominee_name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 font-mono text-xs text-gray-500 uppercase tracking-wider">
                                  {nominee.nominee_code || "-"}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex flex-col items-end">
                                    <span className="font-bold text-sm text-gray-900">
                                      {(
                                        nominee.total_votes || 0
                                      ).toLocaleString()}
                                    </span>
                                    <div className="w-16 h-1.5 rounded-full bg-gray-100 mt-1 overflow-hidden">
                                      <div
                                        className="h-full bg-orange-500 rounded-full transition-all"
                                        style={{
                                          width: `${(nominee.total_votes / (categoryTotalVotes || 1)) * 100}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className="text-xs font-semibold text-gray-500">
                                    {voteShare}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AwardResults;
