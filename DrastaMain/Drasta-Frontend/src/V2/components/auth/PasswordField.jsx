import { Eye, EyeOff } from 'lucide-react';
import React, { forwardRef, useState } from 'react'

export const PasswordField = forwardRef(({label = "Password",error, ...props }, ref) => {

    const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="w-full flex items-center mt-1 border rounded-lg pr-2 border-[var(--primary-color)]">
          <input
            type={isOpen ? "text" : "password"}
            {...props}
            ref={ref}
            className="w-full px-4 py-2 focus:outline-none"
            placeholder="••••••••"
          />
          <div
            className="cursor-pointer"
            onClick={() => setIsOpen((v) => !v)}
          >
            {isOpen ? <EyeOff /> : <Eye />}
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        )}
      </div>
  )
})
