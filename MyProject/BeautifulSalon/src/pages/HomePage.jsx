import React, { useState, useEffect } from "react";
import { Link } from "react-router";

// Importing images
import heroImage from "../assets/home/Rectangle 1.png";
import serviceImg1 from "../assets/home/Rectangle 6.png";
import serviceImg2 from "../assets/home/Rectangle 7.png";
import serviceImg3 from "../assets/home/Rectangle 8.png";
import serviceImg4 from "../assets/home/Rectangle 9.png";
import serviceImg5 from "../assets/home/Rectangle 10.png";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";

import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { FaFolderOpen } from "react-icons/fa";
import { RiDoubleQuotesL } from "react-icons/ri";

const popularServices = [
  { title: "Hair Styling & Color", image: serviceImg1 },
  { title: "Skin & Facial Treatments", image: serviceImg2 },
  { title: "Bridal & Occasion Makeup", image: serviceImg3 },
  { title: "Waxing & D-tanning", image: serviceImg4 },
  { title: "Men's Grooming & Beard Styling", image: serviceImg5 },
];

const testimonials = [
  {
    name: "Priya S.",
    quote:
      '"Best family salon in the area! I come with my daughter and husband — all get pampered."',
  },
  {
    name: "Priya S.",
    quote:
      '"Best family salon in the area! I come with my daughter and husband — all get pampered."',
  },
  {
    name: "Priya S.",
    quote:
      '"Best family salon in the area! I come with my daughter and husband — all get pampered."',
  },
];

const HomePage = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white text-gray-800  ">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center justify-start text-white"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/5"></div>
        <div
          className={`relative z-10 px-4 sm:px-6 lg:px-16 max-w-3xl transition-all duration-1000 transform ${
            isVisible.hero
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl  mb-4 sm:mb-6 leading-tight font-['playfair_display']">
            Feel Beautiful,
            <br />
            Together.
          </h1>
          <p className="text-lg sm:text-xl md:text-4xl mb-6 sm:mb-8 leading-relaxed max-w-2xl font-['playfair_display'] ">
            A family-friendly salon where beauty meets comfort and care — for
            ladies, gents, and kids.
          </p>
          <Link
            to="/services"
            className="bg-[#F4A492] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-[#e6917d] transition-all duration-300 transform hover:scale-105 text-base sm:text-lg  group md:text-2xl font-bold"
          >
            Explore Services
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* Why Choose Section */}
      <section id="why-choose" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center transition-all duration-1000 transform ${
              isVisible["why-choose"]
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl md:mt-[-180px] text-gray-900 font-['playfair_display'] leading-tight">
                Why Choose
                <br />
                Happy Family?
              </h2>
            </div>
            <div>
              <p className="text-lg md:text-3xl text-gray-700 leading-relaxed font-['poppins'] text-justify  text-wrap space-x-0 space-y-0">
                We blend modern techniques with heartfelt hospitality. At Happy
                Family Salon & Academy, we offer expert grooming, relaxing
                skincare, and transformative styling for every age <br />— all
                delivered with hygiene, professionalism, and warmth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section
        id="services"
        className="bg-[#fff0f0] py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 space-y-4 sm:space-y-0 transition-all duration-1000 transform ${
              isVisible.services
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl  text-gray-800 font-['playfair_display']">
              Popular Services
            </h2>
            <Link
              to="/services"
              className="bg-[#F4A492] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-[#e6917d] transition-all duration-300 transform hover:scale-105 text-sm sm:text-base font-medium font-['poppins']"
            >
              View All Services
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {popularServices.map((service, index) => (
              <div
                key={index}
                className={`text-center group transition-all duration-700 transform ${
                  isVisible.services
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg mb-4 group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className=" text-base sm:text-lg text-gray-800 group-hover:text-[#F4A492] transition-colors duration-300 font-['poppins']">
                  {service.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="bg-gray-200 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 text-center w-[80vw] mx-auto mt-10">
        <p className="font-bold text-[#333333] text-sm sm:text-2xl">
          Special Offer Section (If Available)
        </p>
      </section>

      {/* Academy Section */}

      <section
        id="academy"
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div
          className={`max-w-7xl mx-auto transition-all duration-1000 transform ${
            isVisible.academy
              ? "translate-y-0 opacity-100"
              : "translate-y-10 opacity-0"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-['playfair_display'] text-gray-900 leading-tight mb-4">
                Happy Family
                <br />
                Academy
              </h2>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-2 xl:text-3xl font-['poppins']  ">
                  Learn the Art of Beauty.
                </p>
                <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-700 leading-relaxed mb-6 font-['poppins'] ">
                  Govt. certified courses in Hair, Skin,
                  <br /> Makeup & Nails.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-green-500">
                    <LiaChalkboardTeacherSolid className="w-6 h-6 lg:w-10 lg:h-10" />
                  </span>
                  <span className="text-gray-700 font-['poppins'] text-xl md:text-2xl xl:text-3xl ">100% practical training</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">
                    <FaFolderOpen className="w-6 h-6 lg:w-10 lg:h-10 " />
                  </span>
                  <span className="text-gray-700 text-xl md:text-2xl xl:text-3xl font-['poppins'] ">Portfolio support</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-lg font-bold xl:text-3xl text-gray-900">
                  Admission Open
                </span>
                <Link
                  to="/contact-us"
                  className="bg-[#F4A492] text-white px-8 py-3 rounded hover:bg-[#e6917d] transition-colors font-['poppins'] text-base sm:text-lg md:text-xl lg:text-2xl "
                >
                  Contact Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
     

      <section
        id="testimonials"
        className="bg-[#fff0f0] py-16 md:py-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-['playfair_display'] text-gray-900 leading-tight mb-12 transition-all duration-1000 transform ${
              isVisible.testimonials
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            Our Clients
            <br />
            Love Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-lg transition-all duration-500 transform ${
                  isVisible.testimonials
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex justify-between items-start mb-4 border-b-2 border-[#6b6b6b] pb-1">
                  <p className="font-semibold text-gray-900 text-lg ">
                    {testimonial.name}
                  </p>
                  <span className="text-2xl text-gray-400">
                    <RiDoubleQuotesL className="text-[#6b6b6b] w-8 h-8" />
                  </span>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {testimonial.quote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default HomePage;
