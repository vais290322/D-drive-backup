import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 animate-pulse w-full">
      {/* Image Skeleton */}
      <div className="aspect-4/3 bg-gray-200 rounded-md mb-3"></div>
      
      {/* Content Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export const CategorySkeleton = () => {
  return (
    <div className="flex flex-col items-center animate-pulse">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-16"></div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {[...Array(count)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};

export default ProductSkeleton;
