import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';  // Import the custom hook

const Footer = () => {
  const { theme, toggleTheme } = useTheme();  // Destructure theme and toggleTheme from useTheme

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
  };

  return (
    <footer
      className={`w-full py-12 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#111827] text-[#f5f5f5]' : 'bg-white text-[#333333]'
      }`}
    > 
      <div className="max-w-7xl mx-auto px-4">
        {/* Dark Mode Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleTheme}  // Call toggleTheme to switch between themes
            className={`px-4 py-2 rounded-md transition ${
              theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Logo and Social */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-6 h-6" />
              <span className="text-xl font-bold">Vais</span>
            </div>
            <p className="text-sm opacity-80">
            At Vais Engineering, we transform ideas into vibrant,
user-friendly websites. Combining aesthetic appeal with
seamless functionality.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['About Us', 'Services', 'Products', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm hover:underline transition-all">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <p className="text-sm">123 Tech Street, Silicon Valley, CA 94025</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">contact@techcorp.com</p>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-sm mb-4">Subscribe to our newsletter for updates.</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`flex-1 px-4 py-2 rounded-l-md text-gray-900 ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
                  } border`}
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md transition-colors text-white"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-opacity-20 text-sm">
          <p>© {new Date().getFullYear()} Vais Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
