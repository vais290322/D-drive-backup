import { motion } from "framer-motion";
import { GoArrowUpRight } from "react-icons/go";
import { BannerImg1, BannerImg2 } from "../assets";
import useTypingEffect from "../utils/useTypingEffect";

const text = "Precision";

function Home() {
  const visibleText = useTypingEffect(text, 500);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(null, "", "/");
  };

  return (
    <section
      id="home"
      className="min-h-screen w-full flex flex-col md:flex-row relative mt-[80px]"
    >
      <div className="md:w-[60%] w-full bg-[#fff7ed] flex flex-col justify-center items-center p-4 sm:p-6 md:p-4 ">
        <h1 className="text-center font-poppins md:pr-24 px-2 sm:px-4">
          <span className="text-[32px] sm:text-[36px] md:text-[40px] lg:text-[58px] font-extralight">
            Bringing{" "}
          </span>
          <span className="text-[32px] sm:text-[36px] md:text-[40px] lg:text-[58px]">
            Ideas to Life{" "}
          </span>
          <span className="text-[36px] sm:text-[42px] md:text-[50px] lg:text-[80px]">
            With{" "}
          </span>
          <span className="text-[36px] sm:text-[42px] md:text-[50px] lg:text-[80px] font-semibold text-[#f73801]">
            {visibleText}
          </span>
        </h1>
        <p className="text-[#454545] font-semibold mt-4 px-4 sm:px-8 md:pl-16 md:pr-52 text-sm sm:text-base text-center md:text-left">
          Crafting Memorable Moments: From Corporate Events to Weddings & Beyond
          embodies the essence of bringing dreams to life with meticulous
          planning.
        </p>
      </div>

      <div
        className="md:w-[45%] w-full h-[300px] sm:h-[400px] md:h-auto bg-cover bg-center relative"
        style={{ backgroundImage: `url(${BannerImg2})` }}
      >
        <motion.img
          src={BannerImg1}
          alt="Center Image"
          className="hidden md:block absolute left-0 top-[51%] transform -translate-x-1/2 -translate-y-[54%] h-[250px] sm:h-[300px] md:h-[480px] object-cover mt-[100px] sm:mt-[120px] md:mt-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </div>

      {/* <button
        onClick={() => {
          const link = document.createElement("a");
          link.href = "/Motor expo ppt.pptx"; // File path in public folder
          link.download = "Motor expo ppt.pptx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        className="fixed bottom-32 right-4 text-white opacity-70 bg-[#f73801] 
    p-2 text-[8px]
    sm:p-3 sm:text-sm
    md:py-4 md:px-6 md:text-base
    rounded-full shadow-lg hover:opacity-100 transition z-50"
      >
        Download Brochure
      </button> */}
    </section>
  );
}

export default Home;
