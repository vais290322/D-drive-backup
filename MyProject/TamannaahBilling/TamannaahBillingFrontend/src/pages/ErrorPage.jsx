import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-slate-700 rounded-xl shadow-2xl overflow-hidden border border-slate-600">
        {/* Error Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-center border-b border-slate-600">
          <FaExclamationTriangle className="text-teal-300 text-6xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Oops! Something went wrong</h1>
          <p className="text-teal-300">We can't seem to find the page you're looking for</p>
        </div>

        {/* Error Content */}
        <div className="p-8 text-center">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Error 404: Page Not Found</h2>
            <p className="text-slate-300 mb-6">
              The page you are looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </p>
            <div className="w-full max-w-xs mx-auto h-40 bg-slate-800 rounded-lg flex items-center justify-center mb-6 border border-slate-600">
              <div className="text-teal-300 text-5xl font-bold">404</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="flex items-center cursor-pointer justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
            >
              <FaHome /> Go to Home
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center cursor-pointer justify-center gap-2 px-6 py-3 border border-slate-600 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-all"
            >
              <FaArrowLeft /> Go Back
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800 px-6 py-4 text-center border-t border-slate-600">
          <p className="text-sm text-slate-400">
            If you think this is a mistake, please contact support
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;