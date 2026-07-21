import React from 'react';
import { motion as Motion } from 'framer-motion';
import { PharmacyProductCard } from '@/user/components/product';

const ProductCategorySection = ({
  title = 'Product Category Title',
  products = [],
  onViewAll = () => { },
  onProductClick = () => { },
  className = ''
}) => {
  const handleViewAll = () => {
    onViewAll(title);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className={`w-full py-6 lg:py-8 bg-gray-50 mb-6 ${className}`} style={{ width: '100%', marginBottom: '3rem' }}>
      {/* Full-width Container with Centered Content */}
      <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

        {/* Section Header - Compact Spacing */}
        <div className="flex flex-row items-start justify-between w-full gap-3 mb-4 sm:flex-row sm:items-center lg:mb-6 sm:gap-4">
          <h2
            className="flex-1 text-left sm:text-left"
            style={{
              fontFamily: 'Gyrotrope',
              fontWeight: 600,
              fontSize: '22px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#111827',
              marginBottom: '5px',
              display: 'flex',
              alignItems: 'center',
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
              {title}
            </span>
          </h2>
          <button
            onClick={handleViewAll}
            className="bg-linear-to-r text-[10px] sm:text-xs from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 sm:px-10 sm:py-3 lg:px-12 lg:py-3.5 rounded-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 whitespace-nowrap"
            aria-label={`View all products in ${title}`}
            style={{
              fontFamily: 'Gyrotrope',
              fontWeight: 600,
              lineHeight: '100%',
              letterSpacing: '0%',
              padding: '6px 12px'
            }}
          >
            View All
          </button>
        </div>

        {/* Products Grid - Compact Responsive Layout */}
        <div className="relative flex justify-center w-full">
          <Motion.div
            className="flex w-full overflow-x-auto pb-4 hide-scrollbar gap-2 px-4 sm:gap-4 lg:gap-8"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
          >
            {/* Show all products */}
            {products.map((product, _index) => (
              <Motion.div
                key={product.id}
                variants={itemVariants}
                transition={{
                  delay: _index * 0.08,
                  duration: 0.5,
                  ease: "easeOut"
                }}
                className="w-40 shrink-0 sm:w-[230px]"
              >
                <PharmacyProductCard
                  {...product}
                  onCardClick={onProductClick}
                  className="w-full h-full"
                />
              </Motion.div>
            ))}
          </Motion.div>


        </div>


      </div>
    </section>
  );
};


export default ProductCategorySection;
