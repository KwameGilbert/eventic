import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, Calendar, Compass, MapPin, HelpCircle, FileText, Ticket, Plus, ChevronDown, Menu, X, User, UserPlus } from 'lucide-react';

const NavBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

                        {/* Desktop Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-xl">
                            <div className="relative w-full">
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

                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                            <Link to="/signin" className="text-gray-700 hover:text-gray-900 font-medium">
                                Sign in
                            </Link>
                            <div className="relative group">
                                <button className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-1 cursor-pointer">
                                    Sign up
                                    <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="py-2">
                                        <Link
                                            to="/signup/attendee"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Ticket size={16} className="text-blue-600" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-sm">Sign up as Attendee</div>
                                                <div className="text-xs text-gray-500">Discover and book events</div>
                                            </div>
                                        </Link>

                                        <Link
                                            to="/signup/organizer"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Calendar size={16} className="text-[var(--brand-primary)]" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-sm">Sign up as Organizer</div>
                                                <div className="text-xs text-gray-500">Create and manage events</div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Auth Icons & Menu Toggle */}
                        <div className="flex md:hidden items-center gap-2">
                            <Link to="/signin" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                                <User size={20} className="text-white" />
                            </Link>

                            {/* Mobile Sign Up Dropdown */}
                            <div className="relative group">
                                <button className="w-10 h-10 bg-[var(--brand-primary)] rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                                    <UserPlus size={20} className="text-white" />
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="py-2">
                                        <Link
                                            to="/signup/attendee"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Ticket size={16} className="text-blue-600" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-sm">Sign up as Attendee</div>
                                                <div className="text-xs text-gray-500">Discover and book events</div>
                                            </div>
                                        </Link>

                                        <Link
                                            to="/signup/organizer"
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Calendar size={16} className="text-[var(--brand-primary)]" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-sm">Sign up as Organizer</div>
                                                <div className="text-xs text-gray-500">Create and manage events</div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-900"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    <div className="md:hidden mt-3">
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
                </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block bg-white shadow-sm">
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

            {/* Mobile Menu Drawer */}
            <div
                className={`lg:hidden fixed inset-0 bg-black/50 z-[999] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <div
                    className={`absolute top-0 left-0 right-0 bg-white shadow-xl transform transition-transform duration-300 max-h-[80vh] overflow-hidden ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Mobile Menu Content */}
                    <div className="flex flex-col h-full overflow-y-auto">
                        <div className="p-6 space-y-2">
                            <Link
                                to="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 bg-[var(--brand-primary)] text-white font-medium rounded-lg"
                            >
                                <Home size={20} />
                                <span>Home</span>
                            </Link>

                            <Link
                                to="/events"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                            >
                                <Calendar size={20} />
                                <span>Browse Events</span>
                            </Link>

                            <div className="px-4 py-3 text-gray-700 font-medium flex items-center gap-3">
                                <Compass size={20} />
                                <span>Explore</span>
                                <ChevronDown size={16} className="ml-auto" />
                            </div>

                            <Link
                                to="/venues"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                            >
                                <MapPin size={20} />
                                <span>Venues</span>
                            </Link>

                            <Link
                                to="/how-it-works"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                            >
                                <HelpCircle size={20} />
                                <span>How it works?</span>
                            </Link>

                            <Link
                                to="/blog"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                            >
                                <FileText size={20} />
                                <span>Blog</span>
                            </Link>

                            <Link
                                to="/my-tickets"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                            >
                                <Ticket size={20} />
                                <span>My tickets</span>
                            </Link>

                            <Link
                                to="/add-event"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                            >
                                <Plus size={20} />
                                <span>Add my event</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavBar;
