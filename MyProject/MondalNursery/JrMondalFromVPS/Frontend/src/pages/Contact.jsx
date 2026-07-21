import React from 'react'
import { CiLocationOn } from "react-icons/ci";
import { IoMdCall } from "react-icons/io";
import { MdOutlineAlternateEmail } from "react-icons/md";

const Contact = () => {
  return (
    <div className='flex flex-col '>
      
      <h2 className="font-bold text-3xl text-center mt-8 " style={{marginBottom:"4rem"}}>Feel free to contact us</h2>
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.6217741601295!2d88.6859439!3d22.7422954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8aff63d48adcd%3A0xc2df05fc6ae94fb1!2sJ.R.%20Mondal%20Wholesale%20Nursery!5e0!3m2!1sen!2sin!4v1736315906514!5m2!1sen!2sin" className='w-full h-96' allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

      <div className="container mt-6 m-auto flex md:gap-80 flex-col md:flex-row">
      <div className="p-6 max-w-lg  rounded-md">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>

      {/* Visit Us Section */}
      <div className="flex items-center mb-4">
        <CiLocationOn className="text-green-600 text-2xl mr-3" />
        <div>
          <h3 className="text-lg font-semibold">Visit Us</h3>
          <p className="text-gray-600">CHAKLA ROAD, N 24 PGS, West Bengal – 743424</p>
        </div>
      </div>

      {/* Call Us Section */}
      <div className="flex items-center mb-4">
        <IoMdCall className="text-green-600 text-2xl mr-3" />
        <div>
          <h3 className="text-lg font-semibold">Call Us</h3>
          <p className="text-gray-600">+91 62955 98133</p>
        </div>
      </div>

      {/* Email Us Section */}
      <div className="flex items-center">
        <MdOutlineAlternateEmail className="text-green-600 text-2xl mr-3" />
        <div>
          <h3 className="text-lg font-semibold">Email Us</h3>
          <p className="text-gray-600">jakirahosenamandala26@gmail.com</p>
        </div>

        
      </div>
    </div>
        <div className="w-full p-6">
        <h2 className='text-2xl font-bold mb-4'>Send us a message</h2>
          <form action="https://formspree.io/f/mgvvrwzq" method="POST" className="flex flex-col gap-4 justify-center align-middle">
            <input type="text" name="username" placeholder="username" autoComplete="off" required  className='p-3 border rounded border-green-400'/>

            <input type="email" name="email" placeholder="email" autoComplete="off" required  className='p-3 border rounded border-green-400 '/>

            <textarea name="message" cols="30" rows="10" autoComplete="off" required placeholder='enter your massage' className='p-2 border border-green-400'></textarea>

            {/* <input type="submit" value="send" className='bg-red-400 rounded-full border text-white font-medium text-lg cursor-pointer hover:bg-red-700 w-32 h-10  mb-8' /> */}
            <button type='submit' value="send" className='bg-green-400 rounded-full border text-white font-medium text-lg cursor-pointer hover:bg-red-700 w-32 h-10  mb-8'>
                Send
            </button>
           
          </form>
        </div>
      </div>
    
    </div>
  )
}

export default Contact
