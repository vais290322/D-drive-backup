import React, { useState } from 'react'
import { 
  Shield,
  Download,
  Star,
  ThumbsUp,
  Users,
  Award,
  Globe,
  MessageCircle,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  X,
  Menu
} from 'lucide-react'
import { useNavigate } from 'react-router'

const Reviews = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const reviews = [
    {
      name: 'Debabrata Karfa',
      role: 'Software Developer',
      company: 'TechCorp',
      image: '/avatars/sarah.jpg',
      rating: 5,
      text: 'Vais SecureGuard has completely transformed how I think about mobile security. The AI-powered scanning is incredibly fast and effective.',
      date: '2 days ago'
    },
    {
      name: 'Debajyoti Mondal',
      role: 'IT Manager',
      company: 'Global Systems Inc',
      image: '/avatars/michael.jpg',
      rating: 5,
      text: 'As an IT professional, I appreciate the depth of features and granular control. Perfect for both personal and enterprise use.',
      date: '1 week ago'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Digital Creator',
      company: 'CreativeWorks',
      image: '/avatars/emily.jpg',
      rating: 4,
      text: 'The privacy features are outstanding. I feel much more secure knowing my sensitive data is protected at all times.',
      date: '2 weeks ago'
    }
  ]

  const stats = [
    { number: '10M+', label: 'Active Users', icon: Users },
    { number: '4.9', label: 'Average Rating', icon: Star },
    { number: '99.9%', label: 'Threat Detection', icon: Shield },
    { number: '24/7', label: 'Expert Support', icon: MessageCircle }
  ]

  const features = [
    {
      title: 'Industry Recognition',
      description: 'Award-winning security solution trusted by millions worldwide',
      icon: Award,
      color: 'blue'
    },
    {
      title: 'Global Protection',
      description: 'Protecting users across 195+ countries with local support',
      icon: Globe,
      color: 'green'
    },
    {
      title: 'User Satisfaction',
      description: '97% customer satisfaction rate with 24/7 support',
      icon: ThumbsUp,
      color: 'red'
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
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <Shield className="w-10 h-10 text-red-500" />
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">
                Vais SecureGuard
              </span>
              <div className="text-xs text-red-400 font-semibold">
                USER REVIEWS
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate("/features")}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => navigate("/pricing")}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => navigate("/support")}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Support
            </button>
            <button
              onClick={() => navigate("/reviews")}
              className="text-green-400 hover:text-white transition-colors cursor-pointer"
            >
              Reviews
            </button>
            <button
              onClick={() => navigate("/about")}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <button className="hidden md:flex bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-full hover:from-red-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 cursor-pointer items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download Now</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`fixed inset-x-0 top-[73px] bg-gradient-to-b from-slate-900/95 to-slate-800/95 border-t border-white/10 backdrop-blur-lg transition-all duration-300 md:hidden ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <div className="px-6 py-4 space-y-4">
            <button
              onClick={() => {
                navigate("/features");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2 cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => {
                navigate("/pricing");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2 cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => {
                navigate("/support");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2 cursor-pointer"
            >
              Support
            </button>
            <button
              onClick={() => {
                navigate("/reviews");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-green-400 hover:text-white transition-colors py-2 cursor-pointer"
            >
              Reviews
            </button>
            <button
              onClick={() => {
                navigate("/about");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2 cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => {
                navigate("/contact");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-gray-300 hover:text-white transition-colors py-2 cursor-pointer"
            >
              Contact
            </button>

            <button className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-full hover:from-red-700 hover:to-orange-700 transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download Now</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full bg-gradient-to-r from-blue-600 to-orange-600 text-white px-6 py-3 rounded-full hover:from-red-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-40 px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
              Trusted by Millions
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Worldwide
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            See what our users have to say about their experience with Vais SecureGuard
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
                <stat.icon className="w-8 h-8 text-red-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Reviews */}
      <section className="relative z-30 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              User Testimonials
            </h2>
            <p className="text-gray-300">
              Hear from our satisfied users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500"></div>
                  <div>
                    <div className="text-white font-semibold">{review.name}</div>
                    <div className="text-sm text-gray-400">{review.role}</div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">{review.text}</p>
                <div className="text-sm text-gray-400">{review.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="relative z-30 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8">
                <feature.icon className={`w-12 h-12 mb-6 ${
                  feature.color === 'blue' ? 'text-blue-400' :
                  feature.color === 'green' ? 'text-green-400' :
                  'text-red-400'
                }`} />
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-30 px-6 py-24 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Experience the most trusted security solution for yourself
          </p>
          
          <button className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-red-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-3 mx-auto">
            <Download className="w-5 h-5" />
            <span>Download Vais SecureGuard</span>
          </button>
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
                <li className="cursor-pointer hover:text-red-500" onClick={()=>navigate('/about')} >About Us</li>
                <li className="cursor-pointer hover:text-red-500" onClick={()=>navigate('/contact')} >Contact</li>
                <li className="cursor-pointer hover:text-red-500" onClick={()=>navigate('/')} >Home</li>
                <li className="cursor-pointer hover:text-red-500" onClick={()=>navigate('/features')} >Features</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li onClick={() => navigate('/privacy-policy')} className='cursor-pointer hover:text-blue-500' >Privacy Policy</li>
                <li onClick={() => navigate('/terms-of-service')} className='cursor-pointer hover:text-blue-500' >Terms of Service</li>
                <li onClick={() => navigate('/cookie-policy')}  className='cursor-pointer hover:text-blue-500' >Cookie Policy</li>
                <li onClick={() => navigate('/gdpr-compliance')} className='cursor-pointer hover:text-blue-500' >GDPR Compliance</li>
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

export default Reviews