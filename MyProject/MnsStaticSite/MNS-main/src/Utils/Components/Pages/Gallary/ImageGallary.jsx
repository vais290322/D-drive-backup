import React from 'react';
import Linked_Service from "../../../../assets/Home_images/home page/linked_services.png";
import Gallary1 from "../../../../assets/Home_images/home page/gallery img1.png";
import Gallary2 from "../../../../assets/Home_images/home page/gallery img2.png";
import Gallary3 from "../../../../assets/Home_images/home page/gallery img3.png";
import Gallary4 from "../../../../assets/Home_images/home page/gallery img4.png";
import Gallary5 from "../../../../assets/Home_images/home page/Rectangle 14.png";
import Gallary6 from "../../../../assets/Home_images/home page/Rectangle 15.png";

function ImageGallary() {
  return (
    <div className="flex flex-col gap-8 px-4 md:px-8 lg:mx-32">
      <img src={Linked_Service} alt="Linked Services" className="h-10 w-10" />
      <p className='text-[#232C33] text-2xl md:text-4xl font-unna'>
        Gallary: <span className='text-[#197BBD]'>See Us in Action</span>
      </p>
      <p className='text-[#535353] font-ubuntu text-sm md:text-base'>
        Explore our commitment to security, housekeeping, and maintenance
        through real-world snapshots of our expert teams at work. From vigilant
        security personnel ensuring safety to professional housekeeping teams
        maintaining spotless environments and skilled maintenance experts
        keeping facilities in top condition.
      </p>
      
      <div className='w-full'>
        <div className='w-full'>
          <div className="flex flex-col lg:flex-row gap-2 items-center lg:items-start">
            <img src={Gallary1} className="h-auto w-full lg:w-[700px] object-cover" />
            <div className="flex flex-col gap-2 w-full lg:w-auto">
              <img src={Gallary5} className="h-auto w-full object-cover" />
              <img src={Gallary6} className="h-auto w-full object-cover" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <img src={Gallary2} className="h-auto w-full sm:w-[300px] md:w-[400px] object-cover" />
          <img src={Gallary3} className="h-auto w-full sm:w-[300px] md:w-[400px] object-cover" />
          <img src={Gallary4} className="h-auto w-full sm:w-[300px] md:w-[400px] object-cover" />
        </div>
      </div>
    </div>
  );
}

export default ImageGallary;