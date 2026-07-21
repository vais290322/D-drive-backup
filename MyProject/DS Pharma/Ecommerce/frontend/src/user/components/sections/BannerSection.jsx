import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useBanners } from '@/shared/hooks/queries/useBanners';
import Loading from '@/shared/components/common/Loading';
import ErrorState from '@/shared/components/common/ErrorState';

const BannerSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const { data: bannerData, isLoading, isError } = useBanners();
  const banners = bannerData?.data || [];

  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!banners.length) return;

    intervalRef.current = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }
    }, 3000); // Change slide every 3 seconds
  }, [isHovered, banners.length]);

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [isHovered, startAutoSlide]);

  const handleBannerClick = (link) => {
    console.log(`Navigate to: ${link}`);
    // Add navigation logic here
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  if (isLoading) return <Loading className="h-[300px] w-full flex items-center justify-center bg-gray-100" />;
  if (isError) return <ErrorState message="Failed to load banners" className="h-[300px]" />;

  return (
    <section className="w-full py-6 lg:py-8 bg-white mb-6 flex justify-center items-center" style={{ width: '100%', marginBottom: '3rem' }}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mobile Carousel - Single row, one at a time */}
        <div className="sm:hidden">
          <div
            className="relative overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Banner Container */}
            <div className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {banners.map((banner) => (
                <div key={banner.id} className="w-full flex-shrink-0">
                  <Motion.div
                    className="group cursor-pointer w-full"
                    onClick={() => handleBannerClick(banner.link)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleBannerClick(banner.link);
                      }
                    }}
                    aria-label={`Navigate to ${banner.title}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Banner Card */}
                    <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-full mx-auto">
                      {/* Background Image */}
                      <div className="aspect-video relative w-full">
                        <img
                          src={banner.image}
                          alt={banner.alt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200";
                          }}
                        />

                        {/* Overlay for better text readability */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <h3 className="text-lg font-bold mb-2 drop-shadow-lg">
                              {banner.title}
                            </h3>
                            <div className="w-12 h-0.5 bg-white mx-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </div>

                        {/* Hover Effect Border */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/50 rounded-2xl transition-colors duration-300" />
                      </div>

                      {/* Fallback Background Color (if image fails to load) */}
                      <div className={`absolute inset-0 ${banner.bgColor} -z-10`} />
                    </div>
                  </Motion.div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 z-10"
              aria-label="Previous banner"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 z-10"
              aria-label="Next banner"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Grid - Original layout */}
        <div className="hidden sm:block">
          {/* Banner Grid - Compact Layout */}
          <div className="w-full flex justify-center">
            <Motion.div
              className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8 w-full max-w-7xl justify-items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                  }
                }
              }}
            >
              {banners.map((banner) => (
                <Motion.div
                  key={banner.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.6,
                        ease: "easeOut"
                      }
                    }
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group cursor-pointer w-full flex justify-center"
                  onClick={() => handleBannerClick(banner.link)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleBannerClick(banner.link);
                    }
                  }}
                  aria-label={`Navigate to ${banner.title}`}
                >
                  {/* Banner Card - Centered */}
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-sm">
                    {/* Background Image */}
                    <div className="aspect-4/3 relative w-full">
                      <img
                        src={banner.image}
                        alt={banner.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200";
                        }}
                      />

                      {/* Overlay for better text readability */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

                      {/* Content Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <h3 className="text-lg lg:text-xl font-bold mb-2 drop-shadow-lg">
                            {banner.title}
                          </h3>
                          <div className="w-12 h-0.5 bg-white mx-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>

                      {/* Hover Effect Border */}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/50 rounded-2xl transition-colors duration-300" />
                    </div>

                    {/* Fallback Background Color (if image fails to load) */}
                    <div className={`absolute inset-0 ${banner.bgColor} -z-10`} />
                  </div>
                </Motion.div>
              ))}
            </Motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;