import React from 'react';
import { cn } from '../../utils/cn';

const Avatar = React.forwardRef(({ className, src, alt, fallback, ...props }, ref) => {
  const [hasError, setHasError] = React.useState(false);

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium">
            {fallback || alt?.slice(0, 2).toUpperCase() || 'CN'}
        </div>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export { Avatar };
