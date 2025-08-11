// pages/Services/components/ServiceGroup.js
import React from 'react';
import { Row, Col, Typography } from 'antd';
import ServiceCard from './ServiceCard';

const { Title, Paragraph } = Typography;

const ServiceGroup = ({ group, services, theme }) => {
  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      };
    } else {
      return {
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div>
      {/* Group Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '48px',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          padding: '12px 24px',
          background: themeStyles.gradientPrimary,
          borderRadius: '25px',
          color: '#ffffff',
          fontSize: '1.1rem',
          fontWeight: '600',
        }}>
          <span style={{ fontSize: '1.5rem' }}>{group.icon}</span>
          {group.title}
        </div>
        
        <Paragraph style={{ 
          color: themeStyles.textSecondary,
          fontSize: '1.1rem',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6',
        }}>
          {group.description}
        </Paragraph>
      </div>

      {/* Services Grid */}
      <Row gutter={[24, 32]} justify="center">
        {services.map((service) => (
          <Col 
            key={service.id} 
            xs={24} 
            sm={12} 
            lg={services.length <= 2 ? 12 : 8}
            xl={services.length <= 2 ? 10 : services.length === 3 ? 8 : 6}
          >
            <ServiceCard service={service} theme={theme} />
          </Col>
        ))}
      </Row>

      {/* Group Features */}
      {group.features && (
        <div style={{ 
          marginTop: '48px',
          textAlign: 'center',
          padding: '32px',
          background: theme === 'dark' 
            ? 'rgba(255, 255, 255, 0.03)' 
            : 'rgba(255, 255, 255, 0.5)',
          borderRadius: '16px',
          border: `1px solid ${theme === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.05)'}`,
        }}>
          <Title level={4} style={{ 
            color: themeStyles.textPrimary,
            marginBottom: '24px' 
          }}>
            Why Choose {group.title}?
          </Title>
          <Row gutter={[16, 16]}>
            {group.features.map((feature, index) => (
              <Col key={index} xs={24} sm={12} md={8}>
                <div style={{
                  padding: '16px',
                  background: theme === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  height: '100%',
                }}>
                  <div style={{ 
                    color: themeStyles.textPrimary,
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}>
                    {feature.title}
                  </div>
                  <div style={{ 
                    color: themeStyles.textSecondary,
                    fontSize: '14px',
                  }}>
                    {feature.description}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default ServiceGroup;