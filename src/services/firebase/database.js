// src/services/firebase/database.js
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  setDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from './config';

// Collections
const COLLECTIONS = {
  SERVICES: 'services',
  CATEGORIES: 'categories',
  USERS: 'users',
  BOOKINGS: 'bookings'
};

// Services CRUD Operations
export const servicesDB = {
  // Get all services
  getAll: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.SERVICES));
      const services = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      return services;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  // Get service by ID
  getById: async (id) => {
    try {
      const docRef = doc(db, COLLECTIONS.SERVICES, id.toString());
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error('Error fetching service:', error);
      throw error;
    }
  },

  // Add new service
  add: async (serviceData) => {
    try {
      // Clean the service data to ensure it's serializable
      const cleanServiceData = {
        title: serviceData.title,
        duration: serviceData.duration,
        category: serviceData.category,
        description: serviceData.description,
        rating: serviceData.rating,
        includes: serviceData.includes || [],
        options: serviceData.options || [],
        benefits: serviceData.benefits || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const docRef = await addDoc(collection(db, COLLECTIONS.SERVICES), cleanServiceData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding service:', error);
      throw error;
    }
  },

  // Update service
  update: async (id, serviceData) => {
    try {
      // Get the current service to check if category changed
      const currentService = await servicesDB.getById(id);
      
      const docRef = doc(db, COLLECTIONS.SERVICES, id.toString());
      // Clean the service data to ensure it's serializable
      // Don't include 'id' field as it's stored as document ID
      const cleanServiceData = {
        title: serviceData.title,
        duration: serviceData.duration,
        category: serviceData.category,
        description: serviceData.description,
        rating: serviceData.rating,
        includes: serviceData.includes || [],
        options: serviceData.options || [],
        benefits: serviceData.benefits || [],
        updatedAt: new Date()
      };
      
      await updateDoc(docRef, cleanServiceData);
      
      // If category changed, update category service arrays
      if (currentService && currentService.category !== serviceData.category) {
        await updateCategoryServiceLists(id, currentService.category, serviceData.category);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  // Delete service
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.SERVICES, id.toString()));
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  },

  // Get services by category
  getByCategory: async (category) => {
    try {
      const q = query(
        collection(db, COLLECTIONS.SERVICES),
        where('category', '==', category)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching services by category:', error);
      throw error;
    }
  }
};

// Categories CRUD Operations
export const categoriesDB = {
  // Get all categories
  getAll: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
      const categories = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Add new category
  add: async (categoryData) => {
    try {
      if (categoryData.id) {
        // If ID is provided, use setDoc to create document with specific ID
        const docRef = doc(db, COLLECTIONS.CATEGORIES, categoryData.id);
        await setDoc(docRef, {
          ...categoryData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        return categoryData.id;
      } else {
        // Otherwise use addDoc to auto-generate ID
        const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), {
          ...categoryData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        return docRef.id;
      }
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  // Update category
  update: async (id, categoryData) => {
    try {
      const docRef = doc(db, COLLECTIONS.CATEGORIES, id.toString());
      await updateDoc(docRef, {
        ...categoryData,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete category
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id.toString()));
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Get category by ID
  getById: async (id) => {
    try {
      const docRef = doc(db, COLLECTIONS.CATEGORIES, id.toString());
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }
};

// Helper function to update category service lists when a service changes category
const updateCategoryServiceLists = async (serviceId, oldCategory, newCategory) => {
  try {
    // Map category names to category IDs
    const categoryMapping = {
      'Consultation': 'consultation',
      'Programs': 'programs', 
      'Women\'s Health': 'women-pregnancy',
      'Women & Pregnancy': 'women-pregnancy',
      'Specials': 'specials'
    };
    
    const oldCategoryId = categoryMapping[oldCategory] || oldCategory.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCategoryId = categoryMapping[newCategory] || newCategory.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Get all categories
    const categories = await categoriesDB.getAll();
    
    // Update old category - remove service ID
    const oldCategoryDoc = categories.find(cat => cat.id === oldCategoryId);
    if (oldCategoryDoc && oldCategoryDoc.services) {
      // Ensure services is an array before filtering
      const servicesArray = Array.isArray(oldCategoryDoc.services) ? oldCategoryDoc.services : [];
      const updatedOldServices = servicesArray.filter(id => id != serviceId && id !== parseInt(serviceId));
      await categoriesDB.update(oldCategoryId, {
        ...oldCategoryDoc,
        services: updatedOldServices
      });
    }
    
    // Update new category - add service ID
    const newCategoryDoc = categories.find(cat => cat.id === newCategoryId);
    if (newCategoryDoc) {
      // Ensure services is an array before using array methods
      const currentServices = Array.isArray(newCategoryDoc.services) ? newCategoryDoc.services : [];
      const serviceIdNum = parseInt(serviceId);
      if (!currentServices.includes(serviceIdNum) && !currentServices.includes(serviceId)) {
        await categoriesDB.update(newCategoryId, {
          ...newCategoryDoc,
          services: [...currentServices, serviceIdNum]
        });
      }
    }
    
  } catch (error) {
    console.error('Error updating category service lists:', error);
    throw error;
  }
};

// Data seeding function
export const seedDatabase = async () => {
  try {
    // Import the static data
    const { servicesData, serviceGroups } = await import('../../pages/Services/data/servicesData.js');
    
    // Check if data already exists
    const existingServices = await servicesDB.getAll();
    const existingCategories = await categoriesDB.getAll();
    
    if (existingServices.length > 0 || existingCategories.length > 0) {
      // Clear existing data
      const deletePromises = [];
      
      // Delete existing services
      for (const service of existingServices) {
        deletePromises.push(servicesDB.delete(service.id));
      }
      
      // Delete existing categories  
      for (const category of existingCategories) {
        deletePromises.push(categoriesDB.delete(category.id));
      }
      
      await Promise.all(deletePromises);
    }
    
    // Seed categories first
    const categoryPromises = serviceGroups.map(async (category) => {
      const docRef = doc(db, COLLECTIONS.CATEGORIES, category.id);
      const categoryData = {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await setDoc(docRef, categoryData);
    });
    
    await Promise.all(categoryPromises);
    
    // Seed services
    const servicePromises = servicesData.map(async (service) => {
      try {
        const docRef = doc(db, COLLECTIONS.SERVICES, service.id.toString());
        // Remove the React icon element as it can't be serialized
        const { icon, ...serviceWithoutIcon } = service;
        
        // Clean the service data to ensure it's serializable
        const serviceData = {
          id: service.id,
          title: service.title,
          duration: service.duration,
          category: service.category,
          description: service.description,
          rating: service.rating,
          includes: service.includes || [],
          options: service.options || [],
          benefits: service.benefits || [],
          iconType: service.title, // Store a reference instead
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await setDoc(docRef, serviceData);
      } catch (error) {
        console.error('Error seeding service:', service.title, error);
        throw error;
      }
    });
    
    await Promise.all(servicePromises);
    
    return { 
      success: true, 
      message: `Seeded ${serviceGroups.length} categories and ${servicesData.length} services` 
    };
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Initialize database (call this once to seed data)
export const initializeDatabase = async () => {
  try {
    const result = await seedDatabase();
    return result;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};