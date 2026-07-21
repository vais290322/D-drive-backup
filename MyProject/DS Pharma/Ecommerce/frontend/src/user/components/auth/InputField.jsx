import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Phone, User, Lock, UserCircle } from 'lucide-react';
import Input from '@/shared/components/ui/Input';

const InputField = ({
    label,
    type = 'text',
    error,
    placeholder,
    className = '',
    name,
    icon: IconProp,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Determine icon based on field type or name
    const getIcon = () => {
        if (IconProp) return IconProp;
        
        // Auto-detect icon based on name or type
        const fieldName = name?.toLowerCase() || '';
        const fieldType = type?.toLowerCase() || '';
        
        if (fieldType === 'email' || fieldName.includes('email')) {
            return Mail;
        } else if (fieldType === 'tel' || fieldName.includes('phone')) {
            return Phone;
        } else if (fieldName.includes('password') || fieldName.includes('confirmpassword')) {
            return Lock;
        } else if (fieldName.includes('name') || fieldName.includes('fullname')) {
            return User;
        } else if (fieldName.includes('user')) {
            return UserCircle;
        }
        
        return null;
    };

    const FieldIcon = getIcon();
    const hasIcon = FieldIcon !== null;
    const hasPasswordToggle = isPassword;

    return (
        <div className="relative w-full" style={{ paddingBottom: '10px' }}>
            <div className="relative">
                {label && (
                    <label
                        className="block mb-2 text-[12px] font-semibold text-gray-700 text-[15px]"
                        style={{ fontFamily: 'Gyrotrope' }}
                    >
                        {label}
                    </label>
                )}
                
                <div className="relative">
                    {/* Icon on the left */}
                    {hasIcon && (
                        <div className="absolute left-3 top-[19px] -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                            <FieldIcon size={18} />
                        </div>
                    )}
                    
                    <input
                        type={isPassword ? (showPassword ? 'text' : 'password') : type}
                        placeholder={placeholder}
                        className={`w-full px-4 py-2.5 rounded-lg border bg-gray-50 border-gray-200 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 hover:border-emerald-300 text-[12px] placeholder:text-[12px] ${className} ${hasIcon ? 'pl-10' : ''} ${hasPasswordToggle ? 'pr-10' : ''}`}
                        style={{ fontFamily: 'Gyrotrope', padding: '10px 5px', paddingLeft: '40px' }}
                        name={name}
                        {...props}
                    />

                    {/* Password visibility toggle on the right */}
                    {hasPasswordToggle && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    )}
                </div>
                
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default InputField;
