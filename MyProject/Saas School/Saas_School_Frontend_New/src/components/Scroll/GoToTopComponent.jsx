import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronUp, GraduationCap, Rocket } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const GoToTopComponent = () => {
    const theme = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const goToBtn = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }

    const listenToScroll = () => {
        let heightToShow = 250;
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        
        if (winScroll > heightToShow) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }

    // Theme-based styling
    const getThemeStyles = () => {
        if (theme === 'dark') {
            return {
                button: isHovered 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/25" 
                    : "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-gray-500/25",
                pulse: isHovered ? "bg-purple-400" : "bg-gray-400",
                tooltip: "bg-gray-900 border border-gray-700",
                tooltipArrow: "border-t-gray-900"
            };
        } else {
            return {
                button: isHovered 
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25" 
                    : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-500/25",
                pulse: isHovered ? "bg-emerald-400" : "bg-blue-400",
                tooltip: "bg-gray-800",
                tooltipArrow: "border-t-gray-800"
            };
        }
    };

    const themeStyles = getThemeStyles();

    useEffect(() => {
        window.addEventListener("scroll", listenToScroll);
        return () => window.removeEventListener("scroll", listenToScroll);
    }, []);

    return (
        <>
            {isVisible && (
                <div className="fixed bottom-6 right-6 z-50">
                    <button
                        onClick={goToBtn}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={`group relative ${themeStyles.button} text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95`}
                        aria-label="Go to top"
                    >
                        {/* Animated background pulse */}
                        <div className={`absolute inset-0 ${themeStyles.pulse} rounded-full animate-ping opacity-20`}></div>
                        
                        {/* Main icon container with icon transition */}
                        <div className="relative flex flex-col items-center justify-center h-full">
                            <div className="transition-all duration-300 ease-in-out">
                                {isHovered ? (
                                    <Rocket 
                                        size={20} 
                                        className="transform rotate-45 group-hover:-translate-y-0.5 transition-transform duration-200" 
                                    />
                                ) : (
                                    <ChevronUp 
                                        size={20} 
                                        className="transform group-hover:-translate-y-0.5 transition-transform duration-200" 
                                    />
                                )}
                            </div>
                            <div className="absolute bottom-2 transition-all duration-300">
                                {isHovered ? (
                                    <GraduationCap 
                                        size={12} 
                                        className="opacity-70 group-hover:opacity-100 transition-opacity duration-200" 
                                    />
                                ) : (
                                    <BookOpen 
                                        size={12} 
                                        className="opacity-70 group-hover:opacity-100 transition-opacity duration-200" 
                                    />
                                )}
                            </div>
                        </div>
                        
                        {/* Tooltip */}
                        <div className={`absolute bottom-full right-0 mb-2 px-3 py-1 ${themeStyles.tooltip} text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap`}>
                            {isHovered ? "Rocket to Top! 🚀" : "Back to Top"}
                            <div className={`absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${themeStyles.tooltipArrow}`}></div>
                        </div>
                    </button>
                </div>
            )}
        </>
    );
};

export default GoToTopComponent;