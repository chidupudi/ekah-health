// File: src/components/MainHeader.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTheme } from './ParticleBackground';
import ThemeToggle from './ThemeToggle';
import { ExpandableTabs } from './ui/expandable-tabs';

// Convert Ant Design icons to work with our component
const IconWrapper = ({ AntIcon, ...props }) => {
  return <AntIcon {...props} style={{ fontSize: '18px', ...props.style }} />;
};

const MainHeader = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const navigationTabs = [
    { 
      title: "About", 
      icon: (props) => <IconWrapper AntIcon={UserOutlined} {...props} />
    },
    { 
      title: "Services", 
      icon: (props) => <IconWrapper AntIcon={HeartOutlined} {...props} />
    },
    { 
      title: "Booking", 
      icon: (props) => <IconWrapper AntIcon={HeartOutlined} {...props} />
    },
    { 
      title: "Contact", 
      icon: (props) => <IconWrapper AntIcon={HeartOutlined} {...props} />
    }
  ];

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        header: {
          background: 'rgba(0, 0, 0, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(12px)'
        },
        logo: { color: '#ffffff' },
        brand: { color: '#ffffff' },
        profileBg: 'rgba(255, 255, 255, 0.2)',
        profileHover: 'rgba(255, 255, 255, 0.3)',
        signInBg: '#ffffff',
        signInText: '#000000',
        signInHover: '#f0f0f0'
      };
    } else {
      return {
        header: {
          background: 'rgba(255, 255, 255, 0.95)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(12px)'
        },
        logo: { color: '#000000' },
        brand: { color: '#000000' },
        profileBg: 'rgba(0, 0, 0, 0.1)',
        profileHover: 'rgba(0, 0, 0, 0.2)',
        signInBg: '#000000',
        signInText: '#ffffff',
        signInHover: '#333333'
      };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      ...themeStyles.header,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      padding: '0'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '64px',
        padding: '0 24px'
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
          <HeartOutlined style={{ 
            fontSize: '24px', 
            marginRight: '12px',
            ...themeStyles.logo
          }} />
          <span style={{ 
            fontSize: '20px', 
            fontWeight: 'bold',
            ...themeStyles.brand
          }}>
            EkahHealth
          </span>
        </div>

        {/* Right Side - Navigation + Theme Toggle + Sign In + Profile */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          flex: 1,
          justifyContent: 'flex-end'
        }}>
          <ExpandableTabs 
            tabs={navigationTabs}
            activeColor={theme === 'dark' ? '#ffffff' : '#000000'}
          />
          
          <ThemeToggle />
          
          {/* Sign In Button using Ant Design Button */}
          <Button
            type="primary"
            icon={<LoginOutlined />}
            style={{
              backgroundColor: themeStyles.signInBg,
              borderColor: themeStyles.signInBg,
              color: themeStyles.signInText,
              borderRadius: '8px',
              height: '36px',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = themeStyles.signInHover;
              e.target.style.borderColor = themeStyles.signInHover;
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = theme === 'dark' ? '0 4px 12px rgba(255, 255, 255, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = themeStyles.signInBg;
              e.target.style.borderColor = themeStyles.signInBg;
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
            onClick={() => navigate('/signin')}
          >
            Login
          </Button>
          
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: themeStyles.profileBg,
              color: themeStyles.brand.color
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = themeStyles.profileHover;
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = themeStyles.profileBg;
              e.target.style.transform = 'scale(1)';
            }}
            onClick={() => navigate('/profile')}
          >
            <UserOutlined style={{ fontSize: '18px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;