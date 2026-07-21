import React from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { FaRegUser } from "react-icons/fa";
import { GoShieldX } from "react-icons/go";
import { CgChart } from "react-icons/cg";
import { TbUsersGroup } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";
import { SlEarphonesAlt } from "react-icons/sl";
import { HiPhoneMissedCall } from "react-icons/hi";
import Filter from '@/common/Filter';


const MainDashboard = () => {
  return (

    <div>

      <div className='mt-4 grid grid-cols-4 gap-4'>

        <div>
          {
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className=' h-24 rounded-md flex justify-between items-center bg-white shadow-xl border border-gray-300 my-2 hover:scale-105'>
                <div className='p-4'>
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-cyan-100">
                      <SlEarphonesAlt className="w-8 h-8 text-green-500" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className='mr-2 p-4'>
                  <p className='text-right font-bold text-green-500 text-2xl font-poppins'>4</p>
                  <p className='text-left font-md font-poppins'>Total Hot Call</p>
                </div>
              </div>
            ))
          }
        </div>

        <div>
          {
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className=' h-24 rounded-md flex justify-between items-center bg-white shadow-xl border border-gray-300 my-2 hover:scale-105'>
                <div className='p-4'>
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-purple-100">
                      <FiPhoneCall className="w-8 h-8 text-purple-500" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className='mr-2 p-4'>
                  <p className='text-right font-bold text-purple-500 text-2xl font-poppins'>16</p>
                  <p className='text-left font-md font-poppins'>Total Coald Call</p>
                </div>
              </div>
            ))
          }
        </div>

        <div>
          {
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className=' h-24 rounded-md flex justify-between items-center bg-white shadow-xl border border-gray-300 my-2 hover:scale-105'>
                <div className='p-4'>
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-pink-100">
                      <HiPhoneMissedCall className="w-8 h-8 text-pink-500" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className='mr-2 p-4'>
                  <p className='text-right font-bold text-pink-500 text-2xl font-poppins'>34</p>
                  <p className='text-left font-md font-poppins'>Total Spam Call</p>
                </div>
              </div>
            ))
          }
        </div>

        <div>
          {
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className=' h-24 rounded-md flex justify-between items-center bg-white shadow-xl border border-gray-300 my-2 hover:scale-105'>
                <div className='p-4'>
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-orange-100">
                      <TbUsersGroup className="w-8 h-8 text-orange-500" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className='mr-2 p-4'>
                  <p className='text-right font-bold text-orange-500 text-2xl font-poppins'>8</p>
                  <p className='text-left font-md font-poppins'>Today Add Client</p>
                </div>
              </div>
            ))
          }
        </div>

      </div>

          <div>

            <Filter/>
          </div>


    </div>
  )
}

export default MainDashboard