import React from "react";
import AboutUsHeader from "../Header/AboutUsHeader";
import team_bg from "../../assets/AboutUs/team_bg.png";
import image_1 from "../../assets/AboutUs/image_1.png";
import image_2 from "../../assets/AboutUs/image_2.png";
import image_3 from "../../assets/AboutUs/image_3.png";
import image_4 from "../../assets/AboutUs/image_4.png";
import image from "../../assets/AboutUs/image.png";
import ATM_Service from "../../assets/AboutUs/ATM_Service.png";
import Digital_Marketing from "../../assets/AboutUs/Digital_Marketing.png";
import tick from "../../assets/AboutUs/tick.png";
import service_bg from "../../assets/AboutUs/Service_bg.png";
import icon_1 from "../../assets/AboutUs/icon_1.png";
import icon_2 from "../../assets/AboutUs/icon_2.png";
import icon_3 from "../../assets/AboutUs/icon_3.png";
import icon_4 from "../../assets/AboutUs/icon_4.png";
import black_arrow from "../../assets/AboutUs/black arrow.png";
import Footer from "../Footer/Footer";
import img from "../../assets/img.png";
import arrow from "../../assets/arrow.png";
import arrow2 from "../../assets/arrow2.png";
import blog_1 from "../../assets/Blog_1.png";
import blog_2 from "../../assets/Blog_2.png";
import blog_3 from "../../assets/Blog_3.png";
import { Cards } from "../Cards/Cards";


const team = [image_1, image_2, image_3, image_4];

const iconSection = [
  {
    icon: icon_1,
    title: "Content Marketing",
    description:
      "Crafting engaging, keyword-rich content that resonates with your audience and boosts your search rankings.",
  },
  {
    icon: icon_2,
    title: "Web Development",
    description:
      "Custom website design and development tailored to enhance user experience and meet your business goals.",
  },
  {
    icon: icon_3,
    title: "SEO & Digital Marketing",
    description:
      "we specialize in helping businesses thrive in the digital landscape with our SEO & Digital Marketing services.",
  },
  {
    icon: icon_4,
    title: "ATM SLM Support",
    description:
      "Expert support for ATM services, ensuring seamless operations and maintenance for your business needs.quis nostrud.",
  },
];

const projects = [
  {
    id: 1,
    title: "Digital Marketing",
    description:
      "Building websites optimized for growth with integrated SEO and marketing tools.",
    image: Digital_Marketing,
    icon: icon_1,
  },
  {
    id: 2,
    title: "ATM Service",
    description:
      "We manage the entire ATM deployment process, from site selection to installation and commissioning.",
    image: ATM_Service,
    icon: icon_4,
  },
];

const features = [
  "Customized Solutions for Every Vision",
  "Focus on Cutting-Edge Design and Technology",
  "Collaborative and Transparent Process",
  "Expertly organizing events with a focus on detail and creativity.",
];

const AboutUs = () => {
  return (
    <div>
      <AboutUsHeader />
      <section className="flex items-center justify-center h-auto w-full py-12">
        <div className="m flex  flex-wrap  items-center w-full justify-around">
          <div className="left flex w-[600px] ">
            <div className="flex flex-col items-start justify-center h-full p-6 mobile-sm:p-8  gap-4 mobile-sm:gap-6 mobile-lg:gap-[40px] text-[#ffffff]">
              {/* About Us Title */}
              <p className="uppercase text-black text-xs mobile-sm:text-mobile-sm mobile-lg:text-base">
                about us
              </p>

              {/* Heading */}
              <h2 className="text-[58px] font-semibold text-black mobile-sm:text-3xl mobile-lg:text-[58px] text-left leading-snug mobile-sm:leading-tight">
                Innovative IT
                <br />
                Solutions for You
              </h2>

              {/* Description */}
              <p className="text-normal text-black mobile-sm:text-base mobile-lg:text-[20px] leading-relaxed">
                At Vais Engineering Pvt Ltd, we specialize in crafting digital
                experiences that go beyond aesthetics. Our mission is to
                transform visions into vibrant, functional, and user-centric
                websites that captivate audiences and drive meaningful results.
              </p>
              <p className="text-mobile-sm text-black mobile-sm:text-base mobile-lg:text-[20px] leading-relaxed">
                With a team of passionate designers, developers, and
                strategists, we bring together creativity and technical
                expertise to deliver tailored solutions that align with your
                business goals
              </p>

              {/* Learn More Button */}
              <button className="mt-4 mobile-sm:text-[14px] mobile-mobile-lg:text-[16px]  mobile-sm:mt-6 mobile-mobile-lg:mt-[55px] h-[45px] mobile-sm:h-[55px] mobile-mobile-lg:h-[65px] w-[140px] mobile-sm:w-[180px] mobile-mobile-lg:w-[222px] flex border border-black text-black items-center justify-around rounded-[60px] px-3 mobile-sm:px-4">
                READ MORE
                <span>
                  <img src={black_arrow} alt="arrow" />
                </span>
              </button>
            </div>
          </div>
          <div className="right mobile-lg:px-0 mobile-sm:px-6">
            <img src={image} alt="image" />
          </div>
        </div>
      </section>
      {/* <section
        className="mobile-lg:h-[876px] mobile-sm:px-5 flex items-center justify-around flex-wrap mobile-sm:h-auto mobile-sm:w-auto mobile-sm:bg-cover mobile-sm:bg-center"
        style={{ backgroundImage: `url(${service_bg})` }}
      >
        <div className="main mobile-lg:w-auto mobile-lg:h-full  flex  justify-start mobile-sm:flex-wrap mobile-lg:flex-nowrap mobile-sm:px-4 mobile-sm:py-16">
          <div className="left flex items-center  justify-center mobile-lg:gap-2 mobile-lg:w-[767px] mobile-lg:h-full ">
            <div className="flex  mobile-lg:h-full mobile-lg:py-[135px] ">
              <hr className=" mobile-lg:w-[100px] border-1 mobile-lg:visible" />
            </div>

            <div className=" mobile-lg:w-[700px]  mobile-sm:w-auto mobile-sm:py">
              <h3 className="text-[16px] font-extrathin leading-[19px] tracking-[2px] text-white uppercase">
                Our Mission
              </h3>
              <h2 className="mt-4 mobile-sm:text-[30px] mobile-lg:text-[58px] font-semibold mobile-lg:leading-[68px] text-white">
                Comprehensive
                <br />
                IT <span className="text-[#]">Solutions</span>
              </h2>
              <p className="mt-6 text-[#ffffff] mobile-lg:pt-[38px] mobile-lg:text-[20px] mobile-sm:leading-[30px] mobile-lg:leading-[36px]">
                We specialize in IT management, software development, and event
                management to elevate your business. Let us help you create a
                digital presence that stands out, engages users, and grows your
                business.
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
        <div className="left h-full flex items-center justify-center ">
          <div className="card flex flex-col lg:gap-[100px] p-8 items-start justify-center max-w-4xl">
            {iconSection.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-6 items-center sm:items-start w-full"
              >
                <img
                  src={item.icon}
                  alt={`${item.title} icon`}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                />
                <div className="content flex flex-col justify-center">
                  <h1 className="text-[#f17a1f] text-xl sm:text-2xl font-semibold">
                    {item.title}
                  </h1>
                  <p className="text-white text-sm sm:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      <section
        className="mobile-lg:h-[876px] mobile-sm:px-5 flex items-center justify-around flex-wrap mobile-sm:h-auto mobile-sm:w-auto mobile-sm:bg-cover mobile-sm:bg-center"
        style={{ backgroundImage: `url(${service_bg})` }}
      >
        <div className="main mobile-lg:w-auto mobile-lg:h-full flex justify-start mobile-sm:flex-wrap mobile-lg:flex-nowrap mobile-sm:px-4 mobile-sm:py-16">
          {/* Left Section */}
          <div className="left flex items-center justify-center mobile-lg:gap-2 mobile-lg:w-[767px] mobile-lg:h-full">
            <div className="flex mobile-lg:h-full mobile-lg:py-[135px]">
              <hr className="mobile-lg:w-[100px] border-1 mobile-lg:visible" />
            </div>

            <div className="mobile-lg:w-[700px] mobile-sm:w-auto">
              <h3 className="text-[16px] font-extrathin leading-[19px] tracking-[2px] text-white uppercase">
                Our Mission
              </h3>
              <h2 className="mt-4 mobile-sm:text-[30px] mobile-lg:text-[58px] font-semibold mobile-lg:leading-[68px] text-white">
                Comprehensive
                <br />
                IT <span className="text-[#f17b20]">Solutions</span>
              </h2>
              <p className="mt-6 text-[#ffffff] mobile-lg:pt-[38px] mobile-lg:text-[20px] mobile-sm:leading-[30px] mobile-lg:leading-[36px]">
                We specialize in IT management, software development, and event
                management to elevate your business. Let us help you create a
                digital presence that stands out, engages users, and grows your
                business.
              </p>
              <button className="mt-4 uppercase text-[14px] tracking-[1px] font-bold mobile-sm:mt-6 mobile-lg:mt-[55px] h-[45px] mobile-sm:h-[55px] mobile-lg:h-[65px] w-[140px] mobile-sm:w-[180px] mobile-lg:w-[222px] flex border border-black bg-[#f17b20] text-black items-center justify-around rounded-[60px] px-3 mobile-sm:px-4">
                Get Started
                <span>
                  <img src={arrow2} alt="arrow" />
                </span>
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="right h-full flex items-center justify-center">
            <div className="card  flex flex-col mobile-lg:gap-[100px] mobile-sm:gap-6 mobile-lg:p-8 mobile-sm:py-10 items-start justify-center max-w-4xl">
              {iconSection.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col  mobile-sm:flex-row gap-6 items-center mobile-sm:items-start w-full"
                >
                  <img
                    src={item.icon}
                    alt={`${item.title} icon`}
                    className="w-16 h-16 mobile-sm:w-20 mobile-sm:h-20 object-contain"
                  />
                  <div className="content flex flex-col  justify-center">
                    <h1 className="text-[#f17a1f] text-xl mobile-sm:text-2xl font-semibold">
                      {item.title}
                    </h1>
                    <p className="text-white text-sm mobile-sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-wrap justify-between items-center border-black px-4 mobile-lg:px-16 py-12 bg-white">
        {/* Left Column */}
        <div className="w-full  mobile-lg:w-[40%] mobile-lg:h-auto flex mobile-lg:flex-row mobile-sm:flex-col gap-8">
           {projects.map((project) => (
             <div
              key={project.id}
             className="relative w-full  bg-cover bg-center h-80 mobile-lg:h-96 rounded-lg shadow-lg"
              style={{ backgroundImage: `url(${project.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 rounded-lg">
               <img
                 src={project.icon}
                  alt={`${project.title} Icon`}
                  className="w-10 h-10 mobile-lg:w-12 mobile-lg:h-12 mb-4"
                />
                <h3 className="text-white text-xl mobile-lg:text-2xl font-semibold">
                  {project.title}
                </h3>
                 <p className="text-white mt-2 text-sm mobile-lg:text-base">
                  {project.description}
                </p>
                <button className="mt-4 py-2 px-4 bg-[#f17b20] text-black rounded-full text-sm font-medium">
                   Read More
               </button>
               </div>
            </div>
           ))}
         </div>

         {/* Right Column */}
        <div className="w-full mobile-lg:w-1/2 mt-12 mobile-lg:mt-0 flex flex-col">
          <h3 className="text-[#f17b20] text-sm font-bold uppercase tracking-wide">
            Our Projects
          </h3>
          <h2 className="text-2xl mobile-lg:text-4xl font-bold mt-4 leading-tight">
            Explore our innovative IT solutions and{" "}
             <span className="text-[#f17b20]">services.</span>
          </h2>
           <p className="mt-6 text-gray-600 text-sm mobile-lg:text-base">
             At Vais Engineering Pvt Ltd, our projects showcase the perfect blend
             of creativity, innovation, and technical expertise. We take pride in
             collaborating with clients across diverse industries to deliver
             solutions that are not only visually appealing but also functional
             and impactful.
          </p>
           <ul className="mt-8 space-y-4">
             {features.map((feature, index) => (
              <li
                 key={index}
                className="flex items-start gap-2 text-gray-800 text-sm mobile-lg:text-lg"
               >
                 <img src={tick} alt="tick"  />
                {feature}
              </li>
            ))}
           </ul>
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

export default AboutUs;

 <section className="flex flex-wrap justify-between items-center border-black px-4 mobile-lg:px-16 py-12 bg-white">
        {/* Left Column */}
        <div className="w-full  mobile-lg:w-[40%] mobile-lg:h-auto flex mobile-lg:flex-row mobile-sm:flex-col gap-8">
           {projects.map((project) => (
             <div
              key={project.id}
             className="relative w-full  bg-cover bg-center h-80 mobile-lg:h-96 rounded-lg shadow-lg"
              style={{ backgroundImage: `url(${project.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 rounded-lg">
               <img
                 src={project.icon}
                  alt={`${project.title} Icon`}
                  className="w-10 h-10 mobile-lg:w-12 mobile-lg:h-12 mb-4"
                />
                <h3 className="text-white text-xl mobile-lg:text-2xl font-semibold">
                  {project.title}
                </h3>
                 <p className="text-white mt-2 text-sm mobile-lg:text-base">
                  {project.description}
                </p>
                <button className="mt-4 py-2 px-4 bg-[#f17b20] text-black rounded-full text-sm font-medium">
                   Read More
               </button>
               </div>
            </div>
           ))}
         </div>

         {/* Right Column */}
        <div className="w-full mobile-lg:w-1/2 mt-12 mobile-lg:mt-0 flex flex-col">
          <h3 className="text-[#f17b20] text-sm font-bold uppercase tracking-wide">
            Our Projects
          </h3>
          <h2 className="text-2xl mobile-lg:text-4xl font-bold mt-4 leading-tight">
            Explore our innovative IT solutions and{" "}
             <span className="text-[#f17b20]">services.</span>
          </h2>
           <p className="mt-6 text-gray-600 text-sm mobile-lg:text-base">
             At Vais Engineering Pvt Ltd, our projects showcase the perfect blend
             of creativity, innovation, and technical expertise. We take pride in
             collaborating with clients across diverse industries to deliver
             solutions that are not only visually appealing but also functional
             and impactful.
          </p>
           <ul className="mt-8 space-y-4">
             {features.map((feature, index) => (
              <li
                 key={index}
                className="flex items-start gap-2 text-gray-800 text-sm mobile-lg:text-lg"
               >
                 <span className="text-[#f17b20]">✔</span>
                {feature}
              </li>
            ))}
           </ul>
         </div>
       </section> 
