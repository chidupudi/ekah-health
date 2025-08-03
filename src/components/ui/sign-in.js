// File: src/components/ui/sign-in.js

import React, { useState } from 'react';
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
  FacebookOutlined
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const AnimatedSignIn = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Isolated styles for this component only
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    },
    mainCard: {
      width: '100%',
      maxWidth: '420px',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      overflow: 'hidden'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      padding: '20px 0 0 0'
    },
    logoContainer: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #1890ff, #722ed1)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      boxShadow: '0 8px 24px rgba(24, 144, 255, 0.3)'
    },
    toggleContainer: {
      display: 'flex',
      marginBottom: '30px',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #f0f0f0'
    },
    toggleButton: {
      flex: 1,
      border: 'none',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: '#fafafa',
      color: '#666'
    },
    toggleButtonActive: {
      background: 'linear-gradient(135deg, #1890ff, #722ed1)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
    },
    formContainer: {
      padding: '0 30px 30px'
    },
    animatedField: {
      opacity: 0,
      maxHeight: 0,
      overflow: 'hidden',
      transition: 'all 0.5s ease',
      marginBottom: 0
    },
    animatedFieldVisible: {
      opacity: 1,
      maxHeight: '100px',
      marginBottom: '16px'
    },
    inputField: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#333'
    },
    submitButton: {
      width: '100%',
      height: '45px',
      fontSize: '16px',
      fontWeight: '600',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(135deg, #1890ff, #722ed1)',
      boxShadow: '0 4px 15px rgba(24, 144, 255, 0.3)',
      transition: 'all 0.3s ease'
    },
    socialButton: {
      height: '45px',
      borderRadius: '8px',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    googleButton: {
      borderColor: '#db4437',
      color: '#db4437'
    },
    facebookButton: {
      borderColor: '#4267b2',
      color: '#4267b2'
    },
    footer: {
      textAlign: 'center',
      marginTop: '20px',
      padding: '0 30px 30px'
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '16px',
      height: '16px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '8px'
    }
  };

  // Add keyframe animation for spinner
  React.useEffect(() => {
    if (!document.getElementById('signin-styles')) {
      const style = document.createElement('style');
      style.id = 'signin-styles';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .signin-submit-button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4) !important;
        }
        .signin-social-button:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }
        .signin-input:focus {
          border-color: #1890ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById('signin-styles');
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
    message.success(isLogin ? 'Signed in successfully!' : 'Account created successfully!');
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
    <div style={styles.container}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <HeartOutlined style={{ fontSize: '32px', color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: '0 0 8px 0', color: '#1f2937' }}>
            EkahHealth
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Your mental wellness journey starts here
          </Text>
        </div>

        {/* Main Card */}
        <Card style={styles.mainCard} bordered={false}>
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

          <div style={styles.formContainer}>
            {/* Name Field (Sign Up Only) */}
            <div
              style={{
                ...styles.animatedField,
                ...(!isLogin ? styles.animatedFieldVisible : {})
              }}
            >
              <label style={styles.label}>Full Name</label>
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="signin-input"
                style={{ borderRadius: '8px', height: '40px' }}
                size="large"
              />
            </div>

            {/* Email Field */}
            <div style={styles.inputField}>
              <label style={styles.label}>Email Address</label>
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="signin-input"
                style={{ borderRadius: '8px', height: '40px' }}
                size="large"
              />
            </div>

            {/* Password Field */}
            <div style={styles.inputField}>
              <label style={styles.label}>Password</label>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="signin-input"
                style={{ borderRadius: '8px', height: '40px' }}
                size="large"
              />
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            <div
              style={{
                ...styles.animatedField,
                ...(!isLogin ? styles.animatedFieldVisible : {})
              }}
            >
              <label style={styles.label}>Confirm Password</label>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="signin-input"
                style={{ borderRadius: '8px', height: '40px' }}
                size="large"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="primary"
              loading={loading}
              onClick={handleSubmit}
              className="signin-submit-button"
              style={styles.submitButton}
            >
              {loading ? (
                <>
                  <span style={styles.loadingSpinner}></span>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>

            {/* Forgot Password (Login Only) */}
            {isLogin && (
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <Link href="#" style={{ fontSize: '14px' }}>
                  Forgot your password?
                </Link>
              </div>
            )}

            {/* Terms & Privacy (Sign Up Only) */}
            {!isLogin && (
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <Text style={{ fontSize: '12px', color: '#666' }}>
                  By creating an account, you agree to our{' '}
                  <Link href="#">Terms of Service</Link> and{' '}
                  <Link href="#">Privacy Policy</Link>
                </Text>
              </div>
            )}

            {/* Social Login Divider */}
            <Divider style={{ margin: '24px 0' }}>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                or continue with
              </Text>
            </Divider>

            {/* Social Login Buttons */}
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Button
                  icon={<GoogleOutlined />}
                  className="signin-social-button"
                  style={{
                    ...styles.socialButton,
                    ...styles.googleButton,
                    width: '100%'
                  }}
                >
                  Google
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  icon={<FacebookOutlined />}
                  className="signin-social-button"
                  style={{
                    ...styles.socialButton,
                    ...styles.facebookButton,
                    width: '100%'
                  }}
                >
                  Facebook
                </Button>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Footer */}
        <div style={styles.footer}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Need help?{' '}
            <Link href="#" style={{ fontWeight: '500' }}>
              Contact Support
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

export { AnimatedSignIn };