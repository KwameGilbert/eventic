import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, Calendar, Compass, Ticket, Plus, ChevronDown, Menu, X, User, UserPlus, ShoppingCart, LogOut, Settings, Lock, ShoppingBag, Trophy, LayoutDashboard, Shield } from 'lucide-react';
import { categories } from '../../pages/Categories';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const NavBar = () => {
    const { user, isAuthenticated, logout, isAdmin } = useAuth();
    const { getCartCount } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSignUpOpen, setIsMobileSignUpOpen] = useState(false);

    const cartCount = getCartCount();

    // Navigation items configuration - computed based on user role
    const getAddEventPath = () => {
        if (!isAuthenticated()) return '/signup/organizer';
        if (user?.role === 'organizer' || user?.role === 'admin' || user?.role === 'super_admin') return '/organizer/events/create';
        return '/signup/organizer';
    };

    const navItems = [
        { path: '/', label: 'Home', icon: Home, isActive: true },
        { path: '/awards', label: 'Award Events', icon: Trophy },
        { path: '/events', label: 'Ticketing Events', icon: Calendar },
        { path: '/categories', label: 'Event Categories', icon: Compass, hasDropdown: true },
        // { path: '/venues', label: 'Venues', icon: MapPin },
        // { path: '/how-it-works', label: 'How it works?', icon: HelpCircle },
        // { path: '/blog', label: 'Blog', icon: FileText },
        { path: '/my-tickets', label: 'My tickets', icon: Ticket },
        { path: getAddEventPath(), label: 'Create Event', icon: Plus },
    ];

    const userMenuItems = [
        { path: '/my-tickets', label: 'My Tickets', icon: Ticket },
        { path: '/my-orders', label: 'My Orders', icon: ShoppingBag },
        { path: '/cart', label: `Cart (${cartCount})`, icon: ShoppingCart },
        // { path: '/favorites', label: 'My Favorites', icon: Heart },
        // { path: '/reviews', label: 'My Reviews', icon: Star },
        // { path: '/following', label: 'Following', icon: Users },
        { path: '/settings', label: 'Settings', icon: Settings },
        { path: '/change-password', label: 'Change Password', icon: Lock },
    ];

    return (
        <>
            {/* Top Bar */}
            <div className="sticky top-0 z-50">
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <div className="flex items-center justify-between gap-4">
                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
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
                                        className="w-full px-4 py-2 pr-10 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-(--brand-primary) focus:border-transparent transition-all"
                                    />
                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                        <Search size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Desktop Auth/Cart Section - only show on large screens */}
                            <div className="hidden lg:flex items-center gap-4 shrink-0">
                                {isAuthenticated() ? (
                                    <>
                                        {/* Cart Icon with Badge */}
                                        <Link
                                            to="/cart"
                                            className="relative text-gray-700 hover:text-gray-900 transition-colors"
                                        >
                                            <ShoppingCart size={24} />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-(--brand-primary) text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>

                                        {/* User Menu */}
                                        <div className="relative group">
                                            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
                                                <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                                                    <img
                                                        src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=f97316&color=fff'}
                                                        alt="User"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <span className="font-medium">{user?.name || 'User'}</span>
                                                <ChevronDown size={16} className="transition-transform duration-200 group-hover:rotate-180" />
                                            </button>

                                            {/* User Dropdown */}
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform scale-95 group-hover:scale-100">
                                                <div className="py-2">
                                                    {/* Dashboard Link for Admin/Organizer/SuperAdmin */}
                                                    {(isAdmin() || user?.role === 'organizer') && (
                                                        <>
                                                            <Link
                                                                to={isAdmin() ? '/admin/dashboard' : '/organizer/dashboard'}
                                                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                                            >
                                                                {isAdmin() ? <Shield size={16} /> : <LayoutDashboard size={16} />}
                                                                <span className="text-sm font-semibold">Dashboard</span>
                                                            </Link>
                                                            <hr className="my-2" />
                                                        </>
                                                    )}
                                                    {userMenuItems.map((item) => (
                                                        <Link
                                                            key={item.path}
                                                            to={item.path}
                                                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <item.icon size={16} />
                                                            <span className="text-sm">{item.label}</span>
                                                        </Link>
                                                    ))}
                                                    <hr className="my-2" />
                                                    <button
                                                        onClick={logout}
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                                    >
                                                        <LogOut size={16} />
                                                        <span className="text-sm">Sign Out</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/signin" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                                            Sign in
                                        </Link>
                                        <div className="relative group">
                                            <button className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-1 cursor-pointer transition-colors">
                                                Sign up
                                                <ChevronDown size={16} className="transition-transform duration-200 group-hover:rotate-180" />
                                            </button>

                                            {/* Dropdown Menu */}
                                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform scale-95 group-hover:scale-100">
                                                <div className="py-2">
                                                    <Link
                                                        to="/signup/attendee"
                                                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
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
                                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                                                            <Calendar size={16} className="text-(--brand-primary)" />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="font-semibold text-sm">Sign up as Organizer</div>
                                                            <div className="text-xs text-gray-500">Create and manage events</div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Mobile/Tablet Auth Icons & Menu Toggle */}
                            <div className="flex lg:hidden items-center gap-2">
                                {isAuthenticated() ? (
                                    <>
                                        {/* Cart Icon with Badge */}
                                        <Link
                                            to="/cart"
                                            className="relative w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all"
                                        >
                                            <ShoppingCart size={20} className="text-gray-700" />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-1 -right-1 bg-(--brand-primary) text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>

                                        {/* User Avatar Dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsMobileSignUpOpen(!isMobileSignUpOpen)}
                                                className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden hover:opacity-80 transition-all"
                                            >
                                                <img
                                                    src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=f97316&color=fff'}
                                                    alt="User"
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>

                                            {/* User Dropdown Menu */}
                                            {isMobileSignUpOpen && (
                                                <>
                                                    {/* Backdrop */}
                                                    <div
                                                        className="fixed inset-0 z-40 animate-in fade-in duration-200"
                                                        onClick={() => setIsMobileSignUpOpen(false)}
                                                    />

                                                    {/* Dropdown */}
                                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top duration-200">
                                                        <div className="py-2">
                                                            <div className="px-4 py-3 border-b border-gray-200">
                                                                <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                                                                <p className="text-xs text-gray-500">{user?.email || ''}</p>
                                                            </div>
                                                            {/* Dashboard Link for Admin/Organizer/SuperAdmin */}
                                                            {(isAdmin() || user?.role === 'organizer') && (
                                                                <Link
                                                                    to={isAdmin() ? '/admin/dashboard' : '/organizer/dashboard'}
                                                                    onClick={() => setIsMobileSignUpOpen(false)}
                                                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-200"
                                                                >
                                                                    {isAdmin() ? <Shield size={18} /> : <LayoutDashboard size={18} />}
                                                                    <span className="text-sm font-semibold">Dashboard</span>
                                                                </Link>
                                                            )}
                                                            {userMenuItems.map((item) => (
                                                                <Link
                                                                    key={item.path}
                                                                    to={item.path}
                                                                    onClick={() => setIsMobileSignUpOpen(false)}
                                                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                                                >
                                                                    <item.icon size={18} />
                                                                    <span className="text-sm font-medium">{item.label}</span>
                                                                </Link>
                                                            ))}
                                                            <hr className="my-2" />
                                                            <button
                                                                onClick={() => {
                                                                    setIsMobileSignUpOpen(false);
                                                                    logout();
                                                                }}
                                                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                                                            >
                                                                <LogOut size={18} />
                                                                <span className="text-sm font-medium">Sign Out</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/signin" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all hover:scale-105 active:scale-95">
                                            <User size={20} className="text-white" />
                                        </Link>

                                        {/* Mobile Sign Up Dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsMobileSignUpOpen(!isMobileSignUpOpen)}
                                                className="w-10 h-10 bg-(--brand-primary) rounded-full flex items-center justify-center hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                                            >
                                                <UserPlus size={20} className="text-white" />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {isMobileSignUpOpen && (
                                                <>
                                                    {/* Backdrop */}
                                                    <div
                                                        className="fixed inset-0 z-40 animate-in fade-in duration-200"
                                                        onClick={() => setIsMobileSignUpOpen(false)}
                                                    />

                                                    {/* Dropdown */}
                                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top duration-200">
                                                        <div className="py-2">
                                                            <Link
                                                                to="/signup/attendee"
                                                                onClick={() => setIsMobileSignUpOpen(false)}
                                                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-300"
                                                            >
                                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                                                    <Ticket size={16} className="text-blue-600" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="font-semibold text-sm">Sign up as Attendee</div>
                                                                    <div className="text-xs text-gray-500">Discover and book events</div>
                                                                </div>
                                                            </Link>
                                                            <Link
                                                                to="/signup/organizer"
                                                                onClick={() => setIsMobileSignUpOpen(false)}
                                                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                                            >
                                                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                                                                    <Calendar size={16} className="text-(--brand-primary)" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="font-semibold text-sm">Sign up as Organizer</div>
                                                                    <div className="text-xs text-gray-500">Create and manage events</div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}

                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all hover:scale-105 active:scale-95"
                                >
                                    <div className={`transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : 'rotate-0'}`}>
                                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                    </div>
                                </button>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="lg:hidden fixed inset-0 bg-black/50 -z-10 animate-in fade-in duration-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Mobile Menu */}
                        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg">
                            <div className="overflow-y-auto max-h-[calc(100vh-180px)] animate-in slide-in-from-top duration-300">
                                <div className="p-6 space-y-2">
                                    {navItems.map((item, index) => {
                                        const Icon = item.icon;

                                        if (item.hasDropdown) {
                                            return (
                                                <div
                                                    key={item.path}
                                                    className="px-4 py-3 text-gray-700 font-medium flex items-center gap-3 animate-in slide-in-from-left duration-300"
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    <Icon size={20} />
                                                    <span>{item.label}</span>
                                                    <ChevronDown size={16} className="ml-auto" />
                                                </div>
                                            );
                                        }

                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 animate-in slide-in-from-left ${item.isActive
                                                    ? 'bg-(--brand-primary) text-white shadow-md'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                style={{ animationDelay: `${index * 50}ms`, animationDuration: '300ms' }}
                                            >
                                                <Icon size={20} />
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Desktop Navigation - only on large screens */}
            <nav className="hidden lg:block bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            if (item.hasDropdown) {
                                return (
                                    <div key={item.path} className="relative group">
                                        <button className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium transition-all hover:scale-105">
                                            <Icon size={18} />
                                            <span>{item.label}</span>
                                            <ChevronDown size={16} className="transition-transform duration-200 group-hover:rotate-180" />
                                        </button>

                                        {/* Categories Dropdown */}
                                        <div className="absolute left-0 top-full mt-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform scale-95 group-hover:scale-100">
                                            <div className="py-2">
                                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                                                    Browse by Category
                                                </div>
                                                {categories.map((category) => {
                                                    const IconComponent = category.icon;
                                                    return (
                                                        <Link
                                                            key={category.id}
                                                            to={`/events?category=${category.slug}`}
                                                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <IconComponent size={18} className={category.textColor} />
                                                            <span className="text-sm font-medium">{category.name}</span>
                                                        </Link>
                                                    );
                                                })}
                                                <div className="border-t border-gray-100 mt-2 pt-2">
                                                    <Link
                                                        to="/categories"
                                                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-(--brand-primary) hover:bg-gray-50 transition-colors text-sm font-semibold"
                                                    >
                                                        View All Categories →
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-all hover:scale-105 ${item.isActive
                                        ? 'bg-(--brand-primary) text-white hover:opacity-90'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>


        </>
    );
};

export default NavBar;
