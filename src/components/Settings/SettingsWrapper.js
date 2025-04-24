import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../authContext';
import SettingsPage from '../../SettingsPage';
import avatar from '../../assets/images/avatar.png';
import Logo from '../../assets/images/logo.png';

// Settings wrapper with inline Sidebar
function SettingsWrapper() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  
  // Log current user for debugging
  useEffect(() => {
    console.log("SettingsWrapper - Current User:", currentUser);
  }, [currentUser]);
  
  // Handle navigation
  const handleNavigate = (page) => {
    if (page === 'home') {
      navigate('/');
    } else if (page === 'settings') {
      navigate('/settings');
    } else if (page === 'notifications') {
      console.log("Notifications Coming Soon");
    }
  };

  // Handle logout with confirmation
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        console.error("Failed to log out", error);
      }
    }
  };
  
  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Inline Sidebar component
  const Sidebar = () => (
    <div className="fixed top-0 left-0 h-screen w-20 bg-white border-r border-gray-200 flex flex-col items-center z-50">
      <div className="p-4">
        <div 
          className="w-12 h-12 bg-indigo-700 rounded-xl flex items-center justify-center cursor-pointer"
          onClick={() => handleNavigate('home')}
        >
          <img src={Logo} alt="Logo Icon" className="w-12 h-12 object-contain" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 mt-6">
        <button 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 sidebar-icon"
          onClick={() => handleNavigate('home')}
        >
          <Home size={20} />
        </button>
        <button 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 sidebar-icon"
          onClick={() => handleNavigate('notifications')}
        >
          <Bell size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center mt-auto">
        <button 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 mb-8 sidebar-icon bg-gray-100"
          onClick={() => handleNavigate('settings')}
        >
          <Settings size={20} />
        </button>

        {/* Profile dropdown - LEFT ALIGNED and POSITIONED ABOVE */}
        <div className="mb-4 relative" ref={profileRef}>
          <div 
            className="w-10 h-10 bg-red-100 rounded-full overflow-hidden cursor-pointer"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
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
          
          {/* Clean dropdown menu positioned ABOVE and LEFT-ALIGNED */}
          {isProfileOpen && (
            <div className="absolute bottom-14 left-0 bg-white shadow-lg rounded-md border border-gray-200 w-56 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <div>
                  <div className="font-medium text-gray-800">
                    {currentUser?.displayName || 'User'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {currentUser?.email || 'No email available'}
                  </div>
                  {currentUser?.role && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {currentUser.role}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-2 py-2">
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut size={16} className="mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left sidebar with navigation */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 pl-20">
        <SettingsPage />
      </div>
    </div>
  );
}

export default SettingsWrapper;