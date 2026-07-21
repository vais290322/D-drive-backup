import React from 'react';
import { Card } from '@/shared/components/ui';

const PaymentBreakdownCard = ({ breakdown, className }) => {
  return (
    <Card className={`p-3 sm:p-4 mb-[5px] lg:mb-0 ${className || ''}`} style={{ padding: '10px' }}>
      <h3 className="mb-2 sm:mb-3 text-sm sm:text-base font-semibold text-[#34B485]" style={{ fontFamily: 'Gyrotrope', marginBottom: '10px' }}>
        Payment Breakdown
      </h3>
      <div className="space-y-1 sm:space-y-2 text-[10px] sm:text-[8px] sm:text-xs p-2 sm:p-3">
        <BreakdownRow label="Total Cart Value" value={breakdown.totalCartValue} />
        <BreakdownRow label="Discount" value={breakdown.discount} isDeduction />
        <BreakdownRow label="Coupon" value={breakdown.coupon} isDeduction />
        <BreakdownRow label="GST" value={breakdown.gst} />
        <BreakdownRow label="Delivery Charges" value={breakdown.deliveryCharges} style={{ marginBottom: '5px' }} />
        <div className="pt-2 mt-2 border-t border-[#64E5B8]" style={{ paddingTop: '10px' }}>
          <BreakdownRow label="Total" value={breakdown.total} isTotal />
        </div>
      </div>
    </Card>
  );
};

const BreakdownRow = ({ label, value, isDeduction, isTotal }) => (
  <div className="flex justify-between text-[8px] sm:text-sm">
    <span
      className={isTotal ? 'font-bold text-gray-900' : 'text-gray-600'}
      style={{ fontFamily: 'Gyrotrope' }}
    >
      {label}
    </span>
    <span
      className={`font-semibold ${isDeduction ? 'text-green-600' : 'text-gray-900'} ${isTotal ? 'text-sm sm:text-base' : ''
        }`}
      style={{ fontFamily: 'Gyrotrope' }}
    >
      {isDeduction ? '-' : ''}₹{value}
    </span>
  </div>
);

export default PaymentBreakdownCard;