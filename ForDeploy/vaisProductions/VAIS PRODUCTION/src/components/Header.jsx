import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { LogoImg } from "../assets";
import { BookConsultant } from "../components";

const linkVariants = {
  hover: { scale: 1.1, color: "#f73801" },
};

const heartbeatAnimation = {
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

function Header() {
  const [isConsultantOpen, setIsConsultantOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("home");

  const handleItemClick = (id) => {
    const section = document.getElementById(id.toLowerCase());
    setSelectedItem(id.toLowerCase());
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = ["Home", "About", "Services", "Portfolio", "Contact"];

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-full flex items-center justify-between bg-opacity-75 text-black py-3 px-4 sm:px-6 md:px-10 shadow-md bg-white z-50 transition-opacity duration-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div>
          <Link to="/">
            <img
              src={LogoImg}
              alt="Logo"
              className="h-10 sm:h-12 md:h-14 w-auto"
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-4 lg:gap-8 items-center">
          {navItems.map((label, index) => (
            <motion.div key={index} whileHover="hover" variants={linkVariants}>
              <Link
                className={`${
                  selectedItem === label.toLowerCase()
                    ? "text-[18px] font-medium font-poppins"
                    : "text-sm lg:text-base"
                }`}
                to={
                  label.toLowerCase() !== "home"
                    ? `/${label.toLowerCase()}`
                    : "/"
                }
                onClick={() => handleItemClick(label)}
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-4 lg:gap-8">
          {/* Desktop Book Consultation Button */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <motion.button
              className="bg-[#f73801] text-white text-sm lg:text-base px-4 py-2 rounded-3xl outline-none"
              variants={heartbeatAnimation}
              animate="animate"
              onClick={() => setIsConsultantOpen(true)}
            >
              Book Consultation
            </motion.button>
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-2xl"
            >
              {isMenuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.4 }}
            className="lg:hidden fixed top-0 left-0 w-full h-full bg-white flex flex-col items-center justify-center gap-6 text-lg z-40 p-6"
          >
            {navItems.map((label, index) => (
              <motion.div key={index} whileHover="hover" variants={linkVariants}>
                <Link
                  className={`${
                    selectedItem === label.toLowerCase()
                      ? "text-[18px] font-medium font-poppins"
                      : "text-base"
                  }`}
                  to={
                    label.toLowerCase() !== "home"
                      ? `/${label.toLowerCase()}`
                      : "/"
                  }
                  onClick={() => {
                    handleItemClick(label);
                    setIsMenuOpen(false);
                  }}
                >
                  {label}
                </Link>
              </motion.div>
            ))}

            <motion.button
              className="md:hidden bg-[#f73801] text-white px-6 py-3 rounded-3xl text-sm"
              variants={heartbeatAnimation}
              animate="animate"
              onClick={() => {
                setIsConsultantOpen(true);
                setIsMenuOpen(false);
              }}
            >
              Book Consultation
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Book Consultation Modal */}
      {isConsultantOpen && <BookConsultant setIsOpen={setIsConsultantOpen} />}
    </>
  );
}

export default Header;
