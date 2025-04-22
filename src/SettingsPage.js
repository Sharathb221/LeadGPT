import React, { useState, useEffect, useCallback } from 'react';
import APISettings from './APISettings';
import { extractTextFromPDF, validatePDFFile } from './pdfUtils';

const SettingsPage = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('Student App');
  
  // State for product owners
  const [l1SPOC, setL1SPOC] = useState('');
  const [l2SPOC, setL2SPOC] = useState('');
  
  // State for file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [lastUploaded, setLastUploaded] = useState(null);
  
  // State for changelog
  const [changeLog, setChangeLog] = useState([]);
  
  // State for file parsing
  const [parsingStatus, setParsingStatus] = useState('');
  
  // List of available tabs with active state
  const tabs = [
    { name: 'Student App', active: true },
    { name: 'Teacher App', active: false },
    { name: 'Active Teach', active: false },
    { name: 'Orders and Billing', active: false },
    { name: 'Lead Group Academy', active: false }
  ];
  
  // Save current settings to localStorage - using useCallback to memoize this function
  const saveToLocalStorage = useCallback((updatedChangeLog, lastUploadDate) => {
    const dataToSave = {
      l1SPOC,
      l2SPOC,
      uploadSuccess: true,
      lastUploaded: lastUploadDate || lastUploaded,
      changeLog: updatedChangeLog || changeLog
    };
    
    localStorage.setItem(`settings_${activeTab}`, JSON.stringify(dataToSave));
  }, [l1SPOC, l2SPOC, lastUploaded, changeLog, activeTab]);
  
  // Function to handle tab change
  const handleTabChange = (tab) => {
    if (!tab.active) return; // Prevent changing to inactive tabs
    
    setActiveTab(tab.name);
    
    // Load data from localStorage if exists
    const savedData = localStorage.getItem(`settings_${tab.name}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      setL1SPOC(data.l1SPOC || '');
      setL2SPOC(data.l2SPOC || '');
      setUploadSuccess(data.uploadSuccess || false);
      setLastUploaded(data.lastUploaded || null);
      setChangeLog(data.changeLog || []);
    } else {
      // Reset states when changing tabs if no saved data
      setL1SPOC('');
      setL2SPOC('');
      setUploadSuccess(false);
      setSelectedFile(null);
      setChangeLog([]);
    }
  };
  
  // Function to handle file selection
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate the PDF file
      const validation = validatePDFFile(file);
      
      if (validation.valid) {
        setSelectedFile(file);
        setParsingStatus('');
      } else {
        setSelectedFile(null);
        setParsingStatus(`Error: ${validation.error}`);
      }
    }
  };
  
  // Function to handle file upload
  const handleUpload = async () => {
    if (selectedFile) {
      setParsingStatus('Parsing document...');
      
      try {
        // Extract text from the PDF using our utility function
        const extractedText = await extractTextFromPDF(selectedFile);
        
        // Create file data object with the extracted text
        const fileData = {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          content: extractedText
        };
        
        // Store in localStorage - this will overwrite any existing file for this tab
        localStorage.setItem(`file_${activeTab}`, JSON.stringify(fileData));
        
        // Update UI states - always set to true on successful upload
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        setUploadSuccess(true);
        setLastUploaded(currentDate);
        setParsingStatus('Document parsed successfully!');
        
        // Create a new entry for the changelog
        const newEntry = {
          document: 'Product Documentation',
          fileName: selectedFile.name,
          uploadedBy: l1SPOC.split(' ')[0] || 'User',
          timestamp: currentTime,
          date: currentDate
        };
        
        // Always add the new entry to the beginning of the changelog
        const updatedChangeLog = [newEntry, ...changeLog];
        setChangeLog(updatedChangeLog);
        
        // Save all settings to localStorage
        saveToLocalStorage(updatedChangeLog, currentDate);
        
        // Clear selected file to reset the UI
        setSelectedFile(null);
        
        // Clear status message after delay
        setTimeout(() => {
          setParsingStatus('');
        }, 3000);
      } catch (error) {
        console.error("Error processing PDF:", error);
        setParsingStatus(`Error: ${error.message}`);
      }
    }
  };
  
  // Update localStorage when l1/l2 SPOC changes
  useEffect(() => {
    if (l1SPOC || l2SPOC) {
      saveToLocalStorage();
    }
  }, [l1SPOC, l2SPOC, saveToLocalStorage]);
  
  // Load initial data when component mounts
  useEffect(() => {
    // Load settings for the active tab
    const savedData = localStorage.getItem(`settings_${activeTab}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      setL1SPOC(data.l1SPOC || '');
      setL2SPOC(data.l2SPOC || '');
      setUploadSuccess(data.uploadSuccess || false);
      setLastUploaded(data.lastUploaded || null);
      setChangeLog(data.changeLog || []);
    }
  }, [activeTab]);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-30 h-16 border-b border-gray-200 px-6 flex items-center bg-white">
        <h1 className="text-xl font-semibold text-gray-800">
          LEAD GPT 1.0 <span role="img" aria-label="sparkles">✨</span> <span className="font-normal">(Beta)</span>
        </h1>
      </header>
      
      {/* Main content */}
      <div className="flex flex-col bg-gray-50">
        {/* Tabs navigation */}
        <div className="flex bg-white border-b border-gray-200">
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className={`px-6 py-3 ${
                !tab.active ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'
              } ${
                activeTab === tab.name && tab.active
                  ? 'text-indigo-700 font-semibold border-b-2 border-indigo-700 pb-2' 
                  : tab.active ? 'text-gray-600 hover:text-indigo-700 pb-2.5' : 'pb-2.5'
              }`}
              onClick={() => tab.active && handleTabChange(tab)}
            >
              {tab.name}
            </div>
          ))}
        </div>
        
        {/* Settings content */}
        <div className="pl-6 pr-8 py-8 w-full">
          {/* Product Owners section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Owners</h3>
            <div className="flex gap-5 flex-wrap">
              <div className="relative w-72">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm bg-white"
                    placeholder="Select L1 SPOC"
                    value={l1SPOC}
                    onChange={(e) => setL1SPOC(e.target.value)}
                  />
                  <span className="absolute right-4 top-3.5 text-gray-400 text-xs">▼</span>
                </div>
              </div>
              
              <div className="relative w-72">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-md shadow-sm bg-white"
                    placeholder="Select L2 SPOC"
                    value={l2SPOC}
                    onChange={(e) => setL2SPOC(e.target.value)}
                  />
                  <span className="absolute right-4 top-3.5 text-gray-400 text-xs">▼</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Documentation section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Documentation</h3>
            <div className="flex gap-5 flex-wrap">
              {/* Upload panel */}
              <div className="flex-1 min-w-[300px] bg-white rounded-lg shadow-sm p-5">
                <div className="flex flex-col items-center justify-center py-8">
                  <div className={`w-16 h-16 flex items-center justify-center rounded text-white text-2xl mb-5 ${
                    uploadSuccess ? 'bg-green-500' : 'bg-amber-500'
                  }`}>
                    {uploadSuccess ? "✓" : "↑"}
                  </div>
                  
                  {uploadSuccess && (
                    <div className="text-sm text-gray-500 mb-5">
                      Last uploaded on {lastUploaded}
                    </div>
                  )}
                  
                  <button
                    className="bg-indigo-700 text-white px-5 py-2.5 rounded font-medium text-sm"
                    onClick={() => document.getElementById('file-input').click()}
                  >
                    {uploadSuccess ? 'Re-Upload Product Documentation' : 'Upload Product Documentation'}
                  </button>
                  
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  
                  {selectedFile && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600 mb-2">Selected: {selectedFile.name}</p>
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded text-sm"
                        onClick={handleUpload}
                      >
                        Confirm Upload
                      </button>
                    </div>
                  )}
                  
                  {parsingStatus && (
                    <div className={`mt-3 text-sm ${parsingStatus.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                      {parsingStatus}
                    </div>
                  )}
                  
                  <div className="mt-4 text-xs text-gray-500 text-center">
                    <p>Currently supporting PDF files only</p>
                    <p>Max file size: 10MB</p>
                  </div>
                </div>
              </div>
              
              {/* Changelog panel */}
              <div className="flex-1 min-w-[300px] bg-white rounded-lg shadow-sm p-5">
                <h4 className="font-semibold text-gray-800 pb-3 border-b border-gray-100 mb-4">
                  Documentation Change Log
                </h4>
                
                {changeLog.length > 0 ? (
                  <div>
                    {changeLog.map((entry, index) => (
                      <div key={index} className="py-3 border-b border-gray-50">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            <p>Document uploaded by <span className="font-semibold">{entry.uploadedBy}</span></p>
                            {entry.fileName && <p className="text-xs text-gray-500 mt-1">{entry.fileName}</p>}
                          </div>
                          <div className="text-xs text-gray-400">{entry.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-40 text-gray-400">
                    <p>Wow. Much empty <span role="img" aria-label="box">📦</span></p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* OpenAI API Configuration section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">OpenAI API Configuration</h3>
            <div className="bg-white rounded-lg shadow-sm">
              <APISettings />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;