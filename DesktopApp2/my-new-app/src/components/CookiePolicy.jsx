import React from 'react'
import { Shield, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

const CookiePolicy = () => {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <Shield className="w-10 h-10 text-red-500" />
            <div>
              <span className="text-2xl font-bold text-white">Vais SecureGuard</span>
              <div className="text-xs text-red-400 font-semibold">COOKIE POLICY</div>
            </div>
          </div>
          
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-invert prose-red max-w-none">
          <h1>Cookie Policy</h1>
          <p className="text-gray-400">Last updated: August 18, 2025</p>

          <h2>1. What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your device that help us provide and improve our services.
          </p>

          <h2>2. Types of Cookies We Use</h2>
          <h3>Essential Cookies</h3>
          <p>Required for basic site functionality</p>
          
          <h3>Functional Cookies</h3>
          <p>Remember your preferences and settings</p>
          
          <h3>Analytics Cookies</h3>
          <p>Help us understand how visitors use our site</p>
          
          <h3>Marketing Cookies</h3>
          <p>Used to deliver relevant advertisements</p>

          <h2>3. Cookie Management</h2>
          <p>
            You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features.
          </p>

          <h2>4. Third-Party Cookies</h2>
          <p>
            We use cookies from trusted partners for analytics and marketing purposes.
          </p>

          <h2>5. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy periodically. Please check back regularly.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            For questions about our Cookie Policy, please contact privacy@vaisguard.com
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Vais SecureGuard. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default CookiePolicy