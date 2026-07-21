import React from 'react'

import { useNavigate } from 'react-router-dom'

const ErrorPage = () => {
    const navigate=useNavigate()
    return (
        <div className='flex justify-center items-center flex-col py-8'>
            <h1 className='font-extrabold text-red-600 text-8xl animate-ping pb-8'>404</h1>
            <h3 className=' text-3xl font-semibold text-blue-600 pb-8'>Page Not Found</h3>

            <button onClick={()=>navigate("/")} className='text-green-600 bg-black font-bold hover:bg-neutral-700  rounded-full px-4 py-2 hover:animate-pulse'>Go Back</button>




        </div>
    )
}

export default ErrorPage
