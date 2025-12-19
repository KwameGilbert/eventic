import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const Header = ({ setIsSidebarOpen }) => {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 shrink-0">
            <div className="flex items-center justify-between w-full">
                {/* Left Side - Menu Button */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Menu size={24} className="text-gray-700" />
                    </button>

                    {/* Search - Hidden on small screens */}
                    <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 w-64">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none focus:outline-none text-sm w-full"
                        />
                    </div>
                </div>

                {/* Right Side - Notifications & Profile */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Bell size={20} className="text-gray-700" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User Name - Hidden on small screens */}
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium text-gray-900">{user?.name || 'Administrator'}</p>
                        <p className="text-xs text-gray-500">Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
