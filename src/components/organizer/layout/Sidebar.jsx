import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    LayoutDashboard,
    Calendar,
    ShoppingBag,
    Users,
    DollarSign,
    Settings,
    LogOut,
    Trophy
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const navigation = [
        { name: 'Dashboard', href: '/organizer/dashboard', icon: LayoutDashboard },
        { name: 'Award Events', href: '/organizer/awards', icon: Trophy },
        { name: 'Ticketing Events', href: '/organizer/events', icon: Calendar },
        { name: 'Orders', href: '/organizer/orders', icon: ShoppingBag },
        { name: 'Attendees', href: '/organizer/attendees', icon: Users },
        { name: 'Finance', href: '/organizer/finance', icon: DollarSign },
        { name: 'Settings', href: '/organizer/settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky inset-y-0 lg:top-0 left-0 z-50 w-64 h-screen lg:h-screen bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col overflow-hidden">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/images/logo.png" alt="Eventic" className="h-8 w-auto" />
                            <span className="font-bold text-xl text-gray-900">Organizer</span>
                        </Link>
                    </div>

                    {/* User Profile */}
                    <div className="p-4 border-b border-gray-200 shrink-0">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
                                <img
                                    src={user?.avatar || 'https://ui-avatars.com/api/?name=Organizer&background=f97316&color=fff'}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Organizer'}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email || 'organizer@eventic.com'}</p>
                            </div>
                        </div>
                    </div>


                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                        ${isActive
                                            ? 'bg-(--brand-primary) text-white shadow-md shadow-(--brand-primary)/30'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    <Icon size={20} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>


                    <div className="p-4 border-t border-gray-200 shrink-0">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};



export default Sidebar;
