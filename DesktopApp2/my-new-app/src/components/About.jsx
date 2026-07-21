import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  Zap, 
  Eye, 
  Wifi, 
  Download, 
  Star, 
  CheckCircle, 
  AlertTriangle, 
  Globe, 
  Users, 
  Award, 
  Play, 
  ArrowRight,
  Scan,
  RefreshCw,
  ShieldAlert,
  ShieldX,
  Battery,
  Settings,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react'
import { useNavigate } from 'react-router'

const About = () => {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [threatsFound, setThreatsFound] = useState(0)
  const [activeTab, setActiveTab] = useState('real-time')

  useEffect(() => {
    let interval
    if (isScanning) {
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            setIsScanning(false)
            setThreatsFound(Math.floor(Math.random() * 5))
            return 100
          }
          return prev + 2
        })
      }, 50)
    }
    return () => clearInterval(interval)
  }, [isScanning])

  const startScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    setThreatsFound(0)
  }

  const navigate = useNavigate()

  const features = [
    {
      id: 'real-time',
      icon: ShieldCheck,
      title: 'Real-Time Protection',
      desc: 'Advanced AI-powered scanning that monitors your device 24/7',
      details: ['Instant threat detection', 'Cloud-based analysis', 'Zero-day protection', 'Behavioral analysis']
    },
    {
      id: 'privacy',
      icon: Eye,
      title: 'Privacy Shield',
      desc: 'Protect your personal data from prying eyes and malicious apps',
      details: ['App permission monitor', 'Data breach alerts', 'Privacy advisor', 'Secure browsing']
    },
    {
      id: 'wifi',
      icon: Wifi,
      title: 'WiFi Security',
      desc: 'Secure your connections on public networks and unsafe hotspots',
      details: ['Network vulnerability scan', 'VPN integration', 'Safe browsing alerts', 'Connection encryption']
    },
    {
      id: 'performance',
      icon: Zap,
      title: 'Performance Boost',
      desc: 'Optimize your device while maintaining top-level security',
      details: ['Junk file cleanup', 'RAM optimization', 'Battery saver mode', 'App manager']
    }
  ]

  const stats = [
    { icon: Users, number: '50M+', label: 'Protected Users' },
    { icon: ShieldCheck, number: '99.8%', label: 'Detection Rate' },
    { icon: Globe, number: '200+', label: 'Countries' },
    { icon: Award, number: '#1', label: 'Security Rating' }
  ]

  const testimonials = [
    {
      name: 'David Kim',
      role: 'IT Professional',
      rating: 5,
      comment: 'Best mobile antivirus I\'ve used. Caught malware that others missed!',
      avatar: 'DK'
    },
    {
      name: 'Sarah Martinez',
      role: 'Business Owner',
      rating: 5,
      comment: 'Perfect balance of security and performance. Highly recommend!',
      avatar: 'SM'
    },
    {
      name: 'Alex Johnson',
      role: 'Tech Enthusiast',
      rating: 5,
      comment: 'Incredible features and the UI is absolutely beautiful.',
      avatar: 'AJ'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Security Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {[...Array(400)].map((_, i) => (
            <div key={i} className="border border-white/10"></div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
              <Shield className="w-10 h-10 text-red-500" />
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
            </div>
            <div  >
              <span className="text-2xl font-bold text-white">SecureGuard</span>
              <div className="text-xs text-red-400 font-semibold">MOBILE ANTIVIRUS</div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigate('/features')} className="text-gray-300 hover:text-white transition-colors  cursor-pointer ">Features</button>
            <button onClick={() => navigate('/pricing')} className="text-gray-300 hover:text-white transition-colors cursor-pointer ">Pricing</button>
            <button onClick={() => navigate('/support')} className="text-gray-300 hover:text-white transition-colors cursor-pointer ">Support</button>
            <button onClick={() => navigate('/reviews')} className="text-gray-300 hover:text-white transition-colors cursor-pointer ">Reviews</button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-full hover:from-red-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download Free</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-40 px-6 pt-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-red-400">
                  <ShieldAlert className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Ultimate Protection</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="text-white">Your Mobile</span>
                  <br />
                  <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                    Fortress
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                  Advanced AI-powered antivirus protection that keeps your mobile device safe from malware, 
                  phishing attacks, and privacy breaches. Experience military-grade security in your pocket.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button className="group bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-red-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download Now - Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="group flex items-center space-x-2 text-white border-2 border-white/20 px-6 py-3 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                  <Play className="w-4 h-4" />
                  <span>Watch Demo</span>
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-300 text-sm">4.9/5 Rating</span>
                </div>
                <div className="text-gray-400 text-sm">
                  <span className="text-white font-semibold">50M+</span> Downloads
                </div>
              </div>
            </div>

            {/* Right Column - Interactive Phone Demo */}
            <div className="relative">
              <div className="relative mx-auto w-80 h-[600px] bg-gradient-to-b from-gray-900 to-black rounded-[3rem] p-4 shadow-2xl">
                {/* Phone Screen */}
                <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-800 rounded-[2.5rem] p-6 relative overflow-hidden">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-white text-xs mb-6">
                    <span>9:41 PM 18-08-2025</span>
                    <div className="flex items-center space-x-1">
                      <Wifi className="w-3 h-3" />
                      <Battery className="w-4 h-3" />
                    </div>
                  </div>

                  {/* App Interface */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center">
                      <Shield className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <h3 className="text-white font-semibold text-lg">SecureGuard</h3>
                      <p className="text-green-400 text-sm">Device Protected</p>
                    </div>

                    {/* Scan Button */}
                    <div className="text-center  ">
                      <button
                        onClick={startScan}
                        disabled={isScanning}
                        className={`relative w-32 h-32 rounded-full cursor-pointer border-4 ${
                          isScanning ? 'border-yellow-500 animate-spin' : 'border-green-500 hover:border-green-400'
                        } bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center transition-all duration-300 ${
                          !isScanning && 'hover:scale-105'
                        }`}
                      >
                        {isScanning ? (
                          <RefreshCw className="w-8 h-8 text-yellow-400" />
                        ) : (
                          <Scan className="w-8 h-8 text-green-400" />
                        )}
                      </button>
                      <div className="mt-3">
                        <p className="text-white text-sm font-medium">
                          {isScanning ? `Scanning... ${scanProgress}%` : 'Tap to Scan'}
                        </p>
                        {scanProgress === 100 && (
                          <p className="text-green-400 text-xs mt-1">
                            {threatsFound === 0 ? 'No threats found' : `${threatsFound} threats blocked`}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 text-center backdrop-blur-sm">
                        <ShieldCheck className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <p className="text-white text-sm font-medium">Protected</p>
                        <p className="text-green-400 text-xs">24/7</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center backdrop-blur-sm">
                        <Target className="w-6 h-6 text-red-400 mx-auto mb-2" />
                        <p className="text-white text-sm font-medium">Threats</p>
                        <p className="text-red-400 text-xs">0 Active</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Security Elements */}
                  <div className="absolute top-20 right-4 animate-float">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Lock className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                  <div className="absolute bottom-32 left-4 animate-float animation-delay-2000">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Eye className="w-3 h-3 text-blue-400" />
                    </div>
                  </div>
                </div>

                {/* Phone Notch */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-black rounded-full"></div>
              </div>

              {/* Floating Icons */}
              <div className="absolute -top-4 -left-4 animate-float">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-red-500/20">
                  <ShieldX className="w-6 h-6 text-red-400" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 animate-float animation-delay-4000">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-green-500/20">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-30 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-red-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-30 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Comprehensive Protection
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every feature designed to keep your mobile device secure, private, and performing at its best.
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center mb-12 gap-4">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  activeTab === feature.id
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <feature.icon className="w-5 h-5" />
                <span className="font-medium">{feature.title}</span>
              </button>
            ))}
          </div>

          {/* Active Feature Details */}
          <div className="max-w-4xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`transition-all duration-500 ${
                  activeTab === feature.id ? 'opacity-100' : 'opacity-0 absolute'
                }`}
              >
                {activeTab === feature.id && (
                  <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8">
                    <div className="text-center mb-8">
                      <feature.icon className="w-16 h-16 text-red-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-gray-300 text-lg">{feature.desc}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {feature.details.map((detail, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
              Trusted by Millions
            </h2>
            <p className="text-xl text-gray-300">
              See what our users say about SecureGuard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/10 transform hover:scale-105 transition-all duration-500"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.comment}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="relative z-30 px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="backdrop-blur-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl border border-white/20 p-12">
            <Shield className="w-20 h-20 text-red-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Download SecureGuard Today
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join 50 million users who trust SecureGuard to protect their mobile devices. 
              Start your free protection now.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
              <button className="group bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-red-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Download for Android</span>
              </button>
              
              <button className="group bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-gray-700 hover:to-gray-800 transform hover:scale-105 transition-all duration-300 shadow-xl flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Download for iOS</span>
              </button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No Ads</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Premium Features</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-30 px-6 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <Shield className="w-10 h-10 text-red-500" />
                  <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">Vais SecureGuard</span>
                  <div className="text-xs text-red-400 font-semibold">MOBILE ANTIVIRUS</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Protecting millions of mobile devices worldwide with advanced AI-powered security solutions. 
                Your digital safety is our mission.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 transition-all">
                  <Globe className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 transition-all">
                  <Users className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 transition-all">
                  <Shield className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Product Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <Smartphone className="w-4 h-4 mr-2 text-red-400" />
                Product
              </h4>
              <div className="space-y-3">
                <button className="block text-gray-400 hover:text-white transition-colors">Download Android</button>
                <button className="block text-gray-400 hover:text-white transition-colors">Download iOS</button>
                <button className="block text-gray-400 hover:text-white transition-colors">Features</button>
                <button className="block text-gray-400 hover:text-white transition-colors">Premium Plans</button>
                <button className="block text-gray-400 hover:text-white transition-colors">System Requirements</button>
              </div>
            </div>
            
            {/* Support Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <Settings className="w-4 h-4 mr-2 text-red-400" />
                Support
              </h4>
              <div className="space-y-3">
                <button className="block text-gray-400 hover:text-white transition-colors">Help Center</button>
                <button className="block text-gray-400 hover:text-white transition-colors">User Guide</button>
                <button className="block text-gray-400 hover:text-white transition-colors">Contact Support</button>
                <button className="block text-gray-400 hover:text-white transition-colors">Report Bug</button>
                <button className="block text-gray-400 hover:text-white transition-colors">Security Center</button>
              </div>
            </div>
          </div>

          {/* Security Certifications */}
          <div className="border-t border-white/10 pt-8 pb-8">
            <div className="text-center mb-6">
              <h5 className="text-white font-semibold mb-4 flex items-center justify-center">
                <Award className="w-5 h-5 mr-2 text-yellow-400" />
                Security Certifications & Awards
              </h5>
              <div className="flex flex-wrap items-center justify-center space-x-8 space-y-2">
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>ISO 27001 Certified</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>VB100 Award Winner</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>AV-TEST Approved</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>GDPR Compliant</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Footer */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Vais Technologies. All rights reserved. | Protecting devices since 2020
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <button className="hover:text-white transition-colors flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Privacy Policy</span>
              </button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <button className="hover:text-white transition-colors">EULA</button>
              <button className="hover:text-white transition-colors flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Security</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-10px); 
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
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

export default About