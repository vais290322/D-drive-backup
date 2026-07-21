import React from "react";
import Footer from "../Footer/Footer";
import CareerHeader from "../Header/CareerHeader";
import Career_Why from "../../assets/Career_why.png";
import Career_form from "../../assets/Carrer_form.png";
const Career = () => {
  return (
    <div className=" flex flex-col w-full overflow-hidden ">
      <CareerHeader />
      <div className="flex flex-col mobile-sm:py-12 border-4">
      <div className="section h-auto lg:h-[1675px] flex items-center justify-center bg-[#fefeff]">
        <div className="m flex flex-col lg:flex-row h-auto lg:h-[1362px] w-full lg:w-[1720px] items-center justify-center gap-6 lg:gap-[112px] bg-[#fafafa] rounded-3xl shadow-2xl px-6 lg:px-0">
          <div
            className="lef h-[400px] lg:h-full w-full lg:w-[702px] bg-center bg-cover rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none bg-no-repeat flex flex-col items-center justify-around"
            style={{ backgroundImage: `url(${Career_form})` }}
          >
            <div className="te1 h-[200px] lg:h-[400px] flex flex-col justify-between text-[20px] lg:text-[40px] text-[#ffffff] font-medium leading-[30px] lg:leading-[60px] px-4 lg:px-0">
              <h2>
                Encourages creativity, <br className="hidden lg:block" />
                problem-solving, and <br className="hidden lg:block" />
                collaboration, enabling <br className="hidden lg:block" />
                passionate engineers & <br className="hidden lg:block" />
                technologists to bring <br className="hidden lg:block" />
                their ideas to life.
              </h2>
              <hr className="w-[80px] lg:w-[162px] border-2" />
            </div>
            <div className="te2 px-4 lg:px-0">
              <p className="text-[16px] lg:text-[26px] font-normal leading-[24px] lg:leading-[30px] text-[#ffffff]">
                Apply now on our website and be part{" "}
                <br className="hidden lg:block" />
                of our journey to shape the future of{" "}
                <br className="hidden lg:block" />
                engineering
              </p>
            </div>
          </div>

          <div className="rig flex flex-col items-start justify-center h-auto lg:h-full w-full lg:w-[1018px] px-4 lg:px-0">
            <div className="rm flex flex-col items-start justify-center space-y-6 lg:space-y-12">
              <h2 className="text-black tracking-widest flex items-center uppercase font-normal text-base sm:text-lg lg:text-xl">
                Join our team
              </h2>
              <h1 className="text-2xl sm:text-3xl lg:text-[58px] font-semibold text-black leading-tight">
                Employment
                <span className="text-[#f17a1f]"> Application</span>
              </h1>
              <p className="text-black text-base lg:text-[18px] leading-6 lg:leading-[36px]">
                Join the team at VAIS Engineering and turn your passion for
                technology
                <br className="hidden lg:block" />
                into groundbreaking innovation. Explore exciting career
                opportunities
                <br className="hidden lg:block" />
                where creativity, collaboration, and cutting-edge solutions
                drive success.
                <br className="hidden lg:block" />
                Apply now on our website and be part of our journey to shape the
                future
                <br className="hidden lg:block" />
                of engineering!
              </p>

              <div className="max-w-full lg:max-w-4xl mx-auto mt-10 lg:mt-[100px] w-full">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[16px] lg:text-[18px] font-medium text-[#000000]">
                        First Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="mt-1 block h-[50px] lg:h-[60px] w-full bg-[#fafafa] sm:text-sm"
                      />
                      <hr className="w-full text-[#cccccc]" />
                    </div>
                    <div>
                      <label className="block text-[16px] lg:text-[18px] font-medium text-[#000000]">
                        Last Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="mt-1 block h-[50px] lg:h-[60px] w-full bg-[#fafafa] sm:text-sm"
                      />
                      <hr className="w-full text-[#cccccc]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[16px] lg:text-[18px] font-medium text-[#000000]">
                        Phone Number<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        className="mt-1 block h-[50px] lg:h-[60px] w-full bg-[#fafafa] sm:text-sm"
                      />
                      <hr className="w-full text-[#cccccc]" />
                    </div>
                    <div>
                      <label className="block text-[16px] lg:text-[18px] font-medium text-[#000000]">
                        Email Address<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        className="mt-1 block h-[50px] lg:h-[60px] w-full bg-[#fafafa] sm:text-sm"
                      />
                      <hr className="w-full text-[#cccccc]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[16px] lg:text-[18px] font-medium text-[#000000]">
                        Location<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="mt-1 block h-[50px] lg:h-[60px] w-full bg-[#fafafa] sm:text-sm"
                      />
                      <hr className="w-full text-[#cccccc]" />
                    </div>
                    <div>
                      <label className="block text-[16px] lg:text-[18px] font-medium text-[#000000]">
                        Zipcode<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="mt-1 block h-[50px] lg:h-[60px] w-full bg-[#fafafa] sm:text-sm"
                      />
                      <hr className="w-full text-[#cccccc]" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[16px] lg:text-[18px] font-medium text-[#000000]">
                      Choose Desired Position
                      <span className="text-red-500">*</span>
                    </label>
                    <select className="mt-1 block w-full h-[50px] lg:h-[58px] bg-[#fafafa] sm:text-sm">
                      <option></option>
                      <option>Developer</option>
                      <option>Designer</option>
                      <option>Manager</option>
                    </select>
                    <hr className="w-full text-[#cccccc]" />
                  </div>

                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                    <label className="block text-[16px] lg:text-[18px] font-medium text-[#000000]">
                      Add Your CV<span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 lg:mt-0">
                      <label
                        htmlFor="cv-upload"
                        className="inline-flex h-10 rounded-3xl items-center px-4 py-2 border border-orange-500 text-black font-medium cursor-pointer hover:bg-orange-500 hover:text-white transition"
                      >
                        Browse
                      </label>
                      <input id="cv-upload" type="file" className="hidden" />
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="mt-4 w-full lg:w-auto px-6 py-3 bg-black text-white rounded-[50px] hover:bg-gray-800 transition"
                    >
                      Send Your Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="section h-screen sm:h-[858px] bg-cover bg-center"
        style={{ backgroundImage: `url(${Career_Why})` }}
      >
        <div className="flex-1 w-full mx-auto max-w-7xl h-full px-6 sm:px-10 lg:px-0 flex items-center">
          <div className="flex flex-col w-full">
            <h2 className="text-white tracking-widest gap-2 flex items-center uppercase font-normal text-lg sm:text-xl lg:text-[16px] mb-3 sm:mb-4 lg:mb-[45px]">
              <hr className="w-[78px]" />
              Why Choose Us
            </h2>
            <div className="sm:ml-[40px] lg:ml-[82px]">
              <h1 className="text-2xl sm:text-4xl lg:text-[58px] font-semibold text-white leading-snug sm:leading-tight lg:leading-tight">
                Innovative IT
                <br className="hidden lg:block" />
                <span className="text-[#f17a1f]"> Solutions for You</span>
              </h1>
              <p className="text-white text-base sm:text-lg lg:text-[20px] leading-[28px] sm:leading-[36px] font-light pt-6 sm:pt-10 lg:pt-[58px]">
                At Vais Engineering Pvt Ltd, we specialize in crafting digital
                <br className="hidden lg:block" />
                experiences that go beyond aesthetics. Our mission is to
                <br className="hidden lg:block" />
                transform visions into vibrant, functional, and user-centric
                <br className="hidden lg:block" />
                websites that captivate audiences and drive meaningful
                <br className="hidden lg:block" />
                results.
                <br className="hidden lg:block" />
                With a team of passionate designers, developers, and
                <br className="hidden lg:block" />
                strategists, we bring together creativity and technical
                <br className="hidden lg:block" />
                expertise to deliver tailored solutions that align with your
                <br className="hidden lg:block" />
                business goals.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Career;
