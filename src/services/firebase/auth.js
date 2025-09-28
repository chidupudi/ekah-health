// src/services/firebase/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './config';

// Create a Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  hd: '', // Allow any domain
});

/**
 * Register a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} name - User's display name
 * @returns {Promise} Firebase auth user object
 */
export const registerWithEmailAndPassword = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set the user's display name
    await updateProfile(user, {
      displayName: name
    });

    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Sign in with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} Firebase auth user object
 */
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

/**
 * Sign in with Google
 * @returns {Promise} Firebase auth user object
 */
export const signInWithGoogle = async () => {
  try {
    // Use popup method for better user experience on desktop
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw error;
  }
};

/**
 * Sign out the current user
 * @returns {Promise} Void
 */
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password for a user
 * @param {string} email - User's email
 * @returns {Promise} Void
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

/**
 * Get the current user, if any
 * @returns {Object|null} Firebase auth user object or null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Function to call on auth state change
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Parse Firebase auth error and return a user-friendly message
 * @param {Error} error - Firebase auth error
 * @returns {string} User-friendly error message
 */
export const parseAuthError = (error) => {
  const errorCode = error.code;
  let errorMessage = 'An error occurred. Please try again.';

  switch (errorCode) {
    case 'auth/email-already-in-use':
      errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      break;
    case 'auth/invalid-email':
      errorMessage = 'Invalid email address. Please check and try again.';
      break;
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      errorMessage = 'Incorrect email or password. Please check your credentials and try again.';
      break;
    case 'auth/weak-password':
      errorMessage = 'Password is too weak. Please use a stronger password.';
      break;
    case 'auth/too-many-requests':
      errorMessage = 'Too many failed login attempts. Please try again later or reset your password.';
      break;
    case 'auth/popup-closed-by-user':
      errorMessage = 'Sign-in popup was closed before completing the sign-in process.';
      break;
    case 'auth/cancelled-popup-request':
      errorMessage = 'The sign-in popup was cancelled.';
      break;
    case 'auth/popup-blocked':
      errorMessage = 'Sign-in popup was blocked by your browser. Please enable popups for this site.';
      break;
    default:
      errorMessage = `Authentication error: ${error.message}`;
  }

  return errorMessage;
};
