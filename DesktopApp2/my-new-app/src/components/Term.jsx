import React from 'react'
import { Shield, ArrowLeft, Download } from 'lucide-react'
import { useNavigate } from 'react-router'

const Term = () => {
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
              <div className="text-xs text-red-400 font-semibold">TERMS OF SERVICE</div>
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
          <h1>Terms of Service</h1>
          <p className="text-gray-400">Last updated: August 18, 2025</p>
          
          <h2>1. Introduction</h2>
          <p>
            Welcome to Vais SecureGuard. By accessing or using our services, you agree to be bound by these Terms of Service.
          </p>

          <h2>2. Use License</h2>
          <p>
            We grant you a limited, non-exclusive, non-transferable license to use our software subject to these terms.
          </p>

          <h2>3. Service Description</h2>
          <ul>
            <li>Real-time virus and malware protection</li>
            <li>Privacy protection features</li>
            <li>Network security services</li>
            <li>Performance optimization tools</li>
          </ul>

          <h2>4. User Obligations</h2>
          <p>
            You agree to:
          </p>
          <ul>
            <li>Provide accurate account information</li>
            <li>Maintain the security of your account</li>
            <li>Use the service in compliance with applicable laws</li>
            <li>Not attempt to circumvent our security measures</li>
          </ul>

          <h2>5. Privacy & Data</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy for details on data collection and usage.
          </p>

          <h2>6. Subscription Terms</h2>
          <p>
            Subscription terms, pricing, and payment details are available on our Pricing page.
          </p>

          <h2>7. Termination</h2>
          <p>
            We reserve the right to terminate or suspend access to our service immediately, without prior notice.
          </p>

          <h2>8. Disclaimer</h2>
          <p>
            The service is provided "as is" without warranties of any kind, either express or implied.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            For questions about these Terms, please contact us at legal@vaisguard.com.
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

export default Term