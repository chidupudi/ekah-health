import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  Typography, 
  Divider, 
  message
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  HeartOutlined,
  GoogleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import { Heart, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DisplayCards from './display-cards';
import MainHeader from '../MainHeader';
import Footer from '../Footer';
import { useTheme } from '../ParticleBackground';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Link } = Typography;

const AnimatedSignIn = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { theme } = useTheme();
  const { login, loginWithGoogle, register, error, clearError, forgotPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    
    // Clear any previous auth errors when component mounts
    if (clearError) {
      clearError();
    }
  }, [clearError]);

  // Therapy-themed cards for the display
  const therapyCards = [
    {
      icon: <Heart style={{ width: '16px', height: '16px', color: '#000000' }} />,
      title: "Mental Wellness",
      description: "Professional therapy services",
      date: "Available 24/7",
      className: "card-1",
      style: {
        gridArea: 'stack',
        transform: 'translateY(0px) skewY(-8deg)',
        transition: 'all 0.7s ease',
        filter: 'grayscale(100%)',
        position: 'relative',
        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
      }
    },
    {
      icon: <Shield style={{ width: '16px', height: '16px', color: '#000000' }} />,
      title: "Safe Space",
      description: "Confidential & secure sessions",
      date: "HIPAA Compliant",
      className: "card-2",
      style: {
        gridArea: 'stack',
        transform: 'translateX(64px) translateY(40px) skewY(-8deg)',
        transition: 'all 0.7s ease',
        filter: 'grayscale(100%)',
        position: 'relative',
        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
      }
    },
    {
      icon: <Users style={{ width: '16px', height: '16px', color: '#000000' }} />,
      title: "Expert Care",
      description: "Licensed professionals",
      date: "15+ Years Experience",
      className: "card-3",
      style: {
        gridArea: 'stack',
        transform: 'translateX(128px) translateY(80px) skewY(-8deg)',
        transition: 'all 0.7s ease',
        position: 'relative',
        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
      }
    },
  ];

  // Theme-aware styles for black/white design
  const getSignInThemeStyles = () => {
    if (theme === 'dark') {
      return {
        pageBackground: '#000000',
        gridColor: 'rgba(255, 255, 255, 0.1)',
        leftPanel: { background: 'transparent' },
        rightPanel: { background: 'transparent' },
        cardBackground: 'rgba(255, 255, 255, 0.05)',
        cardBorder: 'rgba(255, 255, 255, 0.1)',
        cardBackdrop: 'blur(20px)',
        titleColor: '#ffffff',
        subtitleColor: '#a0a0a0',
        labelColor: '#e0e0e0',
        inputBackground: 'rgba(255, 255, 255, 0.05)',
        inputBorder: 'rgba(255, 255, 255, 0.2)',
        inputFocusBorder: '#ffffff',
        inputText: '#ffffff',
        inputPlaceholder: '#a0a0a0',
        primaryButton: '#ffffff',
        primaryButtonText: '#000000',
        primaryButtonHover: '#f0f0f0',
        secondaryButton: 'transparent',
        secondaryButtonBorder: 'rgba(255, 255, 255, 0.3)',
        secondaryButtonText: '#ffffff',
        toggleBackground: 'rgba(255, 255, 255, 0.1)',
        toggleActive: '#ffffff',
        toggleActiveText: '#000000',
        toggleInactive: '#a0a0a0',
      };
    } else {
      return {
        pageBackground: '#ffffff',
        gridColor: 'rgba(0, 0, 0, 0.1)',
        leftPanel: { background: 'transparent' },
        rightPanel: { background: 'transparent' },
        cardBackground: 'rgba(0, 0, 0, 0.02)',
        cardBorder: 'rgba(0, 0, 0, 0.1)',
        cardBackdrop: 'blur(20px)',
        titleColor: '#000000',
        subtitleColor: '#666666',
        labelColor: '#333333',
        inputBackground: 'rgba(0, 0, 0, 0.02)',
        inputBorder: 'rgba(0, 0, 0, 0.2)',
        inputFocusBorder: '#000000',
        inputText: '#000000',
        inputPlaceholder: '#666666',
        primaryButton: '#000000',
        primaryButtonText: '#ffffff',
        primaryButtonHover: '#333333',
        secondaryButton: 'transparent',
        secondaryButtonBorder: 'rgba(0, 0, 0, 0.3)',
        secondaryButtonText: '#000000',
        toggleBackground: 'rgba(0, 0, 0, 0.05)',
        toggleActive: '#000000',
        toggleActiveText: '#ffffff',
        toggleInactive: '#666666',
      };
    }
  };

  const signInStyles = getSignInThemeStyles();

  // --- STYLES ---
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      background: signInStyles.pageBackground,
      position: 'relative',
      // overflow: 'hidden', // REMOVE this to let grid cover both panels
    },
    gridContainer: {
      position: 'fixed',
      inset: 0,
      zIndex: 1,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      display: 'none', // Hide the grid container
    },
    container: {
      flex: 1,
      display: 'flex',
      overflow: 'hidden',
      paddingTop: '64px',
      position: 'relative',
      zIndex: 2
    },
    leftPanel: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px 40px',
      position: 'relative',
      minHeight: 'calc(100vh - 64px)',
      ...signInStyles.leftPanel
    },
    rightPanel: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      minHeight: 'calc(100vh - 64px)',
      ...signInStyles.rightPanel
    },
    signInCard: {
      width: '100%',
      maxWidth: '420px',
      borderRadius: '24px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
      background: signInStyles.cardBackground,
      backdropFilter: signInStyles.cardBackdrop,
      border: `1px solid ${signInStyles.cardBorder}`,
      overflow: 'hidden',
      transform: mounted ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
      opacity: mounted ? 1 : 0,
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      minHeight: 480, // ENSURE consistent card height for both login & signup
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    header: {
      textAlign: 'center',
      marginBottom: isLogin ? '32px' : '28px',
      padding: isLogin ? '40px 40px 0' : '32px 40px 0'
    },
    logoContainer: {
      width: '64px',
      height: '64px',
      background: theme === 'dark' ? '#ffffff' : '#000000',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      boxShadow: `0 8px 32px ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
      animation: mounted ? 'float 3s ease-in-out infinite' : 'none'
    },
    brandName: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: signInStyles.titleColor,
      marginBottom: '8px'
    },
    subtitle: {
      color: signInStyles.subtitleColor,
      fontSize: '15px'
    },
    toggleContainer: {
      display: 'flex',
      marginBottom: '28px',
      borderRadius: '12px',
      overflow: 'hidden',
      border: `1px solid ${signInStyles.cardBorder}`,
      background: signInStyles.toggleBackground
    },
    toggleButton: {
      flex: 1,
      border: 'none',
      padding: '14px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: 'transparent',
      color: signInStyles.toggleInactive
    },
    toggleButtonActive: {
      background: signInStyles.toggleActive,
      color: signInStyles.toggleActiveText,
      boxShadow: `0 4px 12px ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`
    },
    formContainer: {
      padding: isLogin ? '0 40px 28px' : '0 40px 16px'
    },
    inputGroup: {
      marginBottom: isLogin ? '20px' : '14px',
      transform: mounted ? 'translateX(0)' : 'translateX(30px)',
      opacity: mounted ? 1 : 0,
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: signInStyles.labelColor
    },
    input: {
      borderRadius: '12px',
      height: '48px',
      fontSize: '15px',
      border: `2px solid ${signInStyles.inputBorder}`,
      background: signInStyles.inputBackground,
      color: signInStyles.inputText,
      transition: 'all 0.3s ease'
    },
    submitButton: {
      width: '100%',
      height: '48px',
      fontSize: '16px',
      fontWeight: '600',
      borderRadius: '12px',
      border: 'none',
      background: signInStyles.primaryButton,
      color: signInStyles.primaryButtonText,
      boxShadow: `0 4px 20px ${theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}`,
      transition: 'all 0.3s ease',
      marginBottom: '18px'
    },
    socialButton: {
      height: '48px',
      borderRadius: '12px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      border: `2px solid ${signInStyles.secondaryButtonBorder}`,
      background: signInStyles.secondaryButton,
      color: signInStyles.secondaryButtonText
    }
  };

  // Add keyframe animations
  useEffect(() => {
    if (!document.getElementById('signin-enhanced-styles')) {
      const style = document.createElement('style');
      style.id = 'signin-enhanced-styles';
      style.textContent = `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @media (max-width: 768px) {
          .signin-container {
            flex-direction: column !important;
          }
          .signin-left-panel {
            min-height: 50vh !important;
            padding: 40px 20px !important;
          }
          .signin-right-panel {
            flex: 1 !important;
            padding: 20px !important;
            min-height: 50vh !important;
          }
        }
        .input-group-1 { transition-delay: 0.1s; }
        .input-group-2 { transition-delay: 0.2s; }
        .input-group-3 { transition-delay: 0.3s; }
        .input-group-4 { transition-delay: 0.4s; }
        .signin-input:focus {
          border-color: ${signInStyles.inputFocusBorder} !important;
          box-shadow: 0 0 0 3px ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'} !important;
        }
        .signin-submit-button:hover {
          transform: translateY(-2px) !important;
          background: ${signInStyles.primaryButtonHover} !important;
        }
        .signin-social-button:hover {
          transform: translateY(-1px) !important;
          border-color: ${signInStyles.inputFocusBorder} !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById('signin-enhanced-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [theme, signInStyles, isLogin]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      message.error('Please fill in all required fields');
      return false;
    }
    if (!isLogin) {
      if (!formData.name) {
        message.error('Please enter your full name');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        message.error('Passwords do not match');
        return false;
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      message.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (isLogin) {
        // Login with email and password
        await login(formData.email, formData.password);
        message.success('Welcome back!');
        
        // Check for intended service booking
        const intendedBooking = sessionStorage.getItem('intendedServiceBooking');
        if (intendedBooking) {
          sessionStorage.removeItem('intendedServiceBooking');
          const service = JSON.parse(intendedBooking);
          // Service is already cleaned (no React elements)
          navigate('/booking', { 
            state: { 
              service: service,
              selectedServices: [service]
            } 
          });
        } else {
          navigate('/'); // Redirect to home page after login
        }
      } else {
        // Register with email and password
        await register(formData.email, formData.password, formData.name);
        message.success('Account created successfully!');
        navigate('/'); // Redirect to home page after registration
      }
    } catch (error) {
      // Error is handled by the AuthContext and set to the error state
      message.error(error.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      message.success('Signed in with Google successfully!');
      
      // Check for intended service booking
      const intendedBooking = sessionStorage.getItem('intendedServiceBooking');
      if (intendedBooking) {
        sessionStorage.removeItem('intendedServiceBooking');
        const service = JSON.parse(intendedBooking);
        // Service is already cleaned (no React elements)
        navigate('/booking', { 
          state: { 
            service: service,
            selectedServices: [service]
          } 
        });
      } else {
        navigate('/'); // Redirect to home page after Google sign-in
      }
    } catch (error) {
      // Error is handled by the AuthContext and set to the error state
      message.error(error.message || 'An error occurred during Google sign-in');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      message.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      message.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(formData.email);
      message.success('Password reset email sent. Please check your inbox.');
    } catch (error) {
      message.error(error.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <MainHeader />
      <div style={styles.container} className="signin-container">
        {/* Left Panel - Display Cards */}
        <div style={styles.leftPanel} className="signin-left-panel">
          <div style={{
            marginBottom: '60px',
            textAlign: 'center',
            zIndex: 2,
            position: 'absolute',
            top: '10%', // Moved up from 15% to 10%
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%'
          }}>
            <Title level={1} style={{
              color: signInStyles.titleColor,
              fontSize: '42px',
              fontWeight: 'bold',
              marginBottom: '16px'
            }}>
              Welcome to EkahHealth
            </Title>
            <Text style={{
              color: signInStyles.subtitleColor,
              fontSize: '18px'
            }}>
              Your mental wellness journey starts here
            </Text>
          </div>
          <div style={{
            zIndex: 2,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            top: '30%', // Changed from bottom: 45% to top: 30%
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            <DisplayCards cards={therapyCards} />
          </div>
        </div>
        {/* Right Panel - Sign In Form */}
        <div style={styles.rightPanel} className="signin-right-panel">
          <Card style={styles.signInCard} bordered={false}>
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.logoContainer}>
                <HeartOutlined style={{
                  fontSize: '28px',
                  color: theme === 'dark' ? '#000000' : '#ffffff'
                }} />
              </div>
              <div style={styles.brandName}>EkahHealth</div>
              <Text style={styles.subtitle}>
                Welcome to EkahHealth, please enter your login details below to access your account.
              </Text>
            </div>
            <div style={styles.formContainer}>
              {/* Toggle Buttons */}
              <div style={styles.toggleContainer}>
                <button
                  style={{
                    ...styles.toggleButton,
                    ...(isLogin ? styles.toggleButtonActive : {})
                  }}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button
                  style={{
                    ...styles.toggleButton,
                    ...(!isLogin ? styles.toggleButtonActive : {})
                  }}
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </button>
              </div>
              {/* Name Field (Sign Up Only) */}
              {!isLogin && (
                <div style={styles.inputGroup} className="input-group-1">
                  <label style={styles.label}>Full Name</label>
                  <Input
                    prefix={<UserOutlined style={{ color: signInStyles.subtitleColor }} />}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="signin-input"
                    style={styles.input}
                  />
                </div>
              )}
              {/* Email Field */}
              <div style={styles.inputGroup} className="input-group-2">
                <label style={styles.label}>Email Address</label>
                <Input
                  prefix={<MailOutlined style={{ color: signInStyles.subtitleColor }} />}
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="signin-input"
                  style={styles.input}
                />
              </div>
              {/* Password Field */}
              <div style={styles.inputGroup} className="input-group-3">
                <label style={styles.label}>Password</label>
                <Input.Password
                  prefix={<LockOutlined style={{ color: signInStyles.subtitleColor }} />}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="signin-input"
                  style={styles.input}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </div>
              {/* Confirm Password Field (Sign Up Only) */}
              {!isLogin && (
                <div style={styles.inputGroup} className="input-group-4">
                  <label style={styles.label}>Confirm Password</label>
                  <Input.Password
                    prefix={<LockOutlined style={{ color: signInStyles.subtitleColor }} />}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="signin-input"
                    style={styles.input}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </div>
              )}
              {/* Forgot Password (Login Only) */}
              {isLogin && (
                <div style={{ textAlign: 'right', marginBottom: '18px' }}>
                  <Link onClick={handleForgotPassword} style={{ fontSize: '14px', color: signInStyles.inputFocusBorder }}>
                    Forgot the password?
                  </Link>
                </div>
              )}
              {/* Error display */}
              {error && (
                <div style={{
                  padding: '12px',
                  marginBottom: '18px',
                  borderRadius: '8px',
                  backgroundColor: theme === 'dark' ? 'rgba(254, 226, 226, 0.1)' : 'rgba(254, 226, 226, 0.5)',
                  borderLeft: '4px solid #ef4444',
                  color: theme === 'dark' ? '#fca5a5' : '#b91c1c'
                }}>
                  {error}
                </div>
              )}
              
              {/* Submit Button */}
              <Button
                type="primary"
                loading={loading}
                onClick={handleSubmit}
                className="signin-submit-button"
                style={styles.submitButton}
              >
                {isLogin ? 'Login' : 'Register'}
              </Button>
              {/* Divider */}
              <Divider style={{ margin: '18px 0', color: signInStyles.subtitleColor }}>
                OR
              </Divider>
              {/* Google Sign In */}
              <Button
                icon={<GoogleOutlined />}
                className="signin-social-button"
                style={{ ...styles.socialButton, width: '100%', marginBottom: '18px' }}
                onClick={handleGoogleSignIn}
                loading={loading}
              >
                Continue with Google
              </Button>
              {/* Terms & Privacy (Sign Up Only) */}
              {!isLogin && (
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <Text style={{ fontSize: '13px', color: signInStyles.subtitleColor }}>
                    By creating an account, you agree to our{' '}
                    <Link href="#" style={{ color: signInStyles.inputFocusBorder }}>Terms of Service</Link> and{' '}
                    <Link href="#" style={{ color: signInStyles.inputFocusBorder }}>Privacy Policy</Link>
                  </Text>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export { AnimatedSignIn };