// src/components/Header.js
import React, { useState } from 'react';
import { Heart, User, Menu, X, Home, Info, Phone, Settings, LogOut, BookOpen } from 'lucide-react';
import { colors } from '../styles/colors';

const Header = ({ onMenuToggle, isMobileMenuOpen }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: colors.headerGradient,
    boxShadow: `0 4px 20px ${colors.shadowColor}`,
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)'
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: colors.lightSlateGray,
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
  };

  const navStyle = {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  };

  const navItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: colors.lightSlateGray,
    textDecoration: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '25px',
    background: colors.whiteTransparent,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: `1px solid ${colors.borderColor}`,
    fontWeight: '500'
  };

  const profileContainerStyle = {
    position: 'relative'
  };

  const profileIconStyle = {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: colors.primaryGradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: colors.lightSlateGray,
    fontWeight: 'bold',
    fontSize: '1.2rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    transition: 'transform 0.3s ease'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '55px',
    right: '0',
    background: colors.cardGradient,
    border: `1px solid ${colors.celadon}`,
    borderRadius: '15px',
    minWidth: '180px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    zIndex: 1001,
    overflow: 'hidden'
  };

  const dropdownItemStyle = {
    padding: '0.75rem 1rem',
    color: colors.lightSlateGray,
    cursor: 'pointer',
    borderBottom: `1px solid ${colors.celadon}`,
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const mobileMenuButtonStyle = {
    background: colors.whiteTransparent,
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem',
    cursor: 'pointer',
    color: colors.lightSlateGray,
    display: 'none'
  };

  // Navigation items
  const navItems = [
    { icon: Home, text: 'Home', href: '#home' },
    { icon: Info, text: 'About Us', href: '#about' },
    { icon: Phone, text: 'Contact', href: '#contact' }
  ];

  // Dropdown menu items
  const dropdownItems = [
    { icon: User, text: 'My Profile' },
    { icon: Settings, text: 'Settings' },
    { icon: BookOpen, text: 'My Courses' },
    { icon: LogOut, text: 'Logout', color: '#e74c3c' }
  ];

  // Handle nav item hover
  const handleNavItemHover = (e, isEntering) => {
    if (isEntering) {
      e.currentTarget.style.background = colors.celadon;
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
    } else {
      e.currentTarget.style.background = colors.whiteTransparent;
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }
  };

  // Handle dropdown item hover
  const handleDropdownItemHover = (e, isEntering) => {
    if (isEntering) {
      e.currentTarget.style.backgroundColor = colors.celadon;
    } else {
      e.currentTarget.style.backgroundColor = 'transparent';
    }
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .nav-desktop {
              display: none !important;
            }
            .mobile-menu-btn {
              display: flex !important;
            }
          }
        `}
      </style>
      
      <header style={headerStyle}>
        <div style={logoStyle}>
          <Heart size={32} color={colors.lightSlateGray} />
          Ekah Health
        </div>
        
        <nav style={navStyle} className="nav-desktop">
          {navItems.map((item, index) => (
            <a 
              key={index}
              href={item.href}
              style={navItemStyle}
              onMouseEnter={(e) => handleNavItemHover(e, true)}
              onMouseLeave={(e) => handleNavItemHover(e, false)}
            >
              <item.icon size={18} />
              {item.text}
            </a>
          ))}
          
          <div style={profileContainerStyle}>
            <div 
              style={profileIconStyle} 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <User size={20} />
            </div>
            
            {isProfileDropdownOpen && (
              <div style={dropdownStyle}>
                {dropdownItems.map((item, index) => (
                  <div 
                    key={index}
                    style={{
                      ...dropdownItemStyle,
                      color: item.color || colors.lightSlateGray,
                      borderBottom: index < dropdownItems.length - 1 ? `1px solid ${colors.celadon}` : 'none'
                    }}
                    onMouseEnter={(e) => handleDropdownItemHover(e, true)}
                    onMouseLeave={(e) => handleDropdownItemHover(e, false)}
                  >
                    <item.icon size={16} />
                    {item.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        <button 
          style={mobileMenuButtonStyle}
          onClick={onMenuToggle}
          className="mobile-menu-btn"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>
    </>
  );
};

export default Header;