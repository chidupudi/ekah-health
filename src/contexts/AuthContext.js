import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmail,
  signInWithGoogle as firebaseSignInWithGoogle,
  registerWithEmailAndPassword,
  resetPassword,
  logOut as firebaseLogOut,
  subscribeToAuthChanges,
  parseAuthError
} from '../services/firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getRedirectResult } from 'firebase/auth';
import { db, auth } from '../services/firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Secure token management
class SecureTokenManager {
  constructor() {
    this.tokenKey = 'ekah_admin_token';
    this.refreshTokenKey = 'ekah_admin_refresh';
    this.sessionKey = 'ekah_admin_session';
  }

  // Generate a secure session ID
  generateSessionId() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Encrypt sensitive data before storing (basic XOR encryption)
  encrypt(data, key) {
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  }

  // Decrypt sensitive data
  decrypt(encryptedData, key) {
    try {
      const data = atob(encryptedData);
      let result = '';
      for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  // Store token securely
  storeToken(token, refreshToken = null) {
    try {
      const sessionId = this.generateSessionId();
      const encryptionKey = `ekah_${sessionId}_admin`;
      
      // Encrypt the token
      const encryptedToken = this.encrypt(token, encryptionKey);
      
      // Store in localStorage with session validation
      localStorage.setItem(this.tokenKey, encryptedToken);
      localStorage.setItem(this.sessionKey, sessionId);
      
      if (refreshToken) {
        const encryptedRefresh = this.encrypt(refreshToken, encryptionKey);
        localStorage.setItem(this.refreshTokenKey, encryptedRefresh);
      }
      
      return true;
    } catch (error) {
      console.error('Token storage failed:', error);
      return false;
    }
  }

  // Retrieve token securely
  getToken() {
    try {
      const encryptedToken = localStorage.getItem(this.tokenKey);
      const sessionId = localStorage.getItem(this.sessionKey);
      
      if (!encryptedToken || !sessionId) {
        return null;
      }
      
      const encryptionKey = `ekah_${sessionId}_admin`;
      const token = this.decrypt(encryptedToken, encryptionKey);
      
      if (!token) {
        this.clearTokens();
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Token retrieval failed:', error);
      this.clearTokens();
      return null;
    }
  }

  // Clear all tokens
  clearTokens() {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      localStorage.removeItem(this.sessionKey);
      
      // Clear any session cookies
      document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure';
    } catch (error) {
      console.error('Token cleanup failed:', error);
    }
  }

  // Get refresh token
  getRefreshToken() {
    try {
      const encryptedRefresh = localStorage.getItem(this.refreshTokenKey);
      const sessionId = localStorage.getItem(this.sessionKey);
      
      if (!encryptedRefresh || !sessionId) {
        return null;
      }
      
      const encryptionKey = `ekah_${sessionId}_admin`;
      return this.decrypt(encryptedRefresh, encryptionKey);
    } catch (error) {
      console.error('Refresh token retrieval failed:', error);
      return null;
    }
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [error, setError] = useState(null);

  const tokenManager = new SecureTokenManager();

  // Initialize authentication state with Firebase
  useEffect(() => {
    // Check for Google Sign-in redirect result on app load
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User signed in via redirect, create/update user document
          const userDocRef = doc(db, 'users', result.user.uid);
          await setDoc(userDocRef, {
            email: result.user.email,
            name: result.user.displayName,
            photoURL: result.user.photoURL,
            role: 'user',
            lastLogin: new Date(),
            createdAt: new Date()
          }, { merge: true });

          // Check for intended service booking after Google sign-in
          const intendedBooking = localStorage.getItem('intendedServiceBooking');
          if (intendedBooking) {
            // Store for navigation after auth state is set
            sessionStorage.setItem('postAuthBooking', intendedBooking);
            localStorage.removeItem('intendedServiceBooking');
          }
        }
      } catch (error) {
        console.error('Redirect result error:', error);
        setError(parseAuthError(error));

        // Clear any stored auth tokens if redirect failed
        tokenManager.clearTokens();
      }
    };

    checkRedirectResult();

    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      try {
        setIsLoading(true);

        if (firebaseUser) {
          // Get additional user data from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          let userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'user'
          };

          // If user document exists in Firestore, merge the data
          if (userDoc.exists()) {
            userData = { ...userData, ...userDoc.data() };
          } else {
            // Create user document in Firestore for new users
            await setDoc(userDocRef, {
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              role: 'user',
              createdAt: new Date(),
              lastLogin: new Date()
            });
          }

          // Check for admin credentials for admin login
          if (firebaseUser.email === 'admin@ekahhealth.com') {
            userData.role = 'admin';
          }

          setUser(userData);
          setSessionInfo({
            loginTime: new Date(),
            lastActivity: new Date()
          });
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setSessionInfo(null);
          tokenManager.clearTokens();
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError(parseAuthError(error));
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Regular email/password login
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const firebaseUser = await signInWithEmail(email, password);

      // Update last login in Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, { lastLogin: new Date() }, { merge: true });

      return firebaseUser;
    } catch (error) {
      const errorMessage = parseAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-in
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const firebaseUser = await firebaseSignInWithGoogle();

      // If firebaseUser is null, it means redirect was initiated
      if (!firebaseUser) {
        // Keep loading state as redirect is happening
        // Don't call setIsLoading(false) here as the page will redirect
        return null;
      }

      // Update/create user document in Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: 'user',
        lastLogin: new Date(),
        createdAt: new Date()
      }, { merge: true });

      setIsLoading(false);
      return firebaseUser;
    } catch (error) {
      const errorMessage = parseAuthError(error);
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  // User registration
  const register = async (email, password, name) => {
    try {
      setIsLoading(true);
      setError(null);

      const firebaseUser = await registerWithEmailAndPassword(email, password, name);

      // Create user document in Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        email: firebaseUser.email,
        name: name,
        role: 'user',
        createdAt: new Date(),
        lastLogin: new Date()
      });

      return firebaseUser;
    } catch (error) {
      const errorMessage = parseAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setError(null);
      await resetPassword(email);
    } catch (error) {
      const errorMessage = parseAuthError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await firebaseLogOut();
      tokenManager.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      setSessionInfo(null);
      setError(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    sessionInfo,
    error,
    login,
    loginWithGoogle,
    register,
    forgotPassword,
    logout,
    clearError,
    tokenManager
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;