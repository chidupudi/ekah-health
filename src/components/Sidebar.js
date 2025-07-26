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
  ChevronRight, 
  X 
} from 'lucide-react';
import { colors } from '../styles/colors';

const Sidebar = ({ isMobile, isOpen, onClose }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const courses = [
    { 
      id: 1, 
      name: 'YONI AROGYA', 
      category: 'Programs', 
      icon: Heart, 
      description: 'Women\'s wellness program',
      duration: '8 weeks'
    },
    { 
      id: 2, 
      name: 'SWASTHA AROGYA', 
      category: 'Programs', 
      icon: Leaf, 
      description: 'Complete health program',
      duration: '12 weeks'
    },
    { 
      id: 3, 
      name: 'GARBHINI AROGYA', 
      category: 'Programs', 
      icon: Heart, 
      description: 'Pregnancy wellness',
      duration: '9 months'
    },
    { 
      id: 4, 
      name: 'GHARBHA SANSKAR', 
      category: 'Programs', 
      icon: Star, 
      description: 'Prenatal care',
      duration: '6 months'
    },
    { 
      id: 5, 
      name: 'NARI AROGYA CLASSES', 
      category: 'Programs', 
      icon: Users, 
      description: 'Women\'s health classes',
      duration: '4 weeks'
    },
    { 
      id: 6, 
      name: 'DR CONSULTATION', 
      category: 'Services', 
      icon: Stethoscope, 
      description: 'Expert consultation',
      duration: '1 hour'
    },
    { 
      id: 7, 
      name: 'DR CONSULTATION WITH COMPLETE DIET CHART', 
      category: 'Services', 
      icon: BookOpen, 
      description: 'Consultation + diet plan',
      duration: '1.5 hours'
    },
    { 
      id: 8, 
      name: 'NATUROPATHY DIAGNOSIS', 
      category: 'Services', 
      icon: Leaf, 
      description: 'Natural diagnosis',
      duration: '45 mins'
    },
    { 
      id: 9, 
      name: 'ACUPUNCTURE', 
      category: 'Services', 
      icon: Award, 
      description: 'Traditional therapy',
      duration: '1 hour'
    },
    { 
      id: 10, 
      name: 'WEEKEND SPECIALS', 
      category: 'Services', 
      icon: Calendar, 
      description: 'Special weekend sessions',
      duration: '2 hours'
    }
  ];

  const sidebarStyle = {
    width: isMobile ? '100%' : '320px',
    height: isMobile ? '100vh' : 'calc(100vh - 80px)',
    background: colors.cardGradient,
    borderRight: isMobile ? 'none' : `2px solid ${colors.celadon}`,
    padding: '1.5rem',
    overflowY: 'auto',
    position: 'fixed',
    top: isMobile ? 0 : '80px',
    left: isMobile ? (isOpen ? 0 : '-100%') : 0,
    zIndex: isMobile ? 1002 : 999,
    transition: 'left 0.3s ease',
    boxShadow: isMobile ? '4px 0 20px rgba(0,0,0,0.3)' : 'none'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(255,255,255,0.8)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 1003,
    transition: 'all 0.3s ease'
  };

  const headerStyle = {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: colors.lightSlateGray,
    marginBottom: '1.5rem',
    marginTop: isMobile ? '3rem' : '0',
    paddingBottom: '1rem',
    background: colors.primaryGradient,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    borderBottom: `3px solid ${colors.softGoldenYellow}`,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const categoryStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: colors.lightSlateGray,
    margin: '2rem 0 1rem 0',
    padding: '1rem',
    background: colors.secondaryGradient,
    borderRadius: '15px',
    boxShadow: `0 4px 15px ${colors.shadowColor}`,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const courseItemStyle = {
    padding: '1rem 1.5rem',
    margin: '0.5rem 0',
    background: 'rgba(255,255,255,0.8)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.95rem',
    color: colors.lightSlateGray,
    border: `1px solid ${colors.borderColor}`,
    boxShadow: `0 2px 10px ${colors.shadowColor}`,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    position: 'relative',
    overflow: 'hidden'
  };

  const selectedItemStyle = {
    ...courseItemStyle,
    background: colors.primaryGradient,
    border: `2px solid ${colors.lightSlateGray}`,
    fontWeight: 'bold',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
  };

  const courseContentStyle = {
    flex: 1
  };

  const courseNameStyle = {
    fontWeight: '600',
    marginBottom: '0.25rem',
    fontSize: '0.9rem'
  };

  const courseDescriptionStyle = {
    fontSize: '0.8rem',
    opacity: 0.8,
    marginBottom: '0.25rem'
  };

  const courseDurationStyle = {
    fontSize: '0.75rem',
    opacity: 0.7,
    fontStyle: 'italic'
  };

  const handleItemClick = (courseId) => {
    setSelectedItem(courseId);
    if (isMobile && onClose) onClose();
  };

  const handleCourseItemHover = (e, course, isEntering) => {
    if (selectedItem !== course.id) {
      if (isEntering) {
        e.currentTarget.style.transform = 'translateX(8px) translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
      } else {
        e.currentTarget.style.transform = 'translateX(0) translateY(0)';
        e.currentTarget.style.boxShadow = `0 2px 10px ${colors.shadowColor}`;
        e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
      }
    }
  };

  const handleCloseButtonHover = (e, isEntering) => {
    if (isEntering) {
      e.target.style.background = colors.celadon;
      e.target.style.transform = 'scale(1.1)';
    } else {
      e.target.style.background = 'rgba(255,255,255,0.8)';
      e.target.style.transform = 'scale(1)';
    }
  };

  const renderCoursesByCategory = (category) => {
    const categoryIcon = category === 'Programs' ? BookOpen : Stethoscope;
    
    return (
      <>
        <div style={categoryStyle}>
          {React.createElement(categoryIcon, { size: 20 })}
          {category}
        </div>
        {courses
          .filter(course => course.category === category)
          .map(course => {
            const IconComponent = course.icon;
            const isSelected = selectedItem === course.id;
            
            return (
              <div
                key={course.id}
                style={isSelected ? selectedItemStyle : courseItemStyle}
                onClick={() => handleItemClick(course.id)}
                onMouseEnter={(e) => handleCourseItemHover(e, course, true)}
                onMouseLeave={(e) => handleCourseItemHover(e, course, false)}
              >
                <IconComponent size={20} color={colors.lightSlateGray} />
                
                <div style={courseContentStyle}>
                  <div style={courseNameStyle}>
                    {course.name}
                  </div>
                  <div style={courseDescriptionStyle}>
                    {course.description}
                  </div>
                  <div style={courseDurationStyle}>
                    Duration: {course.duration}
                  </div>
                </div>
                
                <ChevronRight size={16} />
              </div>
            );
          })}
      </>
    );
  };

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
            zIndex: 1001
          }}
          onClick={onClose}
        />
      )}
      
      {/* Sidebar content */}
      <div style={sidebarStyle}>
        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={onClose}
            style={closeButtonStyle}
            onMouseEnter={(e) => handleCloseButtonHover(e, true)}
            onMouseLeave={(e) => handleCloseButtonHover(e, false)}
          >
            <X size={20} />
          </button>
        )}
        
        {/* Header */}
        <div style={headerStyle}>
          <BookOpen size={24} />
          My Courses
        </div>
        
        {/* Course categories */}
        {renderCoursesByCategory('Programs')}
        {renderCoursesByCategory('Services')}
      </div>
    </>
  );
};

export default Sidebar;