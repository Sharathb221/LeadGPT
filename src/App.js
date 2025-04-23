import './polyfill';  // Make sure this is imported first

// All imports at the top - properly ordered
import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { MessageSquare, Home, Bell, Settings, Smile, Send, PenLine, X, ChevronDown } from 'lucide-react';
import Lottie from 'lottie-react';
import botAnimation from './assets/animations/bot-animation.json';
import studentAppImg from './assets/images/student-app.png';
import teacherAppImg from './assets/images/teacher-app.png';
import activeTeachImg from './assets/images/active-teach.png';
import ordersBillingImg from './assets/images/orders-billing.png';
import leadGroupAcademyImg from './assets/images/lead-academy.png';
import notSureImg from './assets/images/not-sure.png';
import avatar from './assets/images/avatar.png';
import Logo from './assets/images/logo.png'; 

// Import styles
import './modalStyles.css';

// Import the new components and services
import PDFContextProvider, { PDFContext } from './PDFContextProvider';
import { AuthProvider, useAuth } from './authContext';
import { generateResponse } from './openAIService';
import SettingsPage from './SettingsPage';
import LoginPage from './loginPage';

// Create AppContext for sharing state between components
export const AppContext = createContext();

// Main App component
function App() {
  // App-level state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(true);
  
  // Function to update the selected category
  const updateSelectedCategory = (category) => {
    setSelectedCategory(category);
  };
  
  return (
    <AuthProvider>
      <AppContext.Provider value={{ 
        selectedCategory, 
        updateSelectedCategory, 
        showModal, 
        setShowModal 
      }}>
        <PDFContextProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ChatApp />} />
              <Route path="/settings" element={<SettingsWrapper />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </PDFContextProvider>
      </AppContext.Provider>
    </AuthProvider>
  );
}

// Export App as the default export
export default App;

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

// BotAvatar component
function BotAvatar({ message, isTyping = false }) {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 overflow-hidden ${animationComplete && !isTyping ? 'bg-indigo-200' : 'bg-white'}`}>
      <Lottie 
        animationData={botAnimation} 
        loop={isTyping}
        autoplay={true}
        lottieRef={(ref) => {
          if (ref && !isTyping) {
            ref.addEventListener('enterFrame', (event) => {
              if (event.currentTime >= 193) {
                ref.pause();
                setAnimationComplete(true); // Update state when animation reaches frame 193
              }
            });
          }
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

// Modal component with fade-out animation
function CategoryModal({ isOpen, isClosing, categories, onCategorySelect }) {
  if (!isOpen && !isClosing) return null;
  
  const handleCategoryClick = (category) => {
    if (category.active) {
      // Track the event (will be integrated with GA and clickstream)
      trackCategorySelection(category);
      
      // Call the parent handler
      onCategorySelect(category);
    }
  };
  
  // Function to track category selection (would connect to GA/clickstream)
  const trackCategorySelection = (category) => {
    console.log(`Category selected: ${category.title}`); 
    // In a real implementation, you would send this to Google Analytics or clickstream
  };
  
  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`}>
      <div className="modal-content">
        <h2 className="modal-title">
          What do you need help with today?
        </h2>
        
        <div className="category-grid">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className={`category-item ${category.active ? 'active' : 'inactive'}`}
              onClick={() => handleCategoryClick(category)}
            >
              <div className={`category-icon ${category.active ? 'active' : 'inactive'}`}>
                <img 
                  src={category.image} 
                  alt={category.alt} 
                  className={`category-image ${!category.active ? 'inactive' : ''}`} 
                />
              </div>
              <span className={`category-title ${category.active ? 'active' : 'inactive'}`}>
                {category.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// CategoryDropdown component
function CategoryDropdown({ categories, selectedCategory, onCategorySelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    // Add event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const handleCategoryClick = (category) => {
    if (category.active) {
      // Track the event (will be integrated with GA and clickstream)
      console.log(`Category switched to: ${category.title}`);
      
      // Call the parent handler
      onCategorySelect(category);
      setIsOpen(false);
    }
  };
  
  return (
    <div className="category-dropdown" ref={dropdownRef}>
      <button 
        className="dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {selectedCategory && (
            <>
              <img 
                src={selectedCategory.image} 
                alt={selectedCategory.alt} 
                className="w-5 h-5 mr-2" 
              />
              <span>{selectedCategory.title}</span>
            </>
          )}
          <ChevronDown size={16} className="ml-2" />
        </div>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className={`
                dropdown-item 
                ${category.active ? 'active' : 'inactive'} 
                ${selectedCategory && selectedCategory.id === category.id ? 'selected' : ''}
              `}
              onClick={() => handleCategoryClick(category)}
            >
              <img 
                src={category.image} 
                alt={category.alt} 
                className="dropdown-item-image" 
              />
              <span className="dropdown-item-title">
                {category.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Sidebar component with navigation - MODIFIED with logout dropdown
function Sidebar({ onNavigate, activePage }) {
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-20 bg-white border-r border-gray-200 flex flex-col items-center z-50">
      <div className="p-4">
        <div 
          className="w-12 h-12 bg-indigo-700 rounded-xl flex items-center justify-center cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <img src={Logo} alt="Logo Icon" className="w-12 h-12 object-contain" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 mt-6">
        <button 
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 sidebar-icon ${activePage === 'home' ? 'bg-gray-100' : ''}`}
          onClick={() => onNavigate('home')}
        >
          <Home size={20} />
        </button>
        <button 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 sidebar-icon"
          onClick={() => onNavigate('notifications')}
        >
          <Bell size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center mt-auto">
        <button 
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 mb-8 sidebar-icon ${activePage === 'settings' ? 'bg-gray-100' : ''}`}
          onClick={() => onNavigate('settings')}
        >
          <Settings size={20} />
        </button>

        <div className="mb-4 relative">
          <div 
            className="w-10 h-10 bg-red-100 rounded-full overflow-hidden cursor-pointer"
            onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
          >
            <img src={avatar} alt="User avatar" className="w-full h-full object-cover" />
          </div>
          
          {/* Logout dropdown */}
          {showLogoutDropdown && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md border border-gray-200 w-24 z-50">
              <button 
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Settings wrapper component with context
function SettingsWrapper() {
  const navigate = useNavigate();
  
  const handleNavigate = (page) => {
    if (page === 'home') {
      navigate('/');
    } else if (page === 'settings') {
      navigate('/settings');
    } else if (page === 'notifications') {
      // In a real implementation, you would use the showToastMessage function
      console.log("Notifications Coming Soon");
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left sidebar with navigation */}
      <Sidebar onNavigate={handleNavigate} activePage="settings" />
      
      {/* Main content area */}
      <div className="flex-1 pl-20">
        <SettingsPage />
      </div>
    </div>
  );
}

// ChatApp component with OpenAI integration
function ChatApp() {
  const navigate = useNavigate();
  // Access app context for shared state
  const { selectedCategory, updateSelectedCategory, showModal, setShowModal } = useContext(AppContext);
  // Access PDF context for document data
  const { getContextForQuery, pdfContent, contentStats } = useContext(PDFContext);
  
  // State management
  const [query, setQuery] = useState('');
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [apiError, setApiError] = useState(null);
  const [documentStatus, setDocumentStatus] = useState('');
  const [showTooltip, setShowTooltip] = useState(false); // Added for document status tooltip
  
  // Refs for scrolling and positioning
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const inputRef = useRef(null);
  
  // Simple set of emojis for the demo
  const commonEmojis = ["😊", "👍", "❤️", "🙌", "🤔", "😂", "🎉", "👏", "🔥", "✅", "⭐", "🚀"];
  
  const categories = [
    {
      title: 'Student App',
      image: studentAppImg,
      alt: 'Student with book and learning symbols',
      active: true,
      id: 'student-app'
    },
    {
      title: 'Teacher App',
      image: teacherAppImg,
      alt: 'Teacher tool icon',
      active: false,
      id: 'teacher-app'
    },
    {
      title: 'Active Teach',
      image: activeTeachImg,
      alt: 'Classroom with whiteboard',
      active: false,
      id: 'active-teach'
    },
    {
      title: 'Orders and Billing',
      image: ordersBillingImg,
      alt: 'Rocket with billing items',
      active: false,
      id: 'orders-billing'
    },
    {
      title: 'Lead Group Academy',
      image: leadGroupAcademyImg,
      alt: 'Person with learning materials',
      active: false,
      id: 'lead-academy'
    },
    {
      title: "I'm not sure",
      image: notSureImg,
      alt: 'Question marks',
      active: false,
      id: 'anything'
    }
  ];

  // Handle navigation
  const handleNavigate = (page) => {
    if (page === 'home') {
      navigate('/');
    } else if (page === 'settings') {
      navigate('/settings');
    } else if (page === 'notifications') {
      showToastMessage("Notifications Coming Soon");
    }
  };

  // Scroll to bottom of messages with smooth animation
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Effect to handle scrolling when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if a document is available when category changes
  useEffect(() => {
    if (selectedCategory) {
      const categoryData = pdfContent[selectedCategory.title];
      if (categoryData) {
        const stats = contentStats[selectedCategory.title];
        if (stats) {
          setDocumentStatus(`Document loaded: ${categoryData.name} (${stats.pageCount} pages, ${stats.wordCount.toLocaleString()} words)`);
        } else {
          setDocumentStatus(`Document loaded: ${categoryData.name}`);
        }
      } else {
        setDocumentStatus('No document uploaded. Please upload a document in Settings.');
      }
    }
  }, [selectedCategory, pdfContent, contentStats]);
  
  // MODIFIED function to handle category selection (focus on input)
  const handleCategorySelect = (category) => {
    // If this is called from modal (first time)
    if (showModal) {
      // Start the closing animation
      setIsModalClosing(true);
      
      // Wait for animation to complete before fully removing modal
      setTimeout(() => {
        setShowModal(false);
        setIsModalClosing(false);
        
        // Focus the input field after modal closes
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300); // Match this to the CSS animation duration
    } else {
      // When changing category from dropdown, also focus the input
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
    
    // Update the selected category in the app context
    updateSelectedCategory(category);
    
    // Optional: Add a system message about changing modes
    if (selectedCategory && selectedCategory.id !== category.id) {
      const systemMessage = {
        id: Date.now(),
        text: `Mode switched to ${category.title}`,
        sender: 'system',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, systemMessage]);
    }
  };

  const showToastMessage = (message) => {
    setToast({ visible: true, message });
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  };

  const handleEmojiClick = (emoji) => {
    setQuery((prev) => prev + emoji);
    setShowEmojiPicker(false);
    
    // Focus back on the input after selecting an emoji
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSendMessage = async () => {
    if (!query.trim() || isLoading) return;
    
    // Check if a document is available
    const categoryData = selectedCategory ? pdfContent[selectedCategory.title] : null;
    if (!categoryData) {
      showToastMessage('Please upload a document in Settings to use the AI assistant');
      return;
    }
    
    // Reset any previous errors
    setApiError(null);
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: query,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setQuery('');
    
    try {
      // Get the API key from localStorage
      const apiKey = localStorage.getItem('openai_api_key');
      
      if (!apiKey) {
        throw new Error('OpenAI API key not found. Please add your API key in Settings.');
      }
      
      // Get context for the current query from the PDF content
      const documentContext = await getContextForQuery(query);
      
      // Call OpenAI API through our service
      const botResponseText = await generateResponse(query, documentContext, apiKey);
      
      // Add bot response to chat
      const botResponse = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isPartial: documentContext?.isPartial
      };
      
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      const errorResponse = {
        id: Date.now() + 1,
        text: `Error: ${error.message || 'Something went wrong. Please try again.'}`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages((prev) => [...prev, errorResponse]);
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Emoji picker component
  const EmojiPicker = () => {
    return (
      <div className="absolute bottom-20 right-16 bg-white p-2 rounded-lg shadow-lg border border-gray-200 z-20">
        <div className="grid grid-cols-6 gap-2">
          {commonEmojis.map((emoji, index) => (
            <button
              key={index}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Toast notification */}
      <Toast 
        message={toast.message} 
        isVisible={toast.visible} 
        onClose={() => setToast({ ...toast, visible: false })}
      />
      
      {/* Left sidebar with navigation */}
      <Sidebar onNavigate={handleNavigate} activePage="home" />

      <div className="flex-1 flex flex-col pl-20">
        {/* Header with fixed emoji accessibility - MODIFIED to make title clickable */}
        <header className="sticky top-0 left-0 right-0 z-30 h-16 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
          <h1 
            className="text-xl font-semibold text-gray-800 cursor-pointer"
            onClick={() => handleNavigate('home')}
          >
            LEAD GPT 1.0 <span role="img" aria-label="sparkles">✨</span> <span className="font-normal">(Beta)</span>
          </h1>
          
          {/* Category dropdown in the top right */}
          {selectedCategory && (
            <CategoryDropdown 
              categories={categories} 
              selectedCategory={selectedCategory} 
              onCategorySelect={handleCategorySelect} 
            />
          )}
        </header>

        {/* Document status bar - MODIFIED with hover effect */}
        {selectedCategory && (
          <div 
            className={`px-6 py-2 flex items-center gap-2 relative ${
              documentStatus.includes('No document') ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
            }`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className={`w-3 h-3 rounded-full ${documentStatus.includes('No document') ? 'bg-amber-600' : 'bg-green-600'}`}></div>
            <span className="text-sm">
              {documentStatus.includes('No document') ? 'NOT READY' : 'READY'}
            </span>
            
            {showTooltip && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 p-3 rounded-md border border-gray-200 text-sm text-gray-700">
                {documentStatus}
              </div>
            )}
          </div>
        )}

        {/* Chat area */}
        <div className="flex-1 relative overflow-hidden" ref={chatContainerRef}>
          {/* Chat messages */}
          <div className="h-full overflow-y-auto p-4 pt-2 pb-24">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500 max-w-md mx-auto">
                  <MessageSquare size={40} className="mx-auto mb-2 opacity-40" />
                  <p className="mb-2">No messages yet. Start a new conversation!</p>
                  {selectedCategory && !pdfContent[selectedCategory.title] && (
                    <p className="mt-2 text-sm p-2 bg-amber-50 rounded-lg">
                      <strong>Note:</strong> No document is loaded for {selectedCategory.title}. 
                      Please upload a PDF document in Settings to get better answers.
                    </p>
                  )}
                  {apiError && (
                    <p className="mt-2 text-sm text-red-500 p-2 bg-red-50 rounded-lg">
                      <strong>Error:</strong> {apiError}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${
                    message.sender === 'user' 
                      ? 'justify-end' 
                      : message.sender === 'system' 
                        ? 'justify-center' 
                        : 'justify-start'
                  }`}>
                    {message.sender === 'bot' && (
                      <BotAvatar message={message} />
                    )}
                    <div className={`max-w-xs sm:max-w-md ${
                      message.sender === 'system' ? 'max-w-sm' : ''
                    }`}>
                      <div
                        className={
                          message.sender === 'user'
                            ? 'bg-indigo-600 text-white rounded-2xl rounded-br-none px-4 py-2'
                            : message.sender === 'system'
                              ? 'bg-gray-100 text-gray-600 rounded-full px-4 py-1.5 text-sm'
                              : 'bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-2'
                        }
                      >
                        {message.text}
                        {message.sender === 'bot' && message.isPartial && (
                          <div className="mt-2 text-xs text-gray-500 italic">
                            Note: This response is based on a portion of the document most relevant to your query.
                          </div>
                        )}
                      </div>
                      {message.sender !== 'system' && (
                        <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'} text-gray-500`}>
                          {message.timestamp}
                          {message.sender === 'user' && <span role="img" aria-label="read receipts"> ✓✓</span>}
                        </div>
                      )}
                    </div>
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden ml-2">
                        <img src={avatar} alt="User" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <BotAvatar isTyping={true} />
                    <div className="bg-white border border-gray-200 text-gray-600 rounded-xl rounded-tl-none px-4 py-2">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
              </div>
            )}
          </div>
          
          {/* Input area at bottom - MODIFIED to use textarea instead of input */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-50 p-4">
            <div className="flex items-center gap-3 max-w-4xl mx-auto bg-white rounded-xl p-4 shadow-sm">
              <div className="flex-1 flex items-start"> {/* Changed from items-center to items-start */}
                <PenLine size={18} className="text-gray-400 mr-3 ml-1 mt-2" /> {/* Added mt-2 to align with taller input */}
                <textarea 
                  ref={inputRef}
                  placeholder={
                    !selectedCategory?.active 
                      ? "Select an active category first..."
                      : !pdfContent[selectedCategory?.title]
                        ? "Upload a document in Settings to start chatting..."
                        : "Type your query here..."
                  }
                  
                  className="bg-white border-none outline-none w-full text-gray-700 placeholder-gray-400 text-sm py-2 min-h-[60px] resize-none" 
                  /* Changes: 
                   * - Changed from input to textarea
                   * - Added min-h-[60px] to make it twice as tall
                   * - Added resize-none to prevent manual resizing
                   * - Changed py-1 to py-2 for better vertical padding
                   */
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={
                    showModal || 
                    isModalClosing || 
                    !selectedCategory?.active || 
                    !pdfContent[selectedCategory?.title]
                  }
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && 
                        !showModal && 
                        !isModalClosing && 
                        query.trim() && 
                        selectedCategory?.active &&
                        pdfContent[selectedCategory?.title]) {
                      e.preventDefault(); // Prevent new line on Enter without shift
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              
              <button
                ref={emojiButtonRef}
                className={`text-gray-400 hover:text-gray-600 transition-colors ${
                  !selectedCategory?.active || !pdfContent[selectedCategory?.title] 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
                onClick={() => selectedCategory?.active && pdfContent[selectedCategory?.title] && setShowEmojiPicker(!showEmojiPicker)}
                disabled={!selectedCategory?.active || !pdfContent[selectedCategory?.title]}
              >
                <Smile size={20} />
              </button>
              
              {showEmojiPicker && <EmojiPicker />}
              
              <button 
                className={`rounded-lg p-2 ${
                  query.trim() && !isLoading && selectedCategory?.active && pdfContent[selectedCategory?.title]
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-400'
                }`}
                onClick={handleSendMessage}
                disabled={
                  !query.trim() || 
                  isLoading || 
                  !selectedCategory?.active || 
                  !pdfContent[selectedCategory?.title]
                }
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          
          {/* Category selection modal */}
          <CategoryModal 
            isOpen={showModal} 
            isClosing={isModalClosing}
            categories={categories}
            onCategorySelect={handleCategorySelect}
          />
        </div>
      </div>
    </div>
  );
}