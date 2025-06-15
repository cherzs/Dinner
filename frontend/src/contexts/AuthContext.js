import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set axios baseURL from environment variable
axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';
// Enable credentials for session cookies
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserFromCache, setIsUserFromCache] = useState(false);

  // Load user profile on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await axios.get('/api/profile');
        setCurrentUser(response.data.user);
        setIsUserFromCache(false);
      } catch (error) {
        console.error('Failed to load user:', error);
        setCurrentUser(null);
        setIsUserFromCache(false);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/login', { username, password });
      const { user } = response.data;
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
      const { user } = response.data;
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

  const logout = async () => {
    try {
      await axios.post('/api/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      setIsUserFromCache(false);
    }
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