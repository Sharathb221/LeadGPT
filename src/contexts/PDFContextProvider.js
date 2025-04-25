import React, { createContext, useState, useContext } from 'react';
import { AppContext } from './AppContext';
import { extractTextFromPDF } from '../utils/pdfUtils';
import { useAuth } from './authContext';

export const PDFContext = createContext();

export const PDFContextProvider = ({ children }) => {
  const { selectedCategory } = useContext(AppContext);
  const { currentUser } = useAuth();
  const [pdfContent, setPdfContent] = useState({});
  const [contentStats, setContentStats] = useState({});
  const [documentHistory, setDocumentHistory] = useState({});

  // Function to handle PDF upload
  const handlePDFUpload = async (file, category) => {
    try {
      const extractedText = await extractTextFromPDF(file);
      
      // Calculate word count
      const wordCount = extractedText.split(/\s+/).length;
      
      // Get page count (rough estimate based on text splitting)
      const pageCount = extractedText.split('--- Page').length - 1;

      const timestamp = new Date().toISOString();
      const historyEntry = {
        fileName: file.name,
        uploadedBy: currentUser?.email || 'Unknown user',
        uploadedAt: timestamp,
        action: 'uploaded'
      };
      
      // Update document history
      setDocumentHistory(prev => ({
        ...prev,
        [category]: [
          historyEntry,
          ...(prev[category] || [])
        ].slice(0, 10) // Keep last 10 entries
      }));
      
      // Update PDF content for the category
      setPdfContent(prev => ({
        ...prev,
        [category]: {
          content: extractedText,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: timestamp,
          uploadedBy: currentUser?.email || 'Unknown user'
        }
      }));
      
      // Update content stats
      setContentStats(prev => ({
        ...prev,
        [category]: {
          pageCount,
          wordCount
        }
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error uploading PDF:', error);
      return { success: false, error: error.message };
    }
  };

  // Function to get document history for a category
  const getDocumentHistory = (category) => {
    return documentHistory[category] || [];
  };

  // Function to get relevant context for a query
  const getContextForQuery = async (query) => {
    if (!selectedCategory || !pdfContent[selectedCategory.title]) {
      return null;
    }

    const documentContent = pdfContent[selectedCategory.title].content;
    
    return {
      documentContent,
      documentName: pdfContent[selectedCategory.title].name,
      category: selectedCategory.title
    };
  };

  return (
    <PDFContext.Provider value={{
      pdfContent,
      contentStats,
      handlePDFUpload,
      getContextForQuery,
      documentHistory,
      getDocumentHistory
    }}>
      {children}
    </PDFContext.Provider>
  );
};

export default PDFContextProvider;