import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight, FaLeaf } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'

const HorizontalCardProduct = ({category, heading}) => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(true)
    const loadingList = new Array(13).fill(null)
    const [filteredData, setFilteredData] = useState([])
    const [activeSubcategory, setActiveSubcategory] = useState('all')

    const [scroll,setScroll] = useState(0)
    const scrollElement = useRef()
    const PhoneNumber = import.meta.env.VITE_PHONE_NUMBER;


    const { fetchUserAddToCart } = useContext(Context)

    // const handleAddToCart = async(e,id)=>{
    //    await addToCart(e,id)
    //    fetchUserAddToCart()
    // }

    const fetchData = async() =>{
        setLoading(true)
        const categoryProduct = await fetchCategoryWiseProduct(category)
        // console.log(categoryProduct)
        setLoading(false)

        setData(categoryProduct?.data)
        setFilteredData(categoryProduct?.data)
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

    const scrollRight = () =>{
        scrollElement.current.scrollLeft += 300
    }
    const scrollLeft = () =>{ 
        scrollElement.current.scrollLeft -= 300
    }

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
        <div className='hidden md:flex gap-2'>
          <button className='bg-green-50 hover:bg-green-100 text-green-700 shadow-md rounded-full p-2 transition-all duration-300' onClick={scrollLeft}>
            <FaAngleLeft className="text-xl"/>
          </button>
          <button className='bg-green-50 hover:bg-green-100 text-green-700 shadow-md rounded-full p-2 transition-all duration-300' onClick={scrollRight}>
            <FaAngleRight className="text-xl"/>
          </button>
        </div>
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
                
      <div className='flex items-center gap-4 md:gap-6 overflow-x-auto scrollbar-none transition-all pb-4' ref={scrollElement}>
        <button className='bg-white shadow-md rounded-full p-2 absolute left-0 text-xl md:hidden z-10 bg-opacity-80 backdrop-blur-sm' onClick={scrollLeft}>
          <FaAngleLeft/>
        </button>
        <button className='bg-white shadow-md rounded-full p-2 absolute right-0 text-xl md:hidden z-10 bg-opacity-80 backdrop-blur-sm' onClick={scrollRight}>
          <FaAngleRight/>
        </button> 

        {loading ? (
          loadingList.map((product,index)=>{
            return(
              <div key={index} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-40 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex overflow-hidden'>
                <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] animate-pulse'>
                </div>
                <div className='p-4 grid w-full gap-2'>
                  <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black bg-slate-200 animate-pulse p-1 rounded-full'></h2>
                  <p className='capitalize text-slate-500 p-1 bg-slate-200 animate-pulse rounded-full'></p>
                  <div className='flex gap-3 w-full'>
                    <p className='text-red-600 font-medium p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
                    <p className='text-slate-500 line-through p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
                  </div>
                  <button className='text-sm text-white px-3 py-0.5 rounded-full w-full bg-slate-200 animate-pulse'></button>
                </div>
              </div>
            )
          })
        ) : (
          filteredData.map((product,index)=>{
            return(
              <div key={product?._id} className='group relative w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-40 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex overflow-hidden border border-green-100'>
                <Link to={"product/"+product?._id} className='flex w-full'>
                  <div className='bg-gradient-to-br from-green-50 to-yellow-50 h-full p-4 min-w-[120px] md:min-w-[145px] flex items-center justify-center'>
                    <img 
                      src={product.productImage[0]} 
                      className='object-contain h-full group-hover:scale-110 transition-all duration-300 mix-blend-multiply'
                      alt={product?.productName}
                    />
                  </div>
                  <div className='p-4 grid content-between w-full'>
                    <div>
                      <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-gray-800 group-hover:text-green-700 transition-colors'>{product?.productName}</h2>
                      <p className='capitalize text-gray-500 text-sm'>{product?.category}</p>
                    </div>
                    <div className='flex justify-end'>
                      <button 
                        className='text-sm bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white px-4 py-1 rounded-full shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center' 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEnquireNow(product);
                        }}
                      >
                        Enquire Now
                      </button>
                    </div>
                  </div>
                </Link>
                <div className="absolute cursor-pointer top-2 right-2 bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View Details
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default HorizontalCardProduct