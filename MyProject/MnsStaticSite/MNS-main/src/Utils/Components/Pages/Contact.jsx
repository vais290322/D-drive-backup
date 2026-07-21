import React, { useState } from "react";
import Header from "../Header";
import Contact_Banner from "../../../assets/Home_images/about page/contact banner image.png";
import Button from "../Others/Button";
import Footer from "../Footer";
import Getintouch from "./Getintouch";

function Contact() {
  
  return (
    <>
      <div className="relative bg-cover bg-center bg-no-repeat h-screen flex items-center text-white px-6 sm:px-12 md:px-24" style={{ backgroundImage: `url(${Contact_Banner})` }}>
        <Header />
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold">
            Let’s Connect – Your
            <br /> Security & Facility
            <br /> <span className="text-blue-200">Partner Awaits!</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm md:text-base pr-4 md:pr-32 pb-4 md:pb-10">
            Have questions or need tailored security, maintenance, or housekeeping solutions? We're here to help! Reach out to MNS Secure Solutions for expert guidance, reliable services, and seamless support. Contact us today and let’s create a safer, cleaner, and well-managed environment together!
          </p>
          <Button title="Read More →" />
        </div>
      </div>
     <Getintouch />
      <Footer />
    </>
  );
}

export default Contact;