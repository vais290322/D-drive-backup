import React from 'react';
import { cn } from '../../utils/cn';

const Card = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-md shadow-gray-100/50 hover:shadow-lg hover:shadow-emerald-100/30",
    gradient: "bg-gradient-to-br from-white via-emerald-50/10 to-transparent border border-emerald-100 shadow-lg shadow-emerald-100/50 hover:shadow-xl hover:shadow-emerald-200/50",
    glass: "backdrop-blur-xl bg-white/80 border border-white/20 shadow-xl shadow-emerald-500/10",
    elevated: "bg-white shadow-xl shadow-gray-200/60 border-none hover:shadow-2xl hover:shadow-emerald-200/40",
  };

  return (
    <div
      style={{ padding: '10px' }}
      ref={ref}
      className={cn(
        "rounded-xl text-gray-950 transition-all duration-300 hover:scale-[1.01]",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    style={{ marginBottom: '10px' }}
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 font-medium", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
