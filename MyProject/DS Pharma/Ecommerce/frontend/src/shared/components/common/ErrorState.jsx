import React from 'react';
import { RefreshCw } from 'lucide-react';

const ErrorState = ({ message = 'Something went wrong', onRetry, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-lg ${className}`}>
      <div className="text-red-500 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          <RefreshCw size={18} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
