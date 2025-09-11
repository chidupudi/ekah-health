// File: src/components/MainHeader.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartOutlined, UserOutlined, LoginOutlined, LogoutOutlined, CalendarOutlined } from '@ant-design/icons';
import { Button, Avatar, Dropdown, Menu, Tooltip } from 'antd';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { ExpandableTabs } from './ui/expandable-tabs';
import { useAuth } from '../contexts/AuthContext';

// Convert Ant Design icons to work with our component
const IconWrapper = ({ AntIcon, ...props }) => {
  return <AntIcon {...props} style={{ fontSize: '18px', ...props.style }} />;
};
 
const MainHeader = () => {
  const { theme, getThemeStyles } = useTheme();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navigationTabs = [
    { 
      title: "About", 
      value: "about",
      icon: (props) => <IconWrapper AntIcon={UserOutlined} {...props} />
    },
    { 
      title: "Services", 
      value: "services",
      icon: (props) => <IconWrapper AntIcon={HeartOutlined} {...props} />
    },
    { 
      title: "Booking", 
      value: "booking",
      icon: (props) => <IconWrapper AntIcon={HeartOutlined} {...props} />
    },
    { 
      title: "Contact", 
      value: "contact",
      icon: (props) => <IconWrapper AntIcon={HeartOutlined} {...props} />
    }
  ];

  const themeStyles = getThemeStyles();
  
  const headerStyles = {
    header: {
      background: themeStyles.headerBg,
      borderBottom: `1px solid ${themeStyles.headerBorder}`,
      backdropFilter: 'blur(20px)'
    },
    logoColor: theme === 'dark' ? themeStyles.textPrimary : themeStyles.textPrimary,
    brandColor: themeStyles.textPrimary,
    signInBg: themeStyles.accentPrimary,
    signInText: '#ffffff',
    signInHover: theme === 'dark' ? themeStyles.accentSecondary : themeStyles.accentPrimary,
    menuBg: themeStyles.cardBg,
    menuText: themeStyles.textPrimary
  };

  const profileMenu = (
    <Menu style={{ background: headerStyles.menuBg, border: `1px solid ${themeStyles.cardBorder}` }}>
      <Menu.Item 
        key="profile" 
        icon={<UserOutlined style={{ color: headerStyles.menuText }} />} 
        onClick={() => navigate('/profile')}
        style={{ color: headerStyles.menuText }}
      >
        Profile
      </Menu.Item>
      <Menu.Item 
        key="my-bookings" 
        icon={<CalendarOutlined style={{ color: headerStyles.menuText }} />} 
        onClick={() => navigate('/my-bookings')}
        style={{ color: headerStyles.menuText }}
      >
        My Bookings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="logout" 
        icon={<LogoutOutlined style={{ color: headerStyles.menuText }} />} 
        onClick={handleLogout}
        style={{ color: headerStyles.menuText }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      ...headerStyles.header,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      padding: '0'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '64px',
        padding: '0 24px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Left Side - Brand */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            minWidth: '200px'
          }}
          onClick={() => navigate('/')}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: headerStyles.logoColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            transition: 'transform 0.3s ease'
          }}>
            <HeartOutlined style={{ 
              fontSize: '22px',
              color: theme === 'dark' ? '#1f2937' : '#ffffff'
            }} />
          </div>
          <span style={{
            fontSize: '22px',
            fontWeight: '700',
            color: headerStyles.brandColor,
            letterSpacing: '-0.5px'
          }}>
            EkahHealth
          </span>
        </div>
        
        {/* Center - Navigation */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <ExpandableTabs
            tabs={navigationTabs}
            onTabClick={(tab) => navigate(`/${tab.value}`)}
            activeColor={headerStyles.brandColor}
          />
        </div>
        
        {/* Right Side - Actions */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '16px',
          minWidth: '200px',
          justifyContent: 'flex-end'
        }}>
          <ThemeToggle />
          
          {currentUser ? (
            <Dropdown overlay={profileMenu} trigger={['click']} placement="bottomRight">
              <Tooltip title={currentUser.displayName || currentUser.email}>
                <Avatar 
                  style={{
                    backgroundColor: headerStyles.signInBg,
                    color: headerStyles.signInText,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = theme === 'dark' ? '0 4px 12px rgba(255, 255, 255, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="profile" />
                  ) : (
                    currentUser.displayName 
                      ? currentUser.displayName.charAt(0).toUpperCase()
                      : currentUser.email.charAt(0).toUpperCase()
                  )}
                </Avatar>
              </Tooltip>
            </Dropdown>
          ) : (
            <Button
              type="primary"
              icon={<LoginOutlined />}
              style={{
                backgroundColor: headerStyles.signInBg,
                borderColor: headerStyles.signInBg,
                color: headerStyles.signInText,
                borderRadius: '8px',
                height: '36px',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = headerStyles.signInHover;
                e.currentTarget.style.borderColor = headerStyles.signInHover;
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = theme === 'dark' ? '0 4px 12px rgba(255, 255, 255, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = headerStyles.signInBg;
                e.currentTarget.style.borderColor = headerStyles.signInBg;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
              onClick={() => navigate('/signin')}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainHeader;