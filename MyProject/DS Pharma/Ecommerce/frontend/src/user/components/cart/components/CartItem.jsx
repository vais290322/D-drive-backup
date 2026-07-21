import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Trash2, Plus, Minus, Package, AlertTriangle } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleProductClick = () => {
    // Use rid (Marg ID) for product routing, fallback to id if rid not available
    const productId = item.rid || item.id || item._id;
    navigate(`/product/${productId}`);
  };

  // Handle missing or broken images
  const getImageSrc = () => {
    if (imageError || !item.image) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiByeD0iOCIgZmlsbD0iI2YzZjRmNiIvPgo8cGF0aCBkPSJNMTUgMjVIMzVWMzVIMTVWMjVaIiBmaWxsPSIjYjViZGMwIi8+CjxwYXRoIGQ9Ik0yMCAzMEgzMFY0MEgyMFYzMFoiIGZpbGw9IiNiNWJkYzAiLz4KPC9zdmc+';
    }
    return item.image;
  };

  // Format price with fallback
  const formatPrice = (price) => {
    const numPrice = Number(price) || 0;
    return numPrice.toFixed(2);
  };

  // Calculate item total
  const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);

  return (
    <Motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '10px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
        border: '1px solid #64E5B8',
        marginBottom: '10px'
      }}
    >
      <div className="flex gap-4">
        {/* Product Image */}
        <div
          className="shrink-0 overflow-hidden w-16 h-16 md:w-[72px] md:h-[72px] rounded-lg bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
          onClick={handleProductClick}
        >
          {imageError ? (
            <Package className="w-6 h-6 text-gray-400" />
          ) : (
            <img
              src={getImageSrc()}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4 text-bottom">
              <h3
                className="font-gyrotrope text-[8px] sm:text-xs md:text-[16px] font-semibold text-black mb-5 leading-relaxed tracking-tight pt-2 cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={handleProductClick}
              >
                {item.name}
              </h3>
              <div className="flex items-center gap-2 mt-15" style={{
                paddingTop: '4px'
              }}>
                <span className="font-gyrotrope text-[8px] sm:text-xs md:text-[16px] font-bold text-black">
                  ₹{formatPrice(item.price)}
                </span>
                {item.originalPrice && Number(item.originalPrice) !== Number(item.price) && (
                  <span className="font-gyrotrope text-[8px] sm:text-xs md:text-[13px] font-normal text-gray-400 line-through">
                    ₹{formatPrice(item.originalPrice)}
                  </span>
                )}
                {item.discount > 0 && (
                  <span className="font-gyrotrope text-[10px] md:text-[11px] font-semibold text-emerald-500 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {item.discount}% Off
                  </span>
                )}
              </div>
              
              {/* Item Total Amount */}
              <div className="mt-2.5" style={{paddingTop: '5px'}}>
                <p className="font-gyrotrope text-[10px] sm:text-[11px] md:text-[14px] text-gray-500 font-medium">
                  Item Total: <span className="text-black font-bold">₹{itemTotal.toFixed(2)}</span>
                </p>
              </div>

              {/* Stock Warning */}
              {item.stock !== undefined && item.quantity > item.stock && (
                <div className="mt-2 flex items-center gap-1 text-orange-600">
                  <AlertTriangle size={14} />
                  <span className="text-[10px] font-medium">Only {item.stock} items available</span>
                </div>
              )}
              {item.stock === 0 && (
                <div className="mt-2 flex items-center gap-1 text-red-600">
                  <AlertTriangle size={14} />
                  <span className="text-[10px] font-medium">Out of Stock</span>
                </div>
              )}

            </div>
            <div className='flex flex-col items-end'>

              {/* Delete Button */}
              <button
                onClick={() => onRemove(item._id)}
                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors cursor-pointer self-end mb-3"
                aria-label="Remove item"
                style={{
                  alignSelf: 'flex-end',
                  marginBottom: '12px'
                }}
              >
                <Trash2 size={16} color="black" strokeWidth={2} />
              </button>

              {/* Quantity Controls */}

              <div className="flex items-center justify-end" style={{
                paddingTop: '8px'
              }}>
                <button
                  onClick={() => onUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                  className="flex items-center justify-center border hover:bg-gray-50 transition-colors cursor-pointer w-6 h-6 md:w-7 md:h-7 rounded-md border-gray-300"
                  aria-label="Decrease quantity"
                  disabled={item.quantity <= 1}
                >
                  <Minus size={14} strokeWidth={2.5} />
                </button>
                <span className="font-gyrotrope text-[8px] sm:text-xs md:text-sm font-semibold text-black min-w-[24px] text-center">
                  {item.quantity || 1}
                </span>
                <button
                  onClick={() => {
                    const newQuantity = item.quantity + 1;
                    // Check stock availability
                    if (item.stock !== undefined && newQuantity > item.stock) {
                      // Could show a toast here about stock limit
                      return;
                    }
                    onUpdateQuantity(item._id, newQuantity);
                  }}
                  className={`flex items-center justify-center border transition-colors cursor-pointer w-6 h-6 md:w-7 md:h-7 rounded-md ${
                    item.stock !== undefined && item.quantity >= item.stock
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  aria-label="Increase quantity"
                  disabled={item.stock !== undefined && item.quantity >= item.stock}
                >
                  <Plus size={14} strokeWidth={2.5} />
                </button>

              </div>

            </div>
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

export default CartItem;
