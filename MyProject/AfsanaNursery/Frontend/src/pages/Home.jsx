import React, { useEffect, useState } from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'
import SummaryApi from '../common'
import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../store/categorySlice'
import AllProductCard from '../components/AllProductCard'
import { FaLeaf, FaSeedling, FaTree, FaHandHoldingHeart } from 'react-icons/fa'

const Home = () => {
  const dispatch = useDispatch()
  
  const [allcategories, setAllcategories] = useState([])
  const [horizontalCategories, setHorizontalCategories] = useState([])
  const [verticalCategories, setVerticalCategories] = useState([])

  // Existing fetch functions remain the same
  const fetchCategory = async() => {
    const response = await fetch(SummaryApi.fetchCategory.url)
    const dataResponse = await response.json()
    
    if(response){
      dispatch(setCategory(dataResponse.categories))
      setAllcategories(dataResponse.categories)
      
      // Distribute categories equally between horizontal and vertical components
      if (dataResponse.categories && dataResponse.categories.length > 0) {
        const categories = [...dataResponse.categories];
        const midpoint = Math.ceil(categories.length / 2);
        
        setHorizontalCategories(categories.slice(0, midpoint));
        setVerticalCategories(categories.slice(midpoint));
      }
    }
  }
  
  const fetchallProduct = async() => {
    const response = await fetch(SummaryApi.fetchallProduct.url)
    const dataResponse = await response.json()
    
    if(response){
      dispatch(setCategory(dataResponse.categories))
    }
  }

  useEffect(() => {
    fetchCategory();
    fetchallProduct();
  },[])

  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen">
      {/* Hero section with new pattern overlay */}
      <div className="relative overflow-hidden bg-gradient-to-b from-green-300 via-yellow-500 to-green-800 text-white">
        {/* Pattern overlay remains the same */}
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
               backgroundSize: '30px'
             }}>
        </div>
        <div className="container mx-auto py-12 px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Grow Your Green Paradise</h1>
              <p className="text-lg mb-6 text-green-100">Discover our wide range of plants to create your own thriving garden oasis.</p>
              <div className="flex flex-wrap gap-4">
                <a href="/product-category" className="bg-white text-green-800 px-6 py-3 rounded-lg font-medium hover:bg-green-100 transition-colors shadow-lg flex items-center">
                  <FaLeaf className="mr-2" /> Shop Now
                </a>
                <a href="#categories" className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-green-800 transition-colors flex items-center">
                  <FaTree className="mr-2" /> Explore Categories
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-green-500 rounded-full opacity-20"></div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-300 rounded-full opacity-30"></div>
                <div className="bg-white p-3 rounded-lg shadow-xl transform rotate-1">
                  <BannerProduct />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section - New addition */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Why Choose Afsana Nursery?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We provide the highest quality plants and exceptional service to help you create your dream garden.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-green-50 p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLeaf className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Premium Plants</h3>
              <p className="text-gray-600">Carefully selected and nurtured plants for your home and garden.</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSeedling className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Expert Advice</h3>
              <p className="text-gray-600">Get guidance from our experienced gardeners for plant care.</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandHoldingHeart className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Sustainable Practices</h3>
              <p className="text-gray-600">Eco-friendly growing methods that respect our environment.</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTree className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Wide Selection</h3>
              <p className="text-gray-600">From ornamental to fruit-bearing plants, find everything you need.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category list with decorative elements */}
      <div id="categories" className="py-16 relative bg-gradient-to-b from-white to-green-50">
        <div className="absolute top-0 right-0 w-40 h-40 bg-green-100 rounded-full -translate-y-1/2 translate-x-1/4 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-200 rounded-full translate-y-1/4 -translate-x-1/4 opacity-40"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-center mb-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-green-800 mb-3">Browse Categories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Explore our diverse collection of plants categorized for your convenience</p>
            </div>
          </div>
          <CategoryList/>
        </div>
      </div>

      {/* Featured products with alternating background */}
      <div className="py-8">
        {horizontalCategories?.map((category, index) => (
          <div key={category._id || index} className={`py-10 ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}`}>
            <div className="container mx-auto px-4">
              <HorizontalCardProduct 
                category={category.name} 
                heading={category.name}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Vertical product display with decorative elements */}
      <div className="py-12 relative bg-gradient-to-b from-white to-green-50">
        <div className="absolute top-0 left-1/4 w-24 h-24 bg-green-100 rounded-full opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-40"></div>
        
        <div className="container mx-auto px-4 relative">
          {verticalCategories?.map((category, index) => (
            <div key={category._id || index} className="mb-16">
              <VerticalCardProduct 
                category={category.name} 
                heading={category.name}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial section - New addition */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-3">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Hear from plant lovers who have transformed their spaces with our plants</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-700 font-bold">A</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Ayan Dey</h3>
                  <p className="text-sm text-gray-500">Garden Enthusiast</p>
                  <p className="text-sm text-gray-500">⭐⭐⭐⭐⭐</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"The plants I received from Afsana Nursery were incredibly healthy and well-packaged. They've thrived in my garden and the customer service was exceptional!"</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-700 font-bold">P</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Priya Patel</h3>
                  <p className="text-sm text-gray-500">Home Gardener</p>
                  <p className="text-sm text-gray-500">⭐⭐⭐⭐</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"I'm a beginner at gardening, and the team at Afsana Nursery provided me with all the guidance I needed. My balcony garden is flourishing thanks to their expert advice!"</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-700 font-bold">DK</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Karfa</h3>
                  <p className="text-sm text-gray-500">Landscape Designer</p>
                  <p className="text-sm text-gray-500">⭐⭐⭐⭐⭐</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"As a professional landscaper, I rely on quality plants for my projects. Afsana Nursery consistently delivers premium plants that impress my clients. Highly recommended!"</p>
            </div>
          </div>
        </div>
      </div>

      {/* All products section with accent background */}
      <div className="py-16 bg-gradient-to-r from-green-800 via-yellow-600 to-green-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
               backgroundSize: '30px'
             }}>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Explore Our Collection</h2>
            <p className="text-yellow-100 max-w-2xl mx-auto">Discover all the beautiful plants available at Afsana Nursery</p>
          </div>
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
            <AllProductCard category={"All Plants"} heading={"All Nursery Plants"}/>
          </div>
        </div>
      </div>

      {/* Call to action - New addition */}
      <div className="py-16 bg-green-100">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h2 className="text-3xl font-bold text-green-800 mb-3">Ready to Transform Your Space?</h2>
              <p className="text-gray-600">Visit Afsana Nursery today or contact us for personalized plant recommendations.</p>
            </div>
            <div className="md:w-1/3 flex justify-center md:justify-end">
              <a href="/contact" className="bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg flex items-center">
                <FaHandHoldingHeart className="mr-2" /> Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home