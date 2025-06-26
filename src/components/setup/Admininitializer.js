// src/components/setup/AdminInitializer.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Button, Typography, Alert, Spin } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { setupDefaultAdmin } from '../../scripts/setupDefaultAdmin';

const { Title, Text, Paragraph } = Typography;

const AdminInitializer = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupResult, setSetupResult] = useState(null);

  useEffect(() => {
    // Check if we need to show setup modal
    const hasSeenSetup = localStorage.getItem('ekah_admin_setup_seen');
    if (!hasSeenSetup) {
      setShowSetupModal(true);
    } else {
      setInitializationComplete(true);
    }
  }, []);

  const handleSetupAdmin = async () => {
    setIsInitializing(true);
    try {
      const result = await setupDefaultAdmin();
      setSetupResult(result);
      
      // Mark setup as seen
      localStorage.setItem('ekah_admin_setup_seen', 'true');
      
      setTimeout(() => {
        setShowSetupModal(false);
        setInitializationComplete(true);
      }, 3000);
      
    } catch (error) {
      setSetupResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSkipSetup = () => {
    localStorage.setItem('ekah_admin_setup_seen', 'true');
    setShowSetupModal(false);
    setInitializationComplete(true);
  };

  const handleResetSetup = () => {
    localStorage.removeItem('ekah_admin_setup_seen');
    setShowSetupModal(true);
    setInitializationComplete(false);
    setSetupResult(null);
  };

  // Add reset button to window for development
  if (typeof window !== 'undefined') {
    window.resetAdminSetup = handleResetSetup;
  }

  if (!initializationComplete) {
    return (
      <>
        <Modal
          title={
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#1976d2' }}>
                🏥 EKAH Health Setup
              </Title>
            </div>
          }
          open={showSetupModal}
          closable={false}
          maskClosable={false}
          width={600}
          footer={null}
        >
          {!setupResult ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Paragraph style={{ fontSize: '16px', marginBottom: 24 }}>
                Welcome to EKAH Health! This appears to be your first time running the application.
              </Paragraph>
              
              <Alert
                message="Default Admin Account Setup"
                description={
                  <div>
                    <p>We'll create a default admin/practitioner account with these credentials:</p>
                    <div style={{ 
                      background: '#f6f6f6', 
                      padding: '12px', 
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      margin: '12px 0'
                    }}>
                      <strong>Email:</strong> ekahhealth@gmail.com<br/>
                      <strong>Password:</strong> ekah.life$2025
                    </div>
                    <p>This account will have full admin and practitioner privileges.</p>
                  </div>
                }
                type="info"
                showIcon
                style={{ marginBottom: 24, textAlign: 'left' }}
              />

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSetupAdmin}
                  loading={isInitializing}
                  disabled={isInitializing}
                  style={{ minWidth: '120px' }}
                >
                  {isInitializing ? 'Setting up...' : 'Setup Admin Account'}
                </Button>
                
                <Button
                  size="large"
                  onClick={handleSkipSetup}
                  disabled={isInitializing}
                  style={{ minWidth: '120px' }}
                >
                  Skip Setup
                </Button>
              </div>
              
              {isInitializing && (
                <div style={{ marginTop: 24 }}>
                  <Spin size="large" />
                  <Paragraph style={{ marginTop: 12, color: '#666' }}>
                    Creating admin account and setting up profiles...
                  </Paragraph>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              {setupResult.success ? (
                <div>
                  <CheckCircleOutlined 
                    style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} 
                  />
                  <Title level={3} style={{ color: '#52c41a' }}>
                    Setup Completed Successfully! 🎉
                  </Title>
                  <Alert
                    message="Admin Account Created"
                    description={
                      <div>
                        <p>Your default admin account has been created:</p>
                        <div style={{ 
                          background: '#f6f6f6', 
                          padding: '12px', 
                          borderRadius: '8px',
                          fontFamily: 'monospace',
                          margin: '12px 0'
                        }}>
                          <strong>Email:</strong> ekahhealth@gmail.com<br/>
                          <strong>Password:</strong> ekah.life$2025
                        </div>
                        <p>You can now use these credentials to log in as an admin.</p>
                      </div>
                    }
                    type="success"
                    showIcon
                    style={{ marginBottom: 16, textAlign: 'left' }}
                  />
                  <Paragraph>
                    Redirecting to the application...
                  </Paragraph>
                </div>
              ) : (
                <div>
                  <ExclamationCircleOutlined 
                    style={{ fontSize: 64, color: '#ff4d4f', marginBottom: 16 }} 
                  />
                  <Title level={3} style={{ color: '#ff4d4f' }}>
                    Setup Failed
                  </Title>
                  <Alert
                    message="Setup Error"
                    description={setupResult.error || 'An unknown error occurred during setup.'}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <Button
                      type="primary"
                      onClick={handleSetupAdmin}
                    >
                      Retry Setup
                    </Button>
                    <Button
                      onClick={handleSkipSetup}
                    >
                      Continue Anyway
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
        
        {/* Loading screen while modal is open */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <Title level={2} style={{ color: 'white', marginBottom: 16 }}>
              🏥 EKAH Health
            </Title>
            <Spin size="large" />
            <Paragraph style={{ color: 'white', marginTop: 16 }}>
              Initializing application...
            </Paragraph>
          </div>
        </div>
      </>
    );
  }

  return children;
};

export default AdminInitializer;