import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import { logout } from './authService';
import avatar from './assets/images/avatar.png';

const ProfilePage = () => {
  const { currentUser } = useAuth();
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
    <>
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-30 h-16 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
        <h1 className="text-xl font-semibold text-gray-800">
          Profile <span className="font-normal"></span>
        </h1>
      </header>
      
      {/* Main content */}
      <div className="flex flex-col bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto w-full">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full overflow-hidden mr-6">
              <img src={avatar} alt="User avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{currentUser?.displayName || 'User'}</h2>
              <p className="text-gray-600">{currentUser?.email || 'No email available'}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-6 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-800">Email Address</h4>
                    <p className="text-sm text-gray-600">{currentUser?.email || 'No email available'}</p>
                  </div>
                  <button className="text-indigo-600 text-sm font-medium">
                    Update
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-800">Account Role</h4>
                    <p className="text-sm text-gray-600">{currentUser?.role || 'User'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Security</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-800">Password</h4>
                    <p className="text-sm text-gray-600">Last updated 3 months ago</p>
                  </div>
                  <button className="text-indigo-600 text-sm font-medium">
                    Change
                  </button>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full mt-6 px-4 py-2 bg-red-50 text-red-700 rounded-md text-sm font-medium hover:bg-red-100 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;