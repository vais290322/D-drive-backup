import React from 'react';

const OrderTimeline = ({ timeline = [], deliveryPartner }) => {
  // Filter out the 'Expected Delivery' step which is sometimes added in the middle
  const filteredTimeline = timeline.filter(step => step.status !== 'Expected Delivery');

  return (
    <div className="w-full min-h-20">
      {/* Progress Bar */}
      <div className="flex items-center justify-between">
        {filteredTimeline.map((step, index) => (
          <TimelineStep key={index} step={step} isLast={index === filteredTimeline.length - 1} />
        ))}
      </div>
      

      {/* Delivery Partner Message */}
      <p
        className="mt-8 text-[8px] sm:text-xs font-medium text-center text-green-700"
        style={{ fontFamily: 'Gyrotrope', margin: '5px 0px',}}
      >
        Delivery Partner: {deliveryPartner}
      </p>
    </div>
  );
};

const TimelineStep = ({ step, isLast }) => (
  <div className="relative flex flex-col items-center flex-1">
  
    {/* Connector Line */}
    {!isLast && (
      <div
        className="absolute top-2 left-1/2 w-full h-0.5"
        style={{
          backgroundColor: step.completed ? '#10B981' : '#D1D5DB',
          zIndex: 0,
        }}
      />
    )}

    {/* Status Dot */}
    <div
      className="relative z-10 w-5 h-5 mb-2 rounded-full"
      style={{
        backgroundColor: step.completed ? '#10B981' : '#D1D5DB',
        border: step.active ? '3px solid #059669' : 'none',
      }}
    />

    {/* Status Label */}  
    <p
      className="text-[8px] sm:text-[10px] text-center max-w-[120px] my-1"
      style={{
        fontFamily: 'Gyrotrope',
        color: step.completed || step.active ? '#000000' : '#9CA3AF',
        fontWeight: step.active ? 600 : 400,
      }}
    >
      {step.status}
    </p>

    {/* Date Label - Show with step if available */}
    {step.date && (
      <p
        className="text-[8px] sm:text-[10px] text-center text-green-700"
        style={{ fontFamily: 'Gyrotrope', marginTop: '5px' }}
      >
        {step.date}
      </p>
    )}
  </div>
);

export default OrderTimeline;
