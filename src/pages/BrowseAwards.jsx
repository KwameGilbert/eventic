import React, { useState, useEffect, useCallback } from "react";
import { Trophy, Home as HomeIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import AwardCard from "../components/awards/AwardCard";
import awardService from "../services/awardService";
import PageHeader from "../components/common/PageHeader";
import ResultsHeader from "../components/common/ResultsHeader";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import SEO from "../components/common/SEO";

const BrowseAwards = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [awards, setAwards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 12,
    total: 0,
    totalPages: 0,
  });
  const [currentFilters, setCurrentFilters] = useState({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch awards from API
  const fetchAwards = useCallback(
    async (filters = {}, page = 1) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = {
          page,
          per_page: pagination.perPage,
          ...filters,
        };

        // Clean up params
        Object.keys(params).forEach((key) => {
          if (params[key] === "" || params[key] === false) {
            delete params[key];
          }
        });

        const response = await awardService.getAll(params);
        const data = response?.data || response;

        setAwards(data?.awards || []);
        setPagination((prev) => ({
          ...prev,
          page: data?.page || 1,
          total: data?.total || 0,
          totalPages: data?.total_pages || 1,
        }));
      } catch (err) {
        console.error("Failed to fetch awards:", err);
        setError("Failed to load awards. Please try again.");
        setAwards([]);
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.perPage],
  );

  // Initial load
  useEffect(() => {
    const search = searchParams.get("search");
    const upcoming = searchParams.get("upcoming") === "true";
    const voting_open = searchParams.get("voting_open") === "true";

    const initialFilters = {};
    if (search) initialFilters.search = search;
    if (upcoming) initialFilters.upcoming = "true";
    if (voting_open) initialFilters.voting_open = "true";

    setCurrentFilters(initialFilters);
    fetchAwards(initialFilters);
  }, [searchParams, fetchAwards]);

  // Handle filter changes
  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);

    // Update URL params
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.upcoming) params.set("upcoming", "true");
    if (filters.voting_open) params.set("voting_open", "true");
    setSearchParams(params);

    // Fetch with new filters
    fetchAwards(filters, 1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    fetchAwards(currentFilters, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Retry loading
  const handleRetry = () => {
    fetchAwards(currentFilters, pagination.page);
  };

  // Count active filters
  const filterCount = Object.keys(currentFilters).filter(
    (k) => currentFilters[k] && currentFilters[k] !== "Ghana",
  ).length;

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO
        title="Browse Awards"
        description="Explore African award events, vote for nominees, and stay updated with ceremony dates on Eventic."
      />
      {/* Page Header */}
      <PageHeader
        title="Award Events"
        breadcrumbs={[
          { icon: <HomeIcon size={16} />, path: "/" },
          { label: "Award Events" },
        ]}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            {/* Filter Panel */}
            <div className="absolute inset-y-0 left-0 w-80 bg-white shadow-xl overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Awards
                  </label>
                  <input
                    type="text"
                    value={currentFilters.search || ""}
                    onChange={(e) =>
                      setCurrentFilters({
                        ...currentFilters,
                        search: e.target.value,
                      })
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleFilterChange(currentFilters)
                    }
                    placeholder="Search by name..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent"
                  />
                </div>

                {/* Status Filters */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voting Status
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={currentFilters.voting_open === "true"}
                        onChange={(e) =>
                          handleFilterChange({
                            ...currentFilters,
                            voting_open: e.target.checked ? "true" : "",
                          })
                        }
                        className="rounded text-(--brand-primary) focus:ring-(--brand-primary)"
                      />
                      <span className="ml-2 text-sm">Voting Open</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={currentFilters.upcoming === "true"}
                        onChange={(e) =>
                          handleFilterChange({
                            ...currentFilters,
                            upcoming: e.target.checked ? "true" : "",
                          })
                        }
                        className="rounded text-(--brand-primary) focus:ring-(--brand-primary)"
                      />
                      <span className="ml-2 text-sm">Upcoming Only</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => handleFilterChange({})}
                  className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="font-bold text-lg mb-4">Filters</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Awards
                </label>
                <input
                  type="text"
                  value={currentFilters.search || ""}
                  onChange={(e) =>
                    setCurrentFilters({
                      ...currentFilters,
                      search: e.target.value,
                    })
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleFilterChange(currentFilters)
                  }
                  placeholder="Search by name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voting Status
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={currentFilters.voting_open === "true"}
                      onChange={(e) =>
                        handleFilterChange({
                          ...currentFilters,
                          voting_open: e.target.checked ? "true" : "",
                        })
                      }
                      className="rounded text-(--brand-primary) focus:ring-(--brand-primary)"
                    />
                    <span className="ml-2 text-sm">Voting Open</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={currentFilters.upcoming === "true"}
                      onChange={(e) =>
                        handleFilterChange({
                          ...currentFilters,
                          upcoming: e.target.checked ? "true" : "",
                        })
                      }
                      className="rounded text-(--brand-primary) focus:ring-(--brand-primary)"
                    />
                    <span className="ml-2 text-sm">Upcoming Only</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => handleFilterChange({})}
                className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Awards Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <ResultsHeader
              isLoading={isLoading}
              totalCount={pagination.total}
              itemType="award(s)"
              filterCount={filterCount}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onFilterClick={() => setIsMobileFilterOpen(true)}
            />

            {/* Loading State */}
            {isLoading && <LoadingState message="Loading awards..." />}

            {/* Error State */}
            {error && !isLoading && (
              <ErrorState
                title="Failed to Load Awards"
                message={error}
                onRetry={handleRetry}
              />
            )}

            {/* Empty State */}
            {!isLoading && !error && awards.length === 0 && (
              <EmptyState
                icon={Trophy}
                title="No Awards Found"
                message="Try adjusting your filters or check back later for new awards."
                actionLabel="Clear Filters"
                onAction={() => handleFilterChange({})}
              />
            )}

            {/* Award Cards */}
            {!isLoading && !error && awards.length > 0 && (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {awards.map((award) => (
                    <AwardCard
                      key={award.id}
                      award={award}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseAwards;
