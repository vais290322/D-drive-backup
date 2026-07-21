import React from 'react';
import Badge from './Badge';

const PriceDisplay = ({ price, originalPrice, discount, showDiscount = true }) => {
  return (
    <div className="flex items-center gap-3">
      <span
        className="text-3xl font-bold text-gray-900"
        style={{ fontFamily: 'Gyrotrope' }}
      >
        ₹{price}
      </span>
      {originalPrice && (
        <span
          className="text-lg text-gray-400 line-through"
          style={{ fontFamily: 'Gyrotrope' }}
        >
          ₹{originalPrice}
        </span>
      )}
      {showDiscount && discount && (
        <Badge variant="discount">{discount}% Off</Badge>
      )}
    </div>
  );
};

export default PriceDisplay;