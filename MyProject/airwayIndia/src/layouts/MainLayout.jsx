import React, { useState } from 'react';
import Sidebar from "../components/sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";

const MainLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <>
      <Navbar onToggleSidebar={() => setMobileSidebarOpen(true)} />

      {/* Sidebar */}
      <Sidebar isMobile={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex">
        <main className="flex-1 pt-16 md:ml-64 p-6 bg-gray-50 min-h-screen w-full">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default MainLayout;
