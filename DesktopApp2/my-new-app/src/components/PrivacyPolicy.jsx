import React, { useState } from 'react'
import { Shield, ArrowLeft, Eye, EyeOff, Download, Mail, Phone, MapPin, Clock, CheckCircle } from 'lucide-react'

const PrivacyPolicy = () => {
  const [showDetails, setShowDetails] = useState({})
  const [darkMode, setDarkMode] = useState(true)

  const toggleSection = (section) => {
    setShowDetails(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleDownload = () => {
    // Create a simple text version for download
    const content = `VAIS SECUREGUARD PRIVACY POLICY\n\nLast updated: August 18, 2025\n\n1. INFORMATION WE COLLECT...\n\n[Full privacy policy content would be here]`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vais-privacy-policy.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const bgClass = darkMode 
    ? "min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800"
    : "min-h-screen bg-gradient-to-br from-gray-100 via-red-100 to-gray-200"
  
  const textClass = darkMode ? "text-white" : "text-gray-900"
  const mutedTextClass = darkMode ? "text-gray-400" : "text-gray-600"

  const sections = [
    {
      id: 'collection',
      title: '1. Information We Collect',
      icon: <Eye className="w-5 h-5" />,
      content: (
        <div className="space-y-4  ">
          <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
            <h4 className={`font-semibold ${textClass} mb-2`}>Personal Information</h4>
            <ul className={`${mutedTextClass} space-y-1`}>
              <li>• Name and contact details</li>
              <li>• Account credentials (encrypted)</li>
              <li>• Payment information (tokenized)</li>
              <li>• Device information and identifiers</li>
              <li>• Location data (when permitted)</li>
            </ul>
          </div>
          <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
            <h4 className={`font-semibold ${textClass} mb-2`}>Usage & Technical Data</h4>
            <ul className={`${mutedTextClass} space-y-1`}>
              <li>• App usage statistics and patterns</li>
              <li>• Performance metrics and crash reports</li>
              <li>• Security events and threat detections</li>
              <li>• Network and device performance data</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'usage',
      title: '2. How We Use Your Information',
      icon: <CheckCircle className="w-5 h-5" />,
      content: (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
            <h4 className={`font-semibold ${textClass} mb-2`}>Primary Uses</h4>
            <ul className={`${mutedTextClass} space-y-1 text-sm`}>
              <li>• Providing core security services</li>
              <li>• Real-time threat protection</li>
              <li>• Account management</li>
              <li>• Service improvements</li>
            </ul>
          </div>
          <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
            <h4 className={`font-semibold ${textClass} mb-2`}>Secondary Uses</h4>
            <ul className={`${mutedTextClass} space-y-1 text-sm`}>
              <li>• Customer support</li>
              <li>• Analytics and research</li>
              <li>• Marketing communications</li>
              <li>• Legal compliance</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: '3. Data Security & Protection',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 p-6 rounded-lg border border-red-500/20">
            <h4 className={`font-semibold ${textClass} mb-3`}>Military-Grade Security Measures</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className={`${mutedTextClass} space-y-2`}>
                <li>• AES-256 end-to-end encryption</li>
                <li>• Zero-knowledge architecture</li>
                <li>• Multi-factor authentication</li>
                <li>• Regular penetration testing</li>
              </ul>
              <ul className={`${mutedTextClass} space-y-2`}>
                <li>• SOC 2 Type II certified</li>
                <li>• GDPR compliant infrastructure</li>
                <li>• Automated threat monitoring</li>
                <li>• Incident response protocols</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sharing',
      title: '4. Data Sharing & Third Parties',
      icon: <Mail className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
            <h4 className={`font-semibold ${textClass} mb-2`}>We NEVER sell your data</h4>
            <p className={mutedTextClass}>Your privacy is not for sale. We only share data in these limited circumstances:</p>
          </div>
          <ul className={`${mutedTextClass} space-y-2`}>
            <li>• <strong>Service Providers:</strong> Vetted partners who help us operate (under strict contracts)</li>
            <li>• <strong>Legal Requirements:</strong> When required by law enforcement with valid warrants</li>
            <li>• <strong>Your Consent:</strong> Only when you explicitly authorize sharing</li>
            <li>• <strong>Business Transfers:</strong> In case of merger/acquisition (with notice)</li>
          </ul>
        </div>
      )
    },
    {
      id: 'rights',
      title: '5. Your Privacy Rights & Controls',
      icon: <Eye className="w-5 h-5" />,
      content: (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className={`font-semibold ${textClass}`}>Your Rights Include:</h4>
            <ul className={`${mutedTextClass} space-y-1`}>
              <li>• Access your personal data</li>
              <li>• Correct inaccurate information</li>
              <li>• Delete your account & data</li>
              <li>• Object to data processing</li>
              <li>• Data portability</li>
              <li>• Withdraw consent anytime</li>
            </ul>
          </div>
          <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20">
            <h4 className={`font-semibold ${textClass} mb-2`}>Easy Controls</h4>
            <p className={`${mutedTextClass} text-sm`}>
              Exercise your rights through your account settings or by contacting our privacy team. 
              Most requests are processed within 30 days.
            </p>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className={bgClass}>
      {/* Enhanced Navigation */}
      <nav className={`relative z-50 px-6 py-4 border-b ${darkMode ? 'border-white/10' : 'border-black/10'} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.history.back()}>
            <Shield className="w-10 h-10 text-red-500 drop-shadow-lg" />
            <div>
              <span className={`text-2xl font-bold ${textClass}`}>Vais SecureGuard</span>
              <div className="text-xs text-red-400 font-semibold tracking-wider">PRIVACY POLICY</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleDownload}
              className={`flex items-center cursor-pointer space-x-2 ${mutedTextClass} hover:${textClass} transition-colors`}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 cursor-pointer rounded-lg ${mutedTextClass} hover:${textClass} transition-colors`}
            >
              {darkMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            
            <button 
              onClick={() => window.history.back()}
              className={`flex items-center cursor-pointer space-x-2 ${mutedTextClass} hover:${textClass} transition-colors`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Enhanced Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className={`text-5xl font-bold ${textClass} mb-4`}>Privacy Policy</h1>
          <div className="flex items-center justify-center space-x-2 text-red-400">
            <Clock className="w-4 h-4" />
            <span>Last updated: August 18, 2025</span>
          </div>
          <p className={`${mutedTextClass} mt-6 text-lg max-w-3xl mx-auto`}>
            Your privacy is our priority. This policy explains how we collect, use, and protect your information 
            when you use Vais SecureGuard services.
          </p>
        </div>

        {/* Interactive Sections */}
        <div className="space-y-6  ">
          {sections.map((section) => (
            <div key={section.id} className={`bg-${darkMode ? 'black/20' : 'white/20'}  backdrop-blur-sm rounded-xl border ${darkMode ? 'border-white/10' : 'border-black/10'} overflow-hidden transition-all duration-300 cursor-pointer  `}>
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full p-6 text-left flex items-center justify-between hover:bg-${darkMode ? 'white/5' : 'black/5'} transition-colors cursor-pointer `}
              >
                <div className="flex items-center space-x-4 ">
                  <div className="text-red-500">
                    {section.icon}
                  </div>
                  <h2 className={`text-xl font-semibold ${textClass}`}>
                    {section.title}
                  </h2>
                </div>
                <div className={`transition-transform duration-200 ${showDetails[section.id] ? 'rotate-180' : ''}`}>
                  <ArrowLeft className="w-5 h-5 rotate-90 text-red-400" />
                </div>
              </button>
              
              {showDetails[section.id] && (
                <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className={`mt-16 bg-gradient-to-r ${darkMode ? 'from-red-900/20 to-slate-900/20' : 'from-red-100/50 to-gray-100/50'} p-8 rounded-xl border ${darkMode ? 'border-red-500/20' : 'border-red-300/20'}`}>
          <h2 className={`text-2xl font-bold ${textClass} mb-6 text-center`}>Questions? Contact Our Privacy Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Mail className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className={`font-semibold ${textClass}`}>Email</p>
              <p className={mutedTextClass}>privacy@vaisguard.com</p>
            </div>
            <div className="text-center">
              <Phone className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className={`font-semibold ${textClass}`}>Phone</p>
              <p className={mutedTextClass}>1-800-VAIS-HELP</p>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className={`font-semibold ${textClass}`}>Address</p>
              <p className={mutedTextClass}>123 Security Ave, Safe City</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className={`relative z-10 px-6 py-12 border-t ${darkMode ? 'border-white/10' : 'border-black/10'} bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="w-6 h-6 text-red-500" />
              <span className={`font-bold ${textClass}`}>Vais SecureGuard</span>
            </div>
            <p className={`${mutedTextClass} text-sm`}>
              © {new Date().getFullYear()} Vais SecureGuard. All rights reserved. 
              Protecting your digital life with next-generation security.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPolicy