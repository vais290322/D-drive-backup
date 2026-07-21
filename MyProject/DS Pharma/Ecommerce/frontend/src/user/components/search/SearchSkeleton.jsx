import React from 'react';

const SearchSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div 
          key={i} 
          className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3 animate-pulse"
        >
          {/* Image */}
          <div className="aspect-[4/3] bg-gray-100 rounded-2xl w-full" />
          
          {/* Content */}
          <div className="space-y-2 mt-2">
             <div className="h-4 bg-gray-100 rounded-full w-3/4" />
             <div className="h-3 bg-gray-50 rounded-full w-1/2" />
          </div>

          {/* Price & Button */}
          <div className="flex items-center justify-between mt-auto pt-2">
             <div className="h-5 bg-gray-100 rounded-lg w-20" />
             <div className="h-8 w-8 bg-gray-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchSkeleton;