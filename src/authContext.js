import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { subscribeToAuthChanges, logout as logoutService } from './authService';

// Create the authentication context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to Firebase auth state changes
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges((user) => {
      if (user) {
        // User is signed in, store in state and localStorage for offline access
        setCurrentUser(user);
        try {
          // Only store necessary user data
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
          };
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
          console.error('Error storing user data in localStorage:', e);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    // If subscription fails, try to get user from localStorage as fallback
    // This helps when Firebase is unavailable but user has a cached session
    if (!navigator.onLine) {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
        setLoading(false);
      } catch (e) {
        localStorage.removeItem('user');
        setLoading(false);
      }
    }

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    try {
      // Use Firebase login (handled in authService.js)
      // The auth state listener will update currentUser
      const result = await loginWithEmailAndPassword(email, password);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutService();
      // Firebase auth listener will handle state updates
      return { error: null };
    } catch (err) {
      setError(err.message || 'Logout failed');
      throw err;
    }
  };

  // Register function
  const register = async (email, password, name) => {
    try {
      // Use Firebase registration (handled in authService.js)
      // The auth state listener will update currentUser
      const result = await registerWithEmailAndPassword(email, password);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.user;
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
    setError,
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
  const location = useLocation();

  useEffect(() => {
    // Only redirect after loading is complete and user is not authenticated
    if (!loading && !isAuthenticated) {
      // Save the attempted URL for redirecting after login
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, loading, navigate, location]);

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render children only if authenticated
  return isAuthenticated ? children : null;
};