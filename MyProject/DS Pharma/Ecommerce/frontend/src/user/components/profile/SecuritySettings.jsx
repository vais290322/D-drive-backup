import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Lock, Phone } from 'lucide-react';

const SecuritySettings = () => {
    const loginActivity = [
        { device: '💻 Chrome on Windows', location: 'Noida, India', time: '2 hours ago', current: true },
        { device: '📱 Mobile App (Android)', location: 'Noida, India', time: '1 day ago', current: false },
        { device: '💻 Safari on MacOS', location: 'Delhi, India', time: '3 days ago', current: false }
    ];

    return (
        <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-4 md:p-8"
        >
            <h2 className="text-xl md:text-2xl font-bold mb-8" style={{ fontFamily: 'Gyrotrope', color: '#1F2937' }}>
                Security & Privacy
            </h2>
            <div className="space-y-5">
                {/* Change Password */}
                <Motion.div
                    whileHover={{ scale: 1.01 }}
                    className="border-2 border-gray-200 rounded-xl p-5 hover:border-teal-400 transition-all bg-gradient-to-r from-white to-gray-50"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-teal-100 rounded-xl">
                                <Lock className="w-6 h-6 text-teal-600" />
                            </div>
                            <div>
                                <p className="font-bold text-base md:text-lg mb-1" style={{ fontFamily: 'Gyrotrope' }}>
                                    Change Password
                                </p>
                                <p className="text-sm text-gray-600" style={{ fontFamily: 'Gyrotrope' }}>
                                    Last updated: <span className="font-semibold">30 days ago</span>
                                </p>
                                <p className="text-[8px] sm:text-xs text-gray-500 mt-1">Keep your account secure with a strong password</p>
                            </div>
                        </div>
                        <Motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2.5 text-sm font-semibold text-teal-600 border-2 border-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                        >
                            Update Password
                        </Motion.button>
                    </div>
                </Motion.div>

                {/* Two-Factor Authentication */}
                <Motion.div
                    whileHover={{ scale: 1.01 }}
                    className="border-2 border-gray-200 rounded-xl p-5 hover:border-teal-400 transition-all bg-gradient-to-r from-white to-gray-50"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <Lock className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-bold text-base md:text-lg mb-1" style={{ fontFamily: 'Gyrotrope' }}>
                                    Two-Factor Authentication
                                </p>
                                <p className="text-sm text-gray-600" style={{ fontFamily: 'Gyrotrope' }}>
                                    Status: <span className="font-semibold text-orange-600">Not Enabled</span>
                                </p>
                                <p className="text-[8px] sm:text-xs text-gray-500 mt-1">Add an extra layer of security to your account</p>
                            </div>
                        </div>
                        <Motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
                        >
                            Enable 2FA
                        </Motion.button>
                    </div>
                </Motion.div>

                {/* Login Activity */}
                <Motion.div
                    whileHover={{ scale: 1.01 }}
                    className="border-2 border-gray-200 rounded-xl p-5 hover:border-teal-400 transition-all bg-gradient-to-r from-white to-gray-50"
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Phone className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-bold text-base md:text-lg" style={{ fontFamily: 'Gyrotrope' }}>
                                Recent Login Activity
                            </p>
                            <p className="text-[8px] sm:text-xs text-gray-500">Monitor your account access</p>
                        </div>
                    </div>
                    <div className="space-y-3 ml-2">
                        {loginActivity.map((activity, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 hover:border-teal-200 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Gyrotrope' }}>
                                            {activity.device}
                                        </p>
                                        {activity.current && (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[8px] sm:text-xs font-bold">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[8px] sm:text-xs text-gray-500 mt-1" style={{ fontFamily: 'Gyrotrope' }}>
                                        📍 {activity.location}
                                    </p>
                                </div>
                                <p className="text-[8px] sm:text-xs text-gray-500 font-medium" style={{ fontFamily: 'Gyrotrope' }}>
                                    {activity.time}
                                </p>
                            </div>
                        ))}
                    </div>
                </Motion.div>
            </div>
        </Motion.div>
    );
};

export default SecuritySettings;
