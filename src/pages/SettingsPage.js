import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import APISettings from '../components/APISettings';
import { validatePDFFile } from '../utils/pdfUtils';
import { useAuth } from '../contexts/authContext';
import { PDFContext } from '../contexts/PDFContextProvider';
import { AppContext } from '../contexts/AppContext';
import SearchableDropdown from '../features/user-management/SearchableDropdown';

// Define the component
const SettingsPage = () => {
  const { currentUser } = useAuth();
  const { selectedCategory } = useContext(AppContext);
  const { handlePDFUpload, pdfContent, contentStats } = useContext(PDFContext);
  const navigate = useNavigate();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState(selectedCategory?.title || 'Student App');
  
  // State for product owners
  const [l1SPOC, setL1SPOC] = useState(null);
  const [l2SPOC, setL2SPOC] = useState(null);
  
  // State for file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsingStatus, setParsingStatus] = useState('');
  
  // State for admin modal
  const [showAdminModal, setShowAdminModal] = useState(false);
  
  // List of available tabs with active state
  const tabs = [
    { name: 'Student App', active: true },
    { name: 'Teacher App', active: false },
    { name: 'Active Teach', active: false },
    { name: 'Orders and Billing', active: false },
    { name: 'Lead Group Academy', active: false },
  ];

  // Debug user info
  useEffect(() => {
    console.log("SettingsPage - Current User:", currentUser);
  }, [currentUser]);
  
  // Save current settings to localStorage - using useCallback to memoize this function
  const saveToLocalStorage = useCallback((tab) => {
    const dataToSave = {
      l1SPOC: l1SPOC ? {
        id: l1SPOC.id,
        name: l1SPOC.name || l1SPOC.displayName,
        email: l1SPOC.email,
        role: l1SPOC.role
      } : null,
      l2SPOC: l2SPOC ? {
        id: l2SPOC.id,
        name: l2SPOC.name || l2SPOC.displayName,
        email: l2SPOC.email,
        role: l2SPOC.role
      } : null
    };
    
    localStorage.setItem(`settings_${tab || activeTab}`, JSON.stringify(dataToSave));
  }, [l1SPOC, l2SPOC, activeTab]);
  
  // Function to handle tab change
  const handleTabChange = (tab) => {
    if (!tab.active) return; // Prevent changing to inactive tabs
    
    setActiveTab(tab.name);
    
    // Load data from localStorage if exists
    const savedData = localStorage.getItem(`settings_${tab.name}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      setL1SPOC(data.l1SPOC || null);
      setL2SPOC(data.l2SPOC || null);
    } else {
      // Reset states when changing tabs if no saved data
      setL1SPOC(null);
      setL2SPOC(null);
      setSelectedFile(null);
    }
  };
  
  // Function to toggle admin modal
  const toggleAdminModal = () => {
    setShowAdminModal(!showAdminModal);
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
    if (selectedFile && activeTab) {
      setParsingStatus('Parsing document... This may take a moment.');
      
      try {
        // Use the PDFContext to handle the upload
        const result = await handlePDFUpload(selectedFile, activeTab);
        
        if (result.success) {
          setParsingStatus(`Document parsed successfully! ${
            contentStats[activeTab]?.pageCount 
              ? `Extracted ${contentStats[activeTab].pageCount} pages.` 
              : ''
          }`);
          
          // Clear selected file to reset the UI
          setSelectedFile(null);
          
          // Clear status message after delay
          setTimeout(() => {
            setParsingStatus('');
          }, 5000);
        } else {
          throw new Error(result.error || 'Failed to upload document');
        }
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
  
  // Load initial data when component mounts or tab changes
  useEffect(() => {
    // Load settings for the active tab
    const savedData = localStorage.getItem(`settings_${activeTab}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      setL1SPOC(data.l1SPOC || null);
      setL2SPOC(data.l2SPOC || null);
    }
  }, [activeTab]);

  // Admin Panel Modal Component
  const AdminPanelModal = () => {
    if (!showAdminModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
            <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
            <button 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              onClick={toggleAdminModal}
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="p-6">
            {/* API Settings Component */}
            <APISettings />
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Settings</h3>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <h4 className="font-medium text-indigo-700 mb-2">Global API Settings</h4>
                  <p className="text-sm text-gray-600 mb-4">Configure system-wide API settings that will affect all users and applications.</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-medium text-gray-700 mb-2">User Management</h4>
                  <p className="text-sm text-gray-600">User management functionality will be available in a future update.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 flex justify-end">
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-md transition-colors"
              onClick={toggleAdminModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-30 h-16 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
        <h1 className="text-xl font-semibold text-gray-800">
          Settings <span className="font-normal"></span>
        </h1>
        
        {/* Admin Panel Button */}
        <button
          className="bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-800 transition-colors"
          onClick={toggleAdminModal}
        >
          Admin Panel
        </button>
      </header>
      
      {/* Admin Panel Modal */}
      <AdminPanelModal />
      
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
              <div className="w-72">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  L1 SPOC (Primary Contact)
                </label>
                <SearchableDropdown
                  placeholder="Assign L1 SPOC"
                  onSelect={setL1SPOC}
                  selectedUser={l1SPOC}
                  inputClassName="w-full"
                />
              </div>
              
              <div className="w-72">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  L2 SPOC (Secondary Contact)
                </label>
                <SearchableDropdown
                  placeholder="Assign L2 SPOC"
                  onSelect={setL2SPOC}
                  selectedUser={l2SPOC}
                  inputClassName="w-full"
                />
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
                    pdfContent[activeTab] ? 'bg-green-500' : 'bg-amber-500'
                  }`}>
                    {pdfContent[activeTab] ? "✓" : "↑"}
                  </div>
                  
                  {pdfContent[activeTab] && (
                    <div className="text-sm text-gray-500 mb-5">
                      Last uploaded: {new Date(pdfContent[activeTab].uploadDate).toLocaleDateString()}
                    </div>
                  )}
                  
                  <button
                    className="bg-indigo-700 text-white px-5 py-2.5 rounded font-medium text-sm"
                    onClick={() => document.getElementById('file-input').click()}
                  >
                    {pdfContent[activeTab] ? 'Re-Upload Product Documentation' : 'Upload Product Documentation'}
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
                      <p className="text-sm text-gray-600 mb-2">
                        Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                      </p>
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
              
              {/* Current Document Info panel */}
              <div className="flex-1 min-w-[300px] bg-white rounded-lg shadow-sm p-5">
                <h4 className="font-semibold text-gray-800 pb-3 border-b border-gray-100 mb-4">
                  Current Document Info
                </h4>
                
                {pdfContent[activeTab] ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">File Name</p>
                      <p className="text-sm text-gray-600">{pdfContent[activeTab].name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Size</p>
                      <p className="text-sm text-gray-600">{Math.round(pdfContent[activeTab].size / 1024)} KB</p>
                    </div>
                    
                    {contentStats[activeTab] && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Pages</p>
                          <p className="text-sm text-gray-600">{contentStats[activeTab].pageCount}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Word Count</p>
                          <p className="text-sm text-gray-600">{contentStats[activeTab].wordCount}</p>
                        </div>
                      </>
                    )}
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Upload Date</p>
                      <p className="text-sm text-gray-600">
                        {new Date(pdfContent[activeTab].uploadDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-40 text-gray-400">
                    <p>No document uploaded yet</p>
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