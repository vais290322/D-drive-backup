import React from 'react';
import { motion as Motion } from 'framer-motion';
import Exclude from '@/assets/images/Exclude.png';
import Frame5 from '@/assets/images/Frame 5.png';

const AboutUsSection = () => {
  return (
    <section
      id="about"
      className="w-full flex justify-center items-center relative overflow-hidden"
      style={{
        width: '100%',
        paddingTop: '1rem',
        paddingBottom: '2rem',
        marginBottom: '1.5rem'
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 text-center relative z-10">
        {/* About Us Container */}
        <div className="relative">
          {/* Main Content Box */}
          <div
            className="relative overflow-visible pr-6 lg:pr-60 min-h-[200px] lg:min-h-[310px] bg-[#68F2EC80] lg:bg-transparent rounded-2xl"
            style={{
              height: 'auto',
              paddingTop: '1rem',
              paddingBottom: '1.5rem',
              paddingLeft: '1.5rem',
              position: 'relative'
            }}
          >
            {/* Background Image - Visible only on LG screens */}
            <div 
              className="absolute inset-0 hidden lg:block rounded-2xl"
              style={{
                backgroundImage: `url(${Exclude})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0
              }}
            />
            
            {/* Content Wrapper to ensure z-index above background */}
            <div className="relative z-10">
            {/* About Us Title Badge */}
            <Motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="absolute"
              style={{
                top: '4px',
                left: '-15px',
                boxShadow: 'none',
                borderBottom: 'none'
              }}
            >
              <h2
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: 'clamp(22px, 4vw, 20px)',
                  fontWeight: 600,
                  lineHeight: '0.1',
                  letterSpacing: '0em',
                  color: '#000000',
                  margin: 0,
                  whiteSpace: 'nowrap'
                }}
              >
                About Us
              </h2>
            </Motion.div>

            {/* Content Area */}
            <Motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-start sm:text-left mt-12 sm:mt-14 lg:mt-16 max-w-full sm:max-w-[85%] lg:max-w-[75%]"
              style={{
                padding: '2rem 0rem',
                height: '100%',
              }}
            >
              <p className="text-[12px] sm:text-md lg:text-base text-gray-700 leading-relaxed font-medium">
                At <span className="font-bold text-emerald-600">DS Pharma</span>, we are committed to providing high-quality healthcare products and services. 
                Our mission is to make health and wellness accessible to everyone. 
                With a wide range of medicines, personal care items, and medical equipment, we are your trusted partner in health.
              </p>
              
              <div className="text-left mt-4 lg:mt-6">
                <button className="text-[10px] sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors">
                  Learn more about our journey →
                </button>
              </div>
            </Motion.div>
            </div>
          </div>

          {/* Frame 5 Background - Bottom Right */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden absolute lg:block right-0 -bottom-5 w-[140px] h-[100px] lg:w-60 lg:h-40 lg:-bottom-[35px]"
            style={{
              zIndex: 5
            }}
          >
            <img
              src={Frame5}
              alt=""
              aria-hidden="true"
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'contain',
                imageRendering: '-webkit-optimize-contrast'
              }}
            />
          </Motion.div>

          {/* Mascot Character - Positioned on Top of Frame 5 */}
          <Motion.div
            initial={{ opacity: 0, x: 15, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute hidden md:block -right-2.5 bottom-2.5 w-[140px] h-[140px] lg:-right-5 lg:bottom-5 lg:w-60 lg:h-60"
            style={{
              zIndex: 10
            }}
          >
            <img
              src="/src/assets/images/OBJECTS1.png"
              alt="Pharmacy Mascot Character"
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'contain',
                imageRendering: '-webkit-optimize-contrast',
                transform: 'translateZ(0)',
                filter: 'contrast(1.02) saturate(1.05) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
              }}
            />
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
