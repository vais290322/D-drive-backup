import React from "react";

import dada1 from "../assest/logo/dada1.jpeg";
import bhai2 from "../assest/logo/bhai2.jpeg";
import Afsana_Profile from "../assest/logo/Afsana_Profile.jpg";
import { FaLeaf, FaSeedling, FaTree, FaHandHoldingHeart } from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen">
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
            <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
            <p className="mt-4 text-yellow-100 max-w-2xl mx-auto">
              Bringing nature's beauty to your doorstep since 2018
            </p>
          </div>
        </header>
      </div>

      <main className="container mx-auto px-6 py-16">
        {/* Our Story Section */}
        <section className="mb-20 relative">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-100 rounded-full opacity-50 z-0"></div>
          
          <div className="bg-white rounded-lg shadow-md p-8 relative z-10 border border-green-100">
            <div className="flex items-center mb-6">
              <FaTree className="text-green-600 mr-3 text-2xl" />
              <h2 className="text-3xl font-bold text-green-800">Our Story</h2>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to <span className="font-bold text-green-700">Afsana Nursery</span>, where 
              our passion for plants and sustainable gardening practices has been growing since our founding. 
              Our journey began with a simple vision: to create a haven for plant enthusiasts and novice gardeners alike, 
              offering quality plants that bring life and beauty to any space.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              <span className="font-bold text-green-700">Afsana Nursery</span> started as a small 
              family-owned garden center with just a few varieties of local plants. Today, we've blossomed 
              into a comprehensive nursery offering hundreds of species, from ornamental flowers to fruit-bearing 
              trees, medicinal herbs to exotic houseplants. Our growth reflects our commitment to biodiversity 
              and our belief that everyone deserves access to the healing power of nature.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              What sets <span className="font-bold text-green-700">Afsana Nursery</span> apart is our 
              dedication to education and sustainability. We don't just sell plants; we share knowledge, 
              offer guidance, and build a community of green enthusiasts. Every plant in our nursery is 
              grown with care, using sustainable practices that respect our environment and ensure the 
              health and vitality of each specimen.
            </p>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="mb-20 relative">
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-green-200 rounded-full opacity-40 z-0"></div>
          
          <div className="bg-white rounded-lg shadow-md p-8 relative z-10 border border-green-100">
            <div className="flex items-center mb-6">
              <FaHandHoldingHeart className="text-green-600 mr-3 text-2xl" />
              <h2 className="text-3xl font-bold text-green-800">Our Mission</h2>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              At <span className="font-bold text-green-700">Afsana Nursery</span>, our mission is to 
              promote environmental stewardship through the joy of gardening. We believe that by connecting 
              people with plants, we can foster a deeper appreciation for nature and inspire sustainable living practices.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <h3 className="font-semibold text-green-800 text-xl mb-3">Quality & Diversity</h3>
                <p className="text-gray-700">
                  We are committed to offering the highest quality plants with genetic diversity, 
                  ensuring healthier gardens and landscapes that thrive in various conditions.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <h3 className="font-semibold text-green-800 text-xl mb-3">Education & Support</h3>
                <p className="text-gray-700">
                  We provide comprehensive guidance and resources to help our customers succeed, 
                  from plant selection to long-term care strategies.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <h3 className="font-semibold text-green-800 text-xl mb-3">Sustainability</h3>
                <p className="text-gray-700">
                  We implement eco-friendly practices in our operations and promote sustainable 
                  gardening methods that minimize environmental impact.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-lg border border-green-100">
                <h3 className="font-semibold text-green-800 text-xl mb-3">Community Building</h3>
                <p className="text-gray-700">
                  We foster a community of plant lovers through events, workshops, and online 
                  resources that bring people together through shared interests.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className="mb-20">
  <div className="bg-white rounded-lg shadow-md p-8 border border-green-100">
    <div className="flex items-center mb-8">
      <FaSeedling className="text-green-600 mr-3 text-2xl" />
      <h2 className="text-3xl font-bold text-green-800">Meet the Team</h2>
    </div>
    
    <p className="text-lg text-gray-700 mb-8">
      Our team of passionate plant experts is dedicated to helping you find the perfect 
      additions to your garden and providing the knowledge you need to help them thrive.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg p-6 text-center transform transition-transform hover:scale-105 border border-green-100">
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-green-200 rounded-full opacity-30 transform -rotate-6"></div>
          <img
            src={Afsana_Profile}
            alt="Team Member"
            className="rounded-full relative z-10 mx-auto h-40 w-40 object-cover border-4 border-white shadow-md"
          />
        </div>
        <h3 className="text-xl font-semibold text-green-800">Md Aktrul khan</h3>
        <p className="text-green-600 font-medium">Founder & Plant Specialist</p>
        <p className="mt-3 text-gray-600">
          With a deep passion for horticulture, Aktrul founded Afsana Nursery to share his knowledge 
          and bring rare plant varieties to enthusiasts across the region.
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg p-6 text-center transform transition-transform hover:scale-105 border border-green-100">
  <div className="relative inline-block mb-4">
    <div className="absolute inset-0 bg-green-200 rounded-full opacity-30 transform -rotate-6"></div>
    <div className="rounded-full relative z-10 mx-auto h-40 w-40 bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center">
      <FaLeaf className="text-green-600 text-5xl" />
    </div> 
  </div>
  <h3 className="text-xl font-semibold text-green-800">Join Our Team</h3>
  <p className="text-green-600 font-medium">We're Growing!</p>
  <p className="mt-3 text-gray-600">
    We're always looking for passionate plant enthusiasts to join our team. If you love plants and helping others, we'd love to hear from you.
  </p>
</div>
      
      <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-lg p-6 text-center transform transition-transform hover:scale-105 border border-green-100">
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-green-200 rounded-full opacity-30 transform -rotate-3"></div>
          <div className="rounded-full relative z-10 mx-auto h-40 w-40 bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center">
            <FaLeaf className="text-green-600 text-5xl" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-green-800">Our Gardeners</h3>
        <p className="text-green-600 font-medium">Plant Care Specialists</p>
        <p className="mt-3 text-gray-600">
          Our team of dedicated gardeners ensures that every plant in our nursery 
          receives expert care from seed to sale.
        </p>
      </div>
    </div>
  </div>
</section>

        {/* Our Services Section */}
        <section>
          <div className="bg-white rounded-lg shadow-md p-8 border border-green-100">
            <div className="flex items-center mb-6">
              <FaLeaf className="text-green-600 mr-3 text-2xl" />
              <h2 className="text-3xl font-bold text-green-800">Our Services</h2>
            </div>
            
            <p className="text-lg text-gray-700 mb-8">
              At <span className="font-bold text-green-600"> Afsana Nursery </span>, we offer comprehensive services to meet all your gardening needs:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start p-4 border-l-4 border-green-500 bg-gradient-to-br from-green-50 to-yellow-50">
                <div className="ml-4">
                  <h3 className="font-semibold text-green-800">Premium Plant Selection</h3>
                  <p className="text-gray-600 mt-1">
                    Carefully curated collection of healthy, high-quality plants for every space and purpose
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 border-l-4 border-yellow-500 bg-gradient-to-br from-green-50 to-yellow-50">
                <div className="ml-4">
                  <h3 className="font-semibold text-green-800">Garden Consultation</h3>
                  <p className="text-gray-600 mt-1">
                    Expert advice on plant selection, garden design, and maintenance tailored to your specific needs
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 border-l-4 border-green-500 bg-gradient-to-br from-green-50 to-yellow-50">
                <div className="ml-4">
                  <h3 className="font-semibold text-green-800">Plant Care Education</h3>
                  <p className="text-gray-600 mt-1">
                    Workshops and resources to help you develop your gardening skills and knowledge
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 border-l-4 border-yellow-500 bg-gradient-to-br from-green-50 to-yellow-50">
                <div className="ml-4">
                  <h3 className="font-semibold text-green-800">Delivery & Installation</h3>
                  <p className="text-gray-600 mt-1">
                    Professional delivery and planting services to ensure your new plants get the best start
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
