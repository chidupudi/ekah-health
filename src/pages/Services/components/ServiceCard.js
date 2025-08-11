// pages/Services/components/ServiceCard.js
import React, { useState } from 'react';
import { Card, Badge, Button, Typography, Tooltip, Tag } from 'antd';
import { 
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  ArrowRightOutlined,
  FireOutlined
} from '@ant-design/icons';
import ServiceModal from './ServiceModal';

const { Title, Text, Paragraph } = Typography;

const ServiceCard = ({ service, theme }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        cardBg: 'rgba(255, 255, 255, 0.08)',
        cardBorder: 'rgba(255, 255, 255, 0.15)',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        gradientSecondary: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        shadowColor: 'rgba(255, 255, 255, 0.1)',
        priceColor: '#4ade80',
        badgeColor: '#f59e0b',
        popularBadge: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      };
    } else {
      return {
        cardBg: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(0, 0, 0, 0.08)',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        gradientSecondary: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        priceColor: '#059669',
        badgeColor: '#d97706',
        popularBadge: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      };
    }
  };

  const themeStyles = getThemeStyles();

  // Determine if this is a popular service
  const isPopular = ['YONI AROGYA', 'GARBHA SANSKAR', 'SWASTHA AROGYA'].includes(service.title);

  return (
    <>
      <div
        style={{
          position: 'relative',
          height: '100%',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Popular Badge */}
        {isPopular && (
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '16px',
            zIndex: 10,
            background: themeStyles.popularBadge,
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
          }}>
            <FireOutlined style={{ fontSize: '12px' }} />
            Popular
          </div>
        )}

        <Card
          hoverable
          style={{
            background: themeStyles.cardBg,
            border: `2px solid ${isHovered ? '#667eea' : themeStyles.cardBorder}`,
            borderRadius: '20px',
            boxShadow: isHovered 
              ? `0 20px 60px ${theme === 'dark' ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)'}`
              : `0 8px 32px ${themeStyles.shadowColor}`,
            backdropFilter: 'blur(20px)',
            height: '100%',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
            overflow: 'hidden',
            position: 'relative',
          }}
          bodyStyle={{ 
            padding: '28px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Card Header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div style={{
                padding: '16px',
                borderRadius: '16px',
                background: themeStyles.gradientPrimary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                transition: 'all 0.3s ease',
              }}>
                <span style={{ fontSize: '28px' }}>
                  {service.icon}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <Badge 
                  count={service.category} 
                  style={{ 
                    backgroundColor: themeStyles.badgeColor,
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '0 12px',
                    height: '24px',
                    lineHeight: '24px',
                    borderRadius: '12px',
                  }} 
                />
                {service.rating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <StarOutlined style={{ color: '#fbbf24', fontSize: '14px' }} />
                    <Text style={{ color: themeStyles.textSecondary, fontSize: '12px', fontWeight: '600' }}>
                      {service.rating}
                    </Text>
                  </div>
                )}
              </div>
            </div>
            
            <Title 
              level={4} 
              style={{ 
                color: themeStyles.textPrimary, 
                marginBottom: '12px',
                fontSize: '20px',
                fontWeight: '700',
                lineHeight: '1.3',
              }}
            >
              {service.title}
            </Title>
            
            <Paragraph style={{ 
              color: themeStyles.textSecondary,
              fontSize: '14px',
              lineHeight: '1.6',
              marginBottom: '20px',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {service.description}
            </Paragraph>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '20px',
            }}>
              <ClockCircleOutlined style={{ color: themeStyles.priceColor, fontSize: '16px' }} />
              <Text strong style={{ 
                color: themeStyles.textPrimary, 
                fontSize: '14px',
                fontWeight: '600',
              }}>
                {service.duration}
              </Text>
            </div>
          </div>

          {/* Features List */}
          <div style={{ marginBottom: '24px', flex: 1 }}>
            <Text strong style={{ 
              color: themeStyles.textPrimary, 
              marginBottom: '16px', 
              display: 'block',
              fontSize: '15px',
            }}>
              What's Included:
            </Text>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {service.includes.slice(0, 3).map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '10px',
                  padding: '8px',
                  borderRadius: '8px',
                  background: theme === 'dark' 
                    ? 'rgba(255, 255, 255, 0.03)' 
                    : 'rgba(102, 126, 234, 0.05)',
                  transition: 'all 0.2s ease',
                }}>
                  <CheckCircleOutlined style={{ 
                    color: themeStyles.priceColor, 
                    fontSize: '16px',
                    marginTop: '2px',
                    flexShrink: 0,
                  }} />
                  <Text style={{ 
                    color: themeStyles.textSecondary, 
                    fontSize: '13px',
                    lineHeight: '1.5',
                  }}>
                    {item}
                  </Text>
                </div>
              ))}
              {service.includes.length > 3 && (
                <Text style={{ 
                  color: themeStyles.priceColor, 
                  fontSize: '12px', 
                  fontWeight: '600',
                  paddingLeft: '26px',
                }}>
                  +{service.includes.length - 3} more benefits
                </Text>
              )}
            </div>
          </div>

          {/* Pricing Section */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              background: theme === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(102, 126, 234, 0.08)',
              borderRadius: '12px',
              padding: '16px',
              border: `1px solid ${theme === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(102, 126, 234, 0.15)'}`,
            }}>
              {service.options.map((option, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: index < service.options.length - 1 ? '12px' : '0'
                }}>
                  <div>
                    <Text style={{ 
                      color: themeStyles.textPrimary, 
                      fontSize: '13px',
                      fontWeight: '600',
                      display: 'block',
                    }}>
                      {option.type}
                    </Text>
                    <Text style={{ 
                      color: themeStyles.textSecondary, 
                      fontSize: '11px',
                    }}>
                      {option.duration}
                    </Text>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Text strong style={{ 
                      color: themeStyles.priceColor, 
                      fontSize: '18px',
                      fontWeight: '700',
                      display: 'block',
                    }}>
                      ₹{option.price}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <Button 
            type="primary"
            block
            size="large"
            onClick={() => setModalVisible(true)}
            style={{
              background: themeStyles.gradientPrimary,
              border: 'none',
              borderRadius: '12px',
              height: '48px',
              fontWeight: '600',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: isHovered 
                ? '0 8px 24px rgba(102, 126, 234, 0.4)'
                : '0 4px 12px rgba(102, 126, 234, 0.2)',
              transform: isHovered ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
            icon={<ArrowRightOutlined />}
          >
            View Details
          </Button>
        </Card>
      </div>

      {/* Service Modal */}
      <ServiceModal
        service={service}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        theme={theme}
      />
    </>
  );
};

export default ServiceCard;