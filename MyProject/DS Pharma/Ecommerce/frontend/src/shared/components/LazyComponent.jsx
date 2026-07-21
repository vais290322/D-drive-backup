import React, { useState, useEffect, useRef, Suspense } from 'react';

/**
 * LazyComponent Wrapper
 * Uses IntersectionObserver to defer rendering of its children until they
 * approach the viewport. Includes a skeleton/placeholder state.
 */
const LazyComponent = ({ 
  children, 
  fallback = <div className="h-64 animate-pulse bg-gray-100 rounded-2xl w-full" />,
  rootMargin = '200px', // Start loading 200px before it enters the viewport
  threshold = 0.01,
  className = ""
}) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
        // Once visible, we can stop observing
        if (targetRef.current) {
          observer.unobserve(targetRef.current);
        }
      }
    }, {
      rootMargin,
      threshold
    });

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [rootMargin, threshold]);

  return (
    <div ref={targetRef} className={className}>
      {isIntersecting ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

export default LazyComponent;
