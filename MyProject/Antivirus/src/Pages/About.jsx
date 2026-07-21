import React, { useState } from 'react'
import { Shield, ArrowLeft, Eye, EyeOff, Users, Target, Award, Globe, Zap, Lock, Heart, Brain, Rocket, Star, ExternalLink, Mail, Phone, MapPin, Calendar, TrendingUp, CheckCircle, BookOpen } from 'lucide-react'

const About = () => {
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState('story')

  const bgClass = darkMode 
    ? "min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800"
    : "min-h-screen bg-gradient-to-br from-gray-100 via-red-100 to-gray-200"
  
  const textClass = darkMode ? "text-white" : "text-gray-900"
  const mutedTextClass = darkMode ? "text-gray-400" : "text-gray-600"

  const stats = [
    { icon: <Users className="w-8 h-8" />, value: '50M+', label: 'Protected Devices', color: 'blue' },
    { icon: <Globe className="w-8 h-8" />, value: '150+', label: 'Countries Served', color: 'green' },
    { icon: <Award className="w-8 h-8" />, value: '4.9/5', label: 'User Rating', color: 'yellow' },
    { icon: <TrendingUp className="w-8 h-8" />, value: '99.9%', label: 'Threat Detection', color: 'red' }
  ]

  const team = [
    {
      name: 'Sourav Das',
      role: 'CEO & Founder',
      image: '/api/placeholder/150/150',
      bio: '15+ years in cybersecurity, former security architect at leading tech companies.',
      linkedin: '#'
    },
    {
      name: 'Subha Das',
      role: 'CTO',
      image: '/api/placeholder/150/150',
      bio: 'AI/ML expert with PhD in Computer Science, specializing in threat detection algorithms.',
      linkedin: '#'
    },
    {
      name: 'Roni Majumder',
      role: 'Head of Security',
      image: '/api/placeholder/150/150',
      bio: 'Ethical hacker and security researcher with 12+ years in mobile security.',
      linkedin: '#'
    },
    {
      name: 'Arnab Golder',
      role: 'Product Director',
      image: '/api/placeholder/150/150',
      bio: 'User experience expert focused on making security accessible to everyone.',
      linkedin: '#'
    }
  ]

  const values = [
    {
      icon: <Lock className="w-12 h-12" />,
      title: 'Security First',
      description: 'Every decision we make prioritizes user security and privacy above all else.',
      color: 'red'
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: 'User-Centric',
      description: 'We build products that real people can use without compromising their daily experience.',
      color: 'pink'
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: 'Innovation',
      description: 'Leveraging cutting-edge AI and machine learning to stay ahead of emerging threats.',
      color: 'purple'
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: 'Accessibility',
      description: 'Making advanced security accessible to users worldwide, regardless of technical expertise.',
      color: 'blue'
    }
  ]

  const milestones = [
    {
      year: '2022',
      title: 'Company Founded',
      description: 'Vais was established with a mission to democratize cybersecurity.'
    },
    {
      year: '2023',
      title: 'First Product Launch',
      description: 'Released our first mobile security solution serving 10,000+ users.'
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Pioneered AI-powered threat detection reaching 1M+ protected devices.'
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Expanded to 100+ countries with enterprise-grade security features.'
    },
    {
      year: '2025',
      title: 'SecureGuard Launch',
      description: 'Launched next-generation mobile antivirus protecting 50M+ devices globally.'
    }
  ]

  const tabContent = {
    story: (
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold ${textClass} mb-6`}>Our Story</h2>
          <p className={`text-lg ${mutedTextClass} max-w-4xl mx-auto leading-relaxed`}>
            Founded in 2022 in India, Vais emerged from a simple yet powerful vision: to make advanced cybersecurity 
            accessible to everyone, everywhere. What started as a small team of security researchers has grown into 
            a global force protecting millions of mobile devices worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-8 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
            <div className="text-red-500 mb-4">
              <Target className="w-12 h-12" />
            </div>
            <h3 className={`text-2xl font-bold ${textClass} mb-4`}>Our Mission</h3>
            <p className={mutedTextClass}>
              To provide military-grade mobile security that's so intuitive and effective, 
              that users can focus on what matters most to them while we handle the threats they never see.
            </p>
          </div>

          <div className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-8 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
            <div className="text-blue-500 mb-4">
              <Eye className="w-12 h-12" />
            </div>
            <h3 className={`text-2xl font-bold ${textClass} mb-4`}>Our Vision</h3>
            <p className={mutedTextClass}>
              A world where every mobile device is protected by intelligent, adaptive security that evolves 
              with threats, empowering billions of people to live their digital lives fearlessly.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-12">
          <h3 className={`text-3xl font-bold ${textClass} mb-8 text-center`}>Our Journey</h3>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-red-500 to-blue-500 rounded-full"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                    <div className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-6 rounded-xl border ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
                      <div className="text-red-500 font-bold text-lg mb-2">{milestone.year}</div>
                      <h4 className={`font-bold ${textClass} mb-2`}>{milestone.title}</h4>
                      <p className={`${mutedTextClass} text-sm`}>{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-4 h-4 bg-red-500 rounded-full border-4 border-white mx-4"></div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    team: (
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold ${textClass} mb-6`}>Meet Our Team</h2>
          <p className={`text-lg ${mutedTextClass} max-w-3xl mx-auto`}>
            Our diverse team of security experts, engineers, and innovators work tirelessly 
            to keep your digital life safe and secure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-6 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'} text-center hover:transform hover:scale-105 transition-all duration-300`}>
              <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-16 h-16 text-white" />
              </div>
              <h3 className={`font-bold ${textClass} mb-1`}>{member.name}</h3>
              <p className="text-red-400 text-sm mb-3">{member.role}</p>
              <p className={`${mutedTextClass} text-sm mb-4`}>{member.bio}</p>
              <a href={member.linkedin} className="text-blue-400 hover:text-blue-300 transition-colors">
                <ExternalLink className="w-4 h-4 mx-auto" />
              </a>
            </div>
          ))}
        </div>

        <div className={`bg-gradient-to-r ${darkMode ? 'from-red-900/30 to-blue-900/30' : 'from-red-100/50 to-blue-100/50'} p-8 rounded-2xl border ${darkMode ? 'border-red-500/20' : 'border-red-300/20'} text-center`}>
          <h3 className={`text-2xl font-bold ${textClass} mb-4`}>Join Our Mission</h3>
          <p className={`${mutedTextClass} mb-6`}>
            We're always looking for passionate individuals who want to make the digital world safer. 
            Explore opportunities to join our growing team.
          </p>
          <a 
            href="https://vais.co.in/careers" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <span>View Open Positions</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    ),
    values: (
      <div className="space-y-8">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold ${textClass} mb-6`}>Our Values</h2>
          <p className={`text-lg ${mutedTextClass} max-w-3xl mx-auto`}>
            These core principles guide everything we do, from product development to customer support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <div key={index} className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-8 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'} hover:transform hover:scale-105 transition-all duration-300`}>
              <div className={`text-${value.color}-500 mb-6`}>
                {value.icon}
              </div>
              <h3 className={`text-2xl font-bold ${textClass} mb-4`}>{value.title}</h3>
              <p className={`${mutedTextClass} leading-relaxed`}>{value.description}</p>
            </div>
          ))}
        </div>

        <div className={`bg-gradient-to-r ${darkMode ? 'from-purple-900/30 to-pink-900/30' : 'from-purple-100/50 to-pink-100/50'} p-8 rounded-2xl border ${darkMode ? 'border-purple-500/20' : 'border-purple-300/20'}`}>
          <h3 className={`text-2xl font-bold ${textClass} mb-6 text-center`}>Our Commitment</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h4 className={`font-semibold ${textClass} mb-2`}>Privacy by Design</h4>
              <p className={`${mutedTextClass} text-sm`}>Your data stays yours. We never sell or share personal information.</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h4 className={`font-semibold ${textClass} mb-2`}>24/7 Protection</h4>
              <p className={`${mutedTextClass} text-sm`}>Round-the-clock monitoring and instant response to emerging threats.</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-purple-500 mx-auto mb-3" />
              <h4 className={`font-semibold ${textClass} mb-2`}>Continuous Innovation</h4>
              <p className={`${mutedTextClass} text-sm`}>Regular updates and new features to stay ahead of evolving threats.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={bgClass}>
      {/* Enhanced Navigation */}
      <nav className={`relative z-50 px-6 py-4 border-b ${darkMode ? 'border-white/10' : 'border-black/10'} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.history.back()}>
            <Shield className="w-10 h-10 text-red-500 drop-shadow-lg" />
            <div>
              <span className={`text-2xl font-bold ${textClass}`}>Vais SecureGuard</span>
              <div className="text-xs text-red-400 font-semibold tracking-wider">ABOUT US</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://vais.co.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center space-x-2 ${mutedTextClass} hover:${textClass} transition-colors cursor-pointer`}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Vais.co.in</span>
            </a>
            
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

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-red-500 to-blue-500 p-4 rounded-2xl">
              <Shield className="w-20 h-20 text-white" />
            </div>
          </div>
          <h1 className={`text-6xl font-bold ${textClass} mb-6`}>About Vais SecureGuard</h1>
          <p className={`text-xl ${mutedTextClass} max-w-4xl mx-auto leading-relaxed`}>
            We're on a mission to protect the mobile lives of billions. From our headquarters in India to users worldwide, 
            we're building the future of mobile security with cutting-edge AI and unwavering commitment to privacy.
          </p>
          <div className="mt-8">
            <a 
              href="https://vais.co.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <span>Visit Vais.co.in</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-6 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'} text-center hover:transform hover:scale-105 transition-all duration-300`}>
              <div className={`text-${stat.color}-500 mb-4 flex justify-center`}>
                {stat.icon}
              </div>
              <div className={`text-3xl font-bold ${textClass} mb-2`}>{stat.value}</div>
              <div className={`${mutedTextClass} text-sm font-medium`}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-2 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
            <div className="flex space-x-2">
              {[
                { id: 'story', label: 'Our Story', icon: <BookOpen className="w-4 h-4" /> },
                { id: 'team', label: 'Our Team', icon: <Users className="w-4 h-4" /> },
                { id: 'values', label: 'Our Values', icon: <Heart className="w-4 h-4" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex cursor-pointer items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-red-500 text-white shadow-lg transform scale-105' 
                      : `${mutedTextClass} hover:${textClass} hover:bg-white/5`
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-500">
          {tabContent[activeTab]}
        </div>

        {/* Contact Section */}
        <div className={`mt-20 bg-gradient-to-r ${darkMode ? 'from-red-900/30 to-slate-900/30' : 'from-red-100/50 to-gray-100/50'} p-12 rounded-2xl border ${darkMode ? 'border-red-500/20' : 'border-red-300/20'}`}>
          <h2 className={`text-3xl font-bold ${textClass} mb-8 text-center`}>Get in Touch</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Mail className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className={`font-semibold ${textClass} mb-2`}>Email Us</h3>
              <p className={mutedTextClass}>info@vais.co.in</p>
            </div>
            <div className="text-center">
              <Globe className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className={`font-semibold ${textClass} mb-2`}>Visit Our Website</h3>
              <a 
                href="https://vais.co.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                vais.co.in
              </a>
            </div>
            <div className="text-center">
              <a href='https://maps.app.goo.gl/G1HvktrCv7je3eS1A' target='_blank' > 
              <MapPin className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className={`font-semibold ${textClass} mb-2`}>Headquarters</h3>
              <p className={mutedTextClass}>Deganga, Kolkata, India</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className={`relative z-10 px-6 py-12 border-t ${darkMode ? 'border-white/10' : 'border-black/10'} bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="w-6 h-6 text-red-500" />
              <span className={`font-bold ${textClass}`}>Vais SecureGuard</span>
            </div>
            <p className={`${mutedTextClass} text-sm mb-4`}>
              © {new Date().getFullYear()} Vais SecureGuard. All rights reserved. 
              Protecting mobile lives worldwide since 2022.
            </p>
            <a 
              href="https://vais.co.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors text-sm"
            >
              <span>Part of Vais Technologies</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default About