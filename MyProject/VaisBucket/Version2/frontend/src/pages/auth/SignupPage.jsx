import React, { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { ArrowLeftIcon } from 'lucide-react'
import { getPublicConfig } from '../../services/subscriptionService'
import BillingDetailsModal from '../../components/BillingDetailsModal'

const SignupPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const planParam = searchParams.get('plan')
  const billingParam = searchParams.get('billing')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showBillingModal, setShowBillingModal] = useState(false)
  const [registeredUser, setRegisteredUser] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleBillingSubmit = (billingInfo) => {
    // Store billing info in sessionStorage or pass it via URL
    sessionStorage.setItem('billingDetails', JSON.stringify(billingInfo));
    setShowBillingModal(false);

    // Resume redirection logic
    if (planParam && planParam !== 'Free') {
      navigate(`/pricing?plan=${planParam}&billing=${billingParam || 'monthly'}&action=pay`)
    } else {
      checkSignupMode();
    }
  }

  const checkSignupMode = async () => {
    try {
      const config = await getPublicConfig();
      if (config?.data?.PLAN_BASED_SIGNUP === true) {
        navigate('/pricing');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Failed to check settings post-signup", err);
      navigate('/dashboard');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match')
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      if (result.success) {
        setShowBillingModal(true);
      } else {
        setError(result.error || 'Registration failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4 cursor-pointer">
        <Link to="/">
          <Button variant="outline" className="cursor-pointer"> <ArrowLeftIcon className="w-5 h-5" />Back to Home</Button>
        </Link>
      </div>
      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600">
              {planParam ? `Signing up for ${planParam} Plan` : 'Start managing your media today'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-95 mt-4"
            >
              {isLoading ? 'Creating Account...' : (planParam ? `Sign Up & Pay for ${planParam}` : 'Sign Up')}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:underline">
                Log in instead
              </Link>
            </p>
          </div>
        </div>
      </div>

      <BillingDetailsModal
        isOpen={showBillingModal}
        onClose={() => {
          setShowBillingModal(false);
          // Even if they close, we should probably proceed but without details? 
          // The requirement says "after fill-up the form then select the plan".
          // So closing it might just mean skipping or we can force it.
          // Let's assume they can skip for now or we redirect anyway.
          handleBillingSubmit({});
        }}
        onSubmit={handleBillingSubmit}
      />
    </div>
  )
}

export default SignupPage
