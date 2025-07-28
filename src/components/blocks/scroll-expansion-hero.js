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
  const [isMobileState, setIsMobileState] = useState(false);

  const sectionRef = useRef(null);

  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, [mediaType]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
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
      }
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
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
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
      }
    };

    const handleTouchEnd = () => {
      setTouchStartY(0);
    };

    const handleScroll = () => {
      if (!mediaFullyExpanded) {
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
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  const firstWord = title?.split(' ')[0] || '';
  const restOfTitle = title?.split(' ').slice(1).join(' ') || '';

  const mediaSize = 20 + scrollProgress * 70;
  const mediaOpacity = 0.3 + scrollProgress * 0.7;
  const textTranslateX = scrollProgress * 30;

  return (
    <div
      ref={sectionRef}
      style={{
        height: '100vh',
        position: 'relative',
        overflow: mediaFullyExpanded ? 'auto' : 'hidden',
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

      {mediaFullyExpanded && showContent && (
        <div
          style={{
            padding: '60px 20px',
            background: 'rgba(255, 255, 255, 0.95)',
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