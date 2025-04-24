// Enhanced Google Auth Provider for organization authentication
import { GoogleAuthProvider } from 'firebase/auth';

// Array of allowed email domains
const ALLOWED_DOMAINS = ['leadschool.in', 'lbpl.co'];

/**
 * Creates a configured Google Auth Provider for your organization
 * @returns {GoogleAuthProvider} - Configured Google Auth Provider instance
 */
export const createOrganizationGoogleProvider = () => {
  const provider = new GoogleAuthProvider();
  
  // Set login_hint to the primary domain to guide users to organizational accounts
  provider.setCustomParameters({
    'hd': ALLOWED_DOMAINS[0], // Use primary domain (leadschool.in) as hint
    'prompt': 'select_account' // Always prompt to select account
  });
  
  // Add scopes if needed (beyond the default profile and email)
  // This is useful if you want to get additional Google Workspace info
  provider.addScope('profile');
  provider.addScope('email');
  
  return provider;
};

/**
 * Helper function to handle Google sign-in outcomes
 * @param {Object} result - The sign-in result from Firebase
 * @returns {Object} - Processed result with validation
 */
export const processGoogleSignInResult = (result) => {
  // No result, return error
  if (!result || !result.user) {
    return {
      user: null,
      error: 'Authentication failed'
    };
  }
  
  const { user } = result;
  
  // Check for valid organization email domain
  const userDomain = user.email.split('@')[1];
  if (!ALLOWED_DOMAINS.includes(userDomain)) {
    return {
      user: null,
      error: `Only ${ALLOWED_DOMAINS.map(d => '@' + d).join(' and ')} email addresses are allowed`,
      invalidDomain: true
    };
  }
  
  // Check if email is verified
  if (!user.emailVerified) {
    return {
      user: null,
      error: 'Your email has not been verified. Please check your inbox.',
      unverifiedEmail: true
    };
  }
  
  // Return success with the user
  return {
    user,
    error: null,
    validDomain: true
  };
};