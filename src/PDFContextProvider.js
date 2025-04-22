import React, { createContext, useState, useEffect, useContext } from 'react';
import { AppContext } from './App';

// Create a context for PDF document data
export const PDFContext = createContext();

const PDFContextProvider = ({ children }) => {
  const { selectedCategory } = useContext(AppContext);
  const [pdfContent, setPdfContent] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load PDF content from localStorage when category changes
  useEffect(() => {
    if (selectedCategory) {
      setIsLoading(true);
      
      // Try to get the stored file data from localStorage
      const storedFileData = localStorage.getItem(`file_${selectedCategory.title}`);
      
      if (storedFileData) {
        try {
          const fileData = JSON.parse(storedFileData);
          
          // Update the PDF content for the current category
          setPdfContent(prev => ({
            ...prev,
            [selectedCategory.title]: fileData
          }));
        } catch (error) {
          console.error("Error parsing stored PDF data:", error);
        }
      }
      
      setIsLoading(false);
    }
  }, [selectedCategory]);

  // For the OpenAI API integration, we'll pass the document content
  const getContextForQuery = async (query) => {
    if (!selectedCategory) return null;
    
    const categoryData = pdfContent[selectedCategory.title];
    if (!categoryData) return null;
    
    // Return the content of the PDF for the current category
    // In a production environment, you might want to implement a chunking strategy
    // or extract the most relevant parts of the document
    return {
      documentContent: categoryData.content,
      documentName: categoryData.name,
      category: selectedCategory.title
    };
  };

  return (
    <PDFContext.Provider 
      value={{ 
        pdfContent, 
        isLoading, 
        getContextForQuery 
      }}
    >
      {children}
    </PDFContext.Provider>
  );
};

export default PDFContextProvider;