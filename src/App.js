// Import polyfill first
import './utils/polyfill';  

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import styles
import './styles/modalStyles.css';
import './styles/App.css';

// Import context providers
import PDFContextProvider from './contexts/PDFContextProvider';
import { AuthProvider, RequireAuth } from './contexts/authContext';
import AppContextProvider from './contexts/AppContext';

// Import components
import ChatApp from './components/ChatApp/ChatApp';
import SettingsWrapper from './components/Settings/SettingsWrapper';
import LoginPage from './pages/loginPage';
import UserManagement from './features/user-management/UserManagement';

// Main App component
function App() {
  // Check that process polyfill is loaded
  console.log('Environment:', window.process?.env?.NODE_ENV || 'polyfill not loaded');
  
  return (
    <AuthProvider>
      <AppContextProvider>
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
      </AppContextProvider>
    </AuthProvider>
  );
}

export default App;