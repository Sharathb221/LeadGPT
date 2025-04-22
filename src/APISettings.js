import React, { useState, useEffect } from 'react';

const APISettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Load API key from localStorage when component mounts
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);

  // Save API key to localStorage
  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey);
      setIsSaved(true);
      
      // Hide saved message after 3 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">OpenAI API Configuration</h3>
      
      <div className="max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            OpenAI API Key
          </label>
          <div className="relative">
            <input
              type={isVisible ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm bg-white pr-24"
              placeholder="Enter your OpenAI API key"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Your API key is stored locally in your browser and never sent to our servers.
          </p>
        </div>
        
        <div className="flex items-center">
          <button
            onClick={handleSave}
            className="bg-indigo-700 text-white px-4 py-2 rounded font-medium text-sm"
          >
            Save API Key
          </button>
          
          {isSaved && (
            <span className="ml-3 text-sm text-green-600 animate-fade-in">
              Saved successfully!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default APISettings;