// src/pages/TermsConditions.js
import React from 'react';
import { Typography, Card, Row, Col, Divider, Timeline, Alert, List } from 'antd';
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
  DatabaseOutlined,
  ExclamationCircleOutlined,
  CreditCardOutlined,
  CustomerServiceOutlined,
  BookOutlined,
  WarningOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { useTheme } from '../components/ParticleBackground';

const { Title, Paragraph, Text } = Typography;

const TermsConditions = () => {
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
  const effectiveDate = "September 06, 2023";

  const keyPrinciples = [
    {
      icon: <BookOutlined style={{ fontSize: '24px', color: themeStyles.accentColor }} />,
      title: 'Service Agreement',
      description: 'Clear terms governing the use of our health and wellness services and platform.'
    },
    {
      icon: <UserOutlined style={{ fontSize: '24px', color: '#10b981' }} />,
      title: 'User Responsibilities',
      description: 'Guidelines for appropriate use and responsibilities when using our services.'
    },
    {
      icon: <CreditCardOutlined style={{ fontSize: '24px', color: '#f59e0b' }} />,
      title: 'Payment Terms',
      description: 'Transparent pricing, billing, and refund policies for all our services.'
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />,
      title: 'Legal Protection',
      description: 'Mutual rights and obligations to ensure fair and safe service delivery.'
    }
  ];

  const serviceTerms = [
    {
      title: 'Service Availability',
      icon: <GlobalOutlined />,
      items: [
        'Services are available 24/7 with scheduled maintenance windows',
        'We strive for 99.9% uptime but cannot guarantee uninterrupted service',
        'Emergency support available for urgent health-related matters',
        'Service interruptions will be communicated in advance when possible'
      ]
    },
    {
      title: 'User Eligibility',
      icon: <UserOutlined />,
      items: [
        'Users must be 18 years or older, or have parental consent',
        'Accurate personal and health information must be provided',
        'Users must have legal capacity to enter into binding agreements',
        'Prohibited users include competitors and those violating terms'
      ]
    },
    {
      title: 'Health Services',
      icon: <CustomerServiceOutlined />,
      items: [
        'Services are for wellness and preventive care, not emergency treatment',
        'Professional medical advice should be sought for serious conditions',
        'We do not replace your primary healthcare provider relationship',
        'Treatment plans are suggestions and require your informed consent'
      ]
    },
    {
      title: 'Payment & Billing',
      icon: <CreditCardOutlined />,
      items: [
        'All fees are clearly displayed before service confirmation',
        'Payment is required before accessing premium services',
        'Refunds available within 7 days for unused services',
        'Automatic billing for subscription services with clear notice'
      ]
    }
  ];

  const prohibitedUses = [
    'Using our services for any unlawful or unauthorized purpose',
    'Transmitting viruses, malware, or other harmful code',
    'Attempting to gain unauthorized access to our systems',
    'Impersonating another person or entity',
    'Sharing account credentials with unauthorized users',
    'Using services to harass, abuse, or harm another person',
    'Collecting user data without explicit consent',
    'Reverse engineering or copying our proprietary technology'
  ];

  const liabilityTimeline = [
    {
      dot: <InfoCircleOutlined style={{ color: themeStyles.accentColor }} />,
      children: (
        <div>
          <Title level={5} style={{ color: themeStyles.titleColor, margin: '0 0 8px 0' }}>
            Service Limitations
          </Title>
          <Text style={{ color: themeStyles.textColor }}>
            Our services are provided "as is" without warranties of any kind, express or implied.
          </Text>
        </div>
      )
    },
    {
      dot: <ExclamationCircleOutlined style={{ color: '#f59e0b' }} />,
      children: (
        <div>
          <Title level={5} style={{ color: themeStyles.titleColor, margin: '0 0 8px 0' }}>
            Limitation of Liability
          </Title>
          <Text style={{ color: themeStyles.textColor }}>
            We are not liable for indirect, incidental, or consequential damages arising from service use.
          </Text>
        </div>
      )
    },
    {
      dot: <SafetyCertificateOutlined style={{ color: '#10b981' }} />,
      children: (
        <div>
          <Title level={5} style={{ color: themeStyles.titleColor, margin: '0 0 8px 0' }}>
            Indemnification
          </Title>
          <Text style={{ color: themeStyles.textColor }}>
            Users agree to indemnify us against claims arising from their use of our services.
          </Text>
        </div>
      )
    },
    {
      dot: <LockOutlined style={{ color: '#8b5cf6' }} />,
      children: (
        <div>
          <Title level={5} style={{ color: themeStyles.titleColor, margin: '0 0 8px 0' }}>
            Dispute Resolution
          </Title>
          <Text style={{ color: themeStyles.textColor }}>
            Disputes will be resolved through arbitration in Karnataka, India under Indian law.
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
            <FileProtectOutlined style={{ fontSize: '40px', color: 'white' }} />
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
            Terms & Conditions
          </Title>
          
          <Paragraph style={{ 
            color: themeStyles.subtitleColor,
            fontSize: '18px',
            maxWidth: '700px',
            margin: '0 auto 24px',
            lineHeight: '1.6'
          }}>
            These terms and conditions govern your use of EkahHealth services and website. 
            Please read them carefully as they contain important information about your rights and obligations.
          </Paragraph>

          <Row gutter={[16, 16]} justify="center">
            <Col>
              <Alert
                message={`Last updated: ${lastUpdated}`}
                type="info"
                showIcon
                icon={<ClockCircleOutlined />}
                style={{
                  background: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                  border: `1px solid ${theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.15)'}`,
                  borderRadius: '12px'
                }}
              />
            </Col>
            <Col>
              <Alert
                message={`Effective: ${effectiveDate}`}
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
                style={{
                  background: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                  border: `1px solid ${theme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.15)'}`,
                  borderRadius: '12px'
                }}
              />
            </Col>
          </Row>
        </div>

        {/* Key Principles */}
        <div style={{ marginBottom: '40px' }}>
          <Title level={2} style={{ 
            color: themeStyles.titleColor, 
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            Key Terms Overview
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

        {/* Acceptance of Terms */}
        <Section 
          id="acceptance"
          title="Acceptance of Terms" 
          icon={<CheckCircleOutlined style={{ fontSize: '24px' }} />}
        >
          <Paragraph style={{ color: themeStyles.textColor, fontSize: '16px', marginBottom: '20px' }}>
            By accessing and using EkahHealth services, you accept and agree to be bound by the terms 
            and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </Paragraph>
          
          <Row gutter={[24, 16]}>
            <Col xs={24} md={8}>
              <div style={{
                background: themeStyles.sectionBg,
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${themeStyles.cardBorder}`,
                textAlign: 'center'
              }}>
                <CheckCircleOutlined style={{ fontSize: '32px', color: '#10b981', marginBottom: '12px' }} />
                <Title level={5} style={{ color: themeStyles.titleColor, marginBottom: '8px' }}>
                  Agreement Binding
                </Title>
                <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                  These terms are legally binding upon acceptance
                </Text>
              </div>
            </Col>
            
            <Col xs={24} md={8}>
              <div style={{
                background: themeStyles.sectionBg,
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${themeStyles.cardBorder}`,
                textAlign: 'center'
              }}>
                <UserOutlined style={{ fontSize: '32px', color: themeStyles.accentColor, marginBottom: '12px' }} />
                <Title level={5} style={{ color: themeStyles.titleColor, marginBottom: '8px' }}>
                  User Consent
                </Title>
                <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                  Continued use implies ongoing consent to these terms
                </Text>
              </div>
            </Col>
            
            <Col xs={24} md={8}>
              <div style={{
                background: themeStyles.sectionBg,
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${themeStyles.cardBorder}`,
                textAlign: 'center'
              }}>
                <ClockCircleOutlined style={{ fontSize: '32px', color: '#f59e0b', marginBottom: '12px' }} />
                <Title level={5} style={{ color: themeStyles.titleColor, marginBottom: '8px' }}>
                  Updates Notification
                </Title>
                <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                  We will notify you of any significant changes
                </Text>
              </div>
            </Col>
          </Row>
        </Section>

        {/* Service Terms */}
        <Section 
          id="service-terms"
          title="Service Terms & Conditions" 
          icon={<ShoppingOutlined style={{ fontSize: '24px' }} />}
        >
          <Paragraph style={{ color: themeStyles.textColor, fontSize: '16px', marginBottom: '24px' }}>
            Our services are subject to the following terms and conditions:
          </Paragraph>

          <Row gutter={[24, 24]}>
            {serviceTerms.map((term, index) => (
              <Col xs={24} md={12} key={index}>
                <div style={{
                  background: themeStyles.sectionBg,
                  borderRadius: '12px',
                  padding: '24px',
                  border: `1px solid ${themeStyles.cardBorder}`,
                  height: '100%'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ color: themeStyles.accentColor, fontSize: '24px' }}>
                      {term.icon}
                    </div>
                    <Title level={5} style={{ color: themeStyles.titleColor, margin: 0 }}>
                      {term.title}
                    </Title>
                  </div>
                  <List
                    size="small"
                    dataSource={term.items}
                    renderItem={(item) => (
                      <List.Item style={{ padding: '4px 0', border: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <CheckCircleOutlined style={{ color: '#10b981', fontSize: '12px', marginTop: '4px', flexShrink: 0 }} />
                          <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                            {item}
                          </Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Section>

        {/* Prohibited Uses */}
        <Section 
          id="prohibited-uses"
          title="Prohibited Uses" 
          icon={<WarningOutlined style={{ fontSize: '24px' }} />}
        >
          <Alert
            message="Important Notice"
            description="The following activities are strictly prohibited and may result in immediate termination of services."
            type="warning"
            showIcon
            style={{
              background: theme === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
              border: `1px solid ${theme === 'dark' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.15)'}`,
              borderRadius: '12px',
              marginBottom: '24px'
            }}
          />

          <Row gutter={[16, 16]}>
            {prohibitedUses.map((use, index) => (
              <Col xs={24} sm={12} key={index}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px',
                  background: themeStyles.sectionBg,
                  borderRadius: '8px',
                  border: `1px solid ${themeStyles.cardBorder}`
                }}>
                  <ExclamationCircleOutlined style={{ color: '#ef4444', fontSize: '16px', marginTop: '2px', flexShrink: 0 }} />
                  <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                    {use}
                  </Text>
                </div>
              </Col>
            ))}
          </Row>
        </Section>

        {/* Payment Terms */}
        <Section 
          id="payment-terms"
          title="Payment Terms & Refunds" 
          icon={<CreditCardOutlined style={{ fontSize: '24px' }} />}
        >
          <Row gutter={[32, 24]}>
            <Col xs={24} md={12}>
              <Title level={4} style={{ color: themeStyles.titleColor, marginBottom: '16px' }}>
                Payment Policy
              </Title>
              <div style={{
                background: themeStyles.sectionBg,
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${themeStyles.cardBorder}`
              }}>
                <List
                  size="small"
                  dataSource={[
                    'All payments are processed securely through encrypted channels',
                    'Prices are displayed in Indian Rupees (INR) and include applicable taxes',
                    'Payment is required before accessing premium services',
                    'We accept major credit cards, debit cards, and digital wallets',
                    'Subscription services are billed automatically',
                    'Failed payments may result in service suspension'
                  ]}
                  renderItem={(item) => (
                    <List.Item style={{ padding: '8px 0', border: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CreditCardOutlined style={{ color: themeStyles.accentColor, fontSize: '14px', marginTop: '2px', flexShrink: 0 }} />
                        <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                          {item}
                        </Text>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              <Title level={4} style={{ color: themeStyles.titleColor, marginBottom: '16px' }}>
                Refund Policy
              </Title>
              <div style={{
                background: themeStyles.sectionBg,
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${themeStyles.cardBorder}`
              }}>
                <List
                  size="small"
                  dataSource={[
                    'Refunds are available within 7 days for unused services',
                    'Partial refunds may be available for multi-session packages',
                    'Refund requests must be submitted in writing via email',
                    'Processing time for refunds is 7-14 business days',
                    'Some services may be non-refundable as clearly marked',
                    'Refunds are processed to the original payment method'
                  ]}
                  renderItem={(item) => (
                    <List.Item style={{ padding: '8px 0', border: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CheckCircleOutlined style={{ color: '#10b981', fontSize: '14px', marginTop: '2px', flexShrink: 0 }} />
                        <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                          {item}
                        </Text>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Col>
          </Row>
        </Section>

        {/* Liability & Disclaimers */}
        <Section 
          id="liability"
          title="Liability & Disclaimers" 
          icon={<SafetyCertificateOutlined style={{ fontSize: '24px' }} />}
        >
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
              <Title level={4} style={{ color: themeStyles.titleColor, marginBottom: '20px' }}>
                Limitation of Liability
              </Title>
              <Timeline items={liabilityTimeline} />
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
                  Medical Disclaimer
                </Title>
                <Paragraph style={{ color: themeStyles.textColor, marginBottom: '16px', fontSize: '14px' }}>
                  Our services are for informational and wellness purposes only. They do not constitute 
                  medical advice, diagnosis, or treatment. Always consult with qualified healthcare 
                  professionals for medical concerns.
                </Paragraph>
                
                <Alert
                  message="Emergency Situations"
                  description="For medical emergencies, call local emergency services immediately. Do not rely on our services for emergency medical care."
                  type="error"
                  showIcon
                  style={{
                    background: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                    border: `1px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.15)'}`,
                    borderRadius: '8px'
                  }}
                />
              </div>
            </Col>
          </Row>
        </Section>

        {/* Intellectual Property */}
        <Section 
          id="intellectual-property"
          title="Intellectual Property" 
          icon={<LockOutlined style={{ fontSize: '24px' }} />}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
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
                  <LockOutlined />
                </div>
                <Title level={5} style={{ color: themeStyles.titleColor, marginBottom: '8px' }}>
                  Our Content
                </Title>
                <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                  All content, trademarks, and intellectual property are owned by EkahHealth
                </Text>
              </div>
            </Col>

            <Col xs={24} md={8}>
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
                  <UserOutlined />
                </div>
                <Title level={5} style={{ color: themeStyles.titleColor, marginBottom: '8px' }}>
                  User Content
                </Title>
                <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                  You retain ownership of content you create but grant us license to use it
                </Text>
              </div>
            </Col>

            <Col xs={24} md={8}>
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
                  <ExclamationCircleOutlined />
                </div>
                <Title level={5} style={{ color: themeStyles.titleColor, marginBottom: '8px' }}>
                  Restrictions
                </Title>
                <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                  Reproduction, distribution, or modification of our content is prohibited
                </Text>
              </div>
            </Col>
          </Row>
        </Section>

        {/* Termination */}
        <Section 
          id="termination"
          title="Termination of Services" 
          icon={<ExclamationCircleOutlined style={{ fontSize: '24px' }} />}
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
                  By EkahHealth
                </Title>
                <List
                  size="small"
                  dataSource={[
                    'Violation of these terms and conditions',
                    'Fraudulent or suspicious activity',
                    'Non-payment of fees after grace period',
                    'Abuse of staff or other users',
                    'Legal or regulatory requirements'
                  ]}
                  renderItem={(item) => (
                    <List.Item style={{ padding: '4px 0', border: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <ExclamationCircleOutlined style={{ color: '#ef4444', fontSize: '12px', marginTop: '2px', flexShrink: 0 }} />
                        <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                          {item}
                        </Text>
                      </div>
                    </List.Item>
                  )}
                />
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
                  By User
                </Title>
                <List
                  size="small"
                  dataSource={[
                    'Cancel account at any time through account settings',
                    'Email termination request to our support team',
                    'Data export available for 30 days after termination',
                    'Unused service credits may be refunded per policy',
                    'Subscription cancellation takes effect next billing cycle'
                  ]}
                  renderItem={(item) => (
                    <List.Item style={{ padding: '4px 0', border: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <UserOutlined style={{ color: themeStyles.accentColor, fontSize: '12px', marginTop: '2px', flexShrink: 0 }} />
                        <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                          {item}
                        </Text>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </Col>
          </Row>
        </Section>

        {/* Governing Law */}
        <Section 
          id="governing-law"
          title="Governing Law & Jurisdiction" 
          icon={<SafetyCertificateOutlined style={{ fontSize: '24px' }} />}
        >
          <Paragraph style={{ color: themeStyles.textColor, fontSize: '16px', marginBottom: '24px' }}>
            These terms and conditions are governed by and construed in accordance with the laws of India, 
            and you irrevocably submit to the exclusive jurisdiction of the courts in Karnataka, India.
          </Paragraph>

          <Row gutter={[24, 16]}>
            <Col xs={24} sm={8}>
              <div style={{
                background: themeStyles.sectionBg,
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${themeStyles.cardBorder}`,
                textAlign: 'center'
              }}>
                <EnvironmentOutlined style={{ fontSize: '32px', color: themeStyles.accentColor, marginBottom: '12px' }} />
                <Title level={5} style={{ color: themeStyles.titleColor, marginBottom: '8px' }}>
                  Jurisdiction
                </Title>
                <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                  Karnataka, India
                </Text>
              </div>
            </Col>
            
            <Col xs={24} sm={8}>
              <div style={{
                background: themeStyles.sectionBg,
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${themeStyles.cardBorder}`,
                textAlign: 'center'
              }}>
                <BookOutlined style={{ fontSize: '32px', color: '#10b981', marginBottom: '12px' }} />
                <Title level={5} style={{ color: themeStyles.titleColor, marginBottom: '8px' }}>
                  Governing Law
                </Title>
                <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                  Indian Legal System
                </Text>
              </div>
            </Col>
            
            <Col xs={24} sm={8}>
              <div style={{
                background: themeStyles.sectionBg,
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${themeStyles.cardBorder}`,
                textAlign: 'center'
              }}>
                <TeamOutlined style={{ fontSize: '32px', color: '#f59e0b', marginBottom: '12px' }} />
                <Title level={5} style={{ color: themeStyles.titleColor, marginBottom: '8px' }}>
                  Dispute Resolution
                </Title>
                <Text style={{ color: themeStyles.textColor, fontSize: '14px' }}>
                  Arbitration Preferred
                </Text>
              </div>
            </Col>
          </Row>
        </Section>

        {/* Changes to Terms */}
        <Section 
          id="changes"
          title="Changes to Terms" 
          icon={<ClockCircleOutlined style={{ fontSize: '24px' }} />}
        >
          <Alert
            message="Terms Updates"
            description="We reserve the right to update these terms at any time. Significant changes will be communicated via email and website notification."
            type="info"
            showIcon
            style={{
              background: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              border: `1px solid ${theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.15)'}`,
              borderRadius: '12px',
              marginBottom: '24px'
            }}
          />

          <Row gutter={[24, 24]}>
            <Col xs={24} md={6}>
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  color: 'white'
                }}>
                  <MailOutlined />
                </div>
                <Text style={{ color: themeStyles.titleColor, fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Email Notice
                </Text>
                <Text style={{ color: themeStyles.textColor, fontSize: '12px' }}>
                  30 days advance notice
                </Text>
              </div>
            </Col>

            <Col xs={24} md={6}>
              <div style={{ textAlign: 'center', padding: '16px' }}>
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
                  <GlobalOutlined />
                </div>
                <Text style={{ color: themeStyles.titleColor, fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Website Update
                </Text>
                <Text style={{ color: themeStyles.textColor, fontSize: '12px' }}>
                  Immediate posting
                </Text>
              </div>
            </Col>

            <Col xs={24} md={6}>
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  color: 'white'
                }}>
                  <CheckCircleOutlined />
                </div>
                <Text style={{ color: themeStyles.titleColor, fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  Acceptance
                </Text>
                <Text style={{ color: themeStyles.textColor, fontSize: '12px' }}>
                  Continued use = agreement
                </Text>
              </div>
            </Col>

            <Col xs={24} md={6}>
              <div style={{ textAlign: 'center', padding: '16px' }}>
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
                  <UserOutlined />
                </div>
                <Text style={{ color: themeStyles.titleColor, fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  User Option
                </Text>
                <Text style={{ color: themeStyles.textColor, fontSize: '12px' }}>
                  Cancel if you disagree
                </Text>
              </div>
            </Col>
          </Row>
        </Section>

        {/* Contact Information */}
        <Section 
          id="contact"
          title="Contact Information" 
          icon={<CustomerServiceOutlined style={{ fontSize: '24px' }} />}
        >
          <Paragraph style={{ color: themeStyles.textColor, fontSize: '16px', marginBottom: '24px' }}>
            If you have any questions about these Terms and Conditions, please contact us:
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
                    Email Support
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
                    Phone Support
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
              Business Address
            </Text>
            <Text style={{ color: themeStyles.textColor }}>
              EkahHealth, Karnataka, India
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
          <Title level={4} style={{ color: themeStyles.titleColor, marginBottom: '16px' }}>
            Agreement Acknowledgment
          </Title>
          <Text style={{ color: themeStyles.subtitleColor, fontSize: '14px', display: 'block', marginBottom: '12px' }}>
            By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. 
            These terms constitute a legally binding agreement between you and EkahHealth.
          </Text>
          <Text style={{ color: themeStyles.textColor, fontSize: '12px', fontStyle: 'italic' }}>
            Last updated: {lastUpdated} | Effective: {effectiveDate}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;