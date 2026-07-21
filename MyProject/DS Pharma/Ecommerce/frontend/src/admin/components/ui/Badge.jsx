import React from 'react';
import { cn } from '../../utils/cn';

const Badge = React.forwardRef(({ className, variant = 'default', glow = false, ...props }, ref) => {
  const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[8px] sm:text-xs font-semibold transition-all duration-200";
  
  const variants = {
    default: "border-transparent bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300",
    secondary: "border-transparent bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600",
    destructive: "border-transparent bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md shadow-red-500/30",
    outline: "text-gray-950 border-gray-300 hover:bg-gray-50",
    success: "border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30",
    warning: "border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30",
    info: "border-transparent bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/30",
    premium: "border-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-white shadow-lg shadow-emerald-500/40 animate-pulse",
  };

  const glowEffect = glow ? "shadow-lg shadow-current/50" : "";

  return (
    <div
      style={{ padding: '3px 6px' }}
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        glowEffect,
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge };
export default Badge;
