import React from 'react';
import { Menu, Bell } from 'lucide-react';

const Header = ({ setIsSidebarOpen }) => {
    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
                <Menu size={24} />
            </button>

            <div className="flex items-center gap-4 ml-auto">
                <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
