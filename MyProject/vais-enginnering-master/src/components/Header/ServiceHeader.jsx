import React, { useState } from "react";
import career_banner from "../../assets/Career_banner.png";
import header_logo from "../../assets/header_logo.png";
import service_banner_image from "../../assets/service_banner_image.png";
import arrow from "../../assets/arrow.png";
import { Link } from "react-router-dom";
import { FaTimes, FaAlignJustify } from "react-icons/fa";

const ServiceHeader = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  return (
    <header
      className="mobile-lg:h-screen mobile-lg:w-screen flex flex-col bg-hero-pattern bg-center bg-cover mobile-sm:w-auto mobile-sm:h-auto"
      style={{ backgroundImage: `url(${service_banner_image})` }}
    >
      {/* Navbar */}
      <div className="h-[109px] px-6 mobile-lg:px-20 flex items-center justify-between">
        {/* Logo Section */}
        <img
          src={header_logo}
          alt="header_logo "
          className="mobile-sm:h-[50px] mobile-lg:h-auto"
        />

        {/* Desktop Menu */}
        <div className="hidden mobile-lg:flex items-center text-[18px] font-light justify-between gap-4">
          <div className="flex gap-[32px] text-white">
            <Link to="/" className="hover:text-[#f17a1f] ">
              Home
            </Link>
            <Link to="/about-us" className="hover:text-[#f17a1f]">
              About Us
            </Link>
            <Link to="/services" className="hover:text-[#f17a1f] text-[#f17a1f]">
              Services
            </Link>
            <Link to="/portfolio" className="hover:text-[#f17a1f]">
              Portfolio
            </Link>
            <Link to="/careers" className="hover:text-[#f17a1f] ">
              Careers
            </Link>
            <Link to="/contact" className="hover:text-[#f17a1f]">
              Contact
            </Link>
          </div>
          <hr className="w-[1px] h-[20px] bg-white mx-4 hidden mobile-lg:block" />
          <Link to="/booknow">
            <button className="h-[60px] w-[135px] rounded-[60px] text-white bg-[#f17a1f] flex items-center justify-center">
              Book Now
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div
          className="mobile-lg:hidden text-white text-2xl cursor-pointer"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? <FaTimes /> : <FaAlignJustify />}
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="absolute top-[109px] left-0 w-full bg-gray-800 text-white flex flex-col gap-4 p-4 mobile-lg:hidden">
            <Link to="/" className="hover:text-[#f17a1f] ">
              Home
            </Link>
            <Link to="/about-us" className="hover:text-[#f17a1f]">
              About Us
            </Link>
            <Link to="/services" className="hover:text-[#f17a1f]">
              Services
            </Link>
            <Link to="/portfolio" className="hover:text-[#f17a1f]">
              Portfolio
            </Link>
            <Link to="/careers" className="hover:text-[#f17a1f]">
              Careers
            </Link>
            <Link to="/contact" className="hover:text-[#f17a1f]">
              Contact
            </Link>
            <Link to="/booknow">
              <button className="h-[60px] w-full rounded-[60px] text-white bg-[#f17a1f] flex items-center justify-center">
              Book Now
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Hero Section */}

      <section className="flex-1 mobile-sm:px-5 mobile-sm:py-16 mobile-lg:px-20 flex flex-col items-start justify-center">
        <div className="flex-1 px-6  mobile-sm:px-1 mobile-sm:w-full mobile-lg:px-20 flex flex-col items-start justify-center">
          <h2 className="text-white font-extralight text-xl mobile-sm:text-2xl mobile-lg:text-[42px] mb-3 mobile-sm:mb-4 mobile-lg:mb-[45px]">
          Services
          </h2>
          <h1 className="mobile-lg:[100px] mobile-sm:text-[30px] font-semibold mobile-lg:text-[100px] text-white leading-snug mobile-sm:leading-tight mobile-lg:leading-tight">
            Comprehensive
            <br className="hidden mobile-lg:block" />
            <span className="text-[#f17a1f]"> IT Solutions</span>
          </h1>
          <p className="text-white  font-regular font-normal text-[16px]  mobile-lg:text-[20px] mt-3 mobile-sm:mt-4 mobile-lg:mt-6 leading-relaxed mobile-sm:leading-loose mobile-lg:leading-[36px]">
            We offer a comprehensive range of services, including Software
            <br className="hidden mobile-lg:block" />
            Development to create custom solutions tailored to your business
            <br className="hidden mobile-lg:block" />
            needs.
          </p>
          <button className="mt-4 mobile-sm:text-[14px] mobile-mobile-lg:text-[16px]  mobile-sm:mt-6 mobile-mobile-lg:mt-[55px] h-[45px] mobile-sm:h-[55px] mobile-mobile-lg:h-[65px] w-[140px] mobile-sm:w-[180px] mobile-mobile-lg:w-[222px] flex border border-white text-white items-center justify-around rounded-[60px] px-3 mobile-sm:px-4">
            GET STARTED
            <span>
              <img src={arrow} alt="arrow" />
            </span>
          </button>
        </div>
      </section>
    </header>
  );
};

export default ServiceHeader;
