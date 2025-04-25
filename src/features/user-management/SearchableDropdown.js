import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User } from 'lucide-react';
import { getUsers } from '../../services/userService';

const SearchableDropdown = ({ 
  placeholder = 'Search for users', 
  onSelect, 
  selectedUser = null,
  inputClassName = '',
  dropdownClassName = '',
  allowClear = true
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Effect to handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Effect to update the displayed value when a user is selected externally
  useEffect(() => {
    if (selectedUser) {
      setDisplayValue(selectedUser.name || selectedUser.displayName || selectedUser.email);
    } else {
      setDisplayValue('');
    }
  }, [selectedUser]);

  // Search users based on input query
  const searchUsers = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const users = await getUsers(searchTerm, 15);
      setResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      searchUsers(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setDisplayValue(value);
    if (value) {
      setIsOpen(true);
    } else {
      setResults([]);
    }
    
    // If the input is cleared, also clear the selected user
    if (!value && selectedUser) {
      onSelect(null);
    }
  };

  // Handle user selection
  const handleSelectUser = (user) => {
    setDisplayValue(user.name || user.displayName || user.email);
    setIsOpen(false);
    setQuery('');
    onSelect(user);
  };

  // Handle clearing the selection
  const handleClear = () => {
    setDisplayValue('');
    setQuery('');
    setResults([]);
    onSelect(null);
    inputRef.current.focus();
  };

  // Initial load of users when dropdown is opened and empty
  const handleInputFocus = async () => {
    if (!query && !results.length) {
      setIsLoading(true);
      try {
        // Load recent or default users when first focused
        const users = await getUsers('', 10);
        setResults(users);
      } catch (error) {
        console.error('Error loading initial users:', error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsOpen(true);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Input with search icon */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          className={`w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 focus:outline-none ${inputClassName}`}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          autoComplete="off"
        />
        
        {/* Clear button */}
        {allowClear && displayValue && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={handleClear}
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {/* Dropdown results */}
      {isOpen && (
        <div className={`absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md overflow-hidden border border-gray-200 ${dropdownClassName}`}>
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Loading users...
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-60 overflow-auto">
              {results.map((user) => (
                <li
                  key={user.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors flex items-center"
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-700">
                    <User size={14} />
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
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              {query ? 'No users found' : 'Type to search for users'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;