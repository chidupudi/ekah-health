// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  subscribeToAuthChanges, 
  signInWithEmail, 
  signInWithGoogle, 
  registerWithEmailAndPassword, 
  logOut,
  resetPassword,
  parseAuthError
} from '../services/firebase/auth';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Clean up subscription
    return unsubscribe;
  }, []);

  // Sign in with email and password
  const login = async (email, password) => {
    setError(null);
    try {
      return await signInWithEmail(email, password);
    } catch (error) {
      setError(parseAuthError(error));
      throw error;
    }
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    setError(null);
    try {
      return await signInWithGoogle();
    } catch (error) {
      setError(parseAuthError(error));
      throw error;
    }
  };

  // Register with email and password
  const register = async (email, password, name) => {
    setError(null);
    try {
      return await registerWithEmailAndPassword(email, password, name);
    } catch (error) {
      setError(parseAuthError(error));
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    setError(null);
    try {
      await logOut();
    } catch (error) {
      setError(parseAuthError(error));
      throw error;
    }
  };

  // Reset password
  const forgotPassword = async (email) => {
    setError(null);
    try {
      await resetPassword(email);
    } catch (error) {
      setError(parseAuthError(error));
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    forgotPassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
