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

  // Handle nav item hover
  const handleNavItemHover = (e, isEntering) => {
    if (isEntering) {
      e.target.style.background = colors.celadon;
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
    } else {
      e.target.style.background = colors.whiteTransparent;
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }
  };

  // Handle dropdown item hover
  const handleDropdownItemHover = (e, isEntering) => {
    if (isEntering) {
      e.target.style.backgroundColor = colors.celadon;
    } else {
      e.target.style.backgroundColor = 'transparent';
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
          <a 
            href="#home" 
            style={navItemStyle}
            onMouseEnter={(e) => handleNavItemHover(e, true)}
            onMouseLeave={(e) => handleNavItemHover(e, false)}
          >
            <Home size={18} />
            Home
          </a>
          <a 
            href="#about" 
            style={navItemStyle}
            onMouseEnter={(e) => handleNavItemHover(e, true)}
            onMouseLeave={(e) => handleNavItemHover(e, false)}
          >
            <Info size={18} />
            About Us
          </a>
          <a 
            href="#contact" 
            style={navItemStyle}
            onMouseEnter={(e) => handleNavItemHover(e, true)}
            onMouseLeave={(e) => handleNavItemHover(e, false)}
          >
            <Phone size={18} />
            Contact
          </a>
          
          <div style={profileContainerStyle}>
            <div 
              style={profileIconStyle} 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <User size={20} />
            </div>
            
            {isProfileDropdownOpen && (
              <div style={dropdownStyle}>
                <div 
                  style={dropdownItemStyle}
                  onMouseEnter={(e) => handleDropdownItemHover(e, true)}
                  onMouseLeave={(e) => handleDropdownItemHover(e, false)}
                >
                  <User size={16} />
                  My Profile
                </div>
                <div 
                  style={dropdownItemStyle}
                  onMouseEnter={(e) => handleDropdownItemHover(e, true)}
                  onMouseLeave={(e) => handleDropdownItemHover(e, false)}
                >
                  <Settings size={16} />
                  Settings
                </div>
                <div 
                  style={dropdownItemStyle}
                  onMouseEnter={(e) => handleDropdownItemHover(e, true)}
                  onMouseLeave={(e) => handleDropdownItemHover(e, false)}
                >
                  <BookOpen size={16} />
                  My Courses
                </div>
                <div 
                  style={{...dropdownItemStyle, color: '#e74c3c', borderBottom: 'none'}}
                  onMouseEnter={(e) => handleDropdownItemHover(e, true)}
                  onMouseLeave={(e) => handleDropdownItemHover(e, false)}
                >
                  <LogOut size={16} />
                  Logout
                </div>
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