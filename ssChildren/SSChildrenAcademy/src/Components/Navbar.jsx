import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/SS Children Academy.png";
import { IoMenuSharp, IoClose } from "react-icons/io5";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/abouts" },
  { name: "Academics", path: "/academics" },
  { name: "Activities & Events", path: "/activities" },
  { name: "Admissions", path: "/admissions" },
  { name: "Teachers", path: "/teachers" },
  { name: "Testimonials", path: "/testimonials" },
];

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 hidden md:block bg-white z-50 h-20"
        style={{ fontFamily: "'Ubuntu', sans-serif" }}
      >
        <div className="px-32 flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <Link to="/">
              <img src={Logo} alt="Logo" className="h-[28px] w-auto" />
            </Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex flex-1 items-center justify-center text-[18px]" style={{ fontFamily: "Ubuntu" }}>
            <ul className="flex space-x-8">
              {navLinks.map((link) => (
                <li key={link.name} className="relative">
                  <Link
                    to={link.path}
                    className={`pb-1 transition-colors ${
                      location.pathname === link.path
                        ? "text-[#044B23] font-semibold"
                        : "text-[#1C1C1C] hover:text-[#044B23]"
                    }`}
                  >
                    {link.name}
                    {location.pathname === link.path && (
                      <span className="absolute left-1/2 bottom-[35px] w-[5px] h-[5px] bg-[#044B23] rounded-full block transform -translate-x-1/2"></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Started Button */}
          <div className="flex">
            <Link
              to="/get-started"
              className="bg-[#1C1C1C] text-white px-7 py-3 rounded-full flex items-center gap-2 hover:bg-[#044B23] transition font-medium text-base"
            >
              Get Started
              <span className="ml-2">&#8594;</span>
            </Link>
          </div>
        </div>
        <div className="h-[3px] bg-gradient-to-r from-[#FFFFFF] via-[#38B000] to-[#FFFFFF] w-full"></div>
      </nav>
      {/* For Mobile Responsive */}
      <nav className=" fixed inset-0 top-0 z-50 bg-white md:hidden h-[50px] w-[370px]">
        <div className="flex items-center justify-center gap-16 py-3">
          <Link to="/">
            <img src={Logo} alt="Logo" className="h-[16px] w-[138px]" />
          </Link>
          <div className="flex items-center justify-center ">
          <Link
              to="/get-started"
              className="bg-[#044C23] text-white text-[10px] px-3 py-1 rounded-full flex items-center gap-2 hover:bg-[#044B23] transition"
            >
              Get Started
              <span>&#8594;</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-green-700 absolute top-3.2 right-2 transition-all duration-300 ease-in-out"
            >
              {isOpen ? (
                <IoClose 
                  size={24} 
                  className="transform rotate-90 transition-all duration-300 ease-in-out" 
                />
              ) : (
                <IoMenuSharp 
                  size={24} 
                  className="transform rotate-0 transition-all duration-300 ease-in-out" 
                />
              )}
            </button>
            
          </div>
          <div 
            className={`absolute top-[50px] left-0 right-0 bg-white/80 backdrop-blur-md shadow-lg transition-all duration-300 ease-in-out transform ${
              isOpen 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-full pointer-events-none'
            }`}
          >
          <ul className="py-4">
            {navLinks.map((link) => (
              <li key={link.name} className="px-6">
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 ${
                    location.pathname === link.path
                      ? "text-[#044B23] font-semibold"
                      : "text-[#1C1C1C] hover:text-[#044B23]"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        </div>
        <div className="h-[3px] bg-gradient-to-r from-[#FFFFFF] via-[#38B000] to-[#FFFFFF] w-full"></div>
      </nav>
    </>
  );
};

export default Navbar;
