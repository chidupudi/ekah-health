// pages/Services/index.js
import React, { useState } from 'react';
import { Tabs, Typography } from 'antd';
import { useTheme } from '../../components/ParticleBackground';
import ServicesHero from './components/ServicesHero';
import ServiceGroup from './components/ServiceGroup';
import CallToAction from './components/CallToAction';
import { servicesData, serviceGroups } from './data/servicesData';
import './Services.css';

const { Title } = Typography;

const Services = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('womens-health');

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
        containerBg: 'rgba(255, 255, 255, 0.02)',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        tabBarBg: 'rgba(255, 255, 255, 0.05)',
        tabBarBorder: 'rgba(255, 255, 255, 0.1)',
        gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)',
        containerBg: 'rgba(255, 255, 255, 0.8)',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        tabBarBg: 'rgba(255, 255, 255, 0.9)',
        tabBarBorder: 'rgba(0, 0, 0, 0.08)',
        gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      };
    }
  };

  const themeStyles = getThemeStyles();

  const tabItems = serviceGroups.map(group => ({
    key: group.id,
    label: (
      <div className="custom-tab-label">
        <span className="tab-icon">{group.icon}</span>
        <span className="tab-title">{group.title}</span>
        <span className="tab-count">{group.services.length}</span>
      </div>
    ),
    children: (
      <ServiceGroup 
        group={group} 
        services={group.services.map(id => servicesData.find(s => s.id === id))}
        theme={theme}
      />
    )
  }));

  return (
    <div 
      className="services-page"
      style={{ 
        background: themeStyles.background,
        minHeight: '100vh',
      }}
    >
      {/* Hero Section */}
      <ServicesHero theme={theme} />

      {/* Main Content */}
      <div className="services-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <div 
          className="services-tabs-wrapper"
          style={{
            background: themeStyles.containerBg,
            borderRadius: '24px',
            padding: '32px',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${themeStyles.tabBarBorder}`,
            boxShadow: theme === 'dark' 
              ? '0 20px 60px rgba(0, 0, 0, 0.3)' 
              : '0 20px 60px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className={`services-tabs ${theme === 'dark' ? 'dark-tabs' : 'light-tabs'}`}
            tabBarStyle={{
              background: themeStyles.tabBarBg,
              borderRadius: '16px',
              padding: '8px',
              marginBottom: '40px',
              border: `1px solid ${themeStyles.tabBarBorder}`,
            }}
            size="large"
            centered
          />
        </div>
      </div>

      {/* Call to Action */}
      <CallToAction theme={theme} />
    </div>
  );
};

export default Services;