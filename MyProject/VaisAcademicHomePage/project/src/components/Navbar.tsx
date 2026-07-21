import React, { useState } from 'react';
import { BookOpen, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import {logo1} from '../assets/index'
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Case Studies', href: '#case-studies' },
    { name: 'Resources', href: '#resources' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 shadow-sm transition-colors ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white/95 text-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            {/* <BookOpen className={`h-8 w-8 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} /> */}
            <img src={logo1} alt="logo" className='h-20 w-auto' />
            {/* <span className="ml-2 text-xl font-bold">Vais Academy</span> */}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-indigo-400'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {item.name}
              </a>
            ))}
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Request Demo
            </button>
            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`ml-4 transition-colors ${
                theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-indigo-400'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {item.name}
              </a>
            ))}
            <button className="w-full mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Request Demo
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
