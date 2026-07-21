
import ContactHeader from "../Header/ContactHeader";
// import Footer from "../Footer/Footer";
import React, { useState } from 'react';
import { Send, CheckCircle, Mail, User, MessageSquare } from 'lucide-react';
const Contact = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [isSubmitted, setIsSubmitted] = useState(false);
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        setTimeout(() => setIsSubmitted(false), 3000);
      };
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };
    
  return (
    <>
    <ContactHeader/>

    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-5">
          {/* Left Panel */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#F0712C] to-[#FFBE69] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Let's Connect</h2>
              <p className="text-blue-100 mb-8 leading-relaxed">
                We're here to help and answer any questions you might have. We look forward to hearing from you.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-blue-100">
                  <Mail className="w-5 h-5" />
                  <span>info@vais.co.in</span>
                </div>
                <div className="flex items-center space-x-4 text-blue-100">
                  <MessageSquare className="w-5 h-5" />
                  <span>Monday - Saturday: 9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
              <div className="w-64 h-64 rounded-full bg-blue-500 opacity-20"></div>
            </div>
            <div className="absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4">
              <div className="w-48 h-48 rounded-full bg-indigo-500 opacity-20"></div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="md:col-span-3 p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full rounded-lg border-gray-200 bg-gray-50 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full rounded-lg border-gray-200 bg-gray-50 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full rounded-lg border-gray-200 bg-gray-50 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-200 bg-gray-50 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Please describe your request in detail..."
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-lg
                           text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                           transform transition-all duration-150 hover:scale-[1.02] ${
                             isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                           }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </div>
                  )}
                </button>
              </div>
            </form>

            {isSubmitted && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100 flex items-center animate-fade-in">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-700">Thank you! Your message has been sent successfully.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      {/* <Footer/> */}
    </>
      
  )
}

export default Contact