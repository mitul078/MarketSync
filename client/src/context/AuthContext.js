import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Configure axios baseURL only if not in development with proxy
// In development, the proxy in package.json handles routing
// In production, use REACT_APP_API_URL or default to localhost:5000
if (process.env.REACT_APP_API_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://localhost:5000';
}

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

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
        const response = await axios.get('/api/auth/me');
        setUser(response.data.user);
      } catch (error) {
        // Not authenticated or token expired
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      const { user } = response.data;
      
      // Set state (token is stored in httpOnly cookie)
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
      const { user } = response.data;
      
      // Set state (token is stored in httpOnly cookie)
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
      // Clear state regardless of API call result
      setUser(null);
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




