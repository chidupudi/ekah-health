// src/services/firebase/authConfig.js
/**
 * Authentication configuration helper for handling different deployment environments
 */

/**
 * Get the current domain information
 * @returns {Object} Domain configuration
 */
export const getDomainConfig = () => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;
  const origin = window.location.origin;

  // Detect environment
  const isLocalhost = hostname === 'localhost' ||
                     hostname === '127.0.0.1' ||
                     hostname.startsWith('192.168.');

  const isFirebaseHosting = hostname.includes('.firebaseapp.com') ||
                           hostname.includes('.web.app');

  const isCustomDomain = !isLocalhost && !isFirebaseHosting;

  return {
    hostname,
    protocol,
    port,
    origin,
    isLocalhost,
    isFirebaseHosting,
    isCustomDomain,
    fullUrl: `${protocol}//${hostname}${port ? `:${port}` : ''}`
  };
};

/**
 * Get authorized JavaScript origins for Google OAuth
 * @returns {Array} List of authorized origins
 */
export const getAuthorizedOrigins = () => {
  const config = getDomainConfig();
  const origins = [];

  if (config.isLocalhost) {
    // Localhost development
    origins.push('http://localhost:3000');
    origins.push('http://127.0.0.1:3000');
    if (config.port && config.port !== '3000') {
      origins.push(`${config.protocol}//${config.hostname}:${config.port}`);
    }
  } else {
    // Production domains
    origins.push(config.origin);

    // Firebase hosting domains
    origins.push('https://ekah-health.firebaseapp.com');
    origins.push('https://ekah-health.web.app');

    // Add common production patterns
    if (config.isCustomDomain) {
      // Ensure HTTPS for custom domains
      const httpsOrigin = config.origin.replace('http://', 'https://');
      if (!origins.includes(httpsOrigin)) {
        origins.push(httpsOrigin);
      }
    }
  }

  return origins;
};

/**
 * Get redirect URIs for Google OAuth
 * @returns {Array} List of redirect URIs
 */
export const getRedirectURIs = () => {
  const config = getDomainConfig();
  const redirects = [];

  if (config.isLocalhost) {
    // Localhost development
    redirects.push('http://localhost:3000/signin');
    redirects.push('http://127.0.0.1:3000/signin');
    redirects.push('http://localhost:3000/__/auth/handler');
    if (config.port && config.port !== '3000') {
      redirects.push(`${config.protocol}//${config.hostname}:${config.port}/signin`);
      redirects.push(`${config.protocol}//${config.hostname}:${config.port}/__/auth/handler`);
    }
  } else {
    // Production domains
    redirects.push(`${config.origin}/signin`);
    redirects.push(`${config.origin}/__/auth/handler`);

    // Firebase hosting
    redirects.push('https://ekah-health.firebaseapp.com/signin');
    redirects.push('https://ekah-health.firebaseapp.com/__/auth/handler');
    redirects.push('https://ekah-health.web.app/signin');
    redirects.push('https://ekah-health.web.app/__/auth/handler');

    // Ensure HTTPS for custom domains
    if (config.isCustomDomain) {
      const httpsOrigin = config.origin.replace('http://', 'https://');
      redirects.push(`${httpsOrigin}/signin`);
      redirects.push(`${httpsOrigin}/__/auth/handler`);
    }
  }

  return redirects;
};

/**
 * Log current domain configuration for debugging
 */
export const logDomainInfo = () => {
  const config = getDomainConfig();

  console.group('🔐 Firebase Auth Domain Configuration');
  console.log('Current Domain:', config);
  console.log('Environment:', config.isLocalhost ? 'Development' : 'Production');
  console.log('Domain Type:', config.isFirebaseHosting ? 'Firebase Hosting' : config.isCustomDomain ? 'Custom Domain' : 'Localhost');
  console.groupEnd();

  // Warning for production custom domains
  if (config.isCustomDomain) {
    console.warn(
      `⚠️ Custom domain detected: ${config.hostname}\n` +
      '📝 Required Firebase Console configuration:\n' +
      '1. Go to Firebase Console → Authentication → Settings → Authorized domains\n' +
      `2. Add "${config.hostname}" to the authorized domains list\n` +
      '3. Ensure your domain uses HTTPS\n' +
      '4. Save the configuration'
    );
  }

  // Info for Firebase hosting
  if (config.isFirebaseHosting) {
    console.info('✅ Firebase hosting domain detected - should work automatically');
  }

  // Info for localhost
  if (config.isLocalhost) {
    console.info('✅ Localhost detected - should work for development');
  }
};

/**
 * Detect browser user agent and potential Google Auth issues
 * @returns {Object} Browser compatibility info
 */
export const detectBrowserCompatibility = () => {
  const userAgent = navigator.userAgent || '';
  const issues = [];
  const warnings = [];

  // Check for embedded browsers that Google blocks
  const isEmbeddedBrowser = /Instagram|FBAN|FBAV|Twitter|LinkedIn|WhatsApp|Telegram|WeChat|Line|Snapchat|TikTok/i.test(userAgent);
  const isWebView = /wv|WebView/i.test(userAgent);
  const isOldBrowser = /MSIE|Trident/i.test(userAgent);

  if (isEmbeddedBrowser) {
    issues.push('Embedded browser detected - Google blocks authentication in social media in-app browsers');
  }

  if (isWebView) {
    warnings.push('WebView detected - may cause authentication issues');
  }

  if (isOldBrowser) {
    issues.push('Outdated browser detected - Google requires modern browsers for authentication');
  }

  return {
    userAgent,
    isEmbeddedBrowser,
    isWebView,
    isOldBrowser,
    isCompatible: issues.length === 0,
    issues,
    warnings
  };
};

/**
 * Validate if current domain is likely to work with Google Auth
 * @returns {Object} Validation result
 */
export const validateAuthDomain = () => {
  const config = getDomainConfig();
  const browser = detectBrowserCompatibility();

  const issues = [];
  const warnings = [];

  // Check for HTTPS in production
  if (!config.isLocalhost && config.protocol === 'http:') {
    issues.push('Production domains must use HTTPS for Google OAuth');
  }

  // Check for common problematic patterns
  if (config.hostname.includes('ngrok') || config.hostname.includes('tunnel')) {
    warnings.push('Tunnel domains may require special configuration in Firebase Console');
  }

  // Check for IP addresses in production
  if (!config.isLocalhost && /^\d+\.\d+\.\d+\.\d+$/.test(config.hostname)) {
    issues.push('IP addresses are not allowed for Google OAuth. Use a proper domain name.');
  }

  // Add browser compatibility issues
  issues.push(...browser.issues);
  warnings.push(...browser.warnings);

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    config,
    browser
  };
};