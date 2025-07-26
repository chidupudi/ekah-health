// src/App.js
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { colors } from './styles/colors';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Close mobile menu when window becomes desktop size
  useEffect(() => {
    if (windowWidth > 768 && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [windowWidth, isMobileMenuOpen]);

  const isMobile = windowWidth <= 768;

  const appStyle = {
    background: colors.accentGradient,
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  const globalStyles = `
    * {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      overflow-x: hidden;
    }
    
    @media (max-width: 768px) {
      .nav-desktop {
        display: none !important;
      }
      .mobile-menu-btn {
        display: flex !important;
      }
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: ${colors.ghostWhite};
    }
    
    ::-webkit-scrollbar-thumb {
      background: ${colors.celadon};
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: ${colors.softGoldenYellow};
    }
    
    /* Smooth animations */
    * {
      transition: all 0.3s ease;
    }
    
    /* Focus styles for accessibility */
    button:focus,
    a:focus {
      outline: 2px solid ${colors.softGoldenYellow};
      outline-offset: 2px;
    }
    
    /* Ensure text remains readable with gradients */
    .gradient-text {
      background: ${colors.primaryGradient};
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    /* Disable horizontal scroll on mobile */
    html, body {
      max-width: 100%;
      overflow-x: hidden;
    }
  `;

  return (
    <div style={appStyle}>
      <style>{globalStyles}</style>
      
      <Header 
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      
      <Sidebar 
        isMobile={isMobile}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <MainContent isMobile={isMobile} />
    </div>
  );
}

export default App;