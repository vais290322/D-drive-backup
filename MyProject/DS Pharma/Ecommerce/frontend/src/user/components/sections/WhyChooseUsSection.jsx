import React from 'react';
import { motion as Motion } from 'framer-motion';

// Images
import Vector from '@/assets/images/Vector.png';
import Subtract from '@/assets/images/Subtract.png';
import Doctor from '@/assets/images/doctor.png';
import Objects from '@/assets/images/OBJECTS.png';

// Icons
import DeliveryIcon from '@/assets/icons/iconamoon_delivery-fill.png';
import CustomerIcon from '@/assets/icons/icon-park_customer.png';
import HealthyIcon from '@/assets/icons/icon-park-solid_healthy-recognition.png';
import MedicinesIcon from '@/assets/icons/healthicons_medicines.png';

const features = [
  {
    id: 1,
    icon: DeliveryIcon,
    text: 'All Over India Delivery'
  },
  {
    id: 2,
    icon: CustomerIcon,
    text: '60K+ Happy Customer'
  },
  {
    id: 3,
    icon: HealthyIcon,
    text: 'Certified Medicine'
  },
  {
    id: 4,
    icon: MedicinesIcon,
    text: '10000+ Medicine Available'
  }
];

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
      ease: 'easeOut'
    }
  }
};

const WhyChooseUsSection = () => {
  return (
    <section
      className="w-full mb-6 flex justify-center items-center relative overflow-hidden"
      style={{
        width: '100%',
        paddingTop: '1rem',
        background: 'linear-gradient(135deg, #D5F5ED 0%, #C1EDE3 50%, #B8E8DD 100%)',
        paddingBottom: '1rem'
      }}
    >
      {/* Background Vector Pattern - Full Width */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={Vector}
          alt=""
          className="w-full h-full object-cover"
          style={{ mixBlendMode: 'overlay' }}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div
          className="relative z-10 sm:max-w-7xl mx-auto flex items-center justify-center px-4 sm:px-6 sm:mx-[50px] sm:ml-[50px] gap-8"
          style={{
            paddingTop: '2rem',
            paddingBottom: '2rem',
            margin: '0 20px'
          }}
        >
          {/* Left Content */}
          <div className="flex flex-col justify-center md:w-[60%]">
            <div className=''>
              <div className='left-0 top-0 text-left'>
                <Motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  style={{
                    fontFamily: 'Gyrotrope',
                    fontSize: 'clamp(20px, 3vw, 26px)',
                    fontWeight: 700,
                    lineHeight: '1.2',
                    letterSpacing: '-0.02em',
                    color: '#111827',
                    marginBottom: '1.5rem'
                  }}
                >
                  Why Choose Us
                </Motion.h2>
              </div>

              <Motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="grid grid-cols-2"
                style={{
                  rowGap: '1.5rem',
                  columnGap: '1.5rem'
                }}
              >
                {features.map((feature) => (
                  <Motion.div
                    key={feature.id}
                    variants={itemVariants}
                    className="flex items-center group"
                    style={{ gap: '0.75rem' }}
                  >
                    {/* Icon Container - Pixel Perfect */}
                    <div
                      className="shrink-0 bg-white flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:scale-105"
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.04)',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      <img
                        src={feature.icon}
                        alt=""
                        style={{
                          width: '32px',
                          height: '32px',
                          objectFit: 'contain',
                          filter: 'contrast(1.1)',
                          imageRendering: '-webkit-optimize-contrast'
                        }}
                      />
                    </div>

                    {/* Text - Pixel Perfect Typography */}
                    <span
                      style={{
                        fontFamily: 'Gyrotrope',
                        fontSize: 'clamp(12px, 3vw, 16px)',
                        fontWeight: 600,
                        lineHeight: '1.4',
                        letterSpacing: '-0.01em',
                        color: '#111827'
                      }}
                    >
                      {feature.text}
                    </span>
                  </Motion.div>
                ))}
              </Motion.div>
            </div>
          </div>
          {/* Right Images - Pixel Perfect Positioning */}
          <div className="relative hidden lg:flex items-center justify-end md:w-[40%]">
            <div
              className="relative w-full"
              style={{
                height: '300px',
                minHeight: '300px'
              }}
            >
              {/* Background Shape - Exact Positioning */}
              <div
                className="absolute"
                style={{
                  right: '0px',
                  top: '55%',
                  transform: 'translateY(-50%)',
                  width: '250px',
                  maxWidth: '290px',
                  height: 'auto',
                  zIndex: 14,
                  position: 'absolute'
                }}
              >
                <img
                  src={Subtract}
                  alt=""
                  aria-hidden="true"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    filter: 'brightness(1.02) drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))',
                    imageRendering: '-webkit-optimize-contrast'
                  }}
                />
              </div>

              {/* Doctor Image - Exact Positioning */}
              <Motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute"
                style={{
                  right: '2px',
                  bottom: '0px',
                  width: '50%',
                  maxHeight: '370px',
                  maxWidth: '280px',
                  zIndex: 15
                }}
              >
                <img
                  src={Doctor}
                  alt="Healthcare Professional"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'contain',
                    padding: '30px',
                    filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15))',
                    imageRendering: '-webkit-optimize-contrast'
                  }}
                />
              </Motion.div>

              {/* Objects Image - Positioned on Upper Left of Doctor */}
              <Motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
                className="absolute"
                style={{
                  left: '200px',
                  top: '',
                  width: '180px',
                  zIndex: 13,
                  position: 'absolute'
                }}
              >
                <img
                  src={Objects}
                  alt="Medical Objects"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))',
                    imageRendering: '-webkit-optimize-contrast',
                    transform: 'translateZ(0)'
                  }}
                />
              </Motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
