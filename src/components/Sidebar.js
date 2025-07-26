import React, { useState } from 'react';
import { colors } from '../styles/colors';

const Sidebar = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const courses = [
    { id: 1, name: 'YONI AROGYA', category: 'Programs' },
    { id: 2, name: 'SWASTHA AROGYA', category: 'Programs' },
    { id: 3, name: 'GARBHINI AROGYA', category: 'Programs' },
    { id: 4, name: 'GHARBHA SANSKAR', category: 'Programs' },
    { id: 5, name: 'NARI AROGYA CLASSES', category: 'Programs' },
    { id: 6, name: 'DR CONSULTATION', category: 'Services' },
    { id: 7, name: 'DR CONSULTATION WITH COMPLETE DIET CHART', category: 'Services' },
    { id: 8, name: 'NATUROPATHY DIAGNOSIS', category: 'Services' },
    { id: 9, name: 'ACUPUNCTURE', category: 'Services' },
    { id: 10, name: 'WEEKEND SPECIALS', category: 'Services' }
  ];

  const sidebarStyle = {
    width: '280px',
    height: 'calc(100vh - 80px)',
    backgroundColor: colors.ghostWhite,
    borderRight: `2px solid ${colors.celadon}`,
    padding: '1rem',
    overflowY: 'auto',
    position: 'fixed',
    top: '80px',
    left: 0,
    zIndex: 999
  };

  const headerStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: colors.lightSlateGray,
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: `2px solid ${colors.softGoldenYellow}`
  };

  const categoryStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: colors.lightSlateGray,
    margin: '1.5rem 0 0.5rem 0',
    padding: '0.5rem',
    backgroundColor: colors.celadon,
    borderRadius: '5px'
  };

  const courseItemStyle = {
    padding: '0.75rem 1rem',
    margin: '0.25rem 0',
    backgroundColor: colors.powderBlue,
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    color: colors.lightSlateGray,
    border: '1px solid transparent'
  };

  const selectedItemStyle = {
    ...courseItemStyle,
    backgroundColor: colors.softGoldenYellow,
    border: `1px solid ${colors.lightSlateGray}`,
    fontWeight: 'bold'
  };

  const hoverStyle = {
    backgroundColor: colors.celadon,
    transform: 'translateX(5px)'
  };

  const handleItemClick = (courseId) => {
    setSelectedItem(courseId);
  };

  const renderCoursesByCategory = (category) => {
    return courses
      .filter(course => course.category === category)
      .map(course => (
        <div
          key={course.id}
          style={selectedItem === course.id ? selectedItemStyle : courseItemStyle}
          onClick={() => handleItemClick(course.id)}
          onMouseEnter={(e) => {
            if (selectedItem !== course.id) {
              Object.assign(e.target.style, hoverStyle);
            }
          }}
          onMouseLeave={(e) => {
            if (selectedItem !== course.id) {
              Object.assign(e.target.style, courseItemStyle);
            }
          }}
        >
          {course.name}
        </div>
      ));
  };

  return (
    <div style={sidebarStyle}>
      <div style={headerStyle}>
        My Courses
      </div>
      
      <div style={categoryStyle}>
        Programs
      </div>
      {renderCoursesByCategory('Programs')}
      
      <div style={categoryStyle}>
        Services
      </div>
      {renderCoursesByCategory('Services')}
    </div>
  );
};

export default Sidebar;