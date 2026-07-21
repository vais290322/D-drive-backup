import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '@/context/AuthContext';

const GithubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { githubLogin } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code) {
      handleGithubLogin(code);
    } else {
      setError('No authorization code provided by GitHub.');
    }
  }, [searchParams]);

  const handleGithubLogin = async (code) => {
    try {
      await githubLogin(code);
      navigate('/home');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to login with GitHub.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 max-w-md w-full text-center">
        {!error ? (
          <div>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authenticating</h2>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we log you in securely via GitHub...</p>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-500 text-3xl font-bold">!</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authentication Failed</h2>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GithubCallback;
