import React, { useState } from 'react';
import { colors } from '../styles/colors';

const Header = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: colors.powderBlue,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: colors.lightSlateGray
  };

  const navStyle = {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  };

  const navItemStyle = {
    color: colors.lightSlateGray,
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
    cursor: 'pointer'
  };

  const navItemHoverStyle = {
    backgroundColor: colors.celadon
  };

  const profileContainerStyle = {
    position: 'relative'
  };

  const profileIconStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.softGoldenYellow,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: colors.lightSlateGray,
    fontWeight: 'bold',
    fontSize: '1.2rem'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '50px',
    right: '0',
    backgroundColor: colors.ghostWhite,
    border: `1px solid ${colors.celadon}`,
    borderRadius: '5px',
    minWidth: '150px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 1001
  };

  const dropdownItemStyle = {
    padding: '0.75rem 1rem',
    color: colors.lightSlateGray,
    cursor: 'pointer',
    borderBottom: `1px solid ${colors.celadon}`,
    transition: 'background-color 0.3s'
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle}>
        Ekah Health
      </div>
      
      <nav style={navStyle}>
        <a href="#home" style={navItemStyle}>Home</a>
        <a href="#about" style={navItemStyle}>About Us</a>
        <a href="#contact" style={navItemStyle}>Contact</a>
        
        <div style={profileContainerStyle}>
          <div style={profileIconStyle} onClick={toggleProfileDropdown}>
            P
          </div>
          
          {isProfileDropdownOpen && (
            <div style={dropdownStyle}>
              <div style={dropdownItemStyle}>My Profile</div>
              <div style={dropdownItemStyle}>Settings</div>
              <div style={dropdownItemStyle}>My Courses</div>
              <div style={dropdownItemStyle}>Logout</div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;