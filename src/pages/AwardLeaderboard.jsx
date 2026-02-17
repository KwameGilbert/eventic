import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SEO from "../components/common/SEO";
import PropTypes from "prop-types";
import {
  Trophy,
  Award,
  AlertCircle,
  RefreshCw,
  Search,
  ChevronRight,
  ChevronDown,
  Eye,
  BarChart3,
  List,
  Filter,
  Vote,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import awardService from "../services/awardService";
import PageLoader from "../components/ui/PageLoader";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100">
        <p className="font-bold text-gray-900 leading-none mb-1">{label}</p>
        <p className="text-(--brand-primary) font-black">
          {payload[0].value.toLocaleString()} votes
        </p>
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
    }),
  ),
  label: PropTypes.string,
};

const RenderCustomBar = (props) => {
  const { fill, x, y, width, height, index, payload } = props;
  const radius = 8;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={radius}
        ry={radius}
      />
      {payload.nominee_image && (
        <defs>
          <clipPath id={`clip-${index}`}>
            <circle cx={x + width / 2} cy={y - 25} r={18} />
          </clipPath>
        </defs>
      )}
      {payload.nominee_image && (
        <image
          x={x + width / 2 - 18}
          y={y - 43}
          width={36}
          height={36}
          xlinkHref={payload.nominee_image}
          clipPath={`url(#clip-${index})`}
          preserveAspectRatio="xMidYMid slice"
        />
      )}
      {payload.nominee_image && (
        <circle
          cx={x + width / 2}
          cy={y - 25}
          r={18}
          fill="none"
          stroke={fill}
          strokeWidth={2}
        />
      )}
    </g>
  );
};

RenderCustomBar.propTypes = {
  fill: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  index: PropTypes.number,
  payload: PropTypes.shape({
    nominee_image: PropTypes.string,
  }),
};

const AwardLeaderboard = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [award, setAward] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");

  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const awardResponse = await awardService.getBySlug(slug);
        const awardData = awardResponse?.data || awardResponse;
        setAward(awardData);

        const leaderboardResponse = await awardService.getLeaderboard(
          awardData.id,
        );
        const leaderboardData =
          leaderboardResponse?.data || leaderboardResponse;
        const data = leaderboardData.leaderboard || [];
        setLeaderboard(data);

        if (data.length > 0) {
          setExpandedCategories({ [data[0].category_id]: true });
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError("Failed to load leaderboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [slug]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    awardService
      .getBySlug(slug)
      .then(async (awardResponse) => {
        const awardData = awardResponse?.data || awardResponse;
        setAward(awardData);
        const leaderboardResponse = await awardService.getLeaderboard(
          awardData.id,
        );
        const leaderboardData =
          leaderboardResponse?.data || leaderboardResponse;
        setLeaderboard(leaderboardData.leaderboard || []);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to load leaderboard data. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleVoteClick = (category, nominee = null) => {
    if (nominee) {
      navigate(`/award/${slug}/nominee/${nominee.nominee_id}`);
    } else {
      navigate(
        `/award/${slug}/category/${category.category_id || category.id}`,
      );
    }
  };

  const filteredLeaderboard = useMemo(() => {
    return leaderboard
      .filter(
        (cat) =>
          selectedCategory === "all" ||
          String(cat.category_id) === String(selectedCategory),
      )
      .map((cat) => {
        // Sort all nominees by votes first to establish true rank
        const allNomineesSorted = (cat.nominees || [])
          .sort((a, b) => (b.total_votes || 0) - (a.total_votes || 0))
          .map((n, idx) => ({ ...n, original_rank: idx + 1 }));

        // Then filter the sorted list
        const filteredNominees = allNomineesSorted.filter(
          (n) =>
            n.nominee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (n.nominee_code &&
              n.nominee_code.toLowerCase().includes(searchTerm.toLowerCase())),
        );

        return { ...cat, nominees: filteredNominees };
      })
      .filter((cat) => cat.nominees.length > 0);
  }, [leaderboard, selectedCategory, searchTerm]);

  if (isLoading) return <PageLoader message="Loading leaderboard..." />;

  if (error || !award) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center bg-white p-12 rounded-2xl shadow-sm max-w-md w-full border border-gray-100">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-20" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? "Error" : "Not Found"}
          </h2>
          <p className="text-gray-500 mb-8">{error || "Award not found."}</p>
          <div className="flex flex-col gap-3">
            {error && (
              <button
                onClick={handleRetry}
                className="py-3 bg-(--brand-primary) text-white rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} /> Retry
              </button>
            )}
            <Link
              to="/awards"
              className="py-3 text-gray-600 font-semibold hover:underline"
            >
              Browse Awards
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isVotingOpen = () => {
    // 1. Check if backend explicitly says voting is open
    if (award?.is_voting_open) return true;

    // 2. Check manual voting status toggle
    if (award?.voting_status === "closed") return false;

    // 3. Fallback to date-based logic
    const now = new Date();
    return (
      award.voting_start &&
      award.voting_end &&
      now >= new Date(award.voting_start) &&
      now <= new Date(award.voting_end)
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <SEO
        title={`Results: ${award.title}`}
        description={`View live voting results and leaderboard for ${award.title}. See who's leading in each category.`}
        image={award.banner_image || award.image}
      />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to={`/award/${slug}`}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight size={24} className="rotate-180 text-gray-400" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  Results & Leaderboard
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Trophy size={14} className="text-(--brand-primary)" />
                  <span>{award.title}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right mr-4 font-semibold text-sm">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                  Total Votes
                </p>
                <p className="text-gray-900 leading-none">
                  {(award.total_votes || 0).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "table" ? "bg-white shadow-sm text-(--brand-primary)" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode("chart")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "chart" ? "bg-white shadow-sm text-(--brand-primary)" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <BarChart3 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          <div className="relative md:col-span-8">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-(--brand-primary) outline-none transition-all font-medium text-gray-700"
            />
          </div>
          <div className="relative md:col-span-4">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-(--brand-primary) outline-none appearance-none cursor-pointer font-semibold text-gray-700"
            >
              <option value="all">All Categories</option>
              {leaderboard.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>
        </div>

        {/* Results */}
        {award.show_results === false ? (
          <div className="bg-white p-16 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Eye size={36} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Results are hidden
            </h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              The organizer has not enabled result visibility for this award
              event.
            </p>
            <Link
              to={`/award/${slug}`}
              className="inline-flex py-3 px-8 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
            >
              Back to Award
            </Link>
          </div>
        ) : filteredLeaderboard.length > 0 ? (
          <div className="space-y-6">
            {filteredLeaderboard.map((category) => {
              const isExpanded = expandedCategories[category.category_id];
              const categoryTotalVotes = category.nominees.reduce(
                (sum, n) => sum + (n.total_votes || 0),
                0,
              );

              return (
                <div
                  key={category.category_id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Category Accordion Header */}
                  <div
                    onClick={() => toggleCategory(category.category_id)}
                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isExpanded ? "bg-orange-50 text-(--brand-primary)" : "bg-gray-50 text-gray-400"}`}
                      >
                        <Award size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                          {category.category_name}
                        </h3>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                          {category.nominees.length} Nominees •{" "}
                          {categoryTotalVotes.toLocaleString()} Votes
                        </p>
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded-lg transition-transform ${isExpanded ? "rotate-180 text-(--brand-primary)" : "text-gray-400"}`}
                    >
                      <ChevronDown size={20} />
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      {viewMode === "table" ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="bg-gray-50/50">
                                <th className="px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-16">
                                  Rank
                                </th>
                                <th className="px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                  Contestant
                                </th>
                                <th className="px-4 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                  Nominee Code
                                </th>
                                <th className="px-4 py-3 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest w-24">
                                  Votes
                                </th>
                                <th className="px-4 py-3 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest w-20"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {category.nominees.map((nominee, index) => (
                                <tr
                                  key={nominee.nominee_id}
                                  className={`group ${index === 0 ? "bg-orange-50/20" : ""}`}
                                >
                                  <td className="px-4 py-3">
                                    <div
                                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                                        index === 0
                                          ? "bg-yellow-100 text-yellow-700"
                                          : index === 1
                                            ? "bg-gray-100 text-gray-500"
                                            : "text-gray-300"
                                      }`}
                                    >
                                      {nominee.original_rank}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 font-bold text-gray-800">
                                    <div
                                      className="max-w-[150px] sm:max-w-[200px] truncate"
                                      title={nominee.nominee_name}
                                    >
                                      {nominee.nominee_name}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 font-mono text-xs text-gray-500 uppercase tracking-wider">
                                    {nominee.nominee_code || "-"}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex flex-col items-end">
                                      <span className="font-bold text-gray-900">
                                        {(
                                          nominee.total_votes || 0
                                        ).toLocaleString()}
                                      </span>
                                      <div className="w-16 h-1 rounded-full bg-gray-100 mt-1.5 overflow-hidden hidden sm:block">
                                        <div
                                          className="h-full bg-(--brand-primary)"
                                          style={{
                                            width: `${(nominee.total_votes / (categoryTotalVotes || 1)) * 100}%`,
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <button
                                      onClick={() =>
                                        handleVoteClick(category, nominee)
                                      }
                                      disabled={
                                        !isVotingOpen() ||
                                        category.voting_status !== "open"
                                      }
                                      className={`p-2 rounded-lg font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center ${
                                        isVotingOpen() &&
                                        category.voting_status === "open"
                                          ? "bg-(--brand-primary) text-white hover:bg-orange-600 shadow-orange-100"
                                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                      }`}
                                      title={
                                        isVotingOpen() &&
                                        category.voting_status === "open"
                                          ? "Cast your vote"
                                          : "Voting closed"
                                      }
                                    >
                                      <Vote size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        /* Chart View */
                        <div className="p-8 pb-12 bg-gray-50/10">
                          <div className="h-[400px] w-full pt-16">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={category.nominees.slice(0, 10)}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  left: 0,
                                  bottom: 40,
                                }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  vertical={false}
                                  stroke="#e5e7eb"
                                />
                                <XAxis
                                  dataKey="nominee_name"
                                  angle={-20}
                                  textAnchor="end"
                                  interval={0}
                                  tick={{
                                    fill: "#9ca3af",
                                    fontSize: 10,
                                    fontWeight: 700,
                                  }}
                                  axisLine={{ stroke: "#e5e7eb" }}
                                />
                                <YAxis
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{ fill: "#d1d5db", fontSize: 10 }}
                                />
                                <Tooltip
                                  content={<CustomTooltip />}
                                  cursor={{ fill: "#f3f4f6", radius: 10 }}
                                />
                                <Bar
                                  dataKey="total_votes"
                                  shape={<RenderCustomBar />}
                                  barSize={40}
                                >
                                  {category.nominees
                                    .slice(0, 10)
                                    .map((entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={
                                          index === 0 ? "#fbbf24" : "#f97316"
                                        }
                                      />
                                    ))}
                                  <LabelList
                                    dataKey="total_votes"
                                    position="top"
                                    formatter={(val) => val.toLocaleString()}
                                    style={{
                                      fill: "#4b5563",
                                      fontSize: 11,
                                      fontWeight: 800,
                                    }}
                                  />
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-2xl border border-gray-200 shadow-sm text-center">
            <Search size={48} className="text-gray-200 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2 underline-offset-4 decoration-(--brand-primary)">
              No matching results
            </h3>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto font-medium">
              Try searching for a different name or changing the category
              filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="text-(--brand-primary) font-bold hover:underline py-2 px-4"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Voting Modal removed in favor of pages */}
    </div>
  );
};

export default AwardLeaderboard;
