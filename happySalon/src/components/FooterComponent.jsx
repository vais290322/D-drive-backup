import React from 'react'
import { Link } from 'react-router'
import logo from '../assets/home/happy_family_transpng 1.png'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'

const FooterComponent = () => {
  return (
    <footer className="bg-[#2A2A2A] text-white px-8 py-12 font-['poppins'] ">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-4">
        {/* Left Section */}
        <div>
          <img src={logo} alt="Happy Family Salon" className="h-16 mb-4" />
          <p className="text-lg mb-4">
            Empowering beauty & confidence<br />
            — from salon chair to classroom.
          </p>
          <address className="not-italic">
            <p>CE/1/C/168,AA-1C,</p>
            <p>STREET NO- 196, NEW TOWN,</p>
            <p>KOLKATA, 700156</p>
          </address>
        </div>

        {/* Middle Section */}
        <div className="md:flex md:items-center md:flex-col text-left ">
          <h3 className="text-xl font-semibold mb-4 md:ml-[-20px] ">Menu</h3>
          <nav className="flex flex-col space-y-2 ">
            <Link to="/" className="hover:text-[#f3947d]">Home</Link>
            <Link to="/academy" className="hover:text-[#f3947d]">Academy</Link>
            <Link to="/services" className="hover:text-[#f3947d]">Services</Link>
            <Link to="/gallery" className="hover:text-[#f3947d] ">Gallery</Link>
            <Link to="/about-us" className="hover:text-[#f3947d] ">About Us</Link>
          </nav>
        </div>

        {/* Right Section */}
        <div className="md:text-right text-left">
          <h3 className="text-2xl font-semibold mb-4">Book An Query Now</h3>
          <div className="flex md:justify-end justify-start gap-2 mb-2 flex-col md:flex-row">
            <input
              type="text"
              placeholder="e.x. 9993331122"
              className="bg-gray-700 px-4 py-2 rounded"
            />
            <button className="bg-[#F4A492] px-6 py-2 rounded hover:bg-[#f3917b] transition-colors">
              Submit
            </button>
          </div>
          <p className="text-sm text-gray-400">WE will reach you within 24Hrs.</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto mt-8 pt-4 border-t border-gray-700">
        <div className="flex justify-between items-center flex-col md:flex-row gap-2">
          <p className="text-sm text-gray-400">
            Copyright ©VAIS ENGINEERING PVT. LTD. All Rights Reserved.
          </p>
          <div className="flex gap-4 ">
            <a href="#" className="text-white hover:text-gray-300"><FaFacebook size={20} /></a>
            <a href="#" className="text-white hover:text-gray-300"><FaInstagram size={20} /></a>
            <a href="#" className="text-white hover:text-gray-300"><FaYoutube size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterComponent