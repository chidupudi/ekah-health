import React from 'react';
import { Button, Card, Row, Col, Typography, Space, Avatar } from 'antd';
import { 
  HeartOutlined, 
  SafetyOutlined, 
  TeamOutlined, 
  TrophyOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ParticleBackground';

const { Title, Paragraph } = Typography;

const About = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        titleColor: '#ffffff',
        textColor: '#cccccc',
        subtitleColor: '#a0a0a0',
        cardBg: 'rgba(20, 20, 20, 0.8)',
        cardBorder: 'rgba(255, 255, 255, 0.2)',
        heroBg: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%)',
        sectionBg: 'rgba(0, 0, 0, 0.5)',
        accentColor: '#ffffff'
      };
    } else {
      return {
        titleColor: '#000000',
        textColor: '#333333',
        subtitleColor: '#666666',
        cardBg: 'rgba(255, 255, 255, 0.9)',
        cardBorder: 'rgba(0, 0, 0, 0.1)',
        heroBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 240, 240, 0.9) 100%)',
        sectionBg: 'rgba(248, 250, 252, 0.5)',
        accentColor: '#000000'
      };
    }
  };

  const themeStyles = getThemeStyles();

  const values = [
    {
      icon: <HeartOutlined style={{ fontSize: '32px', color: themeStyles.accentColor }} />,
      title: 'Compassionate Care',
      description: 'We provide empathetic, non-judgmental support for every individual\'s unique journey.'
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '32px', color: themeStyles.accentColor }} />,
      title: 'Safe Environment',
      description: 'Creating secure spaces where clients feel comfortable exploring their thoughts and feelings.'
    },
    {
      icon: <TeamOutlined style={{ fontSize: '32px', color: themeStyles.accentColor }} />,
      title: 'Professional Excellence',
      description: 'Licensed therapists committed to maintaining the highest standards of mental health care.'
    },
    {
      icon: <TrophyOutlined style={{ fontSize: '32px', color: themeStyles.accentColor }} />,
      title: 'Proven Results',
      description: 'Evidence-based approaches that have helped thousands of clients achieve their goals.'
    }
  ];

  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Clinical Director & Licensed Psychologist',
      specialization: 'Anxiety, Depression, Trauma Recovery',
      experience: '15+ years',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Senior Therapist & LCSW',
      specialization: 'Couples Therapy, Family Counseling',
      experience: '12+ years',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Behavioral Health Specialist',
      specialization: 'Cognitive Behavioral Therapy, Mindfulness',
      experience: '10+ years',
      image: 'https://images.unsplash.com/photo-1594824388853-d0c5c2c3d9a3?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3'
    }
  ];

  const stats = [
    { number: '500+', label: 'Lives Transformed' },
    { number: '15+', label: 'Years of Experience' },
    { number: '98%', label: 'Client Satisfaction' },
    { number: '24/7', label: 'Support Available' }
  ];

  const achievements = [
    'Licensed by State Board of Mental Health',
    'HIPAA Compliant & Secure',
    'Evidence-Based Treatment Approaches',
    'Culturally Sensitive Care',
    'Flexible Scheduling Options',
    'Insurance & Self-Pay Accepted'
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{
        background: themeStyles.heroBg,
        padding: '80px 24px 60px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Title 
            level={1} 
            style={{ 
              fontSize: '3.5rem',
              fontWeight: 'bold',
              color: themeStyles.titleColor,
              marginBottom: '24px',
              lineHeight: '1.1'
            }}
          >
            About <span style={{ color: themeStyles.accentColor }}>EkahHealth</span>
          </Title>
          <Paragraph style={{
            fontSize: '20px',
            color: themeStyles.textColor,
            maxWidth: '700px',
            margin: '0 auto 40px',
            lineHeight: '1.6'
          }}>
            We are dedicated mental health professionals committed to providing compassionate, 
            evidence-based therapy services that empower individuals to overcome challenges 
            and live fulfilling lives.
          </Paragraph>
          <Button 
            type="primary"
            size="large"
            style={{
              backgroundColor: themeStyles.accentColor,
              borderColor: themeStyles.accentColor,
              padding: '12px 32px',
              height: 'auto',
              fontSize: '16px',
              fontWeight: '600'
            }}
            onClick={() => navigate('/booking')}
          >
            Start Your Journey
          </Button>
        </div>
      </div>

      {/* Our Story Section */}
      <div style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} lg={12}>
            <div style={{
              background: themeStyles.sectionBg,
              borderRadius: '20px',
              padding: '40px',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${themeStyles.cardBorder}`
            }}>
              <Title level={2} style={{ color: themeStyles.titleColor, marginBottom: '24px' }}>
                Our Story
              </Title>
              <Paragraph style={{ color: themeStyles.textColor, fontSize: '16px', lineHeight: '1.7' }}>
                Founded in 2009, EkahHealth began with a simple mission: to make quality mental health 
                care accessible to everyone. What started as a small practice has grown into a 
                comprehensive mental health center, serving hundreds of clients across diverse backgrounds.
              </Paragraph>
              <Paragraph style={{ color: themeStyles.textColor, fontSize: '16px', lineHeight: '1.7' }}>
                Our approach combines traditional therapeutic methods with innovative techniques, 
                ensuring each client receives personalized care tailored to their unique needs and goals.
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div style={{
              background: `url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format&fit=crop') center/cover`,
              height: '400px',
              borderRadius: '20px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(45deg, rgba(37, 99, 235, 0.8), rgba(59, 130, 246, 0.6))',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <Title level={1} style={{ color: 'white', fontSize: '4rem', margin: 0 }}>15+</Title>
                  <Paragraph style={{ color: 'white', fontSize: '18px', margin: 0 }}>
                    Years of Caring Service
                  </Paragraph>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Values Section */}
      <div style={{
        background: themeStyles.sectionBg,
        padding: '80px 24px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <Title level={2} style={{ color: themeStyles.titleColor, marginBottom: '16px' }}>
            Our Core Values
          </Title>
          <Paragraph style={{
            color: themeStyles.subtitleColor,
            fontSize: '18px',
            marginBottom: '60px',
            maxWidth: '600px',
            margin: '0 auto 60px'
          }}>
            The principles that guide everything we do at EkahHealth
          </Paragraph>
          
          <Row gutter={[32, 32]}>
            {values.map((value, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  style={{
                    background: themeStyles.cardBg,
                    border: `1px solid ${themeStyles.cardBorder}`,
                    borderRadius: '16px',
                    textAlign: 'center',
                    height: '100%',
                    backdropFilter: 'blur(8px)'
                  }}
                  bodyStyle={{ padding: '32px 24px' }}
                  hoverable
                >
                  <div style={{ marginBottom: '20px' }}>{value.icon}</div>
                  <Title level={4} style={{ color: themeStyles.titleColor, marginBottom: '16px' }}>
                    {value.title}
                  </Title>
                  <Paragraph style={{ color: themeStyles.textColor, margin: 0 }}>
                    {value.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Team Section */}
      <div style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Title level={2} style={{ color: themeStyles.titleColor, marginBottom: '16px' }}>
            Meet Our Expert Team
          </Title>
          <Paragraph style={{
            color: themeStyles.subtitleColor,
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Licensed professionals dedicated to your mental health journey
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {teamMembers.map((member, index) => (
            <Col xs={24} md={8} key={index}>
              <Card
                style={{
                  background: themeStyles.cardBg,
                  border: `1px solid ${themeStyles.cardBorder}`,
                  borderRadius: '20px',
                  textAlign: 'center',
                  backdropFilter: 'blur(8px)'
                }}
                bodyStyle={{ padding: '32px 24px' }}
                hoverable
              >
                <Avatar
                  size={120}
                  src={member.image}
                  style={{ marginBottom: '24px' }}
                />
                <Title level={4} style={{ color: themeStyles.titleColor, marginBottom: '8px' }}>
                  {member.name}
                </Title>
                <Paragraph style={{ 
                  color: themeStyles.accentColor, 
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  {member.role}
                </Paragraph>
                <Paragraph style={{ color: themeStyles.textColor, marginBottom: '8px' }}>
                  <strong>Specialization:</strong> {member.specialization}
                </Paragraph>
                <Paragraph style={{ color: themeStyles.subtitleColor, margin: 0 }}>
                  {member.experience} Experience
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Stats Section */}
      <div style={{
        background: `linear-gradient(135deg, ${themeStyles.accentColor}20, ${themeStyles.accentColor}10)`,
        padding: '60px 24px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Row gutter={[32, 32]} justify="center">
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <div style={{ textAlign: 'center' }}>
                  <Title 
                    level={1} 
                    style={{ 
                      color: themeStyles.accentColor, 
                      fontSize: '3rem',
                      fontWeight: 'bold',
                      margin: '0 0 8px 0'
                    }}
                  >
                    {stat.number}
                  </Title>
                  <Paragraph style={{ 
                    color: themeStyles.textColor, 
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: 0
                  }}>
                    {stat.label}
                  </Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Achievements Section */}
      <div style={{ padding: '80px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <Title level={2} style={{ color: themeStyles.titleColor, marginBottom: '16px' }}>
            Why Choose EkahHealth?
          </Title>
          <Paragraph style={{
            color: themeStyles.subtitleColor,
            fontSize: '18px'
          }}>
            Professional credentials and commitments that set us apart
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {achievements.map((achievement, index) => (
            <Col xs={24} sm={12} key={index}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                background: themeStyles.cardBg,
                borderRadius: '12px',
                border: `1px solid ${themeStyles.cardBorder}`,
                backdropFilter: 'blur(8px)'
              }}>
                <CheckCircleOutlined 
                  style={{ 
                    fontSize: '24px', 
                    color: '#10b981',
                    flexShrink: 0
                  }} 
                />
                <Paragraph style={{ 
                  color: themeStyles.textColor, 
                  margin: 0,
                  fontSize: '16px'
                }}>
                  {achievement}
                </Paragraph>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      
    </div>
  );
};

export default About;