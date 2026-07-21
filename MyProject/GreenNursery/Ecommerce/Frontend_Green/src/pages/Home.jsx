import React, { useEffect, useState } from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'
import SummaryApi from '../common'
import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../store/categorySlice'
import AllProductCard from '../components/AllProductCard'
import { FaLeaf } from 'react-icons/fa'

const Home = () => {
  const dispatch = useDispatch()
  
  const [allcategories, setAllcategories] = useState([])
  const [horizontalCategories, setHorizontalCategories] = useState([])
  const [verticalCategories, setVerticalCategories] = useState([])

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
    <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen">
      {/* Hero section with pattern overlay */}
      <div className="relative overflow-hidden bg-emerald-800 text-white">
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '20px'
             }}>
        </div>
        <div className="container mx-auto py-8 px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Bring Nature Home</h1>
              <p className="text-lg mb-6 text-emerald-100">Discover our wide range of plants to transform your space into a green sanctuary.</p>
              <div className="flex gap-4">
                <a href="/product-category" className="bg-white text-emerald-800 px-6 py-3 rounded-lg font-medium hover:bg-emerald-100 transition-colors shadow-lg">
                  Shop Now
                </a>
                <a href="#categories" className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-emerald-800 transition-colors">
                  Explore Categories
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-emerald-500 rounded-full opacity-20"></div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-emerald-300 rounded-full opacity-30"></div>
                <div className="bg-white p-2 rounded-lg shadow-xl">
                  <BannerProduct />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category list with decorative elements */}
      <div id="categories" className="py-12 relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-100 rounded-full -translate-y-1/2 translate-x-1/4 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-200 rounded-full translate-y-1/4 -translate-x-1/4 opacity-40"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center mb-8">
            <FaLeaf className="text-emerald-600 mr-2 text-xl" />
            <h2 className="text-2xl md:text-3xl font-bold text-emerald-800">Browse Categories</h2>
          </div>
          <CategoryList/>
        </div>
      </div>

      {/* Featured products with alternating background */}
      <div className="py-8">
        {horizontalCategories.map((category, index) => (
          <div key={category._id || index} className={`py-10 ${index % 2 === 0 ? 'bg-emerald-50' : 'bg-white'}`}>
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
      <div className="py-8 relative bg-gradient-to-b from-white to-emerald-50">
        <div className="absolute top-0 left-1/4 w-24 h-24 bg-emerald-100 rounded-full opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-emerald-200 rounded-full opacity-40"></div>
        
        <div className="container mx-auto px-4 relative">
          {verticalCategories.map((category, index) => (
            <div key={category._id || index} className="mb-16">
              <VerticalCardProduct 
                category={category.name} 
                heading={category.name}
              />
            </div>
          ))}
        </div>
      </div>

      {/* All products section with accent background */}
      <div className="py-12 bg-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '20px'
             }}>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center mb-8">
            <FaLeaf className="text-emerald-300 mr-2 text-xl" />
            <h2 className="text-2xl md:text-3xl font-bold">All Nursery Plants</h2>
          </div>
          <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg">
            <AllProductCard category={"All Plants"} heading={"All Nursery Plants"}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home