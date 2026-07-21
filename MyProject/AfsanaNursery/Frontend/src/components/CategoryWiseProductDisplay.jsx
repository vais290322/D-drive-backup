import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight, FaLeaf } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import scrollTop from '../helpers/scrollTop'

const CategroyWiseProductDisplay = ({category, heading}) => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(true)
    const loadingList = new Array(13).fill(null)
    const [filteredData, setFilteredData] = useState([])
    const [activeSubcategory, setActiveSubcategory] = useState('all')

    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async(e,id)=>{
       await addToCart(e,id)
       fetchUserAddToCart()
    }

    const PhoneNumber = import.meta.env.VITE_PHONE_NUMBER

    const fetchData = async() =>{
        setLoading(true)
        const categoryProduct = await fetchCategoryWiseProduct(category)
        setLoading(false)
        setData(categoryProduct?.data || [])
        setFilteredData(categoryProduct?.data || [])
    }

    useEffect(()=>{
        fetchData()
    },[])

    // Filter data based on subcategory
    useEffect(() => {
        if (category === "Mango Veriety") {
            if (activeSubcategory === 'all') {
                setFilteredData(data)
            } else if (activeSubcategory === 'thai') {
                const thaiMangos = data.filter(product => 
                    product.productName.toLowerCase().includes('thai')
                )
                setFilteredData(thaiMangos)
            } else if (activeSubcategory === 'indian') {
                const indianMangos = data.filter(product => 
                    !product.productName.toLowerCase().includes('thai')
                )
                setFilteredData(indianMangos)
            }
        } else {
            setFilteredData(data)
        }
    }, [activeSubcategory, data, category])

    const handleEnquireNow = (product) => {
        const phoneNumber = PhoneNumber;
        const message = `Hello, I'm interested in the product: ${product.productName}. Can you provide more details?`;
        const encodedMessage = encodeURIComponent(message);
        
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    };

  return (
    <div className='container mx-auto px-4 my-10 relative'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold text-green-800 py-2 border-b-2 border-yellow-500 inline-block md:flex items-center'>
          <FaLeaf className="mr-2 text-green-600" />
          {heading}
        </h2>
      </div>
      
      {/* Subcategory filter for Mango Variety */}
      {category === "Mango Veriety" && (
        <div className='flex gap-3 mb-4'>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeSubcategory === 'all' ? 'bg-gradient-to-r from-green-600 to-yellow-500 text-white' : 'bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 hover:from-green-200 hover:to-yellow-200'}`}
            onClick={() => setActiveSubcategory('all')}
          >
            All Mangos
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeSubcategory === 'thai' ? 'bg-gradient-to-r from-green-600 to-yellow-500 text-white' : 'bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 hover:from-green-200 hover:to-yellow-200'}`}
            onClick={() => setActiveSubcategory('thai')}
          >
            Thai Mangos
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeSubcategory === 'indian' ? 'bg-gradient-to-r from-green-600 to-yellow-500 text-white' : 'bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 hover:from-green-200 hover:to-yellow-200'}`}
            onClick={() => setActiveSubcategory('indian')}
          >
            Indian Mangos
          </button>
        </div>
      )}
                
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center'>
        {loading ? (
          loadingList.map((product,index)=>{
            return(
              <div key={index} className='w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mx-auto'>
                <div className='bg-slate-200 h-48 p-4 flex justify-center items-center animate-pulse rounded-t-lg'>
                </div>
                <div className='p-4 grid gap-3'>
                  <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200'></h2>
                  <p className='capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200 py-2'></p>
                  <div className='flex gap-3'>
                    <p className='text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full py-2'></p>
                    <p className='text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full py-2'></p>
                  </div>
                  <button className='text-sm text-white px-3 rounded-full bg-slate-200 py-2 animate-pulse'></button>
                </div>
              </div>
            )
          })
        ) : (
          filteredData && filteredData.length > 0 ? (
            filteredData.map((product,index)=>{
              return(
                <div key={product?._id || index} className='group relative w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-green-100 mx-auto'>
                  <Link to={"/product/"+product?._id} className='block' onClick={scrollTop}>
                    <div className='bg-gradient-to-br from-green-50 to-yellow-50 h-48 p-4 flex justify-center items-center overflow-hidden rounded-t-lg'>
                      <img 
                        src={product.productImage[0]} 
                        className='object-contain h-full group-hover:scale-110 transition-all duration-500 mix-blend-multiply'
                        alt={product?.productName}
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300"></div>
                    </div>
                    <div className='p-4 grid gap-3'>
                      <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-gray-800 group-hover:text-green-700 transition-colors'>{product?.productName}</h2>
                      <p className='capitalize text-gray-500 text-sm'>{product?.category}</p>
                      <button 
                        className='text-sm bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white px-4 py-1.5 rounded-full shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center' 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEnquireNow(product);
                        }}
                      >
                        Enquire Now
                      </button>
                    </div>
                  </Link>
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Details
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default CategroyWiseProductDisplay