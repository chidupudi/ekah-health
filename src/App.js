// File: src/App.js

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { ConfigProvider } from 'antd';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import WelcomeNew from './pages/WelcomeNew';
import About from './pages/About';
import Services from './pages/Services/index'; // Updated import for new modular Services
import PrivacyPolicy from './pages/PrivacyPolicy'; // New import for Privacy Policy
import MainHeader from './components/MainHeader';
import { ThemeProvider } from './contexts/ThemeContext';
import { AnimatedSignIn } from './components/ui/sign-in';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import TermsConditions from './pages/TermsConditions';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import BookingFlow from './pages/BookingFlow';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';

const PageWrapper = ({ children }) => (
  <>
    <MainHeader />
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <Layout>
        {children}
      </Layout>
    </div>
  </>
);

// Component to handle Google Sign-in redirect results
const GoogleRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        // Import Firebase auth methods
        const { getRedirectResult } = await import('firebase/auth');
        const { auth } = await import('./services/firebase/config');

        // Check if we have a redirect result
        const result = await getRedirectResult(auth);

        if (result && result.user) {
          // Check for stored intended booking
          const storedBooking = localStorage.getItem('intendedServiceBooking');

          // Only show success message if we don't already have it shown
          const hasShownMessage = sessionStorage.getItem('googleSignInSuccess');

          if (!hasShownMessage) {
            message.success('Signed in with Google successfully!');
            sessionStorage.setItem('googleSignInSuccess', 'true');
          }

          // Navigate based on stored intentions
          if (storedBooking) {
            localStorage.removeItem('intendedServiceBooking');
            try {
              const service = JSON.parse(storedBooking);
              navigate('/booking', {
                state: {
                  service: service,
                  selectedServices: [service]
                }
              });
            } catch (e) {
              console.error('Error parsing stored booking:', e);
              navigate('/');
            }
          } else {
            navigate('/');
          }

          // Clear the success flag after navigation
          setTimeout(() => {
            sessionStorage.removeItem('googleSignInSuccess');
          }, 2000);
        }
      } catch (error) {
        console.error('Error handling redirect result:', error);
        // If there's an error, don't prevent normal navigation
      }
    };

    // Check immediately and also after a short delay
    handleRedirectResult();
    const timer = setTimeout(handleRedirectResult, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return null;
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#667eea', // Updated to match Services page gradient
            borderRadius: 12, // Increased for modern look
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          components: {
            // Custom component styling to match Services page
            Card: {
              borderRadiusLG: 16,
              paddingLG: 24,
            },
            Button: {
              borderRadius: 8,
              fontWeight: 600,
            },
            Modal: {
              borderRadiusLG: 16,
            },
            Tabs: {
              borderRadius: 12,
            },
          },
        }}
      >
        <AuthProvider>
          <AdminAuthProvider>
            <Router>
              <GoogleRedirectHandler />
              <Routes>
              {/* Auth routes - now with their own header and footer */}
              <Route path="/signin" element={<AnimatedSignIn />} />
              <Route path="/signup" element={<AnimatedSignIn />} />
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              
              {/* Regular routes - with header and layout */}
              <Route path="/" element={<PageWrapper><WelcomeNew /></PageWrapper>} />
              <Route path="/welcome-old" element={<PageWrapper><Welcome /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
              <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
              <Route path="/terms" element={<PageWrapper><TermsConditions /></PageWrapper>} />
              <Route path="/privacy-policy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
              <Route path="/booking" element={<PageWrapper><BookingFlow /></PageWrapper>} />
              <Route path="/my-bookings" element={<PageWrapper><MyBookings /></PageWrapper>} />
              <Route path="/contact" element={
                <PageWrapper>
                  <div style={{ 
                    padding: '64px 32px', 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)',
                    minHeight: '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}>
                    <h2 style={{ 
                      fontSize: '2.5rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      marginBottom: '16px'
                    }}>
                      Contact Page
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '1.2rem' }}>Coming Soon</p>
                  </div>
                </PageWrapper>
              } />
              <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
              {/* Terms of Service route - placeholder for future implementation */}
              <Route path="/terms" element={
                <PageWrapper>
                  <div style={{ 
                    padding: '64px 32px', 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)',
                    minHeight: '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}>
                    <h2 style={{ 
                      fontSize: '2.5rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      marginBottom: '16px'
                    }}>
                      Terms of Service
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '1.2rem' }}>Coming Soon</p>
                  </div>
                </PageWrapper>
              } />
              {/* HIPAA Compliance route - placeholder for future implementation */}
              <Route path="/hipaa" element={
                <PageWrapper>
                  <div style={{ 
                    padding: '64px 32px', 
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)',
                    minHeight: '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}>
                    <h2 style={{ 
                      fontSize: '2.5rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      marginBottom: '16px'
                    }}>
                      HIPAA Compliance
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '1.2rem' }}>Coming Soon</p>
                  </div>
                </PageWrapper>
              } />
            </Routes>
          </Router>
          </AdminAuthProvider>
        </AuthProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default App;