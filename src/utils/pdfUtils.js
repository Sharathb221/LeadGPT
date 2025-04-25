// PDF utilities for real parsing

// Function to extract text from a PDF file
export const extractTextFromPDF = async (pdfFile) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = async (event) => {
          try {
            const typedArray = new Uint8Array(event.target.result);
            
            // Check if PDF.js is available 
            if (!window.pdfjsLib) {
              throw new Error('PDF.js library not found. Make sure it is loaded in your HTML.');
            }
            
            // Load the PDF using PDF.js
            const loadingTask = window.pdfjsLib.getDocument({ data: typedArray });
            const pdf = await loadingTask.promise;
            
            let extractedText = '';
            
            // Process each page and extract text
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              
              // Extract text from the page
              const pageText = textContent.items.map(item => item.str).join(' ');
              extractedText += `\n--- Page ${i} ---\n${pageText}`;
            }
            
            // Add metadata to the extracted text
            extractedText = `
            PDF Document: ${pdfFile.name}
            Pages: ${pdf.numPages}
            
            ${extractedText}
            `;
            
            resolve(extractedText);
          } catch (error) {
            reject(new Error(`Error parsing PDF: ${error.message}`));
          }
        };
        
        reader.onerror = (error) => {
          reject(new Error(`Error reading PDF file: ${error.message}`));
        };
        
        reader.readAsArrayBuffer(pdfFile);
      } catch (error) {
        reject(new Error(`Failed to extract text from PDF: ${error.message}`));
      }
    });
  };
  
  // Function to validate PDF file
  export const validatePDFFile = (file) => {
    // Check file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return {
        valid: false,
        error: 'Only PDF files are supported'
      };
    }
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds the 10MB limit'
      };
    }
    
    return {
      valid: true
    };
  };