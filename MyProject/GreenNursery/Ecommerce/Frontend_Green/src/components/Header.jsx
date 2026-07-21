import React, { useContext, useEffect, useState } from "react";
import { GrSearch } from "react-icons/gr";
import { FaShoppingCart, FaTimes, FaLeaf, FaUserCircle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common/index";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import Context from "../context";
import Green from "../assest/logo/Green.png";
import GreenLogo3 from "../assest/logo/GreenLogo3.png";

const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/");
    }

    if (data.error) {
      toast.error(data.message);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  const toggleMobileSearch = () => {
    setMobileSearch((prevState) => !prevState);
  };

  return (
    <>
      <header className="h-16 shadow-md bg-white fixed w-full z-40">
        <div className="h-full container mx-auto flex items-center px-4 justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={"/"} className="flex items-center">
              <img src={GreenLogo3} alt="logo" className="h-16 w-16 mr-2" />
              <span className="font-bold text-emerald-800 text-lg hidden sm:block">Green City</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-emerald-800 hover:text-emerald-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/product-category" className="text-emerald-800 hover:text-emerald-600 font-medium transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-emerald-800 hover:text-emerald-600 font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-emerald-800 hover:text-emerald-600 font-medium transition-colors">
              Contact
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center w-full max-w-sm mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search plants..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                onChange={handleSearch}
                value={search}
              />
              <button className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-emerald-600">
                <GrSearch className="text-lg" />
              </button>
            </div>
          </div>

          {/* Right Side Elements */}
          <div className="flex items-center gap-4">
            {/* User Menu */}
            <div className="relative">
              {user?._id ? (
                <div
                  className="cursor-pointer relative flex items-center"
                  onClick={() => setMenuDisplay((prev) => !prev)}
                >
                  {user?.profilePic ? (
                    <img
                      src={user?.profilePic}
                      className="w-9 h-9 rounded-full border-2 border-emerald-500"
                      alt={user?.name}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-xl border-2 border-emerald-500 text-emerald-800">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={"/login"}
                  className="flex items-center gap-1 px-4 py-2 rounded-full text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <FaUserCircle />
                  <span>Admin Login</span>
                </Link>
              )}

              {menuDisplay && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-emerald-100">
                  <div className="px-4 py-2 border-b border-emerald-100">
                    <p className="font-medium text-emerald-800">{user?.name}</p>
                    {/* <p className="text-sm text-gray-500">{user?.email}</p> */}
                  </div>
                  
                  <nav className="mt-2">
                    {user?.role === ROLE.ADMIN && (
                      <Link
                        to={"/admin-panel/all-products"}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                        onClick={() => setMenuDisplay(false)}
                      >
                        <FaLeaf className="mr-2 text-emerald-600" />
                        Admin Panel
                      </Link>
                    )}
                    {user?.role === ROLE.GENERAL && (
                      <Link
                        to={"/my-orders"}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                        onClick={() => setMenuDisplay(false)}
                      >
                        <FaLeaf className="mr-2 text-emerald-600" />
                        My Orders
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuDisplay(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <FaLeaf className="mr-2 text-emerald-600" />
                      Logout
                    </button>
                  </nav>
                </div>
              )}
            </div>

            {/* Mobile Search Icon */}
            <div
              className="lg:hidden text-xl cursor-pointer text-emerald-700 p-2 hover:bg-emerald-50 rounded-full"
              onClick={toggleMobileSearch}
            >
              {mobileSearch ? <FaTimes /> : <GrSearch />}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {mobileSearch && (
        <div className="lg:hidden bg-white fixed w-full top-16 z-30 shadow-md">
          <div className="container mx-auto flex items-center px-4 py-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search plants..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                onChange={handleSearch}
                value={search}
              />
              <button className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-emerald-600">
                <GrSearch />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40">
        <div className="flex justify-around items-center h-14">
          <Link to="/" className="flex flex-col items-center justify-center text-emerald-800 hover:text-emerald-600">
            <FaLeaf />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/product-category" className="flex flex-col items-center justify-center text-emerald-800 hover:text-emerald-600">
            <FaLeaf />
            <span className="text-xs mt-1">Products</span>
          </Link>
          <Link to="/about" className="flex flex-col items-center justify-center text-emerald-800 hover:text-emerald-600">
            <FaLeaf />
            <span className="text-xs mt-1">About</span>
          </Link>
          <Link to="/contact" className="flex flex-col items-center justify-center text-emerald-800 hover:text-emerald-600">
            <FaLeaf />
            <span className="text-xs mt-1">Contact</span>
          </Link>
        </div>
      </div>

      
    </>
  );
};

export default Header;

