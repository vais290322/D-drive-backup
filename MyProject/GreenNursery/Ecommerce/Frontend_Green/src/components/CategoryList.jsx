import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/index'
import { Link } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'

const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([])
    const [loading, setLoading] = useState(false)
    const [showMangoSubcategories, setShowMangoSubcategories] = useState(false)
    
    const categoryLoading = new Array(32).fill(null)

    const fetchCategoryProduct = async() => {
        setLoading(true)
        const response = await fetch(SummaryApi.categoryProduct.url)
        const dataResponse = await response.json()
        setLoading(false)
        setCategoryProduct(dataResponse.data)
    }

    useEffect(() => {
        fetchCategoryProduct()
    }, [])

    const handleMangoVarietyClick = (e) => {
        e.preventDefault()
        setShowMangoSubcategories(true)
    }

    // Close modal when clicking outside or pressing escape
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                setShowMangoSubcategories(false)
            }
        }

        const handleClickOutside = (event) => {
            if (showMangoSubcategories && 
                !event.target.closest('.mango-subcategory-popup') && 
                !event.target.closest('.mango-category-item')) {
                setShowMangoSubcategories(false)
            }
        }

        document.addEventListener('keydown', handleEscapeKey)
        document.addEventListener('mousedown', handleClickOutside)
        
        return () => {
            document.removeEventListener('keydown', handleEscapeKey)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showMangoSubcategories])

    return (
        <div className='container mx-auto p-4'>
            <div className='flex items-center gap-4 justify-between overflow-scroll scrollbar-none'>
                {
                    loading ? (
                        categoryLoading.map((el, index) => {
                            return (
                                <div className='h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse' key={"categoryLoading"+index}>
                                </div>
                            )
                        })  
                    ) : (
                        categoryProduct.map((product, index) => {
                            // Changed from "Mango Variety" to "Mango Veriety" to match backend data
                            if (product?.category === "Mango Veriety") {
                                return (
                                    <div key={product?.category} className="cursor-pointer mango-category-item" onClick={handleMangoVarietyClick}>
                                        <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center'>
                                            <img src={product?.productImage[0]} alt={product?.category} className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'/>
                                        </div>
                                        <p className='text-center text-sm md:text-base capitalize'>{product?.category}</p>
                                    </div>
                                )
                            } else {
                                return (
                                    <Link to={"/product-category?category="+product?.category} className='cursor-pointer' key={product?.category}>
                                        <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center'>
                                            <img src={product?.productImage[0]} alt={product?.category} className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'/>
                                        </div>
                                        <p className='text-center text-sm md:text-base '>{product?.category}</p>
                                    </Link>
                                )
                            }
                        })
                    )
                }
            </div>

            {/* Mango Subcategory Modal */}
            {showMangoSubcategories && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center mango-subcategory-popup">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 relative">
                        <button 
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowMangoSubcategories(false)}
                        >
                            <FaTimes />
                        </button>
                        
                        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">All Sub Categories</h2>
                        
                        <div className="space-y-4">
                            <Link 
                                to="/product-category?category=Mango+Veriety&subcategory=thai" 
                                className="flex items-center gap-4 p-3 hover:bg-green-50 rounded-lg transition-colors"
                                onClick={() => setShowMangoSubcategories(false)}
                            >
                                <div className="w-16 h-16 rounded-full overflow-hidden">
                                    <img 
                                        src="https://res.cloudinary.com/ddxvyhwef/image/upload/v1745647342/nhxyf9jiiuaikslrbdzz.jpg" 
                                        alt="Thai Mango" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-green-700 font-medium">Thai Veriety</span>
                            </Link>
                            
                            <Link 
                                to="/product-category?category=Mango+Veriety&subcategory=indian" 
                                className="flex items-center gap-4 p-3 hover:bg-green-50 rounded-lg transition-colors"
                                onClick={() => setShowMangoSubcategories(false)}
                            >
                                <div className="w-16 h-16 rounded-full overflow-hidden">
                                    <img 
                                        src="https://res.cloudinary.com/ddxvyhwef/image/upload/v1745647165/umq3aolx2hwbpaxgscki.jpg" 
                                        alt="Indian Mango" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-green-700 font-medium">Indian Veriety</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CategoryList