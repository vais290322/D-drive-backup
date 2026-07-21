import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  return (
    <div className={`text-center  p-4 fixed bottom-0 w-full ${theme === "light" ? ' bg-[#242424] text-white border-t border-[#2f2f2f]' : 'bg-[#fefefe]'}  `} >
      <span>Copyright </span>
      <span>&copy; {new Date().getFullYear()} </span>
      <span>All rights reserved | <span className='text-[#452B90] font-bold text-md' >Webbixel</span> </span>
    </div>
  );
};

export default Footer;
 