import React, { useState, useEffect } from 'react'
import { 
  ArrowRight, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  Globe, 
  Sparkles, 
  ChevronDown,
  Play,
  CheckCircle,
  Award,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react'
import { useNavigate } from 'react-router'

const Home = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    { icon: Zap, title: "Lightning Fast", desc: "Optimized for speed and performance" },
    { icon: Shield, title: "Secure & Safe", desc: "Enterprise-grade security protocols" },
    { icon: Users, title: "Team Collaboration", desc: "Work together seamlessly" },
    { icon: Globe, title: "Global Reach", desc: "Available worldwide, 24/7" }
  ]

  const stats = [
    { number: "1M+", label: "Active Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "150+", label: "Countries" },
    { number: "24/7", label: "Support" }
  ]

  const testimonials = [
    { name: "Karfa", role: "CEO, TechCorp", content: "This platform transformed how we work. Incredible results!" },
    { name: "Marcus Johnson", role: "Designer", content: "The user experience is absolutely phenomenal. Love it!" },
    { name: "Elena Rodriguez", role: "Startup Founder", content: "Game-changing solution for our growing business." }
  ]

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Tech<span className="text-pink-400">Hub</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button className="text-gray-300 hover:text-white transition-colors cursor-pointer" onClick={()=>navigate('/offline')}>Offline Test</button>
            <button className="text-gray-300 hover:text-white transition-colors">Pricing</button>
            <button onClick={()=>navigate('/about')} className="text-gray-300 hover:text-white transition-colors cursor-pointer ">About</button>
            <button className="text-gray-300 hover:text-white transition-colors">Contact</button>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={()=>navigate('/login')} className="text-gray-300 hover:text-white transition-colors cursor-pointer ">Sign In</button>
            <button onClick={()=>navigate('/signup')} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 cursor-pointer ">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-40 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                The Future
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                Starts Here
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the next generation of digital innovation. 
              Join millions who've already transformed their workflow with our cutting-edge platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <button className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-xl">
                Start Free Trial
                <ArrowRight className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group flex items-center space-x-2 text-white border-2 border-white/20 px-8 py-4 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/50" />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-30 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to succeed, built with cutting-edge technology and designed for the future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transform hover:scale-105 transition-all duration-500 ${
                  activeFeature === index ? 'ring-2 ring-purple-500 bg-white/10' : ''
                }`}
              >
                <div className="mb-6">
                  <feature.icon className="w-12 h-12 text-purple-400 group-hover:text-pink-400 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-30 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of satisfied customers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group p-8 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transform hover:scale-105 transition-all duration-500"
              >
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-30 px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl border border-white/20 p-12">
            <Award className="w-16 h-16 text-purple-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the revolution today. No credit card required, cancel anytime.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-xl">
                Start Your Journey
                <Sparkles className="inline ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
              
              <button className="text-white border-2 border-white/20 px-8 py-4 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                Learn More
              </button>
            </div>

            <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-30 px-6 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Tech<span className="text-pink-400">Hub</span>
            </span>
              </div>
              <p className="text-gray-400 mb-6">
                Building the future of digital experiences, one innovation at a time.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="space-y-3">
                <button className="block text-gray-400 hover:text-white transition-colors">Features</button>
                <button className="block text-gray-400 hover:text-white transition-colors">Pricing</button>
                <button className="block text-gray-400 hover:text-white transition-colors">Enterprise</button>
                <button className="block text-gray-400 hover:text-white transition-colors">API</button>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <div className="space-y-3">
                <button className="block text-gray-400 hover:text-white transition-colors">About</button>
                <button className="block text-gray-400 hover:text-white transition-colors">Careers</button>
                <button className="block text-gray-400 hover:text-white transition-colors">Press</button>
                <button className="block text-gray-400 hover:text-white transition-colors">Blog</button>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <div className="space-y-3">
                <button className="block text-gray-400 hover:text-white transition-colors">Help Center</button>
                <button className="block text-gray-400 hover:text-white transition-colors">Community</button>
                <button className="block text-gray-400 hover:text-white transition-colors">Contact</button>
                <button className="block text-gray-400 hover:text-white transition-colors">Status</button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Karfa. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Terms</button>
              <button className="hover:text-white transition-colors">Cookies</button>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.1;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 0.3;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default Home