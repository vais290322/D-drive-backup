import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed with this action?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "warning", // warning, danger, info
    isLoading = false
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch(variant) {
            case 'danger': return <AlertTriangle className="h-6 w-6 text-red-600" />;
            case 'warning': return <AlertTriangle className="h-6 w-6 text-amber-600" />;
            default: return <AlertTriangle className="h-6 w-6 text-emerald-600" />;
        }
    };

    const getConfirmButtonVariant = () => {
         switch(variant) {
            case 'danger': return 'destructive'; // Assuming you have this variant
            case 'warning': return 'primary'; // Or a specific warning variant if available
            default: return 'primary';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-x-hidden" style={{ padding: '10px'}} >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200"
                    >
                        <div className="p-8" style={{ padding: '10px'}} >
                            <div className="flex items-start justify-between mb-4" style={{ marginBottom: '10px'}}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${variant === 'danger' ? 'bg-red-100' : variant === 'warning' ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                                        {getIcon()}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mt-1" style={{ marginTop: '5px'}}>{title}</h3>
                                </div>
                            </div>
                            
                            <p className="text-sm text-gray-500 mb-6 ml-11">
                                {message}
                            </p>

                            <div className="flex justify-end gap-3">
                                <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                                    {cancelText}
                                </Button>
                                <Button 
                                    variant={getConfirmButtonVariant()} 
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    isLoading={isLoading}
                                >
                                    {confirmText}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
