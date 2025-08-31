// Complete Booking System Examples
// This file shows how to use the atomic booking operations with email notifications

import { timeSlotsDB, bookingsDB } from './firebase/database.js';

/**
 * COMPLETE BOOKING FLOW EXAMPLE
 * 
 * Step 1: User books a slot
 * Step 2: Admin gets notified via email
 * Step 3: Admin confirms/rejects booking
 * Step 4: Meet link generated and sent to both parties
 */

// Example 1: User Books a Time Slot
export const userBookSlotExample = async () => {
  try {
    console.log('🚀 Starting user booking process...');
    
    // Sample booking data
    const bookingData = {
      bookingId: 'book_123456', // Should be generated from bookingsDB.add()
      patientName: 'John Doe',
      patientEmail: 'john.doe@example.com',
      patientPhone: '+91 98765 43210',
      serviceType: 'General Consultation'
    };
    
    const date = '2024-01-15';
    const time = '14:30';
    
    // Atomically book the slot
    const result = await timeSlotsDB.atomicBookSlot(date, time, bookingData);
    
    console.log('✅ Booking successful:', result);
    console.log('📧 Admin notification will be sent automatically');
    console.log('⏳ Status: pending_admin_confirmation');
    
    return result;
  } catch (error) {
    console.error('❌ Booking failed:', error.message);
    throw error;
  }
};

// Example 2: Admin Confirms Booking (Generates Meet Link)
export const adminConfirmBookingExample = async () => {
  try {
    console.log('👨‍💼 Admin confirming booking...');
    
    const bookingId = 'book_123456';
    const adminData = {
      adminId: 'admin_001',
      notes: 'All documentation verified. Appointment confirmed.'
    };
    
    // Atomically confirm booking and generate meet link
    const result = await timeSlotsDB.atomicAdminConfirmBooking(bookingId, adminData);
    
    console.log('✅ Booking confirmed:', result.booking);
    console.log('🎥 Meet link generated:', result.meetLink);
    console.log('📧 Confirmation email sent to patient and admin');
    
    return result;
  } catch (error) {
    console.error('❌ Confirmation failed:', error.message);
    throw error;
  }
};

// Example 3: Admin Rejects Booking
export const adminRejectBookingExample = async () => {
  try {
    console.log('👨‍💼 Admin rejecting booking...');
    
    const bookingId = 'book_123456';
    const rejectionData = {
      adminId: 'admin_001',
      reason: 'Requested time slot conflicts with emergency appointment',
      notes: 'Alternative times suggested in email'
    };
    
    // Atomically reject booking and free the slot
    const result = await timeSlotsDB.atomicAdminRejectBooking(bookingId, rejectionData);
    
    console.log('❌ Booking rejected:', result.booking);
    console.log('📧 Rejection notification sent to patient');
    console.log('🔓 Time slot freed for other bookings');
    
    return result;
  } catch (error) {
    console.error('❌ Rejection failed:', error.message);
    throw error;
  }
};

// Example 4: Reschedule a Confirmed Booking
export const rescheduleBookingExample = async () => {
  try {
    console.log('🔄 Rescheduling booking...');
    
    const oldSlotId = '2024-01-15_1430';
    const newSlotId = '2024-01-16_1500'; 
    const bookingId = 'book_123456';
    const rescheduleData = {
      reason: 'Doctor unavailable due to emergency',
      notes: 'Patient agreed to new time via phone call'
    };
    
    // Atomically reschedule booking
    const result = await timeSlotsDB.atomicReschedule(oldSlotId, newSlotId, bookingId, rescheduleData);
    
    console.log('✅ Booking rescheduled successfully');
    console.log('📅 Old slot freed:', result.oldSlot);
    console.log('📅 New slot booked:', result.newSlot);
    console.log('📧 Reschedule notification sent to patient');
    
    return result;
  } catch (error) {
    console.error('❌ Reschedule failed:', error.message);
    throw error;
  }
};

// Example 5: Cancel a Booking
export const cancelBookingExample = async () => {
  try {
    console.log('❌ Cancelling booking...');
    
    const slotId = '2024-01-15_1430';
    const bookingId = 'book_123456';
    const reason = 'Patient requested cancellation due to travel';
    
    // Atomically cancel booking and free slot
    const result = await timeSlotsDB.atomicCancelBooking(slotId, bookingId, reason);
    
    console.log('✅ Booking cancelled successfully');
    console.log('🔓 Slot freed:', result.slot);
    console.log('📧 Cancellation notification sent');
    
    return result;
  } catch (error) {
    console.error('❌ Cancellation failed:', error.message);
    throw error;
  }
};

// Example 6: Block Multiple Slots (Admin Maintenance)
export const blockSlotsExample = async () => {
  try {
    console.log('🚫 Blocking slots for maintenance...');
    
    const slotIds = [
      '2024-01-15_0900',
      '2024-01-15_0930', 
      '2024-01-15_1000'
    ];
    
    const blockData = {
      reason: 'System maintenance and equipment check',
      blockedBy: 'admin_001',
      notes: 'Scheduled maintenance window - 3 hours'
    };
    
    // Atomically block multiple slots
    const result = await timeSlotsDB.atomicBlockSlots(slotIds, blockData);
    
    console.log('✅ Slots blocked successfully:', result.length);
    result.forEach(slot => {
      console.log(`🚫 Blocked: ${slot.date} at ${slot.time}`);
    });
    
    return result;
  } catch (error) {
    console.error('❌ Block operation failed:', error.message);
    throw error;
  }
};

// Example 7: Get Admin Dashboard Data
export const getAdminDashboardData = async () => {
  try {
    console.log('📊 Loading admin dashboard data...');
    
    // Get bookings pending admin confirmation
    const pendingBookings = await bookingsDB.getPendingAdminConfirmation();
    
    // Get confirmed bookings for today
    const today = new Date().toISOString().split('T')[0];
    const todayEnd = today;
    const confirmedToday = await bookingsDB.getConfirmedBookings(today, todayEnd);
    
    // Get all bookings by status
    const allPending = await bookingsDB.getByStatus('pending_admin_confirmation');
    const allConfirmed = await bookingsDB.getByStatus('confirmed');
    const allRejected = await bookingsDB.getByStatus('rejected');
    
    const dashboardData = {
      pendingConfirmation: {
        count: pendingBookings.length,
        bookings: pendingBookings
      },
      todaysAppointments: {
        count: confirmedToday.length,
        bookings: confirmedToday
      },
      summary: {
        totalPending: allPending.length,
        totalConfirmed: allConfirmed.length,
        totalRejected: allRejected.length,
        totalBookings: allPending.length + allConfirmed.length + allRejected.length
      }
    };
    
    console.log('📊 Dashboard data loaded:', dashboardData.summary);
    return dashboardData;
    
  } catch (error) {
    console.error('❌ Dashboard data loading failed:', error.message);
    throw error;
  }
};

// Example 8: Complete Booking Flow (End-to-End)
export const completeBookingFlowExample = async () => {
  try {
    console.log('🎬 Starting complete booking flow example...');
    
    // Step 1: User books a slot
    console.log('\n--- Step 1: User Books Slot ---');
    const booking = await userBookSlotExample();
    
    // Wait a moment (simulating real-world delay)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 2: Admin confirms booking
    console.log('\n--- Step 2: Admin Confirms Booking ---');
    const confirmation = await adminConfirmBookingExample();
    
    console.log('\n🎉 Complete flow finished successfully!');
    console.log('📧 Patient has received meet link');
    console.log('📧 Admin has been notified');
    console.log('🎥 Meeting ready:', confirmation.meetLink.url);
    
    return {
      booking: booking.booking,
      meetLink: confirmation.meetLink,
      status: 'completed'
    };
    
  } catch (error) {
    console.error('❌ Complete flow failed:', error.message);
    throw error;
  }
};

// Utility function to test the system
export const runBookingSystemTests = async () => {
  console.log('🧪 Running booking system tests...\n');
  
  try {
    // Test admin dashboard
    await getAdminDashboardData();
    console.log('✅ Admin dashboard test passed\n');
    
    // Test slot blocking
    // await blockSlotsExample();
    // console.log('✅ Slot blocking test passed\n');
    
    console.log('🎉 All booking system tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Booking system tests failed:', error);
  }
};