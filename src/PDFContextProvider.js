import React, { createContext, useState, useEffect, useContext } from 'react';
import { AppContext } from './App';

// Create a context for PDF document data
export const PDFContext = createContext();

const PDFContextProvider = ({ children }) => {
  const { selectedCategory } = useContext(AppContext);
  const [pdfContent, setPdfContent] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [contentStats, setContentStats] = useState({});

  // Load PDF content from localStorage when category changes
  useEffect(() => {
    if (selectedCategory) {
      setIsLoading(true);
      
      // Try to get the stored file data from localStorage
      const storedFileData = localStorage.getItem(`file_${selectedCategory.title}`);
      
      if (storedFileData) {
        try {
          const fileData = JSON.parse(storedFileData);
          
          // Calculate some basic stats about the content
          const stats = {
            characterCount: fileData.content.length,
            wordCount: fileData.content.split(/\s+/).filter(Boolean).length,
            pageCount: fileData.pageCount || (fileData.content.split('--- Page').length - 1),
            parseDate: fileData.parseDate || new Date().toISOString()
          };
          
          // Update the content stats
          setContentStats(prev => ({
            ...prev,
            [selectedCategory.title]: stats
          }));
          
          // Update the PDF content for the current category
          setPdfContent(prev => ({
            ...prev,
            [selectedCategory.title]: fileData
          }));
          
          console.log(`Loaded document for ${selectedCategory.title}: ${fileData.name} (${stats.wordCount} words, ${stats.pageCount} pages)`);
        } catch (error) {
          console.error("Error parsing stored PDF data:", error);
        }
      } else {
        console.log(`No document found for ${selectedCategory.title}`);
      }
      
      setIsLoading(false);
    }
  }, [selectedCategory]);

  // For the OpenAI API integration, we'll pass the document content
  const getContextForQuery = async (query) => {
    if (!selectedCategory) return null;
    
    const categoryData = pdfContent[selectedCategory.title];
    if (!categoryData) return null;
    
    // Simple keyword-based text chunking
    // In a production environment, you might want to implement a more sophisticated
    // chunking strategy or use a vector database for semantic search
    if (query && categoryData.content.length > 10000) {
      // Split the content into chunks (pages)
      const pages = categoryData.content.split('--- Page');
      
      // Extract keywords from the query (words with 4+ characters)
      const keywords = query.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length >= 4);
      
      if (keywords.length > 0) {
        // Score each page based on keyword occurrences
        const scoredPages = pages.map((page, index) => {
          if (index === 0 && !page.trim()) return { index, score: 0, content: '' };
          
          const pageContent = page.toLowerCase();
          let score = 0;
          
          keywords.forEach(keyword => {
            const matches = pageContent.match(new RegExp(keyword, 'g'));
            if (matches) {
              score += matches.length;
            }
          });
          
          return { index, score, content: page };
        });
        
        // Sort pages by score and take the top 3-5 most relevant pages
        const relevantPages = scoredPages
          .filter(page => page.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
        
        // If we found relevant pages, return only those
        if (relevantPages.length > 0) {
          const relevantContent = 
            "The following sections from the document seem most relevant to your query:\n\n" +
            relevantPages.map(page => page.content).join('\n');
          
          return {
            documentContent: relevantContent,
            documentName: categoryData.name,
            category: selectedCategory.title,
            isPartial: true
          };
        }
      }
    }
    
    // Return the complete content of the PDF if no relevant chunks found or content is small
    return {
      documentContent: categoryData.content,
      documentName: categoryData.name,
      category: selectedCategory.title,
      isPartial: false
    };
  };

  return (
    <PDFContext.Provider 
      value={{ 
        pdfContent, 
        isLoading, 
        contentStats,
        getContextForQuery 
      }}
    >
      {children}
    </PDFContext.Provider>
  );
};

export default PDFContextProvider;