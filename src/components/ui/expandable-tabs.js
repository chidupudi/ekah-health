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
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          borderColor: 'rgba(75, 85, 99, 0.3)',
          backdropFilter: 'blur(12px)'
        },
        tab: {
          color: '#e5e7eb',
          hoverBg: 'rgba(55, 65, 81, 0.6)'
        },
        activeTab: {
          color: activeColor || '#60a5fa',
          bg: 'rgba(59, 130, 246, 0.1)'
        },
        separator: {
          backgroundColor: 'rgba(75, 85, 99, 0.4)'
        }
      };
    } else {
      return {
        container: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: 'rgba(229, 231, 235, 0.6)',
          backdropFilter: 'blur(12px)'
        },
        tab: {
          color: '#374151',
          hoverBg: 'rgba(243, 244, 246, 0.8)'
        },
        activeTab: {
          color: activeColor || '#2563eb',
          bg: 'rgba(37, 99, 235, 0.1)'
        },
        separator: {
          backgroundColor: 'rgba(229, 231, 235, 0.6)'
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