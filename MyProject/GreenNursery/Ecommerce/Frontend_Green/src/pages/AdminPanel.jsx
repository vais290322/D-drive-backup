import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {  FaLeaf, FaBoxOpen, FaListAlt, FaShippingFast } from "react-icons/fa";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import ROLE from "../common/role";
import Green from "../assest/logo/Green.png";
import GreenLogo3 from "../assest/logo/GreenLogo3.png";

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN) {
      navigate("/");
    }
  }, [user, navigate]);

  // Helper function to check if a link is active
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="bg-white w-full md:w-64 min-h-full shadow-md border-r border-emerald-100">
        {/* Admin Header */}
        <div className="bg-emerald-800 text-white p-4 relative">
          <div className="absolute inset-0 opacity-10" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                 backgroundSize: '20px'
               }}>
          </div>
          <div className="flex items-center relative z-10">
            <img src={GreenLogo3} alt="Green City Nursery" className="h-10 mr-3 bg-white p-1 rounded-md" />
            <div>
              <h2 className="font-bold text-lg">Admin Dashboard</h2>
              <p className="text-xs text-emerald-200">Manage your store</p>
            </div>
          </div>
        </div>
        
        {/* Admin Profile */}
        <div className="p-6 border-b border-emerald-100 flex items-center">
          <div className="mr-3">
            {user?.profilePic ? (
              <img
                src={user?.profilePic}
                className="w-12 h-12 rounded-full border-2 border-emerald-500"
                alt={user?.name}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-xl border-2 border-emerald-500 text-emerald-800">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="capitalize font-medium text-emerald-800">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4">
          <p className="text-xs font-medium text-gray-500 mb-2 pl-2">MANAGEMENT</p>
          
          <Link 
            to={"all-products"} 
            className={`flex items-center px-3 py-2 rounded-lg mb-1 transition-colors ${
              isActive("all-products") 
                ? "bg-emerald-100 text-emerald-800" 
                : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            <FaBoxOpen className={`mr-3 ${isActive("all-products") ? "text-emerald-600" : "text-gray-500"}`} />
            All Products
          </Link>
          
          <Link 
            to={"add-category"} 
            className={`flex items-center px-3 py-2 rounded-lg mb-1 transition-colors ${
              isActive("add-category") 
                ? "bg-emerald-100 text-emerald-800" 
                : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            <FaListAlt className={`mr-3 ${isActive("add-category") ? "text-emerald-600" : "text-gray-500"}`} />
            Add Product Category
          </Link>
          
          <div className="mt-6 px-3">
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
              <div className="flex items-center mb-2">
                <FaLeaf className="text-emerald-600 mr-2" />
                <h3 className="font-medium text-emerald-800">Need Help?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Contact support for assistance with your admin dashboard.
              </p>
              <a 
                href="mailto:support@greencitynursery.com" 
                className="text-sm text-emerald-600 hover:text-emerald-800 font-medium hover:underline"
              >
                Contact Support
              </a>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
