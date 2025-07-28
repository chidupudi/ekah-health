import React, { useRef, useEffect, useState } from 'react';

const Particles = ({ 
  className = '', 
  quantity = 100, 
  ease = 80, 
  color = '#000000', 
  refresh = false,
  size = 1,
  staticity = 50,
  vx = 0,
  vy = 0
}) => {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const particlesRef = useRef([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const parent = canvasRef.current.parentElement;
        const rect = parent.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < quantity; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          targetX: Math.random() * canvas.width,
          targetY: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2 + vx,
          vy: (Math.random() - 0.5) * 2 + vy,
          size: Math.random() * size + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          life: Math.random() * 100,
        });
      }
    };

    const updateParticles = () => {
      particlesRef.current.forEach((particle) => {
        // Move towards target with easing
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        
        particle.x += dx * (ease / 10000) + particle.vx;
        particle.y += dy * (ease / 10000) + particle.vy;

        // Update velocity with some randomness
        particle.vx += (Math.random() - 0.5) * 0.01;
        particle.vy += (Math.random() - 0.5) * 0.01;

        // Apply friction
        particle.vx *= 0.999;
        particle.vy *= 0.999;

        // Update life and opacity
        particle.life += 1;
        particle.opacity = Math.sin(particle.life * 0.01) * 0.4 + 0.6;

        // Reset target occasionally for more organic movement
        if (Math.random() < 0.005) {
          particle.targetX = Math.random() * canvas.width;
          particle.targetY = Math.random() * canvas.height;
        }

        // Keep particles within bounds
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.5;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.5;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Static behavior
        if (staticity > 0) {
          particle.vx *= (100 - staticity) / 100;
          particle.vy *= (100 - staticity) / 100;
        }
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;

      particlesRef.current.forEach((particle) => {
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationIdRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [dimensions, quantity, ease, color, refresh, size, staticity, vx, vy]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export { Particles };