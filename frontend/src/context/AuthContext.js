import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get search params from URL
  const getSearchParams = () => {
    return new URLSearchParams(window.location.search);
  };

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const searchParams = getSearchParams();
      const tokenFromUrl = searchParams.get('token');
      const error = searchParams.get('error');

      // Handle error from OAuth
      if (error) {
        let errorMessage = 'An error occurred during login.';
        if (error === 'auth_failed') {
          errorMessage = 'Authentication failed. Please try again.';
        } else if (error === 'oauth_not_configured' || error === 'invalid_client') {
          errorMessage = 'Google OAuth is not configured. Please use Email Login or see GOOGLE_OAUTH_SETUP.md for setup instructions.';
        } else if (error === 'oauth_error') {
          errorMessage = 'Google OAuth error. Please check your credentials in backend/.env file. See GOOGLE_OAUTH_SETUP.md for help.';
        } else if (error === 'token_error') {
          errorMessage = 'Token generation failed. Please try again.';
        }
        toast.error(errorMessage, { duration: 6000 });
        window.history.replaceState({}, document.title, '/login');
        setLoading(false);
        return;
      }

      if (tokenFromUrl) {
        localStorage.setItem('token', tokenFromUrl);
        window.history.replaceState({}, document.title, '/');
        await fetchUser();
      } else if (token) {
        await fetchUser();
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    // Google OAuth login
    window.location.href = `${API_URL}/auth/google`;
  };

  const loginWithEmail = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      await fetchUser();
      return { success: true, user: response.data.user };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const registerWithEmail = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      await fetchUser();
      return { success: true, user: response.data.user };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    // Use window.location instead of navigate since we're outside Router
    window.location.href = '/login';
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    loading,
    login,
    loginWithEmail,
    registerWithEmail,
    logout,
    fetchUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

