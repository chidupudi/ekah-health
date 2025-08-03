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

  const sectionRef = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
    setIsAnimationActive(true);
    setIsScrollingUp(false);
    lastScrollY.current = 0;
  }, [mediaType]);

  useEffect(() => {
    const handleWheel = (e) => {
      const currentScrollY = window.scrollY;
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      // If we're in the middle of animation and not fully expanded
      if (isAnimationActive && !mediaFullyExpanded) {
        e.preventDefault();
        
        const scrollDelta = e.deltaY * 0.0008;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
          setIsAnimationActive(false);
          // Allow normal scrolling after animation completes
          setTimeout(() => {
            document.body.style.overflow = 'auto';
          }, 100);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
      // If fully expanded and scrolling up at the top
      else if (mediaFullyExpanded && scrollingUp && currentScrollY <= 10) {
        e.preventDefault();
        
        // Reverse the animation
        const reverseDelta = Math.abs(e.deltaY) * 0.0012;
        const newProgress = Math.max(scrollProgress - reverseDelta, 0);
        
        setScrollProgress(newProgress);
        setShowContent(false);
        
        if (newProgress <= 0) {
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
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

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
  }, [scrollProgress, mediaFullyExpanded, touchStartY, isScrollingUp]);

  const firstWord = title?.split(' ')[0] || '';
  const restOfTitle = title?.split(' ').slice(1).join(' ') || '';

  // Start with 0% size and opacity, show only when scrolling
  const mediaSize = scrollProgress * 70; // Start from 0
  const mediaOpacity = scrollProgress * 1; // Start from 0
  const textTranslateX = scrollProgress * 30;

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
              : 'translate(-50%, -50%)',
            width: mediaFullyExpanded ? '100%' : `${mediaSize}vw`,
            height: mediaFullyExpanded ? 'auto' : `${mediaSize * 0.6}vw`,
            minHeight: mediaFullyExpanded ? '100vh' : 'auto',
            opacity: mediaOpacity,
            transition: 'none',
            zIndex: 2,
            borderRadius: mediaFullyExpanded ? '0' : '12px',
            overflow: 'hidden',
          }}
        >
          {mediaType === 'video' ? (
            <video
              src={mediaSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
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
              transform: `translateX(-${textTranslateX}vw)`,
              transition: 'none',
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
              transform: `translateX(${textTranslateX}vw)`,
              transition: 'none',
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