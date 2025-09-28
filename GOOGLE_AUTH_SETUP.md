# Firebase Authentication Setup Guide

## Issue Diagnosed
The Google authentication is working on localhost but failing in production because your production domain is not authorized in Firebase Console.

## Root Cause
1. **Authorized Domains Missing**: Your production domain needs to be added to Firebase Console's authorized domains
2. **Firebase Authentication Configuration**: You're using Firebase Auth (not direct GCP OAuth), so the configuration is in Firebase Console
3. **Domain Verification**: Firebase needs to know which domains are allowed to use authentication

## Required Firebase Console Configuration

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `ekah-health` project
3. Go to **Authentication** → **Settings** → **Authorized domains**

### Step 2: Add Your Production Domain
In the "Authorized domains" section, you should see:
- `localhost` (for development)
- `ekah-health.firebaseapp.com` (Firebase hosting)
- `ekah-health.web.app` (Firebase hosting)

**You need to add your production domain:**
1. Click "Add domain"
2. Enter your production domain (e.g., `yourdomain.com`)
3. Click "Add"

### Step 3: Verify Domain Requirements
1. **Use HTTPS**: Your production domain MUST use HTTPS (not HTTP)
2. **No Subfolders**: Add only the root domain (e.g., `yourdomain.com`, not `yourdomain.com/app`)
3. **No Protocols**: Don't include `https://` - just the domain name
4. **Save Changes**: Click "Save" after adding the domain

### Step 4: Optional - Check Google Sign-in Provider
1. Go to **Authentication** → **Sign-in method**
2. Ensure **Google** provider is enabled
3. If not enabled, click on Google and toggle it on

## Testing the Fix

### Browser Console Checks
After deploying the updated code, open your production site and check the browser console:

1. You should see: `🔐 Auth Domain Configuration` log with your domain info
2. If there are warnings, they'll guide you on what to configure
3. Any authorization errors will show specific domain configuration issues

### Expected Behavior
1. **Development**: Should work on `localhost:3000`
2. **Production**: Should work on your custom domain after adding it to authorized domains
3. **Firebase Hosting**: Should work automatically on `*.firebaseapp.com` and `*.web.app`

## Common Issues & Solutions

### Issue: "Error 403: disallowed_useragent"
**This is your current issue!**
**Cause**: You're using an in-app browser (like Instagram, Facebook, WhatsApp, etc.) that Google blocks for security
**Solution**: Open the website in your default browser:
1. Look for "Open in Browser" or "⋯" menu in the app
2. Copy the URL and paste it into Safari, Chrome, or Firefox
3. The app now detects this and shows a helpful warning

### Issue: "unauthorized-domain" Error
**Solution**: Add your domain to "Authorized domains" in Firebase Console → Authentication → Settings

### Issue: "operation-not-allowed" Error
**Solution**: Enable Google sign-in provider in Firebase Console → Authentication → Sign-in method

### Issue: User gets redirected but authentication fails
**Solution**: Ensure your domain uses HTTPS and is exactly as entered in authorized domains

### Issue: Works on Firebase Hosting but not custom domain
**Solution**: Add your custom domain to Firebase authorized domains list

## Verification Checklist
- [ ] Added production domain to Firebase authorized domains
- [ ] Ensured production domain uses HTTPS
- [ ] Verified Google sign-in provider is enabled in Firebase
- [ ] Tested login flow on production domain
- [ ] Verified MyBookings page loads user data correctly
- [ ] Checked browser console for configuration warnings

## Code Changes Made
1. **Enhanced Firebase Auth error handling** with specific Firebase Console instructions
2. **Added domain validation** to detect configuration issues
3. **Improved redirect handling** for better authentication flow
4. **Added Firebase-specific logging** to help debug configuration issues
5. **Fixed authentication state persistence** after Google redirect

## Next Steps
1. **Add your production domain to Firebase Console:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your `ekah-health` project
   - Go to Authentication → Settings → Authorized domains
   - Click "Add domain" and enter your production domain
   - Save the configuration

2. **Deploy the updated code**

3. **Test the authentication flow** - the browser console will show helpful Firebase configuration information

4. **Verify user can access MyBookings page** after successful login

## Quick Fix Summary
The issue is simply that your production domain needs to be added to Firebase Console's authorized domains list. Unlike Google Cloud Console OAuth setup, Firebase makes this much simpler - just add your domain to the authorized list and it should work immediately.