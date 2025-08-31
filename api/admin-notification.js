const nodemailer = require('nodemailer');

// Initialize Email Transporter
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

// Generate admin notification for new booking
const generateNewBookingAdminEmail = (patientName, patientEmail, phone, appointmentDateTime, bookingId, serviceType, medicalHistory, currentConcerns) => {
  const formattedDateTime = formatDate(appointmentDateTime);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .patient-card { background: white; border: 2px solid #3498db; border-radius: 10px; padding: 25px; margin: 20px 0; }
        .medical-info { background: #fff3e0; border-left: 4px solid #ff9800; padding: 20px; border-radius: 5px; margin: 15px 0; }
        .action-buttons { text-align: center; margin: 30px 0; }
        .button { display: inline-block; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 10px; font-weight: bold; text-transform: uppercase; }
        .confirm-btn { background: #27ae60; }
        .reject-btn { background: #e74c3c; }
        .urgent { background: #ffebee; border-left: 4px solid #f44336; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .priority { background: #e8f5e8; border-left: 4px solid #4caf50; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 NEW BOOKING ALERT</h1>
          <p style="margin: 0; font-size: 18px;">Requires Admin Confirmation</p>
        </div>
        <div class="content">
          <div class="urgent">
            <h2 style="margin-top: 0; color: #f44336;">⏰ Action Required - New Patient Booking</h2>
            <p><strong>A new patient has booked an appointment and is waiting for confirmation.</strong></p>
          </div>
          
          <div class="patient-card">
            <h3 style="color: #2c3e50; margin-top: 0;">👤 Patient Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>🆔 Booking ID:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; color: #e74c3c; font-weight: bold;">${bookingId}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>👤 Patient Name:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${patientName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>📧 Email:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${patientEmail}">${patientEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>📞 Phone:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>🕒 Appointment Time:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; color: #27ae60; font-weight: bold;">${formattedDateTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>💊 Service Type:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${serviceType}</td>
              </tr>
            </table>
          </div>

          ${medicalHistory || currentConcerns ? `
          <div class="medical-info">
            <h3 style="margin-top: 0; color: #f57c00;">📋 Medical Information</h3>
            ${medicalHistory ? `
            <div style="margin-bottom: 15px;">
              <strong>🏥 Medical History:</strong>
              <p style="background: white; padding: 10px; border-radius: 5px; margin: 5px 0;">${medicalHistory}</p>
            </div>
            ` : ''}
            ${currentConcerns ? `
            <div>
              <strong>⚕️ Current Concerns:</strong>
              <p style="background: white; padding: 10px; border-radius: 5px; margin: 5px 0;">${currentConcerns}</p>
            </div>
            ` : ''}
          </div>
          ` : ''}

          <div class="priority">
            <h3 style="margin-top: 0; color: #4caf50;">⚡ Quick Actions Needed</h3>
            <ol>
              <li><strong>Review</strong> the patient information and medical details above</li>
              <li><strong>Confirm or reject</strong> the appointment using your admin dashboard</li>
              <li><strong>If confirmed:</strong> Meeting link will be auto-generated and sent to patient</li>
              <li><strong>If rejected:</strong> Patient will be notified with the reason</li>
            </ol>
          </div>

          <div class="action-buttons">
            <p style="font-size: 18px; margin-bottom: 20px;"><strong>🎯 Admin Dashboard Actions Required</strong></p>
            <p>Log in to your admin panel to confirm or reject this booking:</p>
            <a href="https://ekah.life/admin/bookings/${bookingId}" class="button confirm-btn">
              ✅ Review & Confirm
            </a>
            <a href="https://ekah.life/admin/bookings" class="button" style="background: #3498db;">
              📋 All Bookings
            </a>
          </div>

          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin-top: 30px;">
            <h4 style="margin-top: 0; color: #1976d2;">📋 Next Steps Checklist</h4>
            <ul style="margin: 0;">
              <li>☐ Review patient medical information</li>
              <li>☐ Check calendar availability</li>
              <li>☐ Confirm or reject the appointment</li>
              <li>☐ If confirmed: Meeting link will be automatically generated</li>
              <li>☐ Patient and admin will receive email confirmations</li>
            </ul>
          </div>

          <div style="background: #ffebee; padding: 15px; border-radius: 5px; margin-top: 20px; border-left: 4px solid #f44336;">
            <p style="margin: 0;"><strong>⏰ Time Sensitive:</strong> Patient is waiting for confirmation. Please respond within 24 hours for best service experience.</p>
          </div>

          <p style="margin-top: 30px; text-align: center;">
            <strong>EkahHealth Admin System</strong><br>
            🌐 Admin Panel: <a href="https://ekah.life/admin">ekah.life/admin</a><br>
            📧 Support: <a href="mailto:admin@ekah.life">admin@ekah.life</a>
          </p>
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
    const { 
      type, 
      bookingId, 
      patientEmail, 
      patientName, 
      appointmentDateTime, 
      serviceType, 
      phone, 
      medicalHistory, 
      currentConcerns 
    } = req.body;

    console.log('Sending admin notification:', { type, bookingId, patientName });

    // Validate required fields
    if (!type || !bookingId || !patientEmail || !patientName || !appointmentDateTime) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['type', 'bookingId', 'patientEmail', 'patientName', 'appointmentDateTime']
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
    let recipientEmail = 'ekahhealth@gmail.com'; // Admin email

    // Generate email content based on notification type
    switch (type) {
      case 'new_booking':
        emailContent = generateNewBookingAdminEmail(
          patientName, 
          patientEmail, 
          phone, 
          appointmentDateTime, 
          bookingId, 
          serviceType,
          medicalHistory,
          currentConcerns
        );
        emailSubject = `🚨 NEW BOOKING ALERT - ${patientName} | ${bookingId}`;
        break;
      
      default:
        return res.status(400).json({ 
          error: 'Invalid notification type',
          validTypes: ['new_booking']
        });
    }

    // Send admin notification email
    try {
      await transporter.sendMail({
        from: '"EkahHealth Bookings" <noreplyekahhealth@gmail.com>',
        to: recipientEmail,
        subject: emailSubject,
        html: emailContent,
        priority: 'high' // Mark as high priority
      });

      console.log('Admin notification email sent successfully');

      res.status(200).json({
        success: true,
        message: 'Admin notification sent successfully',
        notification: {
          type: type,
          bookingId: bookingId,
          patientName: patientName,
          adminEmail: recipientEmail,
          sentAt: new Date().toISOString()
        }
      });

    } catch (emailError) {
      console.error('Admin email sending failed:', emailError);
      res.status(500).json({ 
        error: 'Failed to send admin notification',
        details: emailError.message
      });
    }

  } catch (error) {
    console.error('Error processing admin notification:', error);
    
    res.status(500).json({ 
      error: 'Failed to process admin notification',
      details: error.message
    });
  }
}