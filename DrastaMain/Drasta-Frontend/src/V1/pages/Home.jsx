import React, { useState, useRef, useEffect } from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import EnquiryModal from "../componants/EnquiryForm";
import legalBg from "../assets/v1-footerimage.jpg";
import legalBg3 from "../assets/3.png";
import legalBg2 from "../assets/2.png";
import legalBg1 from "../assets/3.png";
import empower from "../assets/empower.jpg";
import observe from "../assets/observe.jpg";
import reason from "../assets/reason.jpg";
import ste from "../assets/STE.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import researchtheme from "../assets/researchtheme.png";
import researchbg from "../assets/researchtheme1.jpg";
import heading from "../assets/heading.png";
import drasta1 from "../assets/drasta1.jpg";
import drasta2 from "../assets/drasta2.jpg";
import drasta3 from "../assets/drasta3.jpg";
import drasta4 from "../assets/drasta4.jpg";
import drasta5 from "../assets/drasta5.jpg";
import drasta6 from "../assets/drasta6.jpg";
import drasta7 from "../assets/drasta7.jpg";
import drasta8 from "../assets/drasta8.jpg";
import drasta9 from "../assets/drasta9.jpg";
import drasta10 from "../assets/drasta10.jpg";
import drasta11 from "../assets/drasta11.jpg";
import drasta12 from "../assets/drasta12.jpg";
import drasta13 from "../assets/drasta13.jpg";
import drasta14 from "../assets/drasta14.jpg";
import drasta15 from "../assets/drasta15.jpg";
import drasta16 from "../assets/drasta16.jpg";
import drasta17 from "../assets/drasta17.jpg";
import drasta18 from "../assets/drasta18.jpg";
import drasta19 from "../assets/drasta19.jpg";
import drasta20 from "../assets/drasta20.jpg";
import drasta21 from "../assets/drasta21.jpg";
import drasta22 from "../assets/drasta22.jpg";
import drasta23 from "../assets/drasta23.jpg";
import drasta24 from "../assets/drasta24.jpg";
import drasta25 from "../assets/drasta25.jpg";
import drasta26 from "../assets/drasta26.jpg";
import drasta27 from "../assets/drasta27.jpg";
import drasta28 from "../assets/drasta28.jpg";
import drasta29 from "../assets/drasta29.jpg";
import drasta30 from "../assets/drasta30.jpg";
import drasta31 from "../assets/drasta31.jpg";
import drasta32 from "../assets/drasta32.jpg";
import drasta33 from "../assets/drasta33.jpg";
import drasta34 from "../assets/drasta34.jpg";
import drasta35 from "../assets/drasta35.jpg";
import drasta36 from "../assets/drasta36.jpg";
import drasta37 from "../assets/drasta37.jpg";
import drasta38 from "../assets/drasta38.jpg";
import drasta39 from "../assets/drasta39.jpg";
import drasta40 from "../assets/drasta40.jpg";
import drasta41 from "../assets/drasta41.jpg";
import drasta42 from "../assets/drasta42.jpg";

import { MoveRight } from "lucide-react";
import { FaHandPointRight } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const API = import.meta.env.VITE_OLD_API_URL;

export const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [slider, setSlider] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);
  const [overView, setOverview] = useState("");
  const [mission, setMission] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);

  const fetchMission = async () => {
    try {
      const response = await fetch(`${API}/api/v1/mission-history`);
      if (!response.ok) {
        console.warn("Mission API returned", response.status);
        return;
      }
      const data = await response.json();
      setMission(data.missionHistory ?? null);
    } catch (error) {
      console.error("Error fetching mission:", error);
    }
  };

  const fetchOverview = async () => {
    try {
      const response = await fetch(`${API}/api/v1/overview`);
      const data = await response.json();
      setOverview(data?.entries[0]?.overview || "");
      // console.log("Fetched Overview:", data.entries[0].overview);
    } catch (error) {
      console.error("Error fetching overview:", error);
    }
  };

  const fetchSlider = async () => {
    try {
      const response = await fetch(`${API}/api/v1/sliders`);
      const data = await response.json();
      setSlider(data.slides || []);

      // console.log("Fetched Slider Items:", data.slides || []);
    } catch (error) {
      console.error("Error fetching slider items:", error);
    }
  };
  const fetchdata = async () => {
    try {
      const response = await fetch(`${API}/api/v1/news`);
      const data = await response.json();
      setNewsItems(data.news || []);
      // console.log("Fetched News Items:", data.news);
    } catch (error) {
      console.error("Error fetching news items:", error);
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await fetch(`${API}/api/v1/about-gallery`);
      if (!response.ok) {
        console.warn("Gallery API returned", response.status);
        return;
      }
      const data = await response.json();
      setGalleryItems(data?.gallery?.images || []);
      console.log("Fetched Gallery Items:", data?.gallery?.images);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    }
  };

  useEffect(() => {
    fetchGallery();
    fetchMission();
    fetchdata();
    fetchOverview();
    fetchSlider();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && scrollRef.current) {
        scrollRef.current.scrollTop += 1;
        if (
          scrollRef.current.scrollTop + scrollRef.current.clientHeight >=
          scrollRef.current.scrollHeight
        ) {
          scrollRef.current.scrollTop = 0;
        }
      }
    }, 0);

    return () => clearInterval(interval);
  }, [isPaused]);

  // const newsItem = [
  //   {
  //     id: 1,
  //     content: `Aligned with its goal of promoting awareness about Green Living and Livelihood,
  //     C-DRASTA conducts the ‘C-DRASTA GLL Drawing and Painting Meet and C-DRASTA GLL Photography Meet’
  //     on the theme ‘ECO-FRIENDLY WAYS OF LIVING THROUGH ADOPTION OF SUSTAINABLE HABITS IN ONE’S DAILY LIFE’
  //     during June – July 2023. Noted artist Nandini Dasgupta reviews the contributions...`,
  //     link: "/v1/gallery",
  //   },
  //   {
  //     id: 2,
  //     content: `C-DRAṢṬᾹ completes Impact Assessment Study of Nanritam's Education for All Programme (IAEFA) (2023)...`,
  //     link: "/v1/research-projects",
  //   },
  //   {
  //     id: 3,
  //     content: `Centre For Development Research, Sustainability and Technical Advancement (C-DRAṢṬᾹ) received
  //     the ‘STE Humanitarian Award for NGOs’ from Save the Environment (STE)...`,
  //     link: "/v1/career",
  //   },
  //   {
  //     id: 4,
  //     content: ` Dr. Rajlakshmi Mallik was  the key resource person for the 2nd day of the 5 day webinar on “UNDERSTANDING RESEARCH AND ITS ETHICS” organized by the Department of Geography and Department of Economics, R. B. C. Evening College. She delivered an extensive and elaborate lecture on the topic ‘Qualitative research Method’ followed by a highly interesting interactive session with the participants who mostly were young researchers and students. The entire one and a half hour session was highly enjoyed by everyone who has given positive feedback. C-DRAṢṬĀ is happy to share the link of  this webinar: `,
  //     link: "#",
  //   },
  //   {
  //     id: 5,
  //     content: `C-DRAṢṬᾹ is happy to announce the book launch  of ‘Intersections of Green Tourism and Organic Mission’  by the Hon’ble Governor of Sikkim, Sri. Ganga Prasad Chaurasia during Republic Day Celebrations 2019 with Foreword  by Hon’ble Chief Minister of Sikkim, Sri. Pawan Chamling.`,
  //     link: "#",
  //   },
  //   {
  //     id: 6,
  //     content: `C-DRAṢṬᾹ  is happy to announce the completion of Phase 1 of its flagship project on Sikkim’s Green Vision: Strategies and Capacity Building  funded by Dept. of Information and Public Relations, Govt. of Sikkim,  with Sikkim Manipal Institute of Technology  as collaborating institution.`,
  //     link: "#",
  //   },
  //   {
  //     id: 7,
  //     content: ` C-DRAṢṬᾹ invites papers for the Young Researchers’ Column to foster the spirit of independent thinking and research in young academic minds...`,
  //     link: "#",
  //   },
  //   {
  //     id: 8,
  //     content: ` C-DRAṢṬᾹ invites original research based technical papers, articles, case studies for its Journal, DRASTA-AVALOKAN , on topics of current concern in the areas of corporate social responsibility, environmental sustainability and economic viability...`,
  //     link: "#",
  //   },
  //   {
  //     id: 9,
  //     content: ` C-DRAṢṬᾹ invites application from students and individual researchers for Research Grants for pilot studies...`,
  //     link: "/v1/career",
  //   },
  //   {
  //     id: 10,
  //     content: `C-DRAṢṬᾹ is looking for interest from government departments, CSR departments of corporate houses and researchers for development research consultancy in MSME, Women Empowerment, Education, Financial Inclusion, Sustainable Development and Quality of Life...`,
  //     link: "/v1/research-themes",
  //   },
  //   {
  //     id: 11,
  //     content: ` C-DRAṢṬᾹ invites NGOs, CSR wings of corporate houses, public policy makers in government departments and researchers to participate in Competency Enhancing Workshops (CEW) on Research Methods and its Applications in Social and Environmental Sciences...`,
  //     link: "/v1/training-themes",
  //   },
  //   {
  //     id: 12,
  //     content: `  C-DRAṢṬᾹ is happy to announce its Thrust Area Programme- Designing and Conducting an Evaluation Study for a Socio-economic Development Programme under CSR: Formative and Outcome Evaluation...`,
  //     link: "/v1/training-themes",
  //   },
  // ];

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 z-10 -translate-y-1/2  bg-black/30 p-2 text-white hover:bg-black/50"
      aria-label="Next slide"
    >
      <FaChevronRight size={20} />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 z-10 -translate-y-1/2  bg-black/30 p-2 text-white hover:bg-black/50"
      aria-label="Previous slide"
    >
      <FaChevronLeft size={20} />
    </button>
  );
  // const slides = [
  //   {
  //     image: ste,
  //   },
  //   {
  //     image: reason,
  //   },
  //   {
  //     image: observe,
  //   },
  //   {
  //     image: empower,
  //   },
  //   {
  //     image: legalBg1,
  //   },
  //   {
  //     image: legalBg2,
  //   },
  //   {
  //     image: legalBg3,
  //   },
  //   // You can add more slide objects here
  // ];

  // const images = [
  //   drasta1,
  //   drasta2,
  //   drasta3,
  //   drasta4,
  //   drasta5,
  //   drasta6,
  //   drasta7,
  //   drasta8,
  //   drasta9,
  //   drasta10,
  //   drasta11,
  //   drasta12,
  //   drasta13,
  //   drasta14,
  //   drasta15,
  //   drasta16,
  //   drasta17,
  //   drasta18,
  //   drasta19,
  //   drasta20,
  //   drasta21,
  //   drasta22,
  //   drasta23,
  //   drasta24,
  //   drasta25,
  //   drasta26,
  //   drasta27,
  //   drasta28,
  //   drasta29,
  //   drasta30,
  //   drasta31,
  //   drasta32,
  //   drasta33,
  //   drasta34,
  //   drasta35,
  //   drasta36,
  //   drasta37,
  //   drasta38,
  //   drasta39,
  //   drasta40,
  //   drasta41,
  //   drasta42,
  // ];

  const imagedata = [
    {
      image: drasta11,
    },
    {
      image: drasta36,
    },
    {
      image: drasta41,
    },
    {
      image: drasta27,
    },
    {
      image: drasta33,
    },
    {
      image: drasta30,
    },
    {
      image: researchbg,
    },
    {
      image: researchbg,
    },
    // You can add more slide objects here
  ];
  const slidesdata = [
    {
      id: 1,
      content: (
        <>
          <p className="text-sm italic  text-black leading-snug mb-3 pt-2">
            Share your views on{" "}
            <em className="font-semibold text-black">
              “Entry and Retention of Women in Higher Studies and Research in
              Science in India”
            </em>
            <NavLink to={"/v1/womenscience"}>
              <span className="ml-1 text-[#929A5E]">Read More...</span>
            </NavLink>
          </p>
          <img
            src={researchtheme}
            alt="Focus Group"
            className="w-full h-[250px] object-contain"
          />
        </>
      ),
    },
    {
      id: 2,
      content: (
        <>
          <p className="text-sm italic  text-black leading-snug mb-3 pt-2">
            Share your views on{" "}
            <em className="font-semibold text-black">
              “How far Green Labels represent what they claim?”
            </em>
            <NavLink to={"/v1/greenleable"}>
              <span className="ml-1 text-[#929A5E]">Read More...</span>
            </NavLink>
          </p>
          <img
            src={researchtheme}
            alt="Focus Group"
            className="w-full h-[250px] object-contain"
          />
        </>
      ),
    },
  ];

  const settingsdata = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 700,
    fade: true, // Enables fade animation
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
  };

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    fade: true,
    appendDots: (dots) => (
      <div style={{ position: "absolute", bottom: "10px" }}>
        <ul style={{ margin: "0px" }}>{dots}</ul>
      </div>
    ),
    nextArrow: <NextArrow />, // Custom next arrow component
    prevArrow: <PrevArrow />, // enables fade transition
  };

  const sliderSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 6,
    slidesToScroll: 6,
    nextArrow: <NextArrow />, // Custom next arrow component
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <Header />
      <section className="flex flex-col md:flex-row">
        <div className="w-full md:w-[90%] h-[200px] md:h-[500px] overflow-hidden">
          <Slider {...settings}>
            {slider.map((slider, index) => (
              <div key={index}>
                <img
                  src={slider.image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-[200px] md:h-[500px] object-fill"
                />
              </div>
            ))}
          </Slider>
        </div>
        <div className="w-full md:w-1/3 text-white text-sm relative">
          <div className="p-3 md:p-5 bg-[#948B54]">
            <h3 className="text-base md:text-lg font-semibold text-black mb-3">
              News
            </h3>
          </div>

          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="h-[200px] md:h-[350px] overflow-hidden relative"
          >
            <div
              ref={scrollRef}
              className="overflow-y-scroll h-full pr-2 scroll-smooth"
            >
              <div className="space-y-6">
                {newsItems.slice(0, 200).map((item, index) => {
                  const isLong = item.content.length > 200;
                  const previewText = isLong
                    ? item.content.slice(0, 200) + "..."
                    : item.content;

                  return (
                    <p
                      key={index}
                      className="text-justify text-gray-500 leading-relaxed mb-2 p-2 font-semibold"
                    >
                      <strong>{index + 1}.</strong> {previewText}
                      <NavLink to={item.readMoreLink || "#"}>
                        <span className="text-[#929A5E] font-medium ml-1">
                          Read More
                        </span>
                      </NavLink>
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-4 text-right pr-2 pb-3 md:pr-4">
            <NavLink to="/v1/news">
              <button className="text-black text-xs px-2 md:px-4 py-2 border hover:text-white bg-[#96C346]">
                VIEW MORE...
              </button>
            </NavLink>
          </div>
        </div>
      </section>

      <section className="bg-[#16525A] text-white px-8 py-8">
        <div className="max-w-8xl mx-auto">
          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Overview</h2>

          {/* Content */}
          <p className="text-sm sm:text-[14px] font-semibold leading-relaxed  text-justify">
            {overView ||
              "The Centre for Development Research, Sustainability and Technical Advancement (C-DRASTA) is a non-profit and autonomous institution dedicated to actionable development policy research, training and awareness generation, with a multidisciplinary approach. It aims to understand and advance knowledge about the systems and processes spanning Society, Economy and Environment (SEE), by harnessing the power of Corporate Social Responsibility (CSR). The Centre is funded by grants from individuals and other institutional sources."}
          </p>
        </div>
      </section>

      <section className="bg-white py-5 px-4 pl-10 pr-10">
        <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mission */}
          <div className="pt-10">
            <h3 className="text-xl  mb-3">Mission</h3>
            <p className="text-sm text-gray-800 leading-relaxed text-justify h-[300px] overflow-y-auto">
            {mission?.mission ||
              "Observe, Reason, Empower (ORE) are the core focus of C-DRAṢṬĀ. Effective socio-economic research requires observation based on empirical evidence, reasoning to interpret reality, and empowerment of policy makers and study participants through wide dissemination of findings. C-DRAṢṬĀ fulfills this mission by conducting research and training for informed policy-making, offering platforms for dialogue among stakeholders, and using evaluation findings to empower individuals toward achieving their potential."}
          </p>
          </div>

          {/* Research */}
          <div className="pt-10">
            <h3 className="text-xl  mb-3">Research</h3>
            <p className="text-sm text-gray-800 leading-relaxed text-justify h-[300px] overflow-y-auto">
              {mission?.research ||
                "In order to understand how society, economy, and environment (SEE) intersect and interact, C-DRAṢṬĀ’s research themes span a variety of issues and development dilemmas across these three domains as well as their overlaps—focusing on social responsibility, economic viability, and environmental sustainability."}

              <NavLink to={"/v1/research-themes"}>
                <span className="ml-1 text-[#929A5E] font-semibold">
                  Read More...
                </span>
              </NavLink>
            </p>
          </div>

          {/* Focus Group */}
          <div className="">
            <div className="p-5 bg-[#948B54]">
              <h3 className="text-2xl  text-black mb-2">Focus Group</h3>
            </div>
            <Slider {...settingsdata}>
              {slidesdata.map((slide, index) => (
                <div key={index} className="p-4">
                  {slide.content}
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      <section className="bg-white py-5 px-4 pl-10 pr-10">
        <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mission */}
          <div>
            <h3 className="text-xl  mb-3">History</h3>
            <p className="text-sm text-gray-800 leading-relaxed text-justify h-[300px] overflow-y-auto">
              {mission?.history ||
                "C-DRAṢṬᾹ (to be read as ‘C-DRASTA’) was founded in 2015 by a group of individuals from different vocations but a common commitment to research and training for sustainable economic growth and inclusive development of society. These individuals came together to form the Board of Trustees of C-DRAṢṬᾹ and entrusted the President with the responsibility of carrying C-DRAṢṬᾹ’s work forward. ‘DRAṢṬᾹ’, which means “observer” in Sanskrit, conveys the Trustees’ belief that the primary role of a researcher is to reason, report, and disseminate based on unbiased observation."}
            </p>
          </div>

          {/* Research */}
          <div>
            <h3 className="text-xl  mb-3">Training & Awareness Campaign</h3>
            <div className="text-sm text-gray-800 leading-relaxed text-justify h-[300px] overflow-y-auto">
              <p>
                {mission?.trainingAwareness ||
                  "Training at C-DRAṢṬᾹ is conducted through Competency Enhancing Workshops (CEWs) aligned with research stages, focusing on research methodology for evaluation studies related to Green and Inclusive development. Alongside technical training, C-DRAṢṬᾹ promotes awareness through Green Awareness Workshops (GAW) and campaigns involving interactive formats like quizzes and games to engage diverse stakeholders in green living and livelihoods. CEWs aim to develop end-to-end development solutions, while GAW facilitates the realization of research outcomes."}
              </p>
              <NavLink to={"/v1/training-themes"}>
                <span className=" text-[#929A5E] font-semibold">
                  Read More...
                </span>
              </NavLink>
            </div>
          </div>

          {/* Focus Group */}
          <div className="">
            <div className="">
              <img src={heading} alt="Focus Group" />
            </div>
            <Slider {...settingsdata}>
              {imagedata.map((slide, index) => (
                <div key={index} className="p-2">
                  <img
                    src={slide.image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-[250px] object-contain"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      <section className="bg-[#215968] py-8">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-6">
          {/* Title */}
          <h2 className="text-white text-2xl md:text-4xl font-semibold text-center md:text-left">
            Want To Know More ?
          </h2>

          {/* Button */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#A8CF4A] hover:bg-[#94b83d] text-white text-sm font-bold px-6 py-3 flex items-center gap-2 transition"
          >
            <FaHandPointRight size={18} />
            GET ENQUIRY
          </button>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="max-w-8xl mx-auto px-4">
          <Slider {...sliderSettings}>
            {galleryItems.map((img, index) => (
              <div key={index} className="px-2">
                <img
                  src={img.url}
                  alt={`Team ${index + 1}`}
                  className="w-full h-[250px] object-cover transition-transform duration-500 ease-in-out transform hover:scale-105 rounded-lg "
                />
              </div>
            ))}
          </Slider>
        </div>
      </section>
      <EnquiryModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <Footer />
    </>
  );
};
