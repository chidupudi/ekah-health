import { calendarConfigDB, timeSlotsDB } from '../services/firebase/database';
import moment from 'moment';

export const initializeCalendarSystem = async () => {
  try {
    console.log('Initializing calendar system...');
    
    // 1. Ensure calendar configuration exists
    let config = await calendarConfigDB.getConfig();
    
    if (!config.businessHours) {
      // Set up default business hours
      const defaultConfig = {
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
      
      await calendarConfigDB.updateConfig(defaultConfig);
      config = defaultConfig;
      console.log('✅ Calendar configuration created');
    }
    
    // 2. Generate time slots for next 7 days
    const promises = [];
    for (let i = 0; i < 7; i++) {
      const date = moment().add(i, 'days');
      const dateStr = date.format('YYYY-MM-DD');
      const dayName = date.format('dddd').toLowerCase();
      
      if (config.businessHours[dayName]?.enabled) {
        promises.push(
          timeSlotsDB.generateSlotsForDate(dateStr, config.businessHours, config.slotDuration)
        );
      }
    }
    
    const results = await Promise.all(promises);
    const totalSlots = results.flat().length;
    
    console.log(`✅ Generated ${totalSlots} time slots for the next 7 days`);
    
    return {
      success: true,
      message: `Calendar system initialized successfully with ${totalSlots} time slots`,
      config
    };
    
  } catch (error) {
    console.error('❌ Error initializing calendar system:', error);
    throw error;
  }
};

// Function to manually create some test slots
export const createTestSlots = async () => {
  try {
    console.log('Creating test time slots...');
    
    const testSlots = [];
    const today = moment();
    
    // Create slots for next 3 days, 9 AM to 5 PM, every hour
    for (let day = 1; day <= 3; day++) {
      const date = today.clone().add(day, 'days').format('YYYY-MM-DD');
      
      for (let hour = 9; hour <= 16; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        
        testSlots.push({
          date: date,
          time: time,
          status: 'available'
        });
      }
    }
    
    // Create the slots
    const promises = testSlots.map(slot => timeSlotsDB.upsertSlot(slot));
    const results = await Promise.all(promises);
    
    console.log(`✅ Created ${results.length} test time slots`);
    
    return {
      success: true,
      message: `Created ${results.length} test time slots`,
      slots: results
    };
    
  } catch (error) {
    console.error('❌ Error creating test slots:', error);
    throw error;
  }
};

// Function to check current slot data
export const debugSlotData = async () => {
  try {
    console.log('🔍 Debugging slot data...');
    
    const startDate = moment().format('YYYY-MM-DD');
    const endDate = moment().add(7, 'days').format('YYYY-MM-DD');
    
    // Get all slots in the range
    const allSlots = await timeSlotsDB.getSlots(startDate, endDate);
    const availableSlots = await timeSlotsDB.getAvailableSlots(startDate, endDate);
    const bookedSlots = await timeSlotsDB.getBookedSlots(startDate, endDate);
    
    console.log('📊 Slot Statistics:');
    console.log(`  Total slots: ${allSlots.length}`);
    console.log(`  Available slots: ${availableSlots.length}`);
    console.log(`  Booked slots: ${bookedSlots.length}`);
    
    // Group by date
    const slotsByDate = allSlots.reduce((acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      acc[slot.date].push(slot);
      return acc;
    }, {});
    
    console.log('📅 Slots by date:');
    Object.keys(slotsByDate).sort().forEach(date => {
      console.log(`  ${date}: ${slotsByDate[date].length} slots`);
    });
    
    return {
      allSlots,
      availableSlots,
      bookedSlots,
      slotsByDate
    };
    
  } catch (error) {
    console.error('❌ Error debugging slot data:', error);
    throw error;
  }
};