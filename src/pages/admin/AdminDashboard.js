import React, { useState, useEffect } from 'react';
import { Button, Avatar, Dropdown, Badge, Typography, Space } from 'antd';
import { 
  LogoutOutlined, 
  SettingOutlined, 
  UserOutlined, 
  BulbOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
import BookingsManagement from '../../components/admin/BookingsManagement';
import BookingsTable from '../../components/admin/BookingsTable';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

import './AdminDashboard.css';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [sessionTime, setSessionTime] = useState(0);
  const { user, logout, sessionInfo } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (sessionInfo?.loginTime) {
        const elapsed = Math.floor((Date.now() - new Date(sessionInfo.loginTime).getTime()) / 1000);
        setSessionTime(elapsed);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionInfo]);

  const formatSessionTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will be handled by the main App component
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile Settings',
      onClick: () => setActiveTab('settings')
    },
    {
      key: 'theme',
      icon: <BulbOutlined />,
      label: isDark ? 'Light Mode' : 'Dark Mode',
      onClick: toggleTheme
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Secure Logout',
      onClick: handleLogout,
      danger: true
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <BookingsManagement />;
      case 'calendar':
        return <div className="tab-content">📅 Calendar Management (Coming Soon)</div>;
      case 'patients':
        return <div className="tab-content">👥 Patient Management (Coming Soon)</div>;
      case 'settings':
        return (
          <div className="tab-content">
            <Title level={3}>⚙️ Admin Settings</Title>
            <div style={{ marginTop: '24px' }}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div className="setting-section">
                  <Title level={4}>🎨 Appearance</Title>
                  <Space>
                    <Button 
                      type={isDark ? 'primary' : 'default'} 
                      icon={<BulbOutlined />}
                      onClick={toggleTheme}
                    >
                      {isDark ? 'Dark Theme Active' : 'Switch to Dark Theme'}
                    </Button>
                  </Space>
                </div>
                
                <div className="setting-section">
                  <Title level={4}>👤 Account Info</Title>
                  <Text>Email: {user?.email}</Text><br />
                  <Text>Role: {user?.role?.toUpperCase()}</Text><br />
                  <Text>Session: {formatSessionTime(sessionTime)}</Text>
                </div>

                <div className="setting-section">
                  <Title level={4}>🔒 Security</Title>
                  <Text>Encrypted session active</Text><br />
                  <Text>Login time: {sessionInfo?.loginTime ? new Date(sessionInfo.loginTime).toLocaleString() : 'N/A'}</Text>
                </div>
              </Space>
            </div>
          </div>
        );
      default:
        return <BookingsManagement />;
    }
  };

  return (
    <div className={`admin-dashboard ${theme}-theme`}>
      <div className="admin-header">
        <div className="header-left">
          <Title level={2} style={{ margin: 0, color: isDark ? '#f0f6fc' : '#2c3e50' }}>
            🏥 EkahHealth Admin
          </Title>
          <Badge 
            status="processing" 
            text={`${isDark ? 'Dark' : 'Light'} Mode`}
            style={{ color: isDark ? '#8b949e' : '#7f8c8d' }}
          />
        </div>
        
        <div className="admin-info">
          <Space size="middle">
            <div className="session-info">
              <Text type="secondary" style={{ fontSize: '12px' }}>
                <ClockCircleOutlined /> {formatSessionTime(sessionTime)}
              </Text>
            </div>
            
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space className="user-dropdown">
                <Avatar 
                  style={{ backgroundColor: isDark ? '#00d4aa' : '#1890ff' }} 
                  icon={<UserOutlined />} 
                />
                <div className="user-info">
                  <Text strong style={{ color: isDark ? '#f0f6fc' : '#2c3e50' }}>
                    {user?.email?.split('@')[0] || 'Admin'}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                    {user?.role?.toUpperCase() || 'ADMIN'}
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </div>
      </div>

      <div className="admin-navigation">
        <button 
          className={activeTab === 'bookings' ? 'nav-active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          📅 Bookings
        </button>
        <button 
          className={activeTab === 'calendar' ? 'nav-active' : ''}
          onClick={() => setActiveTab('calendar')}
        >
          📅 Calendar
        </button>
        <button 
          className={activeTab === 'patients' ? 'nav-active' : ''}
          onClick={() => setActiveTab('patients')}
        >
          👥 Patients
        </button>
        <button 
          className={activeTab === 'settings' ? 'nav-active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      <div className="admin-content">
        {renderContent()}
      </div>
      
    </div>
  );
};

export default AdminDashboard;