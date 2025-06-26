// src/components/common/ProtectedRoute/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';

const { Content } = Layout;

const ProtectedRoute = ({ children, requireEmailVerification = true, allowedRoles = [] }) => {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Current User:', currentUser?.uid);
  console.log('ProtectedRoute - User Profile:', userProfile);
  console.log('ProtectedRoute - Loading:', loading);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Spin size="large" />
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        </Content>
      </Layout>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    console.log('No current user, redirecting to login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Redirect to email verification if email is not verified
  if (requireEmailVerification && !currentUser.emailVerified) {
    console.log('Email not verified, redirecting to email verification');
    return <Navigate to="/auth/email-verification" replace />;
  }

  // If user exists but no profile, show a different loading state with timeout
  if (!userProfile) {
    console.log('User exists but no profile found');
    
    // For email verification page, allow access without profile
    if (location.pathname === '/auth/email-verification') {
      return children;
    }

    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '20px',
          }}
        >
          <Spin size="large" />
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Setting up your profile...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This should only take a moment
            </Typography>
          </Box>
          
          {/* Fallback button after 10 seconds */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Taking too long?{' '}
              <button 
                onClick={() => window.location.reload()} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#1976d2', 
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Refresh page
              </button>
            </Typography>
          </Box>
        </Content>
      </Layout>
    );
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(userProfile.role)) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '20px',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="error" sx={{ mb: 2 }}>
              Access Denied
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You don't have permission to access this page.
            </Typography>
          </Box>
        </Content>
      </Layout>
    );
  }

  return children;
};

export default ProtectedRoute;