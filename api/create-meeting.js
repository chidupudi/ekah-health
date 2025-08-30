const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// Initialize Google Calendar API
const initializeGoogleCalendar = () => {
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/calendar']
  );

  return google.calendar({ version: 'v3', auth });
};

// Initialize Email Transporter
const initializeEmailTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
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

    console.log('Received request:', { bookingId, patientEmail, patientName, appointmentDateTime, serviceType });

    // Validate required fields
    if (!bookingId || !patientEmail || !patientName || !appointmentDateTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const calendar = initializeGoogleCalendar();
    const transporter = initializeEmailTransporter();

    // Create calendar event with Google Meet
    const appointmentDate = new Date(appointmentDateTime);
    const endDate = new Date(appointmentDate.getTime() + (60 * 60 * 1000)); // 1 hour session

    const event = {
      summary: `EkahHealth - ${serviceType || 'Consultation'} Session`,
      description: `
Booking ID: ${bookingId}
Patient: ${patientName}
Service: ${serviceType || 'General Consultation'}

Join the meeting using the Google Meet link above.
Please join 5 minutes early.

Best regards,
EkahHealth Team
      `,
      start: {
        dateTime: appointmentDate.toISOString(),
        timeZone: 'Asia/Kolkata'
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Asia/Kolkata'
      },
      attendees: [
        { email: patientEmail },
        { email: process.env.ADMIN_EMAIL }
      ],
      conferenceData: {
        createRequest: {
          requestId: `booking-${bookingId}-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };

    console.log('Creating calendar event...');

    // Create the event
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all'
    });

    const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri;
    const eventId = response.data.id;

    console.log('Calendar event created:', { meetLink, eventId });

    if (!meetLink) {
      throw new Error('Failed to create Google Meet link');
    }

    // Send custom email to patient
    const patientEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .info-box { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Your EkahHealth Appointment is Confirmed!</h1>
          </div>
          <div class="content">
            <h2>Hello ${patientName},</h2>
            <p>Great news! Your appointment has been confirmed and we've created a Google Meet session for you.</p>
            
            <div class="info-box">
              <strong>📅 Appointment Details:</strong><br>
              🆔 Booking ID: ${bookingId}<br>
              🕒 Date & Time: ${appointmentDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}<br>
              💊 Service: ${serviceType || 'General Consultation'}<br>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${meetLink}" class="button">🎥 Join Google Meet</a>
            </div>

            <p><strong>Important Instructions:</strong></p>
            <ul>
              <li>📱 Please join the meeting 5 minutes early</li>
              <li>🎧 Ensure you have a stable internet connection and working camera/microphone</li>
              <li>📋 Keep your booking ID handy: <strong>${bookingId}</strong></li>
              <li>📧 You'll receive calendar reminders 24 hours and 1 hour before the session</li>
            </ul>

            <p>If you have any questions, please contact us at <a href="mailto:hello@ekah.life">hello@ekah.life</a></p>

            <p>Looking forward to your session!</p>
            <p><strong>EkahHealth Team</strong><br>
            🌐 <a href="https://ekah.life">ekah.life</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log('Sending email...');

    await transporter.sendMail({
      from: `"EkahHealth" <${process.env.SMTP_USER}>`,
      to: patientEmail,
      cc: process.env.ADMIN_EMAIL,
      subject: `✅ Appointment Confirmed - ${appointmentDate.toLocaleDateString()} | Booking ${bookingId}`,
      html: patientEmailContent
    });

    console.log('Email sent successfully');

    // Return success with meeting details
    res.status(200).json({
      success: true,
      meetLink,
      eventId,
      message: 'Meeting created and invites sent successfully'
    });

  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ 
      error: 'Failed to create meeting',
      details: error.message 
    });
  }
}