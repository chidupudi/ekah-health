// File: src/components/MainHeader.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartOutlined, UserOutlined, LoginOutlined, LogoutOutlined, CalendarOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Avatar, Dropdown, Menu, Tooltip, Drawer } from 'antd';
import { useTheme } from './ParticleBackground';
import ThemeToggle from './ThemeToggle';
import { ExpandableTabs } from './ui/expandable-tabs';
import { useAuth } from '../contexts/AuthContext';

// Custom hook for responsive design
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};

// Convert Ant Design icons to work with our component
const IconWrapper = ({ AntIcon, ...props }) => {
  return <AntIcon {...props} style={{ fontSize: '18px', ...props.style }} />;
};
 
const MainHeader = () => {
  const { theme, getThemeStyles } = useTheme();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setMobileMenuVisible(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleMobileNavigation = (path) => {
    navigate(path);
    setMobileMenuVisible(false);
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
    ...(currentUser ? [{
      title: "My Bookings",
      value: "my-bookings",
      icon: (props) => <IconWrapper AntIcon={CalendarOutlined} {...props} />
    }] : []),
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
    <>
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
          padding: '0 16px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Left Side - Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              flex: '0 0 auto'
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
              letterSpacing: '-0.5px',
              display: isMobile ? 'none' : 'inline'
            }}>
              EkahHealth
            </span>
          </div>

          {/* Center - Navigation (Desktop) */}
          <div style={{
            flex: 1,
            display: isDesktop ? 'flex' : 'none',
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
            gap: '12px',
            flex: '0 0 auto'
          }}>
            {/* Desktop Actions */}
            <div style={{
              display: isDesktop ? 'flex' : 'none',
              alignItems: 'center',
              gap: '16px'
            }}>
              <ThemeToggle />

              {currentUser ? (
                <>
                  {/* Quick My Bookings Button (Desktop) */}
                  <Button
                    icon={<CalendarOutlined />}
                    onClick={() => navigate('/my-bookings')}
                    style={{
                      borderColor: headerStyles.signInBg,
                      color: headerStyles.signInBg,
                      borderRadius: '8px',
                      height: '36px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                    size="small"
                  >
                    My Bookings
                  </Button>
                  <Dropdown overlay={profileMenu} trigger={['click']} placement="bottomRight">
                    <Tooltip title={currentUser.name || currentUser.email}>
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
                          <img src={currentUser.photoURL} alt="profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                        ) : (
                          currentUser.name
                            ? currentUser.name.charAt(0).toUpperCase()
                            : currentUser.email.charAt(0).toUpperCase()
                        )}
                      </Avatar>
                    </Tooltip>
                  </Dropdown>
                </>
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

            {/* Mobile Actions */}
            <div style={{
              display: isMobile ? 'flex' : 'none',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ThemeToggle />
              {currentUser && (
                <Button
                  icon={<CalendarOutlined />}
                  onClick={() => navigate('/my-bookings')}
                  style={{
                    backgroundColor: headerStyles.signInBg,
                    borderColor: headerStyles.signInBg,
                    color: headerStyles.signInText,
                    borderRadius: '8px',
                    height: '36px',
                    width: '36px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="My Bookings"
                />
              )}
              <Button
                icon={mobileMenuVisible ? <CloseOutlined /> : <MenuOutlined />}
                onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
                style={{
                  backgroundColor: 'transparent',
                  borderColor: headerStyles.brandColor,
                  color: headerStyles.brandColor,
                  borderRadius: '8px',
                  height: '36px',
                  width: '36px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: headerStyles.logoColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HeartOutlined style={{
                fontSize: '18px',
                color: theme === 'dark' ? '#1f2937' : '#ffffff'
              }} />
            </div>
            <span style={{
              fontSize: '18px',
              fontWeight: '700',
              color: headerStyles.brandColor
            }}>
              EkahHealth
            </span>
          </div>
        }
        placement="right"
        width={320}
        open={mobileMenuVisible}
        onClose={() => setMobileMenuVisible(false)}
        styles={{
          body: {
            background: headerStyles.menuBg,
            padding: '24px 0'
          },
          header: {
            background: headerStyles.menuBg,
            borderBottom: `1px solid ${themeStyles.cardBorder}`,
            padding: '16px 24px'
          }
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Navigation Links */}
          {navigationTabs.map((tab) => (
            <Button
              key={tab.value}
              type="text"
              icon={tab.icon({ style: { fontSize: '20px', marginRight: '12px' } })}
              onClick={() => handleMobileNavigation(`/${tab.value}`)}
              style={{
                height: '56px',
                justifyContent: 'flex-start',
                color: headerStyles.menuText,
                fontSize: '16px',
                fontWeight: '500',
                borderRadius: '12px',
                margin: '0 20px',
                padding: '0 16px',
                transition: 'all 0.2s ease',
                border: `1px solid transparent`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.borderColor = headerStyles.signInBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              {tab.title}
            </Button>
          ))}

          {/* User Section */}
          {currentUser ? (
            <>
              <div style={{
                height: '1px',
                background: themeStyles.cardBorder,
                margin: '20px'
              }} />

              <div style={{
                padding: '20px',
                background: theme === 'dark' ? 'rgba(67, 127, 151, 0.15)' : 'rgba(67, 127, 151, 0.08)',
                margin: '0 20px',
                borderRadius: '16px',
                marginBottom: '12px',
                border: `1px solid ${theme === 'dark' ? 'rgba(67, 127, 151, 0.2)' : 'rgba(67, 127, 151, 0.1)'}`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <Avatar
                    size={40}
                    style={{
                      backgroundColor: headerStyles.signInBg,
                      color: headerStyles.signInText
                    }}
                  >
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="profile" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                    ) : (
                      currentUser.name
                        ? currentUser.name.charAt(0).toUpperCase()
                        : currentUser.email.charAt(0).toUpperCase()
                    )}
                  </Avatar>
                  <div>
                    <div style={{
                      color: headerStyles.menuText,
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {currentUser.name || 'User'}
                    </div>
                    <div style={{
                      color: themeStyles.textSecondary,
                      fontSize: '12px'
                    }}>
                      {currentUser.email}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="text"
                icon={<UserOutlined style={{ fontSize: '20px', marginRight: '12px' }} />}
                onClick={() => handleMobileNavigation('/profile')}
                style={{
                  height: '56px',
                  justifyContent: 'flex-start',
                  color: headerStyles.menuText,
                  fontSize: '16px',
                  fontWeight: '500',
                  borderRadius: '12px',
                  margin: '0 20px',
                  padding: '0 16px',
                  transition: 'all 0.2s ease',
                  border: `1px solid transparent`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = headerStyles.signInBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                Profile
              </Button>

              <Button
                type="text"
                danger
                icon={<LogoutOutlined style={{ fontSize: '20px', marginRight: '12px' }} />}
                onClick={handleLogout}
                style={{
                  height: '56px',
                  justifyContent: 'flex-start',
                  fontSize: '16px',
                  fontWeight: '500',
                  borderRadius: '12px',
                  margin: '0 20px',
                  padding: '0 16px',
                  transition: 'all 0.2s ease',
                  border: `1px solid transparent`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 77, 79, 0.1)';
                  e.currentTarget.style.borderColor = '#ff4d4f';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <div style={{
                height: '1px',
                background: themeStyles.cardBorder,
                margin: '20px'
              }} />
              <Button
                type="primary"
                icon={<LoginOutlined style={{ fontSize: '20px', marginRight: '12px' }} />}
                onClick={() => handleMobileNavigation('/signin')}
                style={{
                  height: '56px',
                  backgroundColor: headerStyles.signInBg,
                  borderColor: headerStyles.signInBg,
                  color: headerStyles.signInText,
                  fontSize: '16px',
                  fontWeight: '600',
                  borderRadius: '12px',
                  margin: '0 20px',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = headerStyles.signInHover;
                  e.currentTarget.style.borderColor = headerStyles.signInHover;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = headerStyles.signInBg;
                  e.currentTarget.style.borderColor = headerStyles.signInBg;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
              >
                Login
              </Button>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default MainHeader;