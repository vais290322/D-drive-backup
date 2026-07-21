import React from 'react'
import Linked_Services from "../../../../assets/Home_images/home page/linked_services.png";
import Button from '../../Others/Button';
import Rectangle2 from "../../../../assets/Home_images/home page/Rectangle 6.jpg";

function ExportCareOfSource() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 px-6 lg:px-32 py-16">
      <div className="w-full lg:w-1/2 flex flex-col gap-7">
        <img src={Linked_Services} alt="no image" className="h-8 w-8" />
        <p className="font-unna text-3xl lg:text-[52px] flex flex-col">
          <span className='font-semibold text-[#232C33]'>Export Care for Secure,</span>
          <span className='mt-[5px] lg:mt-[15px] font-extralight text-2xl lg:text-[48px] text-[#197BBD]'>Clean and Efficient Spaces</span>
        </p>
        <p className='text-[#535353] text-sm lg:text-[15px] lg:pr-[70px]'>
          We provide expert maintenance, security, and housekeeping services
          to keep your space safe, functional, and spotless. Our trained
          professionals ensure seamless operations, whether it’s routine
          upkeep, 24/7 security, or thorough cleaning. With a commitment to
          reliability and excellence, we tailor our services to meet your
          unique needs.
        </p>
        <div className='mt-5'>
          <Button title="Read More →" />
        </div>
        <img
          src={Rectangle2}
          alt="no image"
          className="h-[250px] lg:h-[350px] w-full lg:w-[600px] rounded-3xl object-cover mt-4"
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center gap-10 lg:gap-16 border-t lg:border-t-0 lg:border-l-[1px] pt-10 lg:pt-0 lg:pl-10">
        <div className="border-b-[1px] w-full px-5  lg:px-0 lg:mr-20  flex flex-col gap-5 pb-16 ml-10">
          <strong className='text-xl lg:text-[27px] text-[#232C33] '>Reliable Maintenance Services</strong>
          <p className='text-sm lg:text-[15px] text-[#232C33]'>
            We ensure your facilities and equipment remain in top condition
            with expert repairs, routine upkeep, and preventive maintenance.
          </p>
        </div>
        <div className="border-b-[1px] w-full px-5 lg:px-0 lg:mr-20 flex flex-col gap-5 pb-16 ml-10">
          <strong className='text-xl lg:text-[27px] text-[#232C33]'>Professional Housekeeping Services</strong>
          <p className='text-sm lg:text-[15px] text-[#232C33]'>
            From daily cleaning to deep sanitization, we provide thorough
            housekeeping solutions to maintain a spotless and hygienic
            environment.
          </p>
        </div>
        <div className="w-full px-5 lg:px-0 lg:mr-20 flex flex-col gap-5 ml-10">
          <strong className='text-xl lg:text-[27px] text-[#232C33]'>Expert Guard Services</strong>
          <p className='text-sm lg:text-[15px] text-[#232C33]'>
            Our well-trained security personnel offer round-the-clock
            protection, ensuring the safety of your premises, assets, and
            people.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ExportCareOfSource
