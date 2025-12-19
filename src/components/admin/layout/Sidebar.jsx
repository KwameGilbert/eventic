import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Trophy,
    Users,
    DollarSign,
    Settings,
    LogOut,
    Shield,
    Activity,
    BarChart3
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Events', href: '/admin/events', icon: Calendar },
        { name: 'Awards', href: '/admin/awards', icon: Trophy },
        { name: 'Finance', href: '/admin/finance', icon: DollarSign },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Activity Logs', href: '/admin/activity', icon: Activity },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
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
                            <Shield size={32} className="text-red-600" />
                            <span className="font-bold text-xl text-gray-900">Admin</span>
                        </Link>
                    </div>

                    {/* User Profile */}
                    <div className="p-4 border-b border-gray-200 shrink-0">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shrink-0">
                                <Shield size={20} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Administrator'}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@eventic.com'}</p>
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
                                            ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
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
