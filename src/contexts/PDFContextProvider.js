import React, { createContext, useState, useContext, useEffect } from 'react';
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

  // Load PDF content from localStorage on component mount
  useEffect(() => {
    try {
      // Load PDF content from localStorage
      const savedPdfContent = localStorage.getItem('pdf_content');
      if (savedPdfContent) {
        setPdfContent(JSON.parse(savedPdfContent));
      }

      // Load content stats from localStorage
      const savedContentStats = localStorage.getItem('content_stats');
      if (savedContentStats) {
        setContentStats(JSON.parse(savedContentStats));
      }

      // Load document history from localStorage
      const savedDocHistory = localStorage.getItem('document_history');
      if (savedDocHistory) {
        setDocumentHistory(JSON.parse(savedDocHistory));
      }
    } catch (error) {
      console.error('Error loading PDF data from localStorage:', error);
    }
  }, []);

  // Save PDF content to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(pdfContent).length > 0) {
      try {
        localStorage.setItem('pdf_content', JSON.stringify(pdfContent));
      } catch (error) {
        console.error('Error saving PDF content to localStorage:', error);
      }
    }
  }, [pdfContent]);

  // Save content stats to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(contentStats).length > 0) {
      try {
        localStorage.setItem('content_stats', JSON.stringify(contentStats));
      } catch (error) {
        console.error('Error saving content stats to localStorage:', error);
      }
    }
  }, [contentStats]);

  // Save document history to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(documentHistory).length > 0) {
      try {
        localStorage.setItem('document_history', JSON.stringify(documentHistory));
      } catch (error) {
        console.error('Error saving document history to localStorage:', error);
      }
    }
  }, [documentHistory]);

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
      const updatedHistory = {
        ...documentHistory,
        [category]: [
          historyEntry,
          ...(documentHistory[category] || [])
        ].slice(0, 10) // Keep last 10 entries
      };
      
      setDocumentHistory(updatedHistory);
      
      // Update PDF content for the category
      const updatedPdfContent = {
        ...pdfContent,
        [category]: {
          content: extractedText,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: timestamp,
          uploadedBy: currentUser?.email || 'Unknown user'
        }
      };
      
      setPdfContent(updatedPdfContent);
      
      // Update content stats
      const updatedContentStats = {
        ...contentStats,
        [category]: {
          pageCount,
          wordCount
        }
      };
      
      setContentStats(updatedContentStats);
      
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