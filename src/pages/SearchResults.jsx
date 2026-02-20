import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  Calendar,
  Trophy,
  User,
  Compass,
  ExternalLink,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  Filter,
  Ticket,
} from "lucide-react";
import searchService from "../services/searchService";
import PageLoader from "../components/ui/PageLoader";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchService.globalSearch(query);
        setResults(data);
      } catch (err) {
        console.error("Search failed:", err);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const hasResults =
    results &&
    (results.events?.length > 0 ||
      results.awards?.length > 0 ||
      results.contestants?.length > 0 ||
      results.categories?.length > 0 ||
      results.organizers?.length > 0);

  // Loading State
  if (isLoading) {
    return <PageLoader message="Searching the entire platform..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link
              to="/"
              className="hover:text-(--brand-primary) transition-colors"
            >
              Home
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Search Results</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              {hasResults ? "Results found" : "Search results"}
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              {query ? (
                <>
                  Showing matches for{" "}
                  <span className="text-gray-900 font-bold bg-yellow-100 px-2 py-0.5 rounded ml-1 italic">
                    &ldquo;{query}&rdquo;
                  </span>
                </>
              ) : (
                "Enter a keyword to search events, awards, and more."
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {error ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-red-100 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-red-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Search Error
            </h3>
            <p className="text-gray-500 mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-(--brand-primary) text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : !hasResults ? (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200 max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-gray-300" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We couldn&apos;t find anything matching your search. Try adjusting
              keywords or check for typos.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all hover:-translate-y-0.5 shadow-lg shadow-gray-200"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Sidebar with Stats */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-50">
                  <Filter size={16} className="text-gray-400" />
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                    Summary
                  </h4>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      label: "Contestants",
                      count: results.contestants?.length,
                      icon: User,
                      color: "blue",
                    },
                    {
                      label: "Categories",
                      count: results.categories?.length,
                      icon: Compass,
                      color: "purple",
                    },
                    {
                      label: "Awards",
                      count: results.awards?.length,
                      icon: Trophy,
                      color: "orange",
                    },
                    {
                      label: "Events",
                      count: results.events?.length,
                      icon: Calendar,
                      color: "green",
                    },
                    {
                      label: "Organizers",
                      count: results.organizers?.length,
                      icon: ExternalLink,
                      color: "gray",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-gray-600">
                        <item.icon
                          size={16}
                          className={`text-${item.color}-500`}
                        />
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </div>
                      <span
                        className={`bg-${item.color}-50 text-${item.color}-700 px-2.5 py-0.5 rounded-md text-xs font-bold`}
                      >
                        {item.count || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Content */}
            <div className="lg:col-span-9 space-y-16">
              {/* Contestants Results */}
              {results.contestants?.length > 0 && (
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                      <User size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">
                        Contestants
                      </h2>
                      <p className="text-sm text-gray-500">
                        Nominees matched by name or code
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {results.contestants.map((nominee) => (
                      <Link
                        key={nominee.id}
                        to={`/award/${nominee.award_slug}/nominee/${nominee.id}`}
                        className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-5"
                      >
                        <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden shrink-0 border-2 border-white shadow-md">
                          {nominee.image ? (
                            <img
                              src={nominee.image}
                              alt={nominee.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-blue-400 font-bold text-xl bg-blue-50">
                              {nominee.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors truncate">
                            {nominee.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                              {nominee.code}
                            </span>
                            <span className="text-gray-300 text-xs">•</span>
                            <span className="text-gray-500 text-xs truncate">
                              {nominee.category}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {nominee.award}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <ArrowRight size={16} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Category Results */}
              {results.categories?.length > 0 && (
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                      <Compass size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">
                        Categories
                      </h2>
                      <p className="text-sm text-gray-500">
                        Award categories matching your search
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {results.categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/award/${category.award_slug}/category/${category.id}`}
                        className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                            <Compass size={20} />
                          </div>
                          <ArrowRight
                            size={18}
                            className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all"
                          />
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors mb-2">
                          {category.name}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            In
                          </span>
                          <span className="font-medium text-gray-900 truncate flex-1">
                            {category.award}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Award Results */}
              {results.awards?.length > 0 && (
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">
                        Awards
                      </h2>
                      <p className="text-sm text-gray-500">
                        Award ceremonies and events
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.awards.map((award) => (
                      <Link
                        key={award.id}
                        to={`/award/${award.slug}`}
                        className="group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform"
                      >
                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                          {award.image ? (
                            <img
                              src={award.image}
                              alt={award.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                              <Trophy size={48} className="opacity-50" />
                            </div>
                          )}
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm border border-gray-100">
                            <span className="text-xs font-black text-orange-600 uppercase tracking-wider">
                              {award.code}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h4 className="font-black text-gray-900 text-xl group-hover:text-(--brand-primary) transition-colors mb-3 line-clamp-2">
                            {award.name}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <Calendar size={16} className="text-orange-400" />
                              <span>{award.date}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Event Results */}
              {results.events?.length > 0 && (
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">
                        Events
                      </h2>
                      <p className="text-sm text-gray-500">
                        Upcoming ticketing events
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.events.map((event) => (
                      <Link
                        key={event.id}
                        to={`/event/${event.slug}`}
                        className="group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                          {event.image ? (
                            <img
                              src={event.image}
                              alt={event.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                              <Calendar size={48} className="opacity-50" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-wide">
                              <Ticket size={12} />
                              <span>Ticketed</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h4 className="font-black text-gray-900 text-xl group-hover:text-green-600 transition-colors mb-3 line-clamp-2">
                            {event.name}
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin
                                size={16}
                                className="text-green-500 shrink-0"
                              />
                              <span className="truncate">{event.venue}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock
                                size={16}
                                className="text-green-500 shrink-0"
                              />
                              <span>{event.date}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Organizer Results */}
              {results.organizers?.length > 0 && (
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-white">
                      <ExternalLink size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">
                        Organizers
                      </h2>
                      <p className="text-sm text-gray-500">
                        Verified event organizers
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {results.organizers.map((organizer) => (
                      <Link
                        key={organizer.id}
                        to={`/organizers/${organizer.id}`}
                        className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-900 transition-all duration-300 flex items-center gap-4"
                      >
                        <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-100 shadow-inner group-hover:scale-105 transition-transform">
                          {organizer.image ? (
                            <img
                              src={organizer.image}
                              alt={organizer.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-lg">
                              {organizer.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 group-hover:text-(--brand-primary) transition-colors truncate">
                            {organizer.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <p className="text-xs text-gray-500 font-medium tracking-wide">
                              Verified
                            </p>
                          </div>
                        </div>
                        <ArrowRight
                          size={18}
                          className="text-gray-300 group-hover:text-gray-900 -ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
            Still didn&apos;t find it?
          </h2>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
            Our platform is growing every day. Browse our main categories or
            check back later for new events and awards.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/events"
              className="bg-(--brand-primary) text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-orange-100 hover:shadow-orange-200 hover:-translate-y-0.5 transition-all"
            >
              Browse Events
            </Link>
            <Link
              to="/awards"
              className="bg-gray-50 text-gray-900 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100 hover:-translate-y-0.5 transition-all border border-gray-100"
            >
              View all Awards
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
