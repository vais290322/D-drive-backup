import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from '@/shared/components/ui/Button';

const TermsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <Motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <Motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
                            style={{padding: '10px'}}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h3 className="text-md sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Gyrotrope' }}>
                                    Terms and Conditions
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
                                    <p className="text-[8px] sm:text-sm" style={{ paddingBottom: '10px' }}>Last updated: December 2025</p>

                                    <h4 className="text-sm sm:text-md font-semibold text-gray-900">1. Introduction</h4>
                                    <p className="text-[8px] sm:text-sm" style={{paddingBottom:'5px'}}>Welcome to DS Pharma. By accessing our website and using our services, you agree to be bound by these Terms and Conditions.</p>

                                    <h4 className="text-sm sm:text-md font-semibold text-gray-900">2. Medical Disclaimer</h4>
                                    <p className="text-[8px] sm:text-sm" style={{paddingBottom:'5px'}}>The content provided on this platform is for informational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment.</p>

                                    <h4 className="text-sm sm:text-md font-semibold text-gray-900">3. User Accounts</h4>
                                    <p className="text-[8px] sm:text-sm" style={{paddingBottom:'5px'}}>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>

                                    <h4 className="text-sm sm:text-md font-semibold text-gray-900">4. Privacy Policy</h4>
                                    <p className="text-[8px] sm:text-sm" style={{paddingBottom:'5px'}}>Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.</p>

                                    <h4 className="text-sm sm:text-md font-semibold text-gray-900">5. Product Information</h4>
                                    <p className="text-[8px] sm:text-sm" style={{paddingBottom:'5px'}}>We attempt to be as accurate as possible. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.</p>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end" style={{ padding: '0px 10px' }}>
                                <Button onClick={onClose} variant="primary" style={{ padding: '0px 5px' }}>
                                    I Understand
                                </Button>
                            </div>
                        </Motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TermsModal;