import { forwardRef } from "react";

export const InputField = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        className={`mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none border-[var(--primary-color)] ${props.className}`}
        ref={ref}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
})

// export const InputField = forwardRef(function(
//   { label, error, ...props },
//   ref
// ) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700">
//         {label}
//       </label>
//       <input
//         className={`mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none border-[var(--primary-color)] ${props.className}`}
//         ref={ref}
//         {...props}
//       />
//       {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
//     </div>
//   );
// });

