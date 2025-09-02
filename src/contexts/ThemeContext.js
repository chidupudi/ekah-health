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
        const savedTheme = localStorage.getItem('admin-theme');
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
          setTheme(savedTheme);
        } else {
          // Default to dark theme for admin interface
          setTheme('dark');
          localStorage.setItem('admin-theme', 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
        setTheme('dark'); // Fallback to dark
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
      
      // Also update body class for additional styling
      document.body.className = document.body.className
        .replace(/theme-\w+/g, '') + ` theme-${theme}`;
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

  const value = {
    theme,
    isLoading,
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    getSystemTheme,
    useSystemTheme,
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