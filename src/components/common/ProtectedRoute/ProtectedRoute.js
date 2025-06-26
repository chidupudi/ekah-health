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
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Redirect to email verification if email is not verified
  if (requireEmailVerification && !currentUser.emailVerified) {
    return <Navigate to="/auth/email-verification" replace />;
  }

  // Check if user profile exists
  if (!userProfile) {
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
              Loading profile...
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