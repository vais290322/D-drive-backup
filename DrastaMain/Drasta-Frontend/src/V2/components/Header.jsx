import { logo } from "@/assets";
import { ProfileDropdown } from "@/V2/components/auth";
import { navbarItems as baseNavItems, USER_ROLES } from "@/V2/config";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useScrollSection } from "../hooks/useScrollSection";

export const Header = () => {
  const { user } = useSelector((s) => s.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const scrollToSection = useScrollSection();

  // Generate nav items dynamically
  const navItems = useMemo(() => {
    if (user?.role === USER_ROLES.ADMIN) {
      const hasDashboard = baseNavItems.some((i) => i.url === "/admin");
      return hasDashboard
        ? baseNavItems
        : [...baseNavItems, { title: "Dashboard", url: "/admin" }];
    }
    return baseNavItems.filter((i) => i.url !== "/admin");
  }, [user?.role]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile nav when route changes
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 h-[70px] md:h-[90px] bg-white/95 backdrop-blur-sm flex items-center justify-between px-4 md:px-8 lg:px-32 transition-all duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      {/* Logo */}
      <Link to="/home" className="relative group">
        <img
          src={logo}
          alt="Dashboard Logo"
          className="h-14 md:h-16 cursor-pointer"
        />
        {/* Tooltip */}
        <div
          className="
      absolute left-1/2 -translate-x-1/2 -bottom-8 
      opacity-0 group-hover:opacity-100
      pointer-events-none
      bg-black text-white text-xs px-2 py-1 rounded 
      whitespace-nowrap transition-all duration-200 z-50
    "
        >
          home
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6 lg:space-x-8">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className={({ isActive }) =>
              `relative font-medium transition-colors duration-200 text-base lg:text-lg ${
                isActive
                  ? "text-[var(--secondary-color)]"
                  : "text-[var(--text-color)] hover:text-[var(--secondary-color)]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {item.title}
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--secondary-color)] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center space-x-3 lg:space-x-4 cursor-pointer">
        <NavLink
          to="/volunteer"
          className={({ isActive }) =>
            `px-3 py-1.5 lg:px-4 lg:py-2 border-2 border-[var(--secondary-color)] text-[var(--primary-color)] rounded-md text-xs lg:text-sm font-semibold hover:bg-[var(--secondary-color)] hover:text-white transition ${
              isActive
                ? "text-[var(--secondary-color)] bg-[var(--primary-color)] border-none hover:border-[var(--primary-color)] "
                : ""
            }`
          }
        >
          Volunteer
        </NavLink>
        <button
          onClick={() => scrollToSection("donate")}
          className="px-3 py-1.5 cursor-pointer lg:px-4 lg:py-2 bg-[var(--secondary-color)] text-black rounded-md text-xs lg:text-sm font-semibold hover:bg-[#d4ad00] transition"
        >
          Donate
        </button>
        {user ? (
          <ProfileDropdown user={user} className="cursor-pointer" />
        ) : (
          <ButtonLink to="/login" className="cursor-pointer">
            Login
          </ButtonLink>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden p-2 focus:outline-none"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <div className="flex flex-col justify-center items-center w-6 h-6">
          <div
            className={`w-6 h-0.5 bg-[var(--text-color)] mb-1.5 transition-all ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <div
            className={`w-6 h-0.5 bg-[var(--text-color)] mb-1.5 transition-all ${
              mobileOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <div
            className={`w-6 h-0.5 bg-[var(--text-color)] transition-all ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </div>
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[70px] left-0 w-full bg-white shadow-lg md:hidden"
          >
            <div className="flex flex-col px-6 py-4 space-y-4 border-t border-gray-100 relative">
              {navItems.map((item) => (
                <NavLink
                  key={item.url}
                  to={item.url}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `py-2 text-[var(--text-color)] text-base font-medium transition-colors ${
                      isActive
                        ? "text-[var(--secondary-color)] border-l-4 border-[var(--secondary-color)] pl-3"
                        : "hover:text-[var(--secondary-color)] pl-4"
                    }`
                  }
                >
                  {item.title}
                </NavLink>
              ))}

              <div className="flex flex-col space-y-3 mt-4">
                <Link
                  to="/volunteer"
                  onClick={() => setMobileOpen(false)}
                  className="w-full px-4 py-2 border-2 border-[var(--secondary-color)] text-[var(--primary-color)] rounded-md text-sm font-semibold hover:bg-[var(--secondary-color)] hover:text-white transition text-center"
                >
                  Volunteer
                </Link>
                <button
                  onClick={() => {
                    scrollToSection("donate");
                    setMobileOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-[var(--secondary-color)] text-black rounded-md text-sm font-semibold hover:bg-[#d4ad00] transition text-center"
                >
                  Donate
                </button>

                {!user && <ButtonLink to="/login">Login</ButtonLink>}
              </div>

              <div className="absolute top-2 right-3">
                {user && <ProfileDropdown user={user} mobileView />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export function ButtonLink({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`
        inline-flex items-center justify-center
        px-5 py-2.5
        bg-gradient-to-r from-yellow-400 to-yellow-600
        text-black font-semibold text-sm
        rounded-lg
        shadow-md
        transition-transform transform hover:scale-105
        hover:opacity-90
        focus:outline-none focus:ring-4 focus:ring-yellow-300
        ${className}
      `}
    >
      {children}
    </Link>
  );
}
