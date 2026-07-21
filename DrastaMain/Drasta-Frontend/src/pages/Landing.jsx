import {
  backgroundImage1,
  backgroundImage2,
  backgroundImage3,
  backgroundImage4,
  backgroundImage5,
  drastaLogo,
  landingImage1,
  landingImage2,
  landingImage3,
  landingImage4,
  landingImage5,
  tomPaper1,
  tomPaper2,
  tomPaper3,
  tomPaper4
} from "@/assets";

import { DonateSection, Footer } from "@/V2/components";
import { HomeAboutSection, HomeBlogSection, HomeNoticeSection } from "@/V2/components/home";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { Link } from "react-router-dom";

// Animation config
const ANIM_DURATION = 1000;
const ANIM_EASING = (t) => 0.5 - Math.cos(t * Math.PI) / 2;

// AutoPlay plugin
function AutoPlay(interval = 3000, backwards = false) {
  return (slider) => {
    let timeout;
    const clear = () => window.clearTimeout(timeout);
    const next = () => {
      clear();
      timeout = window.setTimeout(() => {
        backwards
          ? slider.prev({ duration: ANIM_DURATION, easing: ANIM_EASING })
          : slider.next({ duration: ANIM_DURATION, easing: ANIM_EASING });
      }, interval);
    };
    slider.on("created", next);
    slider.on("animationEnded", next);
    slider.on("dragStarted", clear);
  };
}

export function Landing() {
  const backgroundImages = [
    backgroundImage1,
    backgroundImage2,
    backgroundImage3,
    backgroundImage4,
    backgroundImage5,
  ];
  const landingImages = [
    landingImage1,
    landingImage2,
    landingImage3,
    landingImage4,
    landingImage5,
  ];

  const commonOpts = {
    loop: true,
    slides: { perView: 1 },
    animation: {
      duration: ANIM_DURATION,
      easing: ANIM_EASING,
    },
  };

  const [leftRef] = useKeenSlider(commonOpts, [AutoPlay(5000, true)]);
  const [rightRef] = useKeenSlider(commonOpts, [AutoPlay(5000, false)]);
  const [mobileTopRef] = useKeenSlider(commonOpts, [AutoPlay(4000, true)]);
  const [mobileBottomRef] = useKeenSlider(commonOpts, [AutoPlay(4000, false)]);

  return (
    <div>
      {/* === Desktop View === */}
      <section className="hidden sm:block h-screen relative overflow-hidden">
        {/* Left carousel */}
        <div
          ref={leftRef}
          className="keen-slider absolute top-0 left-0 w-full h-full z-10"
          style={{
            clipPath: "polygon(0 0, 74% 0, 27% 100%, 0 100%)",
          }}
        >
          {backgroundImages.map((img, idx) => (
            <div
              key={idx}
              className="keen-slider__slide w-full h-full bg-cover bg-left relative"
              style={{ backgroundImage: `url(${img})` }}
            >
              <Link
                to="/v1/home"
                className="absolute bottom-6 left-8 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/90 backdrop-blur rounded-full z-50 text-black font-semibold text-sm sm:text-base md:text-lg shadow-md transition-all duration-200 hover:opacity-90 hover:scale-105 hover:shadow-lg"
              >
                Explore Now
              </Link>
            </div>
          ))}
        </div>

        {/* Right carousel */}
        <div
          ref={rightRef}
          className="keen-slider absolute -top-full w-full h-full z-8"
          style={{
            clipPath: "polygon(100% 0%, 100% 100%, 27% 100%, 72.25% 0%)",
          }}
        >
          {landingImages.map((img, idx) => (
            <div
              key={idx}
              className="keen-slider__slide w-full h-full bg-cover bg-right relative"
              style={{ backgroundImage: `url(${img})` }}
            >
              <Link
                to="/home"
                className="absolute bottom-6 right-8 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/90 backdrop-blur rounded-full z-50 text-black font-semibold text-sm sm:text-base md:text-lg shadow-md transition-all duration-200 hover:opacity-90 hover:scale-105 hover:shadow-lg"
              >
                Check Out Now
              </Link>
            </div>
          ))}
        </div>

        {/* Logo */}
        <div className="absolute top-0 right-0 z-40 pointer-events-none">
          <img src={drastaLogo} alt="Logo" className="h-[300px]" />
        </div>
      </section>

      {/* === Mobile View === */}
      <section className="block sm:hidden h-screen w-full relative overflow-hidden">
        {/* Top carousel */}
        <div ref={mobileTopRef} className="keen-slider h-1/2 w-full">
          {backgroundImages.map((img, idx) => (
            <div
              key={idx}
              className="keen-slider__slide h-full w-full bg-cover bg-left relative"
              style={{ backgroundImage: `url(${img})` }}
            >
              <Link
                to="/v1/home"
                className="absolute bottom-5 left-6 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/90 backdrop-blur rounded-full z-50 text-black font-semibold text-sm sm:text-base md:text-lg shadow-md transition-all duration-200 hover:opacity-90 hover:scale-105 hover:shadow-lg"
              >
                Explore Now
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom carousel */}
        <div ref={mobileBottomRef} className="keen-slider h-1/2 w-full">
          {landingImages.map((img, idx) => (
            <div
              key={idx}
              className="keen-slider__slide h-full w-full bg-cover bg-right relative"
              style={{ backgroundImage: `url(${img})` }}
            >
              <Link
                to="/home"
                className="absolute bottom-5 right-6 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/90 backdrop-blur rounded-full z-50 text-black font-semibold text-sm sm:text-base md:text-lg shadow-md transition-all duration-200 hover:opacity-90 hover:scale-105 hover:shadow-lg"
              >
                Check Out Now
              </Link>
            </div>
          ))}
        </div>

        {/* Logo */}
        <div className="absolute top-0 right-0 z-30 pointer-events-none">
          <img src={drastaLogo} alt="Logo" className="h-20" />
        </div>
      </section>

      {/* === Torn Paper Transition === */}
      <div className="relative ">
        {/* <img
          src={tomPaper1}
          alt="Torn paper top"
          className="absolute inset-0 w-full h-full object-fit top-0 left-0 z-0"
          /> */}
          <img
            src={tomPaper3}
            alt="Torn paper top"
            className="absolute w-full h-[15%] object-fit z-10 top-0 left-0"
          />
        <div className="relative z-16 py-16">
          <HomeBlogSection />
        </div>

        <img
          src={tomPaper4}
          alt="Torn paper top"
          className="absolute w-full h-[15%] object-fit z-10 bottom-0 left-0"
        />
      </div>

      <HomeNoticeSection/>

      {/* === About Section === */}
      <div className="bg-[#3F331F] text-white">
        <HomeAboutSection />
      </div>

      {/* === Donate Section with torn paper === */}
      <div className="relative w-full overflow-hidden">
        <img
          src={tomPaper2}
          alt="Torn paper bottom"
          className="absolute w-full h-[10%] object-fit top-0 left-0 z-10"
        />
        <div className="relative pt-8">
          <DonateSection landingPage={true} />
        </div>
      </div>

      {/* === Footer === */}
      {/* <div className="relative pt-4 bg-gradient-to-roverflow-hidden">
        <img
          src={tomPaper1}
          alt="Torn paper top"
          className="absolute inset-0 w-full h-full object-fit z-0"
        />
        <div className="relative z-10">
        </div>
      </div> */}
      <Footer landingPage={true} />
    </div>
  );
}
