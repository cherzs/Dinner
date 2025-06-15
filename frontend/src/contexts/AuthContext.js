import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set axios baseURL dari environment variable
axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isUserFromCache, setIsUserFromCache] = useState(false);

  // Configure axios to include token in requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user profile on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/profile');
          setCurrentUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setIsUserFromCache(false);
        } catch (error) {
          console.error('Failed to load user:', error);
          // Fallback: ambil user dari localStorage jika ada
          const cachedUser = localStorage.getItem('user');
          if (cachedUser) {
            setCurrentUser(JSON.parse(cachedUser));
            setIsUserFromCache(true);
          } else {
            setCurrentUser(null);
            setIsUserFromCache(false);
          }
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(access_token);
      setCurrentUser(user);
      setIsUserFromCache(false);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/register', userData);
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(access_token);
      setCurrentUser(user);
      setIsUserFromCache(false);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    setIsUserFromCache(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    isUserFromCache
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 