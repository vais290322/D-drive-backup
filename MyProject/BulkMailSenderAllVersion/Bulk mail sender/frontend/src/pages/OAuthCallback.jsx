import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

// const API_URL = 'http://localhost:6085/api';
const API_URL = 'https://server2.vais.co.in/testb/api';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Fetch user info with the token
      axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.data.success) {
          login(token, res.data.user);
          toast.success(`Welcome, ${res.data.user.name}!`);
          navigate('/');
        }
      }).catch(() => {
        toast.error('Google login failed. Please try again.');
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
