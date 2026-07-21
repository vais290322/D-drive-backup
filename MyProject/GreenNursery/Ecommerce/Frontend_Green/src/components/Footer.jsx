import React from "react";
import { Link } from "react-router-dom";
import Green from '../assest/logo/Green.png'
import GreenLogo4 from '../assest/logo/GreenLogo4.png'
import { FaFacebook, FaLeaf, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      <footer className="bg-emerald-800 text-white relative overflow-hidden">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '20px'
             }}>
        </div>
        
        {/* Main Footer Content */}
        <div className="container mx-auto p-6 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center">
                <img
                  src={GreenLogo4}
                  className="h-28 w-28  mr-3 p-1 rounded-md"
                  alt="Green City Nursery Logo"
                />
                <span className="text-xl font-bold text-white">
                  Green City Nursery
                </span>
              </div>
              <p className="text-emerald-100">
                Your one-stop destination for all your gardening needs. We provide high-quality plants, seeds, and gardening tools.
              </p>
              <div className="pt-2">
                <a
                  href="https://www.facebook.com/share/1EjXpsW4cQ/?mibextid=qi2Omg" 
                  className="inline-flex items-center justify-center w-10 h-10 bg-emerald-700 hover:bg-emerald-600 rounded-full transition-colors duration-300 mr-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook className="w-5 h-5" />
                  <span className="sr-only">Facebook page</span>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaLeaf className="mr-2 text-emerald-300" />
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/" 
                    className="text-emerald-100 hover:text-white hover:underline transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block mr-2"></span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className="text-emerald-100 hover:text-white hover:underline transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block mr-2"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/product-category" 
                    className="text-emerald-100 hover:text-white hover:underline transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block mr-2"></span>
                    Products
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="text-emerald-100 hover:text-white hover:underline transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block mr-2"></span>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaLeaf className="mr-2 text-emerald-300" />
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="http://vais.co.in" 
                    className="text-emerald-100 hover:text-white hover:underline transition-colors flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block mr-2"></span>
                    Vais
                  </a>
                </li>
                {/* <li>
                  <Link 
                    to="/privacy-policy" 
                    className="text-emerald-100 hover:text-white hover:underline transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block mr-2"></span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms-conditions" 
                    className="text-emerald-100 hover:text-white hover:underline transition-colors flex items-center"
                  >
                    <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block mr-2"></span>
                    Terms & Conditions
                  </Link>
                </li> */}
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaLeaf className="mr-2 text-emerald-300" />
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaMapMarkerAlt className="text-emerald-300 mt-1 mr-2" />
                  <span className="text-emerald-100">
                    Gopalpur more, Basirhat, North 24 parganas, West Bengal – 743428
                  </span>
                </li>
                <li className="flex items-center">
                  <FaPhoneAlt className="text-emerald-300 mr-2" />
                  <span className="text-emerald-100">+91 9064639993</span>
                </li>
                <li className="flex items-center">
                  <FaPhoneAlt className="text-emerald-300 mr-2" />
                  <span className="text-emerald-100">+91 8637026057</span>
                </li>
                <li className="flex items-center">
                  <FaEnvelope className="text-emerald-300 mr-2" />
                  <span className="text-emerald-100">greencitynursery9993@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-px bg-emerald-700 my-8"></div>
          
          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-emerald-100 text-sm">
              © {new Date().getFullYear()} Green City Nursery. All Rights Reserved.
            </p>
            <p className="text-emerald-200 text-sm mt-2 md:mt-0">
              Bringing nature's beauty to your doorstep since 2015
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-700 rounded-full opacity-30 transform translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-700 rounded-full opacity-20 transform -translate-y-1/2 translate-x-1/2"></div>
      </footer>
    </div>
  );
};

export default Footer;
