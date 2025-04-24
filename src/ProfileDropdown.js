import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from './authContext';
import avatar from './assets/images/avatar.png';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Log the current user for debugging
  useEffect(() => {
    console.log("ProfileDropdown - Current User:", currentUser);
  }, [currentUser]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile icon button */}
      <div 
        className="w-10 h-10 bg-red-100 rounded-full overflow-hidden cursor-pointer"
        onClick={toggleDropdown}
      >
        {currentUser?.photoURL ? (
          <img 
            src={currentUser.photoURL} 
            alt="User avatar" 
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = avatar;
            }}
          />
        ) : (
          <img src={avatar} alt="User avatar" className="w-full h-full object-cover" />
        )}
      </div>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 bg-white shadow-lg rounded-md border border-gray-200 w-64 z-50 py-2">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-700 overflow-hidden">
                {currentUser?.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="User" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = <User size={18} />;
                    }}
                  />
                ) : (
                  <User size={18} />
                )}
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  {currentUser?.displayName || 'User'}
                </div>
                <div className="text-xs text-gray-500">
                  {currentUser?.email || 'No email available'}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {currentUser?.role || 'User'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-2 py-2">
            <button 
              onClick={handleProfileClick}
              className="flex w-full items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <User size={16} className="mr-2" />
              <span>My Profile</span>
            </button>
            
            <button 
              onClick={() => {
                navigate('/settings');
                setIsOpen(false);
              }}
              className="flex w-full items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <Settings size={16} className="mr-2" />
              <span>Settings</span>
            </button>
            
            <button 
              onClick={handleLogout}
              className="flex w-full items-center px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md mt-1"
            >
              <LogOut size={16} className="mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;