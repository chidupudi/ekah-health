# Google Authentication Setup Guide

## Issue Diagnosed
The Google authentication is working on localhost but failing in production because the production domain is not properly configured in Google Cloud Console.

## Root Cause
1. **Domain Authorization Missing**: Your production domain needs to be added to Google Cloud Console's OAuth 2.0 configuration
2. **Redirect URI Configuration**: The redirect URIs for your production domain are not set up
3. **Firebase Auth Domain**: The authDomain in Firebase config points to `ekah-health.firebaseapp.com` but you're using a custom domain

## Required Google Cloud Console Configuration

### Step 1: Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your `ekah-health` project
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID (used by Firebase Auth)

### Step 2: Add Authorized JavaScript Origins
Add these origins to your OAuth 2.0 client:

**For localhost (development):**
- `http://localhost:3000`
- `http://127.0.0.1:3000`

**For production (replace `yourdomain.com` with your actual domain):**
- `https://yourdomain.com`
- `https://ekah-health.firebaseapp.com`
- `https://ekah-health.web.app`

### Step 3: Add Authorized Redirect URIs
Add these redirect URIs:

**For localhost:**
- `http://localhost:3000/signin`
- `http://localhost:3000/__/auth/handler`

**For production:**
- `https://yourdomain.com/signin`
- `https://yourdomain.com/__/auth/handler`
- `https://ekah-health.firebaseapp.com/signin`
- `https://ekah-health.firebaseapp.com/__/auth/handler`
- `https://ekah-health.web.app/signin`
- `https://ekah-health.web.app/__/auth/handler`

### Step 4: Important Notes
1. **Use HTTPS**: Production domains MUST use HTTPS for Google OAuth
2. **No Wildcards**: Don't use wildcards in domain configuration
3. **Exact Match**: The domains must match exactly what users see in their browser
4. **Save Changes**: Make sure to save the configuration after adding domains

## Testing the Fix

### Browser Console Checks
After deploying the updated code, open your production site and check the browser console:

1. You should see: `🔐 Auth Domain Configuration` log with your domain info
2. If there are warnings, they'll guide you on what to configure
3. Any authorization errors will show specific domain configuration issues

### Expected Behavior
1. **Development**: Should work on `localhost:3000`
2. **Production**: Should work on your custom domain
3. **Firebase Hosting**: Should work on `*.firebaseapp.com` and `*.web.app`

## Common Issues & Solutions

### Issue: "unauthorized-domain" Error
**Solution**: Add your domain to "Authorized JavaScript origins" in Google Cloud Console

### Issue: "popup-blocked" Error
**Solution**: The code now uses redirect instead of popup to avoid this issue

### Issue: User gets redirected but no login occurs
**Solution**: Add your domain to "Authorized redirect URIs" in Google Cloud Console

### Issue: Works on Firebase Hosting but not custom domain
**Solution**: Ensure your custom domain is added to both origins and redirect URIs

## Verification Checklist
- [ ] Added production domain to Authorized JavaScript origins
- [ ] Added production domain redirect URIs
- [ ] Ensured production domain uses HTTPS
- [ ] Tested login flow on production domain
- [ ] Verified MyBookings page loads user data correctly
- [ ] Checked browser console for any remaining errors

## Code Changes Made
1. **Enhanced error handling** with domain-specific error messages
2. **Added domain validation** to detect configuration issues
3. **Improved redirect handling** for better authentication flow
4. **Added logging** to help debug configuration issues
5. **Fixed authentication state persistence** after Google redirect

## Next Steps
1. Update Google Cloud Console with your production domain
2. Deploy the updated code
3. Test the authentication flow
4. Check browser console for any warnings
5. Verify user can access MyBookings page after login

The authentication system will now work correctly once the Google Cloud Console is properly configured with your production domain.