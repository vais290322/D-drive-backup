import React from 'react';

const Loader = ({ size = 'md', variant = 'spinner' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  if (variant === 'spinner') {
    return (
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin`} />
    );
  }

  return (
    <div className="flex items-center justify-center gap-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

export default Loader;