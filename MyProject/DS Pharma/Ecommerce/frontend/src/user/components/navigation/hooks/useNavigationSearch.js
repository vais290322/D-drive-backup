import { useState, useEffect, useRef } from "react";
import searchService from "@/services/api/searchService";

/**
 * Hook to manage navigation search functionality
 */
export const useNavigationSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(async () => {
        try {
          const response = await searchService.getSuggestions(searchQuery);
          setSearchResults(response.data || []);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        }
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isSearchOpen,
    setIsSearchOpen,
    selectedIndex,
    setSelectedIndex,
    searchRef,
    searchInputRef,
  };
};
