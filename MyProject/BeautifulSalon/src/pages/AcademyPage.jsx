import React, { useState, useEffect } from "react";
import { ChevronRight, Star, Users, Award, BookOpen } from "lucide-react";

// Importing your exact images
import heroImage from "../assets/academy/Rectangle 1.png";
import aboutImage from "../assets/academy/Rectangle 45.png";
import certImage from "../assets/academy/Rectangle 46.png";

import course1 from "../assets/academy/Rectangle 51.png";
import course2 from "../assets/academy/Rectangle 52.png";
import course3 from "../assets/academy/Rectangle 53.png";
import course4 from "../assets/academy/Rectangle 54.png";
import course5 from "../assets/academy/Rectangle 55.png";
import course6 from "../assets/academy/Rectangle 56.png";
import course7 from "../assets/academy/Rectangle 57.png";
import course8 from "../assets/academy/Rectangle 58.png";

import gallery1 from "../assets/academy/Rectangle 6.png";
import gallery2 from "../assets/academy/Rectangle 6-1.png";
import gallery3 from "../assets/academy/Rectangle 6-2.png";
import gallery4 from "../assets/academy/Rectangle 14.png";
import { Link, useNavigate } from "react-router";

import { LuBadgeCheck } from "react-icons/lu";
import { TfiWorld } from "react-icons/tfi";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { RiUserStarLine, RiDoubleQuotesL } from "react-icons/ri";

const courseImages = [
  course1,
  course2,
  course3,
  course4,
  course5,
  course6,
  course7,
  course8,
];
const galleryImages = [gallery1, gallery2, gallery3, gallery4];

const courses = [
  {
    title: "Beautician Course",
    image: courseImages[0],
    duration: "6 months",
    level: "Beginner",
  },
  {
    title: "Hair & Makeup Styling",
    image: courseImages[1],
    duration: "4 months",
    level: "Intermediate",
  },
  {
    title: "Skin & Facial Treatments",
    image: courseImages[2],
    duration: "3 months",
    level: "Beginner",
  },
  {
    title: "Nail Art & Extensions",
    image: courseImages[3],
    duration: "2 months",
    level: "Beginner",
  },
  {
    title: "Bridal Makeup Mastery",
    image: courseImages[4],
    duration: "5 months",
    level: "Advanced",
  },
  {
    title: "Mehendi Art & Design",
    image: courseImages[5],
    duration: "1 month",
    level: "Beginner",
  },
  {
    title: "Hair Cutting & Treatment",
    image: courseImages[6],
    duration: "4 months",
    level: "Intermediate",
  },
  {
    title: "Waxing & Threading",
    image: courseImages[7],
    duration: "1 month",
    level: "Beginner",
  },
];

const testimonials = [
  {
    name: "Priya S.",
    quote:
      "Best family salon in the area! I come with my daughter and husband — all get pampered.",
    rating: 5,
    role: "Regular Client",
  },
  {
    name: "Anjali M.",
    quote:
      "The academy training was exceptional. I now run my own successful beauty business!",
    rating: 5,
    role: "Academy Graduate",
  },
  {
    name: "Rahul K.",
    quote:
      "Professional service and friendly staff. Highly recommend for all beauty needs.",
    rating: 5,
    role: "Satisfied Customer",
  },
];

const testimonials1 = [
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

const stats = [
  { icon: Users, number: "500+", label: "Happy Students" },
  { icon: Award, number: "15+", label: "Certifications" },
  { icon: BookOpen, number: "25+", label: "Courses" },
  { icon: Star, number: "4.9", label: "Rating" },
];

const AcademyPage = () => {
  const [isVisible, setIsVisible] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fadeInUp = "transition-all duration-700 ease-out transform";
  const getAnimationClass = (id, delay = 0) => {
    return isVisible[id]
      ? `${fadeInUp} translate-y-0 opacity-100`
      : `${fadeInUp} translate-y-8 opacity-0`;
  };

  return (
    <div className="bg-white text-gray-800 font-sans overflow-hidden  ">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-start text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        {/* <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" /> */}

        <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-24 max-w-7xl w-full">
          <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl    mb-4 md:mb-6 lg:mb-8 leading-tight animate-slide-up font-['playfair_display'] ">
              Build Your Dream Career in Beauty
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-6 md:mb-8 lg:mb-10 leading-relaxed animate-slide-up animation-delay-300 font-['playfair_display'] text-justify ">
              Start your journey with Happy Family Academy — <br />
              where passion meets profession in the world of beauty.
            </p>

            <button
              onClick={() => navigate("/contact-us")}
              className="group bg-[#f3947d] hover:to-rose-600 text-white px-6 sm:px-8 md:px-10 lg:px-12 py-3 md:py-4 lg:py-5 rounded-lg hover:shadow-2xl transition-all duration-300 text-base md:text-lg lg:text-xl font-semibold animate-slide-up animation-delay-600 transform hover:scale-105 cursor-pointer"
            >
              Contact Now
              <ChevronRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-pink-400/20 rounded-full animate-float hidden lg:block" />
        <div className="absolute bottom-32 right-20 w-16 h-16 bg-rose-400/20 rounded-full animate-float animation-delay-1000 hidden lg:block" />
        <div className="absolute top-1/2 right-5 w-12 h-12 bg-purple-400/20 rounded-full animate-float animation-delay-500 hidden md:block" />
      </section>

      {/* Stats Section */}
      {/* <section className="py-8 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                id={`stat-${index}`}
                data-animate
                className={`text-center p-4 md:p-6 ${getAnimationClass(
                  `stat-${index}`
                )}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-4 text-pink-500" />
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 md:mb-2">
                  {stat.number}
                </div>
                <p className="text-sm md:text-base text-gray-600">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* About Academy Section */}
      <section className="py-12  md:py-16 lg:py-24 xl:py-32 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-24">

        <div className={`text-center  max-w-7xl mx-auto lg:text-left ${getAnimationClass(
          "about-text"
        )}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl  font-bold mb-4 md:mb-6 lg:mb-8  font-['playfair_display'] text-black  ">
            About Our Academy
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6 md:mb-8 text-base md:text-lg lg:text-3xl font-['poppins']  max-w-7xl p-1 ">
            At Happy Family Unisex Salon & Academy, we don't just provide beauty <br />
            services — we shape the future of the beauty industry. Our academy
            offers expert-led courses designed to build skills, confidence, and
            careers.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center">
          <div
            id="about-image"
            data-animate
            className={`${getAnimationClass(
              "about-image"
            )} animation-delay-300`}
          >
            <div className="relative group">
              <img
                src={aboutImage}
                alt="About Academy"
                className="rounded-2xl shadow-2xl w-full hover:shadow-3xl transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
          <div
            id="about-text"
            data-animate
            className={`text-center lg:text-left ${getAnimationClass(
              "about-text"
            )}`}
          >
            <div className="space-y-3 md:space-y-4 text-left">
              {[
                { icon: LuBadgeCheck, text: "Certified Beauty Professionals" },
                // { icon: LuBadgeCheck, text: "Certified Trainers" },
                { icon: TfiWorld, text: "Supportive Learning Environment" },
                {
                  icon: LiaChalkboardTeacherSolid,
                  text: "Premium Product Training",
                },
                {
                  icon: RiUserStarLine,
                  text: "Government-Recognized Certification",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center p-2 rounded-lg hover:bg-pink-50 transition-colors duration-300 ${getAnimationClass(
                    "about-text"
                  )}`}
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <span className="text-green-500 mr-3 text-3xl">
                    <item.icon />
                  </span>
                  <span className="text-base md:text-3xl font-medium">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

          </div>


        </div>
      </section>

      {/* Certifications Section */}
      <section className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-12 md:py-16 lg:py-24 xl:py-32 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center">
          <div
            id="cert-text"
            data-animate
            className={`text-center lg:text-left order-2 lg:order-1 ${getAnimationClass(
              "cert-text"
            )}`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl  font-bold mb-4 md:mb-6 lg:mb-8 text-black font-['playfair_display'] ">
              Certifications
            </h2>
            <div className="space-y-3 md:space-y-4 text-left">
              {[
                "Government-Recognized Certification",
                "Portfolio Support",
                "Hands-On Practical Training",
                "Industry-Expert Trainers",
              ].map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-lg hover:bg-white/50 transition-colors duration-300 ${getAnimationClass(
                    "cert-text"
                  )}`}
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <span className="text-green-500 mr-3 text-3xl">✓</span>
                  <span className="text-base md:text-lg lg:text-3xl font-medium font-['poppins'] ">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            id="cert-image"
            data-animate
            className={`order-1 lg:order-2 ${getAnimationClass("cert-image")}`}
          >
            <div className="relative group">
              <img
                src={certImage}
                alt="Certifications"
                className="rounded-2xl shadow-2xl w-full hover:shadow-3xl transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>


        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-12 md:py-16 lg:py-24 xl:py-32 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-7xl mx-auto">
          <div
            id="courses-header"
            data-animate
            className={`text-center mb-8 md:mb-12 lg:mb-16 ${getAnimationClass(
              "courses-header"
            )}`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-4 md:mb-6 text-black font-['playfair_display'] ">
              Featured Courses
            </h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto text-base md:text-lg lg:text-xl leading-relaxed font-['poppins']">
              Choose from a wide range of beauty programs designed for beginners
              to advanced professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {courses.map((course, index) => (
              <div
                key={index}
                id={`course-${index}`}
                data-animate
                className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 ${getAnimationClass(
                  `course-${index}`
                )}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 md:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {course.level}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="font-semibold text-lg md:text-xl mb-2 group-hover:text-pink-600 transition-colors font-['poppins']">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 text-sm md:text-base flex items-center font-['poppins']">
                    <span className="mr-2">⏱</span>
                    {course.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-[#fff0f0] py-12 md:py-16 lg:py-24 xl:py-32 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-7xl mx-auto">
          
          <div
            id="gallery-header"
            data-animate
            className={`flex flex-col sm:flex-row justify-between items-center mb-8 md:mb-12 lg:mb-16 ${getAnimationClass(
              "gallery-header"
            )}`}
          >
            <div className="flex flex-col items-start">
              <h2 className="text-4xl md:text-5xl 2xl:text-7xl font-bold mb-4 text-black font-['playfair_display']">
                Gallery
              </h2>
              <p className="text-gray-600 max-w-5xl text-base md:text-lg 2xl:text-3xl leading-relaxed font-['poppins'] ">
                Choose from a wide range of beauty programs designed for beginners to advanced professionals.
              </p>
            </div>

             <button onClick={() => navigate('/gallery')} className="group bg-[#f3947d] hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-xl transition-all duration-300 font-semibold transform hover:scale-105 cursor-pointer  ">
              View All
              <ChevronRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
           
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                id={`gallery-${index}`}
                data-animate
                className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ${getAnimationClass(
                  `gallery-${index}`
                )}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <img
                  src={img}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-64 md:h-72 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-semibold">Gallery Image {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-12 md:py-16 lg:py-24 xl:py-32 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 2xl:px-24 bg-white">
        {/* <div className="max-w-6xl mx-auto">
          <div
            id="testimonials-header"
            data-animate
            className={`text-center mb-8 md:mb-12 lg:mb-16 ${getAnimationClass(
              "testimonials-header"
            )}`}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold mb-4 md:mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Our Clients Love Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                id={`testimonial-${index}`}
                data-animate
                className={`group bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-t-4 border-pink-200 hover:border-pink-400 hover:-translate-y-2 ${getAnimationClass(
                  `testimonial-${index}`
                )}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 text-base md:text-lg mb-4 md:mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-pink-600">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-['playfair_display'] text-gray-900 leading-tight mb-12 transition-all duration-1000 transform `}
          >
            Our Clients
            <br />
            Love Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials1.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-[#fff0f0] p-8 rounded-lg transition-all duration-500 transform `}
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

        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default AcademyPage;
