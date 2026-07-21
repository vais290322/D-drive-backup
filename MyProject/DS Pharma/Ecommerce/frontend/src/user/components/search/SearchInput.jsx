import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, Pill, TestTube2, ArrowRight } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import useDebounce from '@/shared/hooks/useDebounce';
import searchService from '@/services/api/searchService';

const SearchInput = ({ className = '', placeholder = "Search for medicines, health products...", onSearchSubmit }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await searchService.getSuggestions(debouncedQuery);
        setSuggestions(response.data || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const inputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchQuery = query.trim();
    if (searchQuery) {
      setQuery(''); // Clear input
      setSuggestions([]); // Clear suggestions
      setIsOpen(false); // Close dropdown
      inputRef.current?.blur(); // Remove focus
      if (onSearchSubmit) onSearchSubmit();
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
  };

  const handleSuggestionClick = (product) => {
    setQuery(''); // Clear input
    setSuggestions([]); // Clear suggestions
    setIsOpen(false); // Close dropdown
    inputRef.current?.blur(); // Remove focus
    if (onSearchSubmit) onSearchSubmit();
    navigate(`/product/${product.id}`); // Navigate directly to product details
  };

  return (
    <div ref={wrapperRef} className={`relative w-[90%] md:w-full mx-auto rounded-full md:left-[7%] lg:left-[60%] ${className}`} >
      <form onSubmit={handleSearch} className="relative group">
        <div className={`
           relative flex items-center w-full max-w-7xl mx-auto transition-all duration-300 ease-out
           bg-white border rounded-full
           ${isOpen ? 'border-emerald-500 shadow-lg ring-4 ring-emerald-500/10' : 'border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-300'}
           
        `}
        >
          <div className="pl-6 text-gray-400 group-focus-within:text-emerald-500 transition-colors flex items-center justify-center" style={{ padding: '10px 5px' }}>
             <Search className="w-5 h-5" />
          </div>      
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setIsOpen(true)}
            placeholder={placeholder}
            className="w-full py-4 px-4 bg-transparent border-none text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 text-[12px] font-medium"
            style={{ padding: '10px 5px', marginTop: '3px' }}
          />
            

          <div className="pr-6 flex items-center gap-2">
            <AnimatePresence>
               {isLoading ? (
                 <motion.div
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.8 }}
                 >
                   <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" style={{ padding: '3px', marginRight: '5px' }}/>
                 </motion.div>
               ) : query && (
                 <motion.button
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.8 }}
                   type="button"
                   onClick={clearSearch}
                   className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-red-500 transition-colors"
                    style={{ padding: '3px', marginRight: '5px' }}
                 >
                   <X className="w-5 h-5" />
                 </motion.button>
               )}
            </AnimatePresence>
          </div>
        </div>
      </form>

      {/* Modern Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-60"
            style={{ padding: '10px 5px 5px 5px', marginTop: '5px' }}
          >
            <div className="py-2">
              <div className="px-5 py-2 text-[12px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between" style={{ paddingBottom: '5px' }}>
                 <span>Suggestions</span>
                 <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">New</span>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {suggestions.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }} 
                    style={{ paddingBottom:'5px'}}
                  >
                    <button
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full text-left px-5 py-3 hover:bg-emerald-50/50 flex items-center gap-2 transition-all group border-l-4 border-transparent hover:border-emerald-500"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all border border-gray-100">
                         {item.type === 'generic' ? (
                            <TestTube2 className="w-5 h-5 text-blue-400" />
                         ) : (
                            <Pill className="w-5 h-5 text-emerald-500" />
                         )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                         <h4 className="text-sm font-semibold text-gray-800 group-hover:text-emerald-700 truncate">
                           {item.name}
                         </h4>
                         <p className="text-[8px] sm:text-[10px] text-gray-500 truncate flex items-center gap-1">
                            {item.manufacturer && <span>{item.manufacturer}</span>}
                            {item.type && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className="capitalize" style={{marginTop:'3px'}}>{item.type}</span>
                              </>
                            )}
                         </p>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-200">
                         <ArrowRight className="w-4 h-4 text-emerald-500" />
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
              
            </div>
            <div className='w-full flex justify-end'>
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-center">
                 <button 
                   onClick={handleSearch}
                   className="text-[8px] sm:text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1 transition-colors"
                 >
                    <span style={{ marginTop:'3px'}}>View all results for "{query}" </span> <ArrowRight className="w-3 h-3"/>
                 </button>
              </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchInput;