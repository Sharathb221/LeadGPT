import { useState, useContext } from 'react';
import { Upload } from 'lucide-react';
import { PDFContext } from '../contexts/PDFContextProvider';
import { AppContext } from '../contexts/AppContext';
import { validatePDFFile } from '../utils/pdfUtils';

export default function PDFUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const { handlePDFUpload } = useContext(PDFContext);
  const { selectedCategory } = useContext(AppContext);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    // Reset error state
    setError('');
    
    // Validate the file
    const validation = validatePDFFile(file);
    if (!validation.valid) {
      setError(validation.error);
      setFile(null);
      return;
    }

    // Set the selected file
    setFile(file);

    // If we have a category selected, upload immediately
    if (selectedCategory?.title) {
      try {
        setIsUploading(true);
        const result = await handlePDFUpload(file, selectedCategory.title);
        if (!result.success) {
          throw new Error(result.error || 'Failed to upload document');
        }
        // Clear the file selection after successful upload
        setFile(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging ? 'border-indigo-500 bg-indigo-50' : 
        error ? 'border-red-300' :
        isUploading ? 'border-amber-300' :
        'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className={`w-10 h-10 mx-auto mb-2 ${
        error ? 'text-red-400' :
        isUploading ? 'text-amber-400' :
        'text-gray-400'
      }`} />
      
      <p className="mb-1 font-medium">
        {isUploading ? 'Uploading...' : 'Drag and drop your PDF here'}
      </p>
      <p className="text-sm text-gray-500 mb-3">or</p>
      
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="hidden"
        id="pdf-upload"
        disabled={isUploading}
      />
      
      <label
        htmlFor="pdf-upload"
        className={`px-4 py-2 rounded-lg cursor-pointer inline-block ${
          isUploading 
            ? 'bg-amber-500 text-white hover:bg-amber-600'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        } ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        {isUploading ? 'Uploading...' : 'Browse Files'}
      </label>

      {error && (
        <div className="mt-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {file && !error && !isUploading && (
        <div className="mt-3 text-sm text-gray-600">
          Selected: {file.name} ({Math.round(file.size / 1024)} KB)
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>Currently supporting PDF files only</p>
        <p>Max file size: 10MB</p>
      </div>
    </div>
  );
}