// src/components/common/DashboardRouter/DashboardRouter.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const DashboardRouter = () => {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect based on user role
  if (userProfile.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/client/dashboard" replace />;
  }
};

export default DashboardRouter;