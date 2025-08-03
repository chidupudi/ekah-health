// src/components/ui/display-cards.js
import React from 'react';
import { Heart, Shield, Users, Award } from 'lucide-react';

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
        borderColor: 'rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
        background: 'linear-gradient(to left, rgba(0, 0, 0, 0.3) 0%, transparent 100%)',
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
          backgroundColor: 'rgba(30, 64, 175, 0.8)',
          padding: '4px'
        }}>
          {icon}
        </span>
        <p style={{
          fontSize: '18px',
          fontWeight: '500',
          color: 'white',
          margin: 0
        }}>
          {title}
        </p>
      </div>
      
      <p style={{
        whiteSpace: 'nowrap',
        fontSize: '18px',
        color: 'rgba(255, 255, 255, 0.9)',
        margin: 0,
        position: 'relative',
        zIndex: 1
      }}>
        {description}
      </p>
      
      <p style={{
        color: 'rgba(255, 255, 255, 0.7)',
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
          }
          
          .card-2:hover {
            transform: translateX(64px) translateY(-4px) skewY(-8deg) !important;
            filter: grayscale(0%) !important;
            z-index: 2;
          }
          
          .card-3:hover {
            transform: translateX(128px) translateY(40px) skewY(-8deg) !important;
            z-index: 1;
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