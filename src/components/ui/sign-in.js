// File: src/components/ui/sign-in.js

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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Isolated styles for this component only
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #f3e8ff 100%)',
      display: 'flex',
      fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      overflow: 'hidden',
      '@media (max-width: 768px)': {
        flexDirection: 'column'
      }
    },
    leftPanel: {
      flex: 1,
      background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 50%, #7c3aed 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px 40px',
      position: 'relative',
      overflow: 'hidden'
    },
    rightPanel: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '30px',
      width: '100%',
      maxWidth: '500px',
      zIndex: 2
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '30px 20px',
      textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: mounted ? 'translateX(0)' : 'translateX(-100px)',
      opacity: mounted ? 1 : 0
    },
    statNumber: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '10px',
      lineHeight: 1
    },
    statText: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '14px',
      lineHeight: '1.4'
    },
    signInCard: {
      width: '100%',
      maxWidth: '420px',
      borderRadius: '24px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.08)',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
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
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
      animation: mounted ? 'float 3s ease-in-out infinite' : 'none'
    },
    brandName: {
      fontSize: '28px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#64748b',
      fontSize: '15px'
    },
    toggleContainer: {
      display: 'flex',
      marginBottom: '32px',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
      background: '#f8fafc'
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
      color: '#64748b'
    },
    toggleButtonActive: {
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
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
      color: '#374151'
    },
    input: {
      borderRadius: '12px',
      height: '48px',
      fontSize: '15px',
      border: '2px solid #e2e8f0',
      transition: 'all 0.3s ease'
    },
    submitButton: {
      width: '100%',
      height: '48px',
      fontSize: '16px',
      fontWeight: '600',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
      transition: 'all 0.3s ease',
      marginBottom: '24px'
    },
    socialButton: {
      height: '48px',
      borderRadius: '12px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      border: '2px solid #e2e8f0'
    },
    decorativeElement: {
      position: 'absolute',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      animation: mounted ? 'float 4s ease-in-out infinite' : 'none'
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
        
        @keyframes slideInLeft {
          0% { transform: translateX(-100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .signin-container {
            flex-direction: column !important;
          }
          .signin-left-panel {
            min-height: 40vh !important;
            padding: 40px 20px !important;
          }
          .signin-right-panel {
            flex: 1 !important;
            padding: 20px !important;
          }
          .signin-stats-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 20px !important;
          }
          .signin-brand-title {
            fontSize: 32px !important;
          }
        }
        
        .stat-card-1 { animation-delay: 0.2s; }
        .stat-card-2 { animation-delay: 0.4s; }
        .stat-card-3 { animation-delay: 0.6s; }
        .stat-card-4 { animation-delay: 0.8s; }
        
        .input-group-1 { transition-delay: 0.1s; }
        .input-group-2 { transition-delay: 0.2s; }
        .input-group-3 { transition-delay: 0.3s; }
        .input-group-4 { transition-delay: 0.4s; }
        
        .signin-input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        
        .signin-submit-button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 25px rgba(59, 130, 246, 0.4) !important;
        }
        
        .signin-social-button:hover {
          transform: translateY(-1px) !important;
          border-color: #3b82f6 !important;
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
  }, []);

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

  const stats = [
    { number: '41%', text: 'of recruiters say entry-level positions are the hardest to fill.' },
    { number: '76%', text: 'of hiring managers admit attracting the right job candidates is their greatest challenge.' },
    { number: '2.3M', text: 'jobs posted monthly on leading platforms.' },
    { number: '89%', text: 'of successful candidates found through networking.' }
  ];

  return (
    <div style={styles.container} className="signin-container">
      {/* Left Panel - Statistics */}
      <div style={styles.leftPanel} className="signin-left-panel">
        {/* Decorative elements */}
        <div style={{...styles.decorativeElement, top: '10%', left: '-50px'}} />
        <div style={{...styles.decorativeElement, bottom: '20%', right: '-50px', animationDelay: '2s'}} />
        
        <div style={{marginBottom: '60px', textAlign: 'center', zIndex: 2}}>
          <Title level={1} style={{color: 'white', fontSize: '42px', fontWeight: 'bold', marginBottom: '16px'}} className="signin-brand-title">
            Welcome to Jobsly
          </Title>
          <Text style={{color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px'}}>
            Your career journey starts here
          </Text>
        </div>

        <div style={styles.statsGrid} className="signin-stats-grid">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`stat-card-${index + 1}`}
              style={{
                ...styles.statCard,
                animationDelay: `${0.2 + index * 0.2}s`
              }}
            >
              <div style={styles.statNumber}>{stat.number}</div>
              <div style={styles.statText}>{stat.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div style={styles.rightPanel} className="signin-right-panel">
        <Card style={styles.signInCard} bordered={false}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.logoContainer}>
              <HeartOutlined style={{ fontSize: '28px', color: 'white' }} />
            </div>
            <div style={styles.brandName}>
              Jobsly
            </div>
            <Text style={styles.subtitle}>
              Welcome to Jobsly, please enter your login details below to using the app.
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
                  prefix={<UserOutlined style={{color: '#9ca3af'}} />}
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
                prefix={<MailOutlined style={{color: '#9ca3af'}} />}
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
                prefix={<LockOutlined style={{color: '#9ca3af'}} />}
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
                  prefix={<LockOutlined style={{color: '#9ca3af'}} />}
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
                <Link href="#" style={{ fontSize: '14px', color: '#3b82f6' }}>
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
            <Divider style={{ margin: '24px 0', color: '#9ca3af' }}>
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
                <Text style={{ fontSize: '13px', color: '#6b7280' }}>
                  By creating an account, you agree to our{' '}
                  <Link href="#" style={{color: '#3b82f6'}}>Terms of Service</Link> and{' '}
                  <Link href="#" style={{color: '#3b82f6'}}>Privacy Policy</Link>
                </Text>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export { AnimatedSignIn };