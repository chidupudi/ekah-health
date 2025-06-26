// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ConfigProvider } from 'antd';
import { CssBaseline } from '@mui/material';
import { AuthProvider , useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';

// Authentication Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';

// // Dashboard Pages (we'll create these next)
// import UserDashboardPage from './pages/dashboard/UserDashboardPage';
// import AdminDashboardPage from './pages/dashboard/AdminDashboardPage';

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
              {/* <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                } 
              /> */}

              {/* Admin Only Routes */}
              {/* <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              /> */}

              {/* Client Only Routes */}
              {/* <Route 
                path="/client/*" 
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <UserDashboardPage />
                  </ProtectedRoute>
                } 
              /> */}

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

export default App;