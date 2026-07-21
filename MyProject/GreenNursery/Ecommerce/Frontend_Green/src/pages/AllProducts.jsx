import React, { useEffect, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryApi from '../common/index'
import AdminProductCard from '../components/AdminProductCard'
import { setCategory } from '../store/categorySlice'
import { useDispatch } from 'react-redux'
import { FaPlus, FaLeaf, FaBoxOpen } from 'react-icons/fa'

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false)
  const [allProduct, setAllProduct] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()

  const fetchAllProduct = async() => {
    setIsLoading(true)
    try {
      const response = await fetch(SummaryApi.allProduct.url)
      const dataResponse = await response.json()
      setAllProduct(dataResponse?.data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategory = async() => {
    try {
      const response = await fetch(SummaryApi.fetchCategory.url)
      const dataResponse = await response.json()
      
      if(response.ok) {
        dispatch(setCategory(dataResponse.categories))
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    fetchAllProduct()
    fetchCategory()
  }, [])
  
  return (
    <div>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-2xl font-bold text-emerald-800 flex items-center'>
            <FaBoxOpen className="mr-2 text-emerald-600" />
            Product Management
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage and organize your product inventory
          </p>
        </div>
        <button 
          className='bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow flex items-center gap-2'
          onClick={() => setOpenUploadProduct(true)}
        >
          <FaPlus size={14} />
          Add New Product
        </button>
      </div>

      {/* Product Count Summary */}
      <div className="bg-emerald-50 rounded-lg p-4 mb-6 border border-emerald-100">
        <div className="flex items-center">
          <FaLeaf className="text-emerald-600 mr-2" />
          <h3 className="font-medium text-emerald-800">Product Inventory</h3>
        </div>
        <p className="text-gray-600 mt-1">
          You currently have <span className="font-medium text-emerald-700">{allProduct.length}</span> products in your inventory.
        </p>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
        </div>
      ) : allProduct.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[calc(100vh-280px)] overflow-y-auto pr-2'>
          {allProduct.map((product, index) => (
            <AdminProductCard 
              data={product} 
              key={index + "allProduct"} 
              fetchdata={fetchAllProduct}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-emerald-600 text-5xl mb-4 flex justify-center">
            <FaBoxOpen />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No Products Found</h3>
          <p className="text-gray-600 mb-6">
            You haven't added any products to your inventory yet.
          </p>
          <button 
            className='bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow flex items-center gap-2 mx-auto'
            onClick={() => setOpenUploadProduct(true)}
          >
            <FaPlus size={14} />
            Add Your First Product
          </button>
        </div>
      )}

      {/* Upload Product Modal */}
      {openUploadProduct && (
        <UploadProduct 
          onClose={() => setOpenUploadProduct(false)} 
          fetchData={fetchAllProduct}
        />
      )}
    </div>
  )
}

export default AllProducts