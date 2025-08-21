// src/services/firebase/seedData.js
import { initializeDatabase } from './database.js';

// This script seeds the database with initial data
// Run this once to populate your Firestore database

export const runSeedData = async () => {
  try {
    const result = await initializeDatabase();
    
    if (result.success) {
      return result;
    } else {
      return result;
    }
    
  } catch (error) {
    console.error('Error during database seeding:', error);
    return { success: false, error: error.message };
  }
};

// For direct execution
if (typeof window !== 'undefined' && window.location.pathname.includes('seed')) {
  runSeedData();
}