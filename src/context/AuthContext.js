// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create fallback profile for users without Firestore profile
  const createFallbackProfile = (user, additionalData = {}) => {
    return {
      uid: user.uid,
      email: user.email?.toLowerCase() || '',
      displayName: user.displayName || additionalData.displayName || 'User',
      firstName: additionalData.firstName || user.displayName?.split(' ')[0] || 'User',
      lastName: additionalData.lastName || user.displayName?.split(' ')[1] || '',
      role: 'client',
      phone: additionalData.phone || '',
      dateOfBirth: additionalData.dateOfBirth || '',
      address: additionalData.address || '',
      emailVerified: user.emailVerified || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      profileComplete: false,
      isFirestoreProfile: false // Flag to indicate this is a fallback
    };
  };

  // Register new user (client only)
  const register = async (email, password, userData) => {
    try {
      console.log('🚀 Starting registration process...');
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ User account created:', user.uid);

      // Update display name
      const displayName = `${userData.firstName} ${userData.lastName}`;
      await updateProfile(user, { displayName });
      console.log('✅ Display name updated');

      // Create user profile document
      const userDoc = {
        uid: user.uid,
        email: user.email.toLowerCase(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        displayName,
        role: 'client',
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || '',
        address: userData.address || '',
        emergencyContact: {},
        healthInfo: {},
        preferences: {
          notifications: true,
          theme: 'light',
          language: 'en'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        emailVerified: false,
        profileComplete: false,
        isFirestoreProfile: true
      };

      console.log('💾 Attempting to save user profile to Firestore...');
      
      // Try to save to Firestore (but don't fail if it doesn't work)
      try {
        await setDoc(doc(db, 'users', user.uid), userDoc);
        console.log('✅ User profile saved to Firestore');
      } catch (firestoreError) {
        console.error('❌ Firestore save failed:', firestoreError);
        console.log('📝 Will create fallback profile instead');
      }

      // Send email verification
      try {
        await sendEmailVerification(user);
        console.log('📧 Verification email sent');
      } catch (emailError) {
        console.error('❌ Email verification failed:', emailError);
      }

      // Set the profile in state immediately
      setUserProfile(userDoc);

      console.log('🎉 Registration process completed');
      return { user, profile: userDoc };
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login...');
      const userCredential = await signInWithEmailAndPassword(auth, email.toLowerCase(), password);
      console.log('✅ User logged in successfully:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      console.log('👋 User logged out successfully');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email.toLowerCase());
      console.log('📧 Password reset email sent to:', email);
    } catch (error) {
      console.error('❌ Reset password error:', error);
      throw error;
    }
  };

  // Resend email verification
  const resendVerification = async () => {
    if (currentUser) {
      try {
        await sendEmailVerification(currentUser);
        console.log('📧 Verification email resent to:', currentUser.email);
      } catch (error) {
        console.error('❌ Resend verification error:', error);
        throw error;
      }
    } else {
      throw new Error('No user is currently signed in');
    }
  };

  // Get user profile from Firestore
  const getUserProfile = async (uid) => {
    console.log('🔍 Fetching user profile for:', uid);
    
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const profileData = userDoc.data();
        console.log('✅ User profile fetched from Firestore');
        return { ...profileData, isFirestoreProfile: true };
      } else {
        console.log('📝 No Firestore profile found');
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      return null;
    }
  };

  // Update user profile
  const updateUserProfile = async (uid, updateData) => {
    try {
      const updatedData = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', uid), updatedData, { merge: true });
      
      // Update local state if it's the current user
      if (uid === currentUser?.uid) {
        setUserProfile(prev => ({ ...prev, ...updatedData }));
      }
      
      console.log('✅ User profile updated:', uid);
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 Auth state changed:', user?.uid || 'logged out');
      
      if (user) {
        setCurrentUser(user);
        
        // Try to fetch user profile from Firestore
        const profile = await getUserProfile(user.uid);
        
        if (profile) {
          console.log('✅ Using Firestore profile');
          setUserProfile(profile);
        } else {
          console.log('📝 Creating fallback profile');
          // Create fallback profile if Firestore profile doesn't exist
          const fallbackProfile = createFallbackProfile(user);
          setUserProfile(fallbackProfile);
          
          // Try to save the fallback profile to Firestore for future use
          try {
            await setDoc(doc(db, 'users', user.uid), fallbackProfile);
            console.log('✅ Fallback profile saved to Firestore');
            setUserProfile(prev => ({ ...prev, isFirestoreProfile: true }));
          } catch (error) {
            console.log('⚠️ Could not save fallback profile, using in-memory only');
          }
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    register,
    login,
    logout,
    resetPassword,
    resendVerification,
    getUserProfile,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};