// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ConfigProvider } from 'antd';
import { CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';

// Authentication Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';

// Dashboard Pages
import ClientDashboardPage from './pages/dashboard/ClientDashboardPage';

// Consultation Pages
import ConsultationRoom from './components/consultation/ConsultationRoom/ConsultationRoom';

// Error Pages
import NotFoundPage from './pages/error/NotFoundPage';

// MUI Theme
const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Ant Design Theme
const antdTheme = {
  token: {
    colorPrimary: '#1976d2',
    borderRadius: 8,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    Layout: {
      siderBg: '#ffffff',
      headerBg: '#ffffff',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#e3f2fd',
      itemSelectedColor: '#1976d2',
    },
  },
};

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <ConfigProvider theme={antdTheme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/auth/login" replace />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
              <Route 
                path="/auth/email-verification" 
                element={
                  <ProtectedRoute requireEmailVerification={false}>
                    <EmailVerificationPage />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                } 
              />

              {/* Client Dashboard Routes */}
              <Route 
                path="/client/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ClientDashboardPage />
                  </ProtectedRoute>
                } 
              />

              {/* Consultation Room Routes */}
              <Route 
                path="/client/consultation/:roomId" 
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ConsultationRoom />
                  </ProtectedRoute>
                } 
              />

              {/* Appointments Route (Coming Soon) */}
              <Route 
                path="/client/appointments/:subscriptionId" 
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <ComingSoonPage pageType="Appointments" />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes - Coming Soon */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ComingSoonPage pageType="Admin Dashboard" />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}

// Dashboard Router Component
const DashboardRouter = () => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

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

// Temporary Coming Soon Component
const ComingSoonPage = ({ pageType }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleGoBack = () => {
    navigate('/client/dashboard');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f5f5f5',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ color: '#1976d2', marginBottom: '20px' }}>
        🚧 {pageType} Coming Soon
      </h1>
      <p style={{ color: '#666', marginBottom: '30px', fontSize: '18px' }}>
        We're working hard to bring you this feature. Stay tuned!
      </p>
      <div style={{ display: 'flex', gap: '16px' }}>
        <button 
          onClick={handleGoBack}
          style={{
            background: '#1976d2',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Back to Dashboard
        </button>
        <button 
          onClick={handleLogout}
          style={{
            background: '#fff',
            color: '#1976d2',
            border: '2px solid #1976d2',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default App;