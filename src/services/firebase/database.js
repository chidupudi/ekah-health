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
  orderBy,
  runTransaction
} from 'firebase/firestore';
import { db } from './config';

// Collections
const COLLECTIONS = {
  SERVICES: 'services',
  CATEGORIES: 'categories',
  USERS: 'users',
  BOOKINGS: 'bookings',
  CALENDAR_CONFIG: 'calendar_config',
  TIME_SLOTS: 'time_slots'
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
      // Validate required fields
      if (!serviceData.title || serviceData.title.trim() === '') {
        throw new Error('Service title is required');
      }
      if (!serviceData.category || serviceData.category.trim() === '') {
        throw new Error('Service category is required');
      }
      
      // Clean the service data to ensure it's serializable
      const cleanServiceData = {
        title: serviceData.title.trim(),
        duration: serviceData.duration || 'Not specified',
        category: serviceData.category.trim(),
        description: serviceData.description || '',
        rating: parseFloat(serviceData.rating) || 0,
        includes: Array.isArray(serviceData.includes) ? serviceData.includes : [],
        options: Array.isArray(serviceData.options) ? serviceData.options : [],
        benefits: Array.isArray(serviceData.benefits) ? serviceData.benefits : [],
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
      // Validate required fields
      if (!serviceData.title || serviceData.title.trim() === '') {
        throw new Error('Service title is required');
      }
      if (!serviceData.category || serviceData.category.trim() === '') {
        throw new Error('Service category is required');
      }
      
      // Get the current service to check if category changed
      const currentService = await servicesDB.getById(id);
      
      const docRef = doc(db, COLLECTIONS.SERVICES, id.toString());
      // Clean the service data to ensure it's serializable
      // Don't include 'id' field as it's stored as document ID
      const cleanServiceData = {
        title: serviceData.title.trim(),
        duration: serviceData.duration || 'Not specified',
        category: serviceData.category.trim(),
        description: serviceData.description || '',
        rating: parseFloat(serviceData.rating) || 0,
        includes: Array.isArray(serviceData.includes) ? serviceData.includes : [],
        options: Array.isArray(serviceData.options) ? serviceData.options : [],
        benefits: Array.isArray(serviceData.benefits) ? serviceData.benefits : [],
        updatedAt: new Date()
      };
      
      await updateDoc(docRef, cleanServiceData);
      
      // If category changed, update category service arrays
      if (currentService && currentService.category !== cleanServiceData.category) {
        await updateCategoryServiceLists(id, currentService.category, cleanServiceData.category);
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
  },

  // Clean up corrupted services
  cleanupCorruptedServices: async () => {
    try {
      const services = await servicesDB.getAll();
      const corruptedServices = [];
      
      for (const service of services) {
        // Check for corrupted data
        if (!service.title || 
            service.title.trim() === '' ||
            service.title.length < 2 ||
            /^[^a-zA-Z0-9\s]/.test(service.title) || // Starts with special characters
            typeof service.title !== 'string') {
          corruptedServices.push(service);
        }
      }
      
      // Delete corrupted services
      for (const service of corruptedServices) {
        await servicesDB.delete(service.id);
      }
      
      return {
        success: true,
        cleanedCount: corruptedServices.length,
        message: `Cleaned up ${corruptedServices.length} corrupted services`
      };
    } catch (error) {
      console.error('Error cleaning up corrupted services:', error);
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

// Bookings CRUD Operations
export const bookingsDB = {
  // Get all bookings
  getAll: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.BOOKINGS));
      const bookings = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get booking by ID
  getById: async (id) => {
    try {
      const docRef = doc(db, COLLECTIONS.BOOKINGS, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  // Get bookings by user ID
  getByUserId: async (userId) => {
    try {
      const q = query(
        collection(db, COLLECTIONS.BOOKINGS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  // Add new booking
  add: async (bookingData) => {
    try {
      // Validate required fields
      if (!bookingData.userId) {
        throw new Error('User ID is required');
      }
      if (!bookingData.firstName || !bookingData.lastName) {
        throw new Error('Name is required');
      }
      if (!bookingData.email || !bookingData.phone) {
        throw new Error('Contact information is required');
      }
      if (!bookingData.preferredDate || !bookingData.preferredTime) {
        throw new Error('Appointment date and time are required');
      }

      // Clean and structure the booking data
      const cleanBookingData = {
        // User Information
        userId: bookingData.userId,
        firstName: bookingData.firstName.trim(),
        lastName: bookingData.lastName.trim(),
        email: bookingData.email.toLowerCase().trim(),
        phone: bookingData.phone.trim(),
        address: bookingData.address?.trim() || '',
        emergencyContact: bookingData.emergencyContact?.trim() || '',

        // Health Information
        age: parseInt(bookingData.age) || null,
        gender: bookingData.gender || '',
        medicalHistory: bookingData.medicalHistory?.trim() || '',
        currentConcerns: bookingData.currentConcerns?.trim() || '',
        previousTherapy: bookingData.previousTherapy || '',

        // Appointment Details
        preferredDate: bookingData.preferredDate, // Should be a date object or timestamp
        preferredTime: bookingData.preferredTime, // Should be a date object or timestamp
        sessionType: bookingData.sessionType || '',
        alternativeSlots: bookingData.alternativeSlots || [],
        specialRequests: bookingData.specialRequests?.trim() || '',

        // Selected Services
        selectedServices: bookingData.selectedServices || [],
        
        // Booking Status and Metadata
        status: 'pending', // pending, confirmed, completed, cancelled
        confirmationNumber: bookingData.confirmationNumber || '',
        termsAccepted: bookingData.termsAccepted || false,
        
        // Timestamps
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.BOOKINGS), cleanBookingData);
      return { id: docRef.id, ...cleanBookingData };
    } catch (error) {
      console.error('Error adding booking:', error);
      throw error;
    }
  },

  // Update booking
  update: async (id, bookingData) => {
    try {
      const docRef = doc(db, COLLECTIONS.BOOKINGS, id);
      const updateData = {
        ...bookingData,
        updatedAt: new Date()
      };
      await updateDoc(docRef, updateData);
      return true;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  // Update booking status
  updateStatus: async (id, status, notes = '') => {
    try {
      const docRef = doc(db, COLLECTIONS.BOOKINGS, id);
      const updateData = {
        status: status,
        statusNotes: notes,
        updatedAt: new Date()
      };
      
      if (status === 'confirmed') {
        updateData.confirmedAt = new Date();
      } else if (status === 'completed') {
        updateData.completedAt = new Date();
      } else if (status === 'cancelled') {
        updateData.cancelledAt = new Date();
      }
      
      await updateDoc(docRef, updateData);
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // Delete booking
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.BOOKINGS, id));
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  },

  // Get bookings by status
  getByStatus: async (status) => {
    try {
      const q = query(
        collection(db, COLLECTIONS.BOOKINGS),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching bookings by status:', error);
      throw error;
    }
  },

  // Get bookings for a specific date range
  getByDateRange: async (startDate, endDate) => {
    try {
      const q = query(
        collection(db, COLLECTIONS.BOOKINGS),
        where('preferredDate', '>=', startDate),
        where('preferredDate', '<=', endDate),
        orderBy('preferredDate', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching bookings by date range:', error);
      throw error;
    }
  }
};

// Calendar Configuration CRUD Operations
export const calendarConfigDB = {
  // Get calendar configuration
  getConfig: async () => {
    try {
      const configRef = doc(db, COLLECTIONS.CALENDAR_CONFIG, 'main');
      const docSnap = await getDoc(configRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        // Return default configuration if none exists
        return {
          id: 'main',
          businessHours: {
            monday: { enabled: true, start: '09:00', end: '17:00' },
            tuesday: { enabled: true, start: '09:00', end: '17:00' },
            wednesday: { enabled: true, start: '09:00', end: '17:00' },
            thursday: { enabled: true, start: '09:00', end: '17:00' },
            friday: { enabled: true, start: '09:00', end: '17:00' },
            saturday: { enabled: false, start: '09:00', end: '17:00' },
            sunday: { enabled: false, start: '09:00', end: '17:00' }
          },
          slotDuration: 60, // minutes
          bufferTime: 15, // minutes between appointments
          advanceBookingDays: 30, // how many days in advance bookings are allowed
          timezone: 'UTC'
        };
      }
    } catch (error) {
      console.error('Error fetching calendar config:', error);
      throw error;
    }
  },

  // Update calendar configuration
  updateConfig: async (configData) => {
    try {
      const configRef = doc(db, COLLECTIONS.CALENDAR_CONFIG, 'main');
      const updateData = {
        ...configData,
        updatedAt: new Date()
      };
      await setDoc(configRef, updateData, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating calendar config:', error);
      throw error;
    }
  }
};

// Time Slots CRUD Operations
export const timeSlotsDB = {
  // Get available time slots for a date range
  getSlots: async (startDate, endDate) => {
    try {
      const q = query(
        collection(db, COLLECTIONS.TIME_SLOTS),
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      );
      const querySnapshot = await getDocs(q);
      const slots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by date and time in JavaScript
      return slots.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare === 0) {
          return a.time.localeCompare(b.time);
        }
        return dateCompare;
      });
    } catch (error) {
      console.error('Error fetching time slots:', error);
      throw error;
    }
  },

  // Get time slots for a specific date
  getSlotsByDate: async (date) => {
    try {
      const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
      const q = query(
        collection(db, COLLECTIONS.TIME_SLOTS),
        where('date', '==', dateStr)
      );
      const querySnapshot = await getDocs(q);
      const slots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by time in JavaScript instead of Firestore
      return slots.sort((a, b) => a.time.localeCompare(b.time));
    } catch (error) {
      console.error('Error fetching slots by date:', error);
      throw error;
    }
  },

  // Create or update a time slot
  upsertSlot: async (slotData) => {
    try {
      const slotId = `${slotData.date}_${slotData.time.replace(':', '')}`;
      const slotRef = doc(db, COLLECTIONS.TIME_SLOTS, slotId);
      
      const cleanSlotData = {
        date: slotData.date, // YYYY-MM-DD format
        time: slotData.time, // HH:MM format
        status: slotData.status || 'available', // available, booked, blocked
        bookingId: slotData.bookingId || null,
        patientName: slotData.patientName || null,
        patientEmail: slotData.patientEmail || null,
        serviceType: slotData.serviceType || null,
        notes: slotData.notes || '',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(slotRef, cleanSlotData, { merge: true });
      return { id: slotId, ...cleanSlotData };
    } catch (error) {
      console.error('Error upserting time slot:', error);
      throw error;
    }
  },

  // Block a time slot
  blockSlot: async (date, time, reason = '') => {
    try {
      return await timeSlotsDB.upsertSlot({
        date: date,
        time: time,
        status: 'blocked',
        notes: reason
      });
    } catch (error) {
      console.error('Error blocking time slot:', error);
      throw error;
    }
  },

  // Unblock/make available a time slot
  unblockSlot: async (date, time) => {
    try {
      return await timeSlotsDB.upsertSlot({
        date: date,
        time: time,
        status: 'available',
        bookingId: null,
        patientName: null,
        patientEmail: null,
        serviceType: null,
        notes: ''
      });
    } catch (error) {
      console.error('Error unblocking time slot:', error);
      throw error;
    }
  },

  // Book a time slot
  bookSlot: async (date, time, bookingData) => {
    try {
      return await timeSlotsDB.upsertSlot({
        date: date,
        time: time,
        status: 'booked',
        bookingId: bookingData.bookingId,
        patientName: bookingData.patientName,
        patientEmail: bookingData.patientEmail,
        serviceType: bookingData.serviceType,
        notes: bookingData.notes || ''
      });
    } catch (error) {
      console.error('Error booking time slot:', error);
      throw error;
    }
  },

  // Get booked slots for a date range (for calendar view)
  getBookedSlots: async (startDate, endDate) => {
    try {
      const q = query(
        collection(db, COLLECTIONS.TIME_SLOTS),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        where('status', '==', 'booked')
      );
      const querySnapshot = await getDocs(q);
      const slots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by date and time in JavaScript
      return slots.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare === 0) {
          return a.time.localeCompare(b.time);
        }
        return dateCompare;
      });
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      throw error;
    }
  },

  // Get available slots for a date range
  getAvailableSlots: async (startDate, endDate) => {
    try {
      const q = query(
        collection(db, COLLECTIONS.TIME_SLOTS),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        where('status', '==', 'available')
      );
      const querySnapshot = await getDocs(q);
      const slots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by date and time in JavaScript
      return slots.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare === 0) {
          return a.time.localeCompare(b.time);
        }
        return dateCompare;
      });
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  },

  // Generate time slots for a date based on business hours
  generateSlotsForDate: async (date, businessHours, slotDuration = 60) => {
    try {
      const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
      const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const dayMap = {
        'sun': 'sunday',
        'mon': 'monday', 
        'tue': 'tuesday',
        'wed': 'wednesday',
        'thu': 'thursday',
        'fri': 'friday',
        'sat': 'saturday'
      };
      
      const fullDayName = dayMap[dayName];
      const dayConfig = businessHours[fullDayName];
      
      if (!dayConfig || !dayConfig.enabled) {
        return [];
      }

      const slots = [];
      const [startHour, startMinute] = dayConfig.start.split(':').map(Number);
      const [endHour, endMinute] = dayConfig.end.split(':').map(Number);
      
      let currentHour = startHour;
      let currentMinute = startMinute;
      
      while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        
        // Check if slot already exists
        const existingSlots = await timeSlotsDB.getSlotsByDate(dateStr);
        const slotExists = existingSlots.some(slot => slot.time === timeStr);
        
        if (!slotExists) {
          const newSlot = await timeSlotsDB.upsertSlot({
            date: dateStr,
            time: timeStr,
            status: 'available'
          });
          slots.push(newSlot);
        }
        
        // Increment time by slot duration
        currentMinute += slotDuration;
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60);
          currentMinute = currentMinute % 60;
        }
      }
      
      return slots;
    } catch (error) {
      console.error('Error generating slots for date:', error);
      throw error;
    }
  },

  // Delete a time slot
  deleteSlot: async (slotId) => {
    try {
      if (typeof slotId === 'object' && slotId.date && slotId.time) {
        slotId = `${slotId.date}_${slotId.time.replace(':', '')}`;
      } else if (typeof slotId === 'string' && slotId.includes('_')) {
        // Already in correct format
      } else {
        throw new Error('Invalid slot ID format');
      }
      await deleteDoc(doc(db, COLLECTIONS.TIME_SLOTS, slotId));
      return true;
    } catch (error) {
      console.error('Error deleting time slot:', error);
      throw error;
    }
  },

  // Get slots in date range (all statuses)
  getSlotsInRange: async (startDate, endDate) => {
    try {
      const q = query(
        collection(db, COLLECTIONS.TIME_SLOTS),
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      );
      const querySnapshot = await getDocs(q);
      const slots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by date and time in JavaScript
      return slots.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare === 0) {
          return a.time.localeCompare(b.time);
        }
        return dateCompare;
      });
    } catch (error) {
      console.error('Error fetching slots in range:', error);
      throw error;
    }
  },

  // Create a single time slot
  createSlot: async (slotData) => {
    try {
      const slotId = `${slotData.date}_${slotData.time.replace(':', '')}`;
      const slotRef = doc(db, COLLECTIONS.TIME_SLOTS, slotId);
      
      const cleanSlotData = {
        date: slotData.date, // YYYY-MM-DD format
        time: slotData.time, // HH:MM format
        endTime: slotData.endTime || null,
        duration: slotData.duration || 30,
        status: slotData.status || 'available', // available, booked, blocked
        bookingId: slotData.bookingId || null,
        patientName: slotData.patientName || null,
        patientEmail: slotData.patientEmail || null,
        serviceType: slotData.serviceType || null,
        notes: slotData.notes || '',
        createdBy: slotData.createdBy || 'system',
        createdAt: slotData.createdAt || new Date(),
        updatedAt: new Date()
      };

      await setDoc(slotRef, cleanSlotData);
      return { id: slotId, ...cleanSlotData };
    } catch (error) {
      console.error('Error creating time slot:', error);
      throw error;
    }
  },

  // Update slot status
  updateSlotStatus: async (slotId, status, additionalData = {}) => {
    try {
      if (typeof slotId === 'object' && slotId.date && slotId.time) {
        slotId = `${slotId.date}_${slotId.time.replace(':', '')}`;
      }
      
      const slotRef = doc(db, COLLECTIONS.TIME_SLOTS, slotId);
      const updateData = {
        status: status,
        ...additionalData,
        updatedAt: new Date()
      };
      
      await updateDoc(slotRef, updateData);
      return true;
    } catch (error) {
      console.error('Error updating slot status:', error);
      throw error;
    }
  },

  // Get slot by ID
  getSlotById: async (slotId) => {
    try {
      if (typeof slotId === 'object' && slotId.date && slotId.time) {
        slotId = `${slotId.date}_${slotId.time.replace(':', '')}`;
      }
      
      const slotRef = doc(db, COLLECTIONS.TIME_SLOTS, slotId);
      const docSnap = await getDoc(slotRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error('Error fetching slot by ID:', error);
      throw error;
    }
  },

  // ATOMIC OPERATIONS WITH ACID PROPERTIES
  
  // Atomically book a time slot (prevents double-booking)
  atomicBookSlot: async (date, time, bookingData) => {
    const slotId = `${date}_${time.replace(':', '')}`;
    const slotRef = doc(db, COLLECTIONS.TIME_SLOTS, slotId);
    const bookingRef = doc(db, COLLECTIONS.BOOKINGS, bookingData.bookingId);
    
    try {
      return await runTransaction(db, async (transaction) => {
        // Read operations first (Isolation)
        const slotDoc = await transaction.get(slotRef);
        const bookingDoc = await transaction.get(bookingRef);
        
        // Validate slot exists and is available (Consistency)
        if (!slotDoc.exists()) {
          throw new Error('Time slot does not exist');
        }
        
        const slot = slotDoc.data();
        if (slot.status !== 'available') {
          throw new Error(`Slot is ${slot.status} and not available for booking`);
        }
        
        // Validate booking exists and is in correct state
        if (!bookingDoc.exists()) {
          throw new Error('Booking record does not exist');
        }
        
        const booking = bookingDoc.data();
        if (booking.status !== 'pending') {
          throw new Error(`Booking is already ${booking.status}`);
        }
        
        // Prepare atomic updates (Atomicity)
        const updatedSlot = {
          ...slot,
          status: 'booked',
          bookingId: bookingData.bookingId,
          patientName: bookingData.patientName,
          patientEmail: bookingData.patientEmail,
          patientPhone: bookingData.patientPhone || null,
          serviceType: bookingData.serviceType,
          notes: bookingData.notes || '',
          bookedAt: new Date(),
          updatedAt: new Date(),
          version: (slot.version || 0) + 1 // Optimistic locking
        };
        
        const updatedBooking = {
          ...booking,
          status: 'confirmed',
          confirmedSlotId: slotId,
          confirmedDate: date,
          confirmedTime: time,
          confirmedAt: new Date(),
          updatedAt: new Date()
        };
        
        // Write operations (Durability)
        transaction.set(slotRef, updatedSlot);
        transaction.set(bookingRef, updatedBooking);
        
        return { 
          slot: { id: slotId, ...updatedSlot },
          booking: { id: bookingData.bookingId, ...updatedBooking }
        };
      });
    } catch (error) {
      console.error('Atomic booking failed:', error);
      throw new Error(`Booking failed: ${error.message}`);
    }
  },

  // Atomically cancel a booking and free the slot
  atomicCancelBooking: async (slotId, bookingId, reason = '') => {
    const slotRef = doc(db, COLLECTIONS.TIME_SLOTS, slotId);
    const bookingRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    
    try {
      return await runTransaction(db, async (transaction) => {
        // Read current state
        const slotDoc = await transaction.get(slotRef);
        const bookingDoc = await transaction.get(bookingRef);
        
        // Validate documents exist
        if (!slotDoc.exists()) {
          throw new Error('Time slot not found');
        }
        if (!bookingDoc.exists()) {
          throw new Error('Booking not found');
        }
        
        const slot = slotDoc.data();
        const booking = bookingDoc.data();
        
        // Validate current state
        if (slot.status !== 'booked') {
          throw new Error('Slot is not currently booked');
        }
        if (slot.bookingId !== bookingId) {
          throw new Error('Slot booking ID mismatch');
        }
        if (booking.status === 'cancelled') {
          throw new Error('Booking is already cancelled');
        }
        
        // Prepare updates
        const updatedSlot = {
          ...slot,
          status: 'available',
          bookingId: null,
          patientName: null,
          patientEmail: null,
          patientPhone: null,
          serviceType: null,
          notes: '',
          bookedAt: null,
          cancelledAt: new Date(),
          updatedAt: new Date(),
          version: (slot.version || 0) + 1
        };
        
        const updatedBooking = {
          ...booking,
          status: 'cancelled',
          cancellationReason: reason,
          cancelledAt: new Date(),
          updatedAt: new Date()
        };
        
        // Atomic write
        transaction.set(slotRef, updatedSlot);
        transaction.set(bookingRef, updatedBooking);
        
        return {
          slot: { id: slotId, ...updatedSlot },
          booking: { id: bookingId, ...updatedBooking }
        };
      });
    } catch (error) {
      console.error('Atomic cancellation failed:', error);
      throw new Error(`Cancellation failed: ${error.message}`);
    }
  },

  // Atomically reschedule a booking to a new slot
  atomicReschedule: async (oldSlotId, newSlotId, bookingId, rescheduleData = {}) => {
    const oldSlotRef = doc(db, COLLECTIONS.TIME_SLOTS, oldSlotId);
    const newSlotRef = doc(db, COLLECTIONS.TIME_SLOTS, newSlotId);
    const bookingRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
    
    try {
      return await runTransaction(db, async (transaction) => {
        // Read all documents
        const oldSlotDoc = await transaction.get(oldSlotRef);
        const newSlotDoc = await transaction.get(newSlotRef);
        const bookingDoc = await transaction.get(bookingRef);
        
        // Validate all documents exist
        if (!oldSlotDoc.exists() || !newSlotDoc.exists() || !bookingDoc.exists()) {
          throw new Error('One or more required documents not found');
        }
        
        const oldSlot = oldSlotDoc.data();
        const newSlot = newSlotDoc.data();
        const booking = bookingDoc.data();
        
        // Validate states
        if (oldSlot.status !== 'booked' || oldSlot.bookingId !== bookingId) {
          throw new Error('Original slot is not booked by this booking');
        }
        if (newSlot.status !== 'available') {
          throw new Error('New slot is not available');
        }
        if (booking.status !== 'confirmed') {
          throw new Error('Booking is not in confirmed state');
        }
        
        // Prepare updates
        const updatedOldSlot = {
          ...oldSlot,
          status: 'available',
          bookingId: null,
          patientName: null,
          patientEmail: null,
          patientPhone: null,
          serviceType: null,
          notes: '',
          bookedAt: null,
          rescheduledAt: new Date(),
          updatedAt: new Date(),
          version: (oldSlot.version || 0) + 1
        };
        
        const updatedNewSlot = {
          ...newSlot,
          status: 'booked',
          bookingId: bookingId,
          patientName: oldSlot.patientName,
          patientEmail: oldSlot.patientEmail,
          patientPhone: oldSlot.patientPhone,
          serviceType: oldSlot.serviceType,
          notes: rescheduleData.notes || oldSlot.notes,
          bookedAt: new Date(),
          rescheduledFrom: oldSlotId,
          updatedAt: new Date(),
          version: (newSlot.version || 0) + 1
        };
        
        const updatedBooking = {
          ...booking,
          confirmedSlotId: newSlotId,
          confirmedDate: newSlot.date,
          confirmedTime: newSlot.time,
          rescheduledFrom: oldSlotId,
          rescheduledAt: new Date(),
          rescheduleReason: rescheduleData.reason || '',
          updatedAt: new Date()
        };
        
        // Atomic write all changes
        transaction.set(oldSlotRef, updatedOldSlot);
        transaction.set(newSlotRef, updatedNewSlot);
        transaction.set(bookingRef, updatedBooking);
        
        return {
          oldSlot: { id: oldSlotId, ...updatedOldSlot },
          newSlot: { id: newSlotId, ...updatedNewSlot },
          booking: { id: bookingId, ...updatedBooking }
        };
      });
    } catch (error) {
      console.error('Atomic reschedule failed:', error);
      throw new Error(`Reschedule failed: ${error.message}`);
    }
  },

  // Atomically block multiple slots (for maintenance, holidays, etc.)
  atomicBlockSlots: async (slotIds, blockData = {}) => {
    if (!Array.isArray(slotIds) || slotIds.length === 0) {
      throw new Error('slotIds must be a non-empty array');
    }
    
    try {
      return await runTransaction(db, async (transaction) => {
        const results = [];
        
        // Read all slots first
        const slotPromises = slotIds.map(slotId => {
          const slotRef = doc(db, COLLECTIONS.TIME_SLOTS, slotId);
          return { slotId, slotRef, docPromise: transaction.get(slotRef) };
        });
        
        const slotDocs = await Promise.all(slotPromises.map(s => s.docPromise));
        
        // Validate and prepare updates
        for (let i = 0; i < slotDocs.length; i++) {
          const slotDoc = slotDocs[i];
          const { slotId, slotRef } = slotPromises[i];
          
          if (!slotDoc.exists()) {
            throw new Error(`Slot ${slotId} does not exist`);
          }
          
          const slot = slotDoc.data();
          if (slot.status === 'booked') {
            throw new Error(`Cannot block slot ${slotId} - it is currently booked`);
          }
          
          const updatedSlot = {
            ...slot,
            status: 'blocked',
            blockReason: blockData.reason || 'Administrative block',
            blockedBy: blockData.blockedBy || 'system',
            blockedAt: new Date(),
            blockNotes: blockData.notes || '',
            updatedAt: new Date(),
            version: (slot.version || 0) + 1
          };
          
          transaction.set(slotRef, updatedSlot);
          results.push({ id: slotId, ...updatedSlot });
        }
        
        return results;
      });
    } catch (error) {
      console.error('Atomic block slots failed:', error);
      throw new Error(`Block slots failed: ${error.message}`);
    }
  },

  // Atomically unblock multiple slots
  atomicUnblockSlots: async (slotIds, unblockData = {}) => {
    if (!Array.isArray(slotIds) || slotIds.length === 0) {
      throw new Error('slotIds must be a non-empty array');
    }
    
    try {
      return await runTransaction(db, async (transaction) => {
        const results = [];
        
        // Read all slots first
        const slotPromises = slotIds.map(slotId => {
          const slotRef = doc(db, COLLECTIONS.TIME_SLOTS, slotId);
          return { slotId, slotRef, docPromise: transaction.get(slotRef) };
        });
        
        const slotDocs = await Promise.all(slotPromises.map(s => s.docPromise));
        
        // Validate and prepare updates
        for (let i = 0; i < slotDocs.length; i++) {
          const slotDoc = slotDocs[i];
          const { slotId, slotRef } = slotPromises[i];
          
          if (!slotDoc.exists()) {
            throw new Error(`Slot ${slotId} does not exist`);
          }
          
          const slot = slotDoc.data();
          if (slot.status !== 'blocked') {
            throw new Error(`Slot ${slotId} is not currently blocked`);
          }
          
          const updatedSlot = {
            ...slot,
            status: 'available',
            blockReason: null,
            blockedBy: null,
            blockedAt: null,
            blockNotes: null,
            unblockedBy: unblockData.unblockedBy || 'system',
            unblockedAt: new Date(),
            unblockReason: unblockData.reason || 'Administrative unblock',
            updatedAt: new Date(),
            version: (slot.version || 0) + 1
          };
          
          transaction.set(slotRef, updatedSlot);
          results.push({ id: slotId, ...updatedSlot });
        }
        
        return results;
      });
    } catch (error) {
      console.error('Atomic unblock slots failed:', error);
      throw new Error(`Unblock slots failed: ${error.message}`);
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