import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      const response = await axios.get('http://localhost:5000/api/auth/profile', config);
      const userData = response.data;
      if (userData._id && !userData.id) {
        userData.id = userData._id;
      }
      setCurrentUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setCurrentUser(user);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setCurrentUser(user);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const config = {
          headers: {
            'x-auth-token': token
          }
        };
        await axios.post('http://localhost:5000/api/auth/logout', {}, config);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setCurrentUser(null);
    }
  };

 

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};