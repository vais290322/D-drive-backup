import React, { useContext } from 'react'
import scrollTop from '../helpers/scrollTop'
import displayINRCurrency from '../helpers/displayCurrency'
import Context from '../context'
import addToCart from '../helpers/addToCart'
import { Link } from 'react-router-dom'

const VerticalCard = ({loading, data = []}) => {
    const loadingList = new Array(13).fill(null)
    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async(e,id)=>{
       await addToCart(e,id)
       fetchUserAddToCart()
    }
    
    const PhoneNumber = import.meta.env.VITE_PHONE_NUMBER;

    const handleEnquireNow = (product) => {
        const phoneNumber = PhoneNumber;
        const message = `Hello, I'm interested in the product: ${product.productName}. Can you provide more details?`;
        const encodedMessage = encodeURIComponent(message);
        
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center'>
    {
         loading ? (
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
             data.length > 0 ? (
                 data.map((product,index)=>{
                     return(
                         <div key={index} className='group relative w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 mx-auto'>
                             <Link to={"/product/"+product?._id} className='block' onClick={scrollTop}>
                                 <div className='bg-green-50 h-48 p-4 flex justify-center items-center overflow-hidden rounded-t-lg'>
                                     <img 
                                         src={product?.productImage[0]} 
                                         className='object-contain h-full group-hover:scale-110 transition-all duration-500 mix-blend-multiply'
                                         alt={product?.productName}
                                     />
                                     <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300"></div>
                                 </div>
                                 <div className='p-4 grid gap-3'>
                                     <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-gray-800 group-hover:text-green-700 transition-colors'>{product?.productName}</h2>
                                     <p className='capitalize text-gray-500 text-sm'>{product?.category}</p>
                                     {/* <div className='flex gap-3'>
                                         <p className='text-green-600 font-medium'>{ displayINRCurrency(product?.sellingPrice) }</p>
                                         <p className='text-slate-500 line-through'>{ displayINRCurrency(product?.price)  }</p>
                                     </div> */}
                                     {/* <button className='text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-0.5 rounded-full' onClick={(e)=>handleAddToCart(e,product?._id)}>Add to Cart</button> */}

                                     <button 
                                         className='text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center' 
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
                             <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                 View Details
                             </div>
                         </div>
                     ) 
                 })
             ) : (
                 <div className="col-span-full text-center py-10">
                     <p className="text-gray-500 text-lg">No products available.</p>
                 </div>
             )
         )
     }
    </div>
  )
}

export default VerticalCard