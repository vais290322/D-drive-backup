import React from 'react';

const Footer = () => {
  return (
    <div className='text-center border-t p-4 ' >
      <span>Copyright </span>
      <span>&copy; {new Date().getFullYear()} </span>
      <span>All rights reserved | <span className='text-[#452B90] font-bold text-md' >Webbixel</span> </span>
    </div>
  );
};

export default Footer;
