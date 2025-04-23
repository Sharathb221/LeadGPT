// User service for Firebase integration
import { getFirestore, collection, getDocs, query, where, orderBy, limit, startAt, endAt } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Get the initialized Firebase app instance
// We're reusing the same firebase config from authService.js
const firebaseConfig = {
  apiKey: "AIzaSyCsbHxefE9cAzzEYUSgfP8cY7tkXynGkOQ",
  authDomain: "lead-gpt-3d72e.firebaseapp.com",
  projectId: "lead-gpt-3d72e",
  storageBucket: "lead-gpt-3d72e.firebasestorage.app",
  messagingSenderId: "129856353229",
  appId: "1:129856353229:web:77a67fdf9762b5aebb0a84",
  measurementId: "G-3ZB89YY11R"
};

// Initialize Firebase if not already initialized
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  // If Firebase is already initialized, get the existing instance
  app = getAuth().app;
}

// Get Firestore instance
const db = getFirestore(app);

/**
 * Search for users in the organization
 * @param {string} searchTerm - The search term to filter users
 * @param {number} resultsLimit - Maximum number of results to return
 * @returns {Promise<Array>} Array of user objects matching the search criteria
 */
export const searchUsers = async (searchTerm, resultsLimit = 10) => {
  try {
    // If search term is empty, return early with empty array
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    // Create a reference to the users collection
    const usersRef = collection(db, 'users');
    
    // Convert search term to lowercase for case-insensitive search
    const searchTermLower = searchTerm.toLowerCase();
    
    // Create a query against the collection
    // Assuming your users collection has 'name', 'email', and 'displayName' fields
    const nameQuery = query(
      usersRef,
      where('nameLower', '>=', searchTermLower),
      where('nameLower', '<=', searchTermLower + '\uf8ff'),
      limit(resultsLimit)
    );
    
    const emailQuery = query(
      usersRef,
      where('email', '>=', searchTermLower),
      where('email', '<=', searchTermLower + '\uf8ff'),
      limit(resultsLimit)
    );

    // Execute the queries
    const [nameSnapshot, emailSnapshot] = await Promise.all([
      getDocs(nameQuery),
      getDocs(emailQuery)
    ]);

    // Combine and deduplicate results
    const users = new Map();
    
    // Add users from name query
    nameSnapshot.forEach(doc => {
      users.set(doc.id, { id: doc.id, ...doc.data() });
    });
    
    // Add users from email query
    emailSnapshot.forEach(doc => {
      users.set(doc.id, { id: doc.id, ...doc.data() });
    });
    
    // Convert Map to array and sort by name
    return Array.from(users.values()).sort((a, b) => {
      return (a.name || a.displayName || '').localeCompare(b.name || b.displayName || '');
    });
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

/**
 * Get user details by user ID
 * @param {string} userId - The user ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
export const getUserById = async (userId) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', userId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    // Return the first matching document
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

/**
 * Get recent users (for initial dropdown population)
 * @param {number} count - Number of recent users to retrieve
 * @returns {Promise<Array>} Array of user objects
 */
export const getRecentUsers = async (count = 5) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('lastActive', 'desc'), limit(count));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting recent users:', error);
    return [];
  }
};

// In case Firestore is not yet set up with users, this function 
// provides mock data for development and testing
export const getMockUsers = (searchTerm = '', count = 10) => {
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john.doe@leadgroup.org', role: 'Product Manager', department: 'Student App' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@leadgroup.org', role: 'Designer', department: 'UX Team' },
    { id: '3', name: 'Robert Johnson', email: 'robert.j@leadgroup.org', role: 'Developer', department: 'Engineering' },
    { id: '4', name: 'Emily Davis', email: 'emily.d@leadgroup.org', role: 'QA Engineer', department: 'Quality Assurance' },
    { id: '5', name: 'Michael Wilson', email: 'michael.w@leadgroup.org', role: 'Product Owner', department: 'Teacher App' },
    { id: '6', name: 'Sarah Brown', email: 'sarah.b@leadgroup.org', role: 'Scrum Master', department: 'Active Teach' },
    { id: '7', name: 'David Miller', email: 'david.m@leadgroup.org', role: 'Technical Lead', department: 'Engineering' },
    { id: '8', name: 'Jessica Taylor', email: 'jessica.t@leadgroup.org', role: 'Content Manager', department: 'Content Team' },
    { id: '9', name: 'Kevin Anderson', email: 'kevin.a@leadgroup.org', role: 'Backend Developer', department: 'Engineering' },
    { id: '10', name: 'Lisa Thomas', email: 'lisa.t@leadgroup.org', role: 'Frontend Developer', department: 'Engineering' },
    { id: '11', name: 'Mark Wilson', email: 'mark.w@leadgroup.org', role: 'DevOps Engineer', department: 'Infrastructure' },
    { id: '12', name: 'Amanda Clark', email: 'amanda.c@leadgroup.org', role: 'UI Designer', department: 'UX Team' },
    { id: '13', name: 'Ryan Lewis', email: 'ryan.l@leadgroup.org', role: 'Data Scientist', department: 'Analytics' },
    { id: '14', name: 'Stephanie Walker', email: 'stephanie.w@leadgroup.org', role: 'Project Manager', department: 'PMO' },
    { id: '15', name: 'Daniel White', email: 'daniel.w@leadgroup.org', role: 'Support Specialist', department: 'Customer Support' }
  ];
  
  if (!searchTerm) {
    return mockUsers.slice(0, count);
  }
  
  const term = searchTerm.toLowerCase();
  return mockUsers.filter(user => 
    user.name.toLowerCase().includes(term) || 
    user.email.toLowerCase().includes(term) ||
    user.role.toLowerCase().includes(term) ||
    user.department.toLowerCase().includes(term)
  ).slice(0, count);
};

// Export a function that will attempt to use real Firebase data
// but fall back to mock data if Firebase isn't properly set up
export const getUsers = async (searchTerm = '', count = 10) => {
  try {
    const users = await searchUsers(searchTerm, count);
    
    // If we get results from Firebase, use those
    if (users && users.length > 0) {
      return users;
    }
    
    // Otherwise fall back to mock data
    return getMockUsers(searchTerm, count);
  } catch (error) {
    console.error('Error getting users, falling back to mock data:', error);
    return getMockUsers(searchTerm, count);
  }
};