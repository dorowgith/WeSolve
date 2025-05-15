import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, User, Menu, Moon, Sun } from 'lucide-react';
import Button from '../ui/Button';

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileMenu }) => {
  const { currentUser, isDarkMode, toggleDarkMode } = useApp();

  return (
    <header className={`h-16 ${isDarkMode ? 'bg-gray-900 text-white border-gray-800' : 'bg-white text-gray-800 border-gray-200'} border-b px-4 flex items-center justify-between sticky top-0 z-30`}>
      {/* Left side - Mobile menu & search */}
      <div className="flex items-center">
        <button
          className="lg:hidden mr-4 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={toggleMobileMenu}
        >
          <Menu size={24} />
        </button>
        
        <div className={`relative ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-md hidden md:block`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className={`block w-full pl-10 pr-3 py-2 border-0 rounded-md focus:ring-2 focus:ring-blue-500 ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
            }`}
          />
        </div>
      </div>
      
      {/* Right side - notifications, theme toggle & user */}
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="flex items-center">
          <div className="flex items-center">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <span className="ml-2 font-medium text-sm hidden md:block">
              {currentUser.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;