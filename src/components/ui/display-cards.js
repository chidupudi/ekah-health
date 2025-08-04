// src/components/ui/display-cards.js
import React from 'react';
import { Heart, Shield, Users, Award } from 'lucide-react';
import { useTheme } from '../ParticleBackground';

const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const DisplayCard = ({
  className,
  icon = <Heart style={{ width: '16px', height: '16px', color: '#93c5fd' }} />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-blue-500",
  titleClassName = "text-blue-500",
  style = {}
}) => {
  const { theme } = useTheme();
  
  // Get theme-specific colors for cards
  const getCardColors = () => {
    if (theme === 'dark') {
      return {
        background: 'rgba(255, 255, 255, 0.08)',
        border: 'rgba(255, 255, 255, 0.15)',
        titleColor: '#ffffff',
        descriptionColor: 'rgba(255, 255, 255, 0.8)',
        dateColor: 'rgba(255, 255, 255, 0.6)',
        gradientOverlay: 'linear-gradient(to left, rgba(0, 0, 0, 0.4) 0%, transparent 100%)',
        iconBg: 'rgba(255, 255, 255, 0.15)'
      };
    } else {
      return {
        background: 'rgba(0, 0, 0, 0.08)',
        border: 'rgba(0, 0, 0, 0.15)',
        titleColor: '#000000',
        descriptionColor: 'rgba(0, 0, 0, 0.8)',
        dateColor: 'rgba(0, 0, 0, 0.6)',
        gradientOverlay: 'linear-gradient(to left, rgba(255, 255, 255, 0.4) 0%, transparent 100%)',
        iconBg: 'rgba(0, 0, 0, 0.15)'
      };
    }
  };

  const cardColors = getCardColors();

  return (
    <div
      className={cn(
        "relative flex h-36 w-80 -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 bg-muted/70 backdrop-blur-sm px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-80 after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] hover:border-white/20 hover:bg-muted",
        className
      )}
      style={{
        position: 'relative',
        display: 'flex',
        height: '144px',
        width: '20rem',
        transform: 'skewY(-8deg)',
        userSelect: 'none',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '12px',
        borderWidth: '2px',
        borderColor: cardColors.border,
        backgroundColor: cardColors.background,
        backdropFilter: 'blur(8px)',
        padding: '12px 16px',
        transition: 'all 0.7s ease',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        right: '-4px',
        top: '-5%',
        height: '110%',
        width: '20rem',
        background: cardColors.gradientOverlay,
        content: '""',
        pointerEvents: 'none'
      }} />
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        position: 'relative',
        zIndex: 1
      }}>
        <span style={{
          position: 'relative',
          display: 'inline-block',
          borderRadius: '50%',
          backgroundColor: cardColors.iconBg,
          padding: '4px'
        }}>
          {icon}
        </span>
        <p style={{
          fontSize: '18px',
          fontWeight: '500',
          color: cardColors.titleColor,
          margin: 0
        }}>
          {title}
        </p>
      </div>
      
      <p style={{
        whiteSpace: 'nowrap',
        fontSize: '18px',
        color: cardColors.descriptionColor,
        margin: 0,
        position: 'relative',
        zIndex: 1
      }}>
        {description}
      </p>
      
      <p style={{
        color: cardColors.dateColor,
        fontSize: '14px',
        margin: 0,
        position: 'relative',
        zIndex: 1
      }}>
        {date}
      </p>
    </div>
  );
};

const DisplayCards = ({ cards }) => {
  const { theme } = useTheme();
  
  const defaultCards = [
    {
      className: "card-1",
      style: {
        gridArea: 'stack',
        transform: 'translateY(0px) skewY(-8deg)',
        transition: 'all 0.7s ease',
        filter: 'grayscale(100%)',
        position: 'relative'
      }
    },
    {
      className: "card-2", 
      style: {
        gridArea: 'stack',
        transform: 'translateX(64px) translateY(40px) skewY(-8deg)',
        transition: 'all 0.7s ease',
        filter: 'grayscale(100%)',
        position: 'relative'
      }
    },
    {
      className: "card-3",
      style: {
        gridArea: 'stack',
        transform: 'translateX(128px) translateY(80px) skewY(-8deg)',
        transition: 'all 0.7s ease',
        position: 'relative'
      }
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div style={{
      display: 'grid',
      gridTemplateAreas: '"stack"',
      placeItems: 'center',
      opacity: 1,
      animation: 'fadeIn 0.7s ease-in',
      position: 'relative',
      width: '100%',
      height: '300px'
    }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .card-1:hover {
            transform: translateY(-40px) skewY(-8deg) !important;
            filter: grayscale(0%) !important;
            z-index: 3;
            border-color: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'} !important;
          }
          
          .card-2:hover {
            transform: translateX(64px) translateY(-4px) skewY(-8deg) !important;
            filter: grayscale(0%) !important;
            z-index: 2;
            border-color: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'} !important;
          }
          
          .card-3:hover {
            transform: translateX(128px) translateY(40px) skewY(-8deg) !important;
            z-index: 1;
            border-color: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'} !important;
          }
        `}
      </style>
      {displayCards.map((cardProps, index) => (
        <DisplayCard 
          key={index} 
          {...cardProps}
          className={cardProps.className}
          style={cardProps.style}
        />
      ))}
    </div>
  );
};

export default DisplayCards;