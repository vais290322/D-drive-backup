import React, { useContext, useState } from 'react';
import { GrSearch } from "react-icons/gr";
import {  FaShoppingCart, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common/index';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import logodk from "../assest/logo/logodk.png";

const Header = () => {
  const user = useSelector(state => state?.user?.user);
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
      credentials: 'include'
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
  }

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  }

  const toggleMobileSearch = () => {
    setMobileSearch(prevState => !prevState);
  }

  return (
    <>
      <header className='h-16 shadow-md bg-white fixed w-full z-40'>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <div>
            <Link to={"/"}>
              <img src={logodk} alt="logo" className='w-32 h-12' />
            </Link>
          </div>

          <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2'>
            <input type='text' placeholder='Search product here...' className='w-full outline-none' onChange={handleSearch} value={search} />
            <div className='text-lg min-w-[50px] h-8 bg-red-600 cursor-pointer flex items-center justify-center rounded-r-full text-white'>
              <GrSearch />
            </div>
          </div>

          <div className='flex items-center gap-7'>
            <div className='relative flex justify-center'>
              {user?._id && (
                <div className='text-3xl cursor-pointer relative flex justify-center' onClick={() => setMenuDisplay(prev => !prev)}>
                  {user?.profilePic ? (
                    <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
                  ) : (
                    <div className='w-8 h-8 rounded-full bg-red-200 flex items-center justify-center font-bold text-2xl border-2 shadow-sm border-blue-500'>
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}

              {menuDisplay && (
                <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded'>
                  <nav>
                    {user?.role === ROLE.ADMIN && (
                      <Link to={"/admin-panel/all-products"} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={() => setMenuDisplay(prev => !prev)}>Admin Panel</Link>
                    )}
                    {user?.role === ROLE.GENERAL && (
                      <Link to={"/my-orders"} className='whitespace-nowrap md:block hover:bg-slate-100 p-2' onClick={() => setMenuDisplay(prev => !prev)}>My Orders</Link>
                    )}
                  </nav>
                </div>
              )}
            </div>

            {user?._id && (
              <Link to={"/cart"} className='text-2xl relative'>
                <span><FaShoppingCart /></span>
                <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                  <p className='text-sm'>{context?.cartProductCount}</p>
                </div>
              </Link>
            )}

            <div>
              {user?._id ? (
                <button onClick={handleLogout} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Logout</button>
              ) : (
                <Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Login</Link>
              )}
            </div>

            {/* Mobile Search Icon */}
            <div className='lg:hidden text-xl cursor-pointer' onClick={toggleMobileSearch}>
              {mobileSearch ? <FaTimes /> : <GrSearch />}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {mobileSearch && (
        <div className='lg:hidden bg-white fixed w-full top-16 z-30 shadow-md'>
          <div className='container mx-auto flex items-center px-4 py-2'>
            <input type='text' placeholder='Search product here...' className='w-full outline-none border p-1 rounded-l-full' onChange={handleSearch} value={search} />
            <div className='text-lg min-w-[50px] h-8 bg-red-600 cursor-pointer flex items-center justify-center rounded-r-full text-white'>
              <GrSearch />
            </div>
          </div>
        </div>
      )}

      {/* <div className='lg:hidden pt-16'></div> */}
    </>
  );
}

export default Header;
