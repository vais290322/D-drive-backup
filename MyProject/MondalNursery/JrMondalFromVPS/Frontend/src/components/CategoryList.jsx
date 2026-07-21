import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/index'
import { Link } from 'react-router-dom'

const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([])
    const [loading, setLoading] = useState(false)

    const categoryLoading = new Array(13).fill(null)

    const fetchCategoryProduct = async () => {
        setLoading(true)
        const response = await fetch(SummaryApi.categoryProduct.url)
        const dataResponse = await response.json()
        setLoading(false)
        setCategoryProduct(dataResponse.data)
    }

    useEffect(() => {
        fetchCategoryProduct()
    }, [])

    return (
        <div className='container mx-auto p-4'>
            <div className='grid grid-flow-col auto-cols-max gap-4 overflow-x-auto scrollbar-none pb-4'>
                {
                    loading ? (
                        categoryLoading.map((el, index) => {
                            return (
                                <div className='flex flex-col items-center' key={"categoryLoading" + index}>
                                    <div className='h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse'>
                                    </div>
                                    <div className='h-4 w-16 bg-slate-200 animate-pulse mt-2 rounded'></div>
                                </div>
                            )
                        })
                    ) :
                        (
                            categoryProduct.map((product, index) => {
                                return (
                                    <Link
                                        to={"/product-category?category=" + product?.category}
                                        className='flex flex-col items-center min-w-[80px] md:min-w-[100px]'
                                        key={product?.category}
                                    >
                                        <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center'>
                                            <img
                                                src={product?.productImage[0]?.url}
                                                alt={product?.category}
                                                className='w-full h-full object-cover mix-blend-multiply hover:scale-110 transition-all rounded-full'
                                            />
                                        </div>
                                        <p className='text-center text-sm md:text-base capitalize mt-2 w-full truncate'>
                                            {product?.category}
                                        </p>
                                    </Link>
                                )
                            })
                        )
                }
            </div>
        </div>
    )
}

export default CategoryList