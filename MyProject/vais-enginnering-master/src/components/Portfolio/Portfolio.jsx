import React from "react";
import PortfolioHeader from "../Header/PortfolioHeader";
import Footer from "../Footer/Footer";
import img from "../../assets/img.png";
import testimonials from "../../assets/testimonials.png";
import quote from "../../assets/quote.png";
import arrow from "../../assets/arrow.png";
import arrow2 from "../../assets/arrow2.png";
import blog_1 from "../../assets/Blog_1.png";
import blog_2 from "../../assets/Blog_2.png";
import blog_3 from "../../assets/Blog_3.png";
import portfolio_1 from "../../assets/Portfolio/portfolio_1.png";
import portfolio_2 from "../../assets/Portfolio/portfolio_2.png";
import portfolio_3 from "../../assets/Portfolio/portfolio_3.png";
import portfolio_4 from "../../assets/Portfolio/portfolio_4.png";
import projects_bg from "../../assets/Portfolio/projects_bg.png"
import project_1 from "../../assets/Portfolio/project_1.png";
import project_2 from "../../assets/Portfolio/project_2.png";
import project_3 from "../../assets/Portfolio/project_3.png";
import project_4 from "../../assets/Portfolio/project_4.png";


const Portfolio = () => {

    const portfolioItems = [
        {
          title: 'ATM Support',
          subtitle: 'vais.co.in',
          description: 'Providing reliable ATM SLM support and cutting-edge software solutions to ensure seamless operations and enhanced customer experiences',
          image: portfolio_1,
          link: 'https://vais.co.in',
          domain: 'vais.co.in'
        },
        {
          title: 'Interior Design Services',
          subtitle: 'glowdeccor.com',
          description: 'Transform your space with our expert interior design and decoration services tailored to your needs.',
          image: portfolio_2,
          link: 'https://glowdeccor.com',
          domain: 'glowdeccor.com'
        },
        {
          title: 'Web & App Development',
          subtitle: 'webbixel.com',
          description: 'Designing and developing user-friendly, responsive websites that help businesses establish a strong online presence',
          image: portfolio_3,
          link: 'https://webbixel.com',
          domain: 'webbixel.com'
        },
        {
          title: 'Event Management',
          subtitle: 'vaisproductions.com',
          description: 'Providing expert planning and execution of unforgettable events, paired with stunning decorations that bring every vision to life',
          image: portfolio_4,
          link: 'https://vaisproductions.com',
          domain: 'vaisproductions.com'
        }
      ];

      const projects = [
        {
          title: 'Streamlining Customer Acquisition',
          subtitle: 'Intelligent Lead Management',
          image: project_1,
          description: 'Optimize your sales funnel with a CRM solution designed to track, nurture, and convert leads effectively, boosting productivity and revenue growth',
          link: arrow
        },
        {
          title: 'Data-Driven Decision Making',
          subtitle: 'Unified Customer Insights',
          image: project_4,
          description: 'Empower your business with a centralized CRM system that consolidates customer data, offering actionable insights to enhance engagement and loyalty',
          link: arrow
        },
        {
          title: 'Efficiency Redefined',
          subtitle: 'Seamless Workflow Automation',
          image: project_3,
          description: 'Transform your operations with automated workflows that simplify tasks, improve collaboration, & save time for what matters most—your customers',
          link: arrow
        },
        {
          title: 'Growing with Your Business',
          subtitle: 'Scalable CRM Solutions',
          image: project_2,
          description: 'Implement a flexible and scalable CRM platform designed to evolve with your business needs, ensuring long-term success and adaptability',
          link: arrow
        }
      ];
  return (
    <>
      <PortfolioHeader />
      <section className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-lg font-medium text-gray-600 mb-2">OUR PORTFOLIO</h2>
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold">
              Driving Digital{' '}
              <span className="text-orange-500">Transformation</span>
            </h1>
            <p className="md:max-w-xl text-gray-600">
              Expertise in IT engineering, creative design, & comprehensive digital marketing services tailored to accelerate business growth.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors">
            READ MORE
            <img src={arrow} alt="arrow" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {portfolioItems.map((item, index) => (
            <div key={index} className="group">
              <div className="relative overflow-hidden rounded-3xl mb-6">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <span className="text-orange-500">({item.domain})</span>
                </div>
                <p className="text-gray-600">{item.description}</p>
                <a
                  href={item.link}
                  className="inline-flex items-center gap-2 text-black hover:text-orange-500 transition-colors"
                >
                  READ MORE
                  <img src={arrow} alt="arrow" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="min-h-screen  text-white py-12"
    style={{ backgroundImage: `url(${projects_bg})` }}
    >
      {/* Header Section */}
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-sm uppercase tracking-wider text-gray-400 mb-4">OUR PROJECTS</p>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-16">
          Showcasing our Expertise in<br />
          IT, Design, & <span className="text-orange-500">Event Management</span>
        </h1>
      </div>

      {/* Projects Flex Container */}
      <div className="container mx-auto px-4 ">
      <div className="flex flex-wrap -mx-6">
        {projects.map((project, index) => (
          <PortfolioItem
            key={index}
            title={project.title}
            subtitle={project.subtitle}
            image={project.image}
            description={project.description}
            link={project.link}
          />
        ))}
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
                <p className="text-[14px] mobile-sm:py-4 mobile-lg:py-0 mobile-sm:text-[12px] tracking-[2px] leading-[19px] uppercase">
                  Rajesh Mehra
                </p>
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
    </>
  );
};

export default Portfolio;



const PortfolioItem = ({ title, subtitle, image, description, link }) => {
    return (
      <div className="w-full md:w-1/2 px-6 mb-12">
        <div className="group  rounded-3xl p-8 h-full transition-transform duration-300 hover:-translate-y-1">
          <img
            src={image}
            alt={title}
            className="rounded-2xl mb-8 w-full aspect-[4/3] object-cover"
          />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium uppercase tracking-wider text-gray-400">{subtitle}</h3>
              <img src={link} alt="arrow" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    );
  };
  