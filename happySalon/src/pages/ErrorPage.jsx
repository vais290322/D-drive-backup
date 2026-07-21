import React from 'react';
import { Link } from 'react-router';

import errorImage from '../assets/oneman.jpg';

const ErrorPage = () => {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Full background image with overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${errorImage})` }}
            >
                {/* Dark overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/60 to-black/90"></div>
                
                {/* Animated overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
            </div>

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-32 right-32 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-ping"></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full animate-bounce"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Main content overlay */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="text-center max-w-4xl mx-auto">
                    
                    {/* Glitch effect container for 404 */}
                    <div className="relative mb-8">
                        {/* Main 404 text */}
                        <h1 className="text-8xl sm:text-9xl md:text-[14rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 animate-pulse drop-shadow-2xl">
                            404
                        </h1>
                        
                        {/* Glitch layers */}
                        <div className="absolute inset-0 text-8xl sm:text-9xl md:text-[14rem] font-black text-red-500/20 transform translate-x-2 -translate-y-1 animate-ping">
                            404
                        </div>
                        <div className="absolute inset-0 text-8xl sm:text-9xl md:text-[14rem] font-black text-blue-500/20 transform -translate-x-2 translate-y-1 animate-pulse">
                            404
                        </div>
                    </div>

                    {/* Error message with backdrop blur */}
                    <div className="mb-12 backdrop-blur-sm bg-black/30 rounded-2xl p-8 border border-white/10 shadow-2xl">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-4">
                            Page Not Found
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-200 font-light mb-4 leading-relaxed">
                            Oops! The page you're looking for seems to have vanished into the digital void.
                        </p>
                        <p className="text-md sm:text-lg text-gray-300 font-light max-w-2xl mx-auto leading-relaxed opacity-80">
                            Don't worry, even the best navigators sometimes lose their way in cyberspace.
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                        <Link 
                            to="/" 
                            className="group relative px-10 py-4 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 text-white font-bold rounded-full shadow-2xl hover:shadow-red-500/50 transform hover:scale-110 transition-all duration-300 hover:-translate-y-2 active:scale-95 backdrop-blur-sm border-2 border-white/20 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-3 text-lg">
                                <svg className="w-6 h-6 transform group-hover:-translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Take Me Home
                            </span>
                            {/* Animated background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-purple-700 to-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                        </Link>

                        <button 
                            onClick={() => window.history.back()}
                            className="group relative px-10 cursor-pointer py-4 bg-white/10 text-white font-semibold rounded-full shadow-xl hover:shadow-white/30 transform hover:scale-110 transition-all duration-300 hover:-translate-y-2 active:scale-95 backdrop-blur-md border-2 border-white/30"
                        >
                            <span className="relative z-10 flex items-center gap-3 text-lg">
                                <svg className="w-6 h-6 transform group-hover:-rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                </svg>
                                Go Back
                            </span>
                        </button>
                    </div>

                    {/* Navigation breadcrumbs or additional info */}
                    <div className="backdrop-blur-sm bg-white/5 rounded-full px-8 py-4 border border-white/10 inline-block">
                        <p className="text-white/70 text-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Error Code: 404 | Page Not Found
                        </p>
                    </div>

                    {/* Decorative animated dots */}
                    <div className="mt-16 flex justify-center space-x-3">
                        <div className="w-3 h-3 bg-red-400/60 rounded-full animate-bounce shadow-lg"></div>
                        <div className="w-3 h-3 bg-purple-400/60 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 bg-blue-400/60 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-white/20 rounded-tl-xl"></div>
            <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-white/20 rounded-tr-xl"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-white/20 rounded-bl-xl"></div>
            <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-white/20 rounded-br-xl"></div>
        </div>
    );
};

export default ErrorPage;