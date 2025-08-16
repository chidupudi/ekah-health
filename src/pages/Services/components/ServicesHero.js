// pages/Services/components/ServicesHero.js
import React from 'react';
import { Typography, Row, Col } from 'antd';
import { 
  HeartOutlined, 
  UserOutlined, 
  MedicineBoxOutlined,
  TeamOutlined 
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ServicesHero = ({ theme }) => {
  const getThemeStyles = () => {
    if (theme === 'dark') {
      return {
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.75)',
        gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        cardBg: 'rgba(255, 255, 255, 0.08)',
        cardBorder: 'rgba(255, 255, 255, 0.15)',
      };
    } else {
      return {
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        cardBg: 'rgba(255, 255, 255, 0.9)',
        cardBorder: 'rgba(0, 0, 0, 0.08)',
      };
    }
  };

  const themeStyles = getThemeStyles();

  const stats = [
    { icon: <HeartOutlined />, number: '500+', label: 'Happy Clients' },
    { icon: <UserOutlined />, number: '10+', label: 'Programs' },
    { icon: <MedicineBoxOutlined />, number: '5+', label: 'Years Experience' },
    { icon: <TeamOutlined />, number: '1000+', label: 'Sessions Conducted' },
  ];

  return (
    <div style={{ 
      padding: '100px 20px 80px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: themeStyles.gradientPrimary,
        borderRadius: '50%',
        opacity: 0.1,
        filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '150px',
        height: '150px',
        background: themeStyles.gradientPrimary,
        borderRadius: '50%',
        opacity: 0.1,
        filter: 'blur(30px)',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Main Hero Content */}
        <div style={{ marginBottom: '60px' }}>
          <Title 
            level={1} 
            style={{ 
              color: themeStyles.textPrimary,
              marginBottom: '24px',
              fontSize: '3.5rem',
              fontWeight: '800',
              background: themeStyles.gradientPrimary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.2',
            }}
          >
            Wellness Programs by
            <br />
            <span style={{ fontSize: '2.8rem' }}>Dr. Gundala Abhinaya</span>
          </Title>
          
          <Paragraph style={{ 
            color: themeStyles.textSecondary,
            fontSize: '1.25rem',
            maxWidth: '700px',
            margin: '0 auto 40px',
            lineHeight: '1.8',
            fontWeight: '400',
          }}>
            Discover personalized health and wellness programs designed with ancient wisdom 
            and modern science. From women's health to pregnancy care, we offer comprehensive 
            natural healing solutions tailored just for you.
          </Paragraph>

          
        </div>

       
        
      </div>
    </div>
  );
};

export default ServicesHero;