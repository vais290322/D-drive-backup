import React, { useState } from 'react'
import { Shield, ArrowLeft, Cookie, Settings, Eye, EyeOff, Download, Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle, BarChart3, Target, Wrench } from 'lucide-react'

const CookiePolicy = () => {
  const [showDetails, setShowDetails] = useState({})
  const [darkMode, setDarkMode] = useState(true)
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    functional: true,
    analytics: false,
    marketing: false
  })

  const toggleSection = (section) => {
    setShowDetails(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCookieToggle = (type) => {
    if (type === 'essential') return // Essential cookies cannot be disabled
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const handleDownload = () => {
    const content = `VAIS SECUREGUARD COOKIE POLICY\n\nLast updated: August 18, 2025\n\n1. WHAT ARE COOKIES...\n\n[Full cookie policy content would be here]`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vais-cookie-policy.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const savePreferences = () => {
    // In a real app, this would save to backend/localStorage
    alert('Cookie preferences saved successfully!')
  }

  const bgClass = darkMode 
    ? "min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800"
    : "min-h-screen bg-gradient-to-br from-gray-100 via-red-100 to-gray-200"
  
  const textClass = darkMode ? "text-white" : "text-gray-900"
  const mutedTextClass = darkMode ? "text-gray-400" : "text-gray-600"

  const cookieTypes = [
    {
      id: 'essential',
      name: 'Essential Cookies',
      icon: <Shield className="w-6 h-6" />,
      color: 'green',
      required: true,
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      examples: ['Authentication tokens', 'Session management', 'Security preferences', 'Form submissions'],
      duration: 'Session / 1 year'
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      icon: <Wrench className="w-6 h-6" />,
      color: 'blue',
      required: false,
      description: 'These cookies enable enhanced functionality and personalization.',
      examples: ['Language preferences', 'Theme settings', 'Remembered choices', 'User interface customizations'],
      duration: '30 days / 1 year'
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'yellow',
      required: false,
      description: 'These cookies help us understand how visitors interact with our website.',
      examples: ['Page views', 'User journey tracking', 'Performance metrics', 'Error reporting'],
      duration: '2 years'
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      icon: <Target className="w-6 h-6" />,
      color: 'purple',
      required: false,
      description: 'These cookies are used to deliver relevant advertisements and marketing content.',
      examples: ['Ad targeting', 'Conversion tracking', 'Social media integration', 'Retargeting'],
      duration: '90 days / 2 years'
    }
  ]

  const sections = [
    {
      id: 'whatare',
      title: '1. What Are Cookies?',
      icon: <Cookie className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-indigo-500/10 p-6 rounded-lg border border-indigo-500/20">
            <h4 className={`font-semibold ${textClass} mb-3`}>Cookie Definition</h4>
            <p className={mutedTextClass}>
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
              They help websites remember information about your visit, making your next visit easier and the site more useful to you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>How They Work</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Stored locally on your device</li>
                <li>• Sent back to the server on subsequent visits</li>
                <li>• Enable personalized experiences</li>
                <li>• Improve website performance</li>
              </ul>
            </div>
            <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Types of Data</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• User preferences and settings</li>
                <li>• Login status and authentication</li>
                <li>• Shopping cart contents</li>
                <li>• Website usage analytics</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'types',
      title: '2. Types of Cookies We Use',
      icon: <Settings className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          {cookieTypes.map((cookie) => (
            <div key={cookie.id} className={`bg-${cookie.color}-500/10 p-6 rounded-lg border border-${cookie.color}-500/20`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`text-${cookie.color}-500`}>
                    {cookie.icon}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${textClass}`}>{cookie.name}</h4>
                    {cookie.required && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded mt-1 inline-block">
                        Required
                      </span>
                    )}
                  </div>
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={cookiePreferences[cookie.id]}
                    onChange={() => handleCookieToggle(cookie.id)}
                    disabled={cookie.required}
                    className="rounded border-gray-300"
                  />
                  <span className={`text-sm ${mutedTextClass}`}>
                    {cookiePreferences[cookie.id] ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
              
              <p className={`${mutedTextClass} mb-4`}>{cookie.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className={`font-medium ${textClass} mb-2 text-sm`}>Examples:</h5>
                  <ul className={`${mutedTextClass} text-sm space-y-1`}>
                    {cookie.examples.map((example, idx) => (
                      <li key={idx}>• {example}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className={`font-medium ${textClass} mb-2 text-sm`}>Duration:</h5>
                  <p className={`${mutedTextClass} text-sm`}>{cookie.duration}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'management',
      title: '3. Cookie Management & Controls',
      icon: <Settings className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-lg border border-blue-500/20">
            <h4 className={`font-semibold ${textClass} mb-4`}>Your Cookie Preferences</h4>
            <div className="flex flex-wrap gap-4 mb-4">
              <button
                onClick={() => setCookiePreferences({ essential: true, functional: true, analytics: true, marketing: true })}
                className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={() => setCookiePreferences({ essential: true, functional: false, analytics: false, marketing: false })}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Essential Only
              </button>
              <button
                onClick={savePreferences}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                Save Preferences
              </button>
            </div>
            <p className={`${mutedTextClass} text-sm`}>
              You can change your cookie preferences at any time by revisiting this page or through your browser settings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Browser Settings</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Chrome: Settings → Privacy and Security → Cookies</li>
                <li>• Firefox: Settings → Privacy & Security → Cookies</li>
                <li>• Safari: Preferences → Privacy → Cookies</li>
                <li>• Edge: Settings → Cookies and Site Permissions</li>
              </ul>
            </div>
            <div className="bg-teal-500/10 p-4 rounded-lg border border-teal-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Important Note</h5>
              <p className={`${mutedTextClass} text-sm`}>
                Disabling essential cookies may limit your ability to use some features of our website, 
                including security functions and user authentication.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'thirdparty',
      title: '4. Third-Party Cookies & Partners',
      icon: <AlertCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-red-500/10 p-6 rounded-lg border border-red-500/20">
            <h4 className={`font-semibold ${textClass} mb-3`}>Trusted Partners</h4>
            <p className={mutedTextClass}>
              We work with carefully selected third-party services to enhance your experience. 
              These partners may set their own cookies when you interact with their content on our site.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-500/10 p-4 rounded-lg border border-gray-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Analytics Partners</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Google Analytics (website performance)</li>
                <li>• Hotjar (user experience insights)</li>
                <li>• Mixpanel (product analytics)</li>
              </ul>
            </div>
            <div className="bg-pink-500/10 p-4 rounded-lg border border-pink-500/20">
              <h5 className={`font-semibold ${textClass} mb-2`}>Marketing Partners</h5>
              <ul className={`${mutedTextClass} text-sm space-y-1`}>
                <li>• Facebook Pixel (social advertising)</li>
                <li>• Google Ads (search advertising)</li>
                <li>• LinkedIn Insight (professional targeting)</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
            <p className={`${mutedTextClass} text-sm`}>
              <strong>Note:</strong> Each third-party service has its own privacy policy and cookie practices. 
              We encourage you to review their policies to understand how they handle your data.
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
              <div className="text-xs text-red-400 font-semibold tracking-wider">COOKIE POLICY</div>
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
            <Cookie className="w-16 h-16 text-red-500" />
          </div>
          <h1 className={`text-5xl font-bold ${textClass} mb-4`}>Cookie Policy</h1>
          <div className="flex items-center justify-center space-x-2 text-red-400">
            <Clock className="w-4 h-4" />
            <span>Last updated: August 20, 2025</span>
          </div>
          <p className={`${mutedTextClass} mt-6 text-lg max-w-3xl mx-auto`}>
            Learn how we use cookies to enhance your experience, improve our services, and respect your privacy choices. 
            You have full control over your cookie preferences.
          </p>
        </div>

        {/* Cookie Preference Banner */}
        <div className={`mb-12 bg-gradient-to-r ${darkMode ? 'from-red-900/30 to-orange-900/30' : 'from-red-100/50 to-orange-100/50'} p-6 rounded-xl border ${darkMode ? 'border-red-500/20' : 'border-red-300/20'}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <Cookie className="w-8 h-8 text-red-500" />
              <div>
                <h3 className={`font-semibold ${textClass}`}>Cookie Preferences</h3>
                <p className={`${mutedTextClass} text-sm`}>Customize your cookie settings below</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <span className={`text-sm ${mutedTextClass}`}>
                {Object.values(cookiePreferences).filter(Boolean).length} of {Object.keys(cookiePreferences).length} categories enabled
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm rounded-xl border ${darkMode ? 'border-white/10' : 'border-black/10'} overflow-hidden transition-all duration-300`}>
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full p-6 text-left flex items-center justify-between hover:bg-${darkMode ? 'white/5' : 'black/5'} transition-colors cursor-pointer`}
              >
                <div className="flex items-center space-x-4">
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
          <h2 className={`text-2xl font-bold ${textClass} mb-6 text-center`}>Questions About Our Cookie Policy?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Mail className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className={`font-semibold ${textClass}`}>Email</p>
              <p className={mutedTextClass}>info@vais.co.in</p>
            </div>
            <div className="text-center">
              <Phone className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className={`font-semibold ${textClass}`}>Phone</p>
              <p className={mutedTextClass}>+91 8343939495</p>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className={`font-semibold ${textClass}`}>Address</p>
              <p className={mutedTextClass}>1Deganga, North 24 Parganas , Taki Road, WB, India</p>
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
              Your privacy and security are our top priorities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default CookiePolicy