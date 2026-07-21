import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router';
import {
  Bars3Icon,
  XMarkIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  KeyIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  CommandLineIcon,
  ShieldCheckIcon,
  HomeIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  NewspaperIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const HeaderComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const privateNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: ChartBarIcon },
    { name: 'Upload', path: '/upload', icon: CloudArrowUpIcon },
    { name: 'Gallery', path: '/gallery', icon: PhotoIcon },
    { name: 'API Keys', path: '/api-keys', icon: KeyIcon },
    { name: 'Docs', path: '/docs', icon: CommandLineIcon },
  ];

  if (user?.role === 'admin') {
    privateNavItems.push({ name: 'Admin', path: '/admin', icon: ShieldCheckIcon });
  }

  const publicNavItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'About', path: '/about', icon: InformationCircleIcon },
    { name: 'Pricing', path: '/pricing', icon: CurrencyDollarIcon },
    { name: 'Blog', path: '/blog', icon: NewspaperIcon },
    { name: 'Contact', path: '/contact', icon: EnvelopeIcon },
    { name: 'Docs', path: '/docs', icon: CommandLineIcon },
  ];

  const activeNavItems = isAuthenticated ? privateNavItems : publicNavItems;

  return (
    <header className="fixed w-full top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <CloudArrowUpIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                VaisBucket
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {activeNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-900/50 dark:text-indigo-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}

            <div className="h-6 w-full max-w-[1px] bg-gray-200 dark:bg-gray-700 mx-4"></div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:bg-red-900/20 rounded-lg transition-all cursor-pointer"
                  title="Logout"
                >
                  <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium">
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition-all hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[600px] pb-4' : 'max-h-0'
            }`}
        >
          <div className="space-y-1 pt-2">
            {activeNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors mt-2"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              <div className="space-y-2 p-2 mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block text-center py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderComponent;
