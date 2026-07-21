import React from 'react'
import Header from '../../Header'
import Footer from '../../Footer'
import Event from '../../../../assets/Home_images/service page/Inside_Service/event.jpg'
import { useNavigate } from 'react-router-dom'

function EventManagement() {
  const navigate =useNavigate()
  return (
    <>
      <Header />
      <div className="relative h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${Event})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative text-white text-center p-10 max-w-3xl">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-300 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            Event Management Services
          </h1>
          <p className="text-lg mt-4">
            Creating unforgettable experiences with expert event planning and coordination.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-6xl mx-auto py-16 px-6 text-center">
        <h2 className="text-4xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Why Choose Us?
        </h2>
        <p className="text-gray-700 mt-4">
          From corporate gatherings to weddings, we bring your vision to life with seamless execution.
        </p>
      </div>

      {/* Services Section */}
      <div className="bg-gradient-to-r from-blue-100 via-purple-200 to-pink-100 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            Our Event Services
          </h2>
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-white shadow-md rounded-md text-center border border-gray-300">
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Corporate Events
              </h3>
              <p className="mt-2 text-gray-700">Professional planning for conferences, meetings, and product launches.</p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-md text-center border border-gray-300">
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Weddings & Celebrations
              </h3>
              <p className="mt-2 text-gray-700">Making your special moments stress-free and memorable.</p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-md text-center border border-gray-300">
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Concerts & Festivals
              </h3>
              <p className="mt-2 text-gray-700">Managing logistics, vendors, and crowd control for large-scale events.</p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-md text-center border border-gray-300">
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Private Parties
              </h3>
              <p className="mt-2 text-gray-700">Personalized party planning for birthdays, anniversaries, and more.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 px-6 text-center">
        <h2 className="text-4xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Plan Your Event Today!
        </h2>
        <p className="mt-4 text-gray-700">Let’s create something amazing together. Get in touch now!</p>
        <button onClick={()=>navigate("/contact")} className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105">
  Get a Quote
</button>
      </div>
      <Footer />
    </>
  )
}

export default EventManagement;