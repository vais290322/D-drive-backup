import React from 'react'
import { CiLocationOn } from "react-icons/ci";
import { IoMdCall } from "react-icons/io";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaLeaf, FaPaperPlane, FaMapMarkedAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="bg-gradient-to-b from-teal-50 to-teal-100 min-h-screen">
      {/* Header with pattern overlay */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-800 via-yellow-600 to-green-700 text-white">
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '20px'
             }}>
        </div>
        <header className="text-center py-12 relative z-10">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
            <p className="mt-4 text-yellow-100 max-w-2xl mx-auto">
              We're here to help with all your plant and gardening needs
            </p>
          </div>
        </header>
      </div>

      <main className="container mx-auto px-6 py-12">
        {/* Map Section */}
        <section className="mb-16 relative">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-100 rounded-full opacity-50 z-0"></div>
          
          <div className="bg-white rounded-lg shadow-md p-6 relative z-10 border border-green-100">
            <div className="flex items-center mb-6">
              <FaMapMarkedAlt className="text-green-600 mr-3 text-2xl" />
              <h2 className="text-3xl font-bold text-green-800">Find Us</h2>
            </div>
            
            <div className="rounded-lg overflow-hidden border-4 border-white shadow-lg">

              <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4130.162649109732!2d88.68355545375502!3d22.744720635893536!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8af8fa6d61b5d%3A0xa95e16aadad7ce8f!2sAFSANA%20NURSERY!5e0!3m2!1sen!2sin!4v1745904818721!5m2!1sen!2sin" className='w-full h-96' 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </section>

        {/* Contact Information and Form Section */}
        <section className="relative">
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-green-200 rounded-full opacity-40 z-0"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-8 border border-green-100">
              <div className="flex items-center mb-6">
                <FaLeaf className="text-green-600 mr-3 text-2xl" />
                <h2 className="text-2xl font-bold text-green-800">Get In Touch</h2>
              </div>
              
              <div className="space-y-8">
                {/* Visit Us Section */}
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-green-100 to-yellow-100 p-3 rounded-full mr-4">
                    <CiLocationOn className="text-green-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Visit Us</h3>
                    <p className="text-gray-600 mt-1">chakla,chanpur, Deganga, North 24 parganas, West Bengal – 743424</p>
                    {/* <p className="text-gray-600 mt-1">
                      <span className='text-green-600 font-bold'>Landmark - </span> 
                      Opposite of Bandhan Bank, Taki road (Gopalpur more branch)
                    </p> */}
                  </div>
                </div>

                {/* Call Us Section */}
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-green-100 to-yellow-100 p-3 rounded-full mr-4">
                    <IoMdCall className="text-green-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Call Us</h3>
                  
                    <p className="text-gray-600 mt-1">
                      <span className='text-green-600 font-bold'> Md Aktrul khan : </span> 
                      +91 7601949430
                    </p>

                    {/* <p className="text-gray-600 mt-1">
                      <span className='text-green-600 font-bold'>Samim Ahamed : </span> 
                      +91 8637026057
                    </p> */}

                  </div>
                </div>

                {/* Email Us Section */}
                <div className="flex items-start">
                  <div className="bg-gradient-to-br from-green-100 to-yellow-100 p-3 rounded-full mr-4">
                    <MdOutlineAlternateEmail className="text-green-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Email Us</h3>
                    <p className="text-gray-600 mt-1">afsananursery30@gmail.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg border border-green-100">
                <p className="text-green-800 font-medium">
                  Our team is available to assist you Monday through Saturday, 9:00 AM to 6:00 PM.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8 border border-green-100">
              <div className="flex items-center mb-6">
                <FaPaperPlane className="text-green-600 mr-3 text-2xl" />
                <h2 className="text-2xl font-bold text-green-800">Send Us a Message</h2>
              </div>
              
              <form 
                action="https://formspree.io/f/mvgazzgw" 
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  ></textarea>
                </div>

                <button 
                  type='submit' 
                  className='bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow flex items-center justify-center gap-2'
                >
                  <FaPaperPlane size={16} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-r from-green-800 via-yellow-600 to-green-700 text-white py-8 mt-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '20px'
             }}>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <p className="text-yellow-100">
            &copy; {new Date().getFullYear()} Afsana Nursery. All rights reserved.
          </p>
          <p className="mt-2 text-yellow-200 text-sm">
            Bringing nature's beauty to your doorstep since 2023
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Contact
