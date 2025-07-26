// src/components/Sidebar.js
import React, { useState } from 'react';
import { 
  Heart, 
  Leaf, 
  Star, 
  Users, 
  Stethoscope, 
  BookOpen, 
  Award, 
  Calendar, 
  ChevronUp,
  ChevronDown,
  X,
  Play
} from 'lucide-react';
import { colors } from '../styles/colors';

const Sidebar = ({ isMobile, isOpen, onClose }) => {
  const [selectedCourse, setSelectedCourse] = useState(0);

  const courses = [
    { 
      id: 1, 
      name: 'YONI AROGYA', 
      category: 'Programs', 
      icon: Heart, 
      description: 'Women\'s wellness program focusing on hormonal balance and reproductive health',
      duration: '8 weeks',
      price: '$299',
      color: '#FF6B6B'
    },
    { 
      id: 2, 
      name: 'SWASTHA AROGYA', 
      category: 'Programs', 
      icon: Leaf, 
      description: 'Complete holistic health transformation program',
      duration: '12 weeks',
      price: '$399',
      color: '#4ECDC4'
    },
    { 
      id: 3, 
      name: 'GARBHINI AROGYA', 
      category: 'Programs', 
      icon: Heart, 
      description: 'Specialized prenatal wellness program',
      duration: '9 months',
      price: '$599',
      color: '#45B7D1'
    },
    { 
      id: 4, 
      name: 'GHARBHA SANSKAR', 
      category: 'Programs', 
      icon: Star, 
      description: 'Ancient prenatal education practice',
      duration: '6 months',
      price: '$499',
      color: '#F9CA24'
    },
    { 
      id: 5, 
      name: 'NARI AROGYA CLASSES', 
      category: 'Programs', 
      icon: Users, 
      description: 'Group wellness classes for women',
      duration: '4 weeks',
      price: '$199',
      color: '#6C5CE7'
    },
    { 
      id: 6, 
      name: 'DR CONSULTATION', 
      category: 'Services', 
      icon: Stethoscope, 
      description: 'One-on-one expert consultation',
      duration: '1 hour',
      price: '$99',
      color: '#A8E6CF'
    },
    { 
      id: 7, 
      name: 'CONSULTATION + DIET', 
      category: 'Services', 
      icon: BookOpen, 
      description: 'Consultation with personalized diet chart',
      duration: '1.5 hours',
      price: '$149',
      color: '#FFB7B2'
    },
    { 
      id: 8, 
      name: 'NATUROPATHY', 
      category: 'Services', 
      icon: Leaf, 
      description: 'Natural diagnostic approach',
      duration: '45 mins',
      price: '$79',
      color: '#FFDAB9'
    },
    { 
      id: 9, 
      name: 'ACUPUNCTURE', 
      category: 'Services', 
      icon: Award, 
      description: 'Traditional Chinese medicine',
      duration: '1 hour',
      price: '$89',
      color: '#E6E6FA'
    },
    { 
      id: 10, 
      name: 'WEEKEND SPECIALS', 
      category: 'Services', 
      icon: Calendar, 
      description: 'Special weekend workshops',
      duration: '2 hours',
      price: '$59',
      color: '#98D8C8'
    }
  ];

  const currentCourse = courses[selectedCourse];

  const sidebarStyle = {
    width: isMobile ? '100%' : '90px',
    height: isMobile ? '100vh' : 'calc(100vh - 80px)',
    position: 'fixed',
    top: isMobile ? 0 : '80px',
    left: isMobile ? (isOpen ? 0 : '-100%') : 0,
    zIndex: isMobile ? 1002 : 999,
    transition: 'left 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem 0',
    backgroundColor: 'transparent'
  };

  const thumbnailContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '2rem',
    paddingBottom: '2rem'
  };

  const thumbnailStyle = (index, isSelected) => ({
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    background: isSelected ? 
      `linear-gradient(135deg, ${courses[index].color}dd, ${courses[index].color}aa)` : 
      `linear-gradient(135deg, ${courses[index].color}44, ${courses[index].color}22)`,
    border: isSelected ? `3px solid ${courses[index].color}` : `2px solid ${courses[index].color}66`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isSelected ? 'scale(1.1) translateX(8px)' : 'scale(1)',
    boxShadow: isSelected ? 
      `0 8px 25px ${courses[index].color}44, 0 0 0 4px ${courses[index].color}22` : 
      `0 4px 15px ${courses[index].color}22`,
    backdropFilter: 'blur(10px)',
    position: 'relative'
  });

  const navButtonStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${colors.celadon}dd, ${colors.powderBlue}dd)`,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: colors.lightSlateGray,
    backdropFilter: 'blur(10px)',
    boxShadow: `0 4px 15px ${colors.shadowColor}`
  };

  const expandedSidebarStyle = {
    width: isMobile ? '100%' : '350px',
    height: isMobile ? '100vh' : 'calc(100vh - 80px)',
    position: 'fixed',
    top: isMobile ? 0 : '80px',
    left: isMobile ? (isOpen ? 0 : '-100%') : '90px',
    zIndex: isMobile ? 1001 : 998,
    background: colors.cardGradient,
    backdropFilter: 'blur(20px)',
    borderRight: `2px solid ${colors.borderColor}`,
    boxShadow: `0 0 50px ${colors.shadowColor}`,
    padding: '2rem',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: selectedCourse !== null ? 'translateX(0)' : 'translateX(-100%)',
    opacity: selectedCourse !== null ? 1 : 0
  };

  const courseCardStyle = {
    background: `linear-gradient(135deg, ${currentCourse?.color}11, transparent)`,
    borderRadius: '20px',
    padding: '2rem',
    border: `2px solid ${currentCourse?.color}33`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backdropFilter: 'blur(10px)'
  };

  const iconWrapperStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    background: `linear-gradient(135deg, ${currentCourse?.color}, ${currentCourse?.color}dd)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    boxShadow: `0 10px 30px ${currentCourse?.color}44`
  };

  const handleThumbnailClick = (index) => {
    setSelectedCourse(index);
  };

  const handlePrevious = () => {
    setSelectedCourse(prev => prev > 0 ? prev - 1 : courses.length - 1);
  };

  const handleNext = () => {
    setSelectedCourse(prev => prev < courses.length - 1 ? prev + 1 : 0);
  };

  const handleNavButtonHover = (e, isEntering) => {
    if (isEntering) {
      e.currentTarget.style.transform = 'scale(1.1)';
      e.currentTarget.style.boxShadow = `0 6px 20px ${colors.shadowColor}`;
    } else {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = `0 4px 15px ${colors.shadowColor}`;
    }
  };

  const handleThumbnailHover = (e, index, isEntering) => {
    if (isEntering && selectedCourse !== index) {
      e.currentTarget.style.transform = 'scale(1.05) translateX(4px)';
      e.currentTarget.style.boxShadow = `0 6px 20px ${courses[index].color}55`;
    } else if (!isEntering && selectedCourse !== index) {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = `0 4px 15px ${courses[index].color}22`;
    }
  };

  if (!currentCourse) return null;

  const IconComponent = currentCourse.icon;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.overlayColor,
            zIndex: 1000
          }}
          onClick={onClose}
        />
      )}

      {/* Thumbnail Navigation Sidebar */}
      <div style={sidebarStyle}>
        {/* Up Navigation Button */}
        <button 
          style={navButtonStyle}
          onClick={handlePrevious}
          onMouseEnter={(e) => handleNavButtonHover(e, true)}
          onMouseLeave={(e) => handleNavButtonHover(e, false)}
        >
          <ChevronUp size={20} />
        </button>

        {/* Thumbnails */}
        <div style={thumbnailContainerStyle}>
          {courses.map((course, index) => {
            const ThumbnailIcon = course.icon;
            return (
              <div
                key={course.id}
                style={thumbnailStyle(index, selectedCourse === index)}
                onClick={() => handleThumbnailClick(index)}
                onMouseEnter={(e) => handleThumbnailHover(e, index, true)}
                onMouseLeave={(e) => handleThumbnailHover(e, index, false)}
              >
                <ThumbnailIcon 
                  size={selectedCourse === index ? 28 : 24} 
                  color="#fff"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }}
                />
                {/* Course number indicator */}
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#fff',
                  color: course.color,
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 2px 8px ${colors.shadowColor}`
                }}>
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Down Navigation Button */}
        <button 
          style={navButtonStyle}
          onClick={handleNext}
          onMouseEnter={(e) => handleNavButtonHover(e, true)}
          onMouseLeave={(e) => handleNavButtonHover(e, false)}
        >
          <ChevronDown size={20} />
        </button>

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              ...navButtonStyle
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Expanded Course Details */}
      <div style={expandedSidebarStyle}>
        <div style={courseCardStyle}>
          <div style={iconWrapperStyle}>
            <IconComponent size={40} color="#fff" />
          </div>

          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 'bold',
            color: colors.lightSlateGray,
            textAlign: 'center',
            margin: '0 0 0.5rem 0'
          }}>
            {currentCourse.name}
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '0 0 1.5rem 0',
            padding: '0.75rem 1rem',
            background: `${currentCourse.color}22`,
            borderRadius: '15px',
            border: `1px solid ${currentCourse.color}44`
          }}>
            <span style={{
              fontSize: '0.9rem',
              color: colors.lightSlateGray,
              fontWeight: '600'
            }}>
              {currentCourse.duration}
            </span>
            <span style={{
              fontSize: '1.2rem',
              color: currentCourse.color,
              fontWeight: 'bold'
            }}>
              {currentCourse.price}
            </span>
          </div>

          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            color: colors.lightSlateGray,
            margin: '0 0 2rem 0',
            flex: 1
          }}>
            {currentCourse.description}
          </p>

          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <span style={{
              padding: '0.5rem 1rem',
              background: `${currentCourse.color}33`,
              color: currentCourse.color,
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              border: `1px solid ${currentCourse.color}66`
            }}>
              {currentCourse.category}
            </span>
          </div>

          <button style={{
            background: `linear-gradient(135deg, ${currentCourse.color}, ${currentCourse.color}dd)`,
            border: 'none',
            borderRadius: '25px',
            padding: '1rem 2rem',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: `0 6px 20px ${currentCourse.color}44`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 8px 25px ${currentCourse.color}66`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 6px 20px ${currentCourse.color}44`;
          }}
          >
            <Play size={18} />
            Start Journey
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;