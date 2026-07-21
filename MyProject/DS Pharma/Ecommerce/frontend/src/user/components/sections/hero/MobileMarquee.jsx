import { motion as Motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import marqueeService from '@/services/marqueeService';

export const MobileMarquee = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchVisible = async () => {
      try {
        const data = await marqueeService.getVisibleMessages({ signal: controller.signal });
        setMessages(data);
      } catch (error) {
        if (error.name === 'CanceledError') return;
        console.error('Failed to fetch visible marquee messages:', error);
      }
    };
    fetchVisible();
    return () => controller.abort();
  }, []);
  
  // If no messages, don't render
  if (messages.length === 0) {
    return null;
  }

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="absolute bottom-0 left-0 right-0 z-10 w-full flex items-center overflow-hidden sm:hidden h-10 bg-white/30 backdrop-blur-[2px]"
    >
      {(() => {
        // Deduplicate to be safe (By ID and Content)
        const seen = new Set();
        const uniqueMessages = messages.filter(item => {
          const id = item._id || item.id;
          const content = (item.title || item.message || item.heading || '').trim().toLowerCase();
          if (seen.has(content) || (id && seen.has(id))) return false;
          if (id) seen.add(id);
          if (content) seen.add(content);
          return true;
        });

        // Map speeds to seconds (Increased speed)
        const speedMap = { slow: 30, medium: 18, fast: 10 };
        const minSeconds = Math.min(...uniqueMessages.map(m => speedMap[m.speed] || 18));

        return (
          <div 
            className="flex whitespace-nowrap items-center hover:pause-marquee animate-mobile-marquee font-semibold text-sm tracking-[0.5px]" 
            style={{ 
              fontFamily: 'Gyrotrope, sans-serif',
              animationDuration: `${minSeconds}s`,
              width: 'max-content'
            }}
          >
            {/* Double the content for seamless loop */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex flex-nowrap items-center min-w-full">
                {uniqueMessages.map((item) => {
                  const content = item.title || item.heading || item.message;
                  return (
                    <span 
                      key={`${i}-${item._id || item.id}`} 
                      className="px-5 inline-block"
                      style={{ color: item.color || '#e94242' }}
                    >
                      {content}
                      <span className="ml-[20px] text-black opacity-30">|</span>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        );
      })()}
      <style>{`
        @keyframes scroll-mobile-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-mobile-marquee {
          animation: scroll-mobile-marquee linear infinite;
        }
        .hover\\:pause-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </Motion.div>
  );
};
