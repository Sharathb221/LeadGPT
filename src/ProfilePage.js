import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import { logout } from './authService';
import { Edit2, Check, X } from 'lucide-react';
import avatar from './assets/images/avatar.png';
import Sidebar from './Sidebar';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    role: currentUser?.role || 'User',
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user profile
    // For now, just simulate updating the local state
    console.log("Saving profile:", formData);
    setIsEditing(false);
    
    // Display a success message (in a real app)
    alert("Profile updated successfully!");
  };

  const handleNavigate = (page) => {
    if (page === 'home') {
      navigate('/');
    } else if (page === 'settings') {
      navigate('/settings');
    } else if (page === 'notifications') {
      console.log("Notifications Coming Soon");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar onNavigate={handleNavigate} activePage="profile" />
      
      <div className="flex-1 pl-20">
        {/* Header */}
        <header className="sticky top-0 left-0 right-0 z-30 h-16 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
          <h1 className="text-xl font-semibold text-gray-800">
            My Profile
          </h1>
        </header>
        
        {/* Main content */}
        <div className="flex flex-col bg-gray-50 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto w-full">
            {/* Profile header with avatar */}
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-indigo-100 rounded-full overflow-hidden mr-6 relative group">
                <img src={avatar} alt="User avatar" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white text-xs">Change</span>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="displayName"
                      value={formData.displayName} 
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded px-2 py-1 text-base"
                      placeholder="Your name"
                    />
                  ) : (
                    currentUser?.displayName || 'User'
                  )}
                </h2>
                <p className="text-gray-600">{currentUser?.email || 'No email available'}</p>
                
                {/* Edit/Save buttons */}
                {isEditing ? (
                  <div className="flex mt-2 space-x-2">
                    <button 
                      onClick={handleSaveProfile} 
                      className="flex items-center text-green-600 text-sm"
                    >
                      <Check size={16} className="mr-1" />
                      Save
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)} 
                      className="flex items-center text-gray-600 text-sm"
                    >
                      <X size={16} className="mr-1" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="flex items-center text-indigo-600 text-sm mt-1"
                  >
                    <Edit2 size={14} className="mr-1" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
            
            {/* Account details section */}
            <div className="border-t border-gray-100 pt-6 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-800">Email Address</h4>
                      <p className="text-sm text-gray-600">{currentUser?.email || 'No email available'}</p>
                    </div>
                    <button className="text-indigo-600 text-sm font-medium">
                      Verify
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-800">Account Role</h4>
                      {isEditing ? (
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="User">User</option>
                          <option value="Admin">Admin</option>
                          <option value="Product Manager">Product Manager</option>
                          <option value="Developer">Developer</option>
                          <option value="Designer">Designer</option>
                        </select>
                      ) : (
                        <p className="text-sm text-gray-600">{currentUser?.role || 'User'}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-800">Account Created</h4>
                      <p className="text-sm text-gray-600">April 15, 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security section */}
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
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Not enabled</p>
                    </div>
                    <button className="text-indigo-600 text-sm font-medium">
                      Enable
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
      </div>
    </div>
  );
};

export default ProfilePage;