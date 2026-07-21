import React, { useState, useEffect } from 'react';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  // Error handling using try-catch in a useEffect-like setup
  useEffect(() => {
    const handleError = (error, errorInfo) => {
      setHasError(true);
      setErrorInfo(errorInfo);
      console.error("Error caught in ErrorBoundary:", error, errorInfo);
    };

    // You can catch errors globally using window.onerror or using event listeners
    window.onerror = handleError;

    return () => {
      // Clean up the event listener when the component unmounts
      window.onerror = null;
    };
  }, []);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
        <div className="max-w-lg p-6 bg-white rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-3xl font-semibold text-red-600 mb-4">Something went wrong.</h2>
          <p className="text-xl text-gray-700 mb-4">Please try again later.</p>
          {errorInfo && (
            <details className="mt-4 p-4 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-600">
              <summary className="font-semibold text-gray-800">Error Details</summary>
              <pre className="whitespace-pre-wrap break-words">{errorInfo}</pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return children;
};

export default ErrorBoundary;
