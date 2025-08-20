// src/contexts/AdminAuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create admin context
const AdminAuthContext = createContext();

// Hardcoded admin accounts (temporary for development)
const ADMIN_ACCOUNTS = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'super_admin',
    name: 'Super Admin'
  },
  {
    id: 2,
    username: 'manager',
    password: 'manager123',
    role: 'manager',
    name: 'Services Manager'
  }
];

// Admin auth provider component
export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for existing admin session in localStorage
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      try {
        const adminData = JSON.parse(adminSession);
        setCurrentAdmin(adminData);
      } catch (err) {
        localStorage.removeItem('adminSession');
      }
    }
    setLoading(false);
  }, []);

  // Admin login
  const adminLogin = async (username, password) => {
    setError(null);
    try {
      const admin = ADMIN_ACCOUNTS.find(
        acc => acc.username === username && acc.password === password
      );

      if (!admin) {
        throw new Error('Invalid admin credentials');
      }

      const adminSession = {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        name: admin.name,
        loginTime: new Date().toISOString()
      };

      setCurrentAdmin(adminSession);
      localStorage.setItem('adminSession', JSON.stringify(adminSession));
      
      return adminSession;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Admin logout
  const adminLogout = async () => {
    setError(null);
    try {
      setCurrentAdmin(null);
      localStorage.removeItem('adminSession');
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Check if admin has specific permission
  const hasPermission = (permission) => {
    if (!currentAdmin) return false;
    
    // Super admin has all permissions
    if (currentAdmin.role === 'super_admin') return true;
    
    // Manager has limited permissions
    if (currentAdmin.role === 'manager') {
      const managerPermissions = ['view_services', 'edit_services', 'view_users'];
      return managerPermissions.includes(permission);
    }
    
    return false;
  };

  const value = {
    currentAdmin,
    loading,
    error,
    adminLogin,
    adminLogout,
    clearError,
    hasPermission,
    isAuthenticated: !!currentAdmin
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom hook to use admin auth context
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};