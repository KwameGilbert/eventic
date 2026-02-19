import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Calendar,
  Trophy,
  User,
  Search,
  ArrowRight,
  MapPin,
  ExternalLink,
  Hash,
  Compass,
} from "lucide-react";

import PropTypes from "prop-types";

const GlobalSearchDropdown = ({ results, isLoading, query, onResultClick }) => {
  const navigate = useNavigate(); 

  if (!query) return null;

  const handleNavigation = (path) => {
    navigate(path);
    if (onResultClick) onResultClick();
  };

  const hasResults =
    results &&
    (results.events?.length > 0 ||
      results.awards?.length > 0 ||
      results.contestants?.length > 0 ||
      results.categories?.length > 0 ||
      results.organizers?.length > 0);

  return (
    <div
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-100 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
        {/* Loading State */}
        {isLoading && (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-100 border-t-(--brand-primary) rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500 text-sm font-medium">
              Searching for &quot;{query}&quot;...
            </p>
          </div>
        )}

        {/* No Results State */}
        {!isLoading && !hasResults && (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-900 font-semibold mb-1">No results found</p>
            <p className="text-gray-500 text-sm">
              We couldn&apos;t find anything matching &quot;{query}&quot;
            </p>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && hasResults && (
          <div className="py-2">
            {/* 1. Contestants Section */}
            {results.contestants?.length > 0 && (
              <div className="mb-4">
                <div className="px-4 py-2 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <User size={14} />
                    Contestants / Nominees
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {results.contestants.length}
                  </span>
                </div>
                <div className="mt-1">
                  {results.contestants.map((nominee) => (
                    <div
                      key={nominee.id}
                      onClick={() =>
                        handleNavigation(
                          `/award/${nominee.award_slug}/nominee/${nominee.id}`,
                        )
                      }
                      role="button"
                      tabIndex={0}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-50 overflow-hidden shrink-0 border border-blue-100">
                        {nominee.image ? (
                          <img
                            src={nominee.image}
                            alt={nominee.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-blue-400 font-bold text-sm">
                            {nominee.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate text-sm">
                          {nominee.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                          <span className="font-bold text-blue-600 bg-blue-50 px-1 rounded">
                            {nominee.code}
                          </span>
                          <span className="truncate">
                            in {nominee.category}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5 truncate italic">
                          {nominee.award}
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-gray-300 group-hover:text-(--brand-primary) group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Categories Section */}
            {results.categories?.length > 0 && (
              <div className="mb-4">
                <div className="px-4 py-2 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <Compass size={14} />
                    Award Categories
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {results.categories.length}
                  </span>
                </div>
                <div className="mt-1">
                  {results.categories.map((category) => (
                    <div
                      key={category.id}
                      onClick={() =>
                        handleNavigation(
                          `/award/${category.award_slug}/category/${category.id}`,
                        )
                      }
                      role="button"
                      tabIndex={0}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
                        <Compass size={20} className="text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate text-sm">
                          {category.name}
                        </h4>
                        <div className="text-[10px] text-gray-500 mt-0.5 truncate italic">
                          {category.award}
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-gray-300 group-hover:text-(--brand-primary) group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Awards Section */}
            {results.awards?.length > 0 && (
              <div className="mb-4">
                <div className="px-4 py-2 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <Trophy size={14} />
                    Awards
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {results.awards.length}
                  </span>
                </div>
                <div className="mt-1">
                  {results.awards.map((award) => (
                    <div
                      key={award.id}
                      onClick={() => handleNavigation(`/award/${award.slug}`)}
                      role="button"
                      tabIndex={0}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-lg bg-orange-50 overflow-hidden shrink-0 border border-orange-100">
                        {award.image ? (
                          <img
                            src={award.image}
                            alt={award.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-orange-400">
                            <Trophy size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate text-sm">
                          {award.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <Hash size={12} className="shrink-0" />
                          <span className="font-bold text-orange-600">
                            {award.code}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="shrink-0">{award.date}</span>
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-gray-300 group-hover:text-(--brand-primary) group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Events Section */}
            {results.events?.length > 0 && (
              <div className="mb-4">
                <div className="px-4 py-2 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <Calendar size={14} />
                    Events
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {results.events.length}
                  </span>
                </div>
                <div className="mt-1">
                  {results.events.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleNavigation(`/event/${event.slug}`)}
                      role="button"
                      tabIndex={0}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                        {event.image ? (
                          <img
                            src={event.image}
                            alt={event.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Calendar size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate text-sm">
                          {event.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <MapPin size={12} className="shrink-0" />
                          <span className="truncate">{event.venue}</span>
                          <span className="text-gray-300">•</span>
                          <span className="shrink-0">{event.date}</span>
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-gray-300 group-hover:text-(--brand-primary) group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Organizers Section */}
            {results.organizers?.length > 0 && (
              <div className="mb-2">
                <div className="px-4 py-2 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <ExternalLink size={14} />
                    Organizers
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {results.organizers.length}
                  </span>
                </div>
                <div className="mt-1">
                  {results.organizers.map((organizer) => (
                    <div
                      key={organizer.id}
                      onClick={() =>
                        handleNavigation(`/organizers/${organizer.id}`)
                      }
                      role="button"
                      tabIndex={0}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
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
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate text-sm">
                          {organizer.name}
                        </h4>
                        {organizer.bio && (
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">
                            {organizer.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {hasResults && !isLoading && (
        <div
          onClick={() =>
            handleNavigation(`/search?q=${encodeURIComponent(query)}`)
          }
          role="button"
          tabIndex={0}
          className="block p-3 bg-gray-50 hover:bg-gray-100 text-center border-t border-gray-100 transition-colors cursor-pointer"
        >
          <span className="text-sm font-semibold text-(--brand-primary) flex items-center justify-center gap-2">
            See all search results for &quot;{query}&quot;
            <ArrowRight size={16} />
          </span>
        </div>
      )}
    </div>
  );
};

GlobalSearchDropdown.propTypes = {
  results: PropTypes.shape({
    events: PropTypes.array,
    awards: PropTypes.array,
    contestants: PropTypes.array,
    categories: PropTypes.array,
    organizers: PropTypes.array,
  }),
  isLoading: PropTypes.bool.isRequired,
  query: PropTypes.string.isRequired,
  onResultClick: PropTypes.func.isRequired,
};

export default GlobalSearchDropdown;
