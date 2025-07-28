import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Typography, Space } from 'antd';
import { HeartOutlined, SafetyOutlined, TeamOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import ScrollExpandMedia from '../components/blocks/scroll-expansion-hero';
import NavigationTabs from '../components/NavigationTabs';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';
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
  },
  image: {
    src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1280&auto=format&fit=crop',
    background: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop',
    title: 'Safe Space Therapy',
    date: 'Live Sessions Available',
    scrollToExpand: 'Scroll to explore our services',
    about: {
      overview: 'Our therapy sessions provide a safe, confidential environment where you can explore your thoughts and feelings without judgment. We offer both individual and group therapy sessions tailored to your specific needs.',
      conclusion: 'Whether you\'re dealing with anxiety, depression, trauma, or life transitions, our licensed therapists are here to help you develop coping strategies and achieve lasting positive change.'
    }
  }
};

const TherapyContent = ({ mediaType }) => {
  const navigate = useNavigate();
  const currentMedia = therapyMediaContent[mediaType];

  const services = [
    {
      icon: <HeartOutlined style={{ fontSize: '48px', color: '#3b82f6' }} />,
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      <Title 
        level={2} 
        style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '24px', 
          color: '#1f2937',
          textAlign: 'center'
        }}
      >
        Your Mental Health Matters
      </Title>
      
      <Paragraph style={{ 
        fontSize: '18px', 
        marginBottom: '32px', 
        color: '#4b5563',
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
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              bodyStyle={{ padding: '32px 24px' }}
              hoverable
            >
              <div style={{ marginBottom: '16px' }}>{service.icon}</div>
              <Title level={4} style={{ color: '#1f2937', marginBottom: '12px', fontSize: '18px' }}>
                {service.title}
              </Title>
              <Paragraph style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                {service.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {/* CTA Section */}
      <div style={{ 
        textAlign: 'center', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '48px 32px',
        color: 'white',
        marginBottom: '32px'
      }}>
        <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
          Ready to Start Your Healing Journey?
        </Title>
        <Paragraph style={{ 
          fontSize: '16px', 
          color: 'rgba(255, 255, 255, 0.9)', 
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
              backgroundColor: 'white',
              borderColor: 'white',
              color: '#667eea',
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
              borderColor: 'white',
              color: 'white',
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
            <Title level={2} style={{ color: '#2563eb', margin: '0 0 8px 0', fontSize: '2.5rem' }}>
              500+
            </Title>
            <Paragraph style={{ color: '#6b7280', margin: 0 }}>
              Clients Helped
            </Paragraph>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div>
            <Title level={2} style={{ color: '#2563eb', margin: '0 0 8px 0', fontSize: '2.5rem' }}>
              24/7
            </Title>
            <Paragraph style={{ color: '#6b7280', margin: 0 }}>
              Support Available
            </Paragraph>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div>
            <Title level={2} style={{ color: '#2563eb', margin: '0 0 8px 0', fontSize: '2.5rem' }}>
              98%
            </Title>
            <Paragraph style={{ color: '#6b7280', margin: 0 }}>
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
        background: '#f8fafc',
        borderRadius: '12px'
      }}>
        <Paragraph style={{ 
          fontSize: '16px', 
          color: '#475569', 
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
  const [mediaType, setMediaType] = useState('video');
  const currentMedia = therapyMediaContent[mediaType];
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, [mediaType]);

  const getFloatingHeaderStyle = () => {
    if (theme === 'dark') {
      return {
        background: 'rgba(17, 24, 39, 0.95)',
        borderColor: 'rgba(75, 85, 99, 0.3)',
        backdropFilter: 'blur(12px)'
      };
    } else {
      return {
        background: 'rgba(255, 255, 255, 0.95)',
        borderColor: 'rgba(229, 231, 235, 0.6)',
        backdropFilter: 'blur(12px)'
      };
    }
  };

  const floatingHeaderStyle = getFloatingHeaderStyle();

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Floating Navigation Header */}
      <div style={{ 
        position: 'fixed', 
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        ...floatingHeaderStyle,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        padding: '0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '64px',
          padding: '0 24px'
        }}>
          {/* Left Side - Brand */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              minWidth: '200px'
            }}
            onClick={() => navigate('/')}
          >
            <HeartOutlined style={{ 
              fontSize: '24px', 
              marginRight: '12px',
              color: theme === 'dark' ? '#60a5fa' : '#2563eb'
            }} />
            <span style={{ 
              fontSize: '20px', 
              fontWeight: 'bold',
              color: theme === 'dark' ? '#f3f4f6' : '#1f2937'
            }}>
              EkahHealth
            </span>
          </div>

          {/* Right Side - Navigation + Theme Toggle + Profile */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            flex: 1,
            justifyContent: 'flex-end'
          }}>
            <NavigationTabs 
              activeColor={theme === 'dark' ? '#60a5fa' : '#2563eb'}
            />
            
            <ThemeToggle />
            
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.6)' : 'rgba(243, 244, 246, 0.8)',
                color: theme === 'dark' ? '#f3f4f6' : '#1f2937'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme === 'dark' ? 'rgba(75, 85, 99, 0.8)' : 'rgba(229, 231, 235, 0.9)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = theme === 'dark' ? 'rgba(55, 65, 81, 0.6)' : 'rgba(243, 244, 246, 0.8)';
                e.target.style.transform = 'scale(1)';
              }}
              onClick={() => navigate('/profile')}
            >
              <UserOutlined style={{ fontSize: '18px' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Media Type Toggle */}
      <div style={{ 
        position: 'fixed', 
        top: '80px', 
        right: '20px', 
        zIndex: 50, 
        display: 'flex', 
        gap: '8px' 
      }}>
        <button
          onClick={() => setMediaType('video')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: mediaType === 'video' ? 'white' : 'rgba(0, 0, 0, 0.5)',
            color: mediaType === 'video' ? 'black' : 'white',
            ...(mediaType !== 'video' && { border: '1px solid rgba(255, 255, 255, 0.3)' })
          }}
        >
          Video
        </button>
        <button
          onClick={() => setMediaType('image')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: mediaType === 'image' ? 'white' : 'rgba(0, 0, 0, 0.5)',
            color: mediaType === 'image' ? 'black' : 'white',
            ...(mediaType !== 'image' && { border: '1px solid rgba(255, 255, 255, 0.3)' })
          }}
        >
          Image
        </button>
      </div>

      <ScrollExpandMedia
        mediaType={mediaType}
        mediaSrc={currentMedia.src}
        posterSrc={mediaType === 'video' ? currentMedia.poster : undefined}
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