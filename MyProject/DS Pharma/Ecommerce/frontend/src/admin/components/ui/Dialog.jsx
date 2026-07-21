import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Dialog = ({ open, onOpenChange, children }) => {
    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ padding: '10px' }}>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
                        onClick={() => onOpenChange(false)}
                    />
                    
                    {/* Content Wrapper to handle positioning and animation */}
                    {React.Children.map(children, child => {
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child, { onOpenChange });
                        }
                        return child;
                    })}
                </div>
            )}
        </AnimatePresence>
    );
};

export const DialogContent = ({ children, className = "", onOpenChange }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`relative z-50 w-full bg-white rounded-lg shadow-xl overflow-hidden ${className}`}
            style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        >
            <button
                onClick={() => onOpenChange && onOpenChange(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500"
            >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </button>
            {children}
        </motion.div>
    );
};

export const DialogHeader = ({ children, className = "" }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

export const DialogTitle = ({ children, className = "" }) => (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
        {children}
    </h2>
);

export const DialogFooter = ({ children, className = "" }) => (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 bg-gray-50/50 ${className}`}>
        {children}
    </div>
);
