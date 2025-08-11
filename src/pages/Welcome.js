import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Typography, Space } from 'antd';
import { HeartOutlined, SafetyOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import { useTheme } from '../components/ParticleBackground';

const { Title, Paragraph } = Typography;

const Welcome = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        containerBg: 'transparent',
        titleColor: '#ffffff',
        textColor: '#cccccc',
        cardBg: 'rgba(20, 20, 20, 0.8)',
        cardBorder: 'rgba(255, 255, 255, 0.2)',
        ctaBg: '#000000',
        ctaTextColor: '#ffffff'
      };
    } else {
      return {
        containerBg: 'transparent',
        titleColor: '#000000',
        textColor: '#333333',
        cardBg: 'rgba(255, 255, 255, 0.9)',
        cardBorder: 'rgba(0, 0, 0, 0.1)',
        ctaBg: '#000000',
        ctaTextColor: '#ffffff'
      };
    }
  };

  const themeStyles = getThemeStyles();

  const features = [
    {
      icon: <HeartOutlined style={{ fontSize: '48px', color: theme === 'dark' ? '#ffffff' : '#000000' }} />,
      title: 'Mental Wellness',
      description: 'Professional mental health support tailored to your needs'
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '48px', color: theme === 'dark' ? '#ffffff' : '#000000' }} />,
      title: 'Safe Space',
      description: 'Confidential and secure environment for your therapy sessions'
    },
    {
      icon: <TeamOutlined style={{ fontSize: '48px', color: theme === 'dark' ? '#ffffff' : '#000000' }} />,
      title: 'Expert Therapists',
      description: 'Licensed professionals dedicated to your mental health journey'
    },
    {
      icon: <CalendarOutlined style={{ fontSize: '48px', color: theme === 'dark' ? '#ffffff' : '#000000' }} />,
      title: 'Flexible Scheduling',
      description: 'Book sessions that fit your schedule and lifestyle'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: themeStyles.containerBg,
      padding: '0'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '64px 16px' 
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <Title 
            level={1} 
            style={{ 
              fontSize: '3.5rem', 
              fontWeight: 'bold', 
              color: themeStyles.titleColor, 
              marginBottom: '16px',
              lineHeight: '1.2'
            }}
          >
            Welcome to <span style={{ color: theme === 'dark' ? '#60a5fa' : '#2563eb' }}>EkahHealth</span>
          </Title>
          <Paragraph style={{ 
            fontSize: '20px', 
            color: themeStyles.textColor, 
            maxWidth: '768px', 
            margin: '0 auto', 
            lineHeight: '1.7'
          }}>
            Your journey to mental wellness starts here. We provide compassionate, 
            professional therapy services to help you navigate life's challenges and 
            discover your inner strength.
          </Paragraph>
        </div>

        {/* Features Section */}
        <Row gutter={[24, 24]} style={{ marginBottom: '64px' }}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card 
                style={{ 
                  height: '100%', 
                  textAlign: 'center',
                  background: themeStyles.cardBg,
                  border: `1px solid ${themeStyles.cardBorder}`,
                  boxShadow: theme === 'dark' 
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' 
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(8px)'
                }}
                bodyStyle={{ padding: '32px' }}
                hoverable
              >
                <div style={{ marginBottom: '16px' }}>{feature.icon}</div>
                <Title level={4} style={{ color: themeStyles.titleColor, marginBottom: '12px' }}>
                  {feature.title}
                </Title>
                <Paragraph style={{ color: themeStyles.textColor, margin: 0 }}>
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Call to Action Section */}
        <Card style={{ 
          background: themeStyles.ctaBg,
          boxShadow: theme === 'dark' 
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)' 
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: 'none',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center', padding: '48px 32px' }}>
            <Title level={2} style={{ color: themeStyles.ctaTextColor, marginBottom: '24px' }}>
              Ready to Begin Your Healing Journey?
            </Title>
            <Paragraph style={{ 
              fontSize: '18px', 
              color: themeStyles.ctaTextColor,
              opacity: 0.9,
              marginBottom: '32px', 
              maxWidth: '640px', 
              margin: '0 auto 32px auto'
            }}>
              Take the first step towards better mental health. Our experienced therapists 
              are here to provide you with the support and tools you need to thrive.
            </Paragraph>
            <Space size="large" wrap>
              <Button 
                type="primary" 
                size="large" 
                style={{
                  padding: '12px 32px',
                  height: 'auto',
                  fontSize: '18px',
                  backgroundColor: theme === 'dark' ? '#60a5fa' : 'white',
                  borderColor: theme === 'dark' ? '#60a5fa' : 'white',
                  color: theme === 'dark' ? '#1e293b' : '#667eea',
                  fontWeight: '600'
                }}
                onClick={() => navigate('/booking')}
              >
                Book a Session
              </Button>
              <Button 
                size="large" 
                style={{
                  padding: '12px 32px',
                  height: 'auto',
                  fontSize: '18px',
                  borderColor: themeStyles.ctaTextColor,
                  color: themeStyles.ctaTextColor,
                  background: 'transparent'
                }}
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </Space>
          </div>
        </Card>

        {/* Bottom Section */}
        <div style={{ textAlign: 'center', marginTop: '64px' }}>
          <Paragraph style={{ 
            color: themeStyles.textColor, 
            marginBottom: '16px',
            opacity: 0.8
          }}>
            Available 24/7 | Confidential | Professional
          </Paragraph>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: '32px',
            fontSize: '14px', 
            color: themeStyles.textColor,
            opacity: 0.7,
            flexWrap: 'wrap'
          }}>
            <span>Licensed Therapists</span>
            <span>•</span>
            <span>HIPAA Compliant</span>
            <span>•</span>
            <span>Insurance Accepted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;