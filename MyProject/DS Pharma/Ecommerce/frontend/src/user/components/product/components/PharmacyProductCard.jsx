import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAddToCart } from '@/shared/hooks/queries/useCartQuery';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import useDataStore from '@/store/useDataStore';
import CartIcon from '@/assets/icons/Cart.png';
import SafeImage from '@/shared/components/SafeImage';
import toastUtil from '@/shared/utils/toast';


const PharmacyProductCard = ({
  id,
  rid, // Use rid for cart identification
  name,
  price,
  originalPrice,
  mrp,
  discount,
  quantity,
  unit = 'piece',
  imageUrl,
  image,
  stock,
  inStock = true,
  onCardClick = null,
  className = ''
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const addItemToLocalCart = useCartStore((state) => state.addItem);
  const { mutate: addToCartMutation, isPending } = useAddToCart();

  // Use useDataStore for wishlist (to avoid conflicting with new useCartStore for now if they are different)
  const wishlist = useDataStore((state) => state.wishlist);
  const addToWishlist = useDataStore((state) => state.addToWishlist);
  const removeFromWishlist = useDataStore((state) => state.removeFromWishlist);

  const isInWishlist = wishlist.some((item) => item.id === id);

  // Handle image prop variation (image vs imageUrl)
  const displayImage = imageUrl || image;

  // Use mrp or originalPrice for comparison price
  const comparisonPrice = mrp || originalPrice;

  const discountPercentage = comparisonPrice && price && comparisonPrice > price
    ? Math.round(((comparisonPrice - price) / comparisonPrice) * 100)
    : discount || 0;

  // Determine if product is available
  // Robust check: Only treat as unavailable if explicitly inStock === false OR stock is explicitly 0
  const isAvailable = inStock !== false && (stock === undefined || Number(stock) > 0);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAvailable) return;

    // productId (rid) is required for both backend and local cart
    // User requested strict usage of 'rid' from product data
    const productRid = rid; 

    if (isAuthenticated) {
      if (!productRid) {
        toastUtil.error("Product RID missing. Cannot add to cart.");
        return;
      }
      // Logic for logged in users: Sync directly to backend
      addToCartMutation({
        image: displayImage,
        name,
        price,
        originalPrice: comparisonPrice || price,
        discount: discountPercentage,
        rid: productRid,
        quantity: 1,
      });
    } else {
      // Logic for guest users: Save to local store and redirect to login
      addItemToLocalCart({
        id,
        rid,
        name,
        price,
        originalPrice: comparisonPrice || price,
        discount: discountPercentage,
        image: displayImage,
        unit,
        stock
      }, 1);

      toastUtil.info("Login to sync your cart!");
      navigate(`/login?redirect=${window.location.pathname}`);
    }
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        name,
        price,
        originalPrice: comparisonPrice || price,
        discount: discountPercentage,
        image: displayImage,
        unit,
      });
    }
  };

  const handleCardClick = () => {
    // If onCardClick is provided by parent, use it (it usually handles navigation)
    // Otherwise, use default navigation to product details
    if (onCardClick) {
      onCardClick({ id, name, price, quantity, unit });
    } else {
      // console.log("product id : ",rid);
      navigate(`/product/${rid}`);
    }
  };

  // Check if transparent variant is requested via className or props (could be extended)
  const isTransparent = className.includes('bg-transparent');
  const baseBgClass = isTransparent ? '' : 'bg-white';

  return (
    <>
      <style>{`
        .cart-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-button {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 4px 4px 8px #d1d5db, -4px -4px 8px #ffffff;
          outline: none;
        }

        @media (max-width: 640px) {
          .cart-button {
            width: 32px;
            height: 32px;
          }
        }

        .cart-button:hover {
          box-shadow: 2px 2px 4px #d1d5db, -2px -2px 4px #ffffff;
          transform: translateY(-1px);
        }

        .cart-button:active {
          box-shadow: inset 4px 4px 8px #d1d5db, inset -4px -4px 8px #ffffff;
          transform: translateY(1px);
        }

        .cart-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
          background: #f1f5f9;
        }

        .cart-button img {
          width: 18px;
          height: 18px;
          object-fit: contain;
          opacity: 0.8;
          transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
        }

        @media (max-width: 640px) {
          .cart-button img {
            width: 14px;
            height: 14px;
          }
        }

        .cart-button:active img {
          transform: scale(0.9);
          opacity: 1;
        }

        .cart-button:focus-visible {
          outline: 2px solid #10b981;
          outline-offset: 2px;
        }
      `}</style>
      <div
        className={`${baseBgClass} overflow-hidden rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md w-full ${className} ${!isAvailable ? 'opacity-60' : ''}`}
        style={{ maxWidth: '300px', padding: '10px' }}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`${name} - ${quantity} ${unit} - ₹${price}`}
      >
        {/* Product Image */}
        <div className="relative rounded-sm overflow-hidden aspect-4/3 bg-linear-to-br from-sky-100 to-sky-200">
          <SafeImage
            src={displayImage}
            alt={name}
            className="object-cover w-full h-full px-2 py-2"
            loading="lazy"
          />

          {/* Wishlist Button */}
          {/* <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors duration-150"
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            style={{ padding: '5px' }}
          >
            <Heart
              className={isInWishlist ? 'fill-red-500 text-red-500 w-3 h-3 sm:w-4 sm:h-4' : 'text-gray-400 w-3 h-3 sm:w-4 sm:h-4'}
            />
          </button> */}

          {/* Out of Stock Badge */}
          {!isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="px-3 py-1 text-[8px] sm:text-xs font-semibold text-white bg-red-500 rounded-full" style={{ padding: '5px' }}>
                Out of Stock
              </span>
            </div>
          )}

          {/* Discount Badge */}
          {discountPercentage > 0 && isAvailable && (
            <div className="absolute top-2 left-2 px-2 py-0.5 text-[8px] sm:text-[10px] font-bold text-white bg-green-500 rounded" style={{ padding: '1px  5px' }}>
              {discountPercentage}% OFF
            </div>
          )}

          {/* Dark shadow gradient on upper half */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: '50%',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), transparent)'
            }}
          />
        </div>

        {/* Product Info */}
        <div className="relative pt-2 translate-y-1/8" >
          {/* Product Name */}
          <h3 className="flex items-center justify-start text-[10px] sm:text-[14px] font-semibold leading-tight text-left text-gray-900 min-h-8">
            {name && name.length > 15 ? `${name.substring(0, 13)}...` : (name || 'Unnamed Product')}
          </h3>

          {/* Price and Discount Group */}
          <div className="flex flex-col gap-1 mb-3">
            {/* Effective Price and Discount Badge */}
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
              <span className="text-[12px] sm:text-[16px] font-bold text-gray-900 tracking-tight" title={`Selling Price: ₹${price}`}>
                ₹{Number(price).toLocaleString('en-IN')}
              </span>

              {discountPercentage > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] sm:text-[10px] text-gray-40font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-md shadow-sm">
                    {discountPercentage}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* MRP & Packing/Unit Details */}
            <div className="flex items-center gap-1 flex-row min-h-4">
              {comparisonPrice > price && (
                <span className="text-[8px] sm:text-[10px] text-gray-400 line-through decoration-gray-400/60 font-medium">
                  MRP ₹{Number(comparisonPrice).toLocaleString('en-IN')}
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="text-[8px] sm:text-[10px] text-emerald-600 font-bold">
                  Save ₹{Math.round(comparisonPrice - price)}
                </span>
              )}
              <span className="text-[8px] sm:text-[10px] text-gray-400 font-medium whitespace-nowrap">
                {unit || 'strip'}
              </span>
            </div>
          </div>

          {/* Cart Icon - Neumorphic Design */}
          <div className="cart-toggle absolute right-0 top-1/2 -translate-y-1/2">
            <button
              onClick={handleAddToCart}
              disabled={isPending || !isAvailable}
              className="cart-button"
              aria-label={isAvailable ? `Add ${name} to cart` : 'Out of stock'}
            >
              <img
                src={CartIcon}
                alt="Add to Cart"
              />
            </button>
          </div>

        </div>
      </div>
    </>
  );
};


export default PharmacyProductCard;
