// Test Firestore connection
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from './config';

export const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');
    
    // Test write
    const testDoc = doc(db, 'test', 'connection');
    await setDoc(testDoc, {
      message: 'Test connection',
      timestamp: new Date()
    });
    console.log('✅ Write test successful');
    
    // Test read
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    console.log('✅ Read test successful, docs:', snapshot.size);
    
    // Test services collection
    const servicesCollection = collection(db, 'services');
    const servicesSnapshot = await getDocs(servicesCollection);
    console.log('📊 Services collection has', servicesSnapshot.size, 'documents');
    
    // Test categories collection  
    const categoriesCollection = collection(db, 'categories');
    const categoriesSnapshot = await getDocs(categoriesCollection);
    console.log('📂 Categories collection has', categoriesSnapshot.size, 'documents');
    
    // List all documents in services
    servicesSnapshot.forEach(doc => {
      console.log('Service doc:', doc.id, doc.data());
    });
    
    // List all documents in categories
    categoriesSnapshot.forEach(doc => {
      console.log('Category doc:', doc.id, doc.data());
    });
    
    return {
      success: true,
      servicesCount: servicesSnapshot.size,
      categoriesCount: categoriesSnapshot.size
    };
    
  } catch (error) {
    console.error('❌ Firestore connection test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};