import React, { useState } from 'react'
import { 
  Shield,
  Download,
  Check,
  X,
  ChevronRight,
  Users,
  Star,
  Zap,
  Lock,
  Cloud,
  Settings,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Twitter,
  Facebook,
  Instagram,
  Linkedin
} from 'lucide-react'
import { useNavigate } from 'react-router'

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('yearly')
  const navigate = useNavigate()

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Basic protection for personal use',
      features: [
        'Real-time virus scanning',
        'Basic firewall protection',
        'App permission control',
        'Performance optimization',
      ],
      limitations: [
        'Limited scan frequency',
        'Basic threat detection',
        'No VPN service',
        'No cloud backup',
      ],
      buttonText: 'Download Free',
      recommended: false,
      color: 'blue'
    },
    {
      name: 'Pro',
      price: { monthly: 4.99, yearly: 49.99 },
      description: 'Advanced protection for power users',
      features: [
        'Everything in Free plan',
        'Advanced malware detection',
        'Unlimited device scanning',
        'Privacy guard & app lock',
        'Basic VPN service',
        '5GB cloud backup',
        '24/7 email support'
      ],
      buttonText: 'Get Pro',
      recommended: true,
      color: 'red'
    },
    {
      name: 'Enterprise',
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'Complete protection for businesses',
      features: [
        'Everything in Pro plan',
        'AI-powered threat detection',
        'Unlimited VPN service',
        '50GB cloud backup',
        'Priority support 24/7',
        'Remote device management',
        'Custom security policies',
        'Advanced reporting'
      ],
      buttonText: 'Contact Sales',
      recommended: false,
      color: 'purple'
    }
  ]

  const features = [
    {
      title: 'Security Features',
      items: [
        'Real-time virus scanning',
        'Malware protection',
        'Firewall security',
        'App permission control',
        'Privacy guard',
        'VPN service'
      ]
    },
    {
      title: 'Performance',
      items: [
        'Device optimization',
        'Battery saver',
        'Memory booster',
        'Storage cleaner',
        'App manager',
        'Performance monitoring'
      ]
    },
    {
      title: 'Support',
      items: [
        'Email support',
        'Phone support',
        'Live chat',
        'Priority response',
        'Remote assistance',
        'Training sessions'
      ]
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-600 to-cyan-600',
      red: 'from-red-600 to-orange-600',
      purple: 'from-purple-600 to-indigo-600'
    }
    return colors[color] || colors.blue
  }

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
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/about')}>
            <div className="relative cursor-pointer">
              <Shield className="w-10 h-10 text-red-500" />
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Vais SecureGuard</span>
              <div className="text-xs text-red-400 font-semibold">PRICING PLANS</div>
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
              Simple, Transparent
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Pricing Plans
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your security needs. All plans include our core protection features.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
              Monthly billing
            </span>
            <button 
              onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 rounded-full bg-gradient-to-r from-red-600 to-orange-600 p-1 transition-all duration-200"
            >
              <div 
                className={`w-6 h-6 rounded-full bg-white transform transition-transform duration-200 ${
                  billingPeriod === 'yearly' ? 'translate-x-8' : ''
                }`}
              ></div>
            </button>
            <span className={`text-sm ${billingPeriod === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
              Yearly billing
              <span className="ml-2 text-xs text-red-400 font-semibold">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative z-30 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`relative backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8 ${
                  plan.recommended ? 'transform scale-105' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">
                      ${billingPeriod === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="text-gray-400">
                      /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  <button className={`w-full bg-gradient-to-r ${getColorClasses(plan.color)} text-white px-6 py-3 rounded-full hover:opacity-90 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2`}>
                    <span>{plan.buttonText}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-semibold text-white mb-2">Included features:</div>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 text-gray-300">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {plan.limitations && (
                    <>
                      <div className="text-sm font-semibold text-white mt-4 mb-2">Limitations:</div>
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center space-x-3 text-gray-400">
                          <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                          <span>{limitation}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="relative z-30 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Compare Plan Features
            </h2>
            <p className="text-gray-300">
              Detailed comparison of features across all plans
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((category, index) => (
              <div key={index} className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8">
                <h3 className="text-xl font-bold text-white mb-6">{category.title}</h3>
                <div className="space-y-4">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-gray-300">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-30 px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-300">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-8">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8">
              <h3 className="text-xl font-bold text-white mb-4">Can I change plans later?</h3>
              <p className="text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8">
              <h3 className="text-xl font-bold text-white mb-4">Is there a money-back guarantee?</h3>
              <p className="text-gray-300">
                Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.
              </p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8">
              <h3 className="text-xl font-bold text-white mb-4">What payment methods do you accept?</h3>
              <p className="text-gray-300">
                We accept all major credit cards, PayPal, and wire transfers for enterprise plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-30 px-6 py-24 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Need Help Choosing?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Our security experts are here to help you find the perfect plan for your needs
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8">
              <Mail className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
              <p className="text-gray-400">support@vaisguard.com</p>
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8">
              <MessageCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
              <p className="text-gray-400">Available 24/7</p>
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8">
              <Phone className="w-8 h-8 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Phone</h3>
              <p className="text-gray-400">1-800-SECURE</p>
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
                <li onClick={() => navigate('/terms-of-service')} className='cursor-pointer' >Terms of Service</li>
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

export default Pricing