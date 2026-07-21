import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import logo from "../assets/home/happy_family_transpng 1.png";
import { Menu, X } from "lucide-react"; // Import icons from lucide-react

const HeaderComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/academy", label: "Academy" },
    { path: "/services", label: "Services" },
    { path: "/gallery", label: "Gallery" },
    { path: "/about-us", label: "About Us" },
  ];

  return (
    <header className="bg-[#333333]/90 backdrop-blur-sm py-2 sm:py-4 px-4 sm:px-8 rounded-full mx-2 sm:mx-4 my-2 flex items-center justify-between sticky  top-2 z-0 shadow-lg">
      {/* Logo */}
      <div className="flex items-center ">
        <Link to="/">
          <img src={logo} alt="Happy Family Salon" className="h-8 sm:h-12" />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden text-white hover:text-[#F4A492] transition-colors cursor-pointer"
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`relative text-white hover:text-[#F4A492] transition-colors font-['playfair_display'] ${
              isActive(link.path) ? "text-[#F4A492]" : ""
            }`}
          >
            {link.label}
            {isActive(link.path) && (
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#F4A492] rounded-full" />
            )}
          </Link>
        ))}
      </nav>

      <Link
        to="/contact-us"
        className={`bg-[#F4A492] text-white hidden md:block px-6 py-2 rounded-lg transition-colors font-['playfair_display'] ${
          isActive("/contact-us") ? "bg-[#f3917b]" : "hover:bg-[#f3917b]"
        }`}
      >
        Contact Us
      </Link>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 px-4">
          <nav className="bg-[#2A2A2A] rounded-2xl py-4 shadow-lg">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-white hover:text-[#F4A492] transition-colors px-4 py-2 ${
                    isActive(link.path) ? "text-[#F4A492] bg-white/5" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/contact-us"
                onClick={() => setIsMenuOpen(false)}
                className={`bg-[#F4A492] text-white px-4 py-2 rounded-full text-center mx-4 transition-colors ${
                  isActive("/contact-us")
                    ? "bg-[#f3917b]"
                    : "hover:bg-[#f3917b]"
                }`}
              >
                Contact Us
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default HeaderComponent;
