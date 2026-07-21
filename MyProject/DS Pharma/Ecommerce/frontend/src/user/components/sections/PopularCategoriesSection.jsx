import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Loading from '@/shared/components/common/Loading';
import SafeImage from '@/shared/components/SafeImage';
import { CategorySkeleton } from '@/shared/components/skeletons/ProductSkeleton';

import { useVisibleCategories } from '@/shared/hooks/queries/useCategories';

const PopularCategoriesSection = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const navigate = useNavigate();
  
  // ✅ ENHANCED: Use Backend API hook for real-time visibility sync
  const { data: displayCategories = [], isLoading, isError } = useVisibleCategories();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  if (isError) return null; // Don't show this section if it fails to load

  return (
    <section
      id="categories"
      className="w-full py-6 mb-6 flex flex-col items-center"
      style={{
        background: 'linear-gradient(135deg, #A5E8DC 0%, #B8F0E8 100%)',
        minHeight: '180px',
        marginBottom: '3rem'
      }}
      aria-labelledby="popular-categories-heading"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          marginTop: '22px'
        }}>
        {/* Section Header */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between mb-4 lg:mb-6 gap-1 sm:gap-2">
          <h2
            id="popular-categories-heading"
            className="text-center sm:text-left flex-1"
            style={{
              fontFamily: 'Gyrotrope',
              fontWeight: 600,
              fontSize: '22px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#111827',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                textDecoration: 'underline',
                textDecorationSkipInk: 'auto',
                textUnderlineOffset: '4px',
                textDecorationThickness: '2px',
                textDecorationColor: '#111827',
                display: 'inline-block',
                lineHeight: '1.2',
              }}
            >
              Popular Categories
            </span>
          </h2>
        </div>

        {/* Categories Grid */}
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex overflow-x-auto pb-4 hide-scrollbar w-full gap-4 sm:overflow-visible sm:pb-0 justify-left"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {isLoading ? (
            <div className="flex gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CategorySkeleton key={i} />
              ))}
            </div>
          ) : displayCategories.map((category, index) => (
            <Motion.div
              key={category.id || `category-${category.name}-${index}`}
              variants={itemVariants}
              className="flex flex-col items-center group cursor-pointer shrink-0 sm:shrink max-w-25 sm:min-w-[100px] relative"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              role="button"
              tabIndex={0}
              aria-label={`View ${category.name} products`}
              onClick={() => {
                const id = category._id || category.id;
                navigate(`/category/${id}`);
              }}
            >
              {/* Tooltip */}
              {hoveredCategory === category.id && (
                 <Motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white text-black text-[10px] sm:text-sm rounded-md shadow-xl z-50 whitespace-nowrap hidden sm:block border border-gray-100"
                  style={{ fontFamily: 'Gyrotrope', padding: '2px 5px', marginTop: '2px'}}
                >
                  {category.name}
                </Motion.div>
              )}

              {/* Category Image */}
              <Motion.div
                className="relative mb-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <div
                  className="rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 mx-auto"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: '#FFFFFF',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    flexShrink: 0
                  }}
                >
                  <SafeImage
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              </Motion.div>

              {/* Category Name */}
              <h3
                className="text-center w-full px-1 text-xs sm:text-sm"
                style={{
                  fontFamily: 'Gyrotrope',
                  fontWeight: 500,
                  marginTop: '8px',
                  lineHeight: '1.2',
                  color: '#000000',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  display: '-webkit-box',
                  overflow: 'hidden'
                }}
              >
                {category.name}
              </h3>
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </section>
  );
};

export default PopularCategoriesSection;