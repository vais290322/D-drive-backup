import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {props.icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <props.icon className="h-4 w-4" />
        </div>
      )}
      <input
        style={{ paddingLeft:'15px'}}
        type={type}
        className={cn(
          "flex h-8 w-full rounded-lg border bg-white py-2 text-[12px] shadow-sm transition-all duration-200",
          "placeholder:text-gray-400 placeholder:text-[12px]",
          "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
          "hover:border-gray-300",
          error 
            ? "border-red-500 focus:ring-red-500/50 focus:border-red-500 focus:shadow-red-500/20" 
            : "border-gray-200",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";

export { Input };
export default Input;
