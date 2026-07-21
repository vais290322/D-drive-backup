import React, { use, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";
import img1 from "../assets/1-320x202.jpg";
import img2 from "../assets/3-320x202.jpg";
import img3 from "../assets/2-320x202.jpg";
import img4 from "../assets/image1.jpg";
import img5 from "../assets/CGLL-PHOTOGRAPHY-FLYER2_JUN2023_WEB-320x202.jpg";
import img6 from "../assets/CGLL-PHOTOGRAPHY-FLYER3_JUN2023_WEB-320x202.jpg";

import {
  Award,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { FaHandPointRight } from "react-icons/fa";
import GalleryImageSlider from "../componants/GalleryImageSlider";

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-0 z-10 p-2 bg-white/50  shadow -translate-y-1/2 top-1/2 hover:bg-gray-100"
  >
    <ChevronLeft className="w-5 h-5 text-gray-700" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-0 z-10 p-2 bg-white/50  shadow -translate-y-1/2 top-1/2 hover:bg-gray-100"
  >
    <ChevronRight className="w-5 h-5 text-gray-700" />
  </button>
);
const API = import.meta.env.VITE_API_URL;
export const Gallery = () => {


  // const programSections = [
  //   {
  //     title: "P14 –",
  //     subtitle: "C-DRAṢṬᾹ Green Living and Livelihood DRAWING & PAINTING MEET",
  //     date: "(June–July 2023)",
  //     description1:
  //       "Programme Brief: Aligned with its goal of promoting awareness about Green Living and Livelihood, C-DRAṢṬᾹ conducts a drawing and painting meet on the theme ‘ECO-FRIENDLY WAYS OF LIVING THROUGH ADOPTION OF SUSTAINABLE HABITS IN ONE’S DAILY LIFE’ during June 2023.",
  //     description2:
  //       "The entries have been reviewed for Conceptualisation and Presentation by Experts from various vocations and domains. For checking out the contributions and the awardees and please click on the icons below.",
  //     images: [img1, img2, img3], // Replace with actual image variables or paths
  //     expertLink: "https://drasta.org/wp-content/uploads/2023/08/CGLL-DRAW-PAINT-MEET-EXPERTS_JUN2023_WEB.pdf",
  //     entriesLink: "https://drasta.org/wp-content/uploads/2023/08/CGLL-DRAW-PAINT-MEET-ENTRIES_JUN2023_WEB.pdf",
  //     awardsLink: "https://drasta.org/wp-content/uploads/2023/08/CGLL-DRAW-PAINT-MEET-AWARDS_JUN2023_WEB.pdf",
  //   },
  //   {
  //     title: "P13 –",
  //     subtitle: "C-DRAṢṬᾹ Green Living and Livelihood PHOTOGRAPHY MEET (June-July 2023)",
  //     date: "(August 2023)",
  //     description1:
  //       "Programme Brief: Aligned with its goal of promoting awareness about Green Living and Livelihood, C-DRAṢṬᾹ conducts a photography meet on the theme ‘ECO-FRIENDLY WAYS OF LIVING THROUGH ADOPTION OF SUSTAINABLE HABITS IN ONE’S DAILY LIFE’ during June 2023.",
  //     description2:
  //       "The entries have been reviewed for Conceptualisation and Presentation by a panel of Experts from various vocations and domains. For more information on contributions and awards and please click on the icons below.",
  //       images: [img4, img5, img6],
  //     expertLink: "https://drasta.org/wp-content/uploads/2023/08/CGLL-PHOTO-MEET-EXPERTS_JUN2023_WEB.pdf",
  //     entriesLink: "https://drasta.org/wp-content/uploads/2023/08/CGLL-PHOTO-MEET-ENTRIES_JUN2023_WEB.pdf",
  //     awardsLink: "https://drasta.org/wp-content/uploads/2023/08/CGLL-PHOTO-MEET-AWARDS_JUN2023_WEB.pdf",
  //   },
  // ];

  const [programSections,setprogramSections]=useState([])


  
  const [zoomedImage, setZoomedImage] = useState(null);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(()=>{
   const fetchData = async () => {
    try {
      const response = await fetch(`${API}/initiatives/grouped`); // Adjust the API endpoint as needed");
      const result = await response.json();
      setprogramSections(result.data);
      console.log("Fetched CSR Data:", result.data);
    } catch (error) {
      console.error("Error fetching CSR data:", error);
    }
  };
  fetchData()
  },[])

  // const images = [expertImg, entryImg, awardImg];

  return (
    <>
      <Header />
      <div
        className="h-14 md:h-14 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${legalBg})` }}
      ></div>

      <section className="max-w-7xl mx-auto px-4 py-12 ">
        <h2 className="text-2xl md:text-3xl  mb-2 inline-block">
          Gallery
          <span className="block h-[2px] w-16 bg-[#b2a65f] mt-1 "></span>
        </h2>
        <p className="italic text-lg md:text-xl text-center text-gray-700 mb-6 contact">
          JOURNEY TOWARDS GREEN LIVING AND LIVELIHOOD: 2015 to 2021
        </p>

        {/* {programSections.map((section, sectionIndex) => (
  <div
    key={sectionIndex}
    className="border bg-[#FFE9AA] p-4 sm:p-6 md:p-10 rounded shadow-sm mb-10 border-black"
  >
    <h3 className="text-base md:text-lg font-semibold text-center mb-4">
      <span className="text-[#993366] font-bold">{section.title}</span>
      <span className="text-[#747476]"> {section.subtitle} </span>
      <span className="font-medium text-[#747B84]">{section.date}</span>
    </h3>

    <p className="text-sm md:text-[14px] text-[#747476] mb-4 leading-relaxed text-center sm:text-left">
      {section.description1}
    </p>

    <p className="text-sm md:text-[14px] text-[#747476] mb-6 leading-relaxed text-center sm:text-left">
      {section.description2}
    </p>

    <div className="relative px-2 sm:px-0 mb-6 flex justify-around flex-wrap gap-4">
      {section.images.map((img, index) => (
        <div key={index} className="flex justify-center">
          <img
            src={img}
            alt={`Slide ${index + 1}`}
            onClick={() => setZoomedImage(img)}
            className="w-full max-w-[200px] h-auto object-contain shadow cursor-zoom-in"
          />
        </div>
      ))}
    </div>

    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <a
        href={section.expertLink} target="_blank"
        className="inline-flex items-center justify-center gap-2 bg-[#96C346] hover:bg-[#96C346] text-white text-sm font-semibold px-4 py-2 rounded"
      >
        <FaHandPointRight className="w-4 h-4" /> EXPERT PROFILE
      </a>
      <a
        href={section.entriesLink} target="_blank"
        className="inline-flex items-center justify-center gap-2 bg-[#96C346] hover:bg-[#96C346] text-white text-sm font-semibold px-4 py-2 rounded"
      >
        <FaHandPointRight className="w-4 h-4" /> PARTICIPANT ENTRIES
      </a>
      <a
        href={section.awardsLink} target="_blank"
        className="inline-flex items-center justify-center gap-2 bg-[#96C346] hover:bg-[#96C346] text-white text-sm font-semibold px-4 py-2 rounded"
      >
        <FaHandPointRight className="w-4 h-4" /> AWARDS
      </a>
    </div>
  </div>
))} */}

      </section>
      <GalleryImageSlider paintingPrograms={programSections} />

      {/* Zoom Modal */}
      {/* {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-0 right-0 text-white bg-black/50 rounded-full p-1"
              onClick={() => setZoomedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={zoomedImage}
              alt="Zoomed"
              className="max-w-full max-h-[80vh] rounded shadow-lg"
            />
          </div>
        </div>
      )} */}

      <Footer />
    </>
  );
};
