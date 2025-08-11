// pages/Services/components/CallToAction.js
import React from 'react';
import { Typography, Button, Row, Col } from 'antd';
import { 
  PhoneOutlined, 
  WhatsAppOutlined, 
  CalendarOutlined,
  HeartOutlined,
  StarOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const CallToAction = ({ theme }) => {
  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        cardBg: 'rgba(255, 255, 255, 0.05)',
        cardBorder: 'rgba(255, 255, 255, 0.1)',
      };
    } else {
      return {
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.05) 100%)',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        cardBg: 'rgba(255, 255, 255, 0.8)',
        cardBorder: 'rgba(102, 126, 234, 0.15)',
      };
    }
  };

  const themeStyles = getThemeStyles();

  const contactMethods = [
    {
      icon: <WhatsAppOutlined style={{ fontSize: '24px' }} />,
      title: "WhatsApp",
      description: "Quick response within minutes",
      action: "Chat Now",
      color: "#25D366",
      onClick: () => {
        const phoneNumber = "+919876543210";
        const message = "Hi, I'm interested in your wellness programs. Please provide more information.";
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
      }
    },
    {
      icon: <PhoneOutlined style={{ fontSize: '24px' }} />,
      title: "Phone Call",
      description: "Direct consultation available",
      action: "Call Now",
      color: "#667eea",
      onClick: () => {
        window.location.href = "tel:+919876543210";
      }
    },
    {
      icon: <CalendarOutlined style={{ fontSize: '24px' }} />,
      title: "Schedule Meeting",
      description: "Book a convenient time slot",
      action: "Schedule",
      color: "#764ba2",
      onClick: () => {
        // Integrate with your booking system
        window.open("https://calendly.com/your-link", '_blank');
      }
    }
  ];

  const trustIndicators = [
    {
      icon: <StarOutlined />,
      value: "4.9/5",
      label: "Client Rating"
    },
    {
      icon: <HeartOutlined />,
      value: "500+",
      label: "Happy Clients"
    },
    {
      icon: <SafetyCertificateOutlined />,
      value: "5+",
      label: "Years Experience"
    }
  ];

  return (
    <div style={{ 
      padding: '80px 20px',
      background: themeStyles.background,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Decorations */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-5%',
        width: '300px',
        height: '300px',
        background: themeStyles.gradientPrimary,
        borderRadius: '50%',
        opacity: 0.1,
        filter: 'blur(60px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '-5%',
        width: '250px',
        height: '250px',
        background: themeStyles.gradientPrimary,
        borderRadius: '50%',
        opacity: 0.1,
        filter: 'blur(50px)',
      }} />

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Main CTA Section */}
        <div style={{
          background: themeStyles.cardBg,
          borderRadius: '24px',
          padding: '48px 32px',
          textAlign: 'center',
          border: `1px solid ${themeStyles.cardBorder}`,
          backdropFilter: 'blur(20px)',
          marginBottom: '48px',
        }}>
          <div style={{ marginBottom: '32px' }}>
            <Title 
              level={2} 
              style={{ 
                color: themeStyles.textPrimary,
                marginBottom: '16px',
                fontSize: '2.5rem',
                fontWeight: '700',
                background: themeStyles.gradientPrimary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Ready to Transform Your Health?
            </Title>
            
            <Paragraph style={{ 
              color: themeStyles.textSecondary, 
              fontSize: '1.2rem',
              maxWidth: '600px',
              margin: '0 auto 32px',
              lineHeight: '1.6',
            }}>
              Join hundreds of satisfied clients who have transformed their lives through 
              Dr. Gundala Abhinaya's personalized wellness programs.
            </Paragraph>

            {/* Trust Indicators */}
            <Row gutter={[24, 16]} justify="center" style={{ marginBottom: '40px' }}>
              {trustIndicators.map((indicator, index) => (
                <Col key={index} xs={8} sm={6} md={4}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      color: themeStyles.gradientPrimary.split(' ')[2].replace(')', ''),
                      fontSize: '1.5rem',
                      marginBottom: '8px',
                    }}>
                      {indicator.icon}
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: themeStyles.textPrimary,
                      lineHeight: '1',
                      marginBottom: '4px',
                    }}>
                      {indicator.value}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: themeStyles.textSecondary,
                      fontWeight: '500',
                    }}>
                      {indicator.label}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Contact Methods */}
          <Row gutter={[24, 24]} justify="center">
            {contactMethods.map((method, index) => (
              <Col key={index} xs={24} sm={8} md={6}>
                <div 
                  style={{
                    background: theme === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    border: `2px solid transparent`,
                    borderRadius: '16px',
                    padding: '24px 16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onClick={method.onClick}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = method.color;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 40px ${method.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `${method.color}15`,
                    color: method.color,
                    marginBottom: '16px',
                  }}>
                    {method.icon}
                  </div>
                  
                  <Title level={5} style={{ 
                    color: themeStyles.textPrimary,
                    marginBottom: '8px',
                    fontSize: '1.1rem',
                  }}>
                    {method.title}
                  </Title>
                  
                  <Text style={{ 
                    color: themeStyles.textSecondary,
                    fontSize: '0.9rem',
                    display: 'block',
                    marginBottom: '16px',
                  }}>
                    {method.description}
                  </Text>
                  
                  <Button
                    type="primary"
                    style={{
                      background: method.color,
                      borderColor: method.color,
                      borderRadius: '8px',
                      fontWeight: '600',
                      height: '40px',
                      minWidth: '100px',
                    }}
                  >
                    {method.action}
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* Additional Info */}
        <div style={{ textAlign: 'center' }}>
          <Row gutter={[32, 16]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <div style={{
                background: themeStyles.cardBg,
                border: `1px solid ${themeStyles.cardBorder}`,
                borderRadius: '12px',
                padding: '20px',
                backdropFilter: 'blur(10px)',
              }}>
                <Title level={5} style={{ color: themeStyles.textPrimary, marginBottom: '8px' }}>
                  Free Consultation
                </Title>
                <Text style={{ color: themeStyles.textSecondary, fontSize: '14px' }}>
                  Get personalized health assessment and program recommendations
                </Text>
              </div>
            </Col>
            
            <Col xs={24} sm={12} md={8}>
              <div style={{
                background: themeStyles.cardBg,
                border: `1px solid ${themeStyles.cardBorder}`,
                borderRadius: '12px',
                padding: '20px',
                backdropFilter: 'blur(10px)',
              }}>
                <Title level={5} style={{ color: themeStyles.textPrimary, marginBottom: '8px' }}>
                  Flexible Scheduling
                </Title>
                <Text style={{ color: themeStyles.textSecondary, fontSize: '14px' }}>
                  Online and offline sessions available to fit your lifestyle
                </Text>
              </div>
            </Col>
            
            <Col xs={24} sm={12} md={8}>
              <div style={{
                background: themeStyles.cardBg,
                border: `1px solid ${themeStyles.cardBorder}`,
                borderRadius: '12px',
                padding: '20px',
                backdropFilter: 'blur(10px)',
              }}>
                <Title level={5} style={{ color: themeStyles.textPrimary, marginBottom: '8px' }}>
                  Ongoing Support
                </Title>
                <Text style={{ color: themeStyles.textSecondary, fontSize: '14px' }}>
                  24/7 guidance and support throughout your wellness journey
                </Text>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;