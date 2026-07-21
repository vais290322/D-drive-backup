import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "../../assets/Home_images/home page/logo 1.png";
import { IoMdArrowDropdown } from "react-icons/io";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const subject = encodeURIComponent("Contact MNS Secure Solutions");
  const body = encodeURIComponent("Hello Team,\n\nI would like to know more.");

  return (
    <>
      <nav className="fixed top-5 left-5 right-5 font-semibold lg:left-16 lg:right-16 py-2 flex justify-between items-center px-6 lg:px-16 border border-white/50 shadow-2xl bg-white bg-opacity-20 backdrop-blur-md rounded-full z-50">
        <Link to="/">
          <img src={Logo} alt="Logo" className="h-10 lg:h-12 w-auto" />
        </Link>
        <div className="hidden md:flex space-x-6 text-blue-500">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link to="/about" className="hover:text-blue-600">
            About
          </Link>
          <Link to="/gallary" className="hover:text-blue-600">
            Gallery
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <Link
              to="/service"
              className="hover:cursor-pointer hover:text-blue-600 flex items-center gap-1"
            >
              <span>Services</span> <IoMdArrowDropdown />
            </Link>
            <div
              className={`absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-lg py-2 font-semibold hover:text-blue-600 bg-opacity-35 transition-all duration-200 ease-in-out transform ${dropdownOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-4"
                }`}
            >
              <Link
                to="/total-security"
                className="block px-4 py-2 hover:bg-blue-100"
              >
                Total Security Solution
              </Link>
              <Link
                to="/electro-mechanical"
                className="block px-4 py-2 hover:bg-blue-100"
              >
                Electro Mechanical Service
              </Link>
              <Link to="/payroll" className="block px-4 py-2 hover:bg-blue-100">
                Payroll Management Service
              </Link>
              <Link
                to="/electrical-plumbing"
                className="block px-4 py-2 hover:bg-blue-100"
              >
                Electrical & Plumbing Maintenance
              </Link>
              <Link
                to="/fire-safety"
                className="block px-4 py-2 hover:bg-blue-100"
              >
                Fire Safety Service
              </Link>
              <Link
                to="/event-management"
                className="block px-4 py-2 hover:bg-blue-100"
              >
                Event Management Service
              </Link>
              <Link
                to="/integrated-facility"
                className="block px-4 py-2 hover:bg-blue-100"
              >
                Integrated Facility Service
              </Link>
            </div>
          </div>
          <Link to="/contact" className="hover:text-blue-400">
            Contact
          </Link>
        </div>
        <div className="hidden md:flex space-x-4">
          <a href="https://info.mnssecuresolutions.com/" className="text-blue-500 hover:text-blue-600 md:pt-2 md:text-lg font-semibold">
            Log In
          </a>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
            Sign Up →
          </button>
          <a
            href={`mailto:info@mnssecuresolutions.com?subject=${subject}&body=${body}`}
             className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            Email →
          </a>
        </div>
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-black text-2xl"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed top-0 left-0 w-full h-full mt-16 bg-black bg-opacity-90 text-white flex flex-col space-y-6 py-10 items-center md:hidden z-40">
          <Link
            to="/"
            className="hover:text-blue-300 hover:font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-300 hover:font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/gallary"
            className="hover:text-blue-300 hover:font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            Gallery
          </Link>
          <div className="flex flex-col items-center">
            <button
              className="hover:text-blue-300 hover:font-semibold flex items-center  gap-1"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Link to="/service" className="flex items-center">
                <span>Services</span> <IoMdArrowDropdown />
              </Link>
            </button>
            {dropdownOpen && (
              <div className="flex flex-col space-y-2 mt-2">
                <Link to="/total-security" onClick={() => setMenuOpen(false)}>
                  Total Security
                </Link>
                <Link
                  to="/electro-mechanical"
                  onClick={() => setMenuOpen(false)}
                >
                  Electro Mechanical
                </Link>
                <Link to="/payroll" onClick={() => setMenuOpen(false)}>
                  Payroll Management
                </Link>
                <Link
                  to="/electrical-plumbing"
                  onClick={() => setMenuOpen(false)}
                >
                  Electrical & Plumbing
                </Link>
                <Link to="/fire-safety" onClick={() => setMenuOpen(false)}>
                  Fire Safety
                </Link>
                <Link to="/event-management" onClick={() => setMenuOpen(false)}>
                  Event Management
                </Link>
                <Link
                  to="/integrated-facility"
                  onClick={() => setMenuOpen(false)}
                >
                  Integrated Facility
                </Link>
              </div>
            )}
          </div>
          <Link
            to="/contact"
            className="hover:text-blue-300 hover:font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
          <button className="text-white" onClick={() => setMenuOpen(false)}>
            Log In
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
            onClick={() => setMenuOpen(false)}
          >
            Sign Up →
          </button>
           <a
            href={`mailto:info@mnssecuresolutions.com?subject=${subject}&body=${body}`}
             className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            Email →
          </a>
        </div>
      )}
    </>
  );
}

export default Header;
