import React from 'react';
import { motion as Motion } from 'framer-motion';

const ProfileStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-4 gap-2 p-2 mt-6 text-center md:gap-4" style={{ padding: '5px' }}>
            {stats.map((stat, index) => (
                <Motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="p-2 rounded-lg bg-white/20 backdrop-blur-sm md:p-4 md:rounded-xl"
                >
                    <div className="flex flex-col items-center justify-center md:flex-row">
                        <stat.icon className="w-5 h-5 mb-1 text-white md:w-8 md:h-8 md:mb-2 md:mr-2" />
                        <p className="text-sm font-bold text-white md:text-2xl">{stat.value}</p>
                    </div>
                    <p className="text-[10px] text-white/80 md:text-[8px] sm:text-xs">{stat.label}</p>
                </Motion.div>
            ))}
        </div>
    );
};

export default ProfileStats;
