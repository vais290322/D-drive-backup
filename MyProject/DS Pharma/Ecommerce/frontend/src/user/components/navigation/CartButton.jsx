import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/shared/utils';

/**
 * Cart button component with item count badge
 * @param {Object} props
 * @param {number} props.totalCartItems - Number of items in cart
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Optional click handler
 */
export const CartButton = ({ 
  totalCartItems = 0, 
  className = '', 
  onClick,
  ...props 
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      navigate('/cart');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
        className
      )}
      {...props}
    >
      <ShoppingBag className="w-5 h-5 text-gray-700" />
      
      {totalCartItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
          {totalCartItems > 99 ? '99+' : totalCartItems}
        </span>
      )}
    </button>
  );
};

export default CartButton;