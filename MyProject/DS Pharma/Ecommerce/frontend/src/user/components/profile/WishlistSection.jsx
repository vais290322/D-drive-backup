import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDataStore from '@/store/useDataStore';
import { useToastStore } from '@/store/useToastStore';
import useIsMobile from '@/shared/hooks/useIsMobile';


const WishlistSection = () => {
    const navigate = useNavigate();
    const { wishlist, removeFromWishlist, moveToCart } = useDataStore();
    const { success, error } = useToastStore();
    const isMobile = useIsMobile(768);


    const handleAddToCart = (product) => {
        if (!product.inStock && product.inStock !== undefined) {
            error("This product is currently out of stock");
            return;
        }
        moveToCart(product.id);
        success(`${product.name} moved to cart`);
    };

    const handleRemove = (productId) => {
        removeFromWishlist(productId);
        success("Item removed from wishlist");
    };

    if (wishlist.length === 0) {
        return (
            <Motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center"
                style={{ 
                maxHeight: 'calc(100vh - 250px)', 
                overflowY: 'auto', 
                padding: isMobile ? '24px 16px' : '48px', 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none', 
                marginTop: isMobile ? '0' : '30px',
                marginBottom: '0px'
            }}

            >
            <div className="flex flex-col items-center justify-center gap-2">
                <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Heart className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} text-pink-500`} />
                </div>
                <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 mb-1`}>Your wishlist is empty</h2>

                <p className={`${isMobile ? 'text-sm' : 'text-md'} text-gray-500 mb-6 max-w-md mx-auto`}>
                    Save items you love here and they'll be waiting for you when you're ready to buy.
                </p>

                <button 
                    onClick={() => navigate('/')}
                    className=" text-sm px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                    style={{ padding: window.innerWidth >= 640 ? '5px 10px' : '2px 10px' }}
                >
                    Explore Products
                </button>
                </div>
            </Motion.div>
        );
    }

    return (
        <div className="space-y-6"
        style={{ 
                height: isMobile ? 'calc(100vh - 180px)' : 'calc(100vh - 150px)', 
                overflowY: 'auto', 
                padding: isMobile ? '8px' : '10px', 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none', 
                marginTop: isMobile ? '0' : '20px',
                marginBottom: '0px'
            }}>

            <div className="flex justify-between items-center">
                <h2 className=" text-md sm:text-lg font-bold text-gray-900" style={{ fontFamily: 'Gyrotrope' }}>
                    My Wishlist ({wishlist.length})
                </h2>
            </div>

            <div className={`grid grid-cols-2 md:grid-cols-2 ${isMobile ? 'gap-4' : 'gap-6'}`} style={{ padding: isMobile ? '0' : '0px 10px' }}>

                {wishlist.map((item) => (
                    <Motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row h-full transition-all hover:shadow-md ${isMobile ? 'p-3' : 'p-4'}`}
                    >
                        {/* Product Image */}
                        <div 
                            className={`relative w-full sm:w-40 ${isMobile ? 'h-32' : 'h-40 sm:h-full'} bg-gray-50 cursor-pointer overflow-hidden group`}
                            onClick={() => navigate(`/product/${item.id}`)}
                        >

                            <img 
                                src={item.image || item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {!item.inStock && item.inStock !== undefined && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold px-2 py-1 bg-red-500 rounded">Out of Stock</span>
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className={`flex-1 ${isMobile ? 'p-3' : 'p-5'} flex flex-col justify-between relative`}>

                            <div className="flex justify-end absolute top-0 right-0" style={{ padding: window.innerWidth >= 640 ? '5px' : '5px' }}>
                                <button 
                                    onClick={() => handleRemove(item.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div style={{ padding: window.innerWidth >= 640 ? '5px 10px' : '5px' }}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 
                                        className={`font-bold ${isMobile ? 'text-base' : 'text-lg'} text-gray-900 line-clamp-1 cursor-pointer hover:text-emerald-600 transition-colors`}
                                        onClick={() => navigate(`/product/${item.id}`)}
                                    >
                                        {item.name}
                                    </h3>

                                    
                                </div>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                    {item.genericName || 'Description not available'}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-4" style={{ padding: window.innerWidth >= 640 ? '5px 10px' : '5px' }}>
                                <span className={`font-bold text-emerald-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
                                    ₹{item.price?.toFixed(2)}
                                </span>
                                <button 
                                    style={{ padding: isMobile ? '3px 8px' : '4px 10px' }}
                                    onClick={() => handleAddToCart(item)}
                                    disabled={!item.inStock && item.inStock !== undefined}
                                    className={`flex items-center gap-2 rounded-lg font-bold transition-all shadow-sm ${
                                        !item.inStock && item.inStock !== undefined
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md active:scale-95'
                                    }`}
                                >
                                    <ShoppingCart className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                                    <span className={`${isMobile ? 'text-[11px]' : 'text-xs'}`} style={{marginTop: isMobile ? '1px' : '3px'}}>
                                        {isMobile ? 'Add' : 'Add to Cart'}
                                    </span>
                                </button>

                            </div>
                        </div>
                    </Motion.div>
                ))}
            </div>
        </div>
    );
};

export default WishlistSection;
