import React from 'react';

const ProductDescription = ({ product }) => {
  // Fallback content if no product data
  if (!product || !product.description) {
    return (
      <div className="max-w-full p-8 mx-auto mb-12" style={{ padding: '10px' }}>
        <h2
          style={{
            fontFamily: 'Gyrotrope',
            fontSize: '18px',
            fontWeight: 600,
            color: '#111827',
            margin: '.5rem',
            letterSpacing: '0.01em'
          }}
        >
          Description
        </h2>
        <div className="space-y-1 text-gray-800" style={{ fontFamily: 'Gyrotrope', fontSize: '12px', lineHeight: '1.6' }}>
          <p>Product description not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full p-8 mx-auto mb-12" style={{ padding: '10px' }}>
      <h2
        style={{
          fontFamily: 'Gyrotrope',
          fontSize: '18px',
          fontWeight: 600,
          color: '#111827',
          margin: '.5rem',
          letterSpacing: '0.01em'
        }}
      >
        Description
      </h2>
      <div className="space-y-1 text-gray-800" style={{ fontFamily: 'Gyrotrope', fontSize: '12px', lineHeight: '1.6' }}>
        <p>{product.description}</p>
        
        {product.benefits && product.benefits.length > 0 && (
          <>
            <h3 className="mt-4 mb-2 text-base font-bold" style={{ color: '#111827' }}>Key Benefits</h3>
            <ul className="pl-4 space-y-2 list-disc list-inside">
              {product.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </>
        )}

        {product.howToUse && product.howToUse.length > 0 && (
          <>
            <h3 className="mt-4 mb-2 text-base font-bold" style={{ color: '#111827' }}>How to Use</h3>
            <ul className="pl-4 space-y-2 list-disc list-inside">
              {product.howToUse.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;
