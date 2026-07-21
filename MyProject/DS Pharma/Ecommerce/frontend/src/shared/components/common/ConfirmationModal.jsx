import React from 'react';
import Modal from '../ui/Modal';
import { Button } from '../ui';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  isLoading, 
  confirmText = "Confirm",
  confirmVariant = "primary",
  icon: Icon = AlertCircle
}) => {
  const getVariantStyles = () => {
    switch (confirmVariant) {
      case 'danger': return { 
        bg: 'bg-red-50/50', 
        icon: 'text-red-500', 
        accent: 'border-red-100/50',
        button: 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
      };
      case 'warning': return { 
        bg: 'bg-amber-50/50', 
        icon: 'text-amber-500', 
        accent: 'border-amber-100/50',
        button: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
      };
      default: return { 
        bg: 'bg-teal-50/30', 
        icon: 'text-teal-600', 
        accent: 'border-teal-100/30',
        button: 'bg-[#31cc98] hover:bg-[#28b687] shadow-[#31cc98]/20'
      };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="flex flex-col items-center text-center p-2"
            style={{ padding: '5px' }}
          >
            <div className={`p-4 mb-6 ${styles.bg} rounded-full border ${styles.accent} shadow-inner`}>
              <Icon className={`w-8 h-8 ${styles.icon}`} strokeWidth={2.5} />
            </div>
            
            <h3 className="mb-3 text-xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Gyrotrope' }}>
              {title}
            </h3>
            
            <p className="mb-8 text-gray-500 text-xs leading-relaxed max-w-[320px]" style={{ fontFamily: 'Gyrotrope' }}>
              {message}
            </p>
    
            <div className="flex w-[90%] gap-2" style={{ paddingBottom: '20px', paddingTop: '10px' }}>
              <Button 
                variant="ghost" 
                className="flex-1 h-8 rounded-xl font-bold  bg-gray-400 hover:bg-gray-600 transition-all active:scale-95" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                className={`flex-1 h-8 rounded-xl font-bold text-white shadow-xl active:scale-95 transition-all ${styles.button}`} 
                onClick={onConfirm}
                isLoading={isLoading}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default ConfirmationModal;
