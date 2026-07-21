import React, { useState } from 'react'
import { 
  Shield,
  Download,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Book,
  User,
  Users,
  PlayCircle,
  FileText,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  ChevronRight,
  Clock,
  Star
} from 'lucide-react'
import { useNavigate } from 'react-router'

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const categories = [
    {
      title: 'Getting Started',
      icon: Book,
      color: 'blue',
      articles: [
        'Quick start guide',
        'Installation guide',
        'System requirements',
        'First scan setup'
      ]
    },
    {
      title: 'Account Management',
      icon: User,
      color: 'green',
      articles: [
        'Managing your subscription',
        'Password reset',
        'Device management',
        'Billing issues'
      ]
    },
    {
      title: 'Security Features',
      icon: Shield,
      color: 'red',
      articles: [
        'Real-time protection',
        'VPN setup guide',
        'Firewall configuration',
        'Privacy settings'
      ]
    },
    {
      title: 'Performance',
      icon: Clock,
      color: 'purple',
      articles: [
        'Optimization tips',
        'Battery saving guide',
        'Storage cleanup',
        'Memory management'
      ]
    }
  ]

  const faqs = [
    {
      question: 'How do I install Vais SecureGuard?',
      answer: 'Download the installer from our website and follow the step-by-step installation wizard. The process typically takes less than 5 minutes.'
    },
    {
      question: 'Is my data safe with Vais SecureGuard?',
      answer: 'Yes, we use military-grade encryption and follow strict privacy policies. We never collect or share your personal data without consent.'
    },
    {
      question: 'How often should I run a scan?',
      answer: 'While real-time protection is always active, we recommend running a full system scan at least once a week for optimal security.'
    },
    {
      question: 'Can I use Vais SecureGuard on multiple devices?',
      answer: 'Yes, depending on your subscription plan. The Pro plan supports up to 5 devices, while Enterprise allows unlimited devices.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 border-b border-white/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
              <Shield className="w-10 h-10 text-red-500" />
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Vais SecureGuard</span>
              <div className="text-xs text-red-400 font-semibold">SUPPORT CENTER</div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigate('/features')} className="text-gray-300 hover:text-white transition-colors">Features</button>
            <button onClick={() => navigate('/pricing')} className="text-gray-300 hover:text-white transition-colors">Pricing</button>
            <button onClick={() => navigate('/support')} className="text-gray-300 hover:text-white transition-colors">Support</button>
            <button onClick={() => navigate('/reviews')} className="text-gray-300 hover:text-white transition-colors">Reviews</button>
          </div>

          <button className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-full hover:from-red-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Now</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-40 px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
              How can we help
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              you today?
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Search our knowledge base or browse common topics below
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles..."
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-xl"
            />
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="relative z-30 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <div key={category.title} className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-200 cursor-pointer">
                <category.icon className={`w-12 h-12 mb-6 ${
                  category.color === 'blue' ? 'text-blue-400' :
                  category.color === 'green' ? 'text-green-400' :
                  category.color === 'red' ? 'text-red-400' :
                  'text-purple-400'
                }`} />
                <h3 className="text-xl font-bold text-white mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.articles.map((article) => (
                    <li key={article} className="text-gray-300 hover:text-white flex items-center space-x-2">
                      <ChevronRight className="w-4 h-4" />
                      <span>{article}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="relative z-30 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Video Tutorials
            </h2>
            <p className="text-gray-300">
              Learn how to get the most out of Vais SecureGuard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((video) => (
              <div key={video} className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden group cursor-pointer">
                <div className="relative aspect-video bg-black/50">
                  <PlayCircle className="absolute inset-0 m-auto w-16 h-16 text-white opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Getting Started Tutorial {video}</h3>
                  <p className="text-gray-400 text-sm">Learn the basics of setting up and using Vais SecureGuard</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="relative z-30 px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-300">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8">
                <h3 className="text-xl font-bold text-white mb-4">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="relative z-30 px-6 py-24 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Still Need Help?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Our support team is here for you 24/7
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-200 cursor-pointer">
              <Mail className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
              <p className="text-gray-400">support@vaisguard.com</p>
              <p className="text-sm text-gray-500 mt-2">Response within 24 hours</p>
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-200 cursor-pointer">
              <MessageCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
              <p className="text-gray-400">Available 24/7</p>
              <p className="text-sm text-gray-500 mt-2">Average response time: 5 min</p>
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-200 cursor-pointer">
              <Phone className="w-8 h-8 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Phone Support</h3>
              <p className="text-gray-400">1-800-SECURE</p>
              <p className="text-sm text-gray-500 mt-2">Mon-Fri, 9am-6pm EST</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-30 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-8 h-8 text-red-500" />
                <span className="text-xl font-bold text-white">Vais SecureGuard</span>
              </div>
              <p className="text-gray-400 text-sm">
                Leading the way in mobile security and device optimization with advanced AI technology.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Real-Time Protection</li>
                <li>Privacy Guard</li>
                <li>Network Security</li>
                <li>Performance Boost</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>About Us</li>
                <li>Contact</li>
                <li>Blog</li>
                <li>Careers</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                 <li onClick={() => navigate('/privacy-policy')} className='cursor-pointer' >Privacy Policy</li>
                <li onClick={() => navigate('/terms-of-service')}  className='cursor-pointer' >Terms of Service</li>
                <li onClick={() => navigate('/cookie-policy')} className='cursor-pointer' >Cookie Policy</li>
                <li onClick={() => navigate('/gdpr-compliance')} className='cursor-pointer' >GDPR Compliance</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Vais SecureGuard. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Support