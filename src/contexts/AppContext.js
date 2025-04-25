import React, { createContext, useState } from 'react';

// Create AppContext for sharing state between components
export const AppContext = createContext();

// AppContext Provider component
export const AppContextProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(true);
  
  const updateSelectedCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <AppContext.Provider value={{ 
      selectedCategory, 
      updateSelectedCategory, 
      showModal, 
      setShowModal 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;