import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, User, ArrowLeft, Save, X } from 'lucide-react';
import { getUsers } from './userService';
import { useAuth } from './authContext';

const UserManagement = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // State for users list and filtering
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // State for user editing
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: ''
  });
  
  // User role options
  const roleOptions = [
    'Product Manager',
    'Product Owner',
    'Designer',
    'Developer',
    'QA Engineer',
    'Scrum Master',
    'Technical Lead',
    'Content Manager',
    'Project Manager',
    'Support Specialist',
    'Admin'
  ];
  
  // Department options
  const departmentOptions = [
    'Student App',
    'Teacher App',
    'Active Teach',
    'Orders and Billing',
    'Lead Group Academy',
    'Engineering',
    'UX Team',
    'Quality Assurance',
    'Content Team',
    'PMO',
    'Customer Support'
  ];
  
  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const usersList = await getUsers('', 50); // Load up to 50 users initially
        setUsers(usersList);
        setFilteredUsers(usersList);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  // Filter users when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user =>
      (user.name || user.displayName || '').toLowerCase().includes(query) ||
      (user.email || '').toLowerCase().includes(query) ||
      (user.role || '').toLowerCase().includes(query) ||
      (user.department || '').toLowerCase().includes(query)
    );
    
    setFilteredUsers(filtered);
  }, [searchQuery, users]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Select user for editing or viewing details
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || user.displayName || '',
      email: user.email || '',
      role: user.role || '',
      department: user.department || ''
    });
    setIsEditing(false);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Start editing user
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original user data
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || selectedUser.displayName || '',
        email: selectedUser.email || '',
        role: selectedUser.role || '',
        department: selectedUser.department || ''
      });
    }
  };
  
  // Save user changes
  const handleSaveUser = () => {
    // In a real implementation, you would call an API to update the user
    // For this demo, we'll update the local state
    
    const updatedUser = {
      ...selectedUser,
      name: formData.name,
      displayName: formData.name, // Update both fields for compatibility
      email: formData.email,
      role: formData.role,
      department: formData.department
    };
    
    // Update users list
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? updatedUser : user
    );
    
    setUsers(updatedUsers);
    setSelectedUser(updatedUser);
    setIsEditing(false);
    
    // Show success message (in a real app)
    console.log('User updated successfully:', updatedUser);
  };
  
  // Delete user
  const handleDeleteUser = (userId) => {
    // In a real implementation, you would call an API to delete the user
    // For this demo, we'll update the local state
    
    // Ask for confirmation
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    
    // If the deleted user was selected, clear selection
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(null);
    }
    
    // Show success message (in a real app)
    console.log('User deleted successfully:', userId);
  };
  
  // Create new user
  const handleCreateUser = () => {
    // Clear form and start in edit mode
    setFormData({
      name: '',
      email: '',
      role: '',
      department: ''
    });
    
    // Create a temporary user object
    const newUser = {
      id: 'new-' + Date.now(), // Temporary ID until saved to backend
      name: '',
      email: '',
      role: '',
      department: ''
    };
    
    setSelectedUser(newUser);
    setIsEditing(true);
  };
  
  // Go back to the main app
  const handleBackClick = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-30 h-16 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
        <div className="flex items-center">
          <button 
            onClick={handleBackClick}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            User Management
          </h1>
        </div>
        
        {/* User info */}
        {currentUser && (
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-4">
              {currentUser.displayName || currentUser.email}
            </span>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <div className="flex max-w-7xl mx-auto p-6">
        {/* Users list */}
        <div className="w-1/3 bg-white rounded-lg shadow-sm mr-6">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Users
              </h2>
              <button 
                onClick={handleCreateUser}
                className="p-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            
            {/* Search box */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 focus:outline-none"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          
          {/* Users list */}
          <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                Loading users...
              </div>
            ) : filteredUsers.length > 0 ? (
              <ul>
                {filteredUsers.map(user => (
                  <li 
                    key={user.id}
                    className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedUser && selectedUser.id === user.id ? 'bg-indigo-50' : ''
                    }`}
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-700">
                        <User size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name || user.displayName || 'Unnamed User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                          {user.role && ` • ${user.role}`}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No users found.
              </div>
            )}
          </div>
        </div>
        
        {/* User details/edit form */}
        <div className="w-2/3 bg-white rounded-lg shadow-sm">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {isEditing ? 'Edit User' : 'User Details'}
                </h2>
                <div className="flex items-center">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={handleCancelEdit}
                        className="p-2 text-gray-500 hover:text-gray-700 mr-2"
                      >
                        <X size={16} />
                      </button>
                      <button 
                        onClick={handleSaveUser}
                        className="p-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
                      >
                        <Save size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={handleEditClick}
                        className="p-2 text-indigo-600 hover:text-indigo-800 mr-2"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(selectedUser.id)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.name || 'Not specified'}</p>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.email || 'Not specified'}</p>
                    )}
                  </div>
                  
                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    {isEditing ? (
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select a role</option>
                        {roleOptions.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-900">{formData.role || 'Not specified'}</p>
                    )}
                  </div>
                  
                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    {isEditing ? (
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select a department</option>
                        {departmentOptions.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-900">{formData.department || 'Not specified'}</p>
                    )}
                  </div>
                </div>
                
                {/* Additional fields can be added here */}
                
                {isEditing && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={handleSaveUser}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 ml-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <User size={48} className="mb-4 opacity-20" />
              <p>Select a user to view details</p>
              <button 
                onClick={handleCreateUser}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Create New User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;