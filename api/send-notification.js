const nodemailer = require('nodemailer');

// Initialize Email Transporter (reusing from create-meeting.js)
const initializeEmailTransporter = () => {
  try {
    const emailConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'noreplyekahhealth@gmail.com', 
        pass: 'ddko skyd ucsr fcix'     
      }
    };
    return nodemailer.createTransporter(emailConfig);
  } catch (error) {
    console.error('Error initializing email transporter:', error);
    throw error;
  }
};

// Format date helper
const formatDate = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Generate booking rejection email
const generateRejectionEmail = (patientName, appointmentDateTime, rejectionReason, bookingId, serviceType) => {
  const formattedDateTime = formatDate(appointmentDateTime);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: #fff3e0; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ff9800; }
        .alternative-box { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #4caf50; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 Appointment Update</h1>
          <p style="margin: 0; font-size: 18px;">Booking Status Change</p>
        </div>
        <div class="content">
          <h2>Hello ${patientName},</h2>
          <p>We regret to inform you that your appointment request has been declined.</p>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #ff9800;">📋 Appointment Details</h3>
            <p><strong>🆔 Booking ID:</strong> ${bookingId}</p>
            <p><strong>🕒 Requested Time:</strong> ${formattedDateTime}</p>
            <p><strong>💊 Service:</strong> ${serviceType}</p>
            <p><strong>📝 Reason:</strong> ${rejectionReason}</p>
          </div>

          <div class="alternative-box">
            <h3 style="margin-top: 0; color: #4caf50;">🔄 Next Steps</h3>
            <p>We apologize for any inconvenience. Please consider:</p>
            <ul>
              <li>📅 <strong>Book a different time slot</strong> that may be more suitable</li>
              <li>📞 <strong>Call us directly</strong> at +91 63617 43098 to discuss alternatives</li>
              <li>💬 <strong>WhatsApp support</strong> for immediate assistance</li>
              <li>📧 <strong>Reply to this email</strong> with your preferred alternative times</li>
            </ul>
          </div>

          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
            <h4 style="margin-top: 0;">💚 We're Here to Help</h4>
            <p>Our team is committed to finding the best appointment time for you:</p>
            <ul>
              <li>📧 Email: <a href="mailto:ekahhealth@gmail.com">ekahhealth@gmail.com</a></li>
              <li>📞 Phone: +91 63617 43098</li>
              <li>🌐 Website: <a href="https://ekah.life">ekah.life</a></li>
              <li>💬 WhatsApp: Available for quick queries</li>
            </ul>
          </div>

          <p style="margin-top: 30px;">Thank you for choosing EkahHealth. We look forward to serving you soon!</p>
          
          <p><strong>EkahHealth Team</strong><br>
          🌐 <a href="https://ekah.life">ekah.life</a><br>
          💚 Your Health, Our Priority</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate reschedule email
const generateRescheduleEmail = (patientName, oldDateTime, newDateTime, rescheduleReason, bookingId, serviceType, meetLink) => {
  const oldFormatted = formatDate(oldDateTime);
  const newFormatted = formatDate(newDateTime);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2196f3; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .meeting-card { background: white; border: 2px solid #2196f3; border-radius: 10px; padding: 25px; margin: 20px 0; text-align: center; }
        .button { display: inline-block; background: #2196f3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 10px; font-weight: bold; }
        .change-box { background: #fff3e0; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ff9800; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔄 Appointment Rescheduled</h1>
          <p style="margin: 0; font-size: 18px;">Your appointment time has been updated</p>
        </div>
        <div class="content">
          <h2>Hello ${patientName},</h2>
          <p>Your appointment has been rescheduled. Please note the new date and time below.</p>
          
          <div class="change-box">
            <h3 style="margin-top: 0; color: #ff9800;">📅 Schedule Change</h3>
            <p><strong>🆔 Booking ID:</strong> ${bookingId}</p>
            <p><strong>❌ Previous Time:</strong> <del>${oldFormatted}</del></p>
            <p><strong>✅ New Time:</strong> <strong style="color: #4caf50;">${newFormatted}</strong></p>
            <p><strong>💊 Service:</strong> ${serviceType}</p>
            <p><strong>📝 Reason:</strong> ${rescheduleReason}</p>
          </div>

          ${meetLink ? `
          <div class="meeting-card">
            <h3 style="color: #2196f3; margin-top: 0;">🎥 Updated Meeting Details</h3>
            <p><strong>Meeting Link:</strong></p>
            <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; font-family: monospace;">
              ${meetLink}
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${meetLink}" class="button" target="_blank">
                🎥 Join Video Meeting
              </a>
            </div>
          </div>
          ` : ''}

          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #4caf50;">
            <h4 style="margin-top: 0;">✅ Confirmed Details</h4>
            <p>Your rescheduled appointment is now confirmed for <strong>${newFormatted}</strong></p>
            <p>Please join the meeting 5 minutes early to test your connection.</p>
          </div>

          <p style="margin-top: 30px;">Thank you for your flexibility. We look forward to your consultation!</p>
          
          <p><strong>EkahHealth Team</strong><br>
          🌐 <a href="https://ekah.life">ekah.life</a><br>
          💚 Your Health, Our Priority</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate cancellation email
const generateCancellationEmail = (patientName, appointmentDateTime, cancellationReason, bookingId, serviceType) => {
  const formattedDateTime = formatDate(appointmentDateTime);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ff5722; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: #ffebee; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f44336; }
        .help-box { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #4caf50; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Appointment Cancelled</h1>
          <p style="margin: 0; font-size: 18px;">Booking Cancellation Notice</p>
        </div>
        <div class="content">
          <h2>Hello ${patientName},</h2>
          <p>Your appointment has been cancelled. We apologize for any inconvenience this may cause.</p>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #f44336;">📋 Cancelled Appointment</h3>
            <p><strong>🆔 Booking ID:</strong> ${bookingId}</p>
            <p><strong>🕒 Scheduled Time:</strong> ${formattedDateTime}</p>
            <p><strong>💊 Service:</strong> ${serviceType}</p>
            <p><strong>📝 Reason:</strong> ${cancellationReason}</p>
          </div>

          <div class="help-box">
            <h3 style="margin-top: 0; color: #4caf50;">📅 Rebooking Options</h3>
            <p>We'd be happy to help you schedule a new appointment:</p>
            <ul>
              <li>🌐 <strong>Online Booking:</strong> Visit <a href="https://ekah.life">ekah.life</a></li>
              <li>📞 <strong>Call us:</strong> +91 63617 43098</li>
              <li>📧 <strong>Email us:</strong> <a href="mailto:ekahhealth@gmail.com">ekahhealth@gmail.com</a></li>
              <li>💬 <strong>WhatsApp:</strong> Quick and easy booking support</li>
            </ul>
          </div>

          <p style="margin-top: 30px;">Thank you for understanding. We look forward to serving you in the future!</p>
          
          <p><strong>EkahHealth Team</strong><br>
          🌐 <a href="https://ekah.life">ekah.life</a><br>
          💚 Your Health, Our Priority</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Main handler function
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, bookingId, patientEmail, patientName, appointmentDateTime, rejectionReason, rescheduleReason, cancellationReason, serviceType, oldDateTime, newDateTime, meetLink } = req.body;

    console.log('Sending notification:', { type, bookingId, patientEmail, patientName });

    // Validate required fields
    if (!type || !bookingId || !patientEmail || !patientName) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['type', 'bookingId', 'patientEmail', 'patientName']
      });
    }

    let transporter;
    try {
      transporter = initializeEmailTransporter();
    } catch (initError) {
      console.error('Email initialization failed:', initError);
      return res.status(500).json({ 
        error: 'Email service initialization failed',
        details: initError.message 
      });
    }

    let emailContent = '';
    let emailSubject = '';

    // Generate email content based on notification type
    switch (type) {
      case 'booking_rejection':
        emailContent = generateRejectionEmail(patientName, appointmentDateTime, rejectionReason, bookingId, serviceType);
        emailSubject = `❌ Appointment Request Declined - Booking ${bookingId}`;
        break;
      
      case 'booking_reschedule':
        emailContent = generateRescheduleEmail(patientName, oldDateTime, newDateTime, rescheduleReason, bookingId, serviceType, meetLink);
        emailSubject = `🔄 Appointment Rescheduled - Booking ${bookingId}`;
        break;
      
      case 'booking_cancellation':
        emailContent = generateCancellationEmail(patientName, appointmentDateTime, cancellationReason, bookingId, serviceType);
        emailSubject = `❌ Appointment Cancelled - Booking ${bookingId}`;
        break;
      
      default:
        return res.status(400).json({ 
          error: 'Invalid notification type',
          validTypes: ['booking_rejection', 'booking_reschedule', 'booking_cancellation']
        });
    }

    // Send notification email
    try {
      await transporter.sendMail({
        from: '"EkahHealth" <noreplyekahhealth@gmail.com>',
        to: patientEmail,
        cc: 'ekahhealth@gmail.com', // Admin copy
        subject: emailSubject,
        html: emailContent
      });

      console.log('Notification email sent successfully');

      res.status(200).json({
        success: true,
        message: 'Notification sent successfully',
        notification: {
          type: type,
          bookingId: bookingId,
          patientEmail: patientEmail,
          sentAt: new Date().toISOString()
        }
      });

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.status(500).json({ 
        error: 'Failed to send notification email',
        details: emailError.message
      });
    }

  } catch (error) {
    console.error('Error processing notification:', error);
    
    res.status(500).json({ 
      error: 'Failed to process notification',
      details: error.message
    });
  }
}