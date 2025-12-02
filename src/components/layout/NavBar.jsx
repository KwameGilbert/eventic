import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, Calendar, Compass, MapPin, HelpCircle, FileText, Ticket, Plus, ChevronDown } from 'lucide-react';

const NavBar = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <>
            {/* Top Bar - Sticky */}
            <div className="sticky top-0 z-1000 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center justify-center">
                                <img src="/images/logo.png" alt="Eventic Logo" className="w-full h-full object-contain" />
                            </div>
                        </Link>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-xl">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for events"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 pr-10 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <Search size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <Link to="/signin" className="text-gray-700 hover:text-gray-900 font-medium">
                                Sign in
                            </Link>
                            <Link to="/signup" className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-1">
                                Sign up
                                <ChevronDown size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="bg-white shadow-sm">
                {/* Main Navigation - Scrollable */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-1">
                        <Link
                            to="/"
                            className="flex items-center gap-2 px-4 py-3 bg-[var(--brand-primary)] text-white font-medium hover:opacity-90 transition-opacity"
                        >
                            <Home size={18} />
                            <span>Home</span>
                        </Link>

                        <Link
                            to="/events"
                            className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            <Calendar size={18} />
                            <span>Browse Events</span>
                        </Link>

                        <div className="relative group">
                            <button className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                                <Compass size={18} />
                                <span>Explore</span>
                                <ChevronDown size={16} />
                            </button>
                            {/* TODO: Dropdown menu to be added here later */}
                        </div>

                        <Link
                            to="/venues"
                            className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            <MapPin size={18} />
                            <span>Venues</span>
                        </Link>

                        <Link
                            to="/how-it-works"
                            className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            <HelpCircle size={18} />
                            <span>How it works?</span>
                        </Link>

                        <Link
                            to="/blog"
                            className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            <FileText size={18} />
                            <span>Blog</span>
                        </Link>

                        <Link
                            to="/my-tickets"
                            className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            <Ticket size={18} />
                            <span>My tickets</span>
                        </Link>

                        <Link
                            to="/add-event"
                            className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            <Plus size={18} />
                            <span>Add my event</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default NavBar;
