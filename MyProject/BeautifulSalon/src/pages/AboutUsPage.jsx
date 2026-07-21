import React, { useEffect, useRef } from 'react';
import heroImage from '../assets/about/Rectangle 1.png';
import academyImage from '../assets/about/Rectangle 45.png';
import salonImage from '../assets/about/Rectangle 48.png';

const AboutUsPage = () => {
  const observerRef = useRef();

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-on-scroll {
          opacity: 0;
          transition: all 0.6s ease-out;
        }

        .animate-in {
          opacity: 1;
        }

        .fade-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .fade-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .fade-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .scale-in {
          animation: scaleIn 0.8s ease-out forwards;
        }

        .bounce-in {
          animation: bounceIn 0.8s ease-out forwards;
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }

        .hero-bg {
          background: linear-gradient(135deg, rgba(139, 116, 99, 0.8), rgba(205, 180, 155, 0.6)),
                      url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect fill="%23E5D5C8" width="1200" height="800"/><circle fill="%23D4C4B0" cx="400" cy="200" r="120" opacity="0.3"/><circle fill="%23C9B99A" cx="800" cy="600" r="80" opacity="0.4"/></svg>');
          background-size: cover;
          background-position: center;
        }

        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .icon-bounce {
          transition: transform 0.3s ease;
        }

        .icon-bounce:hover {
          transform: scale(1.2) rotate(10deg);
        }
      `}</style>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ 
          backgroundImage: `linear-gradient(135deg, rgba(139, 116, 99, 0.3), rgba(205, 180, 155, 0.2)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ">
          <div className="grid lg:grid-cols-1 gap-8 items-center">
            <div className=" lg:text-left animate-on-scroll fade-up stagger-1   ">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl  text-white mb-6 leading-tight fade-up" style={{ fontFamily: 'Playfair Display, serif' }}>
                A Salon Built on Trust, <br />Talent & Togetherness
              </h1>
              <p className="text-base sm:text-lg lg:text-3xl text-white/90 mb-8 max-w-2xl fade-up stagger-1 font-['playfair_display']">
                Happy Family Unisex Salon & Academy is a warm, welcoming space for
                beauty and learning, offering expert care and training with a personal
                touch.
              </p>
            </div>
            <div className="hidden lg:block fade-right">
              {/* Image is in background, this space maintains layout */}
            </div>
          </div>
        </div>
      </section>

      {/* About Academy Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-7xl font-bold text-gray-900 mb-12 lg:mb-16 animate-on-scroll fade-up" style={{ fontFamily: 'Playfair Display, serif' }}>
            About Our Academy
          </h2>
          
          <div className="grid lg:grid-cols-1 gap-8 lg:gap-12 items-start mb-12">
            <div className="animate-on-scroll fade-right">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={academyImage}
                  alt="About our Academy" 
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            </div>
            
            <div className="animate-on-scroll fade-left">
              <p className="text-base sm:text-3xl text-gray-700 mb-8 leading-relaxed font-['poppins'] ">
              At Happy Family Unisex Salon & Academy, we don't just provide beauty services — we shape the future of the beauty industry. Our academy offers expert-led courses designed to build skills, confidence, and careers.
              </p>
              
              <div className="grid gap-6 mb-8 sm:grid-cols-2">
                <div className="bg-[#fff0f0] p-6 rounded-xl">
                  <h3 className="xl:text-5xl text-xl font-medium text-gray-900 mb-3 text-center " style={{ fontFamily: 'Playfair Display, serif' }}>Our Story</h3>
                  <p className="text-gray-700 text-md  font-['poppins'] xl:text-3xl md:p-8">We aim to be the most trusted <br /> and result-driven beauty academy in the region.</p>
                </div>
                <div className="bg-[#fff0f0] p-6 rounded-xl">
                  <h3 className="xl:text-5xl text-xl font-medium text-gray-900 mb-3 text-center " style={{ fontFamily: 'Playfair Display, serif' }}>Our Vision</h3>
                  <p className="text-gray-700 text-md xl:text-3xl  font-['poppins'] md:p-8">We believe in nurturing every <br />learner with honesty, creativity, and expert-led guidance.</p>
                </div>
              </div>
            </div>  
          </div>

          {/* Why Choose Us - Academy */}
          <div className="animate-on-scroll scale-in">
            <h3 className="text-2xl md:text-7xl font-medium text-gray-900 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>Why Choose Us?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {[
                { icon: '⭐', text: 'Certified Trainers', desc: 'Learn from industry professionals with years of expertise and teaching experience.' },
                { icon: '🏛️', text: 'Govt.-Recognized Courses', desc: 'Our certificates are valid, trusted, and valuable for career growth.' },
                { icon: '🎯', text: 'Practical Training', desc: 'Get real-life exposure in salon-style setups with live models.' },
                { icon: '💼', text: 'Placement Support', desc: 'Get guidance and referrals for internships and job opportunities.' },
                { icon: '🛠️', text: 'Job-Ready Skills', desc: 'We teach what the market demands — from day one.' },
                { icon: '🏢', text: 'Modern Learning Space', desc: 'Clean, welcoming classrooms equipped with the latest beauty tools.' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start mb-2">
                    <span className="text-md xl:text-lg mr-3 icon-bounce text-orange-500">{item.icon}</span>
                    <h4 className="font-semibold text-gray-900 text-3xl font['playfair_display']">{item.text}</h4>
                  </div>
                  <p className="text:xs xl:text-xl text-gray-600 ml-8 font-['poppins']">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Salon Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl xl:text-7xl font-bold text-gray-900 mb-12 lg:mb-16 animate-on-scroll fade-up" style={{ fontFamily: 'Playfair Display, serif' }}>
            About Our Salon
          </h2>
          
          <div className="grid lg:grid-cols-1 gap-8 lg:gap-12 items-start mb-12">
            <div className="animate-on-scroll fade-left">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src={salonImage}
                  alt="About our Salon" 
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            </div>
            
            <div className="animate-on-scroll fade-right">
              <p className="text-base md:text-xl 2xl:text-3xl text-gray-700 mb-8 leading-relaxed font-['poppins'] ">
              Happy Family Unisex Salon & Academy is a warm, welcoming space for beauty and learning, offering expert care and training with a personal touch.
              </p>
              
              <div className="grid gap-6 mb-8 sm:grid-cols-2 ">
                <div className="bg-[#fff0f0] p-6 rounded-xl">
                  <h3 className="text-xl xl:text-5xl text-gray-900 mb-3 text-center font-medium " style={{ fontFamily: 'Playfair Display, serif' }}>Our Story</h3>
                  <p className="text-gray-700 text-md 2xl:text-3xl font-['poppins'] md:p-8 ">To enhance natural beauty with expert care and exceptional service.</p>
                </div>
                <div className="bg-[#fff0f0] p-6 rounded-xl ">
                  <h3 className="text-xl xl:text-5xl text-center font-medium  text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Our Vision</h3>
                  <p className="text-gray-700 text-md 2xl:text-3xl  font-['poppins'] md:p-8 ">To be the most trusted unisex salon in the city.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us - Salon */}
          <div className="animate-on-scroll bounce-in">
            <h3 className="text-2xl md:text-7xl font-medium text-gray-900 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>Why Choose Us?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {[
                { icon: '⭐', text: 'Certified Experts', desc: 'To enhance natural beauty through expert care.' },
                { icon: '✨', text: 'Premium Products', desc: 'Best Makeup Routines.' },
                { icon: '👤', text: 'Personalized Services', desc: 'Addressing your unique beauty needs.' },
                { icon: '🛡️', text: 'Hygiene & Safe', desc: 'Protection.' },
                { icon: '🌸', text: 'Relaxing Ambience', desc: 'A welcoming and tranquil environment.' },
                { icon: '😌', text: 'Calming Ambience', desc: 'A welcoming and tranquil environment.' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start mb-2">
                    <span className="text-md xl:text-lg mr-3 icon-bounce text-orange-500">{item.icon}</span>
                    <h4 className="ont-semibold text-gray-900 text-3xl font['playfair_display']">{item.text}</h4>
                  </div>
                  <p className="text-xs xl:text-xl text-gray-600 ml-8 font-['poppins']">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;