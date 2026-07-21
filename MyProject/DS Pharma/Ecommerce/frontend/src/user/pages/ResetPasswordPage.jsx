import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthCard, InputField } from '@/user/components/auth';
import Button from '@/shared/components/ui/Button';
import { authService } from '@/services/authService';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const ResetPasswordPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState('');

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        
        if (validateForm()) {
            setIsLoading(true);
            try {
                await authService.resetPassword(id, { password: formData.password });
                setIsSuccess(true);
                // Redirect after a short delay
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (err) {
                console.error(err);
                setApiError(err.response?.data?.message || 'Failed to reset password. Please try again or request a new link.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (isSuccess) {
        return (
            <AuthCard
                title="Password Reset Successful"
                subtitle="Your password has been updated successfully."
            >
                <div className="w-full text-center space-y-6" style={{ padding: '10px' }}>
                    <div className='w-full flex justify-center items-center'>
                        <Motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"
                        >
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </Motion.div>
                    </div>

                    <p className="text-sm text-gray-600">
                        You will be redirected to the login page shortly.
                    </p>

                    <Button
                        onClick={() => navigate('/login')}
                        variant="primary"
                        size="full"
                        className="bg-emerald-600! hover:bg-emerald-700! shadow-emerald-200!"
                        style={{ marginBottom: '10px' }}
                    >
                        Go to Login
                    </Button>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard
            title="Set New Password"
            subtitle="Please enter your new password below."
        >
            <form onSubmit={handleSubmit} className="space-y-6" style={{ padding: '10px 10px 0px 10px' }}>
                {apiError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600">{apiError}</p>
                    </div>
                )}

                <InputField
                    label="New Password"
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                />

                <InputField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="full"
                    disabled={isLoading}
                    className="bg-emerald-600! hover:bg-emerald-700! shadow-emerald-200!"
                >
                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </Button>

                <div className="text-center" style={{ padding: '10px' }}>
                    <Link
                        to="/login"
                        className="sm:hidden inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                        style={{ textDecoration: 'none' }}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <p className="mt-1" style={{ marginTop: '5px' }}>Back to Sign In</p>
                    </Link>
                </div>
            </form>
        </AuthCard>
    );
};

export default ResetPasswordPage;
