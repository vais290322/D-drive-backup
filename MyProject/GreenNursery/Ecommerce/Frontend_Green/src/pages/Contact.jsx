import React from 'react'
import { CiLocationOn } from "react-icons/ci";
import { IoMdCall } from "react-icons/io";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaLeaf, FaPaperPlane, FaMapMarkedAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen">
      {/* Header with pattern overlay */}
      <div className="relative overflow-hidden bg-emerald-800 text-white">
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '20px'
             }}>
        </div>
        <header className="text-center py-12 relative z-10">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
            <p className="mt-4 text-emerald-100 max-w-2xl mx-auto">
              We're here to help with all your plant and gardening needs
            </p>
          </div>
        </header>
      </div>

      <main className="container mx-auto px-6 py-12">
        {/* Map Section */}
        <section className="mb-16 relative">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full opacity-50 z-0"></div>
          
          <div className="bg-white rounded-lg shadow-md p-6 relative z-10">
            <div className="flex items-center mb-6">
              <FaMapMarkedAlt className="text-emerald-600 mr-3 text-2xl" />
              <h2 className="text-3xl font-bold text-emerald-800">Find Us</h2>
            </div>
            
            <div className="rounded-lg overflow-hidden border-4 border-white shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.420055190772!2d88.7951616!3d22.675401699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ff5522d149176f%3A0xf45c2e804a73ab49!2sGreen%20City%20Nursery!5e0!3m2!1sen!2sin!4v1745489053900!5m2!1sen!2sin"  
                className='w-full h-96' 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </section>

        {/* Contact Information and Form Section */}
        <section className="relative">
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-200 rounded-full opacity-40 z-0"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <FaLeaf className="text-emerald-600 mr-3 text-2xl" />
                <h2 className="text-2xl font-bold text-emerald-800">Get In Touch</h2>
              </div>
              
              <div className="space-y-8">
                {/* Visit Us Section */}
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-3 rounded-full mr-4">
                    <CiLocationOn className="text-emerald-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-800">Visit Us</h3>
                    <p className="text-gray-600 mt-1">Gopalpur more, Basirhat, North 24 parganas, West Bengal – 743428</p>
                    <p className="text-gray-600 mt-1">
                      <span className='text-emerald-600 font-bold'>Landmark - </span> 
                      Opposite of Bandhan Bank, Taki road (Gopalpur more branch)
                    </p>
                  </div>
                </div>

                {/* Call Us Section */}
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-3 rounded-full mr-4">
                    <IoMdCall className="text-emerald-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-800">Call Us</h3>
                  
                    <p className="text-gray-600 mt-1">
                      <span className='text-emerald-600 font-bold'> Sahin Sardar : </span> 
                      +91 9064639993
                    </p>

              

                    <p className="text-gray-600 mt-1">
                      <span className='text-emerald-600 font-bold'>Samim Ahamed : </span> 
                      +91 8637026057
                    </p>

                  </div>
                </div>

                {/* Email Us Section */}
                <div className="flex items-start">
                  <div className="bg-emerald-100 p-3 rounded-full mr-4">
                    <MdOutlineAlternateEmail className="text-emerald-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-800">Email Us</h3>
                    <p className="text-gray-600 mt-1">greencitynursery9993@gmail.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <p className="text-emerald-800 font-medium">
                  Our team is available to assist you Monday through Saturday, 9:00 AM to 6:00 PM.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <FaPaperPlane className="text-emerald-600 mr-3 text-2xl" />
                <h2 className="text-2xl font-bold text-emerald-800">Send Us a Message</h2>
              </div>
              
              <form 
                action="https://formspree.io/f/xnndqrjk" 
                method="POST" 
                className="space-y-6"
              >
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    id="username"
                    name="username" 
                    placeholder="Enter your name" 
                    autoComplete="off" 
                    required  
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email" 
                    placeholder="Enter your email" 
                    autoComplete="off" 
                    required  
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                  <textarea 
                    id="message"
                    name="message" 
                    rows="6" 
                    placeholder="How can we help you?" 
                    autoComplete="off" 
                    required 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  ></textarea>
                </div>

                <button 
                  type='submit' 
                  className='bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow flex items-center justify-center gap-2'
                >
                  <FaPaperPlane size={16} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-emerald-800 text-white py-8 mt-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '20px'
             }}>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <p className="text-emerald-100">
            &copy; {new Date().getFullYear()} Green City Nursery. All rights reserved.
          </p>
          <p className="mt-2 text-emerald-200 text-sm">
            Bringing nature's beauty to your doorstep since 2015
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Contact
