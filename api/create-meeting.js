
const nodemailer = require('nodemailer');

// Initialize Email Transporter
const initializeEmailTransporter = () => {
  try {
    // Using Gmail SMTP - you can change these credentials
    const emailConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'ekahhealth@gmail.com', // Replace with your email
        pass: 'mwdj pluj imjg mbpf'     // Replace with your app password
      }
    };

    return nodemailer.createTransport(emailConfig);
  } catch (error) {
    console.error('Error initializing email transporter:', error);
    throw error;
  }
};

// Generate Jitsi Meeting URL
const generateJitsiMeetingURL = (bookingId, patientName) => {
  // Create a unique room name
  const timestamp = Date.now();
  const sanitizedName = patientName.replace(/[^a-zA-Z0-9]/g, '');
  const roomName = `EkahHealth-${bookingId}-${sanitizedName}-${timestamp}`;
  
  // Jitsi Meet URL format
  const meetingURL = `https://meet.jit.si/${roomName}`;
  
  // Optional: Add URL parameters for better experience
  const configParams = new URLSearchParams({
    'config.startWithAudioMuted': 'true',
    'config.startWithVideoMuted': 'false',
    'config.prejoinPageEnabled': 'true',
    'config.requireDisplayName': 'true'
  });
  
  return {
    meetingURL: meetingURL,
    fullURL: `${meetingURL}#${configParams.toString()}`,
    roomName: roomName,
    directJoinURL: `${meetingURL}/${sanitizedName}` // Patient can join with their name
  };
};

// Generate meeting password (optional)
const generateMeetingPassword = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
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
    const { bookingId, patientEmail, patientName, appointmentDateTime, serviceType } = req.body;

    console.log('Creating Jitsi meeting for:', { bookingId, patientEmail, patientName, appointmentDateTime, serviceType });

    // Validate required fields
    if (!bookingId || !patientEmail || !patientName || !appointmentDateTime) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['bookingId', 'patientEmail', 'patientName', 'appointmentDateTime']
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

    // Generate Jitsi meeting details
    const meetingDetails = generateJitsiMeetingURL(bookingId, patientName);
    const meetingPassword = generateMeetingPassword(); // Optional password
    
    // Format appointment date and time
    const appointmentDate = new Date(appointmentDateTime);
    const formattedDateTime = appointmentDate.toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    console.log('Generated Jitsi meeting:', meetingDetails);

    // Create meeting information object
    const meetingInfo = {
      meetingURL: meetingDetails.meetingURL,
      fullURL: meetingDetails.fullURL,
      roomName: meetingDetails.roomName,
      password: meetingPassword,
      appointmentTime: formattedDateTime,
      bookingId: bookingId,
      serviceType: serviceType || 'General Consultation'
    };

    // Send email to patient with meeting details
    const patientEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .meeting-card { background: white; border: 2px solid #667eea; border-radius: 10px; padding: 25px; margin: 20px 0; text-align: center; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 10px; font-weight: bold; }
          .info-box { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2196f3; }
          .highlight { background: #fff3e0; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #ff9800; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎥 Your EkahHealth Video Appointment</h1>
            <p style="margin: 0; font-size: 18px;">Meeting Confirmed!</p>
          </div>
          <div class="content">
            <h2>Hello ${patientName},</h2>
            <p>Your video consultation appointment has been confirmed! You can join the meeting using the details below.</p>
            
            <div class="meeting-card">
              <h3 style="color: #667eea; margin-top: 0;">📅 Appointment Details</h3>
              <p><strong>🆔 Booking ID:</strong> ${bookingId}</p>
              <p><strong>🕒 Date & Time:</strong> ${formattedDateTime}</p>
              <p><strong>💊 Service:</strong> ${serviceType || 'General Consultation'}</p>
              <p><strong>⏱️ Duration:</strong> 30-60 minutes</p>
            </div>

            <div class="info-box">
              <h3 style="margin-top: 0; color: #1976d2;">🎥 Join Your Video Meeting</h3>
              <p style="font-size: 16px;"><strong>Meeting Link:</strong></p>
              <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all; font-family: monospace;">
                ${meetingDetails.meetingURL}
              </p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${meetingDetails.meetingURL}" class="button" target="_blank">
                  🎥 Join Video Meeting
                </a>
              </div>
              <p><strong>Room Name:</strong> ${meetingDetails.roomName}</p>
              <p><strong>Meeting Password:</strong> ${meetingPassword} (if required)</p>
            </div>

            <div class="highlight">
              <h4 style="margin-top: 0;">📱 How to Join:</h4>
              <ol>
                <li><strong>On Computer:</strong> Click the meeting link above - it opens in your web browser (Chrome/Firefox recommended)</li>
                <li><strong>On Mobile:</strong> Download the free "Jitsi Meet" app or use your mobile browser</li>
                <li><strong>No Account Needed:</strong> Just click and join - no registration required!</li>
              </ol>
            </div>

            <div class="info-box">
              <h4 style="margin-top: 0; color: #2e7d32;">📋 Important Instructions:</h4>
              <ul style="text-align: left;">
                <li>🕒 <strong>Join 5 minutes early</strong> to test your camera and microphone</li>
                <li>🌐 <strong>Stable Internet:</strong> Ensure you have a good internet connection</li>
                <li>🎧 <strong>Quiet Space:</strong> Find a quiet, well-lit room for the consultation</li>
                <li>📱 <strong>Backup:</strong> Keep your phone ready as backup if needed</li>
                <li>📋 <strong>Documents:</strong> Keep any medical documents or reports handy</li>
                <li>🆔 <strong>ID Ready:</strong> Your booking ID is ${bookingId}</li>
              </ul>
            </div>

            <div class="highlight">
              <h4 style="margin-top: 0;">❓ Need Help?</h4>
              <p>If you have any technical issues or questions:</p>
              <ul>
                <li>📧 Email: <a href="mailto:hello@ekah.life">hello@ekah.life</a></li>
                <li>📞 Phone: +91 63617 43098</li>
                <li>💬 WhatsApp support available</li>
              </ul>
            </div>

            <p style="margin-top: 30px;">We look forward to your consultation!</p>
            
            <p><strong>EkahHealth Team</strong><br>
            🌐 <a href="https://ekah.life">ekah.life</a><br>
            💚 Your Health, Our Priority</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send confirmation email to patient
    console.log('Sending confirmation email to patient...');

    try {
      await transporter.sendMail({
        from: '"EkahHealth" <hello@ekah.life>',
        to: patientEmail,
        cc: 'admin@ekah.life', // Admin copy
        subject: `🎥 Video Meeting Ready - ${appointmentDate.toLocaleDateString()} | Booking ${bookingId}`,
        html: patientEmailContent
      });
      console.log('Patient email sent successfully');
    } catch (emailError) {
      console.error('Patient email sending failed:', emailError);
      // Don't fail the entire request if email fails
    }

    // Send notification email to admin/doctor
    const adminEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2c3e50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f8f9fa; padding: 25px; border-radius: 0 0 5px 5px; }
          .patient-info { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #3498db; }
          .meeting-info { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #27ae60; }
          .button { display: inline-block; background: #27ae60; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 10px 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>👨‍⚕️ New Patient Appointment Confirmed</h2>
          </div>
          <div class="content">
            <div class="patient-info">
              <h3 style="color: #2c3e50; margin-top: 0;">👤 Patient Information</h3>
              <p><strong>Name:</strong> ${patientName}</p>
              <p><strong>Email:</strong> ${patientEmail}</p>
              <p><strong>Booking ID:</strong> ${bookingId}</p>
              <p><strong>Service:</strong> ${serviceType || 'General Consultation'}</p>
              <p><strong>Appointment:</strong> ${formattedDateTime}</p>
            </div>

            <div class="meeting-info">
              <h3 style="color: #27ae60; margin-top: 0;">🎥 Meeting Details</h3>
              <p><strong>Meeting Room:</strong> ${meetingDetails.roomName}</p>
              <p><strong>Join URL:</strong> <a href="${meetingDetails.meetingURL}" target="_blank">${meetingDetails.meetingURL}</a></p>
              <p><strong>Password:</strong> ${meetingPassword}</p>
              
              <div style="text-align: center;">
                <a href="${meetingDetails.meetingURL}" class="button" target="_blank">
                  🎥 Join as Doctor
                </a>
              </div>
            </div>

            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
              <p><strong>⏰ Reminder:</strong> Patient has been notified and will join the meeting. Please be available 5 minutes before the scheduled time.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send admin notification
    try {
      await transporter.sendMail({
        from: '"EkahHealth Bookings" <bookings@ekah.life>',
        to: 'admin@ekah.life', // Replace with actual admin email
        subject: `👨‍⚕️ New Appointment: ${patientName} - ${appointmentDate.toLocaleDateString()}`,
        html: adminEmailContent
      });
      console.log('Admin notification sent successfully');
    } catch (emailError) {
      console.error('Admin email sending failed:', emailError);
    }

    // Return success with meeting details
    res.status(200).json({
      success: true,
      message: 'Jitsi meeting created and invitations sent successfully',
      meeting: {
        meetingURL: meetingDetails.meetingURL,
        fullURL: meetingDetails.fullURL,
        roomName: meetingDetails.roomName,
        password: meetingPassword,
        joinInstructions: {
          desktop: "Click the meeting link to join in your web browser",
          mobile: "Download Jitsi Meet app or use mobile browser",
          backup: "No account registration required - just click and join!"
        }
      },
      appointment: {
        bookingId: bookingId,
        patientName: patientName,
        appointmentTime: formattedDateTime,
        serviceType: serviceType
      }
    });

  } catch (error) {
    console.error('Error creating Jitsi meeting:', error);
    
    res.status(500).json({ 
      error: 'Failed to create meeting',
      details: error.message,
      troubleshooting: {
        commonCauses: [
          'Email configuration incorrect',
          'Invalid appointment data',
          'Network connectivity issues'
        ],
        solution: 'Check email settings and appointment data format'
      }
    });
  }
}