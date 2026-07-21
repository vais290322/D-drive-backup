import React, { useState } from 'react'
import { Shield, ArrowLeft, Eye, EyeOff, Download, Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle, FileText, Users, Lock, Globe, Scale, UserX, CreditCard, Gavel, Ban, XCircle, AlertTriangle, BookOpen, Zap } from 'lucide-react'

const Term = () => {
  const [showDetails, setShowDetails] = useState({})
  const [darkMode, setDarkMode] = useState(true)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const toggleSection = (section) => {
    setShowDetails(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleDownload = () => {
    const content = `VAIS SECUREGUARD TERMS OF SERVICE\n\nLast updated: August 18, 2025\n\n1. INTRODUCTION...\n\n[Full terms of service document would be here]`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vais-terms-of-service.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleAcceptTerms = () => {
    setAcceptedTerms(!acceptedTerms)
    if (!acceptedTerms) {
      alert('Thank you for accepting our Terms of Service!')
    }
  }

  const bgClass = darkMode 
    ? "min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800"
    : "min-h-screen bg-gradient-to-br from-gray-100 via-red-100 to-gray-200"
  
  const textClass = darkMode ? "text-white" : "text-gray-900"
  const mutedTextClass = darkMode ? "text-gray-400" : "text-gray-600"

  const keyTerms = [
    {
      id: 'license',
      title: 'Software License',
      icon: <Lock className="w-6 h-6" />,
      color: 'blue',
      summary: 'Limited, non-exclusive license to use our software',
      details: ['Personal or business use only', 'Cannot redistribute or modify', 'Subject to subscription validity', 'Terminates upon breach']
    },
    {
      id: 'services',
      title: 'Service Coverage',
      icon: <Shield className="w-6 h-6" />,
      color: 'green',
      summary: 'Comprehensive security and privacy protection',
      details: ['Real-time malware protection', 'Privacy monitoring', 'Network security', 'Performance optimization']
    },
    {
      id: 'obligations',
      title: 'User Responsibilities',
      icon: <Users className="w-6 h-6" />,
      color: 'yellow',
      summary: 'Your obligations when using our service',
      details: ['Provide accurate information', 'Maintain account security', 'Comply with applicable laws', 'Report security issues']
    },
    {
      id: 'payment',
      title: 'Payment Terms',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'purple',
      summary: 'Subscription billing and payment policies',
      details: ['Auto-renewal by default', '30-day refund policy', 'Price changes with notice', 'Payment method required']
    }
  ]

  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction & Acceptance',
      icon: <BookOpen className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-lg border border-blue-500/20">
            <h4 className={`font-semibold ${textClass} mb-3`}>Welcome to Vais SecureGuard</h4>
            <p className={mutedTextClass}>
              By accessing, downloading, installing, or using Vais SecureGuard software and services, 
              you acknowledge that you have read, understood, and agree to be legally bound by these Terms of Service.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>What This Covers</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Desktop and mobile applications</li>
                <li>• Web-based services and dashboard</li>
                <li>• Customer support services</li>
                <li>• All related documentation</li>
              </ul>
            </div>
            <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Agreement Formation</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Binding upon first use</li>
                <li>• Updated terms apply immediately</li>
                <li>• Continued use implies acceptance</li>
                <li>• Must be 18+ or have guardian consent</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'license',
      title: '2. License & Usage Rights',
      icon: <Lock className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-500/10 p-6 rounded-lg border border-blue-500/20">
            <h4 className={`font-semibold ${textClass} mb-3`}>License Grant</h4>
            <p className={mutedTextClass}>
              We grant you a limited, non-exclusive, non-transferable, revocable license to use Vais SecureGuard 
              software subject to your compliance with these terms and active subscription status.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Permitted Uses</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Install on authorized devices</li>
                <li>• Use for personal or business protection</li>
                <li>• Access customer support</li>
                <li>• Receive automatic updates</li>
                <li>• Export your own data</li>
              </ul>
            </div>
            <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Prohibited Uses</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Reverse engineer or decompile</li>
                <li>• Distribute or resell the software</li>
                <li>• Remove proprietary notices</li>
                <li>• Use for illegal activities</li>
                <li>• Circumvent security features</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'services',
      title: '3. Service Description & Availability',
      icon: <Zap className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Core Protection</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Real-time virus & malware detection</li>
                <li>• Behavioral threat analysis</li>
                <li>• Automatic quarantine & removal</li>
                <li>• System vulnerability scanning</li>
              </ul>
            </div>
            <div className="bg-teal-500/10 p-4 rounded-lg border border-teal-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Privacy & Performance</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Privacy monitoring & alerts</li>
                <li>• Network traffic analysis</li>
                <li>• System optimization tools</li>
                <li>• Secure browsing protection</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
            <h5 className={`font-semibold ${textClass} mb-2`}>Service Availability & Limitations</h5>
            <p className={`${mutedTextClass} text-sm mb-2`}>
              While we strive for 99.9% uptime, services may be temporarily unavailable due to:
            </p>
            <ul className={`${mutedTextClass} text-sm space-y-1`}>
              <li>• Scheduled maintenance (with advance notice)</li>
              <li>• Emergency security updates</li>
              <li>• Force majeure events</li>
              <li>• Third-party service dependencies</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'obligations',
      title: '4. User Obligations & Responsibilities',
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-red-500/10 p-6 rounded-lg border border-red-500/20">
            <h4 className={`font-semibold ${textClass} mb-3`}>Your Commitments</h4>
            <p className={mutedTextClass}>
              By using our services, you agree to maintain the security and integrity of your account 
              and comply with all applicable laws and regulations.
            </p>
          </div>
          
          <div className="grid gap-4">
            <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Account Security</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Use strong, unique passwords</li>
                <li>• Enable two-factor authentication</li>
                <li>• Keep login credentials confidential</li>
                <li>• Report unauthorized access immediately</li>
              </ul>
            </div>
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Lawful Use</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Comply with local and international laws</li>
                <li>• Respect intellectual property rights</li>
                <li>• No malicious or harmful activities</li>
                <li>• Report security vulnerabilities responsibly</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'payment',
      title: '5. Payment Terms & Subscriptions',
      icon: <CreditCard className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Billing & Payments</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Automatic renewal by default</li>
                <li>• Secure payment processing</li>
                <li>• Multiple payment methods accepted</li>
                <li>• Prorated charges for upgrades</li>
              </ul>
            </div>
            <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Refund Policy</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• 30-day money-back guarantee</li>
                <li>• No questions asked cancellation</li>
                <li>• Prorated refunds for annual plans</li>
                <li>• Processing time: 5-10 business days</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
            <h5 className={`font-semibold ${textClass} mb-2`}>Price Changes & Notifications</h5>
            <p className={`${mutedTextClass} text-sm`}>
              We may modify subscription prices with at least 30 days advance notice. 
              Current subscribers will be notified via email and can cancel before changes take effect.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'termination',
      title: '6. Termination & Account Suspension',
      icon: <UserX className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Termination by You</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Cancel anytime through account settings</li>
                <li>• Service continues until period end</li>
                <li>• Data export available for 30 days</li>
                <li>• Automatic data deletion after 90 days</li>
              </ul>
            </div>
            <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Termination by Us</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Breach of terms or policies</li>
                <li>• Fraudulent or illegal activities</li>
                <li>• Non-payment after grace period</li>
                <li>• Immediate termination for serious violations</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-500/10 p-4 rounded-lg border border-gray-500/20">
            <h5 className={`font-semibold ${textClass} mb-2`}>Effects of Termination</h5>
            <p className={`${mutedTextClass} text-sm`}>
              Upon termination, your license to use the software immediately expires, 
              and you must cease all use and delete all copies of the software from your devices.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'disclaimer',
      title: '7. Disclaimers & Limitations',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-red-500/10 p-6 rounded-lg border border-red-500/20">
            <h4 className={`font-semibold ${textClass} mb-3`}>Important Legal Notice</h4>
            <p className={`${mutedTextClass} text-sm`}>
              While we strive to provide excellent protection, no security solution can guarantee 100% protection against all threats. 
              Our service is provided "as is" without warranties of any kind.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Service Disclaimers</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• No warranty of uninterrupted service</li>
                <li>• Cannot guarantee 100% threat detection</li>
                <li>• Third-party integrations may have limitations</li>
                <li>• Performance varies by system configuration</li>
              </ul>
            </div>
            <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Limitation of Liability</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Liability limited to subscription fees paid</li>
                <li>• No liability for indirect or consequential damages</li>
                <li>• User responsible for data backups</li>
                <li>• Claims must be made within 1 year</li>
              </ul>
            </div>
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
              <div className="text-xs text-red-400 font-semibold tracking-wider">TERMS OF SERVICE</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* <button 
              onClick={handleDownload}
              className={`flex items-center space-x-2 ${mutedTextClass} hover:${textClass} transition-colors`}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button> */}
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${mutedTextClass} hover:${textClass} transition-colors cursor-pointer`}
            >
              {darkMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            
            <button 
              onClick={() => window.history.back()}
              className={`flex items-center space-x-2 ${mutedTextClass} hover:${textClass} transition-colors cursor-pointer`}
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
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-red-500 to-blue-500 p-4 rounded-2xl">
              <Gavel className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className={`text-5xl font-bold ${textClass} mb-4`}>Terms of Service</h1>
          <div className="flex items-center justify-center space-x-2 text-red-400">
            <Clock className="w-4 h-4" />
            <span>Last updated: August 20, 2025</span>
          </div>
          <p className={`${mutedTextClass} mt-6 text-lg max-w-3xl mx-auto`}>
            These terms govern your use of Vais SecureGuard services. Please read them carefully 
            as they contain important information about your rights and obligations.
          </p>
        </div>

        {/* Key Terms Overview */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold ${textClass} mb-6 text-center`}>Key Terms at a Glance</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyTerms.map((term) => (
              <div key={term.id} className={`bg-${term.color}-500/10 p-4 rounded-lg border border-${term.color}-500/20 hover:bg-${term.color}-500/20 transition-colors`}>
                <div className={`text-${term.color}-500 mb-2`}>
                  {term.icon}
                </div>
                <h3 className={`font-semibold ${textClass} text-sm mb-1`}>{term.title}</h3>
                <p className={`${mutedTextClass} text-xs mb-2`}>{term.summary}</p>
                <ul className={`text-xs ${mutedTextClass} space-y-1`}>
                  {term.details.slice(0, 2).map((detail, idx) => (
                    <li key={idx}>• {detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Acceptance Banner */}
        <div className={`mb-12 bg-gradient-to-r ${darkMode ? 'from-green-900/30 to-blue-900/30' : 'from-green-100/50 to-blue-100/50'} p-6 rounded-xl border ${darkMode ? 'border-green-500/20' : 'border-green-300/20'}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className={`w-8 h-8 ${acceptedTerms ? 'text-green-500' : 'text-gray-500'}`} />
              <div>
                <h3 className={`font-semibold ${textClass}`}>Terms Acceptance</h3>
                <p className={`${mutedTextClass} text-sm`}>
                  {acceptedTerms ? 'You have acknowledged these terms' : 'Review and acknowledge our terms'}
                </p>
              </div>
            </div>
            <button
              onClick={handleAcceptTerms}
              className={`px-6 py-2 rounded-lg cursor-pointer font-semibold transition-colors ${
                acceptedTerms 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {acceptedTerms ? 'Terms Acknowledged' : 'Acknowledge Terms'}
            </button>
          </div>
        </div>

        {/* Interactive Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm rounded-xl border ${darkMode ? 'border-white/10' : 'border-black/10'} overflow-hidden transition-all duration-300`}>
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full cursor-pointer p-6 text-left flex items-center justify-between hover:bg-${darkMode ? 'white/5' : 'black/5'} transition-colors`}
              >
                <div className="flex items-center space-x-4 cursor-pointer ">
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

        {/* Legal Contact Section */}
        <div className={`mt-16 bg-gradient-to-r ${darkMode ? 'from-red-900/20 to-slate-900/20' : 'from-red-100/50 to-gray-100/50'} p-8 rounded-xl border ${darkMode ? 'border-red-500/20' : 'border-red-300/20'}`}>
          <h2 className={`text-2xl font-bold ${textClass} mb-6 text-center`}>Legal & Compliance Contact</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Mail className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className={`font-semibold ${textClass}`}>Legal Team</p>
              <p className={mutedTextClass}>info@vais.co.in</p>
            </div>
            <div className="text-center">
              <Scale className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className={`font-semibold ${textClass}`}>Compliance</p>
              <p className={mutedTextClass}>info@vais.co.in</p>
            </div>
            <div className="text-center">
              <Phone className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className={`font-semibold ${textClass}`}>Legal Hotline</p>
              <p className={mutedTextClass}>+91 8343939495</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className={`${mutedTextClass} text-sm`}>
              For legal inquiries, contract questions, or terms clarification, 
              our legal team responds within 2 business days.
            </p>
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
              These terms are governed by the laws of India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Term