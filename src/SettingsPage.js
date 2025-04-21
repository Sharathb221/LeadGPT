import React, { useState, useEffect } from 'react';

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
  
  // List of available tabs with active state
  const tabs = [
    { name: 'Student App', active: true },
    { name: 'Teacher App', active: false },
    { name: 'Active Teach', active: false },
    { name: 'Orders and Billing', active: false },
    { name: 'Lead Group Academy', active: false }
  ];
  
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
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Function to handle file upload
  const handleUpload = () => {
    if (selectedFile) {
      // Store file content in localStorage (in a real app, you'd upload to a server)
      const reader = new FileReader();
      reader.onload = (event) => {
        // In a real app, you might not want to store large files in localStorage
        // This is just for demo purposes
        try {
          const fileData = {
            name: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type,
            content: event.target.result.substring(0, 1000) + '...' // Truncate for localStorage
          };
          
          localStorage.setItem(`file_${activeTab}`, JSON.stringify(fileData));
          
          // Update UI states
          const currentDate = new Date().toLocaleDateString();
          setUploadSuccess(true);
          setLastUploaded(currentDate);
          
          // Add entry to changelog
          const newEntry = {
            document: 'Product Documentation',
            fileName: selectedFile.name,
            uploadedBy: l1SPOC.split(' ')[0] || 'User',
            timestamp: 'Just now',
            date: currentDate
          };
          
          const updatedChangeLog = [newEntry, ...changeLog];
          setChangeLog(updatedChangeLog);
          
          // Save all settings to localStorage
          saveToLocalStorage(updatedChangeLog, currentDate);
        } catch (error) {
          console.error("Error saving to localStorage:", error);
        }
      };
      
      reader.readAsDataURL(selectedFile);
    }
  };
  
  // Save current settings to localStorage
  const saveToLocalStorage = (updatedChangeLog, lastUploadDate) => {
    const dataToSave = {
      l1SPOC,
      l2SPOC,
      uploadSuccess: true,
      lastUploaded: lastUploadDate || lastUploaded,
      changeLog: updatedChangeLog || changeLog
    };
    
    localStorage.setItem(`settings_${activeTab}`, JSON.stringify(dataToSave));
  };
  
  // Update localStorage when l1/l2 SPOC changes
  useEffect(() => {
    if (l1SPOC || l2SPOC) {
      saveToLocalStorage();
    }
  }, [l1SPOC, l2SPOC]);
  
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
  }, []);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-30 h-16 border-b border-gray-200 px-6 flex items-center bg-white">
        <h1 className="text-xl font-semibold text-gray-800">
          LEAD GPT 1.0 ✨ <span className="font-normal">(Beta)</span>
        </h1>
      </header>
      
      {/* Main content */}
      <div className="flex flex-col bg-gray-50">
        {/* Tabs navigation - MODIFIED SPACING HERE */}
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
        
        {/* Settings content - reduced padding on the left */}
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
          <div>
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
                    accept=".pdf,.docx,.doc,.txt"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  
                  {selectedFile && !uploadSuccess && (
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
                    <p>Wow. Much empty 📦</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;