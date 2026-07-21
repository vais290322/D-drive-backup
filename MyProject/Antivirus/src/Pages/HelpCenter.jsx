import React, { useState, useMemo } from 'react'
import { 
  Shield,
  Search,
  ArrowLeft,
  Eye,
  EyeOff,
  HelpCircle,
  Book,
  MessageCircle,
  PhoneCall,
  Mail,
  ChevronRight,
  FileText,
  Settings,
  AlertTriangle,
  Wifi,
  CheckCircle,
  Clock,
  Star,
  Download,
  Lock,
  Monitor,
  Smartphone,
  Globe,
  Users,
  Zap,
  Award,
  TrendingUp,
  Database,
  Video,
  FileSearch,
  Headphones,
  Calendar,
  MapPin,
  Timer,
  ThumbsUp,
  ExternalLink,
  Filter,
  X,
  ChevronDown,
  Plus,
  Minus
} from 'lucide-react'

const HelpCenter = () => {
  const [darkMode, setDarkMode] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFAQ, setExpandedFAQ] = useState({})

  const textClass = darkMode ? "text-white" : "text-gray-900"
  const mutedTextClass = darkMode ? "text-gray-400" : "text-gray-600"
  const cardBg = darkMode ? 'bg-black/20' : 'bg-white/80'
  const borderClass = darkMode ? 'border-white/10' : 'border-gray-200'

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      color: 'blue',
      description: 'Everything you need to start using SecureGuard',
      articleCount: 12,
      topics: [
        { title: 'Installation Guide', views: '15.2k', difficulty: 'Beginner' },
        { title: 'First-time Setup Wizard', views: '12.8k', difficulty: 'Beginner' },
        { title: 'Understanding the Dashboard', views: '9.4k', difficulty: 'Beginner' },
        { title: 'Running Your First Scan', views: '11.1k', difficulty: 'Beginner' },
        { title: 'Configuring Basic Settings', views: '7.3k', difficulty: 'Intermediate' }
      ]
    },
    {
      id: 'security-features',
      title: 'Security Features',
      icon: Shield,
      color: 'red',
      description: 'Learn about our advanced protection capabilities',
      articleCount: 18,
      topics: [
        { title: 'Real-time Protection Setup', views: '18.7k', difficulty: 'Intermediate' },
        { title: 'Firewall Configuration', views: '14.2k', difficulty: 'Advanced' },
        { title: 'Web Protection Settings', views: '16.9k', difficulty: 'Intermediate' },
        { title: 'Email Security Features', views: '8.8k', difficulty: 'Intermediate' },
        { title: 'Behavioral Analysis Explained', views: '6.1k', difficulty: 'Advanced' }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: AlertTriangle,
      color: 'yellow',
      description: 'Quick solutions to common problems',
      articleCount: 24,
      topics: [
        { title: 'Scan Performance Issues', views: '22.1k', difficulty: 'Intermediate' },
        { title: 'Update Problems & Solutions', views: '19.3k', difficulty: 'Beginner' },
        { title: 'False Positive Management', views: '13.7k', difficulty: 'Intermediate' },
        { title: 'License Activation Issues', views: '11.9k', difficulty: 'Beginner' },
        { title: 'System Compatibility Problems', views: '9.2k', difficulty: 'Advanced' }
      ]
    },
    {
      id: 'account-settings',
      title: 'Account & Settings',
      icon: Settings,
      color: 'green',
      description: 'Manage your account and customize preferences',
      articleCount: 15,
      topics: [
        { title: 'Account Management Portal', views: '14.5k', difficulty: 'Beginner' },
        { title: 'Subscription & Billing', views: '12.3k', difficulty: 'Beginner' },
        { title: 'Privacy & Data Settings', views: '10.8k', difficulty: 'Intermediate' },
        { title: 'Notification Preferences', views: '8.1k', difficulty: 'Beginner' },
        { title: 'Multi-device Management', views: '7.4k', difficulty: 'Intermediate' }
      ]
    },
    {
      id: 'mobile-support',
      title: 'Mobile Support',
      icon: Smartphone,
      color: 'purple',
      description: 'Help for mobile versions of SecureGuard',
      articleCount: 10,
      topics: [
        { title: 'Mobile App Installation', views: '13.2k', difficulty: 'Beginner' },
        { title: 'Cross-platform Sync', views: '9.7k', difficulty: 'Intermediate' },
        { title: 'Mobile Security Features', views: '11.4k', difficulty: 'Intermediate' },
        { title: 'Battery Optimization', views: '8.9k', difficulty: 'Beginner' },
        { title: 'Mobile Troubleshooting', views: '6.8k', difficulty: 'Intermediate' }
      ]
    },
    {
      id: 'network-security',
      title: 'Network Security',
      icon: Wifi,
      color: 'indigo',
      description: 'Protect your network and connected devices',
      articleCount: 14,
      topics: [
        { title: 'Home Network Protection', views: '16.8k', difficulty: 'Advanced' },
        { title: 'VPN Integration Guide', views: '12.5k', difficulty: 'Advanced' },
        { title: 'IoT Device Security', views: '9.9k', difficulty: 'Advanced' },
        { title: 'Public Wi-Fi Safety', views: '14.1k', difficulty: 'Intermediate' },
        { title: 'Network Monitoring Tools', views: '7.6k', difficulty: 'Advanced' }
      ]
    }
  ]

  const contactOptions = [
    {
      title: 'Live Chat Support',
      icon: MessageCircle,
      description: '24/7 instant support with real-time assistance',
      availability: 'Available 24/7',
      responseTime: '< 2 minutes',
      action: 'Start Live Chat',
      color: 'blue',
      features: ['Instant responses', 'Screen sharing', 'File transfer', 'Multi-language']
    },
    {
      title: 'Phone Support',
      icon: PhoneCall,
      description: 'Speak directly with our technical experts',
      availability: 'Mon-Sun: 6 AM - 10 PM EST',
      responseTime: 'Immediate',
      action: 'Call +91 83439 39495',
      color: 'green',
      features: ['Expert technicians', 'Remote assistance', 'Priority queue', 'Callback service']
    },
    {
      title: 'Email Support',
      icon: Mail,
      description: 'Detailed technical assistance via email',
      availability: 'Response within 4 hours',
      responseTime: '< 4 hours',
      action: 'Send Email',
      color: 'orange',
      features: ['Detailed responses', 'Screenshot support', 'Follow-up tracking', 'Priority handling']
    },
    {
      title: 'Remote Assistance',
      icon: Monitor,
      description: 'Let our experts fix issues directly on your device',
      availability: 'By appointment',
      responseTime: 'Scheduled',
      action: 'Schedule Session',
      color: 'purple',
      features: ['Direct problem solving', 'Secure connection', 'No software needed', 'Session recording']
    }
  ]

  const faqData = [
    {
      category: 'general',
      question: 'How do I install Vais SecureGuard on my computer?',
      answer: 'Download the installer from our official website, run it with administrator privileges, and follow the setup wizard. The process typically takes 5-10 minutes and includes automatic license activation.'
    },
    {
      category: 'technical',
      question: 'Why is my computer running slower after installation?',
      answer: 'Initial slowdown is normal during the first scan and indexing process. You can optimize performance by adjusting real-time scanning sensitivity in Settings > Performance, or scheduling scans during idle hours.'
    },
    {
      category: 'billing',
      question: 'How do I upgrade my subscription plan?',
      answer: 'Go to Account Settings > Subscription in the app, or log into your online account portal. You can upgrade instantly, and the new features will be activated immediately with prorated billing.'
    },
    {
      category: 'technical',
      question: 'What should I do if SecureGuard detects a false positive?',
      answer: 'Add the file to your exclusions list in Settings > Exclusions, then submit a false positive report through Help > Report False Positive. Our security team reviews all submissions within 24 hours.'
    },
    {
      category: 'general',
      question: 'Can I use SecureGuard on multiple devices?',
      answer: 'Yes! Depending on your plan, you can protect 3-10 devices. Install the app on each device and sign in with your account. All devices will sync protection settings and threat intelligence automatically.'
    },
    {
      category: 'technical',
      question: 'How often should I run full system scans?',
      answer: 'We recommend weekly full scans for optimal protection. You can schedule these during off-hours. Real-time protection handles daily threats, while full scans catch dormant or deeply hidden malware.'
    }
  ]

  const filteredCategories = useMemo(() => {
    if (selectedCategory === 'all') return helpCategories
    return helpCategories.filter(cat => cat.id === selectedCategory)
  }, [selectedCategory])

  const filteredTopics = useMemo(() => {
    if (!searchQuery) return []
    return helpCategories.flatMap(category => 
      category.topics.filter(topic => 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(topic => ({ ...topic, category: category.title, categoryColor: category.color }))
    )
  }, [searchQuery])

  const toggleFAQ = (index) => {
    setExpandedFAQ(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'text-green-400'
      case 'Intermediate': return 'text-yellow-400'
      case 'Advanced': return 'text-red-400'
      default: return 'text-gray-400'
    }
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
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.href = '/'}>
            <Shield className="w-10 h-10 text-red-500" />
            <div>
              <span className={`text-2xl font-bold ${textClass}`}>Vais SecureGuard</span>
              <div className="text-xs text-red-400 font-semibold">COMPREHENSIVE HELP CENTER</div>
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

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header & Search Section */}
        <div className="text-center mb-16">
          <h1 className={`text-5xl md:text-6xl font-bold ${textClass} mb-6 bg-gradient-to-r from-black to-gray-300 bg-clip-text text-transparent`}>
            How can we help you?
          </h1>
          <p className={`text-xl ${mutedTextClass} mb-8 max-w-3xl mx-auto`}>
            Find answers to your questions, learn about features, or get in touch with our expert support team
          </p>
          
          <div className="max-w-2xl mx-auto relative mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles, guides, or solutions..."
              className={`w-full p-4 pl-12 pr-12 rounded-xl border ${
                darkMode ? 'bg-black/20 border-white/10' : 'bg-white/20 border-black/10'
              } backdrop-blur-sm ${textClass} placeholder:${mutedTextClass} focus:outline-none focus:ring-2 focus:ring-red-500/50`}
            />
            <Search className={`w-5 h-5 ${mutedTextClass} absolute left-4 top-1/2 transform -translate-y-1/2`} />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className={`${mutedTextClass} hover:${textClass} absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 cursor-pointer rounded-lg font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-red-500 text-white'
                  : `${mutedTextClass} hover:${textClass} hover:bg-white/10`
              }`}
            >
              All Categories
            </button>
            {helpCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 cursor-pointer rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? `bg-${category.color}-500 text-white`
                    : `${mutedTextClass} hover:${textClass} hover:bg-white/10`
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && filteredTopics.length > 0 && (
          <div className={`${cardBg} backdrop-blur-sm p-6 rounded-xl border ${borderClass} mb-12`}>
            <h2 className={`text-2xl font-bold ${textClass} mb-6 flex items-center space-x-2`}>
              <FileSearch className="w-6 h-6 text-blue-400" />
              <span>Search Results ({filteredTopics.length})</span>
            </h2>
            <div className="grid gap-4">
              {filteredTopics.map((topic, index) => (
                <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} hover:shadow-md transition-all cursor-pointer group`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`text-${topic.categoryColor}-400 text-sm font-medium`}>
                        {topic.category}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className={getDifficultyColor(topic.difficulty)}>{topic.difficulty}</span>
                    </div>
                    <span className={`text-sm ${mutedTextClass}`}>{topic.views} views</span>
                  </div>
                  <h3 className={`text-lg font-semibold ${textClass} mt-2 group-hover:text-red-400 transition-colors`}>
                    {topic.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredCategories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <div
                key={index}
                className={`${cardBg} backdrop-blur-sm p-8 rounded-2xl border ${borderClass} hover:border-${category.color}-500/50 transition-all duration-300 cursor-pointer group hover:shadow-xl`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 rounded-xl group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <span className={`text-sm ${mutedTextClass} bg-${category.color}-500/20 px-3 py-1 rounded-full`}>
                    {category.articleCount} articles
                  </span>
                </div>
                
                <h3 className={`text-2xl font-bold ${textClass} mb-3 group-hover:text-${category.color}-400 transition-colors`}>
                  {category.title}
                </h3>
                <p className={`${mutedTextClass} mb-6 text-sm leading-relaxed`}>
                  {category.description}
                </p>
                
                <div className="space-y-3">
                  {category.topics.slice(0, 3).map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center justify-between group/item">
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm ${mutedTextClass} group-hover/item:text-${category.color}-400 transition-colors cursor-pointer`}>
                          {topic.title}
                        </span>
                        <span className={getDifficultyColor(topic.difficulty)}>
                          <span className="text-xs">•</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs ${mutedTextClass}`}>{topic.views}</span>
                        <ChevronRight className={`w-3 h-3 ${mutedTextClass} group-hover/item:text-${category.color}-400 transition-colors`} />
                      </div>
                    </div>
                  ))}
                  {category.topics.length > 3 && (
                    <button className={`text-sm text-${category.color}-400 hover:text-${category.color}-300 transition-colors font-medium`}>
                      View all {category.articleCount} articles →
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className={`${cardBg} backdrop-blur-sm p-8 rounded-2xl border ${borderClass} mb-16`}>
          <h2 className={`text-3xl font-bold ${textClass} mb-8 text-center`}>
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className={`border ${borderClass} rounded-xl overflow-hidden`}>
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full p-6 text-left flex cursor-pointer items-center justify-between hover:bg-white/5 transition-colors`}
                >
                  <span className={`font-semibold ${textClass}`}>{faq.question}</span>
                  {expandedFAQ[index] ? 
                    <Minus className={`w-5 h-5 ${mutedTextClass}`} /> : 
                    <Plus className={`w-5 h-5 ${mutedTextClass}`} />
                  }
                </button>
                {expandedFAQ[index] && (
                  <div className={`px-6 pb-6 ${mutedTextClass} leading-relaxed animate-in slide-in-from-top-1 duration-200`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Options */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold ${textClass} mb-8 text-center`}>
            Get Personal Support
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactOptions.map((option, index) => {
              const IconComponent = option.icon
              return (
                <div
                  key={index}
                  className={`${cardBg} backdrop-blur-sm p-6 rounded-2xl border ${borderClass} hover:shadow-xl transition-all duration-300 group`}
                >
                  <div className={`p-3 bg-gradient-to-r from-${option.color}-500 to-${option.color}-600 rounded-xl mb-4 group-hover:scale-110 transition-transform w-fit`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold ${textClass} mb-2`}>{option.title}</h3>
                  <p className={`${mutedTextClass} text-sm mb-4 leading-relaxed`}>{option.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-green-400" />
                      <span className={`text-sm ${mutedTextClass}`}>{option.availability}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Timer className="w-4 h-4 text-blue-400" />
                      <span className={`text-sm ${mutedTextClass}`}>Response: {option.responseTime}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {option.features.slice(0, 2).map((feature, featureIndex) => (
                        <span key={featureIndex} className={`text-xs px-2 py-1 bg-${option.color}-500/20 text-${option.color}-400 rounded-full`}>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className={`w-full py-3 px-4 bg-gradient-to-r from-${option.color}-500 to-${option.color}-600 hover:from-${option.color}-600 hover:to-${option.color}-700 text-white rounded-lg transition-all duration-300 font-semibold transform hover:scale-105`}>
                    {option.action}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Support Stats */}
        <div className={`${cardBg} backdrop-blur-sm p-8 rounded-2xl border ${borderClass}`}>
          <h3 className={`text-2xl font-bold ${textClass} mb-8 text-center`}>
            Support Excellence Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mb-4 mx-auto w-fit">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className={`text-3xl font-bold ${textClass} mb-1`}>99.9%</div>
              <div className={`text-sm ${mutedTextClass}`}>Service Uptime</div>
            </div>
            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-4 mx-auto w-fit">
                <Timer className="w-8 h-8 text-white" />
              </div>
              <div className={`text-3xl font-bold ${textClass} mb-1`}> 2min</div>
              <div className={`text-sm ${mutedTextClass}`}>Avg Chat Response</div>
            </div>
            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl mb-4 mx-auto w-fit">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className={`text-3xl font-bold ${textClass} mb-1`}>4.9/5</div>
              <div className={`text-sm ${mutedTextClass}`}>Support Rating</div>
            </div>
            <div className="text-center">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4 mx-auto w-fit">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className={`text-3xl font-bold ${textClass} mb-1`}>50k+</div>
              <div className={`text-sm ${mutedTextClass}`}>Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenter