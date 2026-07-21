import { Button } from '@/components/ui/button';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <main className="max-w-4xl w-full space-y-8 text-center">
                {/* Animated 404 Number */}
                <div className="animate-pulse">
                    <h1 className="text-9xl font-extrabold text-amber-600 drop-shadow-md">
                        4<span className="text-sky-600">0</span>4
                    </h1>
                </div>

                {/* Error Message */}
                <div className="space-y-4">
                    <h2 className="text-4xl font-bold text-gray-800">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        The page you're looking for might have been removed, had its name changed,
                        or is temporarily unavailable.
                    </p>
                </div>

                {/* 3D Cube Illustration */}
                <div className="relative w-48 h-48 mx-auto transform rotate-45">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-2xl transform rotate-45 animate-float"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg shadow-2xl transform -rotate-45 animate-float-delayed"></div>
                </div>

                {/* Back to Home Button */}
                <Button
                    onClick={() => navigate("/login")}
                    className="px-8 py-4 text-lg font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                    Back to Home
                </Button>

                {/* Optional Additional Elements */}
                <div className="mt-8 text-gray-500">
                    <p className="text-sm">
                        Error code: 404 |{" "}
                        <span className="cursor-pointer hover:text-amber-600 transition-colors">
                            Report Problem
                        </span>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ErrorPage;