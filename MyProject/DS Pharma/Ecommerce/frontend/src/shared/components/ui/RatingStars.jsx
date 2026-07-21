import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, count = 0, size = 'md', interactive = false, onRate }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate?.(star)}
            className={`${sizes[size]} transition-colors cursor-pointer ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-300' : ''}`}
            disabled={!interactive}
          >
            <Star fill={star <= rating ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
      {count > 0 && (
        <span
          className="text-sm text-gray-600"
          style={{ fontFamily: 'Gyrotrope' }}
        >
          ({count})
        </span>
      )}
    </div>
  );
};

export default RatingStars;