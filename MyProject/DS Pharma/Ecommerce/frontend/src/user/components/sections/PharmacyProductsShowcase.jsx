import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCategorySection from './ProductCategorySection';
import productService from '@/services/productService';
import { ProductGridSkeleton } from '@/shared/components/skeletons/ProductSkeleton';

// Category identification must be done ONLY using _id
const getCategoryId = (cat) => {
  return cat?._id || cat?.id || cat;
};

// Inner component to fetch data for a single category
const CategorySectionItem = ({ category }) => {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  
  // Determine display name and id
  const categoryName = typeof category === 'string' ? category : category.name;
  const categoryId = getCategoryId(category);

  React.useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      if (!categoryId) {
        if (isMounted) {
          setLoading(false);
          setHasError(true);
        }
        return;
      }
      
      setLoading(true);
      setHasError(false);
      
      try {
        // Fetch with proper cancellation support
        const response = await productService.getCategoryProducts(
          categoryId, 
          { page: 1, limit: 5 }
        );
        
        if (isMounted) {
          const fetchedProducts = response?.data || response || [];
          const validProducts = Array.isArray(fetchedProducts) ? fetchedProducts : [];
          
          // Ensure products have proper image fallbacks
          const productsWithImages = validProducts.map(product => {
            if (!product.image || !product.images || product.images.length === 0) {
              return productService.normalizeProduct(product);
            }
            return product;
          });
          
          setProducts(productsWithImages);
          setHasError(false);
        }
      } catch (err) {
        // Silently handle all errors - don't show to user
        if (isMounted) {
          setProducts([]);
          setHasError(true);
          
          // Only log in development mode
          if (import.meta.env.DEV) {
            // Skip logging for cancellation errors
            if (err?.name !== 'CanceledError' && err?.code !== 'ERR_CANCELED') {
              console.warn(`[CategorySection] Failed to fetch products for "${categoryName}":`, err.message);
            }
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    
    return () => { 
      isMounted = false;
    };
  }, [categoryId, categoryName]);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id || product._id}`);
  };

  const handleViewAll = () => {
    // MANDATORY: Category identification via _id only
    navigate(`/category/${categoryId}`);
  };

  // Show skeleton during loading
  if (loading) return <div className="mb-12"><ProductGridSkeleton count={5} /></div>;
  
  // Silently hide categories with errors or no products - no alerts to user
  if (hasError || !products || products.length === 0) return null;

  return (
    <div className="mb-12 lg:mb-16 last:mb-0">
      <ProductCategorySection
        title={categoryName}
        products={products}
        onProductClick={handleProductClick}
        onViewAll={handleViewAll}
        className="py-0 bg-transparent mb-0"
      />
    </div>
  );
};

const PharmacyProductsShowcase = ({ categories = [] }) => {
  // Use React.useMemo to ensure stable category list
  const categoryList = React.useMemo(() => {
    if (!categories) return [];
    return Array.isArray(categories) ? categories : [];
  }, [categories]);

  if (categoryList.length === 0) return null;

  return (
    <>
      <style>{`
        @media (max-width: 639px) {
          .pharmacy-products-showcase {
            padding-left: 5px !important;
            padding-right: 5px !important;
          }
        }
        @media (min-width: 640px) and (max-width: 1290px) {
          .pharmacy-products-showcase {
            padding-left: 5px !important;
            padding-right: 5px !important;
          }
        }
      `}</style>
      <section className="pharmacy-products-showcase w-full bg-gray-50 py-16 lg:py-20 mb-25 flex justify-center items-center" style={{ width: '100%' }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {categories.map((category) => (
             /* Check if category is object or string, handle both */
            <CategorySectionItem 
              key={typeof category === 'string' ? category : (category._id || category.id)} 
              category={category} 
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default PharmacyProductsShowcase;
