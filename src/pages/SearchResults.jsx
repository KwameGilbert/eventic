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
  Hash,
  ChevronRight,
} from "lucide-react";
import searchService from "../services/searchService";

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link to="/" className="hover:text-(--brand-primary)">
                  Home
                </Link>
                <ChevronRight size={14} />
                <span className="text-gray-900 font-medium">
                  Search Results
                </span>
              </nav>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Search Results
              </h1>
              <p className="mt-2 text-lg text-gray-500">
                {query ? (
                  <>
                    Showing results for{" "}
                    <span className="text-gray-900 font-semibold italic">
                      `{query}`
                    </span>
                  </>
                ) : (
                  "Enter a keyword to search across the platform"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-(--brand-primary) rounded-full animate-spin mb-6"></div>
            <p className="text-xl font-medium text-gray-600 italic">
              Searching the entire platform...
            </p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-red-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Search Error
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-(--brand-primary) text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
            >
              Try Again
            </button>
          </div>
        ) : !hasResults ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-gray-300" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We couldn&apos;t find anything matching `{query}`. Try checking your
              spelling or using more general keywords.
            </p>
            <Link
              to="/"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar with Stats/Categories */}
            <div className="lg:col-span-3 space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 pb-4 border-b border-gray-50">
                  Result Summary
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-600">
                      <User size={18} className="text-blue-500" />
                      <span className="text-sm font-medium">Contestants</span>
                    </div>
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                      {results.contestants?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Compass size={18} className="text-purple-500" />
                      <span className="text-sm font-medium">Categories</span>
                    </div>
                    <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                      {results.categories?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Trophy size={18} className="text-orange-500" />
                      <span className="text-sm font-medium">Awards</span>
                    </div>
                    <span className="bg-orange-50 text-orange-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                      {results.awards?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar size={18} className="text-green-500" />
                      <span className="text-sm font-medium">Events</span>
                    </div>
                    <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                      {results.events?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-600">
                      <ExternalLink size={18} className="text-gray-500" />
                      <span className="text-sm font-medium">Organizers</span>
                    </div>
                    <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                      {results.organizers?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Content */}
            <div className="lg:col-span-9 space-y-12">
              {/* Contestants Results */}
              {results.contestants?.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                      <User size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Contestants & Nominees
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.contestants.map((nominee) => (
                      <Link
                        key={nominee.id}
                        to={`/award/${nominee.award_slug}/nominee/${nominee.id}`}
                        className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-(--brand-primary) transition-all flex items-center gap-4"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 overflow-hidden shrink-0 border border-blue-100">
                          {nominee.image ? (
                            <img
                              src={nominee.image}
                              alt={nominee.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-blue-400 font-bold text-lg">
                              {nominee.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-lg group-hover:text-(--brand-primary) transition-colors truncate">
                            {nominee.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-extrabold tracking-wide">
                              {nominee.code}
                            </span>
                            <span className="text-gray-400 text-xs">•</span>
                            <span className="text-gray-500 text-xs truncate max-w-[150px]">
                              {nominee.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1 italic truncate">
                            {nominee.award}
                          </p>
                        </div>
                        <ArrowRight
                          size={20}
                          className="text-gray-300 group-hover:text-(--brand-primary) group-hover:translate-x-1 transition-all pr-1"
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Category Results */}
              {results.categories?.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-100">
                      <Compass size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Award Categories
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/award/${category.award_slug}/category/${category.id}`}
                        className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-500 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                            <Compass size={20} />
                          </div>
                          <ArrowRight
                            size={18}
                            className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all"
                          />
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">
                          {category.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm italic">
                          <span>part of</span>
                          <span className="font-medium text-gray-900 not-italic">
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
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
                      <Trophy size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Award Ceremonies
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.awards.map((award) => (
                      <Link
                        key={award.id}
                        to={`/award/${award.slug}`}
                        className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
                      >
                        <div className="h-40 bg-orange-50 relative">
                          {award.image ? (
                            <img
                              src={award.image}
                              alt={award.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-orange-400 opacity-20">
                              <Trophy size={60} />
                            </div>
                          )}
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm border border-white/20">
                            <Hash size={14} className="text-orange-600" />
                            <span className="text-xs font-bold text-gray-900">
                              {award.code}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h4 className="font-extrabold text-gray-900 text-xl group-hover:text-(--brand-primary) transition-colors mb-3">
                            {award.name}
                          </h4>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} className="text-orange-400" />
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
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-100">
                      <Calendar size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Ticketing Events
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.events.map((event) => (
                      <Link
                        key={event.id}
                        to={`/event/${event.slug}`}
                        className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
                      >
                        <div className="h-40 bg-gray-100 relative">
                          {event.image ? (
                            <img
                              src={event.image}
                              alt={event.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 opacity-20">
                              <Calendar size={60} />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h4 className="font-extrabold text-gray-900 text-xl group-hover:text-green-600 transition-colors mb-3">
                            {event.name}
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin size={14} className="text-green-500" />
                              <span className="truncate">{event.venue}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock size={14} className="text-green-500" />
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
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-white shadow-lg shadow-gray-200">
                      <ExternalLink size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Organizers
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {results.organizers.map((organizer) => (
                      <Link
                        key={organizer.id}
                        to={`/organizers/${organizer.id}`}
                        className="group bg-white pl-3 pr-6 py-3 rounded-full border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-900 transition-all flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-100 shadow-inner">
                          {organizer.image ? (
                            <img
                              src={organizer.image}
                              alt={organizer.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-sm">
                              {organizer.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 group-hover:text-(--brand-primary) transition-colors">
                            {organizer.name}
                          </h4>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Verified Organizer
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Community CTA */}
      <div className="bg-gray-900 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">
            Didn&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
            Try different keywords or browse our top categories to discover
            trending events and awards.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/events"
              className="bg-(--brand-primary) text-white px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all active:scale-95"
            >
              Browse Events
            </Link>
            <Link
              to="/awards"
              className="bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all active:scale-95"
            >
              See All Awards
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
