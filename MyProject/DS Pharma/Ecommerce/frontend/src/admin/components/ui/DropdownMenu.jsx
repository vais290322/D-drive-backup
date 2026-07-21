import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { cn } from '../../utils/cn';

const DropdownContext = createContext(null);

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={dropdownRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

const DropdownMenuTrigger = ({ children, className, ...props }) => {
  const { isOpen, setIsOpen } = useContext(DropdownContext);
  
  return (
    <div 
        onClick={() => setIsOpen(!isOpen)} 
        className={cn("cursor-pointer", className)}
        {...props}
    >
      {children}
    </div>
  );
};

const DropdownMenuContent = ({ children, className, align = 'end', ...props }) => {
  const { isOpen } = useContext(DropdownContext);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md animate-in data-[side=bottom]:slide-in-from-top-2",
        align === 'end' ? 'right-0' : 'left-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ children, className, onClick, ...props }) => {
    const { setIsOpen } = useContext(DropdownContext);
    
    const handleClick = (e) => {
        setIsOpen(false);
        if (onClick) onClick(e);
    };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-[12px] outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownMenuLabel = ({ children, className, ...props }) => (
  <div
    className={cn("px-2 py-1.5 text-[12px] font-semibold", className)}
    {...props}
  >
    {children}
  </div>
);

const DropdownMenuSeparator = ({ className, ...props }) => (
  <div
    className={cn("-mx-1 my-1 h-px bg-gray-100", className)}
    {...props}
  />
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
