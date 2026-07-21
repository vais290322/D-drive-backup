import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import {
  EnvelopeIcon, LockClosedIcon, UserIcon, PhoneIcon, CheckCircleIcon
} from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '@/context/AuthContext'

const SignupPage = () => {
  const { register, googleLogin } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '', mobileNumber: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return strength
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'password') setPasswordStrength(calculatePasswordStrength(value))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    setApiError('')
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.username) newErrors.username = 'Username is required'
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters'
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) newErrors.username = 'Username can only contain letters, numbers, and underscores'

    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email'

    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    else if (passwordStrength < 3) newErrors.password = 'Password must contain uppercase, lowercase, numbers, and special characters'

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile number is required'
    else if (!/^[+]?[1-9][\d]{0,15}$/.test(formData.mobileNumber.replace(/\s+/g, ''))) newErrors.mobileNumber = 'Please enter a valid mobile number'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setApiError('')
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        mobileNumber: formData.mobileNumber.replace(/\s+/g, '')
      })
      navigate('/home')
    } catch (error) {
      setApiError(error?.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setApiError('')
    try {
      await googleLogin(credentialResponse.credential)
      navigate('/home')
    } catch (error) {
      setApiError(error?.response?.data?.message || 'Google signup failed. Please try again.')
    }
  }

  const handleGoogleError = () => setApiError('Google signup was cancelled or failed.')

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500'
    if (passwordStrength <= 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }
  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak'
    if (passwordStrength <= 3) return 'Medium'
    return 'Strong'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse dark:bg-green-600"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse dark:bg-blue-600"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse dark:bg-purple-600"></div>
      </div>

      {/* Signup Card */}
      <div className="relative w-full max-w-lg mx-auto">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-300">Join us today and get started with your journey</p>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input id="username" name="username" type="text" autoComplete="username" value={formData.username} onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}
                  placeholder="Choose a username" />
              </div>
              {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <EnvelopeIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input id="email" name="email" type="email" autoComplete="email" value={formData.email} onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}
                  placeholder="Enter your email" />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <label htmlFor="mobileNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <PhoneIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input id="mobileNumber" name="mobileNumber" type="tel" autoComplete="tel" value={formData.mobileNumber} onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${errors.mobileNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}
                  placeholder="Enter your mobile number" />
              </div>
              {errors.mobileNumber && <p className="text-sm text-red-500">{errors.mobileNumber}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <LockClosedIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={formData.password} onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}
                  placeholder="Create a strong password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10">
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {/* Password Strength */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Password strength:</span>
                    <span className={`text-xs font-medium ${passwordStrength <= 2 ? 'text-red-500' : passwordStrength <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`} style={{ width: `${(passwordStrength / 5) * 100}%` }}></div>
                  </div>
                </div>
              )}
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <LockClosedIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" value={formData.confirmPassword} onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-500 focus:ring-green-500' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}
                  placeholder="Confirm your password" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1 z-10">
                  {formData.confirmPassword && formData.password === formData.confirmPassword && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                <p className="text-sm text-green-500 flex items-center"><CheckCircleIcon className="h-4 w-4 mr-1" />Passwords match</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 mt-0.5 text-green-600 focus:ring-green-500 border-gray-300 rounded transition-colors" />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <a href="#" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors">Privacy Policy</a>
              </label>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400">Or sign up with</span>
            </div>
          </div>

          {/* Google and GitHub Signup Buttons */}
          <div className="flex flex-col gap-4 items-center justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="outline"
              size="large"
              text="signup_with"
              shape="rectangular"
              width="432"
            />
            <Button
              type="button"
              onClick={() => {
                window.location.href = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&scope=user:email`;
              }}
              variant="outline"
              className="w-full max-w-[432px] h-10 bg-[#24292e] hover:bg-[#2f363d] border-none text-white flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              Sign up with GitHub
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage