import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '@/admin/components/layout/AdminSidebar';
import AdminHeader from '@/admin/components/layout/AdminHeader';
import useDataStore from '@/store/useDataStore';
import { cn } from '@/admin/utils/cn';
import { useAuthStore } from '@/store/useAuthStore';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);


  const {user, isAuthenticated} = useAuthStore();

  // console.log("user from admin layout",user, isAuthenticated);

// const isAuthenticated =true;
// const user = {
//   role: 'admin'
// };

  const navigate = useNavigate();
  // console.log(isAuthenticated, user);

  // Basic route protection
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-teal-50/30 relative overflow-hidden max-w-full">
      {/* Decorative gradient blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      
      {/* Mobile Sidebar Overlay */}
      <div 
          className={cn(
            "fixed inset-0 z-[90] bg-slate-950/60 backdrop-blur-sm lg:hidden transition-all duration-300",
            sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setSidebarOpen(false)}
      />

      {/* Desktop Sidebar - In Flow */}
      <div className="hidden lg:block shrink-0 relative z-50">
        <AdminSidebar
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

       {/* Mobile Sidebar - Fixed Overlay */}
       {sidebarOpen && (
          <AdminSidebar 
             isMobile={true} 
             onCloseMobile={() => setSidebarOpen(false)}
          />
       )}

      {/* Main Content Area - Flexible */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10 transition-all duration-300 max-w-full">
        <AdminHeader onMobileMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto scroll-smooth w-full relative scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="min-h-full w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
