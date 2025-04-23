import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the authentication context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    // Check localStorage for saved user data
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        // Handle invalid JSON in localStorage
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    try {
      // Simulate API call
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // For demo purposes, accept any valid-looking email/password
      // In production, you would validate against a real backend
      if (email.includes('@') && password.length >= 6) {
        const userData = {
          id: 'user-123',
          email,
          name: email.split('@')[0],
          role: 'user'
        };
        
        // Save to localStorage for persistence
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
        return userData;
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Register function (for future implementation)
  const register = async (email, password, name) => {
    // This would connect to your backend registration API
    // For now, just simulate success
    try {
      const userData = {
        id: 'user-' + Date.now(),
        email,
        name,
        role: 'user'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  // Value to be provided to consumers of this context
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth guard component that redirects to login if not authenticated
export const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null;
};