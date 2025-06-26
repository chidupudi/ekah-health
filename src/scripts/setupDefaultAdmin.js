// src/scripts/setupDefaultAdmin.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase/config';

const DEFAULT_ADMIN_CREDENTIALS = {
  email: 'ekahhealth@gmail.com',
  password: 'ekah.life$2025',
  profile: {
    firstName: 'Abhinaya',
    lastName: 'Admin',
    displayName: 'Abhinaya Admin',
    role: 'admin',
    phone: '+1234567890',
    address: 'EKAH Health Headquarters',
    specializations: ['General Health', 'Wellness Coaching', 'Mental Health'],
    bio: 'Default administrator and practitioner for EKAH Health platform',
    licenseNumber: 'EKAH-ADMIN-001',
    yearsOfExperience: 10,
    education: ['Master of Health Administration', 'Bachelor of Science in Health Sciences'],
    certifications: ['Certified Health Coach', 'Licensed Mental Health Counselor'],
    languages: ['English', 'Spanish'],
    availability: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '10:00', end: '14:00', available: true },
      sunday: { start: '10:00', end: '14:00', available: false }
    },
    consultationTypes: ['video', 'chat', 'phone'],
    pricing: {
      consultation: 0, // Free for admin
      followUp: 0
    }
  }
};

export const setupDefaultAdmin = async () => {
  try {
    console.log('🚀 Setting up default admin account...');
    
    // Check if admin already exists by email
    let user;
    let isNewAccount = false;
    
    // Try to create new account first
    try {
      console.log('🔐 Creating new admin account...');
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        DEFAULT_ADMIN_CREDENTIALS.email, 
        DEFAULT_ADMIN_CREDENTIALS.password
      );
      user = userCredential.user;
      isNewAccount = true;
      console.log('✅ New admin account created successfully');
    } catch (createError) {
      if (createError.code === 'auth/email-already-in-use') {
        console.log('📧 Email already exists, attempting to sign in...');
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth, 
            DEFAULT_ADMIN_CREDENTIALS.email, 
            DEFAULT_ADMIN_CREDENTIALS.password
          );
          user = userCredential.user;
          console.log('✅ Signed in to existing admin account');
        } catch (signInError) {
          console.error('❌ Failed to sign in to existing account:', signInError);
          throw new Error('Admin account exists but credentials are incorrect. Please check your setup.');
        }
      } else {
        console.error('❌ Failed to create admin account:', createError);
        throw createError;
      }
    }

    // Update display name if this is a new account
    if (isNewAccount) {
      try {
        await updateProfile(user, { 
          displayName: DEFAULT_ADMIN_CREDENTIALS.profile.displayName 
        });
        console.log('✅ Display name updated');
      } catch (error) {
        console.error('⚠️ Failed to update display name:', error);
      }
    }

    // Check if user profile already exists
    const existingProfile = await getDoc(doc(db, 'users', user.uid));
    if (existingProfile.exists() && !isNewAccount) {
      console.log('✅ Admin profile already exists');
      return { 
        success: true, 
        message: 'Default admin already exists',
        isExisting: true,
        credentials: {
          email: DEFAULT_ADMIN_CREDENTIALS.email,
          password: DEFAULT_ADMIN_CREDENTIALS.password
        }
      };
    }

    // Create user profile document
    const userProfileData = {
      uid: user.uid,
      email: user.email.toLowerCase(),
      ...DEFAULT_ADMIN_CREDENTIALS.profile,
      emailVerified: true, // Admin is pre-verified
      isActive: true,
      profileComplete: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFirestoreProfile: true,
      isDefaultAdmin: true
    };

    console.log('💾 Saving admin profile to Firestore...');
    await setDoc(doc(db, 'users', user.uid), userProfileData, { merge: true });
    console.log('✅ Admin profile saved successfully');

    // Create practitioner profile
    const practitionerData = {
      uid: user.uid,
      email: user.email.toLowerCase(),
      displayName: DEFAULT_ADMIN_CREDENTIALS.profile.displayName,
      firstName: DEFAULT_ADMIN_CREDENTIALS.profile.firstName,
      lastName: DEFAULT_ADMIN_CREDENTIALS.profile.lastName,
      specializations: DEFAULT_ADMIN_CREDENTIALS.profile.specializations,
      bio: DEFAULT_ADMIN_CREDENTIALS.profile.bio,
      licenseNumber: DEFAULT_ADMIN_CREDENTIALS.profile.licenseNumber,
      yearsOfExperience: DEFAULT_ADMIN_CREDENTIALS.profile.yearsOfExperience,
      education: DEFAULT_ADMIN_CREDENTIALS.profile.education,
      certifications: DEFAULT_ADMIN_CREDENTIALS.profile.certifications,
      languages: DEFAULT_ADMIN_CREDENTIALS.profile.languages,
      availability: DEFAULT_ADMIN_CREDENTIALS.profile.availability,
      consultationTypes: DEFAULT_ADMIN_CREDENTIALS.profile.consultationTypes,
      pricing: DEFAULT_ADMIN_CREDENTIALS.profile.pricing,
      rating: 5.0,
      totalConsultations: 0,
      isActive: true,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('👩‍⚕️ Creating practitioner profile...');
    await setDoc(doc(db, 'practitioners', user.uid), practitionerData, { merge: true });
    console.log('✅ Practitioner profile created successfully');

    console.log('🎉 Default admin setup completed successfully!');
    
    return {
      success: true,
      message: isNewAccount ? 'Default admin account created successfully' : 'Default admin account updated successfully',
      isNew: isNewAccount,
      credentials: {
        email: DEFAULT_ADMIN_CREDENTIALS.email,
        password: DEFAULT_ADMIN_CREDENTIALS.password
      },
      profile: userProfileData
    };

  } catch (error) {
    console.error('❌ Default admin setup failed:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred during setup'
    };
  }
};

// Auto-run setup when this module is imported
export const initializeDefaultAdmin = async () => {
  try {
    const result = await setupDefaultAdmin();
    if (result.success) {
      console.log('🎉 Default admin initialization completed');
    } else {
      console.error('❌ Default admin initialization failed:', result.error);
    }
    return result;
  } catch (error) {
    console.error('❌ Default admin initialization error:', error);
    return { success: false, error: error.message };
  }
};