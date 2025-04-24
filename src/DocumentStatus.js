import React, { useState } from 'react';

const DocumentStatus = ({ isReady, documentName, pageCount, wordCount }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Format the detailed document info
  const detailedInfo = isReady 
    ? `Document loaded: ${documentName} (${pageCount} pages, ${wordCount.toLocaleString()} words)`
    : 'No document uploaded. Please upload a document in Settings.';
  
  return (
    <div className="relative inline-block">
      <div
        className={`px-4 py-1 flex items-center gap-2 rounded-full ${
          isReady ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
        }`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className={`w-3 h-3 rounded-full ${isReady ? 'bg-green-600' : 'bg-amber-600'}`}></div>
        <span className="text-sm font-medium">
          {isReady ? 'READY' : 'NOT READY'}
        </span>
      </div>
      
      {showTooltip && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white shadow-lg z-50 p-3 rounded-md border border-gray-200 text-sm text-gray-700">
          {detailedInfo}
        </div>
      )}
    </div>
  );
};

export default DocumentStatus;