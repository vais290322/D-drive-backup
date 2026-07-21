import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthCard, InputField, TermsModal } from '@/user/components/auth';
import Button from '@/shared/components/ui/Button';
import { useSignup } from '@/shared/hooks/mutations/useSignup';

const SignupPage = () => {
    const { mutate: signup, isPending } = useSignup();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });
    const [errors, setErrors] = useState({});
    const [showTerms, setShowTerms] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the Terms and Conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            signup({
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <>
            <AuthCard
                title="Create Account"
                subtitle="Join us to access all features"
            >
                <form onSubmit={handleSubmit} className="space-y-6" style={{ padding: '10px 10px 0px 10px' }}>
                    <InputField
                        label="Full Name"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={errors.fullName}
                    />

                    <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <InputField
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                    />

                    <InputField
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    <InputField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                    />

                    <div className="flex items-start" style={{ paddingBottom: '10px' }}>
                        <div className="flex items-center h-5" style={{ padding: ' 0px 5px' }}>
                            <input
                                id="agree-terms"
                                name="agreeToTerms"
                                type="checkbox"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
                            />
                        </div>
                        <div className="ml-2 text-xs sm:text-base" style={{ padding: '2px' }}>
                            <label htmlFor="agree-terms" className="font-medium text-gray-700">
                                I agree to the <button type="button" onClick={() => setShowTerms(true)} className="text-emerald-600 hover:text-emerald-400 cursor-pointer" style={{ textDecoration: 'none' }}>Terms and Conditions</button>
                            </label>
                            {errors.agreeToTerms && (
                                <p className="text-red-500 text-[8px] sm:text-xs mt-1">{errors.agreeToTerms}</p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="full"
                        disabled={isPending}
                        className="!bg-emerald-600 hover:!bg-emerald-700 !shadow-emerald-200"
                        style={{ marginBottom: '10px' }}
                    >
                        {isPending ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>


                <div className="mt-6 text-center text-sm" style={{ padding: '10px' }}>
                    <span className="text-gray-600">Already have an account? </span>
                    <Link
                        to={`/login${window.location.search}`}
                        className="font-medium text-emerald-600 hover:text-emerald-400"
                        style={{ textDecoration: 'none' }}
                    >
                        Sign In
                    </Link>
                </div>
            </AuthCard>
            <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
        </>
    );
};

export default SignupPage;
