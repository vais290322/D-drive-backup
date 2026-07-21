import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Package, PackageX, Loader2, Plus } from 'lucide-react';
import { PharmacyProductCard } from '@/user/components/product';
import productService from '@/services/productService';
import BackButton from '@/shared/components/BackButton';
import { ProductGridSkeleton } from '@/shared/components/skeletons/ProductSkeleton';
import axios from 'axios';

const apiurl = import.meta.env.VITE_MEDIA_CLOUD_BASE_URL;

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // PAGE_LIMIT constant
  const PAGE_LIMIT = 25;
  // State
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('Category Products');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  const fetchProducts = async (pageNum, isInitial = false) => {
    if (isInitial) {
      setLoading(true);
      setError(false);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await axios.get(`${apiurl}/api/v1/products/category/${categoryId}?page=${pageNum}&limit=${PAGE_LIMIT}`);
      if (response && response.data) {
        const productData = response.data.data;
        const fetchedProducts = productData.products || [];

        if (isInitial) {
          setProducts(fetchedProducts);
          // Try to get category name if possible
          if (fetchedProducts.length > 0 && fetchedProducts[0].category) {
            setCategoryName(typeof fetchedProducts[0].category === 'string' ? fetchedProducts[0].category : (fetchedProducts[0].category.name || 'Category Products'));
          }
        } else {
          setProducts(prev => {
            // Filter out any duplicates just in case
            const existingIds = new Set(prev.map(p => p._id));
            const uniqueNew = fetchedProducts.filter(p => !existingIds.has(p._id));
            return [...prev, ...uniqueNew];
          });
        }

        setTotalItems(productData.totalItems || 0);
        setHasMore(productData.hasMore || false);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      if (isInitial) setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProducts(1, true);
  }, [categoryId]);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, false);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.rid || product._id}`);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ paddingTop: '30px' }}>
      <style>{` 
         @media (min-width: 768px) { 
           .category-container { 
             padding-top: 80px !important; 
           } 
         }
         @media (max-width: 639px) {
           .category-products-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
         @media (min-width: 640px) and (max-width: 1290px) {
           .category-products-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
       `}</style>
      <div className="category-container flex flex-col min-h-screen bg-gray-50">
        <main className="grow">
          <div className="category-products-container flex flex-col items-center w-full px-4 md:px-6 lg:px-12">
            <div className="mx-auto max-w-7xl w-full pb-20">
              {/* Top Header */}
              <div className="mb-6" style={{ marginBottom: '1.5rem' }}>
                <BackButton fallbackRoute="/" label="Back to Home" className="inline-flex" />
              </div>

              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1
                      style={{
                        fontFamily: 'Gyrotrope',
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#111827',
                        lineHeight: '1.2'
                      }}
                    >
                      {categoryName}
                    </h1>
                    <p
                      style={{
                        fontFamily: 'Gyrotrope',
                        fontSize: '14px',
                        color: '#6B7280',
                        marginTop: '0.5rem'
                      }}
                    >
                      {totalItems} total products available
                    </p>
                  </div>
                </div>
              </div>

              {/* Content States */}
              {loading ? (
                <ProductGridSkeleton count={12} />
              ) : error ? (
                <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl shadow-sm border border-gray-100 px-4">
                  <PackageX className="w-16 h-16 text-red-100 mb-4" />
                  <h2
                    style={{
                      fontFamily: 'Gyrotrope',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Failed to load {categoryName} category
                  </h2>
                  <p className="text-gray-500 max-w-sm mb-8">We couldn't retrieve the products. Please try refreshing or check your connection.</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100"
                    style={{ fontFamily: 'Gyrotrope' }}
                  >
                    Try Again
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl shadow-sm border border-gray-100 px-4">
                  <Package className="w-16 h-16 text-gray-200 mb-4" />
                  <h2
                    style={{
                      fontFamily: 'Gyrotrope',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}
                  >
                    No products found in {categoryName}
                  </h2>
                  <p className="text-gray-500 max-w-sm">There are no items currently available in this {categoryName} category.</p>
                </div>
              ) : (
                <>
                  <Motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {products.map((product, index) => (
                      <Motion.div
                        key={`${product.id || product._id}-${index}`}
                        variants={itemVariants}
                      >
                        <PharmacyProductCard
                          id={product._id}
                          rid={product.rid}
                          name={product.name}
                          price={product.MRP}
                          imageUrl={product.images?.[0]?.url}
                          image={product.images}
                          description={product.description}
                          stock={product.stock}
                          inStock={product.stock > 0}
                          quantity={product.quantity}
                          onCardClick={() => handleProductClick(product)}
                        />
                      </Motion.div>
                    ))}
                  </Motion.div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="mt-16 flex justify-center">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        style={{ fontFamily: 'Gyrotrope' }}
                      >
                        {loadingMore ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5" />
                            <span>Load More Products</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* End of list message */}
                  {!hasMore && products.length > 0 && (
                    <div className="mt-16 text-center" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                      <div className="inline-flex items-center gap-3 px-6 py-2 bg-gray-100 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        <span
                          style={{
                            fontFamily: 'Gyrotrope',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#6B7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginTop: '3px'
                          }}
                        >
                          End of {categoryName} category collection
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryProducts;

