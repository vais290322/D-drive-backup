import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Gyrotrope' }}>
              Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-8" style={{ fontFamily: 'Gyrotrope' }}>
              We encountered an unexpected error while rendering this page. The application remains stable, but this section couldn't be loaded.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-medium whitespace-nowrap"
                style={{ fontFamily: 'Gyrotrope' }}
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium whitespace-nowrap"
                style={{ fontFamily: 'Gyrotrope' }}
              >
                <Home className="w-4 h-4" />
                Back to Home
              </button>
            </div>

            {import.meta.env.DEV && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left overflow-auto max-h-40 border border-gray-200">
                <p className="text-xs font-mono text-gray-500 leading-tight">
                  {this.state.error && this.state.error.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
