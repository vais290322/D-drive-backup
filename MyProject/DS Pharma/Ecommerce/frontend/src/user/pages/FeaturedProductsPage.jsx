import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Package, PackageX } from 'lucide-react';
import { PharmacyProductCard } from '@/user/components/product';
import productService from '@/services/productService';
import BackButton from '@/shared/components/BackButton';
import { ProductGridSkeleton } from '@/shared/components/skeletons/ProductSkeleton';

const FeaturedProductsPage = () => {
  const navigate = useNavigate();

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchFeatured = async () => {
      setLoading(true);
      setError(false);
      
      try {
        const data = await productService.getFeaturedProducts();
        
        if (isMounted) {
          // data is already normalized by the service layer
          setProducts(data || []);
        }
      } catch (err) {
        console.error("Featured products fetch failed:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeatured();
    
    return () => { 
      isMounted = false;
    };
  }, []);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id || product._id}`);
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
           .featured-container { 
             padding-top: 80px !important; 
           } 
         }
         @media (max-width: 639px) {
           .featured-products-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
         @media (min-width: 640px) and (max-width: 1290px) {
           .featured-products-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
       `}</style>
      <div className="featured-container flex flex-col min-h-screen bg-gray-50">
        <main className="grow">
          <div className="featured-products-container flex flex-col items-center w-full px-4 md:px-6 lg:px-12">
            <div className="mx-auto max-w-7xl w-full">
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
                      Featured Products
                    </h1>
                    <p
                      style={{
                        fontFamily: 'Gyrotrope',
                        fontSize: '14px',
                        color: '#6B7280',
                        marginTop: '0.5rem'
                      }}
                    >
                      {products.length} exclusive items selected for you
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
                    Something went wrong
                  </h2>
                  <p className="text-gray-500 max-w-sm mb-8">We couldn't load the featured products. Please try again later.</p>
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
                    No featured products
                  </h2>
                  <p className="text-gray-500 max-w-sm">We haven't highlighted any products yet. Please check back soon!</p>
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
                        key={`${product.id}-${index}`}
                        variants={itemVariants}
                      >
                        <PharmacyProductCard 
                           {...product} 
                           onCardClick={() => handleProductClick(product)}
                        />
                      </Motion.div>
                    ))}
                  </Motion.div>

                  {/* End of list message */}
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
                         End of featured collection
                       </span>
                       <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeaturedProductsPage;

