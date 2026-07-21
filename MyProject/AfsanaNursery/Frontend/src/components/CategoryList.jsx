import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/index'
import { Link } from 'react-router-dom'
import { FaTimes, FaLeaf } from 'react-icons/fa'

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
            <div className='flex items-center gap-4 justify-start overflow-x-auto pb-4 scrollbar-none'>
                {
                    loading ? (
                        categoryLoading.map((el, index) => {
                            return (
                                <div className='h-16 w-16 md:w-20 md:h-20 rounded-full flex-shrink-0 overflow-hidden bg-teal-200 animate-pulse' key={"categoryLoading"+index}>
                                </div>
                            )
                        })  
                    ) : (
                        categoryProduct.map((product, index) => {
                            // Changed from "Mango Variety" to "Mango Veriety" to match backend data
                            if (product?.category === "Mango Veriety") {
                                return (
                                    <div key={product?.category} className="cursor-pointer flex-shrink-0 mango-category-item" onClick={handleMangoVarietyClick}>
                                        <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-gradient-to-br from-green-200 to-yellow-100 flex items-center justify-center border border-green-600'>
                                            <img src={product?.productImage[0]} alt={product?.category} className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'/>
                                        </div>
                                        <p className='text-center text-sm md:text-base capitalize text-green-800'>{product?.category}</p>
                                    </div>
                                )
                            } else {
                                return (
                                    <Link to={"/product-category?category="+product?.category} className='cursor-pointer flex-shrink-0' key={product?.category}>
                                        <div> 
                                        <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-gradient-to-br from-green-200 to-yellow-100 flex items-center justify-center border border-green-600'>
                                            <img src={product?.productImage[0]} alt={product?.category} className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'/>
                                        </div>
                                        <p className='text-center text-sm md:text-base text-green-800'>{product?.category}</p>
                                    </div>
                                </Link>
                                )
                            }
                        })
                    )
                }
            </div>

            {/* Mango Subcategory Modal remains the same */}
        </div>
    )
}

export default CategoryList