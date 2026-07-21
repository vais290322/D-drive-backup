// import summaryApi from "@/common/api";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { useParams } from "wouter";
// import { ProductCard } from "@/components/ProductCard";
// import { Button } from "@/components/ui/button";
// import { Star, Phone } from "lucide-react";
// import { SiWhatsapp } from "react-icons/si";
// import { navigate } from "wouter/use-browser-location";
// import { Header } from "@/components/Header";
// import { Footer } from "@/components/Footer";

// const ProductDetails = () => {
//   const params = useParams();
//   const productId = params.productID;

//   const [productDetails, setProductDetails] = useState<any>({});
//   const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
//   const [mainImageIndex, setMainImageIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   const categoryId = productDetails?.categoryId;

//   const fetchProductDetails = async (productId: string) => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(
//         `${summaryApi.addProduct!}/${productId}`
//       );
//       if (response.data?.success) {
//         setProductDetails(response.data.data || {});
//         setMainImageIndex(0);
//       } else {
//         setProductDetails(response.data?.data || {});
//       }
//     } catch (error: any) {
//       console.error("Error fetching product details:", error);
//       toast.error("Failed to load product");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (productId) fetchProductDetails(productId);
//   }, [productId]);

//   const fetchCategoryWiseProducts = async (categoryId: string) => {
//     try {
//       const response = await axios.get(
//         `${summaryApi.productsByCategory!}/${categoryId}`
//       );
//       if (response.data.success) {
//         setFeaturedProducts(response.data.data || []);
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to fetch products");
//     }
//   };

//   useEffect(() => {
//     if (categoryId) fetchCategoryWiseProducts(categoryId);
//   }, [categoryId]);

//   const handleOrderOnline = () => {
//     // implement add to cart or checkout navigation
//     navigate(`/checkout?product=${productDetails.id}`);
//   };

//   const handleOrderByCall = () => {
//     // replace with actual store phone if available
//     window.location.href = "tel:+1234567890";
//   };

//   const handleOrderOnWhatsApp = () => {
//     const message = encodeURIComponent(
//       `Hi, I'm interested in ${productDetails.name}`
//     );
//     window.open(`https://wa.me/1234567890?text=${message}`, "_blank");
//   };

//   const images: string[] = Array.isArray(productDetails?.images)
//     ? productDetails.images
//     : productDetails?.images
//     ? [productDetails.images]
//     : [];

//   return (
//     <>
//       <Header />
//       <div className="max-w-7xl mx-auto p-4 md:p-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Images column */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-md overflow-hidden shadow">
//               <div className="aspect-[4/5]  flex items-center justify-center">
//                 {images.length > 0 ? (
//                   <img
//                     src={images[mainImageIndex]}
//                     alt={productDetails.name}
//                     className="w-full h-full object-contain p-4"
//                   />
//                 ) : (
//                   <div className="p-8 text-muted-foreground">No image</div>
//                 )}
//               </div>
//               <div className="flex gap-2 p-3 overflow-x-auto ">
//                 {images.map((img, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setMainImageIndex(idx)}
//                     className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border ${
//                       idx === mainImageIndex
//                         ? "ring-2 ring-primary"
//                         : "border-gray-200"
//                     }`}
//                   >
//                     <img
//                       src={img}
//                       alt={`thumb-${idx}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Details column */}
//           <div className="lg:col-span-2 space-y-4">
//             <div className="bg-white rounded-md p-6 shadow">
//               <h1 className="text-2xl font-bold mb-2">{productDetails.name}</h1>

//               <div className="flex items-center gap-3 mb-4">
//                 <div className="flex items-center">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`h-4 w-4 ${
//                         i < Math.floor(productDetails.rating || 0)
//                           ? "fill-yellow-400 text-yellow-400"
//                           : "text-gray-300"
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-sm text-muted-foreground">
//                   ({productDetails.reviewCount || 0} reviews)
//                 </span>
//                 <span className="ml-4 text-sm text-muted-foreground">
//                   SKU: {productDetails.sku || "N/A"}
//                 </span>
//               </div>

//               <div className="flex items-baseline gap-4 mb-4">
//                 <span className="text-3xl font-bold">
//                   ₹
//                   {(
//                     productDetails.discountPrice ?? productDetails.price
//                   )?.toLocaleString()}
//                 </span>
//                 {productDetails.discountPrice &&
//                   productDetails.price &&
//                   productDetails.price > productDetails.discountPrice && (
//                     <span className="text-sm text-muted-foreground line-through">
//                       ₹{productDetails.price?.toLocaleString()}
//                     </span>
//                   )}
//               </div>

//               <p className="text-sm text-muted-foreground mb-4">
//                 {productDetails.description}
//               </p>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
//                 <div>
//                   <div className="text-xs text-muted-foreground">Stock</div>
//                   <div className="font-medium">
//                     {productDetails.stockQuantity ?? "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-muted-foreground">
//                     Opening Stock
//                   </div>
//                   <div className="font-medium">
//                     {productDetails.openingStock ?? "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-muted-foreground">Weight</div>
//                   <div className="font-medium">
//                     {productDetails.weight ?? "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-muted-foreground">
//                     Dimensions
//                   </div>
//                   <div className="font-medium">
//                     {productDetails.dimensions ?? "N/A"}
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
//                 <div>
//                   <div className="text-xs text-muted-foreground">Category</div>
//                   <div className="font-medium">
//                     {productDetails.categoryName || "N/A"}
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-muted-foreground">
//                     Subcategory
//                   </div>
//                   <div className="font-medium">
//                     {productDetails.subCategoryName || "N/A"}
//                   </div>
//                 </div>
//               </div>

//               {/* Action buttons */}
//               <div className="flex flex-col md:flex-row gap-3">
//                 <Button
//                   className="w-full md:w-auto"
//                   onClick={handleOrderOnline}
//                   disabled={!(productDetails.stockQuantity > 0)}
//                 >
//                   Order Online
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="w-full md:w-auto"
//                   onClick={handleOrderByCall}
//                 >
//                   <Phone className="mr-2 h-4 w-4" /> Order by Call
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="w-full md:w-auto bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border-[#25D366]/30"
//                   onClick={handleOrderOnWhatsApp}
//                 >
//                   <SiWhatsapp className="mr-2 h-4 w-4" /> Order on WhatsApp
//                 </Button>
//               </div>
//             </div>

//             {/* Additional details / specifications */}
//             <div className="bg-white rounded-md p-6 shadow">
//               <h3 className="text-lg font-semibold mb-3">Product Details</h3>
//               <div className="space-y-2 text-sm text-muted-foreground">
//                 <div>
//                   <strong>Brand:</strong> {productDetails.brand || "N/A"}
//                 </div>
//                 <div>
//                   <strong>Rating:</strong> {productDetails.rating ?? "N/A"}
//                 </div>
//                 <div>
//                   <strong>Reviews:</strong> {productDetails.reviewCount ?? 0}
//                 </div>
//                 <div>
//                   <strong>SKU:</strong> {productDetails.sku || "N/A"}
//                 </div>
//                 <div>
//                   <strong>Updated At:</strong>{" "}
//                   {productDetails.updatedAt
//                     ? new Date(productDetails.updatedAt).toLocaleString()
//                     : "N/A"}
//                 </div>
//                 <div>
//                   <strong>Created At:</strong>{" "}
//                   {productDetails.createdAt
//                     ? new Date(productDetails.createdAt).toLocaleString()
//                     : "N/A"}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recommended / Featured products */}
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold mb-4">Recommended for you</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
//             {featuredProducts?.map((product) => (
//               <ProductCard key={product.id} {...product} />
//             ))}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ProductDetails;

import summaryApi from "@/common/api";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useParams } from "wouter";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Star,
  Phone,
  Package,
  Ruler,
  Weight,
  Tag,
  Clock,
  Calendar,
  TrendingUp,
  Shield,
  Truck,
  ZoomIn,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { navigate } from "wouter/use-browser-location";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const ProductDetails = () => {
  const params = useParams();
  const productId = params.productID;

  const [productDetails, setProductDetails] = useState<any>({});
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const categoryId = productDetails?.categoryId;

  const fetchProductDetails = async (productId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${summaryApi.addProduct!}/${productId}`
      );
      if (response.data?.success) {
        setProductDetails(response.data.data || {});
        setMainImageIndex(0);
      } else {
        setProductDetails(response.data?.data || {});
      }
    } catch (error: any) {
      console.error("Error fetching product details:", error);
      toast.error("Failed to load product");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchProductDetails(productId);
  }, [productId]);

  const fetchCategoryWiseProducts = async (categoryId: string) => {
    try {
      const response = await axios.get(
        `${summaryApi.productsByCategory!}/${categoryId}`
      );
      if (response.data.success) {
        setFeaturedProducts(response.data.data || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    }
  };

  useEffect(() => {
    if (categoryId) fetchCategoryWiseProducts(categoryId);
  }, [categoryId]);

  const handleOrderOnline = () => {
    navigate(`/checkout?product=${productDetails.id}`);
  };

  const handleOrderByCall = () => {
    window.location.href = "tel:+1234567890";
  };

  const handleOrderOnWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in ${productDetails.name}`
    );
    window.open(`https://wa.me/1234567890?text=${message}`, "_blank");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  const images: string[] = Array.isArray(productDetails?.images)
    ? productDetails.images
    : productDetails?.images
    ? [productDetails.images]
    : [];

  const discountPercentage =
    productDetails.price &&
    productDetails.discountPrice &&
    productDetails.price > productDetails.discountPrice
      ? Math.round(
          ((productDetails.price - productDetails.discountPrice) /
            productDetails.price) *
            100
        )
      : 0;

  const isInStock = productDetails.stockQuantity > 0;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-10 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600 flex items-center gap-2">
            <span className="hover:text-gray-900 cursor-pointer">Home</span>
            <span>/</span>
            <span className="hover:text-gray-900 cursor-pointer">
              {productDetails.categoryName || "Products"}
            </span>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">
              {productDetails.name}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Images column */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative group">
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    -{discountPercentage}%
                  </div>
                )}
                {!isInStock && (
                  <div className="absolute top-4 right-4 z-10 bg-gray-800 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    Out of Stock
                  </div>
                )}
                {images.length > 0 && !imageLoading && (
                  <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-3 h-3" />
                    Hover to zoom
                  </div>
                )}

                <div
                  ref={imageRef}
                  className="aspect-square flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {images.length > 0 ? (
                    <>
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
                        </div>
                      )}
                      <img
                        src={images[mainImageIndex]}
                        alt={productDetails.name}
                        className={`w-full h-full object-contain p-8 transition-all duration-300 ${
                          imageLoading ? "opacity-0" : "opacity-100"
                        } ${isZooming ? "scale-150" : "scale-100"}`}
                        style={
                          isZooming
                            ? {
                                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                              }
                            : undefined
                        }
                        onLoad={() => setImageLoading(false)}
                        onError={() => setImageLoading(false)}
                      />
                    </>
                  ) : (
                    <div className="p-8 text-gray-400 flex flex-col items-center">
                      <Package className="w-16 h-16 mb-2" />
                      <span>No image available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100  p-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setMainImageIndex(idx);
                        setImageLoading(true);
                      }}
                      className={`w-20 h-20  flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        idx === mainImageIndex
                          ? "ring-2 ring-offset-2 ring-green-500 border-green-500 scale-105 "
                          : "border-gray-200 hover:border-gray-300 hover:scale-105"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`thumb-${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-4 shadow-sm text-center hover:shadow-md transition-shadow">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-xs font-medium text-gray-700">
                    Secure Payment
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm text-center hover:shadow-md transition-shadow">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-xs font-medium text-gray-700">
                    Fast Delivery
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm text-center hover:shadow-md transition-shadow">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-xs font-medium text-gray-700">
                    Best Quality
                  </p>
                </div>
              </div>
            </div>

            {/* Details column */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                {/* Title and rating */}
                <div className="mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                    {productDetails.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(productDetails.rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {productDetails.rating || "0"} (
                        {productDetails.reviewCount || 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Tag className="w-4 h-4" />
                      <span>SKU: {productDetails.sku || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Price section */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-100">
                  <div className="flex items-baseline gap-4 flex-wrap">
                    <span className="text-4xl md:text-5xl font-bold text-gray-900">
                      ₹
                      {(
                        productDetails.discountPrice ?? productDetails.price
                      )?.toLocaleString()}
                    </span>
                    {discountPercentage > 0 && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          ₹{productDetails.price?.toLocaleString()}
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          Save {discountPercentage}%
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Inclusive of all taxes
                  </p>
                </div>

                {/* Description */}
                {productDetails.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {productDetails.description}
                    </p>
                  </div>
                )}

                {/* Product specs grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Package className="w-4 h-4" />
                      <span className="text-xs font-medium">Stock</span>
                    </div>
                    <div
                      className={`font-bold text-lg ${
                        isInStock ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {productDetails.stockQuantity ?? "N/A"}
                    </div>
                  </div>
                  {/* <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-medium">Opening Stock</span>
                    </div>
                    <div className="font-bold text-lg text-gray-900">
                      {productDetails.openingStock ?? "N/A"}
                    </div>
                  </div> */}
                  <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Weight className="w-4 h-4" />
                      <span className="text-xs font-medium">Weight</span>
                    </div>
                    <div className="font-bold text-lg text-gray-900">
                      {productDetails.weight ?? "N/A"}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Ruler className="w-4 h-4" />
                      <span className="text-xs font-medium">Dimensions</span>
                    </div>
                    <div className="font-bold text-lg text-gray-900">
                      {productDetails.dimensions ?? "N/A"}
                    </div>
                  </div>
                </div>

                {/* Category info */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {productDetails.categoryName && (
                    <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                      {productDetails.categoryName}
                    </span>
                  )}
                  {productDetails.subCategoryName && (
                    <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                      {productDetails.subCategoryName}
                    </span>
                  )}
                  {productDetails.brand && (
                    <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                      {productDetails.brand}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="space-y-3 ">
                  <div className="grid grid-cols-1 mb-3 sm:grid-cols-2 gap-3">
                    <Button
                      className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                      onClick={handleOrderOnline}
                      disabled={!isInStock}
                    >
                      {isInStock ? "Order Online" : "Out of Stock"}
                    </Button>

                    <button className="w-full bg-blue-500 text-white h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] ">
                      Add to Cart
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl border-2 hover:bg-gray-50 font-medium"
                      onClick={handleOrderByCall}
                    >
                      <Phone className="mr-2 h-4 w-4" /> Call Us
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl border-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border-[#25D366]/30 font-medium"
                      onClick={handleOrderOnWhatsApp}
                    >
                      <SiWhatsapp className="mr-2 h-4 w-4" /> WhatsApp
                    </Button>
                  </div>
                </div>
              </div>

              {/* Additional details */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Product Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Brand</span>
                    <span className="text-gray-900 font-semibold">
                      {productDetails.brand || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Rating</span>
                    <span className="text-gray-900 font-semibold">
                      {productDetails.rating ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">SKU</span>
                    <span className="text-gray-900 font-semibold">
                      {productDetails.sku || "N/A"}
                    </span>
                  </div>
                  {/* {productDetails.updatedAt && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Last Updated
                      </span>
                      <span className="text-gray-900 font-semibold text-sm">
                        {new Date(productDetails.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {productDetails.createdAt && (
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600 font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Created
                      </span>
                      <span className="text-gray-900 font-semibold text-sm">
                        {new Date(productDetails.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended products */}
          {featuredProducts.length > 0 && (
            <div className="mt-16">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Recommended for You
                </h2>
                <p className="text-gray-600">
                  Handpicked products you might love
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {featuredProducts?.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
