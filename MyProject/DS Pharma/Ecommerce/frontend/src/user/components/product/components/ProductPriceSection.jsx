import React from 'react';

const ProductPriceSection = ({ price, originalPrice, discount, stock, specialOffer }) => {
  return (
    <div className="bg-white rounded-lg p-6 ">
      {/* Price Section */}
      <div className="mb-6" style={{ padding: '0 10px' }}>
        <div className="flex items-center flex-wrap gap-3 mb-3">
          <span
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: 'Gyrotrope' }}
          >
            ₹{Number(price).toLocaleString('en-IN')}
          </span>
          
          {originalPrice > price && (
            <span
              className="text-lg text-gray-400 line-through"
              style={{ fontFamily: 'Gyrotrope', textDecorationThickness: '1px' }}
            >
              ₹{Number(originalPrice).toLocaleString('en-IN')}
            </span>
          )}

          {discount > 0 && (
            <span
              className="px-3 py-1 text-sm font-bold text-white bg-emerald-600 rounded-md shadow-sm"
              style={{ fontFamily: 'Gyrotrope' }}
            >
              {discount}% OFF
            </span>
          )}
        </div>

        {discount > 0 && originalPrice > price && (
          <div className="mb-4">
            <span className="text-emerald-700 font-bold text-sm" style={{ fontFamily: 'Gyrotrope' }}>
              Special Price: Save ₹{Math.round(originalPrice - price)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <div 
            className={`w-2.5 h-2.5 rounded-full ${
              stock === 0 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
              stock <= 5 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 
              'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
            } animate-pulse`}
          />
          <span
            className="text-sm font-bold tracking-tight"
            style={{
              fontFamily: 'Gyrotrope',
              color: stock === 0 ? '#EF4444' : stock <= 5 ? '#F59E0B' : '#059669',
            }}
          >
            {stock === 0 ? 'Currently Out of Stock' : stock <= 5 ? `Only ${stock} items left!` : 'Currently in Stock'}
          </span>
        </div>
      </div>
      
     
      {/* <div style={{ marginBottom: '1rem' }}>
        
      <div
        className="mb-6 p-4 rounded-lg border-2"
        style={{
          borderColor: '#FED7AA',
          backgroundColor: '#FFF7ED',
          padding: '10px',
        }}
      >
        <h3
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '14px',
            fontWeight: 600,
            color: '#000000',
            marginBottom: '8px'
          }}
        >
          Special Offer For You
        </h3>
        <div className="flex items-start gap-2 w-[220px] bg-white rounded-lg shadow-sm" style={{ padding: '5px' }}>
          <div className="w-10 h-10 rounded-lg shadow-sm overflow-hidden flex items-center justify-center bg-green-50">
            
             <img src="https://cdn-icons-png.flaticon.com/512/726/726488.png" alt="Offer" className="w-6 h-6 object-contain" />
          </div>
          <div className="flex flex-col justify-center" style={{ marginTop: '5px' }}>
          <span
            style={{
              fontFamily: 'Gyrotrope',
              fontSize: '10px',
              fontWeight: 600,
              color: '#000000'
            }}
          >
            {specialOffer.title}
          </span>
          <p
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '8px',
            color: '#6B7280',
            marginTop: '4px'
          }}
        >
          {specialOffer.code}
        </p>
        </div>
        </div>
        
      </div>
      </div> */}

      
    </div>
  );
};

export default ProductPriceSection;