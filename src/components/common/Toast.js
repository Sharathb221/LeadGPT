import React from 'react';
import { X } from 'lucide-react';

// Toast component for notifications
const Toast = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in flex items-center">
      <span>{message}</span>
      <button onClick={onClose} className="ml-3 text-gray-300 hover:text-white">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;