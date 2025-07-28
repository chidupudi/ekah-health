import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartOutlined, UserOutlined } from '@ant-design/icons';
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
          background: 'rgba(17, 24, 39, 0.95)',
          borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
          backdropFilter: 'blur(12px)'
        },
        logo: { color: '#60a5fa' },
        brand: { color: '#f3f4f6' },
        profileBg: 'rgba(55, 65, 81, 0.6)',
        profileHover: 'rgba(75, 85, 99, 0.8)'
      };
    } else {
      return {
        header: {
          background: 'rgba(255, 255, 255, 0.95)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.6)',
          backdropFilter: 'blur(12px)'
        },
        logo: { color: '#2563eb' },
        brand: { color: '#1f2937' },
        profileBg: 'rgba(243, 244, 246, 0.8)',
        profileHover: 'rgba(229, 231, 235, 0.9)'
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

        {/* Right Side - Navigation + Theme Toggle + Profile */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          flex: 1,
          justifyContent: 'flex-end'
        }}>
          <ExpandableTabs 
            tabs={navigationTabs}
            activeColor={theme === 'dark' ? '#60a5fa' : '#2563eb'}
          />
          
          <ThemeToggle />
          
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