import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={`relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 ${sizes[size]} w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100/50" style={{ padding: '10px 10px 0px 10px' }}>
          <h2
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: 'Gyrotrope' }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 transition-colors rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>
        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;