import {
  useEffect,
  useRef,
  useState,
  TouchEvent,
  WheelEvent,
} from 'react';

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isAnimationActive, setIsAnimationActive] = useState(true);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [targetProgress, setTargetProgress] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const lastScrollY = useRef(0);
  const animationFrameRef = useRef(null);
  const lastUpdateTime = useRef(0);
  const velocity = useRef(0);
  const dampening = 0.88; // Optimized for butter-smooth interpolation factor

  useEffect(() => {
    setScrollProgress(0);
    setTargetProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
    setIsAnimationActive(true);
    setIsScrollingUp(false);
    setIsVideoLoaded(false);
    lastScrollY.current = 0;
    velocity.current = 0;

    // Cancel any existing animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [mediaType]);

  useEffect(() => {
    const handleWheel = (e) => {
      const currentScrollY = window.scrollY;
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      // If we're in the middle of animation and not fully expanded
      if (isAnimationActive && !mediaFullyExpanded) {
        e.preventDefault();
        
        // Ultra-smooth scroll delta calculation with momentum
        const momentumFactor = Math.abs(e.deltaY) > 100 ? 0.0002 : 0.00012; // Adaptive sensitivity
        const scrollDelta = e.deltaY * momentumFactor;
        const newTargetProgress = Math.min(
          Math.max(targetProgress + scrollDelta, 0),
          1
        );

        setTargetProgress(newTargetProgress);

        // Update velocity for smooth interpolation
        velocity.current = newTargetProgress - scrollProgress;

        if (newTargetProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
          setIsAnimationActive(false);
          // Allow normal scrolling after animation completes
          setTimeout(() => {
            document.body.style.overflow = 'auto';
          }, 100);
        } else if (newTargetProgress < 0.75) {
          setShowContent(false);
        }
      }
      // If fully expanded and scrolling up at the top
      else if (mediaFullyExpanded && scrollingUp && currentScrollY <= 10) {
        e.preventDefault();
        
        // Reverse the animation with ultra-smooth control
        const reverseDelta = Math.abs(e.deltaY) * 0.0002;
        const newTargetProgress = Math.max(targetProgress - reverseDelta, 0);

        setTargetProgress(newTargetProgress);
        setShowContent(false);

        // Update velocity for smooth interpolation
        velocity.current = newTargetProgress - scrollProgress;

        if (newTargetProgress <= 0) {
          setMediaFullyExpanded(false);
          setIsAnimationActive(true);
          document.body.style.overflow = 'hidden';
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    const handleTouchStart = (e) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        setIsScrollingUp(true);
        e.preventDefault();
      } else if (!mediaFullyExpanded && !isScrollingUp) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.0015 : 0.001; // Ultra-precise touch control
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setTargetProgress(newProgress);

        // Update velocity for smooth touch interpolation
        velocity.current = newProgress - scrollProgress;

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      } else if (deltaY > 0 && isScrollingUp) {
        setIsScrollingUp(false);
      }
    };

    const handleTouchEnd = () => {
      setTouchStartY(0);
    };

    const handleScroll = () => {
      if (!mediaFullyExpanded && !isScrollingUp) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel, {
      passive: false,
    });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollProgress, targetProgress, mediaFullyExpanded, touchStartY, isScrollingUp]);

  // Smooth interpolation animation loop for butter-smooth experience
  useEffect(() => {
    const smoothUpdate = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastUpdateTime.current;
      lastUpdateTime.current = currentTime;

      // Smooth interpolation between current and target progress
      const progressDiff = targetProgress - scrollProgress;

      if (Math.abs(progressDiff) > 0.0001) {
        // Exponential easing for ultra-smooth motion
        const newProgress = scrollProgress + progressDiff * dampening * (deltaTime / 16.67); // 60fps normalized

        setScrollProgress(newProgress);

        // Ultra-smooth video frame updates
        if (videoRef.current && mediaType === 'video' && isVideoLoaded) {
          const videoDuration = 8;
          const targetTime = newProgress * videoDuration;
          const clampedTime = Math.min(Math.max(targetTime, 0), videoDuration - 0.001);

          // High-frequency video updates for maximum smoothness
          if (Math.abs(videoRef.current.currentTime - clampedTime) > 0.008) { // ~120fps threshold
            try {
              videoRef.current.currentTime = clampedTime;
            } catch (e) {
              // Handle any seeking errors gracefully
            }
          }
        }

        // Update UI states based on smooth progress
        if (newProgress >= 1 && !mediaFullyExpanded) {
          setMediaFullyExpanded(true);
          setShowContent(true);
          setIsAnimationActive(false);
          setTimeout(() => {
            document.body.style.overflow = 'auto';
          }, 100);
        } else if (newProgress < 0.75 && showContent) {
          setShowContent(false);
        }

        if (newProgress <= 0 && mediaFullyExpanded) {
          setMediaFullyExpanded(false);
          setIsAnimationActive(true);
          document.body.style.overflow = 'hidden';
        }
      }

      animationFrameRef.current = requestAnimationFrame(smoothUpdate);
    };

    // Start the smooth animation loop
    lastUpdateTime.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(smoothUpdate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [scrollProgress, targetProgress, mediaFullyExpanded, showContent, isVideoLoaded, mediaType]);

  const firstWord = title?.split(' ')[0] || '';
  const restOfTitle = title?.split(' ').slice(1).join(' ') || '';

  // Ultra-smooth calculations for butter-smooth animations
  const easeProgress = 1 - Math.pow(1 - scrollProgress, 3); // Cubic ease-out for smoother feel
  const mediaSize = easeProgress * 70; // Smooth size transition
  const mediaOpacity = Math.min(scrollProgress * 1.5, 1); // Faster opacity fade-in
  const textTranslateX = easeProgress * 30; // Smooth text movement
  const scaleProgress = 1 + scrollProgress * 0.1; // Subtle scale effect
  const blurAmount = Math.max(0, (1 - scrollProgress) * 3); // Dynamic blur effect

  return (
    <div
      ref={sectionRef}
      style={{
        height: mediaFullyExpanded ? 'auto' : '100vh',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: `url(${bgImageSrc}) center/cover no-repeat`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1,
        }}
      />

      {/* Only show media when scrollProgress > 0 */}
      {scrollProgress > 0 && (
        <div
          style={{
            position: mediaFullyExpanded ? 'relative' : 'fixed',
            top: mediaFullyExpanded ? 'auto' : '50%',
            left: mediaFullyExpanded ? 'auto' : '50%',
            transform: mediaFullyExpanded
              ? 'none'
              : `translate(-50%, -50%) scale(${scaleProgress})`,
            width: mediaFullyExpanded ? '100%' : `${mediaSize}vw`,
            height: mediaFullyExpanded ? 'auto' : `${mediaSize * 0.6}vw`,
            minHeight: mediaFullyExpanded ? '100vh' : 'auto',
            opacity: mediaOpacity,
            transition: mediaFullyExpanded ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            zIndex: 2,
            borderRadius: mediaFullyExpanded ? '0' : `${Math.max(12, 24 - scrollProgress * 12)}px`,
            overflow: 'hidden',
            boxShadow: mediaFullyExpanded
              ? 'none'
              : `0 ${20 + scrollProgress * 20}px ${40 + scrollProgress * 40}px rgba(0, 0, 0, ${0.3 + scrollProgress * 0.2})`,
            backdropFilter: `blur(${blurAmount}px)`,
          }}
        >
          {mediaType === 'video' ? (
            <video
              ref={videoRef}
              src={mediaSrc}
              poster={posterSrc}
              muted
              playsInline
              preload="metadata"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'all 0.1s ease-out',
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  setIsVideoLoaded(true);
                }
              }}
              onCanPlayThrough={() => {
                setIsVideoLoaded(true);
              }}
            />
          ) : (
            <img
              src={mediaSrc}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          padding: '0 20px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: scrollProgress < 0.8 ? 1 : 0,
            transition: 'opacity 0.3s ease',
            zIndex: 15,
          }}
        >
          {scrollToExpand && (
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                textAlign: 'center',
                margin: 0,
                transform: `translateX(-${textTranslateX}vw)`,
              }}
            >
              {scrollToExpand}
            </p>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '16px',
            width: '100%',
            position: 'relative',
            zIndex: 10,
            flexDirection: 'column',
            mixBlendMode: textBlend ? 'difference' : 'normal',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              fontWeight: 'bold',
              color: '#dbeafe',
              margin: 0,
              transform: `translateX(-${textTranslateX}vw) scale(${1 + scrollProgress * 0.05})`,
              transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
              textShadow: `0 ${4 + scrollProgress * 8}px ${12 + scrollProgress * 12}px rgba(0, 0, 0, ${0.3 + scrollProgress * 0.2})`,
              filter: `blur(${Math.max(0, (1 - scrollProgress) * 1)}px)`,
              opacity: 0.9 + scrollProgress * 0.1,
            }}
          >
            {firstWord}
          </h2>
          <h2
            style={{
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#dbeafe',
              margin: 0,
              transform: `translateX(${textTranslateX}vw) scale(${1 + scrollProgress * 0.05})`,
              transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
              textShadow: `0 ${4 + scrollProgress * 8}px ${12 + scrollProgress * 12}px rgba(0, 0, 0, ${0.3 + scrollProgress * 0.2})`,
              filter: `blur(${Math.max(0, (1 - scrollProgress) * 1)}px)`,
              opacity: 0.9 + scrollProgress * 0.1,
            }}
          >
            {restOfTitle}
          </h2>
        </div>
      </div>

      {/* Content Section - Now flows normally after the hero */}
      {mediaFullyExpanded && showContent && (
        <div
          style={{
            padding: '60px 20px',
            minHeight: '100vh',
            position: 'relative',
            zIndex: 5,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default ScrollExpandMedia;