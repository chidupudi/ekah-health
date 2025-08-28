import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Alert, Space, Typography, Switch, Divider, message } from 'antd';
import { GoogleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import googleCalendarService from '../services/googleCalendar';

const { Title, Text, Paragraph } = Typography;

const GoogleCalendarConfig = ({ onConfigChange }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [status, setStatus] = useState({ isInitialized: false, isSignedIn: false });
  const [calendars, setCalendars] = useState([]);
  const [config, setConfig] = useState({
    apiKey: '',
    clientId: '',
    enabled: false,
    selectedCalendar: 'primary'
  });

  useEffect(() => {
    // Load saved configuration from localStorage
    const savedConfig = localStorage.getItem('googleCalendarConfig');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setConfig(parsedConfig);
      form.setFieldsValue(parsedConfig);
      
      if (parsedConfig.enabled && parsedConfig.apiKey && parsedConfig.clientId) {
        initializeCalendarService(parsedConfig.apiKey, parsedConfig.clientId);
      }
    }
  }, [form]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(googleCalendarService.getSignInStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const initializeCalendarService = async (apiKey, clientId) => {
    try {
      setInitializing(true);
      await googleCalendarService.initialize(apiKey, clientId);
      setStatus(googleCalendarService.getSignInStatus());
      message.success('Google Calendar API initialized successfully');
    } catch (error) {
      message.error(`Failed to initialize Google Calendar: ${error.message}`);
    } finally {
      setInitializing(false);
    }
  };

  const handleSaveConfig = async (values) => {
    try {
      setLoading(true);
      
      const newConfig = { ...config, ...values };
      setConfig(newConfig);
      
      // Save to localStorage
      localStorage.setItem('googleCalendarConfig', JSON.stringify(newConfig));
      
      if (newConfig.enabled && newConfig.apiKey && newConfig.clientId) {
        await initializeCalendarService(newConfig.apiKey, newConfig.clientId);
      }
      
      if (onConfigChange) {
        onConfigChange(newConfig);
      }
      
      message.success('Configuration saved successfully');
    } catch (error) {
      message.error(`Failed to save configuration: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await googleCalendarService.signIn();
      
      // Load calendars after successful sign-in
      const userCalendars = await googleCalendarService.getCalendars();
      setCalendars(userCalendars);
      setStatus(googleCalendarService.getSignInStatus());
      
      message.success('Successfully signed in to Google Calendar');
    } catch (error) {
      message.error(`Failed to sign in: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await googleCalendarService.signOut();
      setCalendars([]);
      setStatus(googleCalendarService.getSignInStatus());
      message.success('Successfully signed out from Google Calendar');
    } catch (error) {
      message.error(`Failed to sign out: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setLoading(true);
      const events = await googleCalendarService.getEvents('primary', new Date().toISOString(), null, 5);
      message.success(`Connection successful! Found ${events.length} upcoming events.`);
    } catch (error) {
      message.error(`Connection test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={
      <Space>
        <GoogleOutlined style={{ color: '#4285f4' }} />
        Google Calendar Integration
      </Space>
    }>
      <Alert
        message="Setup Instructions"
        description={
          <div>
            <Paragraph>
              To use Google Calendar integration, you need to set up a Google Cloud Project:
            </Paragraph>
            <ol style={{ marginLeft: '20px' }}>
              <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
              <li>Create a new project or select an existing one</li>
              <li>Enable the Google Calendar API</li>
              <li>Create credentials (API Key and OAuth 2.0 Client ID)</li>
              <li>Add your domain to authorized origins</li>
              <li>Copy the API Key and Client ID below</li>
            </ol>
          </div>
        }
        type="info"
        style={{ marginBottom: '24px' }}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSaveConfig}
        initialValues={config}
      >
        <Form.Item
          name="enabled"
          label="Enable Google Calendar Integration"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="apiKey"
          label="Google Calendar API Key"
          rules={[
            { required: config.enabled, message: 'API Key is required when integration is enabled' }
          ]}
        >
          <Input.Password
            placeholder="Enter your Google Calendar API Key"
            disabled={!config.enabled}
          />
        </Form.Item>

        <Form.Item
          name="clientId"
          label="Google OAuth 2.0 Client ID"
          rules={[
            { required: config.enabled, message: 'Client ID is required when integration is enabled' }
          ]}
        >
          <Input
            placeholder="Enter your Google OAuth 2.0 Client ID"
            disabled={!config.enabled}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading || initializing}
            disabled={!config.enabled}
          >
            Save Configuration
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      <div style={{ marginBottom: '16px' }}>
        <Title level={5}>Connection Status</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Space>
              {status.isInitialized ? (
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              ) : (
                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
              )}
              <Text>API Initialized: {status.isInitialized ? 'Yes' : 'No'}</Text>
            </Space>
          </div>
          <div>
            <Space>
              {status.isSignedIn ? (
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              ) : (
                <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
              )}
              <Text>User Signed In: {status.isSignedIn ? 'Yes' : 'No'}</Text>
            </Space>
          </div>
        </Space>
      </div>

      <Space wrap>
        {status.isInitialized && !status.isSignedIn && (
          <Button
            type="primary"
            icon={<GoogleOutlined />}
            onClick={handleSignIn}
            loading={loading}
          >
            Sign In to Google
          </Button>
        )}

        {status.isSignedIn && (
          <Button
            onClick={handleSignOut}
            loading={loading}
          >
            Sign Out
          </Button>
        )}

        {status.isInitialized && status.isSignedIn && (
          <Button
            onClick={testConnection}
            loading={loading}
          >
            Test Connection
          </Button>
        )}
      </Space>

      {calendars.length > 0 && (
        <>
          <Divider />
          <div>
            <Title level={5}>Available Calendars</Title>
            <ul>
              {calendars.map(calendar => (
                <li key={calendar.id}>
                  <Text strong>{calendar.summary}</Text>
                  {calendar.primary && <Text type="secondary"> (Primary)</Text>}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </Card>
  );
};

export default GoogleCalendarConfig;