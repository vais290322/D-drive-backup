import React from 'react';

const FooterComponent = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 absolute bottom-0 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="footer-col">
            <h4 className="text-lg font-semibold mb-4 relative before:content-[''] before:absolute before:left-0 before:bottom-[-10px] before:bg-pink-500 before:h-[2px] before:box-border before:w-[50px]">About Us</h4>
            <p className="text-gray-400">
              We are a team of passionate developers creating amazing web experiences.
            </p>
          </div>
          <div className="footer-col">
            <h4 className="text-lg font-semibold mb-4 relative before:content-[''] before:absolute before:left-0 before:bottom-[-10px] before:bg-pink-500 before:h-[2px] before:box-border before:w-[50px]">Contact Us</h4>
            <ul>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white transition-all duration-300">Email: contact@example.com</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white transition-all duration-300">Phone: +123 456 7890</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="text-lg font-semibold mb-4 relative before:content-[''] before:absolute before:left-0 before:bottom-[-10px] before:bg-pink-500 before:h-[2px] before:box-border before:w-[50px]">Quick Links</h4>
            <ul>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white transition-all duration-300">Home</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white transition-all duration-300">Services</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white transition-all duration-300">About</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-white transition-all duration-300">Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="text-lg font-semibold mb-4 relative before:content-[''] before:absolute before:left-0 before:bottom-[-10px] before:bg-pink-500 before:h-[2px] before:box-border before:w-[50px]">Follow Us</h4>
            <div className="social-links">
              <a href="#" className="inline-block h-10 w-10 bg-gray-700 text-center leading-10 rounded-full my-0 mx-2 transition-all duration-500 hover:text-white hover:bg-pink-500"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="inline-block h-10 w-10 bg-gray-700 text-center leading-10 rounded-full my-0 mx-2 transition-all duration-500 hover:text-white hover:bg-pink-500"><i className="fab fa-twitter"></i></a>
              <a href="#" className="inline-block h-10 w-10 bg-gray-700 text-center leading-10 rounded-full my-0 mx-2 transition-all duration-500 hover:text-white hover:bg-pink-500"><i className="fab fa-instagram"></i></a>
              <a href="#" className="inline-block h-10 w-10 bg-gray-700 text-center leading-10 rounded-full my-0 mx-2 transition-all duration-500 hover:text-white hover:bg-pink-500"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-500">&copy; 2024 YourCompany. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;