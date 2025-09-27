import React, { useState, useEffect, createContext, useContext } from 'react';
import { Particles } from './ui/particles';

// Theme Context for future dark mode support
const ThemeContext = createContext();

export const ThemeProvider = ({ children, defaultTheme = 'light' }) => {
  const [theme, setTheme] = useState(() => {
    // Try to load from localStorage first
    try {
      const savedTheme = localStorage.getItem('ekah-health-theme');
      if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        return savedTheme;
      }
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
    return defaultTheme;
  });

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      // Save to localStorage
      try {
        localStorage.setItem('ekah-health-theme', newTheme);
        // Update document attributes for CSS
        document.documentElement.setAttribute('data-theme', newTheme);
        document.body.className = document.body.className
          .replace(/\b(light|dark)-theme\b/g, '') + ` ${newTheme}-theme`;
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
      return newTheme;
    });
  };

  // Apply theme on mount and changes
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.className = document.body.className
        .replace(/\b(light|dark)-theme\b/g, '') + ` ${theme}-theme`;
      localStorage.setItem('ekah-health-theme', theme);
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [theme]);

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        background: 'linear-gradient(135deg, #0a0b0f 0%, #1a1d23 50%, #0f1117 100%)',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        accentPrimary: '#437F97',
        accentSecondary: '#EEE1B3',
        borderColor: 'rgba(67, 127, 151, 0.25)',
        cardBg: 'rgba(67, 127, 151, 0.15)',
        cardBorder: 'rgba(67, 127, 151, 0.25)',
        headerBg: 'rgba(0, 0, 0, 0.85)',
        headerBorder: 'rgba(255, 255, 255, 0.2)',
        listItemHover: 'rgba(67, 127, 151, 0.15)',
        listItemBg: 'rgba(67, 127, 151, 0.08)',
        hoverColor: '#EEE1B3',
        mutedTextColor: 'rgba(255, 255, 255, 0.6)',
        // Status colors
        successColor: '#3fb950',
        warningColor: '#f2cc60',
        errorColor: '#f85149',
        primaryColor: '#437F97',
        // Enhanced styling
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        gradientPrimary: 'linear-gradient(135deg, #437F97 0%, #EEE1B3 100%)',
        selectedBg: 'rgba(67, 127, 151, 0.25)',
        selectedBorder: '#437F97',
        containerBg: 'rgba(67, 127, 151, 0.1)',
        priceColor: '#EEE1B3'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #fafbfc 0%, rgba(238, 225, 179, 0.08) 50%, #f8fafc 100%)',
        textPrimary: '#1a202c',
        textSecondary: '#4a5568',
        accentPrimary: '#437F97',
        accentSecondary: '#EEE1B3',
        borderColor: 'rgba(67, 127, 151, 0.15)',
        cardBg: 'rgba(255, 255, 255, 0.98)',
        cardBorder: 'rgba(67, 127, 151, 0.15)',
        headerBg: 'rgba(255, 255, 255, 0.85)',
        headerBorder: 'rgba(0, 0, 0, 0.1)',
        listItemHover: 'rgba(67, 127, 151, 0.08)',
        listItemBg: 'rgba(255, 255, 255, 0.8)',
        hoverColor: '#437F97',
        mutedTextColor: '#4a5568',
        // Status colors
        successColor: '#10b981',
        warningColor: '#f59e0b',
        errorColor: '#ef4444',
        primaryColor: '#437F97',
        // Enhanced styling
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        gradientPrimary: 'linear-gradient(135deg, #437F97 0%, #EEE1B3 100%)',
        selectedBg: 'rgba(67, 127, 151, 0.1)',
        selectedBorder: '#437F97',
        containerBg: 'rgba(255, 255, 255, 0.8)',
        priceColor: '#437F97'
      };
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      isDark,
      isLight,
      getThemeStyles
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return default theme if no provider
    return {
      theme: 'light',
      setTheme: () => {},
      toggleTheme: () => {},
      isDark: false,
      isLight: true,
      getThemeStyles: () => ({
        background: 'linear-gradient(135deg, #fafbfc 0%, rgba(238, 225, 179, 0.08) 50%, #f8fafc 100%)',
        textPrimary: '#1a202c',
        textSecondary: '#4a5568',
        accentPrimary: '#437F97',
        accentSecondary: '#EEE1B3',
        borderColor: 'rgba(67, 127, 151, 0.15)',
        cardBg: 'rgba(255, 255, 255, 0.98)',
        cardBorder: 'rgba(67, 127, 151, 0.15)',
        headerBg: 'rgba(255, 255, 255, 0.85)',
        headerBorder: 'rgba(0, 0, 0, 0.1)',
        listItemHover: 'rgba(67, 127, 151, 0.08)',
        listItemBg: 'rgba(255, 255, 255, 0.8)',
        hoverColor: '#437F97',
        mutedTextColor: '#4a5568',
        // Status colors
        successColor: '#10b981',
        warningColor: '#f59e0b',
        errorColor: '#ef4444',
        primaryColor: '#437F97',
        // Enhanced styling
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        gradientPrimary: 'linear-gradient(135deg, #437F97 0%, #EEE1B3 100%)',
        selectedBg: 'rgba(67, 127, 151, 0.1)',
        selectedBorder: '#437F97',
        containerBg: 'rgba(255, 255, 255, 0.8)',
        priceColor: '#437F97'
      })
    };
  }
  return context;
};

const ParticleBackground = ({
  children,
  quantity = 80,
  ease = 40,
  size = 1.8,
  staticity = 25,
  className = '',
  particleColor = null
}) => {
  const { theme } = useTheme();
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    if (particleColor) {
      setColor(particleColor);
    } else {
      // Enhanced theme-based colors with opacity
      setColor(theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(67, 127, 151, 0.6)');
    }
  }, [theme, particleColor]);

  return (
    <div 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        overflow: 'hidden'
      }}
      className={className}
    >
      <Particles
        className=""
        quantity={quantity}
        ease={ease}
        color={color}
        size={size}
        staticity={staticity}
        refresh={false}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default ParticleBackground;