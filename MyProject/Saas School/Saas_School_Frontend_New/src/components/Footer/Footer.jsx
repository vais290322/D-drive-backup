import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "light"; // In your app "light" theme seems to be dark
  
  return (
    <div 
      className={`
        text-center p-4 fixed bottom-0 w-full z-10 shadow-md
        ${isDarkTheme 
          ? 'bg-gray-800 text-gray-200 border-t border-gray-700' 
          : 'bg-white text-gray-700 border-t border-gray-200'}
      `}
    >
      <div className="container mx-auto flex flex-wrap justify-center items-center gap-1 text-sm">
        <span>Copyright</span>
        <span>&copy; 2025 - {new Date().getFullYear()}</span>
        <span>All rights reserved |</span>
        <span className="flex items-center">
          Made with <FaHeart className={`mx-1 ${isDarkTheme ? 'text-red-400' : 'text-red-500'}`} size={12} /> by
          <span className={`font-bold ml-1 ${isDarkTheme ? 'text-indigo-400' : 'text-indigo-600'}`}>
            Vaisacademy
          </span>
        </span>
      </div>
    </div>
  );
};

export default Footer;
 