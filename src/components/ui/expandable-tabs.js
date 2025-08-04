import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../ParticleBackground';

const ExpandableTabs = ({ 
  tabs = [], 
  activeColor = '',
  className = '',
  onTabChange = null
}) => {
  const [hoveredTab, setHoveredTab] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const getTabPath = (title) => {
    const pathMap = {
      'Home': '/',
      'About': '/about',
      'Services': '/services',
      'Booking': '/booking',
      'Contact': '/contact',
      'Support': '/contact'
    };
    return pathMap[title] || '/';
  };

  const isActiveTab = (title) => {
    const currentPath = location.pathname;
    const tabPath = getTabPath(title);
    
    if (tabPath === '/' && currentPath === '/') return true;
    if (tabPath !== '/' && currentPath === tabPath) return true;
    return false;
  };

  const handleTabClick = (tab) => {
    if (tab.type === 'separator') return;
    
    const path = getTabPath(tab.title);
    navigate(path);
    
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleMouseEnter = (index) => {
    setHoveredTab(index);
  };

  const handleMouseLeave = () => {
    setHoveredTab(null);
  };

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        container: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(12px)'
        },
        tab: {
          color: '#ffffff',
          hoverBg: 'rgba(255, 255, 255, 0.1)'
        },
        activeTab: {
          color: activeColor || '#ffffff',
          bg: 'rgba(255, 255, 255, 0.2)'
        },
        separator: {
          backgroundColor: 'rgba(255, 255, 255, 0.3)'
        }
      };
    } else {
      return {
        container: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(12px)'
        },
        tab: {
          color: '#000000',
          hoverBg: 'rgba(0, 0, 0, 0.05)'
        },
        activeTab: {
          color: activeColor || '#000000',
          bg: 'rgba(0, 0, 0, 0.1)'
        },
        separator: {
          backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }
      };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px',
        borderRadius: '12px',
        border: '1px solid',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        zIndex: 50,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        ...themeStyles.container
      }}
      className={className}
      onMouseLeave={handleMouseLeave}
    >
      {tabs.map((tab, index) => {
        if (tab.type === 'separator') {
          return (
            <div
              key={`separator-${index}`}
              style={{
                width: '1px',
                height: '24px',
                margin: '0 8px',
                transition: 'background-color 0.2s ease',
                ...themeStyles.separator
              }}
            />
          );
        }

        const IconComponent = tab.icon;
        const isActive = isActiveTab(tab.title);
        const isHovered = hoveredTab === index;

        return (
          <button
            key={tab.title}
            onClick={() => handleTabClick(tab)}
            onMouseEnter={() => handleMouseEnter(index)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontSize: '14px',
              fontWeight: isActive ? '600' : '500',
              whiteSpace: 'nowrap',
              backgroundColor: isActive 
                ? themeStyles.activeTab.bg 
                : isHovered 
                  ? themeStyles.tab.hoverBg 
                  : 'transparent',
              color: isActive 
                ? themeStyles.activeTab.color 
                : themeStyles.tab.color,
              transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
              boxShadow: isHovered 
                ? '0 2px 4px rgba(0, 0, 0, 0.1)' 
                : 'none'
            }}
          >
            <IconComponent 
              size={18} 
              style={{
                transition: 'transform 0.2s ease',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)'
              }}
            />
            <span style={{ marginLeft: '4px' }}>
              {tab.title}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export { ExpandableTabs };