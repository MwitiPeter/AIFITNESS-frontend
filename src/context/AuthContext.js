import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

const getAuthErrorMessage = (error, fallbackMessage) => {
  const status = error?.response?.status;

  if (status === 502 || status === 503 || status === 504) {
    return 'Backend is waking up or temporarily unavailable. Please wait a few seconds and try again.';
  }

  if (!error?.response) {
    return 'Unable to reach the server. Please check your connection and try again in a few seconds.';
  }

  return error.response?.data?.message || fallbackMessage;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
    // eslint-disable-next-line
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token: newToken, ...userInfo } = response.data.data; // Changed variable name
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userInfo); // Changed variable name
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: getAuthErrorMessage(error, 'Registration failed')
      };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token: newToken, ...userInfo } = response.data.data; // Changed variable name
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userInfo); // Changed variable name
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: getAuthErrorMessage(error, 'Login failed')
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};