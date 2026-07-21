import React from "react";

// Importing images
import heroImage from "../assets/contact/Rectangle 1.png";
import mapImage from "../assets/contact/Rectangle 62.png";
import { Contact2 } from "lucide-react";
import { FaPhone } from "react-icons/fa6";
import { RiMailSendFill } from "react-icons/ri";

const ContactUsPage = () => {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <section
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* <div className="absolute inset-0 bg-black opacity-40"></div> */}
        <div className="relative z-10 text-center sm:text-left p-4 sm:absolute lg:left-36 ">
          <h1 className="text-4xl md:text-7xl   mb-4 font-['playfair_display'] ">
            We'd Love to <br /> Hear From You
          </h1>
          <p className="text-lg md:text-3xl max-w-2xl mx-auto font-['playfair_display']">
            Whether you're looking to book a service, inquire <br />
            about our academy courses, or just want to <br /> connect — we're
            here for you.
          </p>
        </div>
      </section>

      {/* Contact Info and Map Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative md:mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0 bg-[#FDEBE8] p-8 md:p-12 rounded-lg shadow-lg">
          {/* Map */}
          <div className="w-full md:w-1/2 rounded-l-lg ">
            {/* <img src={mapImage} alt="Location Map" className="rounded-lg w-full h-full object-cover" /> */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.0385122200146!2d88.45582747530064!3d22.57766287948808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027544bf75062d%3A0xaba5ee3f7d2d8f8d!2sHappy%20Family%20Unisex%20Salon%20%26%20Academy!5e0!3m2!1sen!2sin!4v1754379813818!5m2!1sen!2sin"
              className="w-full h-96 rounded-l-lg "
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Contact Details */}
        <div className="w-full md:w-1/2 md:pl-12 flex flex-col justify-center gap-8 bg-[#f3947d] p-15 rounded-r-xl shadow-lg">
  {/* Call Us Card */}
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-2xl xl:text-3xl font-['poppins'] mb-2">Call Us</h3>
    <div className="flex items-center justify-between">
      <p className="text-green-500 text-xl font-semibold">+91 xxxxx xxxxx</p>
      <FaPhone className="text-green-500 text-xl hidden sm:block" />
    </div>
  </div>

  {/* Mail Us Card */}
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-2xl xl:text-3xl font-['poppins'] mb-2">Mail Us</h3>
    <div className="flex justify-between items-start gap-2">
      <p className="text-green-500 text-xl font-semibold break-all">
        support@happyfamilysalon.com
      </p>
      <RiMailSendFill className="text-green-500 text-xl hidden sm:block mt-2" />
    </div>
  </div>
</div>


        </div>

        {/* Opening Hours Badge */}
        <div className="absolute top-8 right-8  2xl:top-0 2xl:right-96 bg-white w-40 h-40 rounded-full flex flex-col items-center justify-center text-center shadow-2xl border-4 border-pink-200 rotate-14 ">
          <h4 className="font-bold text-lg">Opening Hours</h4>
          <p className="text-sm">10:00 AM - 8:00 PM</p>{" "}
          <p className="text-sm">Monday - Sunday</p>
        </div>
      </section>

      {/* Form Section */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Book An Query Now</h2>
            <form className="flex flex-col md:flex-row items-center justify-center gap-4">
                <input type="text" placeholder="e.g. 99933311122" className="w-full md:w-auto flex-grow p-3 border rounded-lg" />
                <button type="submit" className="bg-[#F4A492] text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                    Submit
                </button>
            </form>
            <p className="text-gray-500 mt-4">We will reach you within 24hrs.</p>
        </div>
      </section> */}
    </div>
  );
};

export default ContactUsPage;
