import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PharmacyProductCard,
  ProductImageGallery,
  ProductPriceSection,
  ProductActionButtons,
  ProductDescription,
  ProductReviews
} from '@/user/components/product';
import SuggestedItemsSection from '@/user/components/sections/SuggestedItemsSection';
import { useProductDetails } from '@/shared/hooks/queries/useProductDetails';
import { useProducts } from '@/shared/hooks/queries/useProducts';
import { useReviews } from '@/shared/hooks/queries/useReviews';
import { useAddToCart } from '@/shared/hooks/queries/useCartQuery';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import useDataStore from '@/store/useDataStore';
import BackButton from '@/shared/components/BackButton';
import toastUtil from '@/shared/utils/toast';
const productfetchapi = import.meta.env.VITE_MEDIA_CLOUD_BASE_URL;
const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isProductLoading, setIsProductLoading] = useState(true);

  const [productDetails, setProductDetails] = useState(null);

  console.log("product id : ", productDetails);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsProductLoading(true);
        const response = await fetch(`${productfetchapi}/api/v1/products/details/${id}`);
        const data = await response.json();
        setProductDetails(data.data);

      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setIsProductLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  // Queries
  // const { data: productData, isLoading: isProductLoading } = useProductDetails(id);
  // const { data: reviewsData, isLoading: isReviewsLoading } = useReviews(id);
  const { isAuthenticated } = useAuthStore();
  const addItemToLocalCart = useCartStore((state) => state.addItem);
  const { mutate: addToCartMutation, isPending: isAddingToCart } = useAddToCart();

  // const reviews = reviewsData?.data || [];

  // Get product (service already normalizes and returns the object)
  const fetchedProduct = productDetails;

  // Fetch suggested items based on category of current product
  // Category identification must be done ONLY using _id
  // const categoryId = fetchedProduct?.categoryId || fetchedProduct?.category?._id || fetchedProduct?.category;

  // const { data: suggestedData } = useProducts({ 
  //     categoryId: categoryId, 
  //     limit: 5,
  //     page: 1 // Always first page for related products
  // });

  // const suggestedItems = suggestedData?.data || [];

  // Wishlist functionality
  const wishlist = useDataStore((state) => state.wishlist);
  const addToWishlist = useDataStore((state) => state.addToWishlist);
  const removeFromWishlist = useDataStore((state) => state.removeFromWishlist);

  const isInWishlist = wishlist.some((item) => item.id === id);

  // If loading, show skeleton (implemented simply for now)
  if (isProductLoading) return (
    <div className="flex justify-center items-center min-h-screen pt-20">
      <div className="animate-spin h-12 w-12 border-4 border-emerald-500 rounded-full border-t-transparent"></div>
    </div>
  );

  // Use real data or fallback object structure 
  const product = fetchedProduct ? {
    ...fetchedProduct,
    images: fetchedProduct.images && fetchedProduct.images.length > 0
      ? fetchedProduct.images
      : (fetchedProduct.image ? [fetchedProduct.image] : []),
    stock: Number(fetchedProduct.stock ?? 50),
    originalPrice: fetchedProduct.originalPrice || fetchedProduct.mrp || fetchedProduct.price,
    discount: fetchedProduct.discount || (fetchedProduct.mrp > fetchedProduct.price ? Math.round(((fetchedProduct.mrp - fetchedProduct.price) / fetchedProduct.mrp) * 100) : 0),
    specialOffer: fetchedProduct.specialOffer || {
      title: 'Bank Offer: 10% instant discount',
      code: 'SBI10'
    }
  } : null;

  if (!product) return (
    <div className="flex justify-center items-center min-h-screen pt-20">
      <h2 className="text-xl font-semibold text-gray-700 font-gyrotrope">Product not found</h2>
    </div>
  );

  const scrollThumbnails = (direction) => {
    if (direction === 'up' && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    } else if (direction === 'down' && selectedImage < product.images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const handleAddToCart = () => {
    if (!productDetails) return;

    // User requested strict usage of 'rid' from product data
    const productRid = productDetails.rid;

    if (isAuthenticated) {
      if (!productRid) {
        toastUtil.error("Product RID missing. Cannot add to cart.");
        return;
      }
      // Authenticated flow
      addToCartMutation({
        rid: productRid,
        image: productDetails?.images?.[0]?.url || productDetails?.image,
        quantity: 1,
      });
    } else {
      // Guest flow
      addItemToLocalCart({
        ...productDetails,
        // Ensure properties needed for local cart calculation are correct
        id: productDetails.id || productDetails._id,
        rid: productDetails.rid,
        image: productDetails.images?.[0]?.url || productDetails?.image
      }, 1);

      toastUtil.info("Login to sync your cart!");
      navigate(`/login?redirect=${window.location.pathname}`);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        discount: product.discount || 0,
        image: product.images[0],
      });
    }
  };

  return (
    <div style={{ paddingTop: '30px' }}>
      <style>{` 
         @media (min-width: 768px) { 
           .orders-container { 
             padding-top: 80px !important; 
           } 
         }
         @media (max-width: 639px) {
           .product-details-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
         @media (min-width: 640px) and (max-width: 1290px) {
           .product-details-container {
             padding-left: 5px !important;
             padding-right: 5px !important;
           }
         }
       `}</style>
      <div className="orders-container flex flex-col min-h-screen bg-gray-50 ">
        <main className="grow">
          <div className="product-details-container flex flex-col items-center w-full px-4 md:px-6 lg:px-12">
            <div className="mx-auto max-w-7xl w-full">
              <div className="mb-6" style={{ marginBottom: '1.5rem' }}>
                <BackButton fallbackRoute="/" label="Back to Products" className="inline-flex" />
              </div>

              {/* Product Section */}
              <div className="grid grid-cols-1 gap-6 sm:gap-8 mb-8 sm:mb-12" style={{ gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', marginBottom: '1.5rem' }}
                data-lg-grid="true">
                <style>{`
                @media (min-width: 1024px) {
                  [data-lg-grid="true"] {
                    grid-template-columns: 2fr 3fr !important;
                  }
                }
              `}</style>
                <ProductImageGallery
                  images={productDetails?.images}
                  selectedImage={selectedImage}
                  onImageSelect={setSelectedImage}
                  onScroll={scrollThumbnails}
                />

                {/* Right - Product Info */}
                <div className="flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h1
                      style={{
                        fontFamily: 'Gyrotrope',
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#000000',
                        lineHeight: '1.4',
                        flex: 1
                      }}
                    >
                      {productDetails?.name}
                    </h1>

                    {/* Wishlist Button */}
                    {/* <button
                      onClick={handleWishlistToggle}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart
                        size={24}
                        className={isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                      />
                    </button> */}
                  </div>

                  <ProductPriceSection
                    price={productDetails?.MRP}
                    originalPrice={productDetails?.MRP}
                    discount={productDetails?.discount}
                    stock={productDetails?.stock}
                    specialOffer={product?.specialOffer}
                  />

                  <ProductActionButtons
                    onAddToCart={handleAddToCart}
                    onViewCart={() => navigate('/cart')}
                    isAdding={isAddingToCart}
                    isOutOfStock={productDetails?.stock === 0}
                  />
                </div>
              </div>

              {/* Description Section */}
              <ProductDescription product={product} />

              {/* Reviews Section */}
              {/* <ProductReviews reviews={reviews} isLoading={isReviewsLoading} /> */}

              {/* Suggested Medicine Section */}
              {/* <SuggestedItemsSection
                title="Suggested Medicine"
                items={suggestedItems}
                className="mb-5"
                titleStyle={{
                  textDecorationThickness: '2px',
                  textDecorationColor: '#111827',
                  lineHeight: '1.2'
                }}
                containerStyle={{}}
              /> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductDetails;
