import React from "react";
import profile1 from "../assest/logo/profile1.jpg";
import profile2 from "../assest/logo/profile2.jpg";
import dada1 from "../assest/logo/dada1.jpeg";
import bhai2 from "../assest/logo/bhai2.jpeg";
import bhai6 from "../assest/logo/bhai6.jpg";
import { FaLeaf, FaSeedling, FaTree, FaHandHoldingHeart } from "react-icons/fa";

const About = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
            <p className="mt-4 text-emerald-100 max-w-2xl mx-auto">
              Bringing nature's beauty to your doorstep since 2015
            </p>
          </div>
        </header>
      </div>

      <main className="container mx-auto px-6 py-16">
        {/* Our Story Section */}
        <section className="mb-20 relative">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full opacity-50 z-0"></div>
          
          <div className="bg-white rounded-lg shadow-md p-8 relative z-10">
            <div className="flex items-center mb-6">
              <FaTree className="text-emerald-600 mr-3 text-2xl" />
              <h2 className="text-3xl font-bold text-emerald-800">Our Story</h2>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to <span className="font-bold text-emerald-700">Green City Nursery</span>, where 
              our passion for plants and sustainable gardening practices has been growing since our founding. 
              Our journey began with a simple vision: to create a haven for plant enthusiasts and novice gardeners alike, 
              offering quality plants that bring life and beauty to any space.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              <span className="font-bold text-emerald-700">Green City Nursery</span> started as a small 
              family-owned garden center with just a few varieties of local plants. Today, we've blossomed 
              into a comprehensive nursery offering hundreds of species, from ornamental flowers to fruit-bearing 
              trees, medicinal herbs to exotic houseplants. Our growth reflects our commitment to biodiversity 
              and our belief that everyone deserves access to the healing power of nature.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              What sets <span className="font-bold text-emerald-700">Green City Nursery</span> apart is our 
              dedication to education and sustainability. We don't just sell plants; we share knowledge, 
              offer guidance, and build a community of green enthusiasts. Every plant in our nursery is 
              grown with care, using sustainable practices that respect our environment and ensure the 
              health and vitality of each specimen.
            </p>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="mb-20 relative">
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-200 rounded-full opacity-40 z-0"></div>
          
          <div className="bg-white rounded-lg shadow-md p-8 relative z-10">
            <div className="flex items-center mb-6">
              <FaHandHoldingHeart className="text-emerald-600 mr-3 text-2xl" />
              <h2 className="text-3xl font-bold text-emerald-800">Our Mission</h2>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              At <span className="font-bold text-emerald-700">Green City Nursery</span>, our mission is to 
              promote environmental stewardship through the joy of gardening. We believe that by connecting 
              people with plants, we can foster a deeper appreciation for nature and inspire sustainable living practices.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-emerald-50 p-6 rounded-lg">
                <h3 className="font-semibold text-emerald-800 text-xl mb-3">Quality & Diversity</h3>
                <p className="text-gray-700">
                  We are committed to offering the highest quality plants with genetic diversity, 
                  ensuring healthier gardens and landscapes that thrive in various conditions.
                </p>
              </div>
              
              <div className="bg-emerald-50 p-6 rounded-lg">
                <h3 className="font-semibold text-emerald-800 text-xl mb-3">Education & Support</h3>
                <p className="text-gray-700">
                  We provide comprehensive guidance and resources to help our customers succeed, 
                  from plant selection to long-term care strategies.
                </p>
              </div>
              
              <div className="bg-emerald-50 p-6 rounded-lg">
                <h3 className="font-semibold text-emerald-800 text-xl mb-3">Sustainability</h3>
                <p className="text-gray-700">
                  We implement eco-friendly practices in our operations and promote sustainable 
                  gardening methods that minimize environmental impact.
                </p>
              </div>
              
              <div className="bg-emerald-50 p-6 rounded-lg">
                <h3 className="font-semibold text-emerald-800 text-xl mb-3">Community Building</h3>
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
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-8">
              <FaSeedling className="text-emerald-600 mr-3 text-2xl" />
              <h2 className="text-3xl font-bold text-emerald-800">Meet the Team</h2>
            </div>
            
            <p className="text-lg text-gray-700 mb-8">
              Our team of passionate plant experts is dedicated to helping you find the perfect 
              additions to your garden and providing the knowledge you need to help them thrive.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-emerald-50 rounded-lg p-6 text-center transform transition-transform hover:scale-105">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-emerald-200 rounded-full opacity-30 transform rotate-6"></div>
                  <img
                    src={bhai6}
                    alt="Team Member"
                    className="rounded-full relative z-10 mx-auto h-40 w-40 object-cover border-4 border-white shadow-md"
                  />
                </div>
                <h3 className="text-xl font-semibold text-emerald-800">Sahin Sardar</h3>
                <p className="text-emerald-600 font-medium">Owner</p>
                <p className="mt-3 text-gray-600">
                With over 15 years of experience in horticulture, Sahin brings expertise and 
                passion to every aspect of Green City Nursery.
                </p>
              </div>

              <div className="bg-emerald-50 rounded-lg p-6 text-center transform transition-transform hover:scale-105">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-emerald-200 rounded-full opacity-30 transform -rotate-6"></div>
                  <img
                    src={dada1}
                    alt="Team Member"
                    className="rounded-full relative z-10 mx-auto h-40 w-40 object-cover border-4 border-white shadow-md"
                  />
                </div>
                <h3 className="text-xl font-semibold text-emerald-800">Samim Ahamed</h3>
                <p className="text-emerald-600 font-medium">Advisor</p>
                <p className="mt-3 text-gray-600">
                  As our senior advisor with over 15 years of experience in horticulture, Samim provides strategic guidance 
                  and deep botanical knowledge. His expertise in sustainable growing practices and rare plant cultivation 
                  has been instrumental in shaping our nursery's vision and ecological approach.
                </p>
              </div>
              
             
              
              <div className="bg-emerald-50 rounded-lg p-6 text-center transform transition-transform hover:scale-105">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-emerald-200 rounded-full opacity-30 transform -rotate-3"></div>
                  <div className="rounded-full relative z-10 mx-auto h-40 w-40 bg-emerald-100 flex items-center justify-center">
                    <FaLeaf className="text-emerald-600 text-5xl" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-emerald-800">Our Gardeners</h3>
                <p className="text-emerald-600 font-medium">Plant Care Specialists</p>
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
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <FaLeaf className="text-emerald-600 mr-3 text-2xl" />
              <h2 className="text-3xl font-bold text-emerald-800">Our Services</h2>
            </div>
            
            <p className="text-lg text-gray-700 mb-8">
              At Green City Nursery, we offer comprehensive services to meet all your gardening needs:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start p-4 border-l-4 border-emerald-500 bg-emerald-50">
                <div className="ml-4">
                  <h3 className="font-semibold text-emerald-800">Premium Plant Selection</h3>
                  <p className="text-gray-600 mt-1">
                    Carefully curated collection of healthy, high-quality plants for every space and purpose
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 border-l-4 border-emerald-500 bg-emerald-50">
                <div className="ml-4">
                  <h3 className="font-semibold text-emerald-800">Expert Consultation</h3>
                  <p className="text-gray-600 mt-1">
                    Personalized advice from our plant specialists to help you make the right choices
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 border-l-4 border-emerald-500 bg-emerald-50">
                <div className="ml-4">
                  <h3 className="font-semibold text-emerald-800">Nationwide Delivery</h3>
                  <p className="text-gray-600 mt-1">
                    Safe and reliable shipping of plants to your doorstep, with special packaging to ensure freshness
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 border-l-4 border-emerald-500 bg-emerald-50">
                <div className="ml-4">
                  <h3 className="font-semibold text-emerald-800">Aftercare Support</h3>
                  <p className="text-gray-600 mt-1">
                    Ongoing guidance and troubleshooting to help your plants thrive long after purchase
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 border-l-4 border-emerald-500 bg-emerald-50">
                <div className="ml-4">
                  <h3 className="font-semibold text-emerald-800">Gardening Workshops</h3>
                  <p className="text-gray-600 mt-1">
                    Educational sessions to enhance your gardening skills and knowledge
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 border-l-4 border-emerald-500 bg-emerald-50">
                <div className="ml-4">
                  <h3 className="font-semibold text-emerald-800">Satisfaction Guarantee</h3>
                  <p className="text-gray-600 mt-1">
                    Our commitment to your satisfaction with easy returns and replacements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-emerald-800 text-white py-8 relative overflow-hidden">
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
  );
};

export default About;
