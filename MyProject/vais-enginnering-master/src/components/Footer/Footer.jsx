import React from "react";
import Footer_logo from "../../assets/Footer_logo.png";
import insta from "../../assets/insta.png";
import twitter from "../../assets/twitter.png";
import playstore from "../../assets/playstore.png";
import facebook from "../../assets/facebook.png";
import linkedin from "../../assets/linkedin.png";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-[#ffffff] w-full text-black text-center px-4 mobile-sm:px-6 mobile-lg:px-[186px] py-8 mobile-lg:py-[115px]">
      <div className="flex flex-col  mobile-lg:flex-row gap-8 mobile-lg:gap-4">
        <div className="flex flex-col mobile-sm:items-start mobile-lg:items-start mobile-lg:w-[40%]">
          <img src={Footer_logo} alt="Footer_logo" />
          <p className="text-[16px] mobile-lg:leading-[30px] pt-4 mobile-lg:pt-[45px] text-center mobile-lg:text-left text-[#4a4a4a]">
            At Vais Engineering Pvt Ltd, we specialize in crafting <br className=" mobile-lg:visible mobile-sm:hidden"/>{" "}
            digital experiences that captivate and convert. As a <br className=" mobile-lg:visible mobile-sm:hidden"/>{" "}
            forward-thinking web development company, we <br className=" mobile-lg:visible mobile-sm:hidden" /> transform your
            ideas into dynamic, user-friendly <br className=" mobile-lg:visible mobile-sm:hidden"/> websites that combine
            aesthetic appeal with <br className=" mobile-lg:visible mobile-sm:hidden"/>
            seamless functionality.
          </p>
        </div>

        <div className="w-full mobile-sm:w-[50%] mobile-lg:w-[20%] text-center mobile-lg:text-left">
          <h2 className="text-[20px] font-semibold">QUICK LINK</h2>
          <div className="flex flex-col items-center mobile-lg:items-start pt-4 mobile-lg:pt-[70px] gap-4 mobile-lg:gap-[32px] text-[#4a4a4a]">
            <Link to="/" className="hover:text-[#f17a1f]">
              Home
            </Link>
            <Link to="/about" className="hover:text-[#f17a1f]">
              About
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
          </div>
        </div>

        <div className="w-full mobile-sm:w-[50%] mobile-lg:w-[20%] text-center mobile-lg:text-left">
          <h2 className="text-[20px] font-semibold">SERVICES</h2>
          <div className="flex flex-col items-center mobile-lg:items-start pt-4 mobile-lg:pt-[70px] gap-4 mobile-lg:gap-[32px] text-[#4a4a4a]">
            <Link to="/atm-support" className="hover:text-[#f17a1f]">
              ATM Service Support
            </Link>
            <Link to="/interior-design" className="hover:text-[#f17a1f]">
              Interior Design
            </Link>
            <Link to="/event-management" className="hover:text-[#f17a1f]">
              Event Management
            </Link>
            <Link to="/digital-marketing" className="hover:text-[#f17a1f]">
              Digital Marketing
            </Link>
            <Link to="/seo-services" className="hover:text-[#f17a1f]">
              SEO Services
            </Link>
          </div>
        </div>

        <div className="w-full mobile-sm:w-[50%] mobile-lg:w-[20%] text-center mobile-lg:text-left">
          <h2 className="text-[20px] font-semibold">FOLLOW US</h2>
          <div className="flex flex-col items-center mobile-lg:items-start pt-4 mobile-lg:pt-[70px] gap-4 mobile-lg:gap-[32px] text-[#4a4a4a]">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#f17a1f] flex items-center gap-3 justify-center mobile-lg:justify-start"
            >
              <img src={facebook} alt="facebook" />
              <span>Facebook</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#f17a1f] flex items-center gap-3 justify-center mobile-lg:justify-start"
            >
              <img src={insta} alt="insta" />
              <span>Instagram</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#f17a1f] flex items-center gap-3 justify-center mobile-lg:justify-start"
            >
              <img src={linkedin} alt="linkedin" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#f17a1f] flex items-center gap-3 justify-center mobile-lg:justify-start"
            >
              <img src={twitter} alt="twitter" />
              <span>Twitter</span>
            </a>
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#f17a1f] flex items-center gap-3 justify-center mobile-lg:justify-start"
            >
              <img src={playstore} alt="playstore" />
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col mobile-sm:flex-row items-center text-left  justify-between mt-8 mobile-lg:mt-12 gap-4">
        <p className="text-mobile-sm    w-full">© 2024 vais.co.in</p>
        <div className="flex gap-4 mobile-sm:gap-10  w-full">
          <p className="text-mobile-sm">Terms</p>
          <p className="text-mobile-sm">Privacy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
