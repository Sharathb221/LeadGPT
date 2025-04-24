// Firebase authentication service
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCsbHxefE9cAzzEYUSgfP8cY7tkXynGkOQ",
  authDomain: "lead-gpt-3d72e.firebaseapp.com",
  projectId: "lead-gpt-3d72e",
  storageBucket: "lead-gpt-3d72e.appspot.com", // fixed from firebasestorage.app
  messagingSenderId: "129856353229",
  appId: "1:129856353229:web:77a67fdf9762b5aebb0a84",
  measurementId: "G-3ZB89YY11R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Allowed domains
const ALLOWED_DOMAINS = ['leadschool.in', 'lbpl.co'];
export const isValidEmailDomain = (email) => {
  if (!email) return false;
  const domain = email.split('@')[1];
  return ALLOWED_DOMAINS.includes(domain);
};

export const updateUserInLocalStorage = (user) => {
  if (!user) {
    localStorage.removeItem('user');
    return;
  }
  const userData = {
    id: user.uid,
    email: user.email,
    displayName: user.displayName || user.email.split('@')[0],
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    role: 'User'
  };
  localStorage.setItem('user', JSON.stringify(userData));
  return userData;
};

export const loginWithEmailAndPassword = async (email, password) => {
  try {
    if (!isValidEmailDomain(email)) {
      return { user: null, error: `Only ${ALLOWED_DOMAINS.map(d => '@' + d).join(' and ')} emails allowed` };
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    updateUserInLocalStorage(user);
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ hd: ALLOWED_DOMAINS[0], prompt: 'select_account' });

    const result = await signInWithPopup(auth, provider);
    if (!isValidEmailDomain(result.user.email)) {
      await signOut(auth);
      return { user: null, error: `Only ${ALLOWED_DOMAINS.map(d => '@' + d).join(' and ')} emails allowed` };
    }

    updateUserInLocalStorage(result.user);
    return { user: result.user, error: null };
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      return { user: null, error: 'Sign-in was cancelled. Please try again.' };
    }
    return { user: null, error: error.message || 'Failed to sign in with Google' };
  }
};

export const registerWithEmailAndPassword = async (email, password, name) => {
  try {
    if (!isValidEmailDomain(email)) {
      return { user: null, error: `Only ${ALLOWED_DOMAINS.map(d => '@' + d).join(' and ')} emails allowed` };
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    user.displayName = name || email.split('@')[0];

    updateUserInLocalStorage(user);
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('user');
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user && !isValidEmailDomain(user.email)) {
      signOut(auth).then(() => callback(null));
    } else if (user) {
      updateUserInLocalStorage(user);
      callback(user);
    } else {
      localStorage.removeItem('user');
      callback(null);
    }
  });
};

export const getCurrentUser = () => auth.currentUser;
export default auth;
