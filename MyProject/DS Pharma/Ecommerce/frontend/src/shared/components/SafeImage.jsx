import React, { useState, useEffect, useRef } from 'react';
import productPlaceholder from '@/assets/images/product-placeholder.png';

const SafeImage = ({ 
  src, 
  alt, 
  className, 
  placeholder = productPlaceholder,
  style = {},
  loading = "lazy",
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const prevSrcRef = useRef(src);

  useEffect(() => {
    if (prevSrcRef.current !== src) {
      setImgSrc(src);
      setHasError(false);
      setIsLoaded(false);
      prevSrcRef.current = src;
    }
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      if (import.meta.env.DEV) {
        console.warn(`Image failed to load: ${src}. Using fallback.`);
      }
      setImgSrc(placeholder);
      setHasError(true);
      setIsLoaded(true);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const effectiveSrc = imgSrc || placeholder;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      
      <img
        src={effectiveSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onError={handleError}
        onLoad={handleLoad}
        loading={loading}
        style={{
          ...style,
          backgroundColor: hasError ? '#f9fafb' : style.backgroundColor
        }}
        {...props}
      />
    </div>
  );
};

export default SafeImage;
