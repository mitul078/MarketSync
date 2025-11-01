import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Configure axios baseURL only if not in development with proxy
// In development, the proxy in package.json handles routing
// In production, use REACT_APP_API_URL or default to production server URL
if (process.env.REACT_APP_API_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://marketsync01.onrender.com';
}

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

// Add axios interceptor to attach token to requests
axios.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and user data on 401
      localStorage.removeItem('token');
      // Note: User state will be cleared by the AuthContext
    }
    return Promise.reject(error);
  }
);

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

  useEffect(() => {
    // Check if user is authenticated by calling /me endpoint
    const checkAuth = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        const response = await axios.get('/api/auth/me');
        setUser(response.data.user);
      } catch (error) {
        // Not authenticated or token expired
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      const { user, token } = response.data;
      
      // Store token in localStorage for Authorization header fallback
      if (token) {
        localStorage.setItem('token', token);
      }
      
      // Set state (token is stored in httpOnly cookie AND localStorage)
      setUser(user);
      
      return { user };
    } catch (error) {
      console.error('Login error:', error);
      // Re-throw to let component handle it
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post('/api/auth/signup', userData);
      const { user, token } = response.data;
      
      // Store token in localStorage for Authorization header fallback
      if (token) {
        localStorage.setItem('token', token);
      }
      
      // Set state (token is stored in httpOnly cookie AND localStorage)
      setUser(user);
      
      return { user };
    } catch (error) {
      console.error('Signup error:', error);
      // Re-throw to let component handle it
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear cookie
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state and token regardless of API call result
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;




