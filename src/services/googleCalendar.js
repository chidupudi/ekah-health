import { gapi } from 'gapi-script';

const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events';

class GoogleCalendarService {
  constructor() {
    this.isInitialized = false;
    this.isSignedIn = false;
    this.authInstance = null;
  }

  async initialize(apiKey, clientId) {
    try {
      if (this.isInitialized) {
        return true;
      }

      await gapi.load('auth2', () => {});
      await gapi.load('client', () => {});

      await gapi.client.init({
        apiKey: apiKey,
        clientId: clientId,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      });

      this.authInstance = gapi.auth2.getAuthInstance();
      this.isSignedIn = this.authInstance.isSignedIn.get();
      this.isInitialized = true;

      // Listen for sign-in state changes
      this.authInstance.isSignedIn.listen((isSignedIn) => {
        this.isSignedIn = isSignedIn;
      });

      console.log('Google Calendar API initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Google Calendar API:', error);
      throw new Error(`Failed to initialize Google Calendar API: ${error.message}`);
    }
  }

  async signIn() {
    try {
      if (!this.isInitialized) {
        throw new Error('Google Calendar API not initialized');
      }

      if (this.isSignedIn) {
        return true;
      }

      await this.authInstance.signIn();
      this.isSignedIn = this.authInstance.isSignedIn.get();
      console.log('User signed in to Google Calendar');
      return this.isSignedIn;
    } catch (error) {
      console.error('Error signing in:', error);
      throw new Error(`Failed to sign in: ${error.message}`);
    }
  }

  async signOut() {
    try {
      if (!this.isInitialized) {
        throw new Error('Google Calendar API not initialized');
      }

      await this.authInstance.signOut();
      this.isSignedIn = false;
      console.log('User signed out from Google Calendar');
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error(`Failed to sign out: ${error.message}`);
    }
  }

  getSignInStatus() {
    return {
      isInitialized: this.isInitialized,
      isSignedIn: this.isSignedIn
    };
  }

  async getCalendars() {
    try {
      if (!this.isSignedIn) {
        throw new Error('User not signed in');
      }

      const response = await gapi.client.calendar.calendarList.list({
        minAccessRole: 'writer'
      });

      return response.result.items || [];
    } catch (error) {
      console.error('Error fetching calendars:', error);
      throw new Error(`Failed to fetch calendars: ${error.message}`);
    }
  }

  async getEvents(calendarId = 'primary', timeMin = null, timeMax = null, maxResults = 250) {
    try {
      if (!this.isSignedIn) {
        throw new Error('User not signed in');
      }

      const params = {
        calendarId: calendarId,
        orderBy: 'startTime',
        singleEvents: true,
        maxResults: maxResults
      };

      if (timeMin) {
        params.timeMin = timeMin;
      }

      if (timeMax) {
        params.timeMax = timeMax;
      }

      const response = await gapi.client.calendar.events.list(params);
      return response.result.items || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  }

  async createEvent(eventDetails, calendarId = 'primary') {
    try {
      if (!this.isSignedIn) {
        throw new Error('User not signed in');
      }

      const event = {
        summary: eventDetails.title || eventDetails.summary,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.start,
          timeZone: eventDetails.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: eventDetails.end,
          timeZone: eventDetails.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        attendees: eventDetails.attendees || [],
        reminders: eventDetails.reminders || {
          useDefault: true
        }
      };

      if (eventDetails.location) {
        event.location = eventDetails.location;
      }

      const response = await gapi.client.calendar.events.insert({
        calendarId: calendarId,
        resource: event
      });

      console.log('Event created successfully:', response.result);
      return response.result;
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error(`Failed to create event: ${error.message}`);
    }
  }

  async updateEvent(eventId, eventDetails, calendarId = 'primary') {
    try {
      if (!this.isSignedIn) {
        throw new Error('User not signed in');
      }

      const event = {
        summary: eventDetails.title || eventDetails.summary,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.start,
          timeZone: eventDetails.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: eventDetails.end,
          timeZone: eventDetails.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      if (eventDetails.attendees) {
        event.attendees = eventDetails.attendees;
      }

      if (eventDetails.location) {
        event.location = eventDetails.location;
      }

      const response = await gapi.client.calendar.events.update({
        calendarId: calendarId,
        eventId: eventId,
        resource: event
      });

      console.log('Event updated successfully:', response.result);
      return response.result;
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error(`Failed to update event: ${error.message}`);
    }
  }

  async deleteEvent(eventId, calendarId = 'primary') {
    try {
      if (!this.isSignedIn) {
        throw new Error('User not signed in');
      }

      await gapi.client.calendar.events.delete({
        calendarId: calendarId,
        eventId: eventId
      });

      console.log('Event deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  }

  async getFreeBusy(calendars, timeMin, timeMax) {
    try {
      if (!this.isSignedIn) {
        throw new Error('User not signed in');
      }

      const items = calendars.map(calendarId => ({ id: calendarId }));

      const response = await gapi.client.calendar.freebusy.query({
        resource: {
          timeMin: timeMin,
          timeMax: timeMax,
          items: items
        }
      });

      return response.result;
    } catch (error) {
      console.error('Error fetching free/busy information:', error);
      throw new Error(`Failed to fetch free/busy information: ${error.message}`);
    }
  }

  async findAvailableSlots(calendars, duration, timeMin, timeMax, workingHours = { start: '09:00', end: '17:00' }) {
    try {
      const freeBusyData = await this.getFreeBusy(calendars, timeMin, timeMax);
      const availableSlots = [];

      // Parse working hours
      const workStart = parseInt(workingHours.start.split(':')[0]);
      const workEnd = parseInt(workingHours.end.split(':')[0]);
      const slotDuration = duration; // in minutes

      // Generate time slots for each day
      const startDate = new Date(timeMin);
      const endDate = new Date(timeMax);
      
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        // Generate hourly slots within working hours
        for (let hour = workStart; hour < workEnd; hour++) {
          const slotStart = new Date(date);
          slotStart.setHours(hour, 0, 0, 0);
          
          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

          // Check if this slot conflicts with any busy periods
          let isAvailable = true;
          
          Object.keys(freeBusyData.calendars).forEach(calendarId => {
            const busyPeriods = freeBusyData.calendars[calendarId].busy || [];
            
            busyPeriods.forEach(busy => {
              const busyStart = new Date(busy.start);
              const busyEnd = new Date(busy.end);
              
              if (slotStart < busyEnd && slotEnd > busyStart) {
                isAvailable = false;
              }
            });
          });

          if (isAvailable) {
            availableSlots.push({
              start: slotStart.toISOString(),
              end: slotEnd.toISOString(),
              date: dateStr,
              time: `${hour.toString().padStart(2, '0')}:00`
            });
          }
        }
      }

      return availableSlots;
    } catch (error) {
      console.error('Error finding available slots:', error);
      throw new Error(`Failed to find available slots: ${error.message}`);
    }
  }
}

// Create and export a singleton instance
const googleCalendarService = new GoogleCalendarService();
export default googleCalendarService;

// Also export the class for testing purposes
export { GoogleCalendarService };