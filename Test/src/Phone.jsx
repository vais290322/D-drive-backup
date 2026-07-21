import React from 'react'
import { FaRegSquare, FaRegCircle, FaCircle  } from "react-icons/fa";
import { TiMediaPlayReverseOutline } from "react-icons/ti";

const Phone = () => {
    return (
        <div className='relative w-full h-screen mt-16'>
            <div className='relative mx-auto w-80 h-[600px] bg-gradient-to-b from-green-900 to-black rounded-[3rem] p-4 shadow-2xl'>
                <div className='w-full h-full bg-gradient-to-b from-green-200 via-red-400 to-green-600 rounded-[2.5rem] p-6 relative overflow-hidden'>

                    <div className='absolute top-4 left-0 right-0 flex justify-center items-center'>
                        <FaCircle />
                    </div>

                    {/* Bottom Navigation Icons */}
                    <div className='absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-14 text-2xl text-white'>
                        <FaRegSquare />
                        <FaRegCircle />
                        <TiMediaPlayReverseOutline className='text-4xl' />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Phone
