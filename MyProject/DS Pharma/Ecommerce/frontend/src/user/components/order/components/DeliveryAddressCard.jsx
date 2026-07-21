import React, { useState, useEffect } from 'react';
import { Card } from '@/shared/components/ui';

const DeliveryAddressCard = ({ address, className }) => {
  const [currentAddress, setCurrentAddress] = useState(address);

  // Sync with prop if it changes initially or externally
  useEffect(() => {
    if (address) {
      setCurrentAddress(address);
    }
  }, [address]);

  if (!currentAddress) return null;

  return (
    <Card className={`p-3 sm:p-4 mb-2.5 lg:mb-0 relative ${className || ''}`} style={{ padding: '10px 5px', marginBottom: '5px' }}>
      <div className="flex flex-col h-full justify-between">
        <div className="flex-1">
          <h3 className="mb-2 sm:mb-3 text-[10px] md:text-base font-semibold text-[#34B485]" style={{ fontFamily: 'Gyrotrope', margin: '5px 8px' }}>
            Delivery Address
          </h3>

          <div className="mb-2 sm:mb-3 text-[8px] sm:text-xs leading-relaxed text-gray-700" style={{ fontFamily: 'Gyrotrope', margin: '5px 8px' }}>
            <p className="mb-1 font-semibold flex items-center gap-2">
              {currentAddress.name} - {currentAddress.phone}
              <span className="px-2 py-0.5 text-[8px] sm:text-[10px] bg-gray-100 text-gray-600 rounded-md font-medium border border-gray-200">
                <span style={{ padding: '0px 8px' }}>{currentAddress.type || 'Home'}</span>
              </span>
            </p>
            <p className="text-gray-600 line-clamp-2">
              {currentAddress.address}
              {currentAddress.city ? `, ${currentAddress.city}, ${currentAddress.state} - ${currentAddress.pincode || currentAddress.postalCode}` : ''}
            </p>
          </div>
        </div>
      </div> 
    </Card>
  );
};

export default DeliveryAddressCard;