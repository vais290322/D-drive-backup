import React, { useState, useEffect } from "react";
import { ChevronRight, Sparkles, Clock, Award } from "lucide-react";

// Importing your exact images
import heroImage from "../assets/services/Rectangle 1.png";
import hairServicesImage from "../assets/services/Rectangle 20.png";
import skinFacialImage from "../assets/services/Rectangle 22.png";
import makeupImage from "../assets/services/Rectangle 23.png";
import nailHandCareImage from "../assets/services/Rectangle 25.png";
import mensGroomingImage from "../assets/services/Rectangle 26.png";
import facialDTanImage from "../assets/services/Rectangle 32.png";
import hairStylingImage from "../assets/services/Rectangle 33.png";
import waxingThreadingImage from "../assets/services/Rectangle 36.png";
import { useNavigate } from "react-router";

const servicesData = [
  {
    title: "Hair Services",
    items: [
      "Ladies, Gents & Kids Haircut",
      "Hair Color & Highlights",
      "Rebonding, Smoothening & Keratin",
      "Hair Spa & Scalp Care",
    ],
    image: hairServicesImage,
    imgLeft: false,
    duration: "30-180 min",
    popular: true,
  },
  {
    title: "Skin & Facial Treatments",
    items: [
      "Cleanup, D-Tan & Bleach",
      "Brightening / Anti-Aging Facial",
      "Acne / Sensitive Skin Solutions",
      "Face Waxing & Threading",
    ],
    image: skinFacialImage,
    imgLeft: true,
    duration: "45-90 min",
    popular: false,
  },
  {
    title: "Makeup Services",
    items: [
      "Party Makeup",
      "Bridal / Reception Makeup",
      "Engagement Look",
      "Eye Makeup & Makeup Trials",
    ],
    image: makeupImage,
    imgLeft: false,
    duration: "60-240 min",
    popular: true,
  },
  {
    title: "Nail & Hand Care",
    items: ["Nail Extensions", "Gel Polish & Art", "Manicure & Pedicure"],
    image: nailHandCareImage,
    imgLeft: true,
    duration: "30-120 min",
    popular: false,
  },
  {
    title: "Men's Grooming",
    items: [
      "Haircuts & Beard Trims",
      "Shaving & D-Tan Packs",
      "Hair Spa",
      "Men's Facial",
    ],
    image: mensGroomingImage,
    imgLeft: false,
    duration: "20-90 min",
    popular: false,
  },
  {
    title: "Facial & D-Tan",
    items: [
      "Clean-up & Skin Prep",
      "D-Tan & Bleaching Techniques",
      "O3+ & Brightening Facials",
      "Acne & Anti-Aging Treatments",
    ],
    image: facialDTanImage,
    imgLeft: true,
    duration: "45-90 min",
    popular: true,
  },
  {
    title: "Hair Styling & Treatment",
    items: [
      "Ladies, Gents & Kids Haircuts",
      "Hair Color & Highlights",
      "Rebonding, Smoothening & Keratin",
      "Hair Spa & Scalp Care",
    ],
    image: hairStylingImage,
    imgLeft: false,
    duration: "60-180 min",
    popular: false,
  },
  {
    title: "Waxing & Threading",
    items: [
      "Full Body & Face Waxing",
      "Eyebrow & Facial Threading",
      "Skin Soothing Aftercare",
      "Product Handling",
    ],
    image: waxingThreadingImage,
    imgLeft: true,
    duration: "15-90 min",
    popular: false,
  },
];

const stats = [
  { icon: Award, number: "8+", label: "Service Categories" },
  { icon: Clock, number: "500+", label: "Happy Clients" },
  { icon: Sparkles, number: "15+", label: "Years Experience" },
];

const ServicesPage = () => {
  const [isVisible, setIsVisible] = useState({});

  const navigate = useNavigate();

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

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const fadeInUp = "transition-all duration-700 ease-out transform";
  const getAnimationClass = (id, delay = 0) => {
    return isVisible[id]
      ? `${fadeInUp} translate-y-0 opacity-100`
      : `${fadeInUp} translate-y-8 opacity-0`;
  };

  return (
    <div className="bg-white text-gray-800 font-sans overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        {/* <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" /> */}

        <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-24 max-w-7xl mx-auto lg:absolute lg:left-8 ">
          <div className="animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-7xl  mb-4 md:mb-6 lg:mb-8 leading-tight animate-slide-up animation-delay-300 font-['playfair_display'] text-left ">
              Tailored Services for Every Family Member
            </h1>
            <p className="text-xl  md:text-2xl  xl:text-3xl   mb-4 md:mb-6 lg:mb-8 leading-tight animate-slide-up animation-delay-300 font-['playfair_display'] text-left ">
              Whether it's your first haircut or your wedding day glow, our
              services are designed with care, expertise, and comfort.
            </p>
            {/* <button className="group bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 sm:px-8 md:px-10 lg:px-12 py-3 md:py-4 lg:py-5 rounded-full hover:shadow-2xl transition-all duration-300 text-base md:text-lg lg:text-xl font-semibold animate-slide-up animation-delay-600 transform hover:scale-105">
              Book Appointment
              <ChevronRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button> */}
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-400/20 rounded-full animate-float hidden lg:block" />
        <div className="absolute bottom-32 left-20 w-16 h-16 bg-rose-400/20 rounded-full animate-float animation-delay-1000 hidden lg:block" />
        <div className="absolute top-1/3 right-10 w-24 h-24 bg-purple-400/20 rounded-full animate-float animation-delay-500 hidden xl:block" />
      </section>

      {/* Stats Section */}
      {/* <section className="py-8 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                id={`stat-${index}`}
                data-animate
                className={`text-center p-4 md:p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${getAnimationClass(`stat-${index}`)}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-4 text-pink-500" />
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 md:mb-2">{stat.number}</div>
                <p className="text-sm md:text-base text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Services Section */}
      <section className="py-12 md:py-16 lg:py-24 xl:py-32 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-24">
        <div
          id="services-header"
          data-animate
          className={`text-center mb-8 md:mb-12 lg:mb-16 xl:mb-20 ${getAnimationClass(
            "services-header"
          )}`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 text-black font-[playfair_display] ">
            Available Services & Academy Training Courses
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional beauty services and comprehensive training programs for
            aspiring beauty professionals
          </p>
        </div>

        <div className="w-full space-y-12 md:space-y-16">
          {servicesData.map((service, index) => (
            <div
              key={index}
              id={`service-${index}`}
              data-animate
              className={`${
                index % 2 === 1 ? "bg-[#fff0f0]" : "bg-white"
              } w-full ${getAnimationClass(`service-${index}`)}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="max-w-7xl mx-auto">
                <div
                  className={`flex flex-col ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } items-stretch`}
                >
                  {/* Image Side */}
                  <div className="w-full md:w-1/2 relative h-96 md:h-[400px] xl:h-[500px] p-8 ">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover  rounded-2xl  hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                  </div>

                  {/* Content Side */}
                  <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div
                      className={`max-w-xl ${
                        index % 2 === 1 ? "ml-auto text-right" : ""
                      }`}
                    >
                      <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 font-['poppins']">
                        {service.title}
                      </h3>

                      <ul className="space-y-4">
                        {service.items.map((item, i) => (
                          <li
                            key={i}
                            className={`flex items-center text-gray-700 text-base md:text-lg font-['poppins'] ${
                              index % 2 === 1
                                ? "flex-row-reverse justify-start"
                                : ""
                            }`}
                          >
                            <span
                              className={`w-2 h-2 bg-gray-400 rounded-full ${
                                index % 2 === 1 ? "ml-4" : "mr-4"
                              }`}
                            ></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      {/* <section className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-pink-600 via-rose-600 to-purple-600 text-white">
        <div 
          id="cta-section"
          data-animate
          className={`max-w-4xl mx-auto text-center ${getAnimationClass('cta-section')}`}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Ready to Transform Your Look?
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 opacity-90 leading-relaxed">
            Book your appointment today and experience the difference professional beauty services can make.
          </p>
          <div  className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/contact-us')} className="bg-white text-pink-600 hover:bg-gray-100 px-6 sm:px-8 md:px-10 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer">
              Contact Us
            </button>
            <button onClick={() => navigate('/gallery')} className="border-2 border-white text-white hover:bg-white hover:text-pink-600 px-6 sm:px-8 md:px-10 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
              View Gallery
            </button>
          </div>
        </div>
      </section> */}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default ServicesPage;
