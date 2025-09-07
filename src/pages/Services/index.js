// pages/Services/index.js
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Tabs, Row, Col, Typography, Card, Button, Badge, Empty, Spin, Alert, Skeleton } from 'antd';
import { 
  CheckCircleOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  UserOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  ThunderboltOutlined,
  WomanOutlined,
  InfoCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useTheme } from '../../components/ParticleBackground';
import ServicesHero from './components/ServicesHero';
import CallToAction from './components/CallToAction';
import { servicesDB, categoriesDB } from '../../services/firebase/database';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Services.css';

const { Title, Text, Paragraph } = Typography;

const Services = () => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('consultation');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [serviceGroups, setServiceGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getServiceIcon = useCallback((service) => {
    // Map service titles to icons since we can't store React elements in Firestore
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
      'YONI YOGA': <UserOutlined style={{ fontSize: '24px', color: '#e91e63' }} />,
      'SWSTHA YOGA': <HeartOutlined style={{ fontSize: '24px', color: '#4caf50' }} />
    };

    // Check by title first, then by category as fallback
    if (service.title && iconMap[service.title.toUpperCase()]) {
      return iconMap[service.title.toUpperCase()];
    }

    // Fallback based on category
    if (service.category) {
      const categoryIcons = {
        'Consultation': <MedicineBoxOutlined style={{ fontSize: '24px', color: '#795548' }} />,
        'Online yoga': <UserOutlined style={{ fontSize: '24px', color: '#4caf50' }} />,
        'Programs': <HeartOutlined style={{ fontSize: '24px', color: '#2196f3' }} />,
        'Specials': <ThunderboltOutlined style={{ fontSize: '24px', color: '#8bc34a' }} />,
        'Women & Pregnancy': <WomanOutlined style={{ fontSize: '24px', color: '#e91e63' }} />
      };
      return categoryIcons[service.category] || <UserOutlined style={{ fontSize: '24px', color: '#666' }} />;
    }

    return <UserOutlined style={{ fontSize: '24px', color: '#666' }} />;
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [services, categories] = await Promise.all([
        servicesDB.getAll(),
        categoriesDB.getAll()
      ]);

      // Transform services data to match expected format
      const transformedServices = services.map(service => ({
        ...service,
        id: parseInt(service.id) || service.id,
        icon: getServiceIcon(service) // Add back the icon
      }));

      setServicesData(transformedServices);
      setServiceGroups(categories);

      // Debug logging
      console.log('Services Data:', transformedServices);
      console.log('Categories:', categories);
      console.log('Service categories:', transformedServices.map(s => s.category));
      console.log('Category titles:', categories.map(c => c.title));

      // Set default active tab to first category
      if (categories.length > 0) {
        setActiveTab(categories[0].id);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load services data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [getServiceIcon]);

  useEffect(() => {
    loadData();
  }, [loadData]);



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
        gradientSecondary: 'linear-gradient(135deg, #FFB5C2 0%, #FF8A9B 50%, #437F97 100%)',
        gradientAccent: 'linear-gradient(135deg, #EEEIB3 0%, #F5F0C4 50%, #FFB5C2 100%)',
        priceColor: '#EEEIB3',
        accentColor: '#FFB5C2',
        shadowColor: 'rgba(67, 127, 151, 0.4)',
        shadowColorStrong: 'rgba(67, 127, 151, 0.6)',
        glowColor: 'rgba(238, 225, 179, 0.3)',
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
        gradientSecondary: 'linear-gradient(135deg, #FFB5C2 0%, #FF8A9B 50%, #437F97 100%)',
        gradientAccent: 'linear-gradient(135deg, #EEEIB3 0%, #F5F0C4 50%, #FFB5C2 100%)',
        priceColor: '#437F97',
        accentColor: '#FFB5C2',
        shadowColor: 'rgba(67, 127, 151, 0.15)',
        shadowColorStrong: 'rgba(67, 127, 151, 0.25)',
        glowColor: 'rgba(238, 225, 179, 0.4)',
      };
    }
  }, [theme]);

  const themeStyles = getThemeStyles;

  const getTabIcon = useCallback((groupId) => {
    const iconMap = {
      consultation: <MedicineBoxOutlined />,
      specials: <ThunderboltOutlined />,
      'women-pregnancy': <WomanOutlined />,
      programs: <HeartOutlined />
    };
    return iconMap[groupId] || <UserOutlined />;
  }, []);

  const toggleCourseSelection = useCallback((serviceId) => {
    setSelectedCourses(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  }, []);

  const handleBookNow = useCallback((service) => {
    // Check if user is logged in
    if (!currentUser) {
      // Store the intended service booking in session storage for after login
      if (service) {
        // Remove React elements before storing
        const serializableService = {
          ...service,
          icon: undefined // Remove the React element
        };
        sessionStorage.setItem('intendedServiceBooking', JSON.stringify(serializableService));
      }
      // Redirect to sign-in page
      navigate('/signin');
      return;
    }
    
    // Clean service data by removing React elements
    const cleanService = service ? {
      ...service,
      icon: undefined // Remove React element
    } : null;
    
    const cleanSelectedServices = selectedCourses.length > 0 
      ? servicesData.filter(s => selectedCourses.includes(s.id)).map(s => ({
          ...s,
          icon: undefined // Remove React elements
        }))
      : cleanService ? [cleanService] : [];
    
    // If user is logged in, proceed to booking flow
    navigate('/booking', { 
      state: { 
        service: cleanService,
        selectedServices: cleanSelectedServices
      } 
    });
  }, [currentUser, navigate, selectedCourses, servicesData]);

  const handleTabChange = useCallback((key) => {
    setActiveTab(key);
    setSelectedCourse(null); // Reset selection when switching tabs
    setSelectedCourses([]);
    // The useEffect in TabContent will auto-select the first course in the new tab
  }, []);

  const CourseListItem = memo(({ service, isSelected, isInCart, onSelect, onToggleCart }) => (
    <div
      style={{
        background: isSelected ? themeStyles.selectedBg : themeStyles.listItemBg,
        border: `2px solid ${isSelected ? themeStyles.selectedBorder : themeStyles.cardBorder}`,
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '16px',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        height: '180px', // Fixed height instead of minHeight
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isSelected 
          ? `0 8px 32px ${themeStyles.shadowColor || 'rgba(0,0,0,0.1)'}, 0 0 0 1px ${themeStyles.selectedBorder}20`
          : `0 4px 16px ${themeStyles.shadowColor || 'rgba(0,0,0,0.05)'}`,
        backdropFilter: 'blur(10px)',
        transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
        overflow: 'hidden', // Ensure content doesn't overflow
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect(service);
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = themeStyles.listItemHover;
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = `0 12px 40px ${themeStyles.shadowColor || 'rgba(0,0,0,0.15)'}`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = themeStyles.listItemBg;
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = `0 4px 16px ${themeStyles.shadowColor || 'rgba(0,0,0,0.05)'}`;
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

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', paddingRight: '40px', height: '100%' }}>
        <div style={{
          padding: '12px',
          borderRadius: '12px',
          background: themeStyles.gradientPrimary,
          color: 'white',
          fontSize: '20px',
          flexShrink: 0,
          boxShadow: `0 4px 12px ${themeStyles.shadowColor || 'rgba(0,0,0,0.1)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px'
        }}>
          {service.icon}
        </div>
        
        <div style={{ 
          flex: 1, 
          minWidth: 0, 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          justifyContent: 'space-between'
        }}>
          {/* Header section - fixed space */}
          <div style={{ flex: '0 0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <Title level={5} style={{ 
                color: themeStyles.textPrimary, 
                margin: 0,
                fontSize: '15px',
                fontWeight: '700',
                letterSpacing: '-0.01em',
                lineHeight: '1.2'
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
                  color: '#1f2937',
                  fontWeight: '600',
                  borderRadius: '9px',
                  padding: '0 6px'
                }} 
              />
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              marginBottom: '10px'
            }}>
              <CalendarOutlined style={{ color: themeStyles.textSecondary, fontSize: '12px' }} />
              <Text style={{ color: themeStyles.textSecondary, fontSize: '12px', fontWeight: '500' }}>
                {service.duration}
              </Text>
            </div>
          </div>

          {/* Description section - fills remaining space */}
          <div style={{ flex: '1 1 auto', overflow: 'hidden' }}>
            <div style={{ 
              color: themeStyles.textSecondary,
              fontSize: '13px',
              margin: 0,
              lineHeight: '1.3',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontWeight: '400',
              letterSpacing: '0.005em',
              textOverflow: 'ellipsis',
              wordBreak: 'break-word',
              hyphens: 'auto'
            }}>
              {service.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  const CourseDetailsPanel = memo(({ service }) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // Reset expanded state when service changes
    React.useEffect(() => {
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
          boxShadow: `0 8px 32px ${themeStyles.shadowColor || 'rgba(0,0,0,0.08)'}`,
          backdropFilter: 'blur(20px)',
        }}>
          <Empty 
            description={
              <Text style={{ color: themeStyles.textSecondary, fontSize: '16px', fontWeight: '500' }}>
                Select a course to view details
              </Text>
            }
            imageStyle={{ height: 120 }}
          />
        </div>
      );
    }

    return (
      <div style={{
        background: themeStyles.cardBg,
        border: `1px solid ${themeStyles.cardBorder}`,
        borderRadius: '24px',
        padding: '32px',
        height: 'fit-content',
        minHeight: '500px',
        boxShadow: `0 8px 32px ${themeStyles.shadowColor || 'rgba(0,0,0,0.08)'}`,
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
            boxShadow: `0 6px 24px ${themeStyles.shadowColor || 'rgba(0,0,0,0.15)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {service.icon}
          </div>
          <div style={{ flex: 1 }}>
            <Title level={2} style={{ 
              color: themeStyles.textPrimary, 
              margin: '0 0 12px 0',
              fontSize: '28px',
              fontWeight: '800',
              letterSpacing: '-0.03em',
              lineHeight: '1.2'
            }}>
              {service.title}
            </Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <Badge count={service.category} style={{ 
                background: themeStyles.gradientSecondary,
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

        {/* Description with Read More */}
        <div style={{ marginBottom: '32px' }}>
          <Title level={4} style={{ 
            color: themeStyles.textPrimary,
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '700'
          }}>
            About This Program
          </Title>
          <div style={{ position: 'relative' }}>
            <Paragraph style={{ 
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
                maxHeight: '128px', // Max height for exactly 5 lines (16px * 1.6 * 5)
                textOverflow: 'ellipsis'
              })
            }}>
              {service.description}
            </Paragraph>
            {service.description && service.description.length > 120 && (
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
                  transition: 'all 0.3s ease'
                }}
              >
                {isDescriptionExpanded ? '← Read Less' : 'Read More →'}
              </Button>
            )}
          </div>
        </div>

        {/* Key Features */}
        <div style={{ marginBottom: '32px' }}>
          <Title level={4} style={{ 
            color: themeStyles.textPrimary,
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '700'
          }}>
            What's Included
          </Title>
          <div style={{ 
            display: 'grid', 
            gap: '16px',
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
                transition: 'all 0.3s ease'
              }}>
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
                  fontWeight: '500'
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
            fontWeight: '700'
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
            boxShadow: `0 4px 20px ${themeStyles.shadowColor || 'rgba(0,0,0,0.05)'}`
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
                transition: 'all 0.3s ease'
              }}>
                <div>
                  <Text strong style={{ 
                    color: themeStyles.textPrimary,
                    fontSize: '16px',
                    display: 'block',
                    fontWeight: '700',
                    marginBottom: '4px'
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
                    lineHeight: '1'
                  }}>
                    ₹{option.price}
                  </Text>
                  <Text style={{ 
                    color: themeStyles.textSecondary,
                    fontSize: '12px',
                    opacity: 0.8
                  }}>
                    per {option.duration.toLowerCase()}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Book Now Button */}
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
            boxShadow: `0 6px 24px ${themeStyles.shadowColor || 'rgba(0,0,0,0.15)'}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
          icon={<InfoCircleOutlined style={{ fontSize: '18px' }} />}
          onClick={() => handleBookNow(service)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 8px 32px ${themeStyles.shadowColor || 'rgba(0,0,0,0.25)'}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 6px 24px ${themeStyles.shadowColor || 'rgba(0,0,0,0.15)'}`;
          }}
        >
          Book This Program
        </Button>
      </div>
    );
  });

  const TabContent = ({ groupServices }) => {
    // Auto-select first course when tab changes
    React.useEffect(() => {
      if (groupServices.length > 0) {
        setSelectedCourse(groupServices[0]);
      }
    }, [groupServices, setSelectedCourse]);

    // Handle course selection
    const handleCourseSelect = useCallback((course) => {
      setSelectedCourse(course);
    }, [setSelectedCourse]);

    return (
      <div>

        {/* Two Panel Layout */}
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
              backdropFilter: 'blur(16px)',
              position: 'relative',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: themeStyles.cardBorder,
                borderRadius: '10px',
              }
            }}>
              <Title level={3} style={{ 
                color: themeStyles.textPrimary,
                marginBottom: '28px',
                fontSize: '22px',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                background: themeStyles.gradientPrimary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                position: 'relative',
                paddingBottom: '16px'
              }}>
                Available Programs
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '60px',
                  height: '3px',
                  background: themeStyles.gradientPrimary,
                  borderRadius: '2px'
                }}></div>
              </Title>
              {groupServices.map((service) => (
                <CourseListItem
                  key={service.id}
                  service={service}
                  isSelected={selectedCourse?.id === service.id}
                  isInCart={selectedCourses.includes(service.id)}
                  onSelect={handleCourseSelect}
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
          key={`${group.id}-${groupServices.length}`} // Force re-render with key
          groupServices={groupServices}
        />
      )
    };
  });

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div style={{ 
      background: themeStyles.background, 
      minHeight: '100vh',
    }}>
      {/* Hero Skeleton */}
      <div style={{ 
        background: themeStyles.containerBg,
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Skeleton.Input 
            style={{ width: '400px', height: '48px', marginBottom: '16px' }} 
            active 
            size="large"
          />
          <Skeleton 
            paragraph={{ rows: 2, width: ['100%', '80%'] }} 
            title={false} 
            active 
          />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 20px 80px'
      }}>
        <div style={{
          background: themeStyles.containerBg,
          borderRadius: '24px',
          padding: '32px',
        }}>
          {/* Tabs Skeleton */}
          <div style={{
            background: themeStyles.cardBg,
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'center',
            gap: '16px'
          }}>
            {[1, 2, 3, 4].map(i => (
              <Skeleton.Button 
                key={i}
                style={{ width: '120px', height: '40px' }} 
                active 
                size="large"
              />
            ))}
          </div>

          {/* Content Skeleton */}
          <Row gutter={24}>
            {/* Left Panel Skeleton */}
            <Col xs={24} lg={10}>
              <div style={{
                background: themeStyles.cardBg,
                borderRadius: '20px',
                padding: '20px'
              }}>
                <Skeleton.Input 
                  style={{ width: '200px', height: '24px', marginBottom: '20px' }} 
                  active 
                />
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    background: themeStyles.listItemBg,
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <Skeleton.Avatar size={48} active />
                      <div style={{ flex: 1 }}>
                        <Skeleton 
                          paragraph={{ rows: 2, width: ['80%', '60%'] }} 
                          title={{ width: '40%' }} 
                          active 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>

            {/* Right Panel Skeleton */}
            <Col xs={24} lg={14}>
              <div style={{
                background: themeStyles.cardBg,
                borderRadius: '20px',
                padding: '24px',
                minHeight: '500px'
              }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <Skeleton.Avatar size={64} active />
                  <div style={{ flex: 1 }}>
                    <Skeleton 
                      paragraph={{ rows: 3, width: ['60%', '40%', '80%'] }} 
                      title={{ width: '50%' }} 
                      active 
                    />
                  </div>
                </div>
                <Skeleton paragraph={{ rows: 4 }} active />
                <Skeleton.Button 
                  style={{ width: '100%', height: '48px', marginTop: '24px' }} 
                  active 
                  size="large"
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
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
            style={{ borderRadius: '12px' }}
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
          backdropFilter: 'blur(32px)',
          border: `1px solid ${themeStyles.cardBorder}`,
          boxShadow: theme === 'dark' 
            ? `0 24px 80px ${themeStyles.shadowColor}, 0 8px 32px ${themeStyles.shadowColorStrong}` 
            : `0 24px 80px ${themeStyles.shadowColor}, 0 8px 32px ${themeStyles.shadowColorStrong}`,
          position: 'relative',
          overflow: 'hidden',
          animation: 'slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
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
                backdropFilter: 'blur(16px)',
              }}
              size="large"
              centered
            />
          ) : (
            <Empty 
              description="No services available"
              style={{ padding: '60px 0' }}
            />
          )}
        </div>
      </div>

      {/* Call to Action */}
      <CallToAction theme={theme} />
    </div>
  );
};

export default Services;