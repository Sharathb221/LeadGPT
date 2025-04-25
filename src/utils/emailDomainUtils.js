/**
 * Utility functions for email domain validation with Google Authentication
 */

// Allowed organization domains
export const ALLOWED_DOMAINS = ['leadschool.in', 'lbpl.co'];

/**
 * Validates an email domain against the allowed organization domains
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if the domain is allowed, false otherwise
 */
export const validateDomain = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  try {
    const domain = email.split('@')[1].toLowerCase();
    return ALLOWED_DOMAINS.includes(domain);
  } catch (error) {
    return false;
  }
};

/**
 * Checks if a Google user account belongs to the organization
 * @param {Object} user - The Firebase user object from Google Auth
 * @returns {Object} - Validation result with status and message
 */
export const validateGoogleUser = (user) => {
  // If no user or no email, invalid
  if (!user || !user.email) {
    return {
      isValid: false,
      message: 'Invalid user account'
    };
  }
  
  // Check if the email domain is allowed
  const isOrgDomain = validateDomain(user.email);
  
  if (!isOrgDomain) {
    return {
      isValid: false,
      message: `Only ${ALLOWED_DOMAINS.map(d => '@' + d).join(' and ')} email addresses are allowed`
    };
  }
  
  // Optionally, can check if email is verified by Google
  // Google should always verify the email during OAuth, but this is an extra check
  if (!user.emailVerified) {
    return {
      isValid: false,
      message: 'Email address is not verified'
    };
  }
  
  // All checks passed, user is valid
  return {
    isValid: true,
    message: 'User validated successfully'
  };
};

/**
 * Advanced features for a production environment:
 * 
 * 1. Firebase Authentication Rules:
 *    - Set up custom claims based on email domain
 *    - Use Firebase Functions to validate users on signup
 * 
 * 2. GSuite or Microsoft 365 Integration:
 *    - For stronger verification, use workspace-specific OAuth
 *    - This validates against actual employee directory
 * 
 * 3. Limited Registration Windows:
 *    - Set time-based windows for registration
 *    - Requires admin activation of accounts
 * 
 * 4. IP Address Restrictions:
 *    - Restrict logins to company IP ranges
 *    - Require VPN for remote employees
 */