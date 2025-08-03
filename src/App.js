// File: src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import WelcomeNew from './pages/WelcomeNew';
import About from './pages/About';
import MainHeader from './components/MainHeader';
import { ThemeProvider } from './components/ParticleBackground';
import { AnimatedSignIn } from './components/ui/sign-in';

const PageWrapper = ({ children }) => (
  <>
    <MainHeader />
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <Layout>
        {children}
      </Layout>
    </div>
  </>
);

const App = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#2563eb',
            borderRadius: 8,
          },
        }}
      >
        <Router>
          <Routes>
            {/* Auth routes - now with their own header and footer */}
            <Route path="/signin" element={<AnimatedSignIn />} />
            <Route path="/signup" element={<AnimatedSignIn />} />
            
            {/* Regular routes - with header and layout */}
            <Route path="/" element={<PageWrapper><WelcomeNew /></PageWrapper>} />
            <Route path="/welcome-old" element={<PageWrapper><Welcome /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
            <Route path="/services" element={<PageWrapper><div style={{ padding: '64px 32px', textAlign: 'center' }}><h2>Services Page - Coming Soon</h2></div></PageWrapper>} />
            <Route path="/booking" element={<PageWrapper><div style={{ padding: '64px 32px', textAlign: 'center' }}><h2>Booking Page - Coming Soon</h2></div></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><div style={{ padding: '64px 32px', textAlign: 'center' }}><h2>Contact Page - Coming Soon</h2></div></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><div style={{ padding: '64px 32px', textAlign: 'center' }}><h2>Profile Page - Coming Soon</h2></div></PageWrapper>} />
          </Routes>
        </Router>
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default App;