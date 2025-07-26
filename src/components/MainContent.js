// src/components/MainContent.js
import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Leaf, 
  Star, 
  Users, 
  Stethoscope, 
  BookOpen, 
  Award, 
  Calendar, 
  Play,
  Clock,
  DollarSign,
  User,
  MapPin
} from 'lucide-react';
import { colors } from '../styles/colors';

const MainContent = ({ isMobile }) => {
  const [selectedCourse, setSelectedCourse] = useState(0);

  const courses = [
    { 
      id: 1, 
      name: 'YONI AROGYA', 
      category: 'Programs', 
      icon: Heart, 
      description: 'Comprehensive women\'s wellness program focusing on hormonal balance, reproductive health, and emotional well-being through ancient Ayurvedic practices.',
      duration: '8 weeks',
      sessions: 16,
      price: '$299',
      level: 'Beginner to Advanced',
      instructor: 'Dr. Priya Sharma',
      nextStart: 'Feb 15, 2024',
      color: '#FF6B6B',
      highlights: ['Hormonal Balance', 'Reproductive Health', 'Emotional Wellness', 'Ayurvedic Practices']
    },
    { 
      id: 2, 
      name: 'SWASTHA AROGYA', 
      category: 'Programs', 
      icon: Leaf, 
      description: 'Complete holistic health transformation program combining yoga, meditation, nutrition, and lifestyle modifications.',
      duration: '12 weeks',
      sessions: 24,
      price: '$399',
      level: 'All Levels',
      instructor: 'Dr. Raj Patel',
      nextStart: 'Feb 20, 2024',
      color: '#4ECDC4',
      highlights: ['Yoga Practice', 'Meditation', 'Nutrition Guidance', 'Lifestyle Changes']
    },
    { 
      id: 3, 
      name: 'GARBHINI AROGYA', 
      category: 'Programs', 
      icon: Heart, 
      description: 'Specialized prenatal wellness program supporting mothers through pregnancy with safe yoga practices.',
      duration: '9 months',
      sessions: 36,
      price: '$599',
      level: 'Prenatal',
      instructor: 'Dr. Meera Joshi',
      nextStart: 'Feb 25, 2024',
      color: '#45B7D1',
      highlights: ['Safe Prenatal Yoga', 'Breathing Techniques', 'Emotional Support', 'Birth Preparation']
    },
    { 
      id: 4, 
      name: 'GHARBHA SANSKAR', 
      category: 'Programs', 
      icon: Star, 
      description: 'Ancient practice of prenatal education focusing on holistic development of the unborn child.',
      duration: '6 months',
      sessions: 24,
      price: '$499',
      level: 'Prenatal',
      instructor: 'Guru Ananda',
      nextStart: 'Mar 1, 2024',
      color: '#F9CA24',
      highlights: ['Prenatal Music', 'Mantras & Chanting', 'Positive Visualization', 'Holistic Development']
    },
    { 
      id: 5, 
      name: 'NARI AROGYA CLASSES', 
      category: 'Programs', 
      icon: Users, 
      description: 'Group wellness classes specifically designed for women covering menstrual health to menopause.',
      duration: '4 weeks',
      sessions: 8,
      price: '$199',
      level: 'All Ages',
      instructor: 'Dr. Kavita Singh',
      nextStart: 'Feb 18, 2024',
      color: '#6C5CE7',
      highlights: ['Menstrual Health', 'Menopause Support', 'Group Sessions', 'Peer Support']
    },
    { 
      id: 6, 
      name: 'DR CONSULTATION', 
      category: 'Services', 
      icon: Stethoscope, 
      description: 'One-on-one consultation with certified health practitioners for personalized wellness assessment.',
      duration: '1 hour',
      sessions: 1,
      price: '$99',
      level: 'Individual',
      instructor: 'Various Doctors',
      nextStart: 'Available Now',
      color: '#A8E6CF',
      highlights: ['Personalized Assessment', 'Treatment Planning', 'Expert Guidance', 'Follow-up Support']
    },
    { 
      id: 7, 
      name: 'CONSULTATION + DIET', 
      category: 'Services', 
      icon: BookOpen, 
      description: 'Comprehensive consultation with detailed nutritional analysis and personalized diet chart.',
      duration: '1.5 hours',
      sessions: 1,
      price: '$149',
      level: 'Individual',
      instructor: 'Dr. Nutrition Team',
      nextStart: 'Available Now',
      color: '#FFB7B2',
      highlights: ['Nutritional Analysis', 'Custom Diet Plan', 'Lifestyle Recommendations', 'Progress Tracking']
    },
    { 
      id: 8, 
      name: 'NATUROPATHY', 
      category: 'Services', 
      icon: Leaf, 
      description: 'Natural diagnostic approach using traditional methods to identify imbalances.',
      duration: '45 mins',
      sessions: 1,
      price: '$79',
      level: 'All Levels',
      instructor: 'Dr. Nature Healers',
      nextStart: 'Available Now',
      color: '#FFDAB9',
      highlights: ['Natural Diagnosis', 'Traditional Methods', 'Healing Protocols', 'Holistic Approach']
    },
    { 
      id: 9, 
      name: 'ACUPUNCTURE', 
      category: 'Services', 
      icon: Award, 
      description: 'Traditional Chinese medicine practice using fine needles for pain relief and healing.',
      duration: '1 hour',
      sessions: 1,
      price: '$89',
      level: 'Therapeutic',
      instructor: 'Licensed Acupuncturists',
      nextStart: 'Available Now',
      color: '#E6E6FA',
      highlights: ['Pain Relief', 'Energy Balance', 'Traditional TCM', 'Therapeutic Healing']
    }
  ];

  const currentCourse = courses[selectedCourse];

  // Auto-advance carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedCourse(prev => (prev + 1) % courses.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [courses.length]);

  const mainContentStyle = {
    marginLeft: 0,
    padding: 0,
    background: colors.accentGradient,
    minHeight: 'calc(100vh - 80px)',
    color: colors.lightSlateGray,
    display: 'flex',
    position: 'relative',
    overflow: 'hidden'
  };

  const carouselContainerStyle = {
    width: isMobile ? '100%' : '500px',
    height: 'calc(100vh - 80px)',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    background: `linear-gradient(60deg, ${colors.powderBlue}dd, ${colors.celadon}dd)`,
    backdropFilter: 'blur(10px)'
  };

  const carouselStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '450px',
    height: '80%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
  };

  const mainDisplayStyle = {
    flex: 1,
    padding: isMobile ? '2rem 1rem' : '3rem',
    background: colors.cardGradient,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  };

  const courseDetailStyle = {
    textAlign: 'center',
    maxWidth: '800px',
    width: '100%'
  };

  const titleStyle = {
    fontSize: isMobile ? '2.5rem' : '4rem',
    fontWeight: 'bold',
    background: `linear-gradient(135deg, ${currentCourse?.color}, ${currentCourse?.color}dd)`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 1rem 0',
    textShadow: `0 4px 8px ${currentCourse?.color}33`
  };

  const subtitleStyle = {
    fontSize: isMobile ? '1.2rem' : '1.8rem',
    color: colors.lightSlateGray,
    margin: '0 0 2rem 0',
    opacity: 0.8
  };

  const descriptionStyle = {
    fontSize: isMobile ? '1rem' : '1.3rem',
    lineHeight: '1.8',
    color: colors.lightSlateGray,
    margin: '0 0 3rem 0',
    padding: '2rem',
    background: `${currentCourse?.color}11`,
    borderRadius: '20px',
    border: `2px solid ${currentCourse?.color}33`
  };

  const metaGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
    gap: '1.5rem',
    margin: '3rem 0',
    width: '100%'
  };

  const metaItemStyle = {
    background: 'rgba(255,255,255,0.9)',
    padding: '1.5rem',
    borderRadius: '15px',
    textAlign: 'center',
    border: `2px solid ${currentCourse?.color}33`,
    boxShadow: `0 8px 25px ${colors.shadowColor}`
  };

  const ctaButtonStyle = {
    background: `linear-gradient(135deg, ${currentCourse?.color}, ${currentCourse?.color}dd)`,
    border: 'none',
    borderRadius: '30px',
    padding: '1.5rem 4rem',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1.3rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: `0 12px 35px ${currentCourse?.color}44`,
    margin: '2rem 0'
  };

  // Animation styles for carousel items
  const getCarouselItemStyle = (index) => {
    const animationDelay = (27 / courses.length) * (index - 1);
    
    return {
      display: 'flex',
      alignItems: 'center',
      position: 'absolute',
      width: '100%',
      padding: '0 12px',
      opacity: 0,
      filter: 'drop-shadow(0 2px 2px #555)',
      willChange: 'transform, opacity',
      animation: `carouselAnimateVertical 27s linear infinite`,
      animationDelay: `${animationDelay}s`
    };
  };

  const carouselItemHeadStyle = (course) => ({
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${course.color}, ${course.color}dd)`,
    width: '90px',
    height: '90px',
    padding: '14px',
    position: 'relative',
    marginRight: '-45px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 8px 25px ${course.color}44`
  });

  const carouselItemBodyStyle = (course) => ({
    width: '100%',
    background: '#fff',
    borderRadius: '12px',
    padding: '16px 20px 16px 70px',
    border: `2px solid ${course.color}33`,
    boxShadow: `0 6px 20px ${colors.shadowColor}`
  });

  const carouselTitleStyle = {
    textTransform: 'uppercase',
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    color: colors.lightSlateGray
  };

  const carouselMetaStyle = {
    fontSize: '12px',
    color: colors.lightSlateGray,
    opacity: 0.8,
    margin: 0
  };

  if (!currentCourse) return null;

  const IconComponent = currentCourse.icon;

  return (
    <main style={mainContentStyle}>
      <style>
        {`
          @keyframes carouselAnimateVertical {
            0% {
              transform: translateY(100%) scale(0.5);
              opacity: 0;
              visibility: hidden;
            }
            3%, 11.11% {
              transform: translateY(100%) scale(0.7);
              opacity: 0.4;
              visibility: visible;
            }
            14.11%, 22.22% {
              transform: translateY(0) scale(1);
              opacity: 1;
              visibility: visible;
            }
            25.22%, 33.33% {
              transform: translateY(-100%) scale(0.7);
              opacity: 0.4;
              visibility: visible;
            }
            36.33% {
              transform: translateY(-100%) scale(0.5);
              opacity: 0;
              visibility: visible;
            }
            100% {
              transform: translateY(-100%) scale(0.5);
              opacity: 0;
              visibility: hidden;
            }
          }
        `}
      </style>

      {/* Animated Vertical Carousel */}
      <div style={carouselContainerStyle}>
        <div style={carouselStyle}>
          {courses.map((course, index) => {
            const CourseIcon = course.icon;
            return (
              <div
                key={course.id}
                style={getCarouselItemStyle(index)}
                onClick={() => setSelectedCourse(index)}
              >
                <div style={carouselItemHeadStyle(course)}>
                  <CourseIcon size={40} color="#fff" />
                </div>
                <div style={carouselItemBodyStyle(course)}>
                  <p style={carouselTitleStyle}>{course.name}</p>
                  <p style={carouselMetaStyle}>
                    {course.duration} • {course.price}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Course Display */}
      <div style={mainDisplayStyle}>
        <div style={courseDetailStyle}>
          <h1 style={titleStyle}>
            {currentCourse.name}
          </h1>
          
          <p style={subtitleStyle}>
            {currentCourse.category} • {currentCourse.level}
          </p>

          <p style={descriptionStyle}>
            {currentCourse.description}
          </p>

          <div style={metaGridStyle}>
            <div style={metaItemStyle}>
              <Clock size={24} color={currentCourse.color} style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ margin: '0 0 0.25rem 0', color: currentCourse.color }}>Duration</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{currentCourse.duration}</p>
            </div>
            
            <div style={metaItemStyle}>
              <DollarSign size={24} color={currentCourse.color} style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ margin: '0 0 0.25rem 0', color: currentCourse.color }}>Price</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{currentCourse.price}</p>
            </div>
            
            <div style={metaItemStyle}>
              <User size={24} color={currentCourse.color} style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ margin: '0 0 0.25rem 0', color: currentCourse.color }}>Instructor</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{currentCourse.instructor}</p>
            </div>
            
            <div style={metaItemStyle}>
              <MapPin size={24} color={currentCourse.color} style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ margin: '0 0 0.25rem 0', color: currentCourse.color }}>Next Start</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{currentCourse.nextStart}</p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            margin: '2rem 0'
          }}>
            {currentCourse.highlights.map((highlight, index) => (
              <span
                key={index}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: `${currentCourse.color}22`,
                  color: currentCourse.color,
                  borderRadius: '25px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  border: `2px solid ${currentCourse.color}44`
                }}
              >
                {highlight}
              </span>
            ))}
          </div>

          <button 
            style={ctaButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
              e.currentTarget.style.boxShadow = `0 20px 50px ${currentCourse.color}66`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = `0 12px 35px ${currentCourse.color}44`;
            }}
          >
            <Play size={24} />
            Enroll Now
          </button>
        </div>
      </div>
    </main>
  );
};

export default MainContent;