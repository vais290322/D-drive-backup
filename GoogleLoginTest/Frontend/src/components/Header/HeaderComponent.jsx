import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const HeaderComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-white text-2xl font-bold hover:opacity-80 transition-opacity">
              YourLogo
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Home
            </a>
            <a href="#about" className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              About
            </a>
            <a href="#services" className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Services
            </a>
            <a href="#contact" className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#home" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">
              Home
            </a>
            <a href="#about" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">
              About
            </a>
            <a href="#services" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">
              Services
            </a>
            <a href="#contact" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10">
              Contact
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderComponent;