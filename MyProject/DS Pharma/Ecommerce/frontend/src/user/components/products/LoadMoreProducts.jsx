import React, { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/productService';
import { PharmacyProductCard } from '@/user/components/product';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const LoadMoreProducts = ({ initialLimit = 25, initialPage = 1 }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial products
  useEffect(() => {
    const fetchInitialProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.getAllProducts({
          page: initialPage,
          limit: initialLimit
        });
        
        setProducts(response.data || []);
        // Fallback to checking if we got the full limit to determine if there are more
        const hasFullLimit = response.data && response.data.length === initialLimit;
        setHasMore(response.pagination?.hasMore ?? hasFullLimit);
      } catch (err) {
        console.error('Failed to fetch initial products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialProducts();
  }, [initialLimit, initialPage]);

  // Load more products
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setError(null);
    
    try {
      const nextPage = page + 1;
      const response = await productService.getAllProducts({
        page: nextPage,
        limit: initialLimit
      });

      const newProducts = response.data || [];
      setProducts(prev => [...prev, ...newProducts]);
      // Fallback to checking if we got the full limit to determine if there are more
      const hasFullLimit = newProducts && newProducts.length === initialLimit;
      setHasMore(response.pagination?.hasMore ?? hasFullLimit);
      setPage(nextPage);
    } catch (err) {
      console.error('Failed to load more products:', err);
      setError('Failed to load more products. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  }, [page, hasMore, loadingMore, initialLimit]);

  // Reset and fetch fresh data
  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getAllProducts({
        page: initialPage,
        limit: initialLimit
      });
      
      setProducts(response.data || []);
      setPage(initialPage);
      // Fallback to checking if we got the full limit to determine if there are more
      const hasFullLimit = response.data && response.data.length === initialLimit;
      setHasMore(response.pagination?.hasMore ?? hasFullLimit);
    } catch (err) {
      console.error('Failed to refresh products:', err);
      setError('Failed to refresh products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <RotateCcw className="w-8 h-8 text-gray-400 animate-spin mb-4" />
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        <AnimatePresence>
          {products.map((product, index) => (
            <motion.div
              key={product.id || product._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="animate-fadeIn"
            >
              <PharmacyProductCard {...product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 ${
              loadingMore
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg transform hover:scale-105'
            }`}
          >
            {loadingMore ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              'More Products'
            )}
          </button>
        </div>
      )}

      {/* End of Products Message */}
      {!hasMore && products.length > 0 && (
        <div className="mt-8 text-center py-8">
          <p className="text-gray-500 text-lg">You've reached the end of the product list!</p>
        </div>
      )}

      {/* Skeleton Loaders for loading more */}
      {loadingMore && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mt-6">
          {Array.from({ length: initialLimit }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoadMoreProducts;