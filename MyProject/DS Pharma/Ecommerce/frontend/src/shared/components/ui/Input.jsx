import React from 'react';

const Input = ({
  label,
  error,
  placeholder,
  type = 'text',
  className = '',
  labelClassName = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          className={`block mb-2 text-[12px] font-semibold text-gray-700 ${labelClassName}`}
          style={{ fontFamily: 'Gyrotrope' }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-[12px] placeholder:text-[12px] ${className}`}
        style={{ fontFamily: 'Gyrotrope' }}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;