import React from 'react';

const Loading = ({ size = 'medium', color = 'emerald-600', className = '', text = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-4',
    large: 'h-12 w-12 border-4',
  };

  return (
    <div className={`flex flex-col justify-center items-center gap-4 ${className}`}>
      <div
        className={`animate-spin rounded-full border-gray-200 border-t-${color} ${sizeClasses[size]}`}
      ></div>
      {text && <p className="text-gray-600 font-medium">{text}</p>}
    </div>
  );
};

export default Loading;
