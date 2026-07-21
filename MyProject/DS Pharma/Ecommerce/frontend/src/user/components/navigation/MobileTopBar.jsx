import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { CartButton } from '@/user/components/navigation/CartButton';
import { SearchBar } from '@/user/components/navigation/SearchBar';
import SearchInput from '@/user/components/search/SearchInput';

/**
 * Mobile top bar component
 */
export const MobileTopBar = ({ totalCartItems }) => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Close search when route changes
  useEffect(() => {
     setIsSearchOpen(false);
  }, [navigate]);

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[rgba(165,232,220,0.95)] backdrop-blur-md border-b border-white/20 shadow-sm px-4 py-3" style={{ padding: '10px 5px' }}>
      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '20px',
            fontWeight: 700,
            color: '#000000',
            letterSpacing: '0.05em'
          }}
        >
          DS Pharma 
        </span>

          <div className="flex items-center gap-3">
            {/* Search Button */}
            <SearchBar
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              isOpen={isSearchOpen}
            />
          
          <CartButton totalCartItems={totalCartItems} className="w-8 h-8" />
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
            className="absolute left-0 right-0 z-40 px-4 pb-4"
            style={{ 
              top: '100%', 
              width: '100%'
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
    </div>
  );
};
