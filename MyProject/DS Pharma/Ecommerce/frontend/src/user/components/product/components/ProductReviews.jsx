import React from 'react';
import { Star } from 'lucide-react';
import Loading from '@/shared/components/common/Loading';

const ProductReviews = ({ reviews = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="py-8">
        <Loading size="medium" />
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="max-w-full p-8 mx-auto mb-12 border-t border-gray-100" style={{ padding: '10px' }}>
        <h2
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '18px',
            fontWeight: 600,
            color: '#111827',
            margin: '.5rem',
            letterSpacing: '0.01em',
            marginBottom: '1rem'
          }}
        >
          Customer Reviews
        </h2>
        <p className="text-gray-500" style={{ fontFamily: 'Gyrotrope', fontSize: '14px' }}>
          No reviews yet. Be the first to review this product!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-full p-8 mx-auto mb-8 border-t border-gray-100" style={{ padding: '10px' }}>
      <h2
        style={{
          fontFamily: 'Gyrotrope',
          fontSize: '18px',
          fontWeight: 600,
          color: '#111827',
          margin: '.5rem',
          letterSpacing: '0.01em',
          marginBottom: '1.5rem'
        }}
      >
        Customer Reviews ({reviews.length})
      </h2>
      
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900" style={{ fontFamily: 'Gyrotrope', fontSize: '14px' }}>
                  {review.user}
                </span>
                <span className="text-gray-400 text-[8px] sm:text-xs" style={{ fontFamily: 'Gyrotrope' }}>
                  • {review.date}
                </span>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.floor(review.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600" style={{ fontFamily: 'Gyrotrope', fontSize: '13px', lineHeight: '1.5' }}>
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
