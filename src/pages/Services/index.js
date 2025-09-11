import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Row, Col, Typography, Card, Button, Badge, Empty, Spin, Alert } from 'antd';
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
import { useTheme } from '../../contexts/ThemeContext';
import ServicesHero from './components/ServicesHero';
import CallToAction from './components/CallToAction';
import { servicesDB, categoriesDB } from '../../services/firebase/database';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Services.css';

const { Title, Text, Paragraph } = Typography;

const Services = () => {
  const { theme, getThemeStyles } = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  const [serviceGroups, setServiceGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping function
  const getServiceIcon = (service) => {
    const iconMap = {
      'YONI AROGYA': <WomanOutlined style={{ fontSize: '24px', color: '#e91e63' }} />,
      'SWASTHA AROGYA': <HeartOutlined style={{ fontSize: '24px', color: '#2196f3' }} />,
      'GARBHINI AROGYA': <UserOutlined style={{ fontSize: '24px', color: '#ff9800' }} />,
      'GARBHA SANSKAR': <UserOutlined style={{ fontSize: '24px', color: '#9c27b0' }} />,
      'NARI AROGYA CLASSES': <UserOutlined style={{ fontSize: '24px', color: '#4caf50' }} />,
      'DR CONSULTATION': <MedicineBoxOutlined style={{ fontSize: '24px', color: '#795548' }} />,
      'DR CONSULTATION WITH DIET CHART': <CalendarOutlined style={{ fontSize: '24px', color: '#607d8b' }} />,
      'NATUROPATHY DIAGNOSIS': <UserOutlined style={{ fontSize: '24px', color: '#ff5722' }} />,
      'ACUPUNCTURE': <UserOutlined style={{ fontSize: '24px', color: '#3f51b5' }} />,
      'WEEKEND SPECIALS': <ThunderboltOutlined style={{ fontSize: '24px', color: '#8bc34a' }} />,
    };

    if (service.title && iconMap[service.title.toUpperCase()]) {
      return iconMap[service.title.toUpperCase()];
    }

    const categoryIcons = {
      'Consultation': <MedicineBoxOutlined style={{ fontSize: '24px', color: '#795548' }} />,
      'Online yoga': <UserOutlined style={{ fontSize: '24px', color: '#4caf50' }} />,
      'Programs': <HeartOutlined style={{ fontSize: '24px', color: '#2196f3' }} />,
      'Specials': <ThunderboltOutlined style={{ fontSize: '24px', color: '#8bc34a' }} />,
      'Women & Pregnancy': <WomanOutlined style={{ fontSize: '24px', color: '#e91e63' }} />
    };
    
    return categoryIcons[service.category] || <UserOutlined style={{ fontSize: '24px', color: '#666' }} />;
  };

  // Tab icon mapping
  const getTabIcon = (groupId) => {
    const iconMap = {
      consultation: <MedicineBoxOutlined />,
      specials: <ThunderboltOutlined />,
      'women-pregnancy': <WomanOutlined />,
      programs: <HeartOutlined />
    };
    return iconMap[groupId] || <UserOutlined />;
  };

  // Theme styles
  const getThemeStyles = useMemo(() => {
    if (theme === 'dark') {
      return {
        background: 'linear-gradient(135deg, #0a0b0f 0%, #1a1d23 50%, #0f1117 100%)',
        containerBg: 'rgba(67, 127, 151, 0.08)',
        cardBg: 'rgba(67, 127, 151, 0.12)',
        cardBorder: 'rgba(67, 127, 151, 0.25)',
        listItemBg: 'rgba(67, 127, 151, 0.08)',
        listItemHover: 'rgba(67, 127, 151, 0.15)',
        selectedBg: 'rgba(238, 225, 179, 0.15)',
        selectedBorder: '#EEEIB3',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        gradientPrimary: 'linear-gradient(135deg, #437F97 0%, #5A9BB8 50%, #EEEIB3 100%)',
        priceColor: '#EEEIB3',
        shadowColor: 'rgba(67, 127, 151, 0.4)',
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #fafbfc 0%, rgba(238, 225, 179, 0.08) 50%, #f8fafc 100%)',
        containerBg: 'rgba(67, 127, 151, 0.06)',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(67, 127, 151, 0.15)',
        listItemBg: 'rgba(255, 255, 255, 0.9)',
        listItemHover: 'rgba(67, 127, 151, 0.08)',
        selectedBg: 'rgba(238, 225, 179, 0.25)',
        selectedBorder: '#437F97',
        textPrimary: '#1a202c',
        textSecondary: '#4a5568',
        gradientPrimary: 'linear-gradient(135deg, #437F97 0%, #5A9BB8 50%, #EEEIB3 100%)',
        priceColor: '#437F97',
        shadowColor: 'rgba(67, 127, 151, 0.15)',
      };
    }
  }, [theme]);

  const themeStyles = getThemeStyles;

  // Load data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [services, categories] = await Promise.all([
        servicesDB.getAll(),
        categoriesDB.getAll()
      ]);

      const transformedServices = services.map(service => ({
        ...service,
        id: parseInt(service.id) || service.id,
        icon: getServiceIcon(service)
      }));

      setServicesData(transformedServices);
      setServiceGroups(categories);

      // Set default active tab and select first course
      if (categories.length > 0) {
        const firstTab = categories[0].id;
        setActiveTab(firstTab);
        
        // Find first course in first tab
        const firstTabCourses = transformedServices.filter(service => 
          service.category && categories[0].title &&
          service.category.toLowerCase().trim() === categories[0].title.toLowerCase().trim()
        );
        
        if (firstTabCourses.length > 0) {
          setSelectedCourse(firstTabCourses[0]);
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load services data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
    
    // Find the group for this tab
    const selectedGroup = serviceGroups.find(group => group.id === key);
    if (selectedGroup) {
      // Find courses for this group
      const groupCourses = servicesData.filter(service => 
        service.category && selectedGroup.title &&
        service.category.toLowerCase().trim() === selectedGroup.title.toLowerCase().trim()
      );
      
      // Select first course in the group
      if (groupCourses.length > 0) {
        setSelectedCourse(groupCourses[0]);
      } else {
        setSelectedCourse(null);
      }
    }
  };

  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  // Handle booking
  const handleBookNow = (service) => {
    if (!currentUser) {
      const serializableService = {
        ...service,
        icon: undefined
      };
      sessionStorage.setItem('intendedServiceBooking', JSON.stringify(serializableService));
      navigate('/signin');
      return;
    }
    
    const cleanService = service ? {
      ...service,
      icon: undefined
    } : null;
    
    navigate('/booking', { 
      state: { 
        service: cleanService,
        selectedServices: cleanService ? [cleanService] : []
      } 
    });
  };

  // Course List Item Component
  const CourseListItem = ({ service, isSelected, onSelect }) => (
    <div
      style={{
        background: isSelected ? themeStyles.selectedBg : themeStyles.listItemBg,
        border: `2px solid ${isSelected ? themeStyles.selectedBorder : themeStyles.cardBorder}`,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isSelected 
          ? `0 8px 32px ${themeStyles.shadowColor}`
          : `0 4px 16px ${themeStyles.shadowColor}`,
        transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
        height: '160px', // Increased uniform height for better content fit
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}
      onClick={() => onSelect(service)}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = themeStyles.listItemHover;
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 8px 32px ${themeStyles.shadowColor}`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = themeStyles.listItemBg;
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = `0 4px 16px ${themeStyles.shadowColor}`;
        }
      }}
    >
      {/* Header Section - Fixed Height */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: '12px', 
        marginBottom: '12px',
        height: '50px', // Reduced header height for tighter spacing
        minHeight: '50px'
      }}>
        <div style={{
          padding: '8px',
          borderRadius: '10px',
          background: themeStyles.gradientPrimary,
          color: 'white',
          fontSize: '16px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          boxShadow: `0 4px 12px ${themeStyles.shadowColor}`
        }}>
          {service.icon}
        </div>
        
        <div style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Title Section */}
          <div style={{ 
            marginBottom: '6px'
          }}>
            <Title level={5} style={{ 
              color: themeStyles.textPrimary, 
              margin: 0,
              marginBottom: '2px',
              fontSize: '13px',
              fontWeight: '700',
              lineHeight: '1.2',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxHeight: '31px' // 2 lines max with tighter spacing
            }}>
              {service.title}
            </Title>
          </div>
          
          {/* Duration and Badge Row */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '6px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              flex: 1,
              minWidth: '0'
            }}>
              <CalendarOutlined style={{ 
                color: themeStyles.textSecondary, 
                fontSize: '10px',
                flexShrink: 0 
              }} />
              <Text style={{ 
                color: themeStyles.textSecondary, 
                fontSize: '10px',
                fontWeight: '500',
                lineHeight: '1.1',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {service.duration}
              </Text>
            </div>
            <Badge 
              count={service.category} 
              style={{ 
                background: themeStyles.gradientPrimary,
                fontSize: '8px',
                height: '14px',
                lineHeight: '14px',
                border: 'none',
                color: '#1f2937',
                fontWeight: '600',
                borderRadius: '7px',
                padding: '0 4px',
                flexShrink: 0,
                maxWidth: '80px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }} 
            />
          </div>
        </div>
      </div>

      {/* Description Section - Exactly 3 Lines */}
      <div style={{ 
        flex: 1, 
        minHeight: '0',
        height: '84px', // Fixed height for exactly 3 lines (28px per line)
        overflow: 'hidden'
      }}>
        <Text style={{ 
          color: themeStyles.textSecondary,
          fontSize: '11px',
          lineHeight: '1.45', // Better line height for readability
          display: '-webkit-box',
          WebkitLineClamp: 3, // Exactly 3 lines
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          margin: 0,
          fontWeight: '400',
          letterSpacing: '0.005em',
          wordBreak: 'break-word',
          hyphens: 'auto',
          height: '100%',
          maxHeight: '48px' // 3 lines * 16px line height
        }}>
          {service.description}
        </Text>
      </div>
    </div>
  );

  // Course Details Component
  const CourseDetailsPanel = ({ service }) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // Reset expanded state when service changes
    useEffect(() => {
      setIsDescriptionExpanded(false);
    }, [service?.id]);

    if (!service) {
      return (
        <div style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.cardBorder}`,
          borderRadius: '24px',
          padding: '48px',
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 32px ${themeStyles.shadowColor}`,
        }}>
          <Empty 
            description={
              <Text style={{ color: themeStyles.textSecondary, fontSize: '16px' }}>
                Select a course to view details
              </Text>
            }
          />
        </div>
      );
    }

    // Check if description needs truncation (rough estimation)
    const needsTruncation = service.description && service.description.length > 150;

    return (
      <div style={{
        background: themeStyles.cardBg,
        border: `1px solid ${themeStyles.cardBorder}`,
        borderRadius: '24px',
        padding: '32px',
        minHeight: '500px',
        boxShadow: `0 8px 32px ${themeStyles.shadowColor}`,
        backdropFilter: 'blur(20px)',
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            padding: '20px',
            borderRadius: '18px',
            background: themeStyles.gradientPrimary,
            color: 'white',
            fontSize: '32px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 6px 24px ${themeStyles.shadowColor}`,
          }}>
            {service.icon}
          </div>
          <div style={{ flex: 1 }}>
            <Title level={2} style={{ 
              color: themeStyles.textPrimary, 
              margin: '0 0 12px 0',
              fontSize: '28px',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              {service.title}
            </Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <Badge count={service.category} style={{ 
                background: themeStyles.gradientPrimary,
                border: 'none',
                color: '#1f2937',
                fontSize: '12px',
                fontWeight: '600',
                padding: '2px 12px',
                height: '24px',
                lineHeight: '20px',
                borderRadius: '12px'
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarOutlined style={{ color: themeStyles.textSecondary, fontSize: '14px' }} />
                <Text style={{ color: themeStyles.textSecondary, fontSize: '14px', fontWeight: '500' }}>
                  {service.duration}
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Description with See More/Less */}
        <div style={{ marginBottom: '32px' }}>
          <Title level={4} style={{ 
            color: themeStyles.textPrimary,
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '700',
            letterSpacing: '-0.01em'
          }}>
            About This Program
          </Title>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              color: themeStyles.textSecondary,
              fontSize: '16px',
              lineHeight: '1.6',
              margin: 0,
              fontWeight: '400',
              letterSpacing: '0.01em',
              ...(isDescriptionExpanded ? {
                // Expanded state - show full text
                maxHeight: 'none'
              } : {
                // Collapsed state - show exactly 5 lines
                display: '-webkit-box',
                WebkitLineClamp: 5,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                maxHeight: '128px', // 16px * 1.6 * 5 lines
                textOverflow: 'ellipsis'
              })
            }}>
              {service.description}
            </div>
            
            {needsTruncation && (
              <Button
                type="link"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                style={{
                  padding: '8px 0',
                  height: 'auto',
                  color: themeStyles.priceColor,
                  fontWeight: '600',
                  fontSize: '14px',
                  marginTop: '12px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: 'none',
                  boxShadow: 'none',
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = themeStyles.textPrimary;
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = themeStyles.priceColor;
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                {isDescriptionExpanded ? (
                  <>
                    <ArrowRightOutlined style={{ transform: 'rotate(180deg)', marginRight: '6px', fontSize: '12px' }} />
                    See Less
                  </>
                ) : (
                  <>
                    See More
                    <ArrowRightOutlined style={{ marginLeft: '6px', fontSize: '12px' }} />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: '32px' }}>
          <Title level={4} style={{ 
            color: themeStyles.textPrimary,
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '700',
            letterSpacing: '-0.01em'
          }}>
            What's Included
          </Title>
          <div style={{ 
            display: 'grid', 
            gap: '12px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
          }}>
            {service.includes.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '12px',
                padding: '16px',
                background: theme === 'dark' 
                  ? 'rgba(67, 127, 151, 0.08)' 
                  : 'rgba(238, 225, 179, 0.08)',
                borderRadius: '16px',
                border: `1px solid ${theme === 'dark' ? 'rgba(67, 127, 151, 0.15)' : 'rgba(238, 225, 179, 0.15)'}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${themeStyles.shadowColor}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <CheckCircleOutlined style={{ 
                  color: themeStyles.priceColor, 
                  fontSize: '18px',
                  marginTop: '2px',
                  flexShrink: 0
                }} />
                <Text style={{ 
                  color: themeStyles.textSecondary, 
                  fontSize: '15px',
                  lineHeight: '1.5',
                  fontWeight: '500',
                  letterSpacing: '0.01em'
                }}>
                  {item}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div style={{ marginBottom: '32px' }}>
          <Title level={4} style={{ 
            color: themeStyles.textPrimary,
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '700',
            letterSpacing: '-0.01em'
          }}>
            Investment Options
          </Title>
          <div style={{
            background: theme === 'dark' 
              ? 'rgba(67, 127, 151, 0.12)' 
              : 'rgba(238, 225, 179, 0.20)',
            borderRadius: '20px',
            padding: '24px',
            border: `2px solid ${theme === 'dark' ? 'rgba(67, 127, 151, 0.25)' : 'rgba(238, 225, 179, 0.35)'}`,
            boxShadow: `0 4px 20px ${themeStyles.shadowColor}`
          }}>
            {service.options.map((option, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                marginBottom: index < service.options.length - 1 ? '16px' : '0',
                background: themeStyles.cardBg,
                borderRadius: '16px',
                border: `1px solid ${themeStyles.cardBorder}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${themeStyles.shadowColor}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div>
                  <Text strong style={{ 
                    color: themeStyles.textPrimary,
                    fontSize: '16px',
                    display: 'block',
                    fontWeight: '700',
                    marginBottom: '4px',
                    letterSpacing: '-0.01em'
                  }}>
                    {option.type}
                  </Text>
                  <Text style={{ 
                    color: themeStyles.textSecondary,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Duration: {option.duration}
                  </Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Text strong style={{ 
                    color: themeStyles.priceColor,
                    fontSize: '24px',
                    fontWeight: '800',
                    display: 'block',
                    lineHeight: '1',
                    letterSpacing: '-0.02em'
                  }}>
                    ₹{option.price}
                  </Text>
                  <Text style={{ 
                    color: themeStyles.textSecondary,
                    fontSize: '12px',
                    opacity: 0.8,
                    fontWeight: '500'
                  }}>
                    per {option.duration.toLowerCase()}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Book Button */}
        <Button
          type="primary"
          block
          size="large"
          style={{
            background: themeStyles.gradientPrimary,
            border: 'none',
            borderRadius: '16px',
            height: '56px',
            fontWeight: '700',
            fontSize: '16px',
            boxShadow: `0 6px 24px ${themeStyles.shadowColor}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            letterSpacing: '-0.01em'
          }}
          icon={<InfoCircleOutlined style={{ fontSize: '18px' }} />}
          onClick={() => handleBookNow(service)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 8px 32px ${themeStyles.shadowColor}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 6px 24px ${themeStyles.shadowColor}`;
          }}
        >
          Book This Program
        </Button>
      </div>
    );
  };

  // Tab Content Component
  const TabContent = ({ groupServices }) => {
    return (
      <Row gutter={24}>
        {/* Left Panel - Course List */}
        <Col xs={24} lg={10}>
          <div style={{
            background: themeStyles.cardBg,
            border: `1px solid ${themeStyles.cardBorder}`,
            borderRadius: '24px',
            padding: '28px',
            maxHeight: '700px',
            overflowY: 'auto',
            boxShadow: `0 8px 32px ${themeStyles.shadowColor}`,
          }}>
            <Title level={3} style={{ 
              color: themeStyles.textPrimary,
              marginBottom: '28px',
              fontSize: '22px',
              fontWeight: '800',
              background: themeStyles.gradientPrimary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Available Programs
            </Title>
            {groupServices.map((service) => (
              <CourseListItem
                key={service.id}
                service={service}
                isSelected={selectedCourse?.id === service.id}
                onSelect={handleCourseSelect}
              />
            ))}
          </div>
        </Col>

        {/* Right Panel - Course Details */}
        <Col xs={24} lg={14}>
          <CourseDetailsPanel service={selectedCourse} />
        </Col>
      </Row>
    );
  };

  // Create tab items
  const tabItems = serviceGroups.map(group => {
    const groupServices = servicesData.filter(service => 
      service.category && group.title &&
      service.category.toLowerCase().trim() === group.title.toLowerCase().trim()
    );

    return {
      key: group.id,
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getTabIcon(group.id)}
          <span>{group.title}</span>
          <Badge 
            count={groupServices.length} 
            style={{ 
              background: themeStyles.gradientPrimary,
              fontSize: '10px',
              border: 'none',
              color: '#1f2937'
            }} 
          />
        </div>
      ),
      children: <TabContent groupServices={groupServices} />
    };
  });

  if (loading) {
    return (
      <div style={{ 
        background: themeStyles.background, 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        background: themeStyles.background, 
        minHeight: '100vh',
      }}>
        <ServicesHero theme={theme} />
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '40px 20px'
        }}>
          <Alert
            message="Error Loading Services"
            description={error}
            type="error"
            showIcon
            action={
              <Button size="small" danger onClick={loadData}>
                Try Again
              </Button>
            }
          />
        </div>
      </div>
    );
  }

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
          borderRadius: '32px',
          padding: '40px',
          border: `1px solid ${themeStyles.cardBorder}`,
          boxShadow: `0 24px 80px ${themeStyles.shadowColor}`,
        }}>
          {serviceGroups.length > 0 ? (
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={tabItems}
              className={`services-tabs ${theme === 'dark' ? 'dark-tabs' : 'light-tabs'}`}
              tabBarStyle={{
                background: themeStyles.cardBg,
                borderRadius: '20px',
                padding: '12px',
                marginBottom: '40px',
                border: `1px solid ${themeStyles.cardBorder}`,
                boxShadow: `0 8px 32px ${themeStyles.shadowColor}`,
              }}
              size="large"
              centered
            />
          ) : (
            <Empty description="No services available" />
          )}
        </div>
      </div>

      {/* Call to Action */}
      <CallToAction theme={theme} />
    </div>
  );
};

export default Services;