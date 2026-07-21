import { Search, X } from 'lucide-react';

export const SearchBar = ({ className = '', onClick, isOpen }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <button
        onClick={onClick}
        aria-label={isOpen ? "Close search" : "Open search"}
        className="w-full h-full rounded-full bg-white flex items-center justify-center border-none cursor-pointer transition-all duration-200 outline-none hover:scale-105 shadow-sm"
      >
        {isOpen ? (
          <X size={18} strokeWidth={2.5} color="#000000" />
        ) : (
          <Search size={18} strokeWidth={2.5} color="#000000" />
        )}
      </button>
    </div>
  );
};
