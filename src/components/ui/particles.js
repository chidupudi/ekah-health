import React, { useRef, useEffect, useState } from 'react';

const Particles = ({
  className = '',
  quantity = 120,
  ease = 50,
  color = '#000000',
  refresh = false,
  size = 1.5,
  staticity = 30,
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
          vx: (Math.random() - 0.5) * 1.5 + vx,
          vy: (Math.random() - 0.5) * 1.5 + vy,
          size: Math.random() * size + 0.8,
          opacity: Math.random() * 0.6 + 0.3,
          life: Math.random() * 200,
          pulseSpeed: Math.random() * 0.02 + 0.008,
          direction: Math.random() * Math.PI * 2,
        });
      }
    };

    const updateParticles = () => {
      particlesRef.current.forEach((particle) => {
        // Move towards target with enhanced easing
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;

        particle.x += dx * (ease / 8000) + particle.vx;
        particle.y += dy * (ease / 8000) + particle.vy;

        // Smooth orbital movement
        particle.direction += particle.pulseSpeed;
        particle.vx += Math.cos(particle.direction) * 0.008;
        particle.vy += Math.sin(particle.direction) * 0.008;

        // Update velocity with subtle randomness
        particle.vx += (Math.random() - 0.5) * 0.005;
        particle.vy += (Math.random() - 0.5) * 0.005;

        // Apply enhanced friction
        particle.vx *= 0.998;
        particle.vy *= 0.998;

        // Update life and create pulsing opacity effect
        particle.life += 1;
        const pulse1 = Math.sin(particle.life * particle.pulseSpeed);
        const pulse2 = Math.cos(particle.life * particle.pulseSpeed * 0.7);
        particle.opacity = (pulse1 + pulse2) * 0.2 + 0.5;

        // Occasional direction change for more organic movement
        if (Math.random() < 0.003) {
          particle.targetX = Math.random() * canvas.width;
          particle.targetY = Math.random() * canvas.height;
          particle.direction += (Math.random() - 0.5) * 0.5;
        }

        // Smooth boundary collision
        const margin = 50;
        if (particle.x < margin) {
          particle.vx += (margin - particle.x) * 0.002;
        } else if (particle.x > canvas.width - margin) {
          particle.vx -= (particle.x - (canvas.width - margin)) * 0.002;
        }
        if (particle.y < margin) {
          particle.vy += (margin - particle.y) * 0.002;
        } else if (particle.y > canvas.height - margin) {
          particle.vy -= (particle.y - (canvas.height - margin)) * 0.002;
        }

        // Enhanced static behavior
        if (staticity > 0) {
          const staticFactor = (100 - staticity) / 100;
          particle.vx *= staticFactor;
          particle.vy *= staticFactor;
        }
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Create gradient for each particle for more visual appeal
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');

        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Add subtle glow effect
        ctx.globalAlpha = particle.opacity * 0.3;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
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