import React, { useState, useEffect, createContext, useContext } from 'react';
import { Particles } from './ui/particles';

// Theme Context for future dark mode support
const ThemeContext = createContext();

export const ThemeProvider = ({ children, defaultTheme = 'light' }) => {
  const [theme, setTheme] = useState(defaultTheme);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return default theme if no provider
    return { theme: 'light', setTheme: () => {}, toggleTheme: () => {} };
  }
  return context;
};

const ParticleBackground = ({ 
  children, 
  quantity = 50, 
  ease = 80, 
  size = 1.2,
  staticity = 50,
  className = '',
  particleColor = null
}) => {
  const { theme } = useTheme();
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    if (particleColor) {
      setColor(particleColor);
    } else {
      // Auto theme color
      setColor(theme === 'dark' ? '#ffffff' : '#000000');
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