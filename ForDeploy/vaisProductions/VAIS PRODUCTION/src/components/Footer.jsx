import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { PlaystoreImg, FooterLogoImg } from "../assets";

function Footer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return;
    }
    setError("");
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <footer className="bg-black text-white py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-16">
        {/* Left Section */}
        <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <img
            src={FooterLogoImg}
            alt="Vais Productions"
            className="h-10 mx-auto md:mx-0"
          />
          <p className="text-gray-400 mt-6 text-sm md:mr-10 max-w-xs">
            Vais Productions, Your trusted event management partner, delivering
            unforgettable experiences with creativity, precision, and
            excellence.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row mt-6 gap-2 w-full max-w-xs mx-auto md:mx-0"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 bg-gray-900 text-white border border-gray-900 outline-none rounded-full w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[#f73801] text-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition w-full sm:w-auto"
            >
              Subscribe
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 flex flex-col sm:flex-row gap-8 justify-center md:justify-end items-center md:items-start text-center md:text-left">
          {/* Links */}
          <div className="w-full sm:w-1/3 flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-[#bd2d03] font-semibold mb-3 text-[20px]">
              Links
            </h3>
            <div className="space-y-2 text-sm font-extralight grid">
              <Link
                to="/"
                className="hover:text-white text-[#716e6e] text-[16px] font-medium transition"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="hover:text-white text-[#716e6e] text-[16px] font-medium transition"
              >
                About
              </Link>
              <Link
                to="/services"
                className="hover:text-white text-[#716e6e] text-[16px] font-medium transition"
              >
                Services
              </Link>
              <Link
                to="/portfolio"
                className="hover:text-white text-[#716e6e] text-[16px] font-medium transition"
              >
                Portfolio
              </Link>
            </div>
          </div>
          {/* Resources */}
          <div className="w-full sm:w-1/3 flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-[#bd2d03] font-semibold mb-3 text-[20px]">
              Resources
            </h3>
            <div className="space-y-2 text-sm font-extralight grid">
              <Link
                to="/contact"
                className="hover:text-white text-[#716e6e] text-[16px] font-medium transition"
              >
                Contact
              </Link>
              <Link
                to="/#"
                className="hover:text-white text-[#716e6e] text-[16px] font-medium transition"
              >
                Community
              </Link>
              <Link
                to="/#"
                className="hover:text-white text-[#716e6e] text-[16px] font-medium transition"
              >
                Privacy
              </Link>
              <Link
                to="/#"
                className="hover:text-white text-[#716e6e] text-[16px] font-medium transition"
              >
                Terms of Service
              </Link>
            </div>
          </div>
          {/* Social */}
          <div className="w-full sm:w-1/3 flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-[#bd2d03] font-semibold mb-3 text-[20px]">
              Social
            </h3>
            <ul className="space-y-2 text-sm font-extralight">
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <FaFacebookF className="text-[#716e6e] hover:text-white text-[16px] font-medium" />
                <a
                  target="_blank"
                  href="https://www.facebook.com/profile.php?id=61563710507570"
                  className="hover:text-white text-[#716e6e] text-[16px] font-medium transition"
                >
                  Facebook
                </a>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <FaInstagram className="text-[#716e6e] hover:text-white text-[16px] font-medium" />
                <a
                  target="_blank"
                  href="https://www.instagram.com/vaisproductions/"
                  className="hover:text-white text-[#716e6e] text-[16px] font-medium transition"
                >
                  Instagram
                </a>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <FaLinkedinIn className="text-[#716e6e] hover:text-white text-[16px] font-medium" />
                <a
                  target="_blank"
                  href="https://www.linkedin.com/company/104903471/"
                  className="hover:text-white text-[#716e6e] text-[16px] font-medium transition"
                >
                  LinkedIn
                </a>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <FaTwitter className="text-[#716e6e] hover:text-white text-[16px] font-medium" />
                <a
                  href="#"
                  className="hover:text-white text-[#716e6e] text-[16px] font-medium transition"
                >
                  Twitter
                </a>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <FaYoutube className="text-[#716e6e] hover:text-white text-[16px] font-medium" />
                <a
                  target="_blank"
                  href="https://www.youtube.com/@VAISProductions"
                  className="hover:text-white text-[#716e6e] text-[16px] font-medium transition"
                >
                  YouTube
                </a>
              </li>
            </ul>
            <button className="mt-4">
              <img
                src={PlaystoreImg}
                alt="Google Play"
                className="w-32 cursor-pointer"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 flex flex-col md:flex-row justify-center md:justify-between items-center text-gray-500 text-sm text-center md:text-left">
         <a href="https://vais.co.in" target="_blank" rel="noopener noreferrer">
        © Vais Production {new Date().getFullYear()}
      </a>
        <div className="flex justify-center md:justify-end gap-5 md:pr-8 mt-3 md:mt-0">
          <a href="/#" className="hover:text-[#f73801] transition">
            Terms
          </a>
          <a href="/#" className="hover:text-[#f73801] transition">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
