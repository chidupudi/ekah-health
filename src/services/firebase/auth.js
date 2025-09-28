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
import { getDomainConfig, logDomainInfo, validateAuthDomain } from './authConfig';

// Create a Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  hd: '', // Allow any domain
});

// Log domain configuration on module load
logDomainInfo();

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
    const { signInWithRedirect, getRedirectResult } = await import('firebase/auth');

    // Check if we're returning from a redirect
    const result = await getRedirectResult(auth);
    if (result) {
      return result.user;
    }

    // Validate current domain configuration
    const validation = validateAuthDomain();
    const domainConfig = getDomainConfig();

    if (!validation.isValid) {
      console.error('Domain validation failed:', validation.issues);
      throw new Error(`Authentication setup error: ${validation.issues.join(', ')}`);
    }

    if (validation.warnings.length > 0) {
      console.warn('Domain warnings:', validation.warnings);
    }

    // Configure provider for current environment
    if (!domainConfig.isLocalhost) {
      console.log('Configuring Google Auth for production domain:', domainConfig.origin);

      // Update provider settings for production
      googleProvider.setCustomParameters({
        prompt: 'select_account',
        hd: '', // Allow any domain
      });
    }

    // Use redirect method to avoid COOP issues
    await signInWithRedirect(auth, googleProvider);
    return null; // Will redirect, so no immediate result
  } catch (error) {
    console.error('Google sign-in error:', error);

    // Provide more specific error handling for common issues
    if (error.code === 'auth/unauthorized-domain') {
      const domainConfig = getDomainConfig();
      throw new Error(
        `This domain (${domainConfig.hostname}) is not authorized for Google sign-in. ` +
        `Please add ${domainConfig.origin} to the authorized JavaScript origins in Google Cloud Console.`
      );
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('Google sign-in is not enabled. Please contact support.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Sign-in was blocked by your browser. Please allow popups and try again.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error occurred. Please check your internet connection and try again.');
    }

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
