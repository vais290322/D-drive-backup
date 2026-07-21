import React from 'react';

const AppliedCouponCard = ({ coupon, className }) => {
  if (!coupon) return null;

  return (
    <div className={`p-3 sm:p-4 bg-orange-100 border border-orange-500 rounded-lg shadow-sm mb-[15px] lg:mb-0 ${className || ''}`} style={{ padding: '10px 5px' }}>
      <h3
        className="text-[8px] sm:text-sm font-semibold text-orange-500 px-2 pt-2 sm:px-3 sm:pt-3"
        style={{
          fontFamily: 'Gyrotrope',
        }}
      >
        Applied Coupon
      </h3>
      <p
        className="text-[10px] sm:text-sm text-gray-700 px-2 pb-2 sm:px-3 sm:pb-3 mb-2 sm:mb-3"
        style={{
          fontFamily: 'Gyrotrope',
        }}
      >
        {coupon.code}
      </p>
    </div>
  );
};

export default AppliedCouponCard;
