import React from 'react';
import { Menu, LogOut, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAdminStore from '../../context/useAdminStore';
import toastUtil from '@/shared/utils/toast';

const Topbar = () => {
  const toggleSidebar = useAdminStore((state) => state.toggleSidebar);
  const logout = useAdminStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toastUtil.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 lg:hidden text-gray-600"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">
          Overview
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="h-6 w-px bg-gray-200 mx-2"></div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1.5 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
