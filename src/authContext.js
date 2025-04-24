import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithGoogle, 
  loginWithEmailAndPassword, 
  registerWithEmailAndPassword, 
  logout as firebaseLogout,
  subscribeToAuthChanges,
  updateUserInLocalStorage 
} from './authService';

// Create the authentication context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    // First check localStorage for saved user data for quick UI rendering
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        // Handle invalid JSON in localStorage
        localStorage.removeItem('user');
      }
    }

    // Then subscribe to Firebase auth state changes for full auth state
    const unsubscribe = subscribeToAuthChanges((user) => {
      if (user) {
        // User is signed in, update state and localStorage
        const userData = {
          id: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL || null,
          emailVerified: user.emailVerified,
          // Include any additional properties from Firestore
          role: user.customData?.role || 'User',
          department: user.customData?.department,
          ...user.customData
        };
        setCurrentUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // User is signed out
        setCurrentUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  // Google login function
  const loginWithGoogle = async () => {
    setError(null);
    try {
      const { user, error } = await signInWithGoogle();
      if (error) {
        setError(error);
        return { user: null, error };
      }
      
      if (user) {
        // Extract relevant user data
        const userData = {
          id: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL || null,
          role: user.customData?.role || 'User',
          ...user.customData
        };
        
        setCurrentUser(userData);
        return { user: userData, error: null };
      }
      
      return { user: null, error: 'Authentication failed' };
    } catch (err) {
      const errorMessage = err.message || 'Authentication failed';
      setError(errorMessage);
      return { user: null, error: errorMessage };
    }
  };

  // Email login function
  const login = async (email, password) => {
    setError(null);
    try {
      const { user, error } = await loginWithEmailAndPassword(email, password);
      if (error) {
        setError(error);
        return { user: null, error };
      }
      
      if (user) {
        // Extract relevant user data
        const userData = {
          id: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL || null,
          role: user.customData?.role || 'User',
          ...user.customData
        };
        
        setCurrentUser(userData);
        return { user: userData, error: null };
      }
      
      return { user: null, error: 'Authentication failed' };
    } catch (err) {
      const errorMessage = err.message || 'Authentication failed';
      setError(errorMessage);
      return { user: null, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await firebaseLogout();
      setCurrentUser(null);
      return { error: null };
    } catch (err) {
      setError(err.message || 'Logout failed');
      return { error: err.message || 'Logout failed' };
    }
  };

  // Register function
  const register = async (email, password, name) => {
    setError(null);
    try {
      const { user, error } = await registerWithEmailAndPassword(email, password, name);
      if (error) {
        setError(error);
        return { user: null, error };
      }
      
      if (user) {
        // Extract relevant user data
        const userData = {
          id: user.uid,
          email: user.email,
          displayName: name || user.email.split('@')[0],
          photoURL: user.photoURL || null,
          role: user.customData?.role || 'User',
          ...user.customData
        };
        
        setCurrentUser(userData);
        return { user: userData, error: null };
      }
      
      return { user: null, error: 'Registration failed' };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { user: null, error: errorMessage };
    }
  };

  // Update user information
  const updateUserInfo = (userData) => {
    // Update the current user state
    setCurrentUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
    
    // Update localStorage
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  };

  // Value to be provided to consumers of this context
  const value = {
    currentUser,
    loading,
    error,
    setError,
    loginWithGoogle,
    login,
    logout,
    register,
    updateUserInfo,
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