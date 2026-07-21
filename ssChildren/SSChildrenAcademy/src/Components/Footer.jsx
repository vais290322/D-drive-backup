import React from "react";
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[#232323] text-white pt-12 pb-4 font-[Ubuntu]">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-32">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* About */}
          <div className="w-full lg:w-1/3">
            <div className="flex items-center mb-4">
              <span className="font-bold text-[#3a8119] text-xl mr-1">SS</span>
              <span className="font-semibold text-lg">Children Academy</span>
            </div>
            <p className="text-sm text-gray-300 mb-6 max-w-[290px]">
              At our School we are dedicated to providing quality education, fostering creativity, and nurturing young minds to become future leaders.
            </p>
            <div className="flex space-x-5 text-yellow-400 text-xl mb-8 lg:mb-0">
              <a href="#" aria-label="Facebook" className="hover:text-[#38B000] transition-colors duration-300"><FaFacebookF /></a>
              <a href="#" aria-label="X" className="hover:text-[#38B000] transition-colors duration-300"><FaXTwitter /></a>
              <a href="#" aria-label="Instagram" className="hover:text-[#38B000] transition-colors duration-300"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-[#38B000] transition-colors duration-300"><FaLinkedinIn /></a>
            </div>
          </div>
          
          {/* Links Section */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Useful Links */}
              <div>
                <p className="font-semibold mb-4 text-lg">Useful Links</p>
                <ul className="space-y-2 text-sm text-gray-200">
                  <li><a href="/" className="hover:text-[#38B000] transition-colors duration-300">Home</a></li>
                  <li><a href="/about" className="hover:text-[#38B000] transition-colors duration-300">About Us</a></li>
                  <li><a href="/academics" className="hover:text-[#38B000] transition-colors duration-300">Academics</a></li>
                  <li><a href="/activities" className="hover:text-[#38B000] transition-colors duration-300">Activities & Events</a></li>
                  <li><a href="/teachers" className="hover:text-[#38B000] transition-colors duration-300">Teachers</a></li>
                </ul>
              </div>
              
              {/* Information */}
              <div>
                <p className="font-semibold mb-4 text-lg">Information</p>
                <ul className="space-y-2 text-sm text-gray-200">
                  <li><a href="#" className="hover:text-[#38B000] transition-colors duration-300">Our School</a></li>
                  <li><a href="#" className="hover:text-[#38B000] transition-colors duration-300">Location</a></li>
                  <li><a href="#" className="hover:text-[#38B000] transition-colors duration-300">Fees Details</a></li>
                  <li><a href="#" className="hover:text-[#38B000] transition-colors duration-300">Payment Methods</a></li>
                  <li><a href="#" className="hover:text-[#38B000] transition-colors duration-300">Contact Us</a></li>
                </ul>
              </div>
              
              {/* Newsletter Signup */}
              <div>
                <p className="font-semibold mb-4 text-lg">Newsletter Signup</p>
                <form className="flex flex-col sm:flex-row">
                  <input
                    type="email"
                    placeholder="Enter your Email"
                    className="bg-transparent border border-yellow-400 rounded-l-md sm:rounded-l-md sm:rounded-r-none rounded-r-md px-4 py-2 text-sm text-white focus:outline-none w-full"
                  />
                  <button
                    type="submit"
                    className="bg-[#38B000] text-white px-5 py-2 rounded-r-md sm:rounded-l-none rounded-l-md sm:rounded-r-md text-sm hover:bg-green-700 transition mt-2 sm:mt-0"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="h-[2px] w-full mt-12 lg:mt-20 bg-gradient-to-r from-[#1C1C1C] via-[#FFD700] to-[#1C1C1C]"></div>
        
        {/* Copyright */}
        <div className="text-center text-[#38B000] mt-5 text-sm">
          © 2025 The School . All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;