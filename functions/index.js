const {setGlobalOptions} = require("firebase-functions");
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const {google} = require("googleapis");
const moment = require("moment");

// Initialize Firebase Admin
admin.initializeApp();

// Load service account credentials
const serviceAccount = require("./service-account-key.json");

// Google Calendar setup
const calendar = google.calendar("v3");
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

setGlobalOptions({maxInstances: 10});

// Function triggered when booking status changes to 'confirmed'
exports.createMeetingOnBookingConfirmed = onDocumentUpdated(
    "bookings/{bookingId}",
    async (event) => {
      const beforeData = event.data.before.data();
      const afterData = event.data.after.data();
      const bookingId = event.params.bookingId;

      // Only proceed if status changed to 'confirmed' and no meeting link
      if (afterData.status === "confirmed" &&
        beforeData.status !== "confirmed" &&
        !afterData.meetingLink) {
        try {
          console.log(`Creating meeting for booking: ${bookingId}`);

          // Set up authenticated client
          const authClient = await auth.getClient();
          google.options({auth: authClient});

          // Calculate meeting times
          const startTime = moment(afterData.dateTime);
          const endTime = startTime.clone().add(1, "hour"); // 1 hour duration

          // Create calendar event with Google Meet
          const event = {
            summary: `Health Consultation - ${afterData.patientName}`,
            description: `Service: ${afterData.serviceType}\n` +
              `Notes: ${afterData.notes || "N/A"}`,
            start: {
              dateTime: startTime.toISOString(),
              timeZone: "UTC",
            },
            end: {
              dateTime: endTime.toISOString(),
              timeZone: "UTC",
            },
            attendees: [
              {email: afterData.userEmail},
              {email: serviceAccount.client_email}, // Your admin email
            ],
            conferenceData: {
              createRequest: {
                requestId: bookingId, // Unique request ID
                conferenceSolutionKey: {
                  type: "hangoutsMeet",
                },
              },
            },
          };

          // Insert event into calendar
          const response = await calendar.events.insert({
            calendarId: "primary",
            resource: event,
            conferenceDataVersion: 1,
            sendUpdates: "all", // Send invites to all attendees
          });

          console.log("Calendar event created:", response.data.id);

          // Extract meeting link
          const meetingLink =
            response.data.conferenceData?.entryPoints?.[0]?.uri;

          if (!meetingLink) {
            throw new Error("Failed to create Google Meet link");
          }

          // Update booking document with meeting details
          await admin.firestore().collection("bookings").doc(bookingId).update({
            meetingLink: meetingLink,
            calendarEventId: response.data.id,
            meetingCreatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          console.log(`Meeting created successfully for booking ` +
            `${bookingId}: ${meetingLink}`);

          return {
            success: true,
            meetingLink: meetingLink,
            calendarEventId: response.data.id,
          };
        } catch (error) {
          console.error("Error creating meeting:", error);

          // Update booking with error status
          await admin.firestore().collection("bookings").doc(bookingId).update({
            meetingError: error.message,
            meetingErrorAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          throw error;
        }
      }

      return null;
    },
);

// Manual trigger function (for testing)
exports.createMeetingManually = onRequest(async (req, res) => {
  try {
    const {bookingId} = req.body;

    if (!bookingId) {
      return res.status(400).json({error: "bookingId is required"});
    }

    // Get booking data
    const bookingDoc = await admin.firestore()
        .collection("bookings").doc(bookingId).get();

    if (!bookingDoc.exists) {
      return res.status(404).json({error: "Booking not found"});
    }

    const bookingData = bookingDoc.data();

    // Trigger the same logic
    const authClient = await auth.getClient();
    google.options({auth: authClient});

    const startTime = moment(bookingData.dateTime);
    const endTime = startTime.clone().add(1, "hour");

    const event = {
      summary: `Health Consultation - ${bookingData.patientName}`,
      description: `Service: ${bookingData.serviceType}\n` +
        `Notes: ${bookingData.notes || "N/A"}`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "UTC",
      },
      attendees: [
        {email: bookingData.userEmail},
        {email: serviceAccount.client_email},
      ],
      conferenceData: {
        createRequest: {
          requestId: `manual-${bookingId}-${Date.now()}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });

    const meetingLink = response.data.conferenceData?.entryPoints?.[0]?.uri;

    await admin.firestore().collection("bookings").doc(bookingId).update({
      meetingLink: meetingLink,
      calendarEventId: response.data.id,
      meetingCreatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      meetingLink: meetingLink,
      calendarEventId: response.data.id,
    });
  } catch (error) {
    console.error("Error in manual trigger:", error);
    res.status(500).json({error: error.message});
  }
});
