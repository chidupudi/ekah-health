// src/components/MainContent.js
import React from 'react';
import { Heart, Users, BookOpen, Clock, Award } from 'lucide-react';
import { colors } from '../styles/colors';

const MainContent = ({ isMobile }) => {
  const mainContentStyle = {
    marginLeft: isMobile ? '0' : '320px',
    padding: isMobile ? '1rem' : '2rem',
    background: colors.accentGradient,
    minHeight: 'calc(100vh - 80px)',
    color: colors.lightSlateGray,
    transition: 'margin-left 0.3s ease'
  };

  const welcomeCardStyle = {
    background: colors.cardGradient,
    borderRadius: '20px',
    padding: isMobile ? '2rem 1.5rem' : '3rem 2rem',
    boxShadow: `0 10px 40px ${colors.shadowColor}`,
    marginBottom: '2rem',
    textAlign: 'center',
    border: `1px solid ${colors.borderColor}`
  };

  const welcomeHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap'
  };

  const welcomeTitleStyle = {
    fontSize: isMobile ? '1.8rem' : '2.5rem',
    margin: 0,
    background: colors.primaryGradient,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold'
  };

  const welcomeTextStyle = {
    fontSize: isMobile ? '1rem' : '1.2rem',
    opacity: 0.8,
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6'
  };

  const statsStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem'
  };

  const statCardStyle = {
    background: 'rgba(255,255,255,0.9)',
    borderRadius: '15px',
    padding: isMobile ? '1.5rem' : '2rem',
    textAlign: 'center',
    boxShadow: `0 8px 25px ${colors.shadowColor}`,
    border: `1px solid ${colors.borderColor}`,
    transition: 'transform 0.3s ease'
  };

  const statIconStyle = {
    margin: '0 auto 1rem',
    display: 'block'
  };

  const statNumberStyle = {
    margin: '0 0 0.5rem 0',
    color: colors.lightSlateGray,
    fontSize: isMobile ? '1.5rem' : '1.8rem',
    fontWeight: 'bold'
  };

  const statLabelStyle = {
    margin: 0,
    opacity: 0.8,
    fontSize: isMobile ? '0.9rem' : '1rem'
  };

  const featuresStyle = {
    marginTop: '3rem'
  };

  const featuresSectionStyle = {
    background: 'rgba(255,255,255,0.9)',
    borderRadius: '20px',
    padding: isMobile ? '2rem 1.5rem' : '3rem',
    boxShadow: `0 10px 40px ${colors.shadowColor}`,
    border: `1px solid ${colors.borderColor}`
  };

  const featuresTitleStyle = {
    fontSize: isMobile ? '1.5rem' : '2rem',
    fontWeight: 'bold',
    color: colors.lightSlateGray,
    marginBottom: '2rem',
    textAlign: 'center',
    background: colors.secondaryGradient,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  const featuresGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  };

  const featureItemStyle = {
    textAlign: 'center',
    padding: '1.5rem'
  };

  const featureIconWrapperStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: colors.primaryGradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
    boxShadow: `0 4px 15px ${colors.shadowColor}`
  };

  const featureTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: colors.lightSlateGray,
    marginBottom: '0.5rem'
  };

  const featureDescriptionStyle = {
    color: colors.lightSlateGray,
    opacity: 0.8,
    lineHeight: '1.6'
  };

  const ctaStyle = {
    marginTop: '3rem'
  };

  const ctaSectionStyle = {
    background: colors.primaryGradient,
    borderRadius: '20px',
    padding: isMobile ? '2rem 1.5rem' : '3rem',
    textAlign: 'center',
    boxShadow: `0 10px 40px ${colors.shadowColor}`
  };

  const ctaTitleStyle = {
    fontSize: isMobile ? '1.5rem' : '2rem',
    fontWeight: 'bold',
    color: colors.lightSlateGray,
    marginBottom: '1rem'
  };

  const ctaTextStyle = {
    fontSize: isMobile ? '1rem' : '1.1rem',
    color: colors.lightSlateGray,
    opacity: 0.9,
    marginBottom: '2rem',
    lineHeight: '1.6'
  };

  const ctaButtonStyle = {
    background: 'rgba(255,255,255,0.9)',
    color: colors.lightSlateGray,
    border: 'none',
    borderRadius: '25px',
    padding: '1rem 2rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: `0 4px 15px ${colors.shadowColor}`
  };

  const handleStatCardHover = (e, isEntering) => {
    if (isEntering) {
      e.currentTarget.style.transform = 'translateY(-5px)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
    }
  };

  const handleCtaButtonHover = (e, isEntering) => {
    if (isEntering) {
      e.target.style.background = colors.ghostWhite;
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
    } else {
      e.target.style.background = 'rgba(255,255,255,0.9)';
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = `0 4px 15px ${colors.shadowColor}`;
    }
  };

  const features = [
    {
      icon: Heart,
      title: 'Holistic Wellness',
      description: 'Comprehensive approach to mental and physical well-being through traditional and modern practices.'
    },
    {
      icon: Users,
      title: 'Expert Guidance',
      description: 'Learn from certified professionals with years of experience in yoga, meditation, and mental health.'
    },
    {
      icon: BookOpen,
      title: 'Structured Programs',
      description: 'Well-designed courses that progress systematically to ensure effective learning and growth.'
    },
    {
      icon: Award,
      title: 'Proven Results',
      description: 'Evidence-based practices with a track record of helping thousands achieve better mental health.'
    }
  ];

  const statistics = [
    {
      icon: Users,
      number: '5000+',
      label: 'Happy Members'
    },
    {
      icon: BookOpen,
      number: '10+',
      label: 'Wellness Programs'
    },
    {
      icon: Clock,
      number: '24/7',
      label: 'Support Available'
    },
    {
      icon: Award,
      number: '5+ Years',
      label: 'Experience'
    }
  ];

  return (
    <main style={mainContentStyle}>
      {/* Welcome Section */}
      <div style={welcomeCardStyle}>
        <div style={welcomeHeaderStyle}>
          <Heart size={isMobile ? 32 : 40} color={colors.lightSlateGray} />
          <h1 style={welcomeTitleStyle}>
            Welcome to Ekah Health
          </h1>
        </div>
        <p style={welcomeTextStyle}>
          Your journey to holistic wellness begins here. Explore our comprehensive programs and services designed for your mental and physical well-being through the ancient wisdom of yoga and modern therapeutic approaches.
        </p>
      </div>

      {/* Statistics Section */}
      <div style={statsStyle}>
        {statistics.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={index}
              style={statCardStyle}
              onMouseEnter={(e) => handleStatCardHover(e, true)}
              onMouseLeave={(e) => handleStatCardHover(e, false)}
            >
              <IconComponent size={32} color={colors.lightSlateGray} style={statIconStyle} />
              <h3 style={statNumberStyle}>{stat.number}</h3>
              <p style={statLabelStyle}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Features Section */}
      <div style={featuresStyle}>
        <div style={featuresSectionStyle}>
          <h2 style={featuresTitleStyle}>Why Choose Ekah Health?</h2>
          <div style={featuresGridStyle}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} style={featureItemStyle}>
                  <div style={featureIconWrapperStyle}>
                    <IconComponent size={24} color={colors.lightSlateGray} />
                  </div>
                  <h3 style={featureTitleStyle}>{feature.title}</h3>
                  <p style={featureDescriptionStyle}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div style={ctaStyle}>
        <div style={ctaSectionStyle}>
          <h2 style={ctaTitleStyle}>Ready to Start Your Wellness Journey?</h2>
          <p style={ctaTextStyle}>
            Join thousands of others who have transformed their lives through our proven wellness programs. Select a course from the sidebar to begin your path to better mental and physical health.
          </p>
          <button 
            style={ctaButtonStyle}
            onMouseEnter={(e) => handleCtaButtonHover(e, true)}
            onMouseLeave={(e) => handleCtaButtonHover(e, false)}
          >
            Get Started Today
          </button>
        </div>
      </div>
    </main>
  );
};

export default MainContent;