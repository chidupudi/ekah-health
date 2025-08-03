import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Typography, Space } from 'antd';
import { HeartOutlined, SafetyOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import ScrollExpandMedia from '../components/blocks/scroll-expansion-hero';
import { useTheme } from '../components/ParticleBackground';

const { Title, Paragraph } = Typography;

const therapyMediaContent = {
  video: {
    src: 'https://cdn.pixabay.com/video/2022/03/14/111094-688156026_large.mp4',
    poster: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1280&auto=format&fit=crop',
    background: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop',
    title: 'Healing Journey Begins',
    date: 'Professional Therapy',
    scrollToExpand: 'Scroll to discover your path to wellness',
    about: {
      overview: 'At EkahHealth, we believe that healing is a journey, not a destination. Our comprehensive mental health services are designed to support you through every step of your personal growth and recovery process.',
      conclusion: 'Take the first step towards better mental health. Our experienced therapists are here to provide you with the support, tools, and guidance you need to thrive and build resilience for life\'s challenges.'
    }
  }
};

const TherapyContent = ({ mediaType }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const currentMedia = therapyMediaContent[mediaType];

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        background: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        textColor: '#cbd5e1',
        cardBg: 'rgba(30, 41, 59, 0.8)',
        cardBorder: 'rgba(71, 85, 105, 0.3)',
        ctaBg: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        ctaTextColor: '#f8fafc',
        accentColor: '#60a5fa'
      };
    } else {
      return {
        background: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        textColor: '#4b5563',
        cardBg: 'rgba(255, 255, 255, 0.9)',
        cardBorder: 'rgba(226, 232, 240, 0.6)',
        ctaBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        ctaTextColor: 'white',
        accentColor: '#2563eb'
      };
    }
  };

  const themeStyles = getThemeStyles();

  const services = [
    {
      icon: <HeartOutlined style={{ fontSize: '48px', color: themeStyles.accentColor }} />,
      title: 'Individual Therapy',
      description: 'One-on-one sessions tailored to your personal mental health journey'
    },
    {
      icon: <TeamOutlined style={{ fontSize: '48px', color: '#10b981' }} />,
      title: 'Group Therapy',
      description: 'Connect with others who share similar experiences in a supportive environment'
    },
    {
      icon: <CalendarOutlined style={{ fontSize: '48px', color: '#8b5cf6' }} />,
      title: 'Live Video Sessions',
      description: 'Convenient online therapy sessions from the comfort of your home'
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '48px', color: '#f59e0b' }} />,
      title: 'Crisis Support',
      description: '24/7 support for mental health emergencies and urgent situations'
    }
  ];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '0 16px',
      background: themeStyles.background,
      backdropFilter: 'blur(10px)'
    }}>
      <Title 
        level={2} 
        style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '24px', 
          color: themeStyles.titleColor,
          textAlign: 'center'
        }}
      >
        Your Mental Health Matters
      </Title>
      
      <Paragraph style={{ 
        fontSize: '18px', 
        marginBottom: '32px', 
        color: themeStyles.textColor,
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto 32px auto',
        lineHeight: '1.7'
      }}>
        {currentMedia.about.overview}
      </Paragraph>

      {/* Services Grid */}
      <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
        {services.map((service, index) => (
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
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                backdropFilter: 'blur(8px)'
              }}
              bodyStyle={{ padding: '32px 24px' }}
              hoverable
            >
              <div style={{ marginBottom: '16px' }}>{service.icon}</div>
              <Title level={4} style={{ color: themeStyles.titleColor, marginBottom: '12px', fontSize: '18px' }}>
                {service.title}
              </Title>
              <Paragraph style={{ color: themeStyles.textColor, margin: 0, fontSize: '14px' }}>
                {service.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {/* CTA Section */}
      <div style={{ 
        textAlign: 'center', 
        background: themeStyles.ctaBg,
        borderRadius: '16px',
        padding: '48px 32px',
        color: themeStyles.ctaTextColor,
        marginBottom: '32px'
      }}>
        <Title level={3} style={{ color: themeStyles.ctaTextColor, marginBottom: '16px' }}>
          Ready to Start Your Healing Journey?
        </Title>
        <Paragraph style={{ 
          fontSize: '16px', 
          color: `${themeStyles.ctaTextColor}E6`, 
          marginBottom: '32px',
          maxWidth: '600px',
          margin: '0 auto 32px auto'
        }}>
          {currentMedia.about.conclusion}
        </Paragraph>
        <Space size="large" wrap>
          <Button 
            type="primary" 
            size="large" 
            style={{
              padding: '12px 32px',
              height: 'auto',
              fontSize: '16px',
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
              fontSize: '16px',
              borderColor: themeStyles.ctaTextColor,
              color: themeStyles.ctaTextColor,
              background: 'transparent'
            }}
            onClick={() => navigate('/services')}
          >
            Learn More
          </Button>
        </Space>
      </div>

      {/* Stats Section */}
      <Row gutter={[32, 32]} style={{ marginTop: '48px', textAlign: 'center' }}>
        <Col xs={24} sm={8}>
          <div>
            <Title level={2} style={{ color: themeStyles.accentColor, margin: '0 0 8px 0', fontSize: '2.5rem' }}>
              500+
            </Title>
            <Paragraph style={{ color: themeStyles.textColor, margin: 0 }}>
              Clients Helped
            </Paragraph>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div>
            <Title level={2} style={{ color: themeStyles.accentColor, margin: '0 0 8px 0', fontSize: '2.5rem' }}>
              24/7
            </Title>
            <Paragraph style={{ color: themeStyles.textColor, margin: 0 }}>
              Support Available
            </Paragraph>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div>
            <Title level={2} style={{ color: themeStyles.accentColor, margin: '0 0 8px 0', fontSize: '2.5rem' }}>
              98%
            </Title>
            <Paragraph style={{ color: themeStyles.textColor, margin: 0 }}>
              Client Satisfaction
            </Paragraph>
          </div>
        </Col>
      </Row>

      {/* Final Message */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '64px',
        padding: '32px',
        background: theme === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.8)',
        borderRadius: '12px',
        backdropFilter: 'blur(8px)'
      }}>
        <Paragraph style={{ 
          fontSize: '16px', 
          color: themeStyles.textColor, 
          margin: 0,
          fontStyle: 'italic'
        }}>
          "Taking care of your mental health is just as important as taking care of your physical health. 
          You deserve support, understanding, and the tools to thrive."
        </Paragraph>
      </div>
    </div>
  );
};

const WelcomeNew = () => {
  const [mediaType] = useState('video'); // Fixed to video only
  const currentMedia = therapyMediaContent[mediaType];

  useEffect(() => {
    window.scrollTo(0, 0);
    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, [mediaType]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        posterSrc={currentMedia.poster}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
        textBlend={true}
      >
        <TherapyContent mediaType={mediaType} />
      </ScrollExpandMedia>
    </div>
  );
};

export default WelcomeNew;