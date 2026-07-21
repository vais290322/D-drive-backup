import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import SafeImage from '@/shared/components/SafeImage';

const ProductImageGallery = ({ images, selectedImage, onImageSelect, onScroll }) => {
  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnail Navigation */}
      <div className="flex flex-row items-center gap-2 overflow-x-auto md:flex-col md:overflow-visible">
        <button
          onClick={() => onScroll('up')}
          disabled={selectedImage === 0}
          className="hidden p-5 border border-[#64E5B8] transition-colors rounded-sm cursor-pointer md:block hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Scroll up"
        >
          <ChevronUp size={25} />
        </button>

        <div className="flex flex-row gap-3 overflow-x-auto md:flex-col md:overflow-hidden" style={{ maxHeight: '350px' }}>
          {images.map((image, index) => (
            <Motion.button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${selectedImage === index
                ? 'border-orange-500 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeImage
                src={image.url}
                alt={`Product view ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </Motion.button>
          ))}
        </div>

        <button
          onClick={() => onScroll('down')}
          disabled={selectedImage === images.length - 1}
          className="hidden p-5 border border-[#64E5B8] transition-colors rounded-sm cursor-pointer md:block hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Scroll down"
        >
          <ChevronDown size={25} />
        </button>
      </div>

      {/* Main Image */}
      <div className="relative flex-1 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm group">
        <SafeImage
          key={selectedImage}
          src={images && images.length > 0 ? images[selectedImage].url : null}
          alt="Product"
          className="object-cover w-full h-full"
          style={{ minHeight: '300px', maxHeight: '420px' }}
        />

        {/* Mobile Navigation Buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onImageSelect(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md md:hidden hover:bg-white text-gray-800"
          aria-label="Previous image"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onImageSelect(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md md:hidden hover:bg-white text-gray-800"
          aria-label="Next image"
        >
          <ChevronRight size={20} />
        </button>

        {/* Mobile Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onImageSelect(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${selectedImage === index ? 'bg-teal-500 w-6' : 'bg-gray-300/80 w-2 hover:bg-gray-400'
                }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;