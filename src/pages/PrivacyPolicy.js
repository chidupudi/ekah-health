// src/pages/PrivacyPolicy.js
import React from 'react';
import { Typography, Card, Row, Col, Divider, Timeline, Alert } from 'antd';
import { 
  SafetyCertificateOutlined, 
  UserOutlined, 
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  FileProtectOutlined,
  LockOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import { useTheme } from '../components/ParticleBackground';

const { Title, Paragraph, Text } = Typography;

const PrivacyPolicy = () => {
  const { theme } = useTheme();

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
        titleColor: '#ffffff',
        textColor: '#cccccc',
        subtitleColor: '#a0a0a0',
        cardBg: 'rgba(255, 255, 255, 0.08)',
        cardBorder: 'rgba(255, 255, 255, 0.15)',
        sectionBg: 'rgba(255, 255, 255, 0.05)',
        accentColor: '#60a5fa',
        gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        iconColor: '#ffffff',
        linkColor: '#60a5fa'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f8fafc 100%)',
        titleColor: '#1f2937',
        textColor: '#374151',
        subtitleColor: '#6b7280',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(0, 0, 0, 0.08)',
        sectionBg: 'rgba(248, 250, 252, 0.8)',
        accentColor: '#2563eb',
        gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        iconColor: '#374151',
        linkColor: '#2563eb'
      };
    }
  };

  const themeStyles = getThemeStyles();

  const lastUpdated = "September 06, 2023";

  const keyPrinciples = [
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: '24px', color: themeStyles.accentColor }} />,
      title: 'Data Protection',
      description: 'We implement robust security measures to protect your personal information from unauthorized access, use, or disclosure.'
    },
    {
      icon: <UserOutlined style={{ fontSize: '24px', color: '#10b981' }} />,
      title: 'Privacy by Design',
      description: 'Privacy considerations are built into every aspect of our service design and data processing activities.'
    },
    {
      icon: <LockOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />,
      title: 'Secure Processing',
      description: 'All personal data is processed securely and in accordance with applicable privacy laws and regulations.'
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />,
      title: 'Transparent Practices',
      description: 'We maintain clear and transparent practices about how we collect, use, and protect your information.'
    }
  ];

  const dataTypes = [
    {
      category: 'Personal Information',
      icon: <UserOutlined />,
      items: ['Email address', 'First name and last name', 'Phone number', 'Address, State, Province, ZIP/Postal code, City']
    },
    {
      category: 'Usage Data',
      icon: <DatabaseOutlined />,
      items: ['IP address', 'Browser type and version', 'Pages visited', 'Time and date of visits', 'Device identifiers']
    },
    {
      category: 'Third-Party Data',
      icon: <GlobalOutlined />,
      items: ['Social media profile information', 'Account data from connected services', 'Contact list information (with permission)']
    },
    {
      category: 'Technical Data',
      icon: <FileProtectOutlined />,
      items: ['Cookies and tracking data', 'Device and browser information', 'Location data (if permitted)', 'Service usage analytics']
    }
  ];

  const rightsTimeline = [
    {
      dot: <InfoCircleOutlined style={{ color: themeStyles.accentColor }} />,
      children: (
        <div>
          <Title level={5} style={{ color: themeStyles.titleColor, margin: '0 0 8px 0' }}>
            Right to Access
          </Title>
          <Text style={{ color: themeStyles.textColor }}>
            You have the right to request copies of your personal data that we hold.
          </Text>
        </div>
      )
    },
    {
      dot: <CheckCircleOutlined style={{ color: '#10b981' }} />,
      children: (
        <div>
          <Title level={5} style={{ color: themeStyles.titleColor, margin: '0 0 8px 0' }}>
            Right to Rectification
          </Title>
          <Text style={{ color: themeStyles.textColor }}>
            You have the right to request correction of inaccurate or incomplete personal data.
          </Text>
        </div>
      )
    },
    {
      dot: <LockOutlined style={{ color: '#f59e0b' }} />,
      children: (
        <div>
          <Title level={5} style={{ color: themeStyles.titleColor, margin: '0 0 8px 0' }}>
            Right to Erasure
          </Title>
          <Text style={{ color: themeStyles.textColor }}>
            You have the right to request deletion of your personal data under certain circumstances.
          </Text>
        </div>
      )
    },
    {
      dot: <SafetyCertificateOutlined style={{ color: '#8b5cf6' }} />,
      children: (
        <div>
          <Title level={5} style={{ color: themeStyles.titleColor, margin: '0 0 8px 0' }}>
            Right to Data Portability
          </Title>
          <Text style={{ color: themeStyles.textColor }}>
            You have the right to receive your personal data in a portable format for transfer to another service.
          </Text>
        </div>
      )
    }
  ];

  const Section = ({ title, icon, children, id }) => (
    <Card
      id={id}
      style={{
        background: themeStyles.cardBg,
        border: `1px solid ${themeStyles.cardBorder}`,
        borderRadius: '16px',
        marginBottom: '24px',
        backdropFilter: 'blur(10px)',
      }}
      bodyStyle={{ padding: '32px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          padding: '12px',
          borderRadius: '12px',
          background: themeStyles.gradientPrimary,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
        <Title level={3} style={{ color: themeStyles.titleColor, margin: 0, fontSize: '24px' }}>
          {title}
        </Title>
      </div>
      {children}
    </Card>
  );

  return (
    <div style={{ 
      background: themeStyles.background, 
      minHeight: '100vh',
      padding: '40px 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header Section */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '60px',
          background: themeStyles.sectionBg,
          borderRadius: '24px',
          padding: '60px 40px',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${themeStyles.cardBorder}`
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: themeStyles.gradientPrimary,
            marginBottom: '24px'
          }}>
            <SafetyCertificateOutlined style={{ fontSize: '40px', color: 'white' }} />
          </div>
          
          <Title 
            level={1} 
            style={{ 
              color: themeStyles.titleColor,
              marginBottom: '16px',
              fontSize: '3rem',
              fontWeight: '700',
              background: themeStyles.gradientPrimary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Privacy Policy
          </Title>
          
          <Paragraph style={{ 
            color: themeStyles.subtitleColor,
            fontSize: '18px',
            maxWidth: '700px',
            margin: '0 auto 24px',
            lineHeight: '1.6'
          }}>
            At EkahHealth, we are committed to protecting your privacy and ensuring the security 
            of your personal information. This policy explains how we collect, use, and safeguard your data.
          </Paragraph>

          <Alert
            message={`Last updated: ${lastUpdated}`}
            type="info"
            showIcon
            icon={<ClockCircleOutlined />}
            style={{
              background: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              border: `1px solid ${theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.15)'}`,
              borderRadius: '12px',
              maxWidth: '400px',
              margin: '0 auto'
            }}
          />
        </div>

        {/* Key Principles */}
        <div style={{ marginBottom: '40px' }}>
          <Title level={2} style={{ 
            color: themeStyles.titleColor, 
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            Our Privacy Principles
          </Title>
          
          <Row gutter={[24, 24]}>
            {keyPrinciples.map((principle, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  style={{
                    background: themeStyles.cardBg,
                    border: `1px solid ${themeStyles.cardBorder}`,
                    borderRadius: '16px',
                    height: '100%',
                    textAlign: 'center',
                    backdropFilter: 'blur(8px)'
                  }}
                  bodyStyle={{ padding: '24px' }}
                  hoverable
                >
                  <div style={{ marginBottom: '16px' }}>{principle.icon}</div>
                  <Title level={5} style={{ color: themeStyles.titleColor, marginBottom: '12px' }}>
                    {principle.title}
                  </Title>
                  <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                    {principle.description}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Information We Collect */}
        <Section 
          id="information-collection"
          title="Information We Collect" 
          icon={<DatabaseOutlined style={{ fontSize: '24px' }} />}
        >
          <Paragraph style={{ color: themeStyles.textColor, fontSize: '16px', marginBottom: '24px' }}>
            We collect information that you provide directly to us, information we obtain automatically 
            when you use our services, and information from third-party sources with your consent.
          </Paragraph>

          <Row gutter={[24, 24]}>
            {dataTypes.map((dataType, index) => (
              <Col xs={24} md={12} key={index}>
                <div style={{
                  background: themeStyles.sectionBg,
                  borderRadius: '12px',
                  padding: '20px',
                  border: `1px solid ${themeStyles.cardBorder}`,
                  height: '100%'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ color: themeStyles.accentColor, fontSize: '20px' }}>
                      {dataType.icon}
                    </div>
                    <Title level={5} style={{ color: themeStyles.titleColor, margin: 0 }}>
                      {dataType.category}
                    </Title>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {dataType.items.map((item, itemIndex) => (
                      <div key={itemIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircleOutlined style={{ color: '#10b981', fontSize: '12px' }} />
                        <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                          {item}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Section>

        {/* How We Use Your Information */}
        <Section 
          id="information-usage"
          title="How We Use Your Information" 
          icon={<FileProtectOutlined style={{ fontSize: '24px' }} />}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <div style={{
                background: themeStyles.sectionBg,
                borderRadius: '12px',
                padding: '24px',
                border: `1px solid ${themeStyles.cardBorder}`,
                height: '100%'
              }}>
                <Title level={5} style={{ color: themeStyles.titleColor, marginBottom: '16px' }}>
                  Service Provision
                </Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Text style={{ color: themeStyles.textColor }}>• Provide and maintain our health services</Text>
                  <Text style={{ color: themeStyles.textColor }}>• Manage your account and user registration</Text>
                  <Text style={{ color: themeStyles.textColor }}>• Process appointments and consultations</Text>
                  <Text style={{ color: themeStyles.textColor }}>• Monitor usage and improve service quality</Text>
                </div>
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              <div style={{
                background: themeStyles.sectionBg,
                borderRadius: '12px',
                padding: '24px',
                border: `1px solid ${themeStyles.cardBorder}`,
                height: '100%'
              }}>
                <Title level={5} style={{ color: themeStyles.titleColor, marginBottom: '16px' }}>
                  Communication & Marketing
                </Title>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Text style={{ color: themeStyles.textColor }}>• Send service updates and notifications</Text>
                  <Text style={{ color: themeStyles.textColor }}>• Provide customer support</Text>
                  <Text style={{ color: themeStyles.textColor }}>• Send promotional materials (with consent)</Text>
                  <Text style={{ color: themeStyles.textColor }}>• Conduct research and analytics</Text>
                </div>
              </div>
            </Col>
          </Row>
        </Section>

        {/* Data Sharing */}
        <Section 
          id="data-sharing"
          title="Information Sharing" 
          icon={<TeamOutlined style={{ fontSize: '24px' }} />}
        >
          <Paragraph style={{ color: themeStyles.textColor, fontSize: '16px', marginBottom: '24px' }}>
            We may share your personal information in the following situations:
          </Paragraph>

          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12} md={8}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'white',
                  fontSize: '24px'
                }}>
                  <TeamOutlined />
                </div>
                <Title level={5} style={{ color: themeStyles.titleColor, marginBottom: '8px' }}>
                  Service Providers
                </Title>
                <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                  Third-party companies that help us provide our services
                </Text>
              </div>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'white',
                  fontSize: '24px'
                }}>
                  <GlobalOutlined />
                </div>
                <Title level={5} style={{ color: themeStyles.titleColor, marginBottom: '8px' }}>
                  Business Transfers
                </Title>
                <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                  In connection with mergers, acquisitions, or asset transfers
                </Text>
              </div>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'white',
                  fontSize: '24px'
                }}>
                  <SafetyCertificateOutlined />
                </div>
                <Title level={5} style={{ color: themeStyles.titleColor, marginBottom: '8px' }}>
                  Legal Requirements
                </Title>
                <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                  When required by law or to protect rights and safety
                </Text>
              </div>
            </Col>
          </Row>
        </Section>

        {/* Your Rights */}
        <Section 
          id="your-rights"
          title="Your Privacy Rights" 
          icon={<SafetyCertificateOutlined style={{ fontSize: '24px' }} />}
        >
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
              <Title level={4} style={{ color: themeStyles.titleColor, marginBottom: '20px' }}>
                What You Can Do
              </Title>
              <Timeline items={rightsTimeline} />
            </Col>
            
            <Col xs={24} md={12}>
              <div style={{
                background: themeStyles.sectionBg,
                borderRadius: '16px',
                padding: '24px',
                border: `1px solid ${themeStyles.cardBorder}`,
                height: 'fit-content'
              }}>
                <Title level={4} style={{ color: themeStyles.titleColor, marginBottom: '16px' }}>
                  How to Exercise Your Rights
                </Title>
                <Paragraph style={{ color: themeStyles.textColor, marginBottom: '20px' }}>
                  To exercise any of these rights, please contact us using the information provided below. 
                  We will respond to your request within 30 days.
                </Paragraph>
                
                <Alert
                  message="Important Note"
                  description="We may need to verify your identity before processing certain requests to protect your personal information."
                  type="warning"
                  showIcon
                  style={{
                    background: theme === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
                    border: `1px solid ${theme === 'dark' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.15)'}`,
                    borderRadius: '8px'
                  }}
                />
              </div>
            </Col>
          </Row>
        </Section>

        {/* Security */}
        <Section 
          id="security"
          title="Data Security" 
          icon={<LockOutlined style={{ fontSize: '24px' }} />}
        >
          <Paragraph style={{ color: themeStyles.textColor, fontSize: '16px', marginBottom: '24px' }}>
            We implement appropriate technical and organizational measures to protect your personal data 
            against unauthorized access, alteration, disclosure, or destruction.
          </Paragraph>

          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  color: 'white'
                }}>
                  <LockOutlined />
                </div>
                <Text style={{ color: themeStyles.titleColor, fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Encryption
                </Text>
                <Text style={{ color: themeStyles.textColor, fontSize: '12px' }}>
                  Data encryption in transit and at rest
                </Text>
              </div>
            </Col>

            <Col xs={24} sm={8}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  color: 'white'
                }}>
                  <SafetyCertificateOutlined />
                </div>
                <Text style={{ color: themeStyles.titleColor, fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Access Control
                </Text>
                <Text style={{ color: themeStyles.textColor, fontSize: '12px' }}>
                  Strict access controls and authentication
                </Text>
              </div>
            </Col>

            <Col xs={24} sm={8}>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  color: 'white'
                }}>
                  <SafetyCertificateOutlined />
                </div>
                <Text style={{ color: themeStyles.titleColor, fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Regular Audits
                </Text>
                <Text style={{ color: themeStyles.textColor, fontSize: '12px' }}>
                  Regular security audits and monitoring
                </Text>
              </div>
            </Col>
          </Row>
        </Section>

        {/* Contact Information */}
        <Section 
          id="contact"
          title="Contact Us" 
          icon={<MailOutlined style={{ fontSize: '24px' }} />}
        >
          <Paragraph style={{ color: themeStyles.textColor, fontSize: '16px', marginBottom: '24px' }}>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us:
          </Paragraph>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: themeStyles.sectionBg,
                borderRadius: '12px',
                border: `1px solid ${themeStyles.cardBorder}`
              }}>
                <MailOutlined style={{ fontSize: '20px', color: themeStyles.accentColor }} />
                <div>
                  <Text style={{ color: themeStyles.titleColor, fontWeight: '600', display: 'block' }}>
                    Email
                  </Text>
                  <Text style={{ color: themeStyles.linkColor, fontSize: '14px' }}>
                    hello@ekahhealth.com
                  </Text>
                </div>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: themeStyles.sectionBg,
                borderRadius: '12px',
                border: `1px solid ${themeStyles.cardBorder}`
              }}>
                <PhoneOutlined style={{ fontSize: '20px', color: themeStyles.accentColor }} />
                <div>
                  <Text style={{ color: themeStyles.titleColor, fontWeight: '600', display: 'block' }}>
                    Phone
                  </Text>
                  <Text style={{ color: themeStyles.linkColor, fontSize: '14px' }}>
                    +91 63617 43098
                  </Text>
                </div>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: themeStyles.sectionBg,
                borderRadius: '12px',
                border: `1px solid ${themeStyles.cardBorder}`
              }}>
                <GlobalOutlined style={{ fontSize: '20px', color: themeStyles.accentColor }} />
                <div>
                  <Text style={{ color: themeStyles.titleColor, fontWeight: '600', display: 'block' }}>
                    Website
                  </Text>
                  <Text style={{ color: themeStyles.linkColor, fontSize: '14px' }}>
                    www.ekahhealth.com
                  </Text>
                </div>
              </div>
            </Col>
          </Row>

          <Divider style={{ borderColor: themeStyles.cardBorder }} />

          <div style={{
            background: themeStyles.sectionBg,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${themeStyles.cardBorder}`,
            textAlign: 'center'
          }}>
            <EnvironmentOutlined style={{ fontSize: '24px', color: themeStyles.accentColor, marginBottom: '8px' }} />
            <Text style={{ color: themeStyles.titleColor, fontWeight: '600', display: 'block', marginBottom: '4px' }}>
              Our Location
            </Text>
            <Text style={{ color: themeStyles.textColor }}>
              Karnataka, India
            </Text>
          </div>
        </Section>

        {/* Footer Note */}
        <div style={{
          textAlign: 'center',
          background: themeStyles.sectionBg,
          borderRadius: '16px',
          padding: '32px',
          border: `1px solid ${themeStyles.cardBorder}`,
          backdropFilter: 'blur(10px)'
        }}>
          <Text style={{ color: themeStyles.subtitleColor, fontSize: '14px' }}>
            This privacy policy is effective as of {lastUpdated} and will remain in effect except with respect 
            to any changes in its provisions in the future, which will be in effect immediately after being 
            posted on this page. We reserve the right to update or change our Privacy Policy at any time.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;