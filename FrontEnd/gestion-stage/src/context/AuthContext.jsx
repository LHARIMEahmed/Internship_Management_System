// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (via token in localStorage)
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // Set default auth header for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify token and get user info
          const response = await axios.get('http://localhost:8080/auth/me', {
            withCredentials: true
          });
          
          setCurrentUser(response.data);
        }
      } catch (err) {
        // Token might be invalid or expired
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
        console.error("Authentication check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:8080/auth/login', 
        { username, password },
        { withCredentials: true }
      );
      
      const { token, ...userData } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint if you have one
      await axios.post('http://localhost:8080/auth/logout', {}, {
        withCredentials: true
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Remove token and user data
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
      setCurrentUser(null);
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!currentUser) return false;
    return currentUser.role === role;
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;