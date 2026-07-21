import React, { useMemo } from "react";
import { X } from "lucide-react";
import PharmacyProductCard from "@/user/components/product/components/PharmacyProductCard";
import SearchSkeleton from "./SearchSkeleton";

const SearchResults = ({ products, isLoading, query, onReset }) => {
  // Ensure products is always an array - defensive check with useMemo for stability
  const safeProducts = useMemo(() => {
    if (!products) return [];
    return Array.isArray(products) ? products : [];
  }, [products]);

  // Ensure onReset is always a function
  const handleReset = useMemo(() => {
    return typeof onReset === "function" ? onReset : () => {};
  }, [onReset]);

  // Ensure query is always a string
  const safeQuery = typeof query === "string" ? query : "";

  if (isLoading === true) {
    return <SearchSkeleton />;
  }

  if (!safeProducts || safeProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center px-4">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <X size={40} className="text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No results found
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          We couldn't find any products matching "{safeQuery}". Try checking for
          typos or using broader keywords.
        </p>
        <button
          onClick={handleReset}
          className="px-6 py-2.5 bg-emerald-500 text-white font-medium rounded-full hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30"
          style={{ padding: "5px 10px", marginTop: "12px" }}
        >
          View All Products
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media (max-width: 639px) {
          .search-results-grid {
            margin-top: 35px !important;
          }
        }
      `}</style>
      <div
        className="search-results-container space-y-3"
        style={{
          maxHeight: "700px",
          minHeight: "600px",
          overflowY: "auto",
          paddingRight: "5px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          .search-results-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="search-results-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {safeProducts &&
            safeProducts.length > 0 &&
            safeProducts.map((product) => {
              if (!product || !product.id) return null;

              // Ensure product has proper image fallback
              const displayImage =
                product.image ||
                product.imageUrl ||
                product.images?.[0] ||
                (Array.isArray(product.image) && product.image[0]) ||
                "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80";

              return (
                <PharmacyProductCard
                  key={product.id}
                  id={product.id}
                  rid={product.rid} // Pass rid for navigation
                  name={product.name || "Product"}
                  price={product.price || 0}
                  originalPrice={product.originalPrice || product.mrp}
                  mrp={product.mrp}
                  discount={product.discount}
                  quantity="1"
                  unit={product.unit || "strip"}
                  imageUrl={displayImage}
                  image={displayImage}
                  stock={product.stock}
                  inStock={product.inStock}
                  className="h-full hover:-translate-y-1 transition-transform"
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default SearchResults;