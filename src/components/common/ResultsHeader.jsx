import React from 'react';
import PropTypes from 'prop-types';
import { Grid, List, SlidersHorizontal, ThumbsUp, Bookmark, Rss } from 'lucide-react';

/**
 * Results Header Component
 * Displays result count, filters button, action buttons, and view toggle
 */
const ResultsHeader = ({
    isLoading,
    totalCount,
    itemType,
    filterCount,
    viewMode,
    onViewModeChange,
    onFilterClick,
    showActionButtons = true,
}) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 sm:text-base">
                {isLoading ? (
                    <span>Loading {itemType}...</span>
                ) : (
                    <>
                        <span className="font-semibold text-(--brand-primary)">{totalCount} {itemType}</span> found
                    </>
                )}
            </p>

            <div className="flex items-center gap-2">
                {/* Mobile Filter Toggle */}
                <button
                    onClick={onFilterClick}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 text-sm"
                >
                    <SlidersHorizontal size={18} className="text-(--brand-primary)" />
                    <span className="hidden xs:inline">Filters</span>
                    {filterCount > 0 && (
                        <span className="bg-(--brand-primary) text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            {filterCount}
                        </span>
                    )}
                </button>

                {/* Action Buttons - Hidden on mobile */}
                {showActionButtons && (
                    <>
                        <button
                            className="hidden sm:flex p-2.5 bg-(--brand-primary) hover:opacity-90 text-white rounded-full transition-opacity"
                            title="Like"
                        >
                            <ThumbsUp size={20} />
                        </button>
                        <button
                            className="hidden sm:flex p-2.5 bg-(--brand-primary) hover:opacity-90 text-white rounded-full transition-opacity"
                            title="Bookmark"
                        >
                            <Bookmark size={20} />
                        </button>
                        <button
                            className="hidden sm:flex p-2.5 bg-(--brand-primary) hover:opacity-90 text-white rounded-full transition-opacity"
                            title="RSS Feed"
                        >
                            <Rss size={20} />
                        </button>
                    </>
                )}

                {/* View Toggle */}
                <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`p-1.5 sm:p-2 rounded ${viewMode === 'grid' ? 'bg-(--brand-primary) text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Grid size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`p-1.5 sm:p-2 rounded ${viewMode === 'list' ? 'bg-(--brand-primary) text-white' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <List size={18} className="sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

ResultsHeader.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    totalCount: PropTypes.number.isRequired,
    itemType: PropTypes.string.isRequired,
    filterCount: PropTypes.number.isRequired,
    viewMode: PropTypes.oneOf(['grid', 'list']).isRequired,
    onViewModeChange: PropTypes.func.isRequired,
    onFilterClick: PropTypes.func.isRequired,
    showActionButtons: PropTypes.bool,
};

export default ResultsHeader;
