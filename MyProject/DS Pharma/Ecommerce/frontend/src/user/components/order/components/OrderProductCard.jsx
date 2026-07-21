import React from 'react';
import { Card, Button } from '@/shared/components/ui';
import OrderTimeline from './OrderTimeline';
import { canCancelOrder, canReturnOrder } from '@/shared/utils/orderHelpers';

const OrderProductCard = ({ order, onCancel }) => {
  // Handle both single item and multiple items
  const items = order.items || [{
    id: order.id,
    productName: order.productName,
    price: order.price,
    quantity: order.quantity || 1
  }];

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const showCancel = canCancelOrder(order);
  const showReturn = canReturnOrder(order);

  return (
    <Card className="min-h-[330px]">
      {/* Product Info */}
      <div className="flex flex-col mb-2 border-[#64E5B8]" style={{ padding: '5px' }}>
        
        {/* Items List */}
        <div className="flex-1" style={{ padding: '5px 0px' }}>
          <h3
            className="mb-3 text-lg font-semibold text-gray-900"
            style={{ fontFamily: 'Gyrotrope' }}
          >
            Order Items ({totalItems})
          </h3>
          
          {/* Items Display */}
          <div className="space-y-2 mb-4">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0" style={{ padding: '5px 0px'}}>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Gyrotrope' }}>
                    {item.productName || item.name}
                  </p>
                  <p className="text-[8px] sm:text-xs text-gray-600" style={{ fontFamily: 'Gyrotrope' }}>
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Gyrotrope' }}>
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-3 border-t-2 border-emerald-500" style={{ paddingTop: '2px' }}>
            <p className="text-base font-bold text-gray-900" style={{ fontFamily: 'Gyrotrope' }}>
              Total Cart Value
            </p>
            <p className="text-lg font-bold text-emerald-600" style={{ fontFamily: 'Gyrotrope' }}>
              ₹{totalAmount}
            </p>
          </div>

          {/* Timeline (Desktop) */}
          <div className="mt-6">
            <OrderTimeline
              timeline={order.timeline}
              deliveryPartner={order.deliveryPartner}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center" style={{ padding: '5px' }}>
      {/* Order Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-2 pt-4 sm:mb-4" style={{ padding: '0px 5px' }}>
        <OrderDetail label="Order ID" value={order.id} />
        <OrderDetail label="Contact Agent" value={order.contactAgent || 'N/A'} />
        <OrderDetail label="Tracking ID" value={order.trackingId || 'N/A'} />
        <OrderDetail label="Pin" value={order.pin || 'N/A'} />
        <OrderDetail label="Courier Name" value={order.courierName || 'N/A'} />
        <OrderDetail label="OTP" value={order.otp || 'N/A'} />
      </div>

      {/* Action Button */}
        <div className="flex justify-end pt-4" style={{ marginTop: '5px' }}>
          {(showCancel || showReturn) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onCancel} 
              style={{ padding: '5px 10px' }}
            >
              <span className="text-[8px] sm:text-xs" style={{ fontFamily: 'Gyrotrope' }}>
                {showReturn ? 'Return Order' : 'Cancel Order'}
              </span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

const OrderDetail = ({ label, value }) => (
  <div>
    <p
      className="text-[8px] sm:text-xs text-gray-600"
      style={{ fontFamily: 'Gyrotrope', marginBottom: '4px' }}
    >
      {label}:
      <span className="ml-1 font-semibold text-gray-900">{value}</span>
    </p>
  </div>
);

export default OrderProductCard;