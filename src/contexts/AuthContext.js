import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Secure token management
class SecureTokenManager {
  constructor() {
    this.tokenKey = 'ekah_admin_token';
    this.refreshTokenKey = 'ekah_admin_refresh';
    this.sessionKey = 'ekah_admin_session';
  }

  // Generate a secure session ID
  generateSessionId() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Encrypt sensitive data before storing (basic XOR encryption)
  encrypt(data, key) {
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  }

  // Decrypt sensitive data
  decrypt(encryptedData, key) {
    try {
      const data = atob(encryptedData);
      let result = '';
      for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  // Store token securely
  storeToken(token, refreshToken = null) {
    try {
      const sessionId = this.generateSessionId();
      const encryptionKey = `ekah_${sessionId}_admin`;
      
      // Encrypt the token
      const encryptedToken = this.encrypt(token, encryptionKey);
      
      // Store in localStorage with session validation
      localStorage.setItem(this.tokenKey, encryptedToken);
      localStorage.setItem(this.sessionKey, sessionId);
      
      if (refreshToken) {
        const encryptedRefresh = this.encrypt(refreshToken, encryptionKey);
        localStorage.setItem(this.refreshTokenKey, encryptedRefresh);
      }
      
      return true;
    } catch (error) {
      console.error('Token storage failed:', error);
      return false;
    }
  }

  // Retrieve token securely
  getToken() {
    try {
      const encryptedToken = localStorage.getItem(this.tokenKey);
      const sessionId = localStorage.getItem(this.sessionKey);
      
      if (!encryptedToken || !sessionId) {
        return null;
      }
      
      const encryptionKey = `ekah_${sessionId}_admin`;
      const token = this.decrypt(encryptedToken, encryptionKey);
      
      if (!token) {
        this.clearTokens();
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Token retrieval failed:', error);
      this.clearTokens();
      return null;
    }
  }

  // Clear all tokens
  clearTokens() {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      localStorage.removeItem(this.sessionKey);
      
      // Clear any session cookies
      document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure';
    } catch (error) {
      console.error('Token cleanup failed:', error);
    }
  }

  // Get refresh token
  getRefreshToken() {
    try {
      const encryptedRefresh = localStorage.getItem(this.refreshTokenKey);
      const sessionId = localStorage.getItem(this.sessionKey);
      
      if (!encryptedRefresh || !sessionId) {
        return null;
      }
      
      const encryptionKey = `ekah_${sessionId}_admin`;
      return this.decrypt(encryptedRefresh, encryptionKey);
    } catch (error) {
      console.error('Refresh token retrieval failed:', error);
      return null;
    }
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);
  
  const tokenManager = new SecureTokenManager();

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const token = tokenManager.getToken();
      
      if (token) {
        // For now, assume token is valid if it exists
        // In production, verify with backend
        setUser({
          id: 'admin_001',
          email: 'admin@ekahhealth.com',
          role: 'admin'
        });
        
        setSessionInfo({
          loginTime: new Date(),
          lastActivity: new Date()
        });
        
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Authentication initialization failed:', error);
      tokenManager.clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      
      // Simple admin login for now - replace with actual API call
      if (credentials.email === 'admin@ekahhealth.com' && credentials.password === 'EkahAdmin@2024') {
        // Generate a mock JWT token
        const token = 'mock_admin_token_' + Date.now();
        
        const stored = tokenManager.storeToken(token);
        
        if (!stored) {
          throw new Error('Failed to store authentication tokens securely');
        }

        setUser({
          id: 'admin_001',
          email: credentials.email,
          role: 'admin'
        });

        setSessionInfo({
          loginTime: new Date(),
          lastActivity: new Date()
        });

        setIsAuthenticated(true);
        
        console.log('Admin authentication successful');
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      tokenManager.clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      setSessionInfo(null);
      
      console.log('Admin logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    sessionInfo,
    login,
    logout,
    tokenManager
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;