import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 cursor-pointer font-gyrotrope';

  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg disabled:bg-gray-400',
    secondary: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50 disabled:border-gray-400 disabled:text-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400',
    success: 'bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    full: 'w-full px-6 py-2.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{ fontFamily: 'Gyrotrope' }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
