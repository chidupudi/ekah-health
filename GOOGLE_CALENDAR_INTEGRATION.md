# Google Calendar Direct Integration

This document explains how to use the direct Google Calendar API integration in your React application.

## Overview

The Google Calendar integration allows your application to:
- **Check real-time availability** against Google Calendar events
- **Create appointments** directly in Google Calendar
- **Sync existing appointments** with your local database
- **Prevent double-bookings** by checking calendar conflicts
- **Support multiple calendars** for availability checking

## Features

- ✅ Direct Google Calendar API integration (no backend required)
- ✅ Real-time availability checking
- ✅ OAuth 2.0 authentication
- ✅ Multiple calendar support
- ✅ Free/busy time detection
- ✅ Event creation and management
- ✅ Automatic slot generation based on availability
- ✅ Weekend and business hours filtering

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Calendar API**
4. Create credentials:
   - **API Key**: For general API access
   - **OAuth 2.0 Client ID**: For user authentication
5. Configure OAuth consent screen
6. Add your domain to authorized origins

### 2. Application Configuration

1. Go to **Admin Dashboard → Settings**
2. Enable Google Calendar Integration
3. Enter your **API Key** and **Client ID**
4. Save the configuration

### 3. User Authentication

Users need to sign in to Google Calendar to check availability:
1. Click "Sign In to Google" button
2. Grant calendar permissions
3. Select calendars to check for conflicts

## Usage Examples

### Basic Calendar Service

```javascript
import googleCalendarService from '../services/googleCalendar';

// Initialize the service
await googleCalendarService.initialize(apiKey, clientId);

// Sign in user
await googleCalendarService.signIn();

// Get available time slots
const slots = await googleCalendarService.findAvailableSlots(
  ['primary'], // calendars to check
  60, // duration in minutes
  '2024-01-01T00:00:00Z', // start time
  '2024-01-07T23:59:59Z', // end time
  { start: '09:00', end: '17:00' } // working hours
);
```

### Using Google Calendar Picker Component

```jsx
import GoogleCalendarPicker from '../components/GoogleCalendarPicker';

function BookingPage() {
  const [selectedSlot, setSelectedSlot] = useState(null);

  return (
    <GoogleCalendarPicker
      onSlotSelect={(slot) => setSelectedSlot(slot)}
      selectedSlot={selectedSlot}
      duration={60} // appointment duration
      workingHours={{ start: '09:00', end: '17:00' }}
    />
  );
}
```

### Creating Calendar Events

```javascript
// Create a new appointment
const eventDetails = {
  title: 'Medical Consultation',
  description: 'Consultation with Dr. Smith',
  start: '2024-01-15T10:00:00Z',
  end: '2024-01-15T11:00:00Z',
  attendees: [
    { email: 'patient@example.com' }
  ],
  location: 'Clinic Room 1'
};

const event = await googleCalendarService.createEvent(eventDetails);
console.log('Event created:', event.id);
```

## Components

### GoogleCalendarService

Main service class for interacting with Google Calendar API.

**Methods:**
- `initialize(apiKey, clientId)` - Initialize the API
- `signIn()` / `signOut()` - Handle authentication
- `getCalendars()` - Get user's calendars
- `getEvents(calendarId, timeMin, timeMax)` - Fetch events
- `createEvent(eventDetails)` - Create new event
- `findAvailableSlots()` - Find free time slots

### GoogleCalendarConfig

Admin configuration component for setting up API credentials.

**Props:**
- `onConfigChange(config)` - Callback when configuration changes

### GoogleCalendarPicker

Enhanced calendar picker with Google Calendar integration.

**Props:**
- `onSlotSelect(slotInfo)` - Callback when slot is selected
- `selectedSlot` - Currently selected slot
- `duration` - Appointment duration in minutes (default: 60)
- `workingHours` - Business hours (default: 9 AM - 5 PM)
- `disabled` - Disable picker interaction

## Integration Points

### Admin Dashboard
- Access Google Calendar configuration via **Settings** tab
- Configure API credentials and enable integration

### Booking Flow
- Automatically uses Google Calendar picker when enabled
- Falls back to basic calendar when disabled/not configured

### Automatic Switching
```javascript
// The system automatically detects if Google Calendar is configured
const config = localStorage.getItem('googleCalendarConfig');
const useGoogleCalendar = config ? JSON.parse(config).enabled : false;

// Renders appropriate picker component
{useGoogleCalendar ? <GoogleCalendarPicker /> : <CalendarPicker />}
```

## Configuration Storage

Settings are stored in localStorage as:
```json
{
  "apiKey": "your-api-key",
  "clientId": "your-client-id", 
  "enabled": true,
  "selectedCalendar": "primary"
}
```

## Error Handling

The integration includes comprehensive error handling:
- API initialization failures
- Authentication errors
- Network connectivity issues
- Rate limit handling
- Fallback to basic calendar on errors

## Security Notes

- API credentials are stored locally (consider server-side storage for production)
- OAuth tokens are managed by Google's GAPI library
- All API calls use HTTPS
- User consent is required for calendar access

## Dependencies

Required packages (already installed):
```json
{
  "gapi-script": "^1.2.0",
  "googleapis": "^159.0.0", 
  "google-auth-library": "^10.3.0"
}
```

## Troubleshooting

### Common Issues

1. **API not initialized**
   - Check API key and Client ID are correct
   - Ensure Google Calendar API is enabled in Cloud Console

2. **Sign-in failures**
   - Verify domain is added to authorized origins
   - Check OAuth consent screen is configured

3. **No available slots**
   - Verify business hours configuration
   - Check if calendars have conflicting events
   - Ensure future dates are being requested

4. **CORS errors**
   - Add your domain to Google Cloud Console authorized origins
   - Use HTTPS in production

### Debug Mode

Enable detailed logging:
```javascript
// Service automatically logs detailed information to console
// Check browser developer tools for API call details
```

This integration provides a seamless, real-time calendar experience directly integrated with Google Calendar, ensuring accurate availability and preventing double bookings.