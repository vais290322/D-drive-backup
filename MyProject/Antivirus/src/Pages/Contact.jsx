import React, { useState } from 'react';
import { Shield, ArrowLeft, Eye, EyeOff, Mail, Phone, MapPin, Clock, Globe, Send, User, MessageSquare, Building, Calendar, ExternalLink, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const Contact = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    contactType: 'general'
  });
  const [formStatus, setFormStatus] = useState('idle'); // idle, loading, success, error
  const [mapLoaded, setMapLoaded] = useState(false);

  const bgClass = darkMode 
    ? "min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800"
    : "min-h-screen bg-gradient-to-br from-gray-100 via-red-100 to-gray-200";
  
  const textClass = darkMode ? "text-white" : "text-gray-900";
  const mutedTextClass = darkMode ? "text-gray-400" : "text-gray-600";

  const contactInfo = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Email Us',
      primary: 'info@vais.co.in',
      secondary: 'admin@vais.co.in',
      description: 'Get in touch for support or business inquiries',
      color: 'red'
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: 'Call Us',
      primary: '+91 83439 39495',
      secondary: '+91 75508 53849',
      description: '24/7 support hotline available',
      color: 'blue'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Visit Us',
      primary: 'VAIS Engineering Pvt Ltd',
      secondary: 'Degangan, Kolkata, West Bengal, India',
      description: 'Our headquarters and development center',
      color: 'green'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Business Hours',
      primary: 'Mon - Sat: 9:00 AM - 6:00 PM IST',
      secondary: 'Sun: Off',
      description: 'Emergency support available 24/7',
      color: 'purple'
    }
  ];

  const contactTypes = [
    { id: 'general', label: 'General Inquiry', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'support', label: 'Technical Support', icon: <Shield className="w-5 h-5" /> },
    { id: 'business', label: 'Business Partnership', icon: <Building className="w-5 h-5" /> },
    { id: 'media', label: 'Media & Press', icon: <Globe className="w-5 h-5" /> }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          company: '',
          subject: '',
          message: '',
          contactType: 'general'
        });
        setFormStatus('idle');
      }, 3000);
    }, 2000);
  };

  const isFormValid = formData.name && formData.email && formData.subject && formData.message;

  return (
    <div className={bgClass}>
      {/* Enhanced Navigation */}
      <nav className={`relative z-50 px-6 py-4 border-b ${darkMode ? 'border-white/10' : 'border-black/10'} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.history.back()}>
            <Shield className="w-10 h-10 text-red-500 drop-shadow-lg" />
            <div>
              <span className={`text-2xl font-bold ${textClass}`}>SecureGuard</span>
              <div className="text-xs text-red-400 font-semibold tracking-wider">CONTACT US</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://vais.co.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`flex items-center space-x-2 ${mutedTextClass} hover:${textClass} transition-colors`}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">vais.co.in</span>
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
            <div className="bg-gradient-to-r from-red-500 to-blue-500 p-4 rounded-2xl animate-pulse">
              <Mail className="w-20 h-20 text-white" />
            </div>
          </div>
          <h1 className={`text-6xl font-bold ${textClass} mb-6`}>Get in Touch</h1>
          <p className={`text-xl ${mutedTextClass} max-w-4xl mx-auto leading-relaxed`}>
            Have questions about SecureGuard? Need technical support? Want to partner with us? 
            We're here to help and would love to hear from you.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div key={index} className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-6 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'} text-center hover:transform hover:scale-105 transition-all duration-300`}>
              <div className={`text-${info.color}-500 mb-4 flex justify-center`}>
                {info.icon}
              </div>
              <h3 className={`font-bold ${textClass} mb-3`}>{info.title}</h3>
              <p className={`text-${info.color}-400 font-semibold mb-1`}>{info.primary}</p>
              <p className={`${mutedTextClass} text-sm mb-3`}>{info.secondary}</p>
              <p className={`${mutedTextClass} text-xs`}>{info.description}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-8 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
            <h2 className={`text-3xl font-bold ${textClass} mb-6 flex gap-2`}> <MessageSquare className='mt-2' /> Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Type Selection */}
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-3`}>
                  What can we help you with?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {contactTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, contactType: type.id }))}
                      className={`flex cursor-pointer items-center space-x-2 p-3 rounded-lg border transition-all duration-300 ${
                        formData.contactType === type.id
                          ? 'bg-red-500 text-white border-red-500 shadow-lg'
                          : `${darkMode ? 'border-white/20 text-gray-400 hover:border-white/40' : 'border-black/20 text-gray-600 hover:border-black/40'}`
                      }`}
                    >
                      {type.icon}
                      <span className="text-sm font-medium cursor-pointer ">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${textClass} mb-2`}>
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${mutedTextClass}`} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-black/20 border-white/20 text-white placeholder-gray-400' : 'bg-white/20 border-black/20 text-black placeholder-gray-600'} focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textClass} mb-2`}>
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${mutedTextClass}`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-black/20 border-white/20 text-white placeholder-gray-400' : 'bg-white/20 border-black/20 text-black placeholder-gray-600'} focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textClass} mb-2`}>
                  Company/Organization
                </label>
                <div className="relative">
                  <Building className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${mutedTextClass}`} />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-black/20 border-white/20 text-white placeholder-gray-400' : 'bg-white/20 border-black/20 text-black placeholder-gray-600'} focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                    placeholder="Your company name (optional)"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${textClass} mb-2`}>
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-black/20 border-white/20 text-white placeholder-gray-400' : 'bg-white/20 border-black/20 text-black placeholder-gray-600'} focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                  placeholder="Brief description of your inquiry"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${textClass} mb-2`}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-black/20 border-white/20 text-white placeholder-gray-400' : 'bg-white/20 border-black/20 text-black placeholder-gray-600'} focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none`}
                  placeholder="Tell us more about how we can help you..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || formStatus === 'loading'}
                className={`w-full py-4 cursor-pointer rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  formStatus === 'success' 
                    ? 'bg-green-500 text-white' 
                    : formStatus === 'error'
                    ? 'bg-red-500 text-white'
                    : isFormValid
                    ? 'bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white transform hover:scale-105'
                    : `${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-300 text-gray-500'} cursor-not-allowed`
                }`}
              >
                {formStatus === 'loading' && <Loader className="w-5 h-5 animate-spin" />}
                {formStatus === 'success' && <CheckCircle className="w-5 h-5" />}
                {formStatus === 'error' && <AlertCircle className="w-5 h-5" />}
                <span>
                  {formStatus === 'loading' ? 'Sending...' :
                   formStatus === 'success' ? 'Message Sent!' :
                   formStatus === 'error' ? 'Error - Try Again' :
                   'Send Message'}
                </span>
                {formStatus === 'idle' && <Send className="w-5 h-5" />}
              </button>

              {formStatus === 'success' && (
                <div className="text-center text-green-400 text-sm">
                  Thank you! We'll get back to you within 24 hours.
                </div>
              )}
            </form>
          </div>

          {/* Map Section */}
          <div className="space-y-6">
            <div className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-8 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'}`}>
              <h2 className={`text-3xl font-bold ${textClass} mb-6`}>Find Us</h2>
              
              <div className="relative">
                {!mapLoaded && (
                  <div className="w-full h-96 bg-gradient-to-br from-red-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-red-400 mx-auto mb-4 animate-bounce" />
                      <p className={`${textClass} font-semibold`}>Loading Map...</p>
                    </div>
                  </div>
                )}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d72469.58168597987!2d88.648521!3d22.691244!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8a9206e246191%3A0x63b4fefedde80f78!2sVAIS%20Engineering%20Private%20Limited!5e1!3m2!1sen!2sin!4v1755578324362!5m2!1sen!2sin"
                  width="100%" 
                  height="384" 
                  style={{border:0, borderRadius: '12px'}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => setMapLoaded(true)}
                  className={`${mapLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                />
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-red-400 mt-1" />
                  <div>
                    <h4 className={`font-semibold ${textClass} mb-1`}>VAIS Engineering Private Limited</h4>
                    <p className={`${mutedTextClass} text-sm`}>Degangana, Kolkata, West Bengal, India</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <a 
                    href="https://vais.co.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Visit vais.co.in
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className={`bg-gradient-to-r ${darkMode ? 'from-red-900/30 to-blue-900/30' : 'from-red-100/50 to-blue-100/50'} p-6 rounded-2xl border ${darkMode ? 'border-red-500/20' : 'border-red-300/20'}`}>
              <h3 className={`text-xl font-bold ${textClass} mb-4`}>Need Immediate Help?</h3>
              <p className={`${mutedTextClass} text-sm mb-4`}>
                For urgent technical support or security concerns, contact us directly:
              </p>
              <div className="flex flex-col space-y-2">
                <a 
                  href="mailto:support@secureguard.com"
                  className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>info@vais.co.in</span>
                </a>
                <a 
                  href="tel:+919876543210"
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>+91 83439 39495</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-6 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'} text-center`}>
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className={`font-bold ${textClass} mb-2`}>Security First</h3>
            <p className={`${mutedTextClass} text-sm`}>
              All communications are encrypted and your privacy is our priority.
            </p>
          </div>
          
          <div className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-6 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'} text-center`}>
            <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className={`font-bold ${textClass} mb-2`}>Quick Response</h3>
            <p className={`${mutedTextClass} text-sm`}>
              We aim to respond to all inquiries within 24 hours during business days.
            </p>
          </div>
          
          <div className={`bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm p-6 rounded-2xl border ${darkMode ? 'border-white/10' : 'border-black/10'} text-center`}>
            <Globe className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className={`font-bold ${textClass} mb-2`}>Global Support</h3>
            <p className={`${mutedTextClass} text-sm`}>
              Supporting users worldwide with localized assistance and multilingual support.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className={`relative z-10 px-6 py-12 border-t ${darkMode ? 'border-white/10' : 'border-black/10'} bg-${darkMode ? 'black/20' : 'white/20'} backdrop-blur-sm mt-16`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="w-6 h-6 text-red-500" />
              <span className={`font-bold ${textClass}`}>SecureGuard</span>
            </div>
            <p className={`${mutedTextClass} text-sm mb-4`}>
              © {new Date().getFullYear()} SecureGuard by VAIS Engineering Pvt Ltd. All rights reserved.
            </p>
            <a 
              href="https://vais.co.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors text-sm"
            >
              <span>Part of VAIS Engineering</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;