import { motion as Motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import marqueeService from '@/services/marqueeService';
import heroBannerImage from '@/assets/images/heroAdd.png';

export const HeroAddImage = () => {
  const [marqueeMessages, setMarqueeMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const marqueeRef = useRef(null);
  const containerRef = useRef(null);
  const [animationDuration, setAnimationDuration] = useState(18);
  const [animationId] = useState(() => `marquee-${Math.random().toString(36).substr(2, 9)}`);

  // Fetch visible messages from backend
  useEffect(() => {
    const controller = new AbortController();
    const fetchVisible = async () => {
      try {
        const data = await marqueeService.getVisibleMessages({ signal: controller.signal });
        setMarqueeMessages(data);
      } catch (error) {
        if (error.name === 'CanceledError') return;
        console.error('Failed to fetch visible marquee messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVisible();
    return () => controller.abort();
  }, []);

  // Deduplicate messages
  const uniqueMessages = (() => {
    const seen = new Set();
    return marqueeMessages.filter(item => {
      const id = item._id || item.id;
      const content = (item.title || item.message || item.heading || '').trim().toLowerCase();
      if (seen.has(content) || (id && seen.has(id))) return false;
      if (id) seen.add(id);
      if (content) seen.add(content);
      return true;
    });
  })();

  // Pixel-based animation calculation
  useEffect(() => {
    if (uniqueMessages.length > 0 && marqueeRef.current && containerRef.current) {
      const timer = setTimeout(() => {
        if (!marqueeRef.current || !containerRef.current) return;
        
        // Get exact pixel measurements
        const contentWidth = marqueeRef.current.scrollWidth;
        const containerWidth = containerRef.current.offsetWidth;
        
        // Calculate exact pixel positions for perfect marquee behavior
        const startPosition = containerWidth;
        const endPosition = -contentWidth;
        const totalDistance = startPosition + Math.abs(endPosition);
        
        // Calculate duration based on speed setting
        // Use the fastest speed among visible messages
        const speedMap = { slow: 30, medium: 18, fast: 10 };
        const baseSpeed = Math.min(...uniqueMessages.map(m => speedMap[m.speed] || 18));
        
        // Pixel-based calculation: 80 pixels per second base speed
        const pixelsPerSecond = 80;
        const speedMultiplier = baseSpeed / 18; // Normalize from speed setting
        const adjustedPixelsPerSecond = pixelsPerSecond * speedMultiplier;
        
        const calculatedDuration = totalDistance / adjustedPixelsPerSecond;
        setAnimationDuration(calculatedDuration);

        // Inject dynamic keyframes with EXACT pixel positioning
        const styleId = `marquee-style-${animationId}`;
        let styleSheet = document.getElementById(styleId);
        
        if (!styleSheet) {
          styleSheet = document.createElement('style');
          styleSheet.id = styleId;
          document.head.appendChild(styleSheet);
        }

        styleSheet.textContent = `
          @keyframes ${animationId} {
            0% {
              transform: translateX(${startPosition}px);
            }
            100% {
              transform: translateX(${endPosition}px);
            }
          }
        `;
      }, 160);

      return () => {
        clearTimeout(timer);
        const sheet = document.getElementById(`marquee-style-${animationId}`);
        if (sheet) {
          sheet.remove();
        }
      };
    }
  }, [uniqueMessages, animationId]);

  const heroImage = heroBannerImage;

  return (
    <Motion.div
      initial={{ opacity: 0, x: 20, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="hidden sm:block absolute bottom-0 right-0 z-10 w-full md:max-w-[60%] lg:max-w-3xl"
    >
      <img
        src={heroImage}
        alt="Default Hero Banner"
        className="w-full h-auto block object-contain"
      />

      {!isLoading && uniqueMessages.length > 0 && (
        <div 
          ref={containerRef}
          className="absolute top-1/2 md:left-[60%] lg:left-[59%] -translate-x-1/2 -translate-y-1/2 w-full bg-transparent overflow-hidden group" 
          style={{ height: '50px' }}
        >
          <div 
            ref={marqueeRef}
            className="font-semibold text-lg tracking-[0.5px] sm:text-xs lg:text-lg"
            style={{ 
              fontFamily: 'Gyrotrope, sans-serif',
              position: 'absolute',
              height: '100%',
              margin: 0,
              lineHeight: '50px',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              animation: `${animationId} ${animationDuration}s linear infinite`,
              willChange: 'transform'
            }}
          >
            {uniqueMessages.map((item, index) => {
              const content = item.title || item.heading || item.message;
              return (
                <span 
                  key={`${item._id || item.id}-${index}`}
                  style={{ 
                    paddingRight: '60px',
                    display: 'inline-block',
                    color: item.color || '#e94242'
                  }}
                >
                  {content}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </Motion.div>
  );
};
