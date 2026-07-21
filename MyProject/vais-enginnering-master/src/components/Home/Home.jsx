import React from "react";
import arrow from "../../assets/arrow.png";
import about from "../../assets/about.png";
import testimonials from "../../assets/testimonials.png";
import img from "../../assets/img.png";
import ios from "../../assets/ios.png";
import quote from "../../assets/quote.png";
import digital_marketing from "../../assets/digital_marketing.png";
import web_design from "../../assets/web_design.png";
import marketing_image from "../../assets/marketing_image.png";
import ecommerce from "../../assets/ecommerce.png";
import maintenance from "../../assets/maintenance.png";
import cloud from "../../assets/cloud.png";
import ui_ux from "../../assets/ui-ux.png";
import SEO from "../../assets/SEO.png";
import arrow2 from "../../assets/arrow2.png";
import partners from "../../assets/partners.png";
import blog_1 from "../../assets/Blog_1.png";
import blog_2 from "../../assets/Blog_2.png";
import blog_3 from "../../assets/Blog_3.png";

import Layout from "../layout/Layout";
import { Orbit } from "../Orbit/Orbit";
import {Cards} from "../Cards/Cards"
import { BgBeam } from "../Orbit/BgBeam";
import { GlowingEffectDemo } from "../Cards/GlowingEffectDemoSecond";
import { BorderBeam } from "../ui/border-beam";


const Home = () => {
  return (
    <Layout pages="HOME">
      <section className="min-h-screen w-screen flex flex-col  justify-center  mobile-sm:px-6 mobile-lg:px-[150px] mobile-lg:pt-[128px] gap-12  py-12">
        {/* Section Header */}
        <div className="text-center mobile-lg:text-left ">
          <p className="text-[16px] mb-4 font-medium uppercase text-gray-500">
            Services
          </p>
          {/* <h2 className="text-[28px] mobile-lg:text-[58px] font-semibold leading-tight">
            Providing visual <br className="hidden mobile-lg:block" />
            Services.
          </h2> */}

          
          <div
            className=" text-[28px] mobile-lg:text-[58px] font-semibold leading-tight  left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
            <span className="">Providing visual</span>
          </div>
          <div
            className="text-[28px] mobile-lg:text-[58px] font-semibold leading-tight relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
            <span className="">Services.</span>
          </div>
          

        </div>

        {/* Services Orbit */}
      
        {/* Services Cards */}
        <div className=" flex mobile-sm:flex-wrap gap-6">
         
          {/* Card 1 */}
          <div className="relative mobile-sm:h-auto mobile-lg:w-[500px] w-auto rounded-xl p-8 flex flex-col items-start justify-between text-[#000000] bg-[#fafafa]">
            <img src={web_design} alt="Website Design" className="mb-4" />
            <h3 className="text-[20px] mobile-lg:text-[24px] font-semibold">
              Website Design & Development
            </h3>
            <p className="text-[14px] mobile-lg:text-[16px]">
              Crafting digital experiences that captivate and convert. I
              transform visions into vibrant, user-friendly websites.
            </p>
            <button className="mt-4 flex items-center text-[14px] mobile-lg:text-[16px] text-[#000000]">
              <a href="#" className="mr-2">
                More
              </a>
              <img src={arrow} alt="arrow" />
            </button>
            <BorderBeam />
          </div>

          {/* Card 2 */}
          <div className=" relative mobile-sm:h-auto mobile-lg:w-[500px] rounded-xl p-8 flex flex-col items-start justify-between text-[#ffffff] bg-[#202020]">
            <img src={ios} alt="iOS" className="mb-4" />
            <h3 className="text-[20px] mobile-lg:text-[24px] font-semibold">
              iOS & Android App Development
            </h3>
            <p className="text-[14px] mobile-lg:text-[16px]">
              Crafting digital experiences that captivate and convert. I
              transform visions into vibrant, user-friendly websites.
            </p>
            <button className="mt-4 flex items-center text-[14px] mobile-lg:text-[16px] text-[#ffffff]">
              <a href="#" className="mr-2">
                More
              </a>
              <img src={arrow} alt="arrow" />
            </button>
            <BorderBeam />
          </div>

          {/* Card 3 */}
          <div className=" relative mobile-sm:h-auto mobile-lg:w-[500px] rounded-xl p-8 flex flex-col items-start justify-between text-[#000000] bg-[#fafafa]">
            <img
              src={digital_marketing}
              alt="Digital Marketing"
              className="mb-4"
            />
            <h3 className="text-[20px] mobile-lg:text-[24px] font-semibold">
              Digital Marketing & SEO Services
            </h3>
            <p className="text-[14px] mobile-lg:text-[16px]">
              We offer comprehensive digital marketing solutions to help
              businesses grow online.
            </p>
            <button className="mt-4 flex items-center text-[14px] mobile-lg:text-[16px] text-[#000000]">
              <a href="#" className="mr-2">
                More
              </a>
              <img src={arrow} alt="arrow" className="font-[#000000]" />
            </button>
            <BorderBeam />
          </div>



        </div>

        
      </section>

      <section
        className="h-auto mobile-lg:h-[931px] w-full bg-center bg-cover mobile-sm:py-12"
        style={{ backgroundImage: `url(${about})` }}
      >
        <div className="flex flex-col items-start justify-center h-full p-6 mobile-sm:p-8 mobile-lg:pl-[1075px] gap-4 mobile-sm:gap-6 mobile-lg:gap-[40px] text-[#ffffff]">
          {/* About Us Title */}
          <p className="uppercase text-xs mobile-sm:text-mobile-sm mobile-lg:text-base">about us</p>

          {/* Heading */}
          <h2 className="text-2xl mobile-sm:text-3xl mobile-lg:text-[58px] text-left leading-snug mobile-sm:leading-tight">
            <span className="text-[#f17a1f]">Innovative</span> Engineering{" "}
            <br />
            Solutions Services
          </h2>

          {/* Description */}
          <p className="text-mobile-sm mobile-sm:text-base mobile-lg:text-[20px] leading-relaxed">
            In addition to comprehensive IT solutions, Vais Engineering Private
            Limited also provides ATM Service support to ensure the quality of
            every project that it undertakes.
          </p>
          <p className="text-mobile-sm mobile-sm:text-base mobile-lg:text-[20px] leading-relaxed">
            We specialize in crafting digital experiences that captivate and
            convert. As a forward-thinking web development company, we transform
            your ideas into dynamic, user-friendly websites that combine
            aesthetic appeal with seamless functionality.
          </p>

          {/* Learn More Button */}
          <button className="mt-4 flex items-center text-xs mobile-sm:text-mobile-sm mobile-lg:text-[16px] text-[#ffffff]">
            <a href="#" className="mr-2 text-xs mobile-sm:text-mobile-sm mobile-lg:text-[14px]">
              LEARN MORE
            </a>
            <img src={arrow} alt="arrow" />
          </button>
        </div>
      </section>

      <section className="h-auto mobile-lg:h-[1080px] flex flex-col mobile-lg:flex-row justify-around gap-12 bg-[#fafafa] mobile-sm:py-12">
        <div className="w-full mobile-lg:w-[55%] flex flex-col items-center justify-center px-6 mobile-lg:pl-[300px]">
          <div className="w-full mobile-lg:w-[772px]">
            <p className="text-[14px] mobile-sm:text-[16px]">MARKETING</p>
            <h1 className="pt-[25px] mobile-sm:pt-[35px] mobile-lg:pt-[45px] text-[32px] mobile-sm:text-[42px] mobile-lg:text-[58px] font-semibold">
              Transforming Ideas into <br />
              Digital Excellence
            </h1>
            <p className="pt-[40px] mobile-sm:pt-[50px] mobile-lg:pt-[73px] text-[16px] mobile-sm:text-[18px] mobile-lg:text-[20px]">
              From concept to creation, we bring your digital ideas to life with{" "}
              <br className="hidden mobile-lg:block" />
              innovative designs, robust technologies, and seamless user{" "}
              <br className="hidden mobile-lg:block" />
              experiences that define excellence.
            </p>
            <div className="img-sec">
              <div className="container mx-auto py-8 mobile-sm:py-10">
                <div className="grid grid-cols-1 mobile-sm:grid-cols-2 gap-4 mobile-sm:gap-0">
                  {/* Row 1 */}
                  <div className="flex items-center gap-4 p-6 border-b-2 border-gray-300">
                    <img
                      src={ecommerce}
                      alt="E-Commerce Solutions"
                      className="w-10 h-10 mobile-sm:w-12 mobile-sm:h-12"
                    />
                    <p className="text-mobile-sm mobile-sm:text-mobile-lg font-semibold">
                      E-Commerce Solutions
                    </p>
                  </div>
                  <div className="flex items-center gap-4 p-6 border-b-2 mobile-sm:border-l border-gray-300">
                    <img
                      src={maintenance}
                      alt="Maintenance & Support"
                      className="w-10 h-10 mobile-sm:w-12 mobile-sm:h-12"
                    />
                    <p className="text-mobile-sm mobile-sm:text-mobile-lg font-semibold">
                      Maintenance & Support
                    </p>
                  </div>

                  {/* Row 2 */}
                  <div className="flex items-center gap-4 p-6 border-b-2 border-gray-300">
                    <img
                      src={cloud}
                      alt="Cloud Integration Services"
                      className="w-10 h-10 mobile-sm:w-12 mobile-sm:h-12"
                    />
                    <p className="text-mobile-sm mobile-sm:text-mobile-lg font-semibold">
                      Cloud Integration Services
                    </p>
                  </div>
                  <div className="flex items-center gap-4 p-6 border-b-2 mobile-sm:border-l border-gray-300">
                    <img
                      src={ui_ux}
                      alt="UI/UX Design"
                      className="w-10 h-10 mobile-sm:w-12 mobile-sm:h-12"
                    />
                    <p className="text-mobile-sm mobile-sm:text-mobile-lg font-semibold">
                      UI/UX Design
                    </p>
                  </div>

                  {/* Row 3 */}
                  <div className="flex items-center gap-4 p-6">
                    <img
                      src={SEO}
                      alt="SEO & Digital Marketing"
                      className="w-10 h-10 mobile-sm:w-12 mobile-sm:h-12"
                    />
                    <p className="text-mobile-sm mobile-sm:text-mobile-lg font-semibold">
                      SEO & Digital Marketing
                    </p>
                  </div>
                  <div className="flex items-center gap-4 p-6 mobile-sm:border-l border-gray-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full mobile-lg:w-auto">
          <img
            src={marketing_image}
            alt="bg-hero-pattern2"
            className="w-full mobile-sm:w-auto max-w-[90%] mobile-lg:max-w-none bg-cover bg-center"
          />
        </div>
      </section>

      <section className="min-h-[840px] flex flex-col-reverse mobile-lg:flex-row items-center justify-center gap-8 mobile-lg:gap-[115px]  mobile-sm:py-12 px-4 mobile-lg:px-0">
        <div className="left w-full mobile-lg:w-auto">
          {/* <img src={partners} alt="partners" className="max-w-full h-auto" /> */}
          <div>
           <Orbit/>
         
          </div>

        </div>
        <div className="right w-full mobile-lg:w-auto">
          <div className="items flex flex-col items-start justify-center h-full">
            <p className="text-[16px] uppercase">partners</p>
            <h1 className="text-[32px] mobile-lg:text-[58px] font-semibold leading-tight">
              Driving Innovation <br className="hidden mobile-lg:block" />
              Through <span className="text-[#f17b20]">Collaboration</span>
            </h1>
            <p className="text-[16px] mobile-lg:text-[20px] pt-[20px] mobile-lg:pt-[40px]">
              We are proud to work alongside an esteemed network of{" "}
              <br className="hidden mobile-lg:block" />
              partners, each bringing unique expertise and value to our{" "}
              <br className="hidden mobile-lg:block" />
              projects. These collaborations empower us to innovate,{" "}
              <br className="hidden mobile-lg:block" />
              expand our capabilities.
            </p>
            <button className="relative mt-6 mobile-lg:mt-[55px] h-[55px] mobile-lg:h-[65px] w-[180px] mobile-lg:w-[222px] flex border border-black bg-[#ffffff] text-black items-center justify-around rounded-[60px] px-4 hover:bg-black hover:text-white transition-colors">
              GET STARTED
              <span>
                <img src={arrow2} alt="arrow" />
              </span>
              <BorderBeam size={100} borderWidth={3} />
            </button>
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
              <div className="three mobile-lg:w-full mobile-sm:w-auto mobile-sm:h-auto sm:flex-row flex-col    flex items-center justify-center gap-4">
         <Cards image={blog_1} text={"Top 5 Web Design Trends to Watch in 2025"} header={"Stay ahead of the curve by exploring the latest web design trends that are shaping the digital landscape"}/>
          <Cards image={blog_2} text={" How to Optimize Your Website for User Engagement"} header={" Learn actionable strategies to make your website more engaging.From improving coding speeds."}/>
          <Cards image={blog_3} text={" The Future of AI in Web"} header={"   Explore how artificial intelligence is revolutionizing web development, from automating coding processes."}/>
          </div>               
  
              {/* <div className="three mobile-lg:w-full mobile-sm:w-auto mobile-sm:h-auto    flex flex-col">
                <div className="mobile-lg:h-[647px]  flex mobile-sm:flex-wrap mobile-lg:flex-nowrap   mobile-lg:items-center mobile-lg:justify-center">
                  <div className="card1 gap-5 flex  mobile-lg:w-[393px] flex-col  border-[#f7f7f7] p-4 rounded-mobile-lg">
                    <img
                      src={blog_1}
                      alt="blog_1"
                      className="w-full h-full  rounded-mobile-lg"
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
                      className="w-full h-full rounded-mobile-lg"
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
              </div> */}


              <div className="four mt-6 mobile-lg:mt-[55px]">
                <button className="relative h-[55px] mobile-lg:h-[65px] w-[180px] mobile-lg:w-[222px] flex border border-black bg-[#ffffff] text-black items-center justify-around rounded-[60px] px-4 hover:bg-black hover:text-white transition-colors">
                  MORE POST
                  <span>
                    <img src={arrow2} alt="arrow" />
                  </span>
                  <BorderBeam size={100} borderWidth={2}/>
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
    </Layout>
  );
};

export default Home;
