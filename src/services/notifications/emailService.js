// Email notification service that integrates with your existing API
export const emailService = {
  
  // Send booking confirmation email when admin approves
  sendBookingConfirmation: async (bookingData, meetingDetails) => {
    try {
      const response = await fetch('/api/create-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: bookingData.id,
          patientEmail: bookingData.email,
          patientName: `${bookingData.firstName} ${bookingData.lastName}`,
          appointmentDateTime: new Date(`${bookingData.confirmedDate}T${bookingData.confirmedTime}`).toISOString(),
          serviceType: bookingData.serviceType || 'General Consultation'
        }),
      });

      if (!response.ok) {
        throw new Error(`Email API responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Booking confirmation email sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      throw error;
    }
  },

  // Send booking rejection email
  sendBookingRejection: async (bookingData, rejectionReason) => {
    try {
      // You can create a separate API endpoint for rejection emails
      // or extend the existing create-meeting API
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'booking_rejection',
          bookingId: bookingData.id,
          patientEmail: bookingData.email,
          patientName: `${bookingData.firstName} ${bookingData.lastName}`,
          appointmentDateTime: new Date(`${bookingData.confirmedDate}T${bookingData.confirmedTime}`).toISOString(),
          rejectionReason: rejectionReason,
          serviceType: bookingData.serviceType || 'General Consultation'
        }),
      });

      if (!response.ok) {
        throw new Error(`Notification API responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Booking rejection email sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Error sending booking rejection email:', error);
      // Don't throw error here - rejection should succeed even if email fails
      return { success: false, error: error.message };
    }
  },

  // Send admin notification about new booking
  sendAdminBookingNotification: async (bookingData) => {
    try {
      const response = await fetch('/api/admin-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'new_booking',
          bookingId: bookingData.id,
          patientEmail: bookingData.email,
          patientName: `${bookingData.firstName} ${bookingData.lastName}`,
          appointmentDateTime: new Date(`${bookingData.confirmedDate}T${bookingData.confirmedTime}`).toISOString(),
          serviceType: bookingData.serviceType || 'General Consultation',
          phone: bookingData.phone,
          medicalHistory: bookingData.medicalHistory,
          currentConcerns: bookingData.currentConcerns
        }),
      });

      if (!response.ok) {
        console.warn(`Admin notification API responded with status: ${response.status}`);
        return { success: false, error: 'Admin notification failed' };
      }

      const result = await response.json();
      console.log('Admin notification sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Error sending admin notification:', error);
      // Don't throw error - booking should succeed even if admin notification fails
      return { success: false, error: error.message };
    }
  },

  // Send reschedule notification
  sendRescheduleNotification: async (bookingData, oldSlot, newSlot, rescheduleReason) => {
    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'booking_reschedule',
          bookingId: bookingData.id,
          patientEmail: bookingData.email,
          patientName: `${bookingData.firstName} ${bookingData.lastName}`,
          oldDateTime: new Date(`${oldSlot.date}T${oldSlot.time}`).toISOString(),
          newDateTime: new Date(`${newSlot.date}T${newSlot.time}`).toISOString(),
          rescheduleReason: rescheduleReason,
          serviceType: bookingData.serviceType || 'General Consultation',
          meetLink: bookingData.meetLink?.url
        }),
      });

      if (!response.ok) {
        throw new Error(`Notification API responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Reschedule notification sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Error sending reschedule notification:', error);
      return { success: false, error: error.message };
    }
  },

  // Send cancellation notification
  sendCancellationNotification: async (bookingData, cancellationReason) => {
    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'booking_cancellation',
          bookingId: bookingData.id,
          patientEmail: bookingData.email,
          patientName: `${bookingData.firstName} ${bookingData.lastName}`,
          appointmentDateTime: new Date(`${bookingData.confirmedDate}T${bookingData.confirmedTime}`).toISOString(),
          cancellationReason: cancellationReason,
          serviceType: bookingData.serviceType || 'General Consultation'
        }),
      });

      if (!response.ok) {
        console.warn(`Cancellation notification API responded with status: ${response.status}`);
        return { success: false, error: 'Cancellation notification failed' };
      }

      const result = await response.json();
      console.log('Cancellation notification sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Error sending cancellation notification:', error);
      return { success: false, error: error.message };
    }
  }
};

// Helper function to format date for display
export const formatAppointmentDate = (date, time) => {
  const appointmentDate = new Date(`${date}T${time}`);
  return appointmentDate.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};