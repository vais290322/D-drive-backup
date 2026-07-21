import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import Logo from '../../assets/Home_images/home page/logo 1.png'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-32">
        <div>
          <img src={Logo} alt="no image" className="h16 w-16"/>
          <p className="mt-8 text-sm">
            We specialize in delivering comprehensive security and manpower solutions tailored to meet the unique needs of businesses.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Links</h3>
          <ul className="mt-2 space-y-2">
            <li><Link to="/" className="text-[#197BBD] hover:text-blue-700 font-semibold hover:font-semibold">Home</Link></li>
            <li><Link to="about" className="text-[#197BBD] hover:text-blue-700 font-semibold hover:font-semibold">About</Link></li>
            <li><Link to="services" className="text-[#197BBD] hover:text-blue-700 font-semibold hover:font-semibold">Services</Link></li>
            <li><Link to="contact" className="text-[#197BBD] hover:text-blue-700 font-semibold hover:font-semibold">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg">Help</h3>
          <ul className="mt-2 space-y-2">
            <li><Link to="/term" className="text-[#197BBD] hover:text-blue-700 font-semibold hover:font-semibold">Terms</Link></li>
            <li><Link to="/privacy policy" className="text-[#197BBD] hover:text-blue-700 font-semibold hover:font-semibold">Privacy Policy</Link></li>
            <li><Link to="/accessiblity" className="text-[#197BBD] hover:text-blue-700 font-semibold hover:font-semibold">Accessibility</Link></li>
            <li><Link to="site map" className="text-[#197BBD] hover:text-blue-700 font-semibold hover:font-semibold">Site Map</Link></li>
          </ul>
        </div>
        <div className="text-[#197BBD]">
          <h3 className="font-semibold text-lg text-white">Contact</h3>
          <p className="mt-2 text-sm font-semibold">CIN - U80100WB2023PTC260127</p>
          <p className="text-sm font-semibold">ROC Kolkata</p>
          <p className="text-sm font-semibold">An ISO 9001-2015 Certified company</p>
          <p className="mt-2 text-sm font-semibold">📞 +91 91477-17001</p>
          <p className="text-sm font-semibold">✉️ info@mnssecuresolutions.com</p>
        </div>
      </div>
      <div className="mt-10 flex flex-col md:flex-row items-center justify-between border-t border-gray-700 pt-6">
        <p className="text-sm">© 2025 MNS Secure Solutions. All Rights Reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <FaFacebookF className="text-xl cursor-pointer hover:text-blue-400" />
          <FaInstagram className="text-xl cursor-pointer hover:text-pink-400" />
          <FaTiktok className="text-xl cursor-pointer hover:text-white" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
