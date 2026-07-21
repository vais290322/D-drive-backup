import React, { useState } from 'react'
import { 
  Shield,
  Book,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Settings,
  Lock,
  Scan,
  RefreshCw,
  Bell,
  Download,
  Monitor,
  Database,
  Wifi,
  Search,
  FileX,
  Activity,
  Globe,
  Smartphone,
  HelpCircle,
  Star,
  Zap,
  Cloud,
  Timer,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

const UserGuide = () => {
  const [darkMode, setDarkMode] = useState(true)
  const [expandedSections, setExpandedSections] = useState({})
  const [activeTab, setActiveTab] = useState('getting-started')

  const textClass = darkMode ? "text-white" : "text-gray-900"
  const mutedTextClass = darkMode ? "text-gray-400" : "text-gray-600"
  const cardBg = darkMode ? 'bg-black/20' : 'bg-white/80'
  const borderClass = darkMode ? 'border-white/10' : 'border-gray-200'

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const tabs = [
    { id: 'getting-started', label: 'Getting Started', icon: Download },
    { id: 'features', label: 'Features', icon: Shield },
    { id: 'security', label: 'Security Guide', icon: Lock },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: Settings },
    { id: 'support', label: 'Support', icon: HelpCircle }
  ]

  const guideContent = {
    gettingStarted: [
      {
        id: 'installation',
        title: 'Installation & Setup',
        icon: Download,
        description: 'Get started with Vais SecureGuard in just a few steps',
        steps: [
          'Download the app from official store or our website',
          'Run the installer with administrator privileges',
          'Accept license agreement and choose installation directory',
          'Grant required system permissions for real-time protection',
          'Complete initial setup wizard with your preferences',
          'Activate your license key or start free trial',
          'Run initial system scan to establish baseline security'
        ],
        tips: [
          'Ensure your system meets minimum requirements',
          'Temporarily disable other antivirus software during installation',
          'Create a system restore point before installation'
        ]
      },
      {
        id: 'first-scan',
        title: 'Your First Security Scan',
        icon: Scan,
        description: 'Learn how to run your first comprehensive security scan',
        steps: [
          'Launch Vais SecureGuard from desktop or start menu',
          'Navigate to the "Scan" section in the main dashboard',
          'Choose "Full System Scan" for comprehensive protection',
          'Review scan settings and customize if needed',
          'Click "Start Scan" and monitor progress',
          'Review scan results and take recommended actions',
          'Schedule regular automatic scans for ongoing protection'
        ],
        tips: [
          'First scan may take 30-60 minutes depending on system size',
          'Close unnecessary applications for faster scanning',
          'Don\'t interrupt the scan process for accurate results'
        ]
      }
    ],
    features: [
      {
        id: 'real-time-protection',
        title: 'Real-time Protection',
        icon: Shield,
        description: 'Always-on security monitoring for instant threat detection',
        steps: [
          'Enable real-time scanning in Protection settings',
          'Configure sensitivity levels (Balanced recommended)',
          'Set up file system monitoring for all drives',
          'Enable web protection for browser security',
          'Configure email attachment scanning',
          'Set exclusions for trusted applications if needed',
          'Monitor protection status in system tray'
        ],
        advanced: [
          'Behavioral analysis for zero-day threat detection',
          'Heuristic scanning for unknown malware variants',
          'Cloud-based threat intelligence integration',
          'Machine learning threat pattern recognition'
        ]
      },
      {
        id: 'firewall',
        title: 'Advanced Firewall',
        icon: Globe,
        description: 'Network traffic monitoring and intrusion prevention',
        steps: [
          'Access Firewall settings from main menu',
          'Enable intelligent firewall protection',
          'Configure network profiles (Home, Work, Public)',
          'Set up application rules for network access',
          'Enable intrusion detection and prevention',
          'Configure port blocking and monitoring',
          'Review firewall logs regularly'
        ],
        advanced: [
          'Deep packet inspection for advanced threats',
          'Geo-blocking for region-specific protection',
          'Bandwidth monitoring and control',
          'VPN traffic analysis and protection'
        ]
      },
      {
        id: 'web-protection',
        title: 'Web & Email Security',
        icon: Monitor,
        description: 'Comprehensive protection for online activities',
        steps: [
          'Install browser extensions for all browsers',
          'Enable safe browsing and phishing protection',
          'Configure email scanning for attachments',
          'Set up parental controls if needed',
          'Enable anti-tracking and privacy protection',
          'Configure safe search settings',
          'Review blocked threats regularly'
        ],
        advanced: [
          'Banking protection for financial transactions',
          'Identity theft protection monitoring',
          'Social media privacy scanning',
          'Cryptocurrency wallet protection'
        ]
      }
    ],
    security: [
      {
        id: 'password-manager',
        title: 'Password Management',
        icon: Lock,
        description: 'Secure password generation and storage',
        steps: [
          'Set up master password for password vault',
          'Import existing passwords from browsers',
          'Generate strong passwords for all accounts',
          'Enable auto-fill for secure login',
          'Set up two-factor authentication where possible',
          'Regular password strength audits',
          'Secure sharing of passwords with family'
        ]
      },
      {
        id: 'privacy-tools',
        title: 'Privacy Protection',
        icon: Eye,
        description: 'Advanced tools to protect your digital privacy',
        steps: [
          'Enable privacy cleaner for browser data',
          'Configure file shredder for secure deletion',
          'Set up webcam and microphone protection',
          'Enable Wi-Fi security scanning',
          'Configure data breach monitoring',
          'Set up identity monitoring alerts',
          'Review app permissions regularly'
        ]
      }
    ],
    troubleshooting: [
      {
        id: 'common-issues',
        title: 'Common Issues & Solutions',
        icon: Settings,
        description: 'Quick fixes for frequent problems',
        issues: [
          {
            problem: 'Slow system performance after installation',
            solutions: [
              'Adjust real-time scanning sensitivity',
              'Configure scan scheduling during idle time',
              'Add trusted applications to exclusions',
              'Update to latest version for performance improvements'
            ]
          },
          {
            problem: 'False positive detections',
            solutions: [
              'Submit false positive report to our lab',
              'Add trusted files to whitelist',
              'Adjust heuristic sensitivity settings',
              'Update virus definitions regularly'
            ]
          },
          {
            problem: 'License activation issues',
            solutions: [
              'Check internet connection stability',
              'Verify license key accuracy',
              'Contact support for manual activation',
              'Clear activation cache and retry'
            ]
          }
        ]
      },
      {
        id: 'performance-tips',
        title: 'Performance Optimization',
        icon: Zap,
        description: 'Tips to maintain optimal system performance',
        tips: [
          'Schedule full scans during off-hours',
          'Use quick scan for daily checks',
          'Keep exclusion lists minimal and updated',
          'Enable game mode for uninterrupted gaming',
          'Regular system cleanup and optimization',
          'Monitor resource usage in task manager'
        ]
      }
    ],
    support: [
      {
        id: 'contact-options',
        title: 'Contact Support',
        icon: MessageCircle,
        description: 'Multiple ways to get help when you need it',
        options: [
          { method: '24/7 Live Chat', icon: MessageCircle, description: 'Instant help from our support team' },
          { method: 'Phone Support', icon: Phone, description: 'Speak directly with technical experts' },
          { method: 'Email Support', icon: Mail, description: 'Detailed assistance via email' },
          { method: 'Remote Assistance', icon: Monitor, description: 'Screen sharing for complex issues' }
        ]
      },
      {
        id: 'resources',
        title: 'Additional Resources',
        icon: Book,
        description: 'Helpful resources for learning and troubleshooting',
        resources: [
          { name: 'Video Tutorials', url: '#', description: 'Step-by-step video guides' },
          { name: 'Knowledge Base', url: '#', description: 'Comprehensive help articles' },
          { name: 'Community Forum', url: '#', description: 'Connect with other users' },
          { name: 'Security Blog', url: '#', description: 'Latest security news and tips' }
        ]
      }
    ]
  }

  const renderContent = () => {
    const content = guideContent[activeTab.replace('-', '').replace('getting', 'getting').replace('started', 'Started')]
    
    if (!content) return null

    return (
      <div className="space-y-8">
        {content.map((section, index) => {
          const isExpanded = expandedSections[section.id] !== false
          const IconComponent = section.icon
          
          return (
            <div key={index} className={`${cardBg} backdrop-blur-sm p-8 rounded-2xl border ${borderClass} transition-all duration-300 hover:shadow-lg`}>
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${textClass}`}>{section.title}</h3>
                    <p className={`text-sm ${mutedTextClass} mt-1`}>{section.description}</p>
                  </div>
                </div>
                {isExpanded ? 
                  <ChevronDown className={`w-5 h-5 ${mutedTextClass}`} /> : 
                  <ChevronRight className={`w-5 h-5 ${mutedTextClass}`} />
                }
              </div>

              {isExpanded && (
                <div className="mt-8 animate-in slide-in-from-top-2 duration-300">
                  {/* Steps */}
                  {section.steps && (
                    <div className="mb-6">
                      <h4 className={`text-lg font-semibold ${textClass} mb-4 flex items-center space-x-2`}>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span>Step-by-Step Guide</span>
                      </h4>
                      <ul className="grid gap-3">
                        {section.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className={`flex items-start space-x-3 p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-sm font-bold rounded-full flex-shrink-0 mt-0.5">
                              {stepIndex + 1}
                            </span>
                            <span className={mutedTextClass}>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Advanced Features */}
                  {section.advanced && (
                    <div className="mb-6">
                      <h4 className={`text-lg font-semibold ${textClass} mb-4 flex items-center space-x-2`}>
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span>Advanced Features</span>
                      </h4>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {section.advanced.map((feature, featureIndex) => (
                          <li key={featureIndex} className={`flex items-start space-x-3 p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                            <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
                            <span className={`text-sm ${mutedTextClass}`}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tips */}
                  {section.tips && (
                    <div className="mb-6">
                      <h4 className={`text-lg font-semibold ${textClass} mb-4 flex items-center space-x-2`}>
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                        <span>Pro Tips</span>
                      </h4>
                      <ul className="space-y-2">
                        {section.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className={`flex items-start space-x-3 p-3 rounded-lg ${darkMode ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
                            <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                            <span className={`text-sm ${mutedTextClass}`}>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Issues (for troubleshooting) */}
                  {section.issues && (
                    <div className="space-y-4">
                      {section.issues.map((issue, issueIndex) => (
                        <div key={issueIndex} className={`p-4 rounded-lg border ${darkMode ? 'bg-red-900/20 border-red-500/20' : 'bg-red-50 border-red-200'}`}>
                          <h5 className={`font-semibold ${textClass} mb-3`}>{issue.problem}</h5>
                          <ul className="space-y-2">
                            {issue.solutions.map((solution, solutionIndex) => (
                              <li key={solutionIndex} className={`flex items-start space-x-3 text-sm ${mutedTextClass}`}>
                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <span>{solution}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Support Options */}
                  {section.options && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {section.options.map((option, optionIndex) => {
                        const OptionIcon = option.icon
                        return (
                          <div key={optionIndex} className={`p-4 rounded-lg border ${darkMode ? 'bg-blue-900/20 border-blue-500/20' : 'bg-blue-50 border-blue-200'} hover:shadow-md transition-shadow cursor-pointer`}>
                            <div className="flex items-center space-x-3 mb-2">
                              <OptionIcon className="w-5 h-5 text-blue-400" />
                              <h5 className={`font-semibold ${textClass}`}>{option.method}</h5>
                            </div>
                            <p className={`text-sm ${mutedTextClass}`}>{option.description}</p>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Resources */}
                  {section.resources && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {section.resources.map((resource, resourceIndex) => (
                        <div key={resourceIndex} className={`p-4 rounded-lg border ${darkMode ? 'bg-green-900/20 border-green-500/20' : 'bg-green-50 border-green-200'} hover:shadow-md transition-shadow cursor-pointer group`}>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className={`font-semibold ${textClass} group-hover:text-green-400 transition-colors`}>{resource.name}</h5>
                            <ExternalLink className="w-4 h-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className={`text-sm ${mutedTextClass}`}>{resource.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-red-900 to-slate-800' 
        : 'bg-gradient-to-br from-gray-50 via-red-50 to-gray-100'
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={()=> window.history.back()}>
            <Shield className="w-10 h-10 text-red-500" />
            <div>
              <span className={`text-2xl font-bold ${textClass}`}>Vais SecureGuard</span>
              <div className="text-xs text-red-400 font-semibold">COMPREHENSIVE USER GUIDE</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${mutedTextClass} hover:${textClass} transition-colors cursor-pointer`}
            >
              {darkMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            
            <button 
              onClick={() => window.history.back()}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${mutedTextClass} hover:${textClass} hover:bg-white/10 transition-all cursor-pointer`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-5xl md:text-6xl font-bold ${textClass} mb-6 bg-gradient-to-r from-black to-gray-300 bg-clip-text text-transparent`}>
            Complete User Guide
          </h1>
          <p className={`text-xl ${mutedTextClass} max-w-4xl mx-auto leading-relaxed`}>
            Master every aspect of Vais SecureGuard with our comprehensive guide. From basic setup to advanced security features, we've got you covered.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map(tab => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center cursor-pointer space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                    : `${mutedTextClass} hover:${textClass} hover:bg-white/10`
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        {renderContent()}

        {/* Emergency Support */}
        <div className="mt-20 text-center">
          <div className={`inline-block ${cardBg} backdrop-blur-sm p-8 rounded-2xl border ${borderClass} max-w-2xl`}>
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Phone className="w-6 h-6 text-red-500" />
              <h3 className={`text-2xl font-bold ${textClass}`}>Need Immediate Help?</h3>
            </div>
            <p className={`${mutedTextClass} mb-6 leading-relaxed`}>
              Our expert support team is available 24/7 to help you with any security concerns or technical issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                Start Live Chat
              </button>
              <button className={`px-8 py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 font-semibold`}>
                Call Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 

export default UserGuide