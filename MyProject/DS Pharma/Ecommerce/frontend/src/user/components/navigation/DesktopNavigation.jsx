import { motion as Motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SearchBar } from '@/user/components/navigation/SearchBar';
import { CartButton } from '@/user/components/navigation/CartButton';
import { UserProfileButton } from '@/user/components/navigation/UserProfileButton';
import SearchInput from '@/user/components/search/SearchInput';

/**
 * Desktop navigation bar component
 */
export const DesktopNavigation = ({
  activeItem,
  onNavClick,
  totalCartItems,
  isAuthenticated,
  user,
  navItems
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const navElement = document.querySelector('.navigation-desktop');
      if (navElement && !navElement.contains(event.target)) {
         setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  const handleKeyDown = (event, itemName, href) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onNavClick(itemName, href);
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      role="navigation"
      aria-label="Main navigation"
      className="navigation-desktop hidden md:block fixed top-8 left-1/2 transform -translate-x-1/2 z-50 mx-10"
      style={{ width: 'calc(100% - 80px)', maxWidth: '1280px' }}
    >
      <div
        className={`navigation-desktop-inner rounded-[48px] px-7 flex items-center justify-around shadow-[0_4px_24px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] border border-white/20 transition-all duration-300 ${
          isScrolled ? 'bg-[hsla(169,59%,78%,0.4)] backdrop-blur-lg' : 'bg-[hsla(169,59%,78%,1)] backdrop-blur-md'
        }`}
        style={{ padding: '0.4rem 1rem' }}
      >
        {/* Spacer */}
        <div className="flex-1 md:hidden lg:block"></div>

        {/* Navigation Links */}
        <div className="nav-links-container flex gap-5 items-center ">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              tabIndex={0}
              role="link"
              aria-current={activeItem === item.name ? 'page' : undefined}
              className="nav-link-item cursor-pointer relative outline-none transition-all duration-200 ease-out hover:opacity-70 focus:outline-2 focus:outline-black/30 focus:outline-offset-1 no-underline"
              style={{
                fontFamily: 'Gyrotrope',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '100%',
                color: '#000000',
                paddingBottom: '5px',
                textDecoration: 'none'
              }}
              onClick={(e) => {
                e.preventDefault();
                onNavClick(item.name, item.href);
              }}
              onKeyDown={(e) => handleKeyDown(e, item.name, item.href)}
            >
              {item.name}
              {activeItem === item.name && (
                <Motion.div
                  layoutId="activeNavUnderline"
                  className="absolute bottom-px left-1/2 -translate-x-1/2 w-[120%] flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-1 h-1 rounded-full bg-black shrink-0" />
                  <div className="h-[2px] bg-black flex-1" />
                  <div className="w-1 h-1 rounded-full bg-black shrink-0" />
                </Motion.div>
              )}
            </a>
          ))}
        </div>

        {/* Right Side Icons */}
        <div className="nav-icons-container flex gap-3 items-center flex-1 justify-end">
          <SearchBar
            className="nav-search-icon relative w-[30px] h-[28px] lg:w-[38px] lg:h-[35px] flex items-center justify-center"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            isOpen={isSearchOpen}
          />
          <CartButton totalCartItems={totalCartItems} className="nav-cart-icon w-9 h-9" />
          <UserProfileButton
            isAuthenticated={isAuthenticated}
            user={user}
            className="nav-user-profile"
            showName={true}
          />
        </div>
      </div>

      {/* Search Container - Absolute Positioned Below Navbar */}
      <AnimatePresence>
        {isSearchOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute left-0 right-0 z-40 mx-auto flex justify-center"
            style={{ 
              top: 'calc(100% + 20px)', 
              width: '100%', 
              maxWidth: '600px'
            }}
            ref={searchContainerRef}
          >
            <SearchInput 
              className="w-full shadow-2xl border border-gray-100/50 backdrop-blur-sm" 
              autoFocus 
              onSearchSubmit={() => setIsSearchOpen(false)}
            />
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.nav>
  );
};
