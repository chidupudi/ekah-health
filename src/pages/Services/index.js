// pages/Services/index.js
import React, { useState } from 'react';
import { Tabs, Row, Col, Typography, Card, Button, Badge, Empty } from 'antd';
import { 
  CheckCircleOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  UserOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  ThunderboltOutlined,
  WomanOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useTheme } from '../../components/ParticleBackground';
import ServicesHero from './components/ServicesHero';
import CallToAction from './components/CallToAction';
import { servicesData, serviceGroups } from './data/servicesData';
import './Services.css';

const { Title, Text, Paragraph } = Typography;

const Services = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('consultation');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
        containerBg: 'rgba(67, 127, 151, 0.08)', // Using #437F97 with transparency
        cardBg: 'rgba(67, 127, 151, 0.12)',
        cardBorder: 'rgba(67, 127, 151, 0.25)',
        listItemBg: 'rgba(67, 127, 151, 0.08)',
        listItemHover: 'rgba(67, 127, 151, 0.15)',
        selectedBg: 'rgba(238, 225, 179, 0.15)', // Using #EEEIB3 for selection
        selectedBorder: '#EEEIB3',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        gradientPrimary: 'linear-gradient(135deg, #437F97 0%, #EEEIB3 100%)', // Blue to cream
        gradientSecondary: 'linear-gradient(135deg, #FFB5C2 0%, #437F97 100%)', // Pink to blue
        gradientAccent: 'linear-gradient(135deg, #EEEIB3 0%, #FFB5C2 100%)', // Cream to pink
        priceColor: '#EEEIB3',
        accentColor: '#FFB5C2',
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #f8fafc 0%, rgba(238, 225, 179, 0.1) 50%, #f8fafc 100%)',
        containerBg: 'rgba(67, 127, 151, 0.08)',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(67, 127, 151, 0.15)',
        listItemBg: 'rgba(255, 255, 255, 0.9)',
        listItemHover: 'rgba(67, 127, 151, 0.08)',
        selectedBg: 'rgba(238, 225, 179, 0.25)',
        selectedBorder: '#437F97',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        gradientPrimary: 'linear-gradient(135deg, #437F97 0%, #EEEIB3 100%)',
        gradientSecondary: 'linear-gradient(135deg, #FFB5C2 0%, #437F97 100%)',
        gradientAccent: 'linear-gradient(135deg, #EEEIB3 0%, #FFB5C2 100%)',
        priceColor: '#437F97',
        accentColor: '#FFB5C2',
      };
    }
  };

  const themeStyles = getThemeStyles();

  const getTabIcon = (groupId) => {
    const iconMap = {
      consultation: <MedicineBoxOutlined />,
      specials: <ThunderboltOutlined />,
      'women-pregnancy': <WomanOutlined />,
      programs: <HeartOutlined />
    };
    return iconMap[groupId] || <UserOutlined />;
  };

  const toggleCourseSelection = (serviceId) => {
    setSelectedCourses(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const CourseListItem = ({ service, isSelected, isInCart, onSelect, onToggleCart }) => (
    <div
      style={{
        background: isSelected ? themeStyles.selectedBg : themeStyles.listItemBg,
        border: `2px solid ${isSelected ? themeStyles.selectedBorder : themeStyles.cardBorder}`,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
      onClick={() => onSelect(service)}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = themeStyles.listItemHover;
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = themeStyles.listItemBg;
        }
      }}
    >
      {/* Selection Checkbox */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: `2px solid ${isInCart ? themeStyles.accentColor : themeStyles.cardBorder}`,
          background: isInCart ? themeStyles.gradientAccent : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isInCart ? '#1f2937' : themeStyles.textSecondary,
          fontSize: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleCart(service.id);
        }}
      >
        {isInCart && <CheckCircleOutlined />}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', paddingRight: '40px' }}>
        <div style={{
          padding: '12px',
          borderRadius: '12px',
          background: themeStyles.gradientPrimary,
          color: 'white',
          fontSize: '20px',
          flexShrink: 0,
        }}>
          {service.icon}
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Title level={5} style={{ 
              color: themeStyles.textPrimary, 
              margin: 0,
              fontSize: '16px',
              fontWeight: '600'
            }}>
              {service.title}
            </Title>
            <Badge 
              count={service.category} 
              style={{ 
                background: themeStyles.gradientSecondary,
                fontSize: '10px',
                height: '18px',
                lineHeight: '18px',
                border: 'none',
                color: '#1f2937'
              }} 
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '8px'
          }}>
            <CalendarOutlined style={{ color: themeStyles.textSecondary, fontSize: '12px' }} />
            <Text style={{ color: themeStyles.textSecondary, fontSize: '12px' }}>
              {service.duration}
            </Text>
          </div>

          <Paragraph style={{ 
            color: themeStyles.textSecondary,
            fontSize: '13px',
            margin: 0,
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {service.description}
          </Paragraph>
        </div>
      </div>
    </div>
  );

  const CourseDetailsPanel = ({ service }) => {
    if (!service) {
      return (
        <div style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.cardBorder}`,
          borderRadius: '20px',
          padding: '40px',
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Empty 
            description={
              <Text style={{ color: themeStyles.textSecondary }}>
                Select a course to view details
              </Text>
            }
            imageStyle={{ height: 100 }}
          />
        </div>
      );
    }

    return (
      <div style={{
        background: themeStyles.cardBg,
        border: `1px solid ${themeStyles.cardBorder}`,
        borderRadius: '20px',
        padding: '24px',
        height: 'fit-content',
        minHeight: '500px',
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            background: themeStyles.gradientPrimary,
            color: 'white',
            fontSize: '28px',
            flexShrink: 0,
          }}>
            {service.icon}
          </div>
          <div style={{ flex: 1 }}>
            <Title level={3} style={{ 
              color: themeStyles.textPrimary, 
              margin: '0 0 8px 0',
              fontSize: '20px'
            }}>
              {service.title}
            </Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <Badge count={service.category} style={{ 
                background: themeStyles.gradientSecondary,
                border: 'none',
                color: '#1f2937'
              }} />
              <Text style={{ color: themeStyles.textSecondary, fontSize: '12px' }}>
                <CalendarOutlined /> {service.duration}
              </Text>
            </div>
          </div>
        </div>

        <Paragraph style={{ 
          color: themeStyles.textSecondary,
          fontSize: '14px',
          lineHeight: '1.6',
          marginBottom: '24px'
        }}>
          {service.description}
        </Paragraph>

        {/* Key Features */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={5} style={{ 
            color: themeStyles.textPrimary,
            marginBottom: '16px',
            fontSize: '15px'
          }}>
            Key Features:
          </Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {service.includes.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '8px',
                padding: '6px 0'
              }}>
                <CheckCircleOutlined style={{ 
                  color: themeStyles.priceColor, 
                  fontSize: '14px',
                  marginTop: '2px',
                  flexShrink: 0
                }} />
                <Text style={{ 
                  color: themeStyles.textSecondary, 
                  fontSize: '13px',
                  lineHeight: '1.4'
                }}>
                  {item}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={5} style={{ 
            color: themeStyles.textPrimary,
            marginBottom: '16px',
            fontSize: '15px'
          }}>
            Pricing Options:
          </Title>
          <div style={{
            background: theme === 'dark' 
              ? 'rgba(67, 127, 151, 0.1)' 
              : 'rgba(238, 225, 179, 0.15)',
            borderRadius: '12px',
            padding: '16px',
            border: `1px solid ${theme === 'dark' ? 'rgba(67, 127, 151, 0.2)' : 'rgba(238, 225, 179, 0.3)'}`
          }}>
            {service.options.map((option, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: index < service.options.length - 1 ? '12px' : '0'
              }}>
                <div>
                  <Text strong style={{ 
                    color: themeStyles.textPrimary,
                    fontSize: '14px',
                    display: 'block'
                  }}>
                    {option.type}
                  </Text>
                  <Text style={{ 
                    color: themeStyles.textSecondary,
                    fontSize: '12px'
                  }}>
                    {option.duration}
                  </Text>
                </div>
                <Text strong style={{ 
                  color: themeStyles.priceColor,
                  fontSize: '18px',
                  fontWeight: '700'
                }}>
                  ₹{option.price}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {/* Know More Button */}
        <Button
          type="primary"
          block
          size="large"
          style={{
            background: themeStyles.gradientPrimary,
            border: 'none',
            borderRadius: '12px',
            height: '48px',
            fontWeight: '600'
          }}
          icon={<InfoCircleOutlined />}
        >
          Know more
        </Button>
      </div>
    );
  };

  const TabContent = ({ groupServices }) => {
    // Auto-select first course when tab changes
    React.useEffect(() => {
      if (groupServices.length > 0 && !selectedCourse) {
        setSelectedCourse(groupServices[0]);
      }
    }, [groupServices]);

    return (
      <div>
        {/* Selection Summary */}
        {selectedCourses.length > 0 && (
          <div style={{
            background: themeStyles.selectedBg,
            border: `2px solid ${themeStyles.selectedBorder}`,
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <Text strong style={{ color: themeStyles.textPrimary }}>
                {selectedCourses.length} course{selectedCourses.length > 1 ? 's' : ''} selected
              </Text>
              <br />
              <Text style={{ color: themeStyles.textSecondary, fontSize: '12px' }}>
                Click "Know more" to see detailed information
              </Text>
            </div>
            <Button 
              type="primary"
              style={{
                background: themeStyles.gradientPrimary,
                border: 'none',
                borderRadius: '8px'
              }}
              icon={<ArrowRightOutlined />}
            >
              Get Started
            </Button>
          </div>
        )}

        {/* Two Panel Layout */}
        <Row gutter={24}>
          {/* Left Panel - Course List */}
          <Col xs={24} lg={10}>
            <div style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: '20px',
              padding: '20px',
              maxHeight: '600px',
              overflowY: 'auto'
            }}>
              <Title level={4} style={{ 
                color: themeStyles.textPrimary,
                marginBottom: '20px',
                fontSize: '18px'
              }}>
                Available Courses
              </Title>
              {groupServices.map((service) => (
                <CourseListItem
                  key={service.id}
                  service={service}
                  isSelected={selectedCourse?.id === service.id}
                  isInCart={selectedCourses.includes(service.id)}
                  onSelect={setSelectedCourse}
                  onToggleCart={toggleCourseSelection}
                />
              ))}
            </div>
          </Col>

          {/* Right Panel - Course Details */}
          <Col xs={24} lg={14}>
            <CourseDetailsPanel service={selectedCourse} />
          </Col>
        </Row>
      </div>
    );
  };

  const tabItems = serviceGroups.map(group => ({
    key: group.id,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {getTabIcon(group.id)}
        <span>{group.title}</span>
        <Badge 
          count={group.services.length} 
          style={{ 
            background: themeStyles.gradientAccent,
            fontSize: '10px',
            border: 'none',
            color: '#1f2937'
          }} 
        />
      </div>
    ),
    children: (
      <TabContent 
        groupServices={group.services.map(id => servicesData.find(s => s.id === id))}
      />
    )
  }));

  return (
    <div style={{ 
      background: themeStyles.background, 
      minHeight: '100vh',
    }}>
      {/* Hero Section */}
      <ServicesHero theme={theme} />

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 20px 80px'
      }}>
        <div style={{
          background: themeStyles.containerBg,
          borderRadius: '24px',
          padding: '32px',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${themeStyles.cardBorder}`,
          boxShadow: theme === 'dark' 
            ? '0 20px 60px rgba(0, 0, 0, 0.3)' 
            : '0 20px 60px rgba(0, 0, 0, 0.1)',
        }}>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              setSelectedCourse(null); // Reset selection when switching tabs
              setSelectedCourses([]);
            }}
            items={tabItems}
            className={`services-tabs ${theme === 'dark' ? 'dark-tabs' : 'light-tabs'}`}
            tabBarStyle={{
              background: themeStyles.cardBg,
              borderRadius: '16px',
              padding: '8px',
              marginBottom: '32px',
              border: `1px solid ${themeStyles.cardBorder}`,
            }}
            size="large"
            centered
          />
        </div>
      </div>

      {/* Call to Action */}
      <CallToAction theme={theme} />
    </div>
  );
};

export default Services;