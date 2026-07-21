import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Bell, User } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('userData'));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    toast.success("Logged out successfully");
    setShowProfileDropdown(false);
    window.location.replace('/login');
  };

  return (
    <header className="w-full h-16 bg-red-700 flex items-center justify-between px-6 shadow-md fixed top-0 left-0 z-50 text-white">
      <div className="font-bold text-lg tracking-wide flex items-center gap-4 px-8">
        <img src="/air logo 1.png" alt="Logo" className="w-24 h-12" />
        {/* Mobile Hamburger */}
    
        <span className="text-2xl hidden md:inline px-4">AIRWAY INDIA</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Profile Dropdown */}
    
          {/* <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-md  transition-colors text-sm"
            title="Profile"
          >
            <div className="w-8 h-8 rounded-full bg-white text-red-700 flex items-center justify-center font-bold">
              {user?.username?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </button> */}
 {/* <Bell /> */}
  <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-md  transition-colors text-sm"
            title="Profile"
          >
            <div className="px-3 py-2 rounded-full bg-[#DF1321] text-white flex items-center justify-center ">
              {/* {user?.username?.charAt(0)?.toUpperCase() || 'A'} */}
               <User size={18} />&nbsp;Admin
                 
            </div>
            <button
                  className="flex items-center gap-3 w-full px-4 py-2 text-left text-white  transition-colors"
                  onClick={handleLogout}
                >
                  <FiLogOut size={20} />

                </button>
          </button>
          {/* Profile Dropdown Menu 
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
             
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-lg">
                    {user?.username?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user?.username || 'Admin'}</p>
                    <p className="text-sm text-gray-500">{user?.role || 'Staff'}</p>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <button
                  className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <FiUser size={16} />
                  <span>View Profile</span>
                </button>
                
                <button
                  className="flex items-center gap-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                  onClick={handleLogout}
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}*/}

      </div>
      
      {/* <button
        className="md:hidden block text-white text-2xl"
        onClick={onToggleSidebar}
      >
        <FiMenu />
      </button> */}
    </header>
  );
};

export default Navbar;
