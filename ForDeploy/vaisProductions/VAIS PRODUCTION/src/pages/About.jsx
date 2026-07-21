import {
  AboutImg1,
  AboutImg2,
  PuzzleImg,
  ReviewImg,
  RocketImg,
  ServiceImg,
  TimeImg,
} from "../assets";

function About() {
  const stats = [
    {
      number: "+500",
      text: "We have successfully completed 500+ project",
      image: RocketImg,
    },
    {
      number: "+100",
      text: "We have gathered 100+ reviews from clients",
      image: ReviewImg,
    },
    { number: "+10", text: "Years of experience", image: TimeImg },
    {
      number: "+20",
      text: "Team members all over the world",
      image: PuzzleImg,
    },
  ];

  return (
    <section id="about" className="md:mt-[100px] px-2 sm:px-4 md:px-0">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-center w-full md:gap-10 gap-2">
        {/* Left Content */}
        <div className="w-full md:w-1/2 md:ml-32 flex flex-col">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-24 bg-[#f73801]"></div>
            <h1 className="text-[16px] font-semibold">About Us</h1>
          </div>

          <p className="text-[24px] md:text-4xl xl:text-5xl text-[#393939] leading-snug mt-5">
            <span className="font-extralight">Bringing </span>
            <span className="text-[#f73801]">Ideas </span>
            <span className="font-medium">to Life</span>
          </p>

          <p className="mt-4 text-sm md:text-base text-[#444]">
            Welcome to Vais Productions, one of the best event management
            companies in Eastern Indian, Offering exceptional event planning services
            tailored to your needs. From corporate event management to wedding
            planning in Eastern Indian, we are dedicated to making every event a
            memorable experience.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-2 md:p-8 max-w-3xl">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-4 md:p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-4 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {stat.number}
                  </h2>
                  <p className="text-[#555555] mt-2 text-xs md:text-base break-words">
                    {stat.text}
                  </p>
                </div>
                <div className="flex-shrink-0 self-end">
                  <img
                    src={stat.image}
                    alt="icon"
                    className="h-10 md:h-20 w-auto max-w-[60px] md:max-w-[80px] object-contain transition-transform duration-300 hover:rotate-3"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Images */}
        <div className="w-full md:w-1/2 md:mr-32 flex flex-col items-end mt-4 md:mt-0">
          <button
            onClick={() => {}}
            className="border border-black py-2 px-6 md:py-3 md:px-8 rounded-3xl transition duration-300 hover:bg-black hover:text-white text-[16px] md:text-[18px] font-medium text-[#393939]"
          >
            Explore More
          </button>

          <img
            src={AboutImg1}
            alt="image"
            className="h-[140px] md:h-[220px] w-full max-w-[320px] md:max-w-[420px] mt-4 hover:scale-105 transition-transform duration-300"
          />
          <img
            src={AboutImg2}
            alt="image"
            className="h-[150px] md:h-[288px] w-full max-w-[340px] md:max-w-[541px] mt-2 md:mt-4 hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Services Section */}
      <div className="flex flex-col md:flex-row mt-10 md:mt-20 gap-4 md:gap-10">
        <div className="w-full md:w-1/2 flex items-center justify-center px-2 md:px-4">
          <img
            src={ServiceImg}
            alt="image"
            className="h-auto max-h-[220px] md:max-h-[420px] w-full md:w-[510px] object-contain hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="w-full md:w-1/2 bg-black mb-6 md:mb-20 p-4 md:p-10">
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-24 bg-[#f73801]"></div>
            <h1 className="text-[16px] text-[#fff7ed]">Services</h1>
          </div>

          <h1 className="text-[26px] md:text-[54px] text-[#fff7ed] mt-4 leading-tight">
            <span className="font-extralight">Creative </span>
            Production Services
          </h1>

          <p className="text-xs md:text-base text-[#fff7ed] mt-4 md:mt-6 leading-relaxed">
            Vais Productions is a full-service creative agency specializing in
            film production, event management, wedding planning. From concept
            development and filming to post-production, we craft high-quality
            content for films, ads, and music videos.
          </p>

          <button className="mt-4 md:mt-6 border border-white text-[#f2f0f0] py-2 px-6 rounded-full relative overflow-hidden group transition-all duration-300 hover:bg-white hover:text-black">
            Explore More
          </button>
        </div>
      </div>
    </section>
  );
}

export default About;
