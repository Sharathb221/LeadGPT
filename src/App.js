// Import polyfill first
import './polyfill';  

import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import styles
import './modalStyles.css';
import './App.css';

// Import context providers
import PDFContextProvider from './PDFContextProvider';
import { AuthProvider, RequireAuth } from './authContext';

// Direct imports to avoid issues
import ChatApp from './components/ChatApp/ChatApp';
import SettingsWrapper from './components/Settings/SettingsWrapper';
import LoginPage from './loginPage';
import ProfilePage from './ProfilePage';
import UserManagement from './UserManagement';

// Create AppContext for sharing state between components
export const AppContext = createContext();

// Main App component
function App() {
  // App-level state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(true);
  
  // Function to update the selected category
  const updateSelectedCategory = (category) => {
    setSelectedCategory(category);
  };
  
  // Check that process polyfill is loaded
  console.log('Environment:', window.process?.env?.NODE_ENV || 'polyfill not loaded');
  
  return (
    <AuthProvider>
      <AppContext.Provider value={{ 
        selectedCategory, 
        updateSelectedCategory, 
        showModal, 
        setShowModal 
      }}>
        <PDFContextProvider>
          <Router>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <RequireAuth>
                  <ChatApp />
                </RequireAuth>
              } />
              <Route path="/settings" element={
                <RequireAuth>
                  <SettingsWrapper />
                </RequireAuth>
              } />
              <Route path="/profile" element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              } />
              <Route path="/user-management" element={
                <RequireAuth>
                  <UserManagement />
                </RequireAuth>
              } />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </PDFContextProvider>
      </AppContext.Provider>
    </AuthProvider>
  );
}

// Export App as the default export
export default App;