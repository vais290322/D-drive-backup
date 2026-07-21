import React from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_AVATAR } from '@/utils/imageValidation';

/**
 * Avatar Component
 * Reusable avatar component with fallback support
 * Used across user profile, admin panel, navigation, etc.
 */
const Avatar = ({
  src,
  alt = 'User avatar',
  size = 'md',
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
  };

  const handleError = (e) => {
    e.target.src = DEFAULT_AVATAR;
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 flex-shrink-0 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <img
        src={src || DEFAULT_AVATAR}
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Avatar;
