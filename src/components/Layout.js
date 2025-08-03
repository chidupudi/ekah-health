import React from 'react';
import ParticleBackground from './ParticleBackground';
import Footer from './Footer';
import { useTheme } from './ParticleBackground';

const Layout = ({ children }) => {
  const { theme } = useTheme();

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        textColor: '#f8fafc',
        particleColor: 'rgba(96, 165, 250, 0.3)'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        textColor: '#1e293b',
        particleColor: 'rgba(37, 99, 235, 0.3)'
      };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: themeStyles.background,
      color: themeStyles.textColor,
      transition: 'all 0.3s ease',
      position: 'relative'
    }}>
      {/* Main content area */}
      <div style={{ 
        flex: 1, 
        position: 'relative',
        zIndex: 1
      }}>
        <ParticleBackground 
          quantity={30}
          ease={50}
          size={1}
          staticity={70}
          particleColor={themeStyles.particleColor}
        >
          <div style={{ 
            minHeight: '100vh',
            position: 'relative',
            zIndex: 2
          }}>
            {children}
          </div>
        </ParticleBackground>
      </div>
      
      {/* Footer - always at the bottom, never fixed */}
      <div style={{ 
        position: 'relative',
        zIndex: 3
      }}>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;