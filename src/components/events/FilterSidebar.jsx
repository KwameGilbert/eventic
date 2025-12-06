import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Calendar as CalendarIcon, RotateCcw, X, SlidersHorizontal } from 'lucide-react';

const FilterSidebar = ({ onFilterChange, isOpen, onClose, isMobile = false }) => {
    const defaultFilters = {
        keyword: '',
        category: '',
        location: '',
        onlineOnly: false,
        localOnly: false,
        country: 'Ghana',
        date: '',
        priceMin: 5,
        priceMax: 10000,
    };

    const [filters, setFilters] = useState(defaultFilters);

    // Prevent body scroll when mobile filter is open
    useEffect(() => {
        if (isMobile && isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobile, isOpen]);

    const handleChange = (name, value) => {
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };

    const handleReset = () => {
        setFilters(defaultFilters);
        if (onFilterChange) {
            onFilterChange(defaultFilters);
        }
    };

    const handleApplyFilters = () => {
        if (onFilterChange) {
            onFilterChange(filters);
        }
        if (onClose) {
            onClose();
        }
    };

    const dateOptions = [
        { value: 'today', label: 'Today' },
        { value: 'tomorrow', label: 'Tomorrow' },
        { value: 'this-weekend', label: 'This weekend' },
        { value: 'this-week', label: 'This week' },
        { value: 'next-week', label: 'Next week' },
        { value: 'this-month', label: 'This month' },
        { value: 'next-month', label: 'Next month' },
        { value: 'pick-date', label: 'Pick a date' },
    ];

    const filterContent = (
        <>
            {/* Mobile Header */}
            {isMobile && (
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal size={20} className="text-[var(--brand-primary)]" />
                        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close filters"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>
            )}

            {/* Reset Button */}
            <div className="mb-6">
                <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                    <RotateCcw size={18} />
                    Reset Filters
                </button>
            </div>

            {/* Keyword Search */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Keyword
                </label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={filters.keyword}
                        onChange={(e) => handleChange('keyword', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    />
                </div>
            </div>

            {/* Category Dropdown */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                </label>
                <div className="relative">
                    <select
                        value={filters.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    >
                        <option value="">Select an option</option>
                        <option value="concert-music">Concert / Music</option>
                        <option value="sport-fitness">Sport / Fitness</option>
                        <option value="theater-arts">Theater / Arts</option>
                        <option value="food-drink">Food & Drink</option>
                        <option value="conference">Conference</option>
                        <option value="cinema">Cinema</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
            </div>

            {/* Location Dropdown */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                </label>
                <div className="relative">
                    <select
                        value={filters.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    >
                        <option value="">Select an option</option>
                        <option value="accra">Accra</option>
                        <option value="kumasi">Kumasi</option>
                        <option value="takoradi">Takoradi</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
            </div>

            {/* Event Type Checkboxes */}
            <div className="mb-6 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={filters.onlineOnly}
                        onChange={(e) => handleChange('onlineOnly', e.target.checked)}
                        className="w-4 h-4 text-[var(--brand-primary)] border-gray-300 rounded focus:ring-[var(--brand-primary)]"
                    />
                    <span className="text-sm text-gray-700">Online events only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={filters.localOnly}
                        onChange={(e) => handleChange('localOnly', e.target.checked)}
                        className="w-4 h-4 text-[var(--brand-primary)] border-gray-300 rounded focus:ring-[var(--brand-primary)]"
                    />
                    <span className="text-sm text-gray-700">Local events only</span>
                </label>
            </div>

            {/* Country */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                </label>
                <div className="relative">
                    <select
                        value={filters.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                    >
                        <option value="Ghana">🇬🇭 Ghana</option>
                        <option value="Nigeria">🇳🇬 Nigeria</option>
                        <option value="Kenya">🇰🇪 Kenya</option>
                        <option value="USA">🇺🇸 United States</option>
                        <option value="UK">🇬🇧 United Kingdom</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
            </div>

            {/* Date Filter */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                </label>
                <div className="space-y-2">
                    {dateOptions.map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="date"
                                value={option.value}
                                checked={filters.date === option.value}
                                onChange={(e) => handleChange('date', e.target.value)}
                                className="w-4 h-4 text-[var(--brand-primary)] border-gray-300 focus:ring-[var(--brand-primary)]"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price range
                </label>

                {/* Dual Range Slider */}
                <div className="mb-4 px-1">
                    <div className="relative h-2">
                        {/* Track background */}
                        <div className="absolute w-full h-2 bg-gray-200 rounded-lg"></div>

                        {/* Active track (between min and max) */}
                        <div
                            className="absolute h-2 bg-[var(--brand-primary)] rounded-lg"
                            style={{
                                left: `${(filters.priceMin / 10000) * 100}%`,
                                right: `${100 - (filters.priceMax / 10000) * 100}%`
                            }}
                        ></div>

                        {/* Min range input */}
                        <input
                            type="range"
                            min="0"
                            max="10000"
                            step="5"
                            value={filters.priceMin}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (value < filters.priceMax) {
                                    handleChange('priceMin', value);
                                }
                            }}
                            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--brand-primary)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--brand-primary)] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                        />

                        {/* Max range input */}
                        <input
                            type="range"
                            min="0"
                            max="10000"
                            step="5"
                            value={filters.priceMax}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (value > filters.priceMin) {
                                    handleChange('priceMax', value);
                                }
                            }}
                            className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--brand-primary)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--brand-primary)] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                        />
                    </div>
                </div>

                {/* Number Inputs */}
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        value={filters.priceMin}
                        onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            if (value < filters.priceMax) {
                                handleChange('priceMin', value);
                            }
                        }}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] text-center"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                        type="number"
                        value={filters.priceMax}
                        onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            if (value > filters.priceMin) {
                                handleChange('priceMax', value);
                            }
                        }}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] text-center"
                    />
                </div>
            </div>

            {/* Search Button */}
            <button
                onClick={handleApplyFilters}
                className="w-full bg-[var(--brand-primary)] hover:opacity-90 text-white font-bold py-3 px-4 rounded-full transition-opacity flex items-center justify-center gap-2"
            >
                <Search size={20} />
                {isMobile ? 'APPLY FILTERS' : 'SEARCH'}
            </button>

            {/* Newsletter Subscription - Hide on mobile for cleaner UX */}
            {!isMobile && (
                <div className="mt-8 bg-[var(--brand-primary)] rounded-lg p-4 text-white">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                        <span>📧</span>Subscribe to our newsletter
                    </h3>
                    <input
                        type="email"
                        placeholder="Email address"
                        className="w-full px-3 py-2 mb-3 rounded-lg text-gray-900 focus:outline-none"
                    />
                    <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        SUBSCRIBE
                    </button>
                </div>
            )}
        </>
    );

    // Mobile drawer mode
    if (isMobile) {
        return (
            <>
                {/* Backdrop Overlay */}
                <div
                    className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    onClick={onClose}
                    aria-hidden="true"
                />

                {/* Slide-in Drawer */}
                <div
                    className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-50 transform transition-transform duration-300 ease-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <div className="h-full overflow-y-auto p-6 pb-24">
                        {filterContent}
                    </div>
                </div>
            </>
        );
    }

    // Desktop mode
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
            {filterContent}
        </div>
    );
};

export default FilterSidebar;
