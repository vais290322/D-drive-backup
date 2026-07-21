import React, { lazy, Suspense, useMemo, useState, useEffect } from 'react';
import ResponsiveHeroSection from '@/user/components/sections/HeroSection';
import LazyComponent from '@/shared/components/LazyComponent';
import PharmacyProductCard from '@/user/components/product/components/PharmacyProductCard';
import PageLoader from '@/shared/components/loaders/PageLoader';
import { AlertCircle, PackageX, Loader2 } from 'lucide-react';
import axios from 'axios';

// Lazy load non-critical sections
const WhyChooseUsSection = lazy(() => import('@/user/components/sections/WhyChooseUsSection'));
const productfetchapi = import.meta.env.VITE_MEDIA_CLOUD_BASE_URL;

const Home = () => {
  const limit = 25;

  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (page = 1) => {
    if (page === 1) setIsLoading(true);
    else setIsFetchingMore(true);

    try {
      const response = await axios.get(`${productfetchapi}/api/v1/products?page=${page}&limit=${limit}&stock=1`);

      // Robust data extraction
      const dashData = response.data.data;
      const resultData = Array.isArray(dashData?.products) ? dashData.products : [];
      const totalProductsCount = parseInt(dashData?.totalProducts || 0);

      if (page === 1) {
        setAllProducts(resultData);
      } else {
        setAllProducts(prev => [...prev, ...resultData]);
      }

      // Explicitly calculate total pages based on totalProducts from backend
      const totalPages = Math.ceil(totalProductsCount / limit);

      // We have more if our current page is less than total pages 
      // AND we actually got at least some results (defense against empty pages)
      setHasMore(page < totalPages && resultData.length > 0);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchProducts(nextPage);
  };

  // Simplify: Show all products from the API. 
  // Filtering should ideally be done on the backend for proper pagination counts.
  const products = useMemo(() => {
    return allProducts.filter(p => p && p.name);
  }, [allProducts]);
// fixed the logic

  // Handle errors
  if (error && allProducts.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => fetchProducts(1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // Initial loading state
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      {/* Hero Section */}
      <section className="py-2 my-2 sm:py-12 sm:my-8">
        <ResponsiveHeroSection />
      </section>


      {/* All Products Section */}
      <section className="w-full py-8 min-h-screen flex justify-center" style={{ width: '100%', padding: '2rem 0' }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
            <div className="flex flex-col items-end">
              <span className="text-gray-500 text-sm font-medium">
                Showing {products.length} Products
              </span>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <PackageX className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
              {products.map((product) => (
                <PharmacyProductCard
                  key={product._id}
                  id={product._id}
                  rid={product.rid}
                  name={product.name}
                  price={product.Rate} // From screenshot: Rate is the active price
                  originalPrice={product.MRP} // From screenshot: MRP is the initial price
                  mrp={product.MRP}
                  discount={0} // Can be calculated if needed: ((MRP - Rate) / MRP) * 100
                  image={product.images && product.images.length > 0 ? product.images[0].url : null}
                  imageUrl={product.images && product.images.length > 0 ? product.images[0].url : null}
                  unit={product.name?.split(' ')?.pop() || ""} // Attempt to extract unit from name
                  stock={product.stock}
                  inStock={parseFloat(product.stock) > 0}
                  className="w-full"
                />
              ))}

              {/* Skeletons for next page loading */}
              {isFetchingMore && (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="w-full h-[320px] bg-gray-100 rounded-lg animate-pulse" />
                ))
              )}
            </div>
          )}

          {/* Load More Button or End Message */}
          <div className="mt-12 flex justify-center pb-8" style={{ marginTop: '2rem' }}>
            {hasMore ? (
              <button
                onClick={handleLoadMore}
                disabled={isFetchingMore}
                className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {isFetchingMore ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <span style={{ padding: '2px 10px' }}>Load More</span>
                    <span className="absolute -right-2 top-0 h-3 w-3 rounded-full bg-red-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:right-[-4px]"></span>
                  </>
                )}
              </button>
            ) : (
              products.length > 0 && (
                <div className="text-center text-gray-500 py-4 font-medium bg-gray-50/50 px-6 rounded-full">
                  🎉 You’ve reached the end of the list
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <LazyComponent>
        <section className="py-2 my-2 sm:py-12 sm:my-8 bg-gray-50">
          <WhyChooseUsSection />
        </section>
      </LazyComponent>
    </Suspense>
  );
};

export default Home;
