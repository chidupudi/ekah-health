# Calendar System Setup & Troubleshooting

## 🔧 Quick Fix for "No Available Slots" Issue

The issue you're experiencing is due to **missing Firestore indexes** and **empty database**. Here's how to fix it:

### Step 1: Set up Firebase Indexes

1. Go to your Firebase Console: https://console.firebase.google.com
2. Select your project: `ekah-health`
3. Go to **Firestore Database** → **Indexes** tab
4. Create these composite indexes:

#### Index 1: time_slots basic sorting
- Collection: `time_slots`
- Fields:
  - `date` (Ascending)
  - `time` (Ascending)

#### Index 2: time_slots with status filter
- Collection: `time_slots` 
- Fields:
  - `status` (Ascending)
  - `date` (Ascending)
  - `time` (Ascending)

#### Index 3: bookings by user
- Collection: `bookings`
- Fields:
  - `userId` (Ascending)
  - `createdAt` (Descending)

### Step 2: Initialize the Calendar System

1. **Login as Admin**: Go to `/admin/login`
2. **Navigate to Calendar**: Click "Calendar" in the admin sidebar
3. **Click "Initialize System"**: This creates the business hours configuration
4. **Click "Create Test Slots"**: This creates sample time slots for testing
5. **Click "Generate Slots"**: This creates slots based on business hours

### Step 3: Verify Data Creation

1. **Check Firebase Console**:
   - Go to Firestore Database → Data
   - You should see collections: `calendar_config`, `time_slots`
   - `time_slots` should have documents with structure:
     ```
     {
       date: "2024-08-28",
       time: "09:00", 
       status: "available",
       createdAt: timestamp,
       updatedAt: timestamp
     }
     ```

2. **Test User Booking**:
   - Go to `/services` → Click "Book Now" 
   - Complete steps 1 & 2
   - On step 3, you should see available time slots

## 🐛 Troubleshooting Steps

### If Admin Calendar Shows "0 Available Slots":

1. **Open Browser Console** (F12 → Console tab)
2. **Click "Debug Slots"** in admin calendar
3. **Check console output** for slot statistics
4. **If no slots exist**:
   - Click "Initialize System"
   - Click "Create Test Slots" 
   - Click "Refresh"

### If User Calendar Shows "No Slots":

1. **Ensure slots exist** (use admin debug tools)
2. **Check browser console** for errors
3. **Verify Firebase rules** allow read access
4. **Test with admin-created slots**

### Database Errors in Console:

If you see Firebase errors about "missing indexes":

1. **Copy the index URL** from the error message
2. **Open the URL** in your browser (while logged into Firebase)
3. **Click "Create Index"**
4. **Wait for index creation** (can take several minutes)
5. **Refresh the page** and test again

## 🎯 Expected Behavior After Setup

### Admin Calendar:
- ✅ Shows statistics: Available/Booked/Blocked slots
- ✅ Displays weekly calendar view with colored time slots
- ✅ Green slots = Available
- ✅ Blue slots = Booked (with patient names)  
- ✅ Red slots = Blocked
- ✅ Can click slots to view/edit details
- ✅ Can block/unblock individual slots

### User Booking:
- ✅ Step 3 shows weekly calendar picker
- ✅ Only available future slots are clickable
- ✅ Selected slot turns blue with checkmark
- ✅ Step 4 shows confirmed date/time
- ✅ Booking reserves the time slot

### My Bookings Page:
- ✅ Shows user's booking history
- ✅ Statistics cards with counts
- ✅ Timeline view of all appointments
- ✅ Upcoming appointments highlighted

## 🚀 Quick Test Procedure

1. **Admin Setup**:
   ```
   /admin/login → Calendar → Initialize System → Create Test Slots
   ```

2. **User Test**:
   ```
   /services → Book Now → Complete Steps 1-2 → See Calendar on Step 3
   ```

3. **Verify Booking**:
   ```
   Complete booking → Check My Bookings → Admin sees booking in Calendar
   ```

## 📊 Database Collections Created

- `calendar_config`: Business hours and settings
- `time_slots`: Individual appointment slots
- `bookings`: Complete booking records

## 🔍 Debug Console Commands

Open browser console and run:

```javascript
// Check available slots
timeSlotsDB.getAvailableSlots('2024-08-28', '2024-09-03').then(console.log)

// Check calendar config  
calendarConfigDB.getConfig().then(console.log)

// Check all slots
timeSlotsDB.getSlots('2024-08-28', '2024-09-03').then(console.log)
```

---

This should resolve the "no available slots" issue completely! 🎉