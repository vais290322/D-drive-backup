import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import mnsLogo from "../../assets/mns.jpg";
import ganita from "../../assets/ganita.png"
import axios from "axios";
import { setToken, setUser, setUserDetails } from "../../utils/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { backendDomainA } from "../../common";
import toast from "react-hot-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state?.auth?.userDetails) || null;
  // const token = useSelector((state) => state?.auth?.token) || null;
  const role = useSelector(state=>state.auth?.user);
  // console.log("userDetails", role);
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown]);
  // Handle profile button click
  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };
  // Handle logout button click
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${backendDomainA}/api/v1/auth/logout`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      
      if (response) {
        toast.success(response?.data?.message || "Logout successful");
        navigate("/login");
        dispatch(setUserDetails(null));
        // dispatch(setToken(null));
        dispatch(setUser(null))
      } 
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  return (
    <header 
      className={` ${
        isScrolled 
          ? "bg-slate-800/95 backdrop-blur-sm shadow-lg py-3" 
          : "bg-slate-800 py-5"
      } text-white px-4 md:px-8 flex items-center justify-between border-b border-teal-800`}
    >
      {/* Logo and Brand */}
      <div className="flex items-center space-x-3">
        <img 
          src={ganita} 
          alt=" Logo" 
          className="h-10 w-40    shadow-md"
        />
        <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent hidden sm:block">
          Tamannaah Dresses Platform
        </h1>
      </div>

      {/* Desktop Navigation */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:block relative profile-dropdown-container">
          <button
            onClick={handleProfileClick}
            className="flex items-center cursor-pointer space-x-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors border border-slate-600"
          >
            <FaUser className="text-teal-400" />
            <span>Profile</span>
          </button>
          
          {/* Profile Dropdown */}
          {showProfileDropdown && userDetails && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-700 rounded-lg shadow-lg overflow-hidden z-50 border border-slate-600">
              <div className="p-4 border-b border-slate-600">
                <div className="flex items-center space-x-3">
                  <FaUserCircle className="text-teal-400 text-4xl" />
                  <div>
                    <h3 className="font-medium text-white">User name : {userDetails.username || "User"}</h3>
                    <p className="text-sm text-gray-300">Role: {userDetails.role || "User"}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-3">
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm text-gray-200 break-all">{userDetails.email || "No email available"}</p>
                </div>
                <div className="pt-2 border-t border-slate-600">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left text-sm cursor-pointer text-red-400 hover:text-red-300 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={handleLogout}
          className="flex cursor-pointer items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 transition-colors shadow-md"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
