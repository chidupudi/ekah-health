// src/components/ui/sign-in.js

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  Typography, 
  Divider, 
  Row, 
  Col,
  Space,
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
import { Heart, Shield, Users, Award } from 'lucide-react';
import DisplayCards from './display-cards';
import MainHeader from '../MainHeader';
import Footer from '../Footer';
import { AnimatedGridPattern } from './animated-grid-pattern';
import { cn } from '../../lib/utils';
import { useTheme } from '../ParticleBackground';

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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Therapy-themed cards for the display
  const therapyCards = [
    {
      icon: <Heart style={{ width: '16px', height: '16px', color: '#60a5fa' }} />,
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
      icon: <Shield style={{ width: '16px', height: '16px', color: '#60a5fa' }} />,
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
      icon: <Users style={{ width: '16px', height: '16px', color: '#60a5fa' }} />,
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
        // Page background
        pageBackground: '#000000',
        
        // Grid pattern
        gridColor: 'rgba(255, 255, 255, 0.1)',
        
        // Left panel (seamless with background)
        leftPanel: {
          background: 'transparent',
        },
        
        // Right panel (seamless with background)
        rightPanel: {
          background: 'transparent',
        },
        
        // Sign-in card
        cardBackground: 'rgba(255, 255, 255, 0.05)',
        cardBorder: 'rgba(255, 255, 255, 0.1)',
        cardBackdrop: 'blur(20px)',
        
        // Text colors
        titleColor: '#ffffff',
        subtitleColor: '#a0a0a0',
        labelColor: '#e0e0e0',
        
        // Form elements
        inputBackground: 'rgba(255, 255, 255, 0.05)',
        inputBorder: 'rgba(255, 255, 255, 0.2)',
        inputFocusBorder: '#60a5fa',
        inputText: '#ffffff',
        inputPlaceholder: '#a0a0a0',
        
        // Buttons
        primaryButton: '#ffffff',
        primaryButtonText: '#000000',
        primaryButtonHover: '#f0f0f0',
        
        secondaryButton: 'transparent',
        secondaryButtonBorder: 'rgba(255, 255, 255, 0.3)',
        secondaryButtonText: '#ffffff',
        
        // Toggle
        toggleBackground: 'rgba(255, 255, 255, 0.1)',
        toggleActive: '#ffffff',
        toggleActiveText: '#000000',
        toggleInactive: '#a0a0a0',
      };
    } else {
      return {
        // Page background
        pageBackground: '#ffffff',
        
        // Grid pattern
        gridColor: 'rgba(0, 0, 0, 0.1)',
        
        // Left panel (seamless with background)
        leftPanel: {
          background: 'transparent',
        },
        
        // Right panel (seamless with background)
        rightPanel: {
          background: 'transparent',
        },
        
        // Sign-in card
        cardBackground: 'rgba(0, 0, 0, 0.02)',
        cardBorder: 'rgba(0, 0, 0, 0.1)',
        cardBackdrop: 'blur(20px)',
        
        // Text colors
        titleColor: '#000000',
        subtitleColor: '#666666',
        labelColor: '#333333',
        
        // Form elements
        inputBackground: 'rgba(0, 0, 0, 0.02)',
        inputBorder: 'rgba(0, 0, 0, 0.2)',
        inputFocusBorder: '#2563eb',
        inputText: '#000000',
        inputPlaceholder: '#666666',
        
        // Buttons
        primaryButton: '#000000',
        primaryButtonText: '#ffffff',
        primaryButtonHover: '#333333',
        
        secondaryButton: 'transparent',
        secondaryButtonBorder: 'rgba(0, 0, 0, 0.3)',
        secondaryButtonText: '#000000',
        
        // Toggle
        toggleBackground: 'rgba(0, 0, 0, 0.05)',
        toggleActive: '#000000',
        toggleActiveText: '#ffffff',
        toggleInactive: '#666666',
      };
    }
  };

  const signInStyles = getSignInThemeStyles();

  // Styles object
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      background: signInStyles.pageBackground,
      position: 'relative',
      overflow: 'hidden'
    },
    
    gridContainer: {
      position: 'absolute',
      inset: 0,
      zIndex: 1
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
      minHeight: 'calc(100vh - 64px)', // Fixed height to prevent movement
      ...signInStyles.leftPanel
    },
    
    rightPanel: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      minHeight: 'calc(100vh - 64px)', // Fixed height to match left panel
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
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    
    header: {
      textAlign: 'center',
      marginBottom: '32px',
      padding: '40px 40px 0'
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
      marginBottom: '32px',
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
      padding: '0 40px 40px'
    },
    
    inputGroup: {
      marginBottom: '20px',
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
      marginBottom: '24px'
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
          box-shadow: 0 0 0 3px ${theme === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)'} !important;
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
  }, [theme, signInStyles]);

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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    message.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
    console.log(isLogin ? 'Login' : 'Sign Up', formData);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <MainHeader />
      
      {/* Animated Grid Background */}
      <div style={styles.gridContainer}>
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.15}
          duration={3}
          repeatDelay={1}
          width={50}
          height={50}
          style={{
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          }}
        />
      </div>
      
      <div style={styles.container} className="signin-container">
        {/* Left Panel - Display Cards */}
        <div style={styles.leftPanel} className="signin-left-panel">
          <div style={{
            marginBottom: '60px', 
            textAlign: 'center', 
            zIndex: 2,
            position: 'absolute',
            top: '20%',
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

          {/* Display Cards */}
          <div style={{ 
            zIndex: 2, 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center',
            position: 'absolute',
            bottom: '25%',
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
              <div style={styles.brandName}>
                EkahHealth
              </div>
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
                  Sign In
                </button>
                <button
                  style={{
                    ...styles.toggleButton,
                    ...(!isLogin ? styles.toggleButtonActive : {})
                  }}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </button>
              </div>

              {/* Name Field (Sign Up Only) */}
              {!isLogin && (
                <div style={styles.inputGroup} className="input-group-1">
                  <label style={styles.label}>Full Name</label>
                  <Input
                    prefix={<UserOutlined style={{color: signInStyles.subtitleColor}} />}
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
                  prefix={<MailOutlined style={{color: signInStyles.subtitleColor}} />}
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
                  prefix={<LockOutlined style={{color: signInStyles.subtitleColor}} />}
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
                    prefix={<LockOutlined style={{color: signInStyles.subtitleColor}} />}
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
                <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                  <Link href="#" style={{ fontSize: '14px', color: signInStyles.inputFocusBorder }}>
                    Forgot the password?
                  </Link>
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
                {isLogin ? 'Login' : 'Create Account'}
              </Button>

              {/* Divider */}
              <Divider style={{ margin: '24px 0', color: signInStyles.subtitleColor }}>
                OR
              </Divider>

              {/* Google Sign In */}
              <Button
                icon={<GoogleOutlined />}
                className="signin-social-button"
                style={{...styles.socialButton, width: '100%', marginBottom: '24px'}}
              >
                Sign in with Google
              </Button>

              {/* Terms & Privacy (Sign Up Only) */}
              {!isLogin && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Text style={{ fontSize: '13px', color: signInStyles.subtitleColor }}>
                    By creating an account, you agree to our{' '}
                    <Link href="#" style={{color: signInStyles.inputFocusBorder}}>Terms of Service</Link> and{' '}
                    <Link href="#" style={{color: signInStyles.inputFocusBorder}}>Privacy Policy</Link>
                  </Text>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export { AnimatedSignIn };