// pages/Services/components/ServiceModal.js
import React from 'react';
import { Modal, Tag, Typography, Button, Row, Col, Divider } from 'antd';
import { 
  CheckCircleOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  CalendarOutlined,
  StarOutlined,
  WhatsAppOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const ServiceModal = ({ service, visible, onClose, theme }) => {
  if (!service) return null;

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        modalBg: '#1f1f1f',
        cardBg: 'rgba(255, 255, 255, 0.08)',
        cardBorder: 'rgba(255, 255, 255, 0.15)',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        priceColor: '#4ade80',
        dividerColor: 'rgba(255, 255, 255, 0.15)',
      };
    } else {
      return {
        modalBg: '#ffffff',
        cardBg: 'rgba(102, 126, 234, 0.08)',
        cardBorder: 'rgba(102, 126, 234, 0.15)',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        priceColor: '#059669',
        dividerColor: 'rgba(0, 0, 0, 0.1)',
      };
    }
  };

  const themeStyles = getThemeStyles();

  const handleBookNow = () => {
    // You can integrate with your booking system here
    const phoneNumber = "+919876543210"; // Replace with actual number
    const message = `Hi, I would like to book the ${service.title} program. Please provide more details.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallNow = () => {
    window.location.href = "tel:+919876543210"; // Replace with actual number
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
      styles={{
        body: {
          background: themeStyles.modalBg,
          borderRadius: '16px',
        }
      }}
    >
      <div style={{ padding: '8px' }}>
        {/* Modal Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '16px',
          marginBottom: '24px' 
        }}>
          <div style={{
            padding: '16px',
            borderRadius: '16px',
            background: themeStyles.gradientPrimary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '32px', color: '#ffffff' }}>
              {service.icon}
            </span>
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Title level={3} style={{ color: themeStyles.textPrimary, margin: 0 }}>
                {service.title}
              </Title>
              <Tag 
                color="blue" 
                style={{ 
                  fontSize: '12px',
                  padding: '4px 12px',
                  borderRadius: '12px',
                }}
              >
                {service.category}
              </Tag>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ClockCircleOutlined style={{ color: themeStyles.priceColor }} />
                <Text style={{ color: themeStyles.textSecondary, fontWeight: '600' }}>
                  {service.duration}
                </Text>
              </div>
              {service.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <StarOutlined style={{ color: '#fbbf24' }} />
                  <Text style={{ color: themeStyles.textSecondary, fontWeight: '600' }}>
                    {service.rating} Rating
                  </Text>
                </div>
              )}
            </div>
            
            <Paragraph style={{ 
              color: themeStyles.textSecondary,
              fontSize: '16px',
              margin: 0,
              lineHeight: '1.6',
            }}>
              {service.description}
            </Paragraph>
          </div>
        </div>

        <Divider style={{ borderColor: themeStyles.dividerColor }} />
        
        {/* Program Details */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={14}>
            <Title level={5} style={{ color: themeStyles.textPrimary }}>
              Program Includes
            </Title>
            <div style={{ marginBottom: '24px' }}>
              {service.includes.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '12px',
                  marginBottom: '12px',
                  padding: '12px',
                  background: themeStyles.cardBg,
                  borderRadius: '12px',
                  border: `1px solid ${themeStyles.cardBorder}`,
                }}>
                  <CheckCircleOutlined style={{ 
                    color: themeStyles.priceColor, 
                    fontSize: '18px',
                    marginTop: '2px',
                    flexShrink: 0,
                  }} />
                  <Text style={{ 
                    color: themeStyles.textPrimary, 
                    fontSize: '15px',
                    lineHeight: '1.5',
                    fontWeight: '500',
                  }}>
                    {item}
                  </Text>
                </div>
              ))}
            </div>

            {/* Benefits Section */}
            {service.benefits && (
              <>
                <Title level={5} style={{ color: themeStyles.textPrimary }}>
                  Key Benefits
                </Title>
                <div style={{ marginBottom: '24px' }}>
                  {service.benefits.map((benefit, index) => (
                    <div key={index} style={{ 
                      padding: '8px 0',
                      borderBottom: index < service.benefits.length - 1 
                        ? `1px solid ${themeStyles.dividerColor}` 
                        : 'none',
                    }}>
                      <Text style={{ color: themeStyles.textSecondary }}>
                        • {benefit}
                      </Text>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Col>
          
          <Col xs={24} md={10}>
            {/* Pricing Card */}
            <div style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
            }}>
              <Title level={5} style={{ 
                color: themeStyles.textPrimary,
                marginBottom: '20px',
                textAlign: 'center',
              }}>
                Pricing Options
              </Title>
              
              {service.options.map((option, index) => (
                <div key={index} style={{ 
                  background: theme === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: index < service.options.length - 1 ? '12px' : '0',
                  border: `1px solid ${themeStyles.cardBorder}`,
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <Text strong style={{ 
                        color: themeStyles.textPrimary,
                        fontSize: '15px',
                        display: 'block',
                      }}>
                        {option.type}
                      </Text>
                      <Text style={{ 
                        color: themeStyles.textSecondary,
                        fontSize: '13px',
                      }}>
                        Duration: {option.duration}
                      </Text>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Text strong style={{ 
                        color: themeStyles.priceColor,
                        fontSize: '24px',
                        fontWeight: '700',
                        display: 'block',
                        lineHeight: '1',
                      }}>
                        ₹{option.price}
                      </Text>
                      <Text style={{ 
                        color: themeStyles.textSecondary,
                        fontSize: '12px',
                      }}>
                        per {option.duration.toLowerCase()}
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button 
                type="primary"
                size="large"
                block
                onClick={handleBookNow}
                style={{
                  background: themeStyles.gradientPrimary,
                  border: 'none',
                  borderRadius: '12px',
                  height: '48px',
                  fontWeight: '600',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                icon={<WhatsAppOutlined />}
              >
                Book via WhatsApp
              </Button>
              
              <Button 
                size="large"
                block
                onClick={handleCallNow}
                style={{
                  borderColor: themeStyles.priceColor,
                  color: themeStyles.priceColor,
                  borderRadius: '12px',
                  height: '48px',
                  fontWeight: '600',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'transparent',
                }}
                icon={<PhoneOutlined />}
              >
                Call Now
              </Button>
              
              <Button 
                size="large"
                block
                style={{
                  borderColor: themeStyles.cardBorder,
                  color: themeStyles.textSecondary,
                  borderRadius: '12px',
                  height: '48px',
                  fontWeight: '600',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'transparent',
                }}
                icon={<CalendarOutlined />}
              >
                Schedule Consultation
              </Button>
            </div>
          </Col>
        </Row>

        {/* Additional Info */}
        <Divider style={{ borderColor: themeStyles.dividerColor }} />
        
        <div style={{
          background: themeStyles.cardBg,
          padding: '20px',
          borderRadius: '12px',
          border: `1px solid ${themeStyles.cardBorder}`,
        }}>
          <Title level={5} style={{ color: themeStyles.textPrimary, marginBottom: '12px' }}>
            Important Information
          </Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Text style={{ color: themeStyles.textSecondary, fontSize: '14px' }}>
              • Programs are conducted by certified practitioners
            </Text>
            <Text style={{ color: themeStyles.textSecondary, fontSize: '14px' }}>
              • Personalized approach based on individual health assessment
            </Text>
            <Text style={{ color: themeStyles.textSecondary, fontSize: '14px' }}>
              • Online and offline sessions available
            </Text>
            <Text style={{ color: themeStyles.textSecondary, fontSize: '14px' }}>
              • 24/7 support throughout the program duration
            </Text>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ServiceModal;