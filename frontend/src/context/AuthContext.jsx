// React context hooks for managing global authentication state across pages
import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

// Create React context container for authentication state
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Load user data on mount if token exists in storage
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          setUser(res.data.user);
        } catch (err) {
          console.error('[AuthContext] Error fetching profile:', err);
          logout(); // Clear invalid or expired tokens
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  // Login handler: Saves JWT token to state and localStorage
  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { token: authToken, user: userData } = res.data;
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(userData);
    return userData;
  };

  // Register handler: Registers account and saves JWT token
  const register = async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    const { token: authToken, user: userData } = res.data;
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(userData);
    return userData;
  };

  // Logout handler: Removes token from localStorage and resets state
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to AuthContext
export const useAuth = () => useContext(AuthContext);
