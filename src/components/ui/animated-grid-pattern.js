// src/components/ui/animated-grid-pattern.js

import React, { useEffect, useId, useRef, useState } from "react";
import { cn } from "../../lib/utils";

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  ...props
}) {
  const id = useId();
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [squares, setSquares] = useState([]);

  function getPos() {
    const cols = Math.floor(dimensions.width / width);
    const rows = Math.floor(dimensions.height / height);
    return [
      Math.floor(Math.random() * cols),
      Math.floor(Math.random() * rows),
    ];
  }

  // Generate squares function
  function generateSquares(count) {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      pos: getPos(),
    }));
  }

  // Function to update a single square's position
  const updateSquarePosition = (squareId) => {
    setSquares((currentSquares) =>
      currentSquares.map((sq) =>
        sq.id === squareId
          ? {
              ...sq,
              pos: getPos(),
            }
          : sq,
      ),
    );
  };

  // Initialize squares
  useEffect(() => {
    setSquares(generateSquares(numSquares));
  }, [numSquares]);

  // Update squares when dimensions change
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares));
    }
  }, [dimensions, numSquares]);

  // Resize observer to update container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width || 800,
          height: rect.height || 600,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes gridSquareAnimation {
          0%, 100% { 
            opacity: 0; 
          }
          50% { 
            opacity: ${maxOpacity}; 
          }
        }
      `}</style>
      <svg
        ref={containerRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          ...props.style
        }}
        className={className}
        {...props}
      >
        <defs>
          <pattern
            id={id}
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
            x={x}
            y={y}
          >
            <path
              d={`M.5 ${height}V.5H${width}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray={strokeDasharray}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} opacity="0.3" />
        <g>
          {squares.map(({ pos: [col, row], id: squareId }, index) => (
            <rect
              key={`${col}-${row}-${index}-${squareId}`}
              width={width - 1}
              height={height - 1}
              x={col * width + 1}
              y={row * height + 1}
              fill="currentColor"
              strokeWidth="0"
              style={{
                opacity: 0,
                animation: `gridSquareAnimation ${duration}s ease-in-out ${index * 0.1}s infinite`,
              }}
              onAnimationIteration={() => updateSquarePosition(squareId)}
            />
          ))}
        </g>
      </svg>
    </>
  );
}