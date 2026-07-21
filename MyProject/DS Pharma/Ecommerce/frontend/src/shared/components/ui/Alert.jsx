import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const Alert = ({ type = 'info', title, message, onClose }) => {
  const variants = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: Info },
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: CheckCircle },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: AlertTriangle },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: AlertCircle },
  };

  const { bg, border, text, icon: Icon } = variants[type];

  return (
    <div className={`${bg} border ${border} rounded-lg p-4 mb-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`${text} mt-0.5 shrink-0`} size={20} />
        <div className="flex-1">
          {title && (
            <h3
              className={`${text} font-semibold mb-1`}
              style={{ fontFamily: 'Gyrotrope' }}
            >
              {title}
            </h3>
          )}
          <p className={`${text} text-sm`} style={{ fontFamily: 'Gyrotrope' }}>
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${text} hover:opacity-70 cursor-pointer`}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;