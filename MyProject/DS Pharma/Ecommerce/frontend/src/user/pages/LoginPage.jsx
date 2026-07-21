import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthCard, InputField } from '@/user/components/auth';
import Button from '@/shared/components/ui/Button';
import { useLogin } from '@/shared/hooks/mutations/useLogin';

const LoginPage = () => {
    const { mutate: login, isPending } = useLogin();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({}); 

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            login({
                email: formData.email,
                password: formData.password,
                rememberMe: formData.rememberMe
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
        <AuthCard
            title="Welcome Back"
            subtitle="Sign in to your account to continue"
        >
            <form onSubmit={handleSubmit} className="space-y-6" style={{ padding: '10px 10px 0px 10px' }}>
                <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                />

                <div className="space-y-1">
                    <InputField
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />
                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                            style={{ textDecoration: 'none' }}
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <div className="flex items-center" style={{ paddingBottom: '10px' }}>
                    <div className="flex items-center h-5" style={{ padding: ' 0px 5px' }}>
                        <input
                            id="remember-me"
                            name="rememberMe"
                            type="checkbox"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                    </div>
                    <div className="ml-2 text-base" style={{ padding: '2px', marginTop: '3px' }}>
                        <label htmlFor="remember-me" className="block text-gray-900">
                            Remember me
                        </label>
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
                    {isPending ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>


            <div className="mt-6 text-center text-sm" style={{ padding: '10px' }}>
                <span className="text-gray-600">Don't have an account? </span>
                <Link
                    to={`/signup${window.location.search}`}
                    className="font-medium text-emerald-600 hover:text-emerald-500"
                    style={{ textDecoration: 'none' }}
                >
                    Sign Up
                </Link>
            </div>
        </AuthCard>
    );
};

export default LoginPage;
