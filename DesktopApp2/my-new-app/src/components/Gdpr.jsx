import React from 'react'
import { Shield, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

const Gdpr = () => {
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
              <div className="text-xs text-red-400 font-semibold">GDPR COMPLIANCE</div>
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
          <h1>GDPR Compliance</h1>
          <p className="text-gray-400">Last updated: August 18, 2025</p>

          <h2>1. Data Protection Principles</h2>
          <p>
            We adhere to the principles outlined in Article 5 of the GDPR:
          </p>
          <ul>
            <li>Lawfulness, fairness, and transparency</li>
            <li>Purpose limitation</li>
            <li>Data minimization</li>
            <li>Accuracy</li>
            <li>Storage limitation</li>
            <li>Integrity and confidentiality</li>
            <li>Accountability</li>
          </ul>

          <h2>2. Your Rights</h2>
          <p>Under GDPR, you have the following rights:</p>
          <ul>
            <li>Right to access your data</li>
            <li>Right to rectification</li>
            <li>Right to erasure</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object</li>
          </ul>

          <h2>3. Data Processing</h2>
          <p>
            We process personal data for the following purposes:
          </p>
          <ul>
            <li>Providing security services</li>
            <li>Account management</li>
            <li>Technical support</li>
            <li>Service improvement</li>
          </ul>

          <h2>4. Data Protection Officer</h2>
          <p>
            Our Data Protection Officer can be contacted at dpo@vaisguard.com
          </p>

          <h2>5. International Transfers</h2>
          <p>
            We ensure appropriate safeguards are in place for any data transfers outside the EEA.
          </p>

          <h2>6. Contact Information</h2>
          <p>
            For any GDPR-related inquiries, please contact gdpr@vaisguard.com
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

export default Gdpr