import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  isLoading = false,
  children,
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95";
  
  const variants = {
    default: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:from-emerald-700 hover:to-teal-700",
    destructive: "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:from-red-700 hover:to-rose-700",
    outline: "border-2 border-emerald-600 text-emerald-700 bg-white hover:bg-emerald-50 hover:border-emerald-700 hover:shadow-md hover:shadow-emerald-100/50",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 shadow-sm hover:from-gray-200 hover:to-gray-300 hover:shadow-md",
    ghost: "text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800",
    link: "text-emerald-600 underline-offset-4 hover:underline hover:text-emerald-700",
    premium: "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/60 hover:scale-[1.02] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
  };

  const sizes = {
    default: "h-10 px-5 py-2 text-sm",
    sm: "h-8 px-3 py-1.5 text-[8px] sm:text-xs rounded-md",
    lg: "h-12 px-8 py-3 text-base rounded-xl",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
export default Button;
