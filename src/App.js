// Import polyfill first
import './polyfill';  // Make sure this is imported first

// All imports at the top - properly ordered
import React, { useState, useRef, useEffect } from 'react';
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

// Add Modal Styles and animations to the document head
const ModalStyles = () => {
  useEffect(() => {
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.id = 'modal-styles';
    
    // Define modal styles with direct CSS including animations
    styleEl.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      .modal-overlay {
        position: fixed;
        top: 64px; /* Leave room for the header (h-16 = 64px) */
        left: 80px; /* Leave room for the sidebar (w-20 = 80px) */
        right: 0;
        bottom: 0;
        background-color: rgba(75, 85, 99, 0.3);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px); /* For Safari */
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease-out forwards;
      }
      
      .modal-overlay.closing {
        animation: fadeOut 0.3s ease-out forwards;
      }
      
      .modal-content {
        background-color: white;
        border-radius: 1.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        padding: 2rem;
        max-width: 36rem;
        width: 100%;
        margin: 0 1rem;
      }
      
      .modal-title {
        font-size: 1.25rem;
        font-weight: 500;
        color: #3730a3;
        margin-bottom: 2rem;
        text-align: center;
      }
      
      .category-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
      }
      
      .category-item {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      .category-item.active {
        cursor: pointer;
        transition: transform 0.2s ease;
      }
      
      .category-item.active:hover {
        transform: translateY(-4px);
      }
      
      .category-item.inactive {
        cursor: not-allowed;
      }
      
      .category-icon {
        aspect-ratio: 1/1;
        width: 100%;
        height: 0;
        padding-bottom: 100%; /* Force a perfect square regardless of content */
        border-radius: 0.75rem;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .category-icon.active {
        background-color: white;
        border: 1px solid #f3f4f6;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      }
      
      .category-icon.inactive {
        background-color: #f3f4f6;
      }
      
      .category-image {
        width: 80%;
        height: 80%;
        object-fit: contain;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      
      .category-image.inactive {
        opacity: 0.6;
      }
      
      .category-title {
        text-align: center;
        margin-top: 0.5rem;
        font-size: 0.875rem;
      }
      
      .category-title.active {
        font-weight: 500;
        color: #1f2937;
      }
      
      .category-title.inactive {
        font-weight: 400;
        color: #6b7280;
      }
      
      /* Animation for toast */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-fade-in {
        animation: fadeInUp 0.3s ease-out forwards;
      }
      
      /* Hover styles for sidebar icons */
      .sidebar-icon {
        transition: background-color 0.2s ease, color 0.2s ease;
      }
      
      .sidebar-icon:hover {
        background-color: #f3f4f6;
        color: #4f46e5;
      }
      
      /* Dropdown styles */
      .category-dropdown {
        position: relative;
      }
      
      .dropdown-toggle {
        display: flex;
        align-items: center;
        background-color: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        cursor: pointer;
        transition: border-color 0.2s ease;
      }
      
      .dropdown-toggle:hover {
        border-color: #d1d5db;
      }
      
      .dropdown-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        right: 0;
        width: 16rem;
        background-color: white;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        z-index: 40;
        overflow: hidden;
        animation: fadeIn 0.2s ease-out;
      }
      
      .dropdown-item {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        transition: background-color 0.2s ease;
      }
      
      .dropdown-item.active {
        cursor: pointer;
      }
      
      .dropdown-item.active:hover {
        background-color: #f9fafb;
      }
      
      .dropdown-item.inactive {
        opacity: 0.6;
        cursor: not-allowed;
      }
      
      .dropdown-item-image {
        width: 2rem;
        height: 2rem;
        object-fit: contain;
        margin-right: 0.75rem;
      }
      
      .dropdown-item-title {
        font-size: 0.875rem;
      }
      
      .dropdown-item.active .dropdown-item-title {
        font-weight: 500;
        color: #1f2937;
      }
      
      .dropdown-item.inactive .dropdown-item-title {
        color: #6b7280;
      }
      
      .dropdown-item.selected {
        background-color: #f3f4f6;
      }
    `;
    
    // Add to document head
    document.head.appendChild(styleEl);
    
    // Cleanup function to remove the style element when component unmounts
    return () => {
      const existingStyle = document.getElementById('modal-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);
  
  return null;
};

// BotAvatar component - Note it's before the main App component
function BotAvatar({ message }) {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 overflow-hidden ${animationComplete ? 'bg-indigo-200' : 'bg-white'}`}>
      <Lottie 
        animationData={botAnimation} 
        loop={false}
        autoplay={true}
        lottieRef={(ref) => {
          if (ref) {
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
    // Example: 
    // if (window.gtag) {
    //   window.gtag('event', 'category_selection', {
    //     'category_name': category.title,
    //     'category_id': category.id // assuming you add IDs to categories
    //   });
    // }
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

// New CategoryDropdown component
function CategoryDropdown({ categories, selectedCategory, onCategorySelect }) {
  const [isOpen, setIsOpen] = useState(false);
  
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
    <div className="category-dropdown">
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

export default function App() {
  // State management
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  
  // Refs for scrolling and positioning
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  
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
      title: "Anything and Everything",
      image: notSureImg,
      alt: 'Question marks',
      active: false,
      id: 'anything'
    }
  ];

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

  const handleCategorySelect = (category) => {
    // If this is called from modal (first time)
    if (showModal) {
      // Start the closing animation
      setIsModalClosing(true);
      
      // Wait for animation to complete before fully removing modal
      setTimeout(() => {
        setShowModal(false);
        setIsModalClosing(false);
      }, 300); // Match this to the CSS animation duration
    }
    
    // Set selected category immediately in both cases
    setSelectedCategory(category);
    
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
  };

  const handleSendMessage = () => {
    if (!query.trim() || isLoading) return;
    
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
    
    // Simulate response after delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: `This is a simulated response to: "${userMessage.text}". In a real implementation, this would come from OpenAI's API with context from your uploaded PDFs.`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Include the modal styles */}
      <ModalStyles />
      
      {/* Toast notification */}
      <Toast 
        message={toast.message} 
        isVisible={toast.visible} 
        onClose={() => setToast({ ...toast, visible: false })}
      />
      
      {/* Left sidebar */}
      <div className="fixed top-0 left-0 h-screen w-20 bg-white border-r border-gray-200 flex flex-col items-center z-40">
        <div className="p-4">
          <div className="w-12 h-12 bg-indigo-700 rounded-xl flex items-center justify-center">
            <img src={Logo} alt="Logo Icon" className="w-12 h-12 object-contain" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 mt-6">
          <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 sidebar-icon">
            <Home size={20} />
          </button>
          <button 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 sidebar-icon"
            onClick={() => showToastMessage("Notifications Coming Soon")}
          >
            <Bell size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center mt-auto">
          <button 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 mb-8 sidebar-icon"
            onClick={() => showToastMessage("Settings Coming Soon")}
          >
            <Settings size={20} />
          </button>

          <div className="mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full overflow-hidden">
              <img src={avatar} alt="User avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col pl-20">
        {/* Header */}
        <header className="sticky top-0 left-0 right-0 z-30 h-16 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
          <h1 className="text-xl font-semibold text-gray-800">
            LEAD GPT 1.0 ✨ <span className="font-normal">(Beta)</span>
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

        {/* Chat area */}
        <div className="flex-1 relative overflow-hidden" ref={chatContainerRef}>
          {/* Chat messages */}
          <div className="h-full overflow-y-auto p-4 pt-2 pb-24">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col-reverse justify-start items-center">
                <div className="text-center text-gray-500 mb-4">
                  <MessageSquare size={40} className="mx-auto mb-2 opacity-40" />
                  <p>No messages yet. Start a new conversation!</p>
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
                      </div>
                      {message.sender !== 'system' && (
                        <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'} text-gray-500`}>
                          {message.timestamp}
                          {message.sender === 'user' && <span className="ml-1">✓✓</span>}
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
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 overflow-hidden bg-indigo-200">
                        <Lottie 
                          animationData={botAnimation} 
                          loop={true}
                          autoplay={true}
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                      <div className="bg-white border border-gray-200 text-gray-600 rounded-xl rounded-tl-none px-4 py-2">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
              </div>
            )}
          </div>
          
          {/* Input area at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-50 p-4">
            <div className="flex items-center gap-3 max-w-4xl mx-auto bg-white rounded-xl p-4 shadow-sm">
              <div className="flex-1 flex items-center">
                <PenLine size={18} className="text-gray-400 mr-3 ml-1" />
                <input 
                  type="text" 
                  placeholder="Type your query here.."
                  className="bg-white border-none outline-none w-full text-gray-700 placeholder-gray-400 text-sm py-1"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={showModal || isModalClosing}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !showModal && !isModalClosing && query.trim()) {
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <button 
                  ref={emojiButtonRef}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile size={22} />
                </button>
                {showEmojiPicker && (
                  <div 
                    className="absolute z-50"
                    style={{
                      bottom: '90px', /* Position above the emoji button */
                      left: '890px',
                    }}
                  >
                    <div className="bg-white shadow-lg rounded-lg p-2 border border-gray-200 w-64">
                      <div className="grid grid-cols-6 gap-2">
                        {commonEmojis.map((emoji, index) => (
                          <button 
                            key={index} 
                            className="text-xl hover:bg-gray-100 p-1 rounded"
                            onClick={() => handleEmojiClick(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <button 
                  className={`rounded-full px-4 py-2.5 flex items-center justify-center gap-1
                    ${!query.trim() || showModal || isModalClosing || isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'}`}
                  disabled={!query.trim() || showModal || isModalClosing || isLoading}
                  onClick={handleSendMessage}
                >
                  Send
                  <Send size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category selection modal with fade-out animation */}
      <CategoryModal 
        isOpen={showModal} 
        isClosing={isModalClosing}
        categories={categories} 
        onCategorySelect={handleCategorySelect}
      />
    </div>
  );
}