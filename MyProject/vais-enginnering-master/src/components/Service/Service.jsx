import React from "react";
import Footer from "../Footer/Footer";
import ServiceHeader from "../Header/ServiceHeader";
import Service1 from "../../assets/service_image_1.png";
import Service2 from "../../assets/service_image_2.png";
import Service3 from "../../assets/service_image_3.png";
import other_service_bg from "../../assets/other_service_bg.png";
import arrow from "../../assets/arrow.png";
import arrow2 from "../../assets/arrow2.png";
import other_service_image_1 from "../../assets/other_service_image_1.png";
import other_service_image_2 from "../../assets/other_service_image_2.png";
import testimonials from "../../assets/testimonials.png";
import img from "../../assets/img.png";
import quote from "../../assets/quote.png";
import blog_1 from "../../assets/Blog_1.png";
import blog_2 from "../../assets/Blog_2.png";
import blog_3 from "../../assets/Blog_3.png";
import gallery_image_1  from "../../assets/gallery_image_1.png";
import gallery_image_2  from "../../assets/gallery_image_2.png";
import gallery_image_3  from "../../assets/gallery_image_3.png";
import gallery_image_4  from "../../assets/gallery_image_4.png";
import gallery_image_5  from "../../assets/gallery_image_5.png";
import gallery_image_6  from "../../assets/gallery_image_6.png";

const Service = () => {
  return (
    <div className=" flex flex-col w-full overflow-hidden">
      <ServiceHeader />
      <section className="  bg-white flex items-center justify-center mobile-sm:py-12 mobile-sm:px-1 mobile-sm:h-auto mobile-sm:w-full mobile-lg:h-[991px] ">
        <div className=" mx-auto px-6 mobile-lg:px-20">
          <div className="grid mobile-lg:grid-cols-2 gap-12 items-center  mobile-sm:w-full  mobile-lg:w-[1540px]">
            {/* Left Section */}
            <div className=" mobile-lg:w-[700px]  mobile-sm:w-auto mobile-sm:py">
              <h3 className="text-[16px] font-normal leading-[19px] tracking-[1px] text-black uppercase">
                Services
              </h3>
              <h2 className="mt-4 mobile-sm:text-[30px] mobile-lg:text-[58px] font-semibold mobile-lg:leading-[68px] text-gray-900">
                End-to-End <span className="text-orange-500">Technology</span>{" "}
                Solutions
              </h2>
              <p className="mt-6 text-[#000000] mobile-lg:pt-[38px] mobile:mobile-lg:text-[20px] mobile-sm:leading-[30px] mobile-lg:leading-[36px]">
                Our iOS & Android App Development ensures high-quality mobile
                applications for both platforms. We provide reliable ATM Service
                Support for seamless operations, along with Web design services
                to create engaging and user-friendly websites.
              </p>
              <p className="mt-4 text-[#000000] mobile:mobile-lg:text-[20px]  mobile-lg:leading-[36px] mobile-sm:leading-[30px]">
                Partner with us to elevate your digital presence & operational
                efficiency!
              </p>
              <button className="mt-4 uppercase text-[14px] tracking-[1px] text-bold mobile-sm:mt-6 mobile-lg:mt-[55px] h-[45px] mobile-sm:h-[55px] mobile-lg:h-[65px] w-[140px] mobile-sm:w-[180px] mobile-lg:w-[222px] flex border border-black text-black items-center justify-around rounded-[60px] px-3 mobile-sm:px-4">
                read more
                <span>
                  <img src={arrow} alt="arrow" />
                </span>
              </button>
            </div>

            {/* Right Section */}
            <div className="flex  mobile-lg:flex-nowrap mobile-sm:flex-wrap   justify-center items-center mobile-lg:w-[834px] gap-3">
              <div className="flex flex-col mobile-sm:flex-nowrap mobile-lg:flex-wrap justify-center  items-center gap-3">
                {/* Card 1 */}
                <div className="relative overflow-hidden rounded-xl  mobile-lg:h-[332px] mobile-lg:w-[422px]">
                  <img
                    src={Service1}
                    alt="Software Development Services"
                    className="w-full h-full object-fit"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-center">
                    <h3 className="text-white mobile-sm:font-normal mobile-lg:font-semibold mobile-lg:text-[24px] flex  mobile-lg:pl-[30px] mb-5">
                      SOFTWARE DEVELOPMENT SERVICES
                    </h3>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="relative overflow-hidden rounded-xl shadow-md mobile-lg:h-[332px] mobile-lg:w-[422px]">
                  <img
                    src={Service2}
                    alt="ATM Service Support"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-center">
                    <h3 className="text-white uppercase mobile-sm:font-normal  mobile-lg:font-semibold mobile-lg:text-[24px] flex  mobile-lg:pl-[30px] mb-5">
                      App Development Services
                    </h3>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="relative overflow-hidden rounded-xl shadow-md mobile-lg:h-[680px] mobile-lg:w-[400px]">
                <img
                  src={Service3}
                  alt="App Development Services"
                  className="w-full h-full object-cover"
                />
                <div className="absolute items-start justify-end inset-0 flex-col bg-black bg-opacity-30 flex r">
                  <div className="mobile-sm:mb-5">
                    <h3 className="text-white  mobile-sm:font-normal  mobile-sm:pl-[30px] mobile-lg:font-semibold mobile-lg:text-[24px] flex  mobile-lg:pl-[30px] mb-5">
                      APP DEVELOPMENT SERVICES
                    </h3>
                    <h3 className="text-white font-regular flex mobile-sm:pl-[30px] mobile-sm:mb-5 mobile-lg:pl-[30px] text-[18px]">
                      Supporting ATMs and monitoring their operations across the
                      entire Indian country
                    </h3>
                    <a className="text-mobile-sm text-orange-300 mobile-sm:pl-[30px]">
                      Learn More
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="mobile-lg:h-[876px] mobile-sm:px-5 flex items-center justify-center mobile-sm:h-auto mobile-sm:w-auto mobile-sm:bg-cover mobile-sm:bg-center"
        style={{ backgroundImage: `url(${other_service_bg})` }}
      >
        <div className="main mobile-lg:w-[1720px] mobile-lg:h-full  flex items-center justify-center mobile-sm:flex-wrap mobile-lg:flex-nowrap mobile-sm:px-4 mobile-sm:py-16">
          <div className="left flex flex-col justify-center mobile-lg:w-[767px] mobile-lg:h-full ">
            <div className=" mobile-lg:w-[700px]  mobile-sm:w-auto mobile-sm:py">
              <h3 className="text-[16px] font-extrathin leading-[19px] tracking-[2px] text-white uppercase">
                Other services
              </h3>
              <h2 className="mt-4 mobile-sm:text-[30px] mobile-lg:text-[58px] font-semibold mobile-lg:leading-[68px] text-white">
                Hospitality <span className="text-orange-500">Services</span>{" "}
              </h2>
              <p className="mt-6 text-[#ffffff] mobile-lg:pt-[38px] mobile-lg:text-[20px] mobile-sm:leading-[30px] mobile-lg:leading-[36px]">
                We specialize in creating memorable events & stunning interiors
                tailored to your needs. Our event management services cover
                everything from planning & coordination to execution, ensuring a
                seamless experience.
              </p>
              <p className="mt-4 text-[#ffffff] mobile-lg:text-[20px]  mobile-lg:leading-[36px] mobile-sm:leading-[30px]">
                Additionally, our interior services focus on design and
                decoration, transforming spaces to reflect your style and
                vision.
              </p>
              <button className="mt-4 uppercase text-[14px] tracking-[1px] text-bold mobile-sm:mt-6 mobile-lg:mt-[55px] h-[45px] mobile-sm:h-[55px] mobile-lg:h-[65px] w-[140px] mobile-sm:w-[180px] mobile-lg:w-[222px] flex border border-black bg-[#f17b20] text-black items-center justify-around rounded-[60px] px-3 mobile-sm:px-4">
                Get Started
                <span>
                  <img src={arrow2} alt="arrow" />
                </span>
              </button>
            </div>
          </div>

          <div className="right mobile-lg:w-[771px] mobile-sm:py-16  mobile-lg:h-full  flex flex-col gap-5  items-center justify-center">
            <div className="d1 mobile-sm:py-10 mobile-lg:h-[256px] mobile-lg:flex-col flex w-full border mobile-sm:gap-5 mobile-lg:gap-0 rounded-3xl mobile-sm:flex-wrap mobile-sm:justify-center">
              <div className="mobile-lg:w-[331px] mobile-lg:h-full  flex justify-center items-center">
                <img src={other_service_image_1} alt="other_service_image_1" />
              </div>
              <div className="mobile-lg:w-[440px] mobile-lg:h-full  flex flex-col mobile-sm:px-7  justify-center gap-5">
                <h2 className="uppercase mobile-lg:text-[26px] text-[#f17a1f] font-semibold mobile-lg:leading-[28px]">
                  Event Management
                </h2>
                <p className="mobile-lg:text-[18px] mobile-sm:text-[16px] mobile-lg:leading-[28px] text-[#ffffff]">
                  Vais Production specializes in event management, providing
                  comprehensive services designed to create unforgettable
                  experiences for clients.
                </p>
              </div>
            </div>

            <div className="d2 border mobile-sm:py-10 mobile-lg:h-[256px] mobile-lg:flex-col flex w-full mobile-sm:gap-5 mobile-lg:gap-0 rounded-3xl mobile-sm:flex-wrap mobile-sm:justify-center">
              <div className="mobile-lg:w-[331px] mobile-lg:h-full  flex justify-center items-center">
                <img src={other_service_image_2} alt="other_service_image_1" />
              </div>
              <div className="mobile-lg:w-[440px] mobile-lg:h-full  flex flex-col mobile-sm:px-7 mobile-sm:text-[] justify-center gap-5">
                <h2 className="uppercase mobile-lg:text-[26px] text-[#f17a1f] font-semibold mobile-lg:leading-[28px]">
                  Interior Design
                </h2>
                <p className="mobile-lg:text-[18px] mobile-sm:text-[16px] mobile-lg:leading-[28px] text-[#ffffff]">
                  GlowDecoor embodies the essence of contemporary interior
                  design, focusing on creating spaces that are both inviting &
                  aesthetically pleasing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className=" mobile-lg:h-screen w-screen mobile-lg:px-12 mobile-md:w-auto">
      <div className="bg-white text-black ">
      <div className="container mx-auto py-12 px-6 text-center">
        <div className="mb-12">
          <p className="text-[16px] text-black uppercase tracking-widest mb-2">Our Gallery</p>
          <h1 className="mobile-lg:text-[58px] mobile-sm:text-[20px] font-bold">
            Showcasing Our <span className="text-orange-500">Successful</span> <br />Projects
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <img
          src={gallery_image_1}
            alt="Project 1"
            className="w-full rounded-lg object-cover"
          />
           <div className="w-full h-0 pb-[75%] rounded-lg mobile-sm:hidden mobile-lg:block"></div>
          {/* <img
            src={gallery_image_2}
            alt="Project 2"
            className="w-full rounded-lg object-cover "
          /> */}
          <img
            src={gallery_image_6}
            alt="Project 3"
            className="w-full rounded-lg object-cover"
          />
          <img
            src={gallery_image_3}
            alt="Project 4"
            className="w-full rounded-lg object-cover"
          />
          <img
            src={gallery_image_2}
            alt="Project 5"
            className="w-full rounded-lg object-cover"
          />
          <img
            src={gallery_image_5}
            alt="Project 6"
            className="w-full rounded-lg object-cover"
          />
           <div className="w-full h-0 pb-[75%] rounded-lg mobile-sm:hidden mobile-lg:block"></div>
          {/* <img
            src={gallery_image_6}
            alt="Project 6"
            className="w-full rounded-lg object-cover"
          /> */}
          <img
            src={gallery_image_4}
            alt="Project 6"
            className="w-full rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
      </section>

      <section
        className="mobile-lg:h-[855px] mobile-sm:px-5 flex items-center justify-center  mobile-sm:h-auto mobile-sm:w-auto mobile-sm:bg-cover mobile-sm:bg-center"
        style={{ backgroundImage: `url(${testimonials})` }}
      >
        <div className="main mobile-lg:w-[1720px] mobile-lg:h-full  flex  justify-start mobile-sm:flex-wrap mobile-lg:flex-nowrap mobile-sm:px-4 mobile-sm:py-16">
          <div className="left flex items-center justify-center mobile-lg:gap-2 mobile-lg:w-[767px] mobile-lg:h-full ">
            <div className="flex flex-col mobile-lg:h-full mobile-lg:py-[122px]   items-center gap-12">
              <hr className=" mobile-lg:w-[100px] border-1 mobile-lg:visible mobile-sm:hidden mobile-lg:block" />
              <img
                src={quote}
                alt="quote"
                className=" mobile-sm:w-[30px] mobile-sm:hidden mobile-lg:block"
              />
            </div>

            <div className="  mobile-lg:w-[700px]  mobile-sm:w-auto mobile-sm:py">
              <h3 className="text-[16px] font-extrathin leading-[19px] tracking-[2px] text-white uppercase">
                testimonials
              </h3>
              <h2 className="mt-4 mobile-sm:text-[30px] mobile-lg:text-[58px] font-semibold mobile-lg:leading-[64px] text-white">
                Hear From Our <br />
                Happy Clients
              </h2>
              <p className="mt-6  text-[#ffffff] mobile-lg:pt-[38px] mobile-lg:text-[20px] mobile-sm:leading-[36px] mobile-lg:leading-[36px]">
                Working with Vais Engineering Pvt Ltd was a seamless{" "}
                <br className="hidden mobile-lg:block" />
                experience. Their team brought our vision to life with{" "}
                <br className="hidden mobile-sm:block" />
                precision and creativity. The results exceeded our{" "}
                <br className="hidden mobile-sm:block" />
                expectations!

                <hr className=" mobile-lg:mt-[50px] mobile-lg:mb-[33px] mobile-lg:w-[100px] border-1 mobile-lg:visible mobile-sm:hidden mobile-lg:block" />
              <p className="text-[14px] mobile-sm:py-4 mobile-lg:py-0 mobile-sm:text-[12px] tracking-[2px] leading-[19px] uppercase">Rajesh Mehra</p>
              <p className="text-[14px] mobile-sm:text-[12px] ">
                Founder, Mehra Enterprises
              </p>
              </p>
              
            </div>
          </div>
        </div>
      </section>

      <section className="mobile-lg:h-[1280px]  mobile-sm:py-12 flex flex-col items-center justify-center gap-5 p-5">
        <div className="one ">
          <p className="uppercase text-[16px]">latest blog</p>
        </div>
        <div className="two pb-[108px]">
          <h1 className="text-[36px] md:text-[48px] mobile-lg:text-[58px] font-semibold text-center">
            Latest Articles & Updates
          </h1>
        </div>
        <div className="three mobile-lg:w-full mobile-sm:w-auto mobile-sm:h-auto    flex flex-col">
          <div className="mobile-lg:h-[647px]  flex mobile-sm:flex-wrap mobile-lg:flex-nowrap   mobile-lg:items-center mobile-lg:justify-center">
            <div className="card1 gap-5 flex  mobile-lg:w-[393px] flex-col  border-[#f7f7f7] p-4 rounded-mobile-lg">
              <img
                src={blog_1}
                alt="blog_1"
                className="w-full h-full  rounded-lg"
              />
              <p className="text-[18px] text-[#3a3a3a]">4 July, 2024</p>
              <h2 className="text-[20px] md:text-[24px] font-medium text-left md:text-left">
                Top 5 Web Design Trends to Watch in 2024
              </h2>
              <p className="text-[16px] md:text-[18px] text-left md:text-left">
                Stay ahead of the curve by exploring the latest web design
                trends that are shaping the digital landscape
              </p>
              <button className="mt-4 flex items-center  justify-start md:justify-start text-xs mobile-sm:text-mobile-sm mobile-lg:text-[16px] text-[#000000]">
                <a
                  href="#"
                  className="mr-2 text-xs mobile-sm:text-mobile-sm mobile-lg:text-[14px]"
                >
                  read more
                </a>
                <img src={arrow} alt="arrow" />
              </button>
            </div>
            <div className="card2 gap-5 flex flex-col border mobile-lg:w-[393px] border-[#f7f7f7] p-4 rounded-mobile-lg">
              <img
                src={blog_2}
                alt="blog_2"
                className="w-full h-full rounded-lg"
              />
              <p className="text-[18px] text-[#3a3a3a]">26 July, 2024</p>
              <h2 className="text-[20px] md:text-[24px] font-medium text-left md:text-left">
                How to Optimize Your Website for User Engagement
              </h2>
              <p className="text-[16px] md:text-[18px] text-left md:text-left">
                Learn actionable strategies to make your website more engaging.
                From improving coding speeds.
              </p>
              <button className="mt-4 flex items-center justify-start md:justify-start text-xs mobile-sm:text-mobile-sm mobile-lg:text-[16px] text-[#000000]">
                <a
                  href="#"
                  className="mr-2 text-xs mobile-sm:text-mobile-sm mobile-lg:text-[14px]"
                >
                  read more
                </a>
                <img src={arrow} alt="arrow" />
              </button>
            </div>
            <div className="card3 gap-5 flex flex-col mobile-lg:w-[393px] border border-[#f7f7f7] p-4 rounded-mobile-lg">
              <img
                src={blog_3}
                alt="blog_3"
                className="w-full h-auto rounded-mobile-lg"
              />
              <p className="text-[18px] text-[#3a3a3a]">11 November, 2024</p>
              <h2 className="text-[20px] md:text-[24px] font-medium text-left md:text-left">
                The Future of AI in Web <br /> Development
              </h2>
              <p className="text-[16px] md:text-[18px] text-left md:text-left">
                Explore how artificial intelligence is revolutionizing web
                development, from automating coding processes.
              </p>
              <button className="mt-4 flex items-center justify-start md:justify-start text-xs mobile-sm:text-mobile-sm mobile-lg:text-[16px] text-[#000000]">
                <a
                  href="#"
                  className="mr-2 text-xs mobile-sm:text-mobile-sm mobile-lg:text-[14px]"
                >
                  read more
                </a>
                <img src={arrow} alt="arrow" />
              </button>
            </div>
          </div>
        </div>
        <div className="four mt-6 mobile-lg:mt-[55px]">
          <button className="h-[55px] mobile-lg:h-[65px] w-[180px] mobile-lg:w-[222px] flex border border-black bg-[#ffffff] text-black items-center justify-around rounded-[60px] px-4 hover:bg-black hover:text-white transition-colors">
            MORE POST
            <span>
              <img src={arrow2} alt="arrow" />
            </span>
          </button>
        </div>
      </section>

      <section
        className="mobile-lg:h-[876px] mobile-sm:px-5 flex items-center justify-center  mobile-sm:h-auto mobile-sm:w-auto mobile-sm:bg-cover mobile-sm:bg-center"
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="main mobile-lg:w-[1720px] mobile-lg:h-full  flex  justify-start mobile-sm:flex-wrap mobile-lg:flex-nowrap mobile-sm:px-4 mobile-sm:py-16">
          <div className="left flex items-center  justify-center mobile-lg:gap-2 mobile-lg:w-[767px] mobile-lg:h-full ">
            <div className="flex  mobile-lg:h-full mobile-lg:py-[168px] ">
              <hr className=" mobile-lg:w-[100px] border-1 mobile-lg:visible" />
            </div>

            <div className=" mobile-lg:w-[700px]  mobile-sm:w-auto mobile-sm:py">
              <h3 className="text-[16px] font-extrathin leading-[19px] tracking-[2px] text-white uppercase">
                Let’s talk
              </h3>
              <h2 className="mt-4 mobile-sm:text-[30px] mobile-lg:text-[58px] font-semibold mobile-lg:leading-[68px] text-white">
                Ready to talk about your next project?
              </h2>
              <p className="mt-6 text-[#ffffff] mobile-lg:pt-[38px] mobile-lg:text-[20px] mobile-sm:leading-[30px] mobile-lg:leading-[36px]">
                Learn the essential steps to establish and grow your brand’s
                online identity
              </p>
              <button className="mt-4 uppercase text-[14px] tracking-[1px] text-bold mobile-sm:mt-6 mobile-lg:mt-[55px] h-[45px] mobile-sm:h-[55px] mobile-lg:h-[65px] w-[140px] mobile-sm:w-[180px] mobile-lg:w-[222px] flex border border-black bg-[#f17b20] text-black items-center justify-around rounded-[60px] px-3 mobile-sm:px-4">
                Get Started
                <span>
                  <img src={arrow2} alt="arrow" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Service;

