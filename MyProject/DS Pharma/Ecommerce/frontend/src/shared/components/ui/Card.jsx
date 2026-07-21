import React from 'react';

const Card = ({ children, className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-white rounded-lg shadow-sm border border-gray-200',
    elevated: 'bg-white rounded-lg shadow-lg border border-gray-200',
    outlined: 'bg-white rounded-lg border-2 border-gray-300',
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;