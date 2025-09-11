import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // Default to dark theme for admin
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference from localStorage on component mount
  useEffect(() => {
    const loadTheme = () => {
      try {
        // Try to get from general app theme first, then fall back to admin theme
        const savedTheme = localStorage.getItem('ekah-health-theme') || localStorage.getItem('admin-theme');
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
          setTheme(savedTheme);
        } else {
          // Check system preference, default to light
          const systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          setTheme(systemTheme);
          localStorage.setItem('ekah-health-theme', systemTheme);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
        setTheme('light'); // Fallback to light for general app
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Apply theme to document root whenever theme changes
  useEffect(() => {
    if (!isLoading) {
      document.documentElement.setAttribute('data-theme', theme);
      
      // Update body class for CSS variables
      document.body.className = document.body.className
        .replace(/\b(light|dark)-theme\b/g, '') + ` ${theme}-theme`;
      
      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0b0f' : '#fafbfc');
      }
      
      // Store theme preference
      try {
        localStorage.setItem('ekah-health-theme', theme);
        // Also update admin theme for backward compatibility
        localStorage.setItem('admin-theme', theme);
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    }
  }, [theme, isLoading]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    try {
      localStorage.setItem('admin-theme', newTheme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const setSpecificTheme = (newTheme) => {
    if (['light', 'dark'].includes(newTheme)) {
      setTheme(newTheme);
      
      try {
        localStorage.setItem('admin-theme', newTheme);
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    }
  };

  // System preference detection (optional feature)
  const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  };

  const useSystemTheme = () => {
    const systemTheme = getSystemTheme();
    setSpecificTheme(systemTheme);
    
    // Listen for system theme changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        setSpecificTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addListener(handleChange);
      
      // Return cleanup function
      return () => mediaQuery.removeListener(handleChange);
    }
  };

  // Theme utility functions for consistent styling across the app
  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        background: 'linear-gradient(135deg, #0a0b0f 0%, #1a1d23 50%, #0f1117 100%)',
        containerBg: 'rgba(67, 127, 151, 0.12)',
        cardBg: 'rgba(67, 127, 151, 0.15)',
        cardBorder: 'rgba(67, 127, 151, 0.25)',
        listItemBg: 'rgba(67, 127, 151, 0.08)',
        listItemHover: 'rgba(67, 127, 151, 0.15)',
        selectedBg: 'rgba(238, 225, 179, 0.2)',
        selectedBorder: '#EEE1B3',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        gradientPrimary: 'linear-gradient(135deg, #437F97 0%, #5A9BB8 50%, #EEE1B3 100%)',
        priceColor: '#EEE1B3',
        shadowColor: 'rgba(67, 127, 151, 0.4)',
        accentPrimary: '#437F97',
        accentSecondary: '#EEE1B3',
        successColor: '#52c41a',
        warningColor: '#faad14',
        errorColor: '#f5222d',
        headerBg: 'rgba(0, 0, 0, 0.85)',
        headerBorder: 'rgba(255, 255, 255, 0.2)',
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #fafbfc 0%, rgba(238, 225, 179, 0.08) 50%, #f8fafc 100%)',
        containerBg: 'rgba(67, 127, 151, 0.06)',
        cardBg: 'rgba(255, 255, 255, 0.98)',
        cardBorder: 'rgba(67, 127, 151, 0.15)',
        listItemBg: 'rgba(255, 255, 255, 0.95)',
        listItemHover: 'rgba(67, 127, 151, 0.08)',
        selectedBg: 'rgba(238, 225, 179, 0.25)',
        selectedBorder: '#437F97',
        textPrimary: '#1a202c',
        textSecondary: '#4a5568',
        gradientPrimary: 'linear-gradient(135deg, #437F97 0%, #5A9BB8 50%, #EEE1B3 100%)',
        priceColor: '#437F97',
        shadowColor: 'rgba(67, 127, 151, 0.15)',
        accentPrimary: '#437F97',
        accentSecondary: '#EEE1B3',
        successColor: '#52c41a',
        warningColor: '#faad14',
        errorColor: '#f5222d',
        headerBg: 'rgba(255, 255, 255, 0.85)',
        headerBorder: 'rgba(0, 0, 0, 0.1)',
      };
    }
  };

  const value = {
    theme,
    isLoading,
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    getSystemTheme,
    useSystemTheme,
    getThemeStyles,
  };

  if (isLoading) {
    // Simple loading screen while theme is being determined
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0d1117',
        color: '#f0f6fc',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #30363d',
            borderTop: '3px solid #00d4aa',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Loading Admin Interface...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;