import {
  Rectangle10,
  Rectangle23,
  Rectangle4,
  Rectangle7
} from "@/V2/assets";
import {
  HomeAboutSection,
  HomeAchievementsSection,
  HomeBlogSection,
  HomeGallerySection,
  HomeNoticeSection,
} from "@/V2/components/home";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { HeroSection } from "../components";

export const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <HeroSection
        img={Rectangle4}
        heading={
          <>
            Observe, Reason,
            <br />
            Empower
          </>
        }
        description={`Morem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit interdum, ac aliquet odio mattis. Class
              aptent taciti sociosqu ad litora torquent per conubia nostra, per
              inceptos himenaeos.`}
        buttons={
          <>
            <Link
              to="/activity"
              className="px-6 py-3 border border-[#F3C304] rounded-md text-[#F3C304] hover:bg-[#F3C304] hover:text-white transition-colors text-sm sm:text-base"
            >
              Read More
            </Link>
            <Link
              to="/volunteer"
              className="px-6 py-3 bg-[#F3C304] hover:bg-transparent text-white hover:text-[#F3C304] border border-[#F3C304] rounded-md transition-colors text-sm sm:text-base"
            >
              Get Involved
            </Link>
          </>
        }
      />

      {/* Notice Section */}
      <HomeNoticeSection />

      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-10 sm:py-12 bg-yellow-50 px-4 sm:px-6 lg:px-0"
      >
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col">
            <h3 className="font-bold text-2xl sm:text-3xl md:text-[40px] mb-4 pl-2">
              Our Mission
            </h3>

            <div className="w-full sm:w-[90%] md:w-[70%] self-end text-base sm:text-lg md:text-xl text-justify px-4">
              <p className="text-gray-700 leading-relaxed pr-2">
                Observe, Reason, Empower (ORE) are the primary focus of
                C-DRASTĀ. For socio-economic development research to be
                effective researchers must Observe based on empirical evidence,
                use Reason to explain how their observations explain reality,
                and Empower policy makers and study subjects by disseminating
                study results widely
              </p>
              <ul className="mt-4 space-y-2 text-gray-700 text-justify pr-2">
                <li>
                  • Undertaking research and training to provide intellectual
                  inputs and create capability for informed policy- making.
                </li>
                <li>
                  • Providing a platform for deliberation and dissemination of
                  research findings and exchange of ideas between government and
                  non-governmental actors.
                </li>
                <li>
                  • Using findings from rigorous evaluation to empower study
                  subjects with an understanding of how to achieve their
                  potential.
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row pl-0 sm:pl-8 gap-4 flex-wrap pr-0 sm:pr-4 justify-center">
            <img
              src={Rectangle7}
              alt="Community work"
              className="h-48 sm:h-60 md:h-[300px] object-cover rounded-lg"
            />
            <img
              src={Rectangle23}
              alt="Education programs"
              className="w-full sm:w-[350px] h-48 sm:h-[200px] object-cover rounded-lg md:w-[600px] md:h-auto"
            />
          </div>
        </div>
      </motion.section>

      {/* Research Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-blue-50 rounded-[20px] px-4 sm:px-6 md:px-10 py-12 sm:py-[120px] mx-auto max-w-6xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <img
            src={Rectangle10}
            alt="Research illustration"
            className="h-64 sm:h-[400px] md:h-[440px] object-cover rounded-lg"
          />

          <div className="text-base sm:text-lg md:text-xl">
            <h3 className="text-2xl sm:text-3xl md:text-[40px] font-bold mb-4">
              Research
            </h3>
            <div className="px-4 text-gray-700 leading-relaxed mb-4 sm:mb-6 space-y-2">
              <p>
                In order to understand how the society, economy and environment
                (SEE) intersect and interact, the underlying research themes at
                C-DRAŞŢĂ span variety of issues & development dilemmas from
                three domains and as well as about the overlap.
              </p>
              <p>
                Accordingly, social responsibility, economic viability and
                environmental sustainability, analyzed across expanding
              </p>
              <button className="mt-4 inline-flex items-center border border-black rounded px-4 py-2 hover:bg-black hover:text-white transition text-sm sm:text-base md:text-xl font-bold">
                Read More →
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      <HomeBlogSection />
      <HomeAchievementsSection />
      <HomeGallerySection />

      <HomeAboutSection/>
    </>
  );
};
