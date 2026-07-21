import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SummaryApi from '../common/index'
import VerticalCard from '../components/VerticalCard'
import { FaSearch, FaSadTear, FaLeaf } from 'react-icons/fa'

const SearchProduct = () => {
    const query = useLocation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const fetchProduct = async() => {
        setLoading(true)
        const response = await fetch(SummaryApi.searchProduct.url + query.search)
        const dataResponse = await response.json()
        setLoading(false)

        setData(dataResponse.data)
        
        // Extract search term from query
        const params = new URLSearchParams(query.search)
        setSearchTerm(params.get('q') || '')
    }

    useEffect(() => {
        fetchProduct()
    }, [query])

    return (
        <div className='bg-gradient-to-b from-green-50 to-white min-h-screen py-8'>
            <div className='container mx-auto px-4'>
                {/* Search Header */}
                <div className='mb-8'>
                    <h1 className='text-2xl md:text-3xl font-bold text-green-800 mb-2 flex items-center gap-2'>
                        <FaSearch className="text-green-600" />
                        Search Results
                    </h1>
                    {searchTerm && (
                        <p className='text-gray-600'>
                            Showing results for "<span className='font-medium text-green-700'>{searchTerm}</span>"
                        </p>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className='bg-white rounded-lg shadow-md p-8 text-center border border-green-100'>
                        <div className='flex justify-center mb-4'>
                            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600'></div>
                        </div>
                        <p className='text-lg text-gray-600'>Searching for products...</p>
                    </div>
                )}

                {/* Results Count */}
                {!loading && (
                    <div className='bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center border border-green-100'>
                        <p className='font-medium text-gray-700'>
                            Found <span className='text-green-700 font-bold'>{data.length}</span> {data.length === 1 ? 'product' : 'products'}
                        </p>
                        
                        {data.length > 0 && (
                            <a href="/product-category" className='text-green-600 hover:text-green-700 text-sm font-medium'>
                                Browse all categories
                            </a>
                        )}
                    </div>
                )}

                {/* No Results */}
                {data.length === 0 && !loading && (
                    <div className='bg-white rounded-lg shadow-md p-8 text-center border border-green-100'>
                        <div className='flex justify-center mb-4'>
                            <FaSadTear className='text-green-400 text-5xl' />
                        </div>
                        <h2 className='text-xl font-semibold text-gray-700 mb-2'>No products found</h2>
                        <p className='text-gray-500 mb-6'>We couldn't find any products matching your search.</p>
                        <div className='flex justify-center'>
                            <a href="/product-category" className='bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white px-6 py-2 rounded-lg transition-colors shadow-sm hover:shadow flex items-center justify-center gap-2'>
                                <FaLeaf size={14} />
                                Browse all products
                            </a>
                        </div>
                    </div>
                )}

                {/* Product Results */}
                {data.length !== 0 && !loading && (
                    <div className='mb-8'>
                        <VerticalCard loading={loading} data={data} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchProduct