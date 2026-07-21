import React from 'react';
import { motion as Motion } from 'framer-motion';
import authBg from '../../../assets/images/auth-bg-2.png'; // Page Background (Liquid)
import cardBgTexture from '../../../assets/images/auth-bg.png'; // Card Texture (Geometric)

const AuthCard = ({ children, title, subtitle, className = '' }) => {
    return (
        <div 
            className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50"
            style={{ padding: '5px' }}
        >
            {/* Page Background Layer - Soft liquid theme */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${cardBgTexture})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(0px) saturate(1.05) brightness(1.02)', // Removed blur completely, kept slight enhancement
                    transform: 'scale(1.0)',
                    opacity: 1
                }}
            />
            
            {/* Gradient Overlays - Reduced intensity to show image better */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-teal-50/50 mix-blend-overlay" />
            
            <Motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1] 
                }}
                className="w-full max-w-2xl px-4 relative z-10"
            >
                {/* Premium Glass Card with Texture */}
                <div 
                    className={`
                    rounded-2xl
                    shadow-2xl
                    border border-gray-100/80
                    p-8 sm:p-10 md:p-12
                    relative overflow-hidden
                    backdrop-blur-sm
                    ${className}
                `}
                style={{
                    // Significantly reduced white overlay (0.85 -> 0.4) to make texture VERY visible
                    background: `linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.4)), url(${authBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'none' // Removed blur completely
                }}
                >
                     {/* Subtle top shine for premium accent */}
                     <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
                     <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                     
                    <div className="text-center mb-8" style={{ padding: '10px 0px' }}>
                        {/* Title */}
                        <h2
                            className="text-3xl font-bold text-gray-900 tracking-tight mb-2"
                            style={{ fontFamily: 'Gyrotrope' }}
                        >
                            {title}
                        </h2>
                        {subtitle && (
                            <p
                                className="text-gray-600 font-medium text-base"
                                style={{ fontFamily: 'Gyrotrope' }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>
                    
                    {children}
                </div>
            </Motion.div>
        </div>
    );
};

export default AuthCard;
