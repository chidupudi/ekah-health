const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// Initialize Google Calendar API with proper error handling
const initializeGoogleCalendar = () => {
  try {
    // Validate environment variables
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable is missing');
    }
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('GOOGLE_PRIVATE_KEY environment variable is missing');
    }

    const credentials = {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    console.log('Service Account Email:', credentials.client_email);
    console.log('Private Key Length:', credentials.private_key.length);

    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
      ], // Add both calendar scopes
      process.env.GOOGLE_CALENDAR_ADMIN_EMAIL || credentials.client_email // Subject for domain-wide delegation
    );

    return google.calendar({ version: 'v3', auth });
  } catch (error) {
    console.error('Error initializing Google Calendar:', error);
    throw error;
  }
};

// Initialize Email Transporter
const initializeEmailTransporter = () => {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP configuration is incomplete');
    }

    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } catch (error) {
    console.error('Error initializing email transporter:', error);
    throw error;
  }
};

// Test authentication before making API calls
const testAuthentication = async (calendar) => {
  try {
    console.log('Testing Google Calendar authentication...');
    const response = await calendar.calendarList.list();
    console.log('✅ Authentication successful. Found', response.data.items?.length || 0, 'calendars');
    return true;
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    if (error.code === 401) {
      console.error('This is likely due to:');
      console.error('1. Invalid service account credentials');
      console.error('2. Service account not properly configured');
      console.error('3. Missing domain-wide delegation setup');
      console.error('4. Calendar API not enabled');
    }
    throw error;
  }
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
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['bookingId', 'patientEmail', 'patientName', 'appointmentDateTime']
      });
    }

    let calendar, transporter;
    
    try {
      calendar = initializeGoogleCalendar();
      transporter = initializeEmailTransporter();
    } catch (initError) {
      console.error('Initialization failed:', initError);
      return res.status(500).json({ 
        error: 'Service initialization failed',
        details: initError.message 
      });
    }

    // Test authentication first
    try {
      await testAuthentication(calendar);
    } catch (authError) {
      console.error('Authentication test failed:', authError);
      return res.status(401).json({ 
        error: 'Authentication failed',
        details: 'Google Calendar API authentication is not properly configured. Please check service account setup.',
        troubleshooting: {
          steps: [
            'Verify GOOGLE_SERVICE_ACCOUNT_EMAIL is correct',
            'Verify GOOGLE_PRIVATE_KEY is properly formatted',
            'Ensure Calendar API is enabled in Google Cloud Console',
            'Check if domain-wide delegation is required and configured'
          ]
        }
      });
    }

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
        timeZone: process.env.TIMEZONE || 'Asia/Kolkata'
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: process.env.TIMEZONE || 'Asia/Kolkata'
      },
      attendees: [
        { email: patientEmail },
        { email: process.env.ADMIN_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL }
      ],
      conferenceData: {
        createRequest: {
          requestId: `booking-${bookingId}-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };

    console.log('Creating calendar event with data:', JSON.stringify(event, null, 2));

    // Create the event
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all'
    });

    const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri;
    const eventId = response.data.id;

    console.log('Calendar event created successfully:', { meetLink, eventId });

    if (!meetLink) {
      console.warn('Google Meet link was not created - this might be due to insufficient permissions');
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

    console.log('Sending confirmation email...');

    try {
      await transporter.sendMail({
        from: `"EkahHealth" <${process.env.SMTP_USER}>`,
        to: patientEmail,
        cc: process.env.ADMIN_EMAIL,
        subject: `✅ Appointment Confirmed - ${appointmentDate.toLocaleDateString()} | Booking ${bookingId}`,
        html: patientEmailContent
      });
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the entire request if email fails
    }

    // Return success with meeting details
    res.status(200).json({
      success: true,
      meetLink: meetLink || null,
      eventId,
      message: meetLink 
        ? 'Meeting created and invites sent successfully' 
        : 'Calendar event created successfully (no meet link generated)',
      troubleshooting: !meetLink ? {
        note: 'Google Meet link was not generated. This might be due to insufficient permissions or Google Workspace configuration.'
      } : null
    });

  } catch (error) {
    console.error('Error creating meeting:', error);
    
    // Provide more specific error information
    let errorDetails = error.message;
    let statusCode = 500;
    
    if (error.code === 401) {
      statusCode = 401;
      errorDetails = 'Authentication failed - check service account configuration';
    } else if (error.code === 403) {
      statusCode = 403;
      errorDetails = 'Permission denied - check Calendar API access and scopes';
    } else if (error.code === 404) {
      statusCode = 404;
      errorDetails = 'Calendar not found - check calendar ID';
    }
    
    res.status(statusCode).json({ 
      error: 'Failed to create meeting',
      details: errorDetails,
      code: error.code,
      troubleshooting: {
        commonCauses: [
          'Service account credentials not properly set',
          'Google Calendar API not enabled',
          'Insufficient permissions/scopes',
          'Domain-wide delegation not configured (if required)',
          'Calendar ID incorrect or inaccessible'
        ],
        environmentVariables: {
          required: [
            'GOOGLE_SERVICE_ACCOUNT_EMAIL',
            'GOOGLE_PRIVATE_KEY'
          ],
          optional: [
            'GOOGLE_CALENDAR_ID (defaults to "primary")',
            'GOOGLE_CALENDAR_ADMIN_EMAIL',
            'TIMEZONE (defaults to "Asia/Kolkata")'
          ]
        }
      }
    });
  }
}