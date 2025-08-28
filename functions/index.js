const {setGlobalOptions} = require("firebase-functions");
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp();
}

setGlobalOptions({maxInstances: 10});

/**
 * Creates Google Auth client with proper scopes
 * @return {Promise} Google Auth client
 */
async function createAuthClient() {
  const {google} = require("googleapis");
  const serviceAccount = require("./service-account-key.json");

  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  });

  return auth.getClient();
}

// Function triggered when booking status changes to 'confirmed'
exports.createMeetingOnBookingConfirmed = onDocumentUpdated(
    "bookings/{bookingId}",
    async (event) => {
      const beforeData = event.data.before.data();
      const afterData = event.data.after.data();
      const bookingId = event.params.bookingId;

      console.log("Function triggered for booking:", bookingId);
      console.log("Before status:", beforeData?.status);
      console.log("After status:", afterData?.status);
      console.log("Has meeting link:", !!afterData?.meetingLink);

      // Only proceed if status changed to 'confirmed' and no meeting link
      if (afterData.status === "confirmed" &&
        beforeData.status !== "confirmed" &&
        !afterData.meetingLink) {
        try {
          console.log(`Creating meeting for booking: ${bookingId}`);

          const {google} = require("googleapis");
          const moment = require("moment");

          // Set up authenticated client
          const authClient = await createAuthClient();
          const calendar = google.calendar({version: "v3", auth: authClient});

          // Calculate meeting times
          const startTime = moment(afterData.preferredTime);
          const endTime = startTime.clone().add(1, "hour");

          // Create calendar event with Google Meet
          const event = {
            summary: `Health Consultation - ${afterData.firstName} ` +
              `${afterData.lastName}`,
            description: `Service: ` +
              `${afterData.selectedServices?.[0]?.title || "Consultation"}\n` +
              `Patient: ${afterData.firstName} ${afterData.lastName}\n` +
              `Email: ${afterData.email}\n` +
              `Phone: ${afterData.phone}\n` +
              `Notes: ${afterData.specialRequests || "N/A"}`,
            start: {
              dateTime: startTime.toISOString(),
              timeZone: "Asia/Kolkata",
            },
            end: {
              dateTime: endTime.toISOString(),
              timeZone: "Asia/Kolkata",
            },
            // Users will get meeting link via your app instead
            conferenceData: {
              createRequest: {
                requestId: `meet-${bookingId}-${Date.now()}`,
                conferenceSolutionKey: {type: "hangoutsMeet"},
              },
            },
            reminders: {
              useDefault: false,
              overrides: [
                {method: "email", minutes: 24 * 60},
                {method: "popup", minutes: 30},
              ],
            },
          };

          console.log("Inserting calendar event with Google Meet...");

          // Insert event with conference data
          const response = await calendar.events.insert({
            calendarId: "primary",
            resource: event,
            conferenceDataVersion: 1,
            sendUpdates: "all",
          });

          console.log("Calendar event created:", response.data.id);
          console.log("Conference data:",
              JSON.stringify(response.data.conferenceData, null, 2));

          // Extract Google Meet link with multiple fallback options
          let meetingLink = null;

          if (response.data.conferenceData) {
            // Try to get the video entry point
            const videoEntry = response.data.conferenceData.entryPoints?.find(
                (ep) => ep.entryPointType === "video",
            );
            if (videoEntry) {
              meetingLink = videoEntry.uri;
            }
          }

          // Fallback to hangoutLink
          if (!meetingLink && response.data.hangoutLink) {
            meetingLink = response.data.hangoutLink;
          }

          // Final fallback using conference ID
          if (!meetingLink && response.data.conferenceData?.conferenceId) {
            meetingLink = `https://meet.google.com/${response.data.conferenceData.conferenceId}`;
          }

          if (!meetingLink) {
            console.error("No meeting link found in response:",
                JSON.stringify(response.data, null, 2));
            throw new Error("Failed to create Google Meet link");
          }

          console.log("Google Meet link created:", meetingLink);

          // Update booking document with meeting details
          const updateData = {
            meetingLink: meetingLink,
            calendarEventId: response.data.id,
            meetingCreatedAt: admin.firestore.FieldValue.serverTimestamp(),
            conferenceId: response.data.conferenceData?.conferenceId || null,
          };

          await admin.firestore().collection("bookings")
              .doc(bookingId).update(updateData);

          console.log(`Meeting created successfully: ${meetingLink}`);

          return {
            success: true,
            meetingLink: meetingLink,
            calendarEventId: response.data.id,
          };
        } catch (error) {
          console.error("Error creating meeting:", error);

          // Update booking with error status
          const errorData = {
            meetingError: error.message,
            meetingErrorAt: admin.firestore.FieldValue.serverTimestamp(),
          };
          await admin.firestore().collection("bookings")
              .doc(bookingId).update(errorData);

          throw error;
        }
      } else {
        console.log("Conditions not met - skipping meeting creation");
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

    console.log("Manual trigger for booking:", bookingId);

    // Get booking data
    const bookingDoc = await admin.firestore()
        .collection("bookings").doc(bookingId).get();

    if (!bookingDoc.exists) {
      console.log("Booking not found:", bookingId);
      return res.status(404).json({error: "Booking not found"});
    }

    const bookingData = bookingDoc.data();
    console.log("Booking data found:",
        bookingData.firstName, bookingData.lastName);

    const {google} = require("googleapis");
    const moment = require("moment");

    // Create auth client
    const authClient = await createAuthClient();
    const calendar = google.calendar({version: "v3", auth: authClient});

    const startTime = moment(bookingData.preferredTime);
    const endTime = startTime.clone().add(1, "hour");

    // Create calendar event with Google Meet
    const event = {
      summary: `Health Consultation - ${bookingData.firstName} ` +
        `${bookingData.lastName}`,
      description: `Service: ` +
        `${bookingData.selectedServices?.[0]?.title || "Consultation"}\n` +
        `Patient: ${bookingData.firstName} ${bookingData.lastName}\n` +
        `Email: ${bookingData.email}\n` +
        `Phone: ${bookingData.phone}\n` +
        `Notes: ${bookingData.specialRequests || "N/A"}`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "UTC",
      },
      // Users will get meeting link via your app instead
      conferenceData: {
        createRequest: {
          requestId: `manual-${bookingId}-${Date.now()}`,
          conferenceSolutionKey: {type: "hangoutsMeet"},
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          {method: "email", minutes: 24 * 60},
          {method: "popup", minutes: 30},
        ],
      },
    };

    console.log("Creating calendar event with Google Meet...");

    // Insert event with conference data
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });

    console.log("Calendar event created:", response.data.id);

    // Extract Google Meet link with multiple fallback options
    let meetingLink = null;

    if (response.data.conferenceData) {
      const videoEntry = response.data.conferenceData.entryPoints?.find(
          (ep) => ep.entryPointType === "video",
      );
      if (videoEntry) {
        meetingLink = videoEntry.uri;
      }
    }

    if (!meetingLink && response.data.hangoutLink) {
      meetingLink = response.data.hangoutLink;
    }

    if (!meetingLink && response.data.conferenceData?.conferenceId) {
      meetingLink = `https://meet.google.com/${response.data.conferenceData.conferenceId}`;
    }

    if (!meetingLink) {
      console.error("No meeting link created");
      return res.status(500).json({
        error: "Failed to create meeting link",
        debug: response.data,
      });
    }

    console.log("Google Meet link created:", meetingLink);

    const updateData = {
      meetingLink: meetingLink,
      calendarEventId: response.data.id,
      meetingCreatedAt: admin.firestore.FieldValue.serverTimestamp(),
      conferenceId: response.data.conferenceData?.conferenceId || null,
    };

    await admin.firestore().collection("bookings")
        .doc(bookingId).update(updateData);

    console.log("Meeting created successfully:", meetingLink);

    res.json({
      success: true,
      meetingLink: meetingLink,
      calendarEventId: response.data.id,
      conferenceId: response.data.conferenceData?.conferenceId,
    });
  } catch (error) {
    console.error("Error in manual trigger:", error);
    res.status(500).json({
      error: error.message,
      details: error.response?.data || error.message,
    });
  }
});

// Debug function to test Firestore access
exports.debugFirestore = onRequest(async (req, res) => {
  try {
    console.log("Testing Firestore access...");

    const bookingsSnapshot = await admin.firestore()
        .collection("bookings").limit(5).get();
    console.log("Bookings found:", bookingsSnapshot.size);

    const bookings = [];
    bookingsSnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    res.json({
      success: true,
      bookingsCount: bookingsSnapshot.size,
      bookings: bookings,
    });
  } catch (error) {
    console.error("Firestore test failed:", error);
    res.status(500).json({error: error.message});
  }
});
