import React, { useState } from 'react';
import { Card, Row, Col, Badge, Divider, Typography, Button, Modal, Tag } from 'antd';
import { 
  HeartOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  CheckCircleOutlined,
  MedicineBoxOutlined,
  SmileOutlined,
  WomanOutlined,
  TeamOutlined,
  PhoneOutlined,
  BookOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import { useTheme } from '../components/ParticleBackground';

const { Title, Text, Paragraph } = Typography;

const Services = () => {
  const { theme } = useTheme();
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        background: '#0f0f0f',
        cardBg: 'rgba(255, 255, 255, 0.08)',
        cardBorder: 'rgba(255, 255, 255, 0.15)',
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        gradientSecondary: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        shadowColor: 'rgba(255, 255, 255, 0.1)',
        priceColor: '#4ade80',
        badgeColor: '#f59e0b'
      };
    } else {
      return {
        background: '#f8fafc',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        cardBorder: 'rgba(0, 0, 0, 0.08)',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        gradientSecondary: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        priceColor: '#059669',
        badgeColor: '#d97706'
      };
    }
  };

  const themeStyles = getThemeStyles();

  const servicesData = [
    {
      id: 1,
      title: "YONI AROGYA",
      icon: <WomanOutlined style={{ fontSize: '24px', color: '#e91e63' }} />,
      duration: "3 MONTHS",
      includes: [
        "Complete Diet & Yoga Program",
        "2 Consultations per Month", 
        "Nari Arogya Classes",
        "Eligible for Other Online Programs"
      ],
      options: [
        { type: "Complete Program", price: "3499", duration: "1 Month" },
        { type: "Diet/Yoga Only", price: "1199", duration: "1 Month" }
      ],
      category: "Women's Health",
      description: "Comprehensive program for menstrual health and women's wellness through natural methods."
    },
    {
      id: 2,
      title: "SWASTHA AROGYA", 
      icon: <HeartOutlined style={{ fontSize: '24px', color: '#2196f3' }} />,
      duration: "3 MONTHS",
      includes: [
        "Complete Diet & Yoga Program",
        "2 Consultations per Month",
        "Disease-specific Diet Plans", 
        "General Health Yoga"
      ],
      options: [
        { type: "Complete Program", price: "3500", duration: "1 Month" },
        { type: "Specific Diet/Yoga", price: "1199", duration: "1 Month" }
      ],
      category: "General Health",
      description: "Holistic health program combining personalized diet and yoga for overall wellness."
    },
    {
      id: 3,
      title: "GARBHINI AROGYA",
      icon: <SmileOutlined style={{ fontSize: '24px', color: '#ff9800' }} />,
      duration: "3 MONTHS (3rd Trimester)",
      includes: [
        "Pregnancy Yoga (4 days/week)",
        "Pranayama Techniques",
        "Meditation Sessions",
        "Safe Exercise Routines"
      ],
      options: [
        { type: "Complete Program", price: "999", duration: "1 Month" }
      ],
      category: "Pregnancy Care",
      description: "Specialized yoga and wellness program for expecting mothers in their third trimester."
    },
    {
      id: 4,
      title: "GARBHA SANSKAR",
      icon: <UserOutlined style={{ fontSize: '24px', color: '#9c27b0' }} />,
      duration: "12 MONTHS (Pre-conception to Delivery)",
      includes: [
        "Pre-conception Body Detox",
        "Nutrition for Couples",
        "Pregnancy Diet Management",
        "Relaxation Techniques",
        "Fetus Connection Sessions",
        "Pelvic Opening Yoga"
      ],
      options: [
        { type: "Complete Journey", price: "Contact", duration: "12 Months" }
      ],
      category: "Pregnancy Journey",
      description: "Complete journey from pre-conception preparation to delivery with comprehensive care."
    },
    {
      id: 5,
      title: "NARI AROGYA CLASSES",
      icon: <BookOutlined style={{ fontSize: '24px', color: '#4caf50' }} />,
      duration: "7 DAYS",
      includes: [
        "Understanding Menstrual Cycle",
        "Hormone Balance Education",
        "Cancer Prevention",
        "Menstrual Hygiene",
        "Natural Disease Management",
        "Naturopathy Treatments"
      ],
      options: [
        { type: "Complete Classes", price: "499", duration: "7 Days" }
      ],
      category: "Education",
      description: "Comprehensive educational program on women's health and natural wellness methods."
    },
    {
      id: 6,
      title: "DR CONSULTATION",
      icon: <MedicineBoxOutlined style={{ fontSize: '24px', color: '#795548' }} />,
      duration: "1 SITTING (30 mins)",
      includes: [
        "Body Composition Analysis",
        "Nadi Pariksha",
        "Diet Modifications",
        "Naturopathy Treatments",
        "General Yoga Chart"
      ],
      options: [
        { type: "Basic Consultation", price: "399", duration: "30 mins" }
      ],
      category: "Consultation",
      description: "Personalized consultation with comprehensive health assessment and recommendations."
    },
    {
      id: 7,
      title: "DR CONSULTATION WITH DIET CHART",
      icon: <CalendarOutlined style={{ fontSize: '24px', color: '#607d8b' }} />,
      duration: "1 SITTING + Monthly Follow-up",
      includes: [
        "Complete Health Assessment",
        "Detailed Diet Chart",
        "Disease-specific Plans",
        "Combination Disease Management",
        "Monthly Guidance"
      ],
      options: [
        { type: "Complete Package", price: "1499", duration: "1 Month" }
      ],
      category: "Consultation Plus",
      description: "Comprehensive consultation with personalized diet charts and ongoing monthly support."
    },
    {
      id: 8,
      title: "NATUROPATHY DIAGNOSIS",
      icon: <ExperimentOutlined style={{ fontSize: '24px', color: '#ff5722' }} />,
      duration: "1 SITTING (20 mins)",
      includes: [
        "Tongue Analysis",
        "Iris Diagnosis", 
        "Elemental Diagnosis",
        "Natural Assessment Methods"
      ],
      options: [
        { type: "Diagnostic Session", price: "199", duration: "20 mins" }
      ],
      category: "Diagnosis",
      description: "Natural diagnostic methods using traditional techniques for health assessment."
    },
    {
      id: 9,
      title: "ACUPUNCTURE",
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#3f51b5' }} />,
      duration: "7 SESSIONS",
      includes: [
        "Nadi Pariksha (1st Day)",
        "Acupuncture Sessions",
        "Traditional Healing Methods",
        "Progress Monitoring"
      ],
      options: [
        { type: "Complete Course", price: "999", duration: "7 Sessions (25 min each)" }
      ],
      category: "Alternative Therapy",
      description: "Traditional acupuncture therapy with initial assessment and multiple sessions."
    },
    {
      id: 10,
      title: "WEEKEND SPECIALS",
      icon: <PhoneOutlined style={{ fontSize: '24px', color: '#8bc34a' }} />,
      duration: "1 HOUR",
      includes: [
        "Pranayama Sessions",
        "Trataka Meditation",
        "108 Surya Namaskara",
        "Krida Yoga (Playful Yoga)"
      ],
      options: [
        { type: "Weekend Session", price: "99", duration: "1 Hour" }
      ],
      category: "Special Programs",
      description: "Special weekend sessions focusing on breathing, meditation, and energizing yoga practices."
    }
  ];

  const showServiceDetails = (service) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  const ServiceCard = ({ service }) => (
    <Card
      hoverable
      style={{
        background: themeStyles.cardBg,
        border: `1px solid ${themeStyles.cardBorder}`,
        borderRadius: '16px',
        boxShadow: `0 8px 32px ${themeStyles.shadowColor}`,
        backdropFilter: 'blur(10px)',
        height: '100%',
        transition: 'all 0.3s ease',
        overflow: 'hidden'
      }}
      bodyStyle={{ padding: '24px' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = `0 16px 64px ${themeStyles.shadowColor}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 8px 32px ${themeStyles.shadowColor}`;
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '12px',
              borderRadius: '12px',
              background: themeStyles.gradientPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {service.icon}
            </div>
            <Badge 
              count={service.category} 
              style={{ 
                backgroundColor: themeStyles.badgeColor,
                fontSize: '10px',
                padding: '0 8px',
                height: '20px',
                lineHeight: '20px'
              }} 
            />
          </div>
        </div>
        
        <Title 
          level={4} 
          style={{ 
            color: themeStyles.textPrimary, 
            marginBottom: '8px',
            fontSize: '18px',
            fontWeight: '600'
          }}
        >
          {service.title}
        </Title>
        
        <Text style={{ 
          color: themeStyles.textSecondary,
          fontSize: '14px',
          display: 'block',
          marginBottom: '16px'
        }}>
          {service.description}
        </Text>
        
        <div style={{ marginBottom: '16px' }}>
          <Text strong style={{ color: themeStyles.textPrimary, fontSize: '12px' }}>
            Duration: {service.duration}
          </Text>
        </div>
      </div>

      <Divider style={{ margin: '16px 0', borderColor: themeStyles.cardBorder }} />
      
      <div style={{ marginBottom: '20px' }}>
        <Text strong style={{ color: themeStyles.textPrimary, marginBottom: '12px', display: 'block' }}>
          Includes:
        </Text>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {service.includes.slice(0, 3).map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircleOutlined style={{ color: themeStyles.priceColor, fontSize: '14px' }} />
              <Text style={{ color: themeStyles.textSecondary, fontSize: '13px' }}>
                {item}
              </Text>
            </div>
          ))}
          {service.includes.length > 3 && (
            <Text style={{ color: themeStyles.textSecondary, fontSize: '12px', fontStyle: 'italic' }}>
              +{service.includes.length - 3} more benefits...
            </Text>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        {service.options.map((option, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: index < service.options.length - 1 ? '8px' : '0'
          }}>
            <Text style={{ color: themeStyles.textSecondary, fontSize: '13px' }}>
              {option.type}
            </Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text strong style={{ 
                color: themeStyles.priceColor, 
                fontSize: '16px',
                fontWeight: '600'
              }}>
                ₹{option.price}
              </Text>
              <Text style={{ color: themeStyles.textSecondary, fontSize: '11px' }}>
                / {option.duration}
              </Text>
            </div>
          </div>
        ))}
      </div>

      <Button 
        type="primary"
        block
        onClick={() => showServiceDetails(service)}
        style={{
          background: themeStyles.gradientPrimary,
          border: 'none',
          borderRadius: '8px',
          height: '40px',
          fontWeight: '600'
        }}
      >
        View Details
      </Button>
    </Card>
  );

  return (
    <div style={{ 
      background: themeStyles.background, 
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Title 
            level={1} 
            style={{ 
              color: themeStyles.textPrimary,
              marginBottom: '16px',
              fontSize: '48px',
              fontWeight: '700',
              background: themeStyles.gradientPrimary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Our Wellness Programs
          </Title>
          <Paragraph style={{ 
            color: themeStyles.textSecondary,
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Discover personalized health and wellness programs designed by Dr. Gundala Abhinaya. 
            From women's health to pregnancy care, we offer comprehensive natural healing solutions.
          </Paragraph>
        </div>

        {/* Services Grid */}
        <Row gutter={[24, 24]}>
          {servicesData.map((service) => (
            <Col key={service.id} xs={24} sm={12} lg={8} xl={6}>
              <ServiceCard service={service} />
            </Col>
          ))}
        </Row>

        {/* Call to Action */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '80px',
          padding: '40px',
          background: themeStyles.cardBg,
          borderRadius: '20px',
          border: `1px solid ${themeStyles.cardBorder}`
        }}>
          <Title level={3} style={{ color: themeStyles.textPrimary, marginBottom: '16px' }}>
            Ready to Start Your Wellness Journey?
          </Title>
          <Paragraph style={{ 
            color: themeStyles.textSecondary, 
            fontSize: '16px',
            marginBottom: '24px',
            maxWidth: '500px',
            margin: '0 auto 24px'
          }}>
            Contact Dr. Gundala Abhinaya today to discuss which program is right for you.
          </Paragraph>
          <Button 
            size="large"
            type="primary"
            style={{
              background: themeStyles.gradientPrimary,
              border: 'none',
              borderRadius: '12px',
              height: '48px',
              padding: '0 32px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Book Consultation
          </Button>
        </div>
      </div>

      {/* Service Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {selectedService?.icon}
            <span>{selectedService?.title}</span>
          </div>
        }
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
          <Button 
            key="book" 
            type="primary"
            style={{
              background: themeStyles.gradientPrimary,
              border: 'none'
            }}
          >
            Book Now
          </Button>
        ]}
        width={600}
        style={{ top: 20 }}
      >
        {selectedService && (
          <div>
            <Tag color="blue" style={{ marginBottom: '16px' }}>
              {selectedService.category}
            </Tag>
            
            <Paragraph style={{ fontSize: '16px', marginBottom: '24px' }}>
              {selectedService.description}
            </Paragraph>
            
            <Title level={5}>Program Duration</Title>
            <Paragraph>{selectedService.duration}</Paragraph>
            
            <Title level={5}>What's Included</Title>
            <div style={{ marginBottom: '24px' }}>
              {selectedService.includes.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text>{item}</Text>
                </div>
              ))}
            </div>
            
            <Title level={5}>Pricing Options</Title>
            {selectedService.options.map((option, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px',
                background: themeStyles.cardBg,
                borderRadius: '8px',
                marginBottom: '8px'
              }}>
                <Text strong>{option.type}</Text>
                <div>
                  <Text strong style={{ color: themeStyles.priceColor, fontSize: '16px' }}>
                    ₹{option.price}
                  </Text>
                  <Text style={{ marginLeft: '8px', color: themeStyles.textSecondary }}>
                    / {option.duration}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Services;