import React, { useState } from 'react';
import { MessageSquare, Home, Bell, Settings, Smile, Send, PenLine } from 'lucide-react';

import studentAppImg from './assets/images/student-app.png';
import teacherAppImg from './assets/images/teacher-app.png';
import activeTeachImg from './assets/images/active-teach.png';
import ordersBillingImg from './assets/images/orders-billing.png';
import leadGroupAcademyImg from './assets/images/lead-academy.png';
import notSureImg from './assets/images/not-sure.png';
import avatar from './assets/images/avatar.png';
import Logo from './assets/images/logo.png'; 


export default function App() {
  // State management
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Simple set of emojis for the demo
  const commonEmojis = ["😊", "👍", "❤️", "🙌", "🤔", "😂", "🎉", "👏", "🔥", "✅", "⭐", "🚀"];
  
  const categories = [
    {
      title: 'Student App',
      image: studentAppImg,
      alt: 'Student with book and learning symbols',
      active: true
    },
    {
      title: 'Teacher App',
      image: teacherAppImg,
      alt: 'Teacher tool icon',
      active: false
    },
    {
      title: 'Active Teach',
      image: activeTeachImg,
      alt: 'Classroom with whiteboard',
      active: false
    },
    {
      title: 'Orders and Billing',
      image: ordersBillingImg,
      alt: 'Rocket with billing items',
      active: false
    },
    {
      title: 'Lead Group Academy',
      image: leadGroupAcademyImg,
      alt: 'Person with learning materials',
      active: false
    },
    {
      title: "Anything and Everything",
      image: notSureImg,
      alt: 'Question marks',
      active: false
    }
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowModal(false);
  };

  const handleEmojiClick = (emoji) => {
    setQuery(prev => prev + emoji);
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
    
    setMessages(prev => [...prev, userMessage]);
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
      
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left sidebar */}
      <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center">
        <div className="p-4">
          <div className="w-12 h-12 bg-indigo-700 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">LEAD</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-8 mt-6">
          <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
            <Home size={20} />
          </button>
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600">
            <Bell size={20} />
          </button>
        </div>
        
        <div className="flex flex-col items-center mt-auto">
          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 mb-8">
            <Settings size={20} />
          </button>
          
          <div className="mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full overflow-hidden">
              <img src={avatar} alt="User avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
          <h1 className="text-xl font-semibold text-gray-800">LEAD GPT 1.0 ✨ (Beta)</h1>
        </header>
        
        {/* Chat area */}
        <div className="flex-1 relative pb-24">
          {showModal ? (
            /* Modal overlay - only shows when showModal is true */
            <div className="absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center pb-20">
              <div className="bg-white rounded-3xl shadow-lg p-6 max-w-lg w-full">
                <h2 className="text-lg font-medium text-indigo-800 mb-6 text-center">
                  What do you need help with today?
                </h2>
                
                <div className="grid grid-cols-3 gap-4">
                  {categories.map((category, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col items-center"
                      onClick={() => category.active ? handleCategorySelect(category) : null}
                    >
                      <div 
                        className={`
                          aspect-square w-full rounded-xl p-2 flex items-center justify-center
                          ${category.active 
                            ? 'border border-gray-100 shadow-sm hover:shadow-md cursor-pointer bg-white' 
                            : 'bg-gray-100 cursor-not-allowed'
                          }
                        `}
                      >
                        <img 
                          src={category.image} 
                          alt={category.alt} 
                          className={`w-16 h-16 object-contain ${!category.active ? 'opacity-60' : ''}`} 
                        />
                      </div>
                      <span 
                        className={`
                          text-center mt-2 text-sm
                          ${category.active ? 'text-gray-800 font-medium' : 'text-gray-500 font-normal'}
                        `}
                      >
                        {category.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Chat messages */
            <div className="h-full overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MessageSquare size={40} className="mx-auto mb-2 opacity-40" />
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {messages.map(message => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.sender === 'bot' && (
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-2 text-xs font-bold">
                          SL
                        </div>
                      )}
                      <div className="max-w-xs sm:max-w-md">
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            message.sender === 'user'
                              ? 'bg-indigo-600 text-white rounded-br-none'
                              : 'bg-white border border-gray-200 rounded-tl-none'
                          }`}
                        >
                          {message.text}
                        </div>
                        <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'} text-gray-500`}>
                          {message.timestamp}
                          {message.sender === 'user' && (
                            <span className="ml-1">✓✓</span>
                          )}
                        </div>
                      </div>
                      {message.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden ml-2">
                          <img src="https://via.placeholder.com/32" alt="User" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-indigo-600 text-white rounded-2xl rounded-tl-none px-4 py-2 max-w-xs sm:max-w-md">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '200ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '400ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
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
                  disabled={showModal}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !showModal && query.trim()) {
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile size={22} />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-20 right-8 z-10">
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
                    ${!query.trim() || showModal || isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'}`}
                  disabled={!query.trim() || showModal || isLoading}
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
    </div>
  );
}