import React from 'react';
import { Link } from 'react-router';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <CloudArrowUpIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                VaisBucket
              </span>
            </Link>
            <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
              Secure, fast, and reliable cloud storage solutions powered by Vais Engineering Pvt Ltd.
            </p>
            <div className="flex space-x-6">
              {/* Social placeholders using text for now or generic icons */}
              <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Product</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link to="/pricing" className="text-sm leading-6 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white transition-colors">Pricing</Link>
                  </li>
                  <li>
                    <a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white transition-colors">Features</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white transition-colors">Security</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white transition-colors">API</a>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link to="/about" className="text-sm leading-6 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white transition-colors">About Us</Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-sm leading-6 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white transition-colors">Contact</Link>
                  </li>
                  <li>
                    <Link to="/blog" className="text-sm leading-6 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white transition-colors">Blog</Link>
                  </li>
                  <li>
                    <a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white transition-colors">Careers</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white transition-colors">Privacy</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white transition-colors">Terms</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm leading-6 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white transition-colors">Cookie Policy</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 dark:border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Vais Engineering Private Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;