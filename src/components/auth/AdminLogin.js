import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Alert, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLogin.css';

const { Title, Text } = Typography;

const AdminLogin = () => {
  const [form] = Form.useForm();
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isLoading } = useAuth();

  // Security: Block login attempts after multiple failures
  useEffect(() => {
    const attemptData = localStorage.getItem('admin_login_attempts');
    if (attemptData) {
      try {
        const { count, lastAttempt } = JSON.parse(attemptData);
        const timeSinceLastAttempt = Date.now() - lastAttempt;
        
        // Block for 15 minutes after 3 failed attempts
        if (count >= 3 && timeSinceLastAttempt < 900000) {
          setIsBlocked(true);
          setLoginAttempts(count);
          setBlockTimeRemaining(Math.ceil((900000 - timeSinceLastAttempt) / 60000));
          
          // Start countdown timer
          const timer = setInterval(() => {
            const newTimeRemaining = Math.ceil((900000 - (Date.now() - lastAttempt)) / 60000);
            if (newTimeRemaining <= 0) {
              setIsBlocked(false);
              setLoginAttempts(0);
              localStorage.removeItem('admin_login_attempts');
              clearInterval(timer);
            } else {
              setBlockTimeRemaining(newTimeRemaining);
            }
          }, 60000);
          
          return () => clearInterval(timer);
        } else if (timeSinceLastAttempt >= 900000) {
          // Reset after 15 minutes
          localStorage.removeItem('admin_login_attempts');
          setLoginAttempts(0);
        } else {
          setLoginAttempts(count);
        }
      } catch (error) {
        console.error('Error parsing login attempts:', error);
        localStorage.removeItem('admin_login_attempts');
      }
    }
  }, []);

  const handleLogin = async (values) => {
    if (isBlocked) {
      setError(`Too many failed attempts. Please wait ${blockTimeRemaining} minutes.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Add additional security checks
      const credentials = {
        email: values.email.toLowerCase().trim(),
        password: values.password,
        rememberMe: values.rememberMe || false,
        // Add timestamp to prevent replay attacks
        timestamp: Date.now(),
        // Add browser fingerprinting
        fingerprint: await generateBrowserFingerprint()
      };

      const result = await login(credentials);

      if (result.success) {
        // Clear failed attempts on successful login
        localStorage.removeItem('admin_login_attempts');
        setLoginAttempts(0);
        
        // Redirect will be handled by the parent component
      } else {
        // Record failed attempt
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        localStorage.setItem('admin_login_attempts', JSON.stringify({
          count: newAttempts,
          lastAttempt: Date.now()
        }));

        if (newAttempts >= 3) {
          setIsBlocked(true);
          setBlockTimeRemaining(15);
          setError('Too many failed attempts. Account blocked for 15 minutes for security.');
        } else {
          setError(result.error || 'Invalid credentials. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate browser fingerprint for additional security
  const generateBrowserFingerprint = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('EkahHealth Admin Security', 2, 2);
    
    return {
      canvas: canvas.toDataURL(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      }
    };
  };

  if (isLoading) {
    return (
      <div className="login-loading">
        <div className="loading-spinner"></div>
        <p>Initializing secure admin session...</p>
      </div>
    );
  }

  return (
    <div className="admin-login-container">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>
      
      <Card className="login-card">
        <div className="login-header">
          <div className="logo-section">
            <div className="logo">🏥</div>
            <Title level={2} className="login-title">EkahHealth</Title>
            <Text className="login-subtitle">Admin Portal</Text>
          </div>
        </div>

        <Form
          form={form}
          name="admin_login"
          onFinish={handleLogin}
          autoComplete="off"
          size="large"
          layout="vertical"
        >
          {error && (
            <Alert
              message="Authentication Failed"
              description={error}
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
            />
          )}

          {isBlocked && (
            <Alert
              message="Account Temporarily Blocked"
              description={`For security reasons, this account is blocked for ${blockTimeRemaining} minutes due to multiple failed login attempts.`}
              type="warning"
              showIcon
              style={{ marginBottom: 24 }}
            />
          )}

          <Form.Item
            name="email"
            label="Admin Email"
            rules={[
              { required: true, message: 'Please enter your admin email' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="admin@ekahhealth.com"
              autoComplete="email"
              disabled={isBlocked}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your secure password"
              autoComplete="current-password"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              disabled={isBlocked}
            />
          </Form.Item>

          <Form.Item name="rememberMe" valuePropName="checked">
            <Checkbox disabled={isBlocked}>
              Keep me signed in for 7 days
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={isBlocked}
              block
              size="large"
              className="login-button"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </Button>
          </Form.Item>

          <div className="security-info">
            <Text type="secondary" style={{ fontSize: '12px' }}>
              🔒 This is a secure admin portal. All sessions are encrypted and monitored.
            </Text>
            {loginAttempts > 0 && !isBlocked && (
              <Text type="warning" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
                ⚠️ {3 - loginAttempts} login attempts remaining before temporary block.
              </Text>
            )}
          </div>
        </Form>

        <div className="login-footer">
          <Text type="secondary">
            Need help? Contact: <a href="mailto:ekahhealth@gmail.com">ekahhealth@gmail.com</a>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;