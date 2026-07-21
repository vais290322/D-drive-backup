import React from 'react';

const OrderContactSection = ({ onShareDetails, onDownloadReceipt }) => {
  return (
    <div className="m-[15px] flex justify-between w-[50%] border bg-white border-gray-200">
      {/* Contact Customer Care */}
      <div className="pt-4 mt-4">
        <p
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '14px',
            color: '#6B7280',
          }}
        >
          Contact Customer Care
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onShareDetails}
          className="px-6 py-2 font-semibold transition-colors rounded-md cursor-pointer"
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '14px',
            backgroundColor: '#10B981',
            color: '#FFFFFF',
            border: 'none',
            padding: '8px 10px',
          }}
        >
          Share Order Details
        </button>
        <button
          onClick={onDownloadReceipt}
          className="px-6 py-2 font-semibold transition-colors rounded-md cursor-pointer"
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '14px',
            backgroundColor: '#F97316',
            color: '#FFFFFF',
            border: 'none',
            padding: '8px 10px',
          }}
        >
          Download Receipt
        </button>
      </div>
    </div>
  );
};

export default OrderContactSection;