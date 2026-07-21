import React, { use, useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import advisor1 from "../assets/100.jpg";
import advisor2 from "../assets/102.jpg";
import advisor3 from "../assets/Sheemanty-Mukherjee-1.jpg";
import advisor4 from "../assets/Agnibiva-Paul.jpg";
import advisor5 from "../assets/Sreya-Debnath-1.jpg";
import advisor6 from "../assets/Debarati-Mukherjee-1.jpg";
import legalBg from "../assets/v1-footerimage.jpg";
import image1 from "../assets/6.jpg";
import image2 from "../assets/7.jpg";
import image3 from "../assets/IMG20210323121716.jpg";
import image4 from "../assets/IMG20210324145548-1.jpg";
import image5 from "../assets/8.jpg";
import image6 from "../assets/Rupsha-Dey.jpg";
import image7 from "../assets/Sarnali-Nandy.jpg";
import image8 from "../assets/Ayantika-Mitra.jpg";
import image9 from "../assets/Rabi-1.jpg";
import image10 from "../assets/9.jpg";
import image11 from "../assets/Kuheli.jpg";
import image12 from "../assets/Sarnali-Adak.jpg";
import image13 from "../assets/10.jpg";
import image14 from "../assets/Anamika-Sikdar.jpg";
import image15 from "../assets/Anandee-Choudhury.jpg";
import image16 from "../assets/Anwesha-Ghosh.jpg";
import image17 from "../assets/pic_f-150x150.jpg";
import image18 from "../assets/Anindita-Mondal.jpg";
import image19 from "../assets/Deeya-Bardhan.jpg";
import image20 from "../assets/Moumita-Pal.jpg";
import image21 from "../assets/Megha-Bardia.jpg";
import image22 from "../assets/Puja-Roy.jpg";
import image23 from "../assets/Romita-Bardhan.jpg";
import image24 from "../assets/Saradia-Bhattacharya.jpg";
import image25 from "../assets/Soumi-Banerjee.jpg";
import image26 from "../assets/Shaswati-Mitra.jpg";
import image27 from "../assets/Sheemanty-Mukherjee.jpg";
import image28 from "../assets/Siddhartha-Mitra.jpg";
import image29 from "../assets/Urfa-Yasmin.jpg";
import image30 from "../assets/profile-pic.jpg";

import expert8 from "../assets/profile-pic.jpg";

const yearData = [
  {
    year: "2022-2023",
    interns: [
      {
        name: "ARYARKI DAW",
        details: "M.Stat, Statistics, St. XAVIERS College",
        image: image1,
      },
    ],
  },
  {
    year: "2021-2022",
    interns: [
      {
        name: "DURGA NAYAK ",
        details:
          "M.A, Environmental Studies , Rabindra Bharati University (Student Intern)",
        image: image2,
      },
      ,
      {
        name: "Surosree Nath ",
        details: " M.Sc., Economics (2017-19), University of Calcutta",
        image: image3,
      },
    ],
  },
  {
    year: "2020-2021",
    interns: [
      {
        name: "Himadry Dutta ",
        details: "M.Sc., Economics (2016-18), University of Calcutta",
        image: image4,
      },
      {
        name: "JENIFER CHOWDHURY",
        details: " M.Sc., Economics (2017-19), University of Calcutta",
        image: image5,
      },
      {
        name: "Surosree Nath ",
        details: " M.Sc., Economics (2017-19), University of Calcutta",
        image: image3,
      },
    ],
  },
  {
    year: "2019-2020",
    interns: [
      {
        name: "Rupsa Dey",
        details: " M.Sc., Economics (2016-18), University of Calcutta",
        image: image6,
      },
      {
        name: "Sarnali Nandy ",
        details: " M.Sc., Economics (2017-19), University of Calcutta",
        image: image7,
      },
      {
        name: "Ayantika Mitra",
        details: " M.Sc., Economics (2018-20), University of Calcutta",
        image: image8,
      },

      {
        name: "Rabi Chowdhury ",
        details: " M.Sc., Economics (2016-18), University of Calcutta",
        image: image9,
      },
      {
        name: "SOUMALYA GHOSAL ",
        details: "M.Sc, Economics, Calcutta University",
        image: image10,
      },
    ],
  },
  {
    year: "2018-2019",
    interns: [
      {
        name: "Kuheli Ghosh",
        details: " Student, B.Sc., Psychology, West Bengal State University",
        image: image11,
      },
      {
        name: "Rabi Chowdhury  ",
        details: " M.Sc., Economics (2016-18), University of Calcutta",
        image: image9,
      },
      {
        name: "Rupsa Dey",
        details: "  M.Sc., Economics (2016-18), University of Calcutta",
        image: image6,
      },

      {
        name: "Sarnali Adak  ",
        details: " M.Sc., Economics, University of Calcutta",
        image: image12,
      },
      {
        name: "SHREYA MAJUMDER ",
        details: " M.Sc, Economics, Calcutta University",
        image: image13,
      },
    ],
  },
  {
    year: "2017-2018",
    interns: [
      {
        name: "Anamika Sikdar",
        details: "Student, M.Sc., Economics, University of Calcutta",
        image: image14,
      },
      {
        name: "Anandee Choudhury ",
        details: " Student, M.Sc., Economics, University of Calcutta",
        image: image15,
      },
      {
        name: "Anwesha Ghosh ",
        details: " Student, M.Sc., Economics, University of Calcutta",
        image: image16,
      },

      {
        name: "Anindita Saha, ",
        details: " Student, M.Sc., Economics, University of Calcutta",
        image: image17,
      },
      {
        name: "Anindita Mondal ",
        details: "  Student, M.Sc., Economics, University of Calcutta",
        image: image18,
      },
      {
        name: "Arpita Ghosh,  ",
        details: " B.Sc.,Physocology,University of Calcutta",
        image: image17,
      },
      {
        name: "Deeya Bardhan",
        details: "  Student, M.Sc., Economics, University of Calcutta",
        image: image19,
      },

      {
        name: "Moumita Pal ",
        details: "  Student, M.Sc., Economics, University of Calcutta",
        image: image20,
      },
      {
        name: "Megha Bardia ",
        details: " Student, M.Sc., Economics, University of Calcutta",
        image: image21,
      },
      {
        name: "Puja Roy ",
        details: "Student, B.Sc.,Economics, Bethune College, Kolkata",
        image: image22,
      },
      {
        name: "Rakhi Saha ",
        details: "  Student, M.Sc., Economics, University of Calcutta",
        image: image17,
      },
      {
        name: "Rosi Dutta",
        details: " Student, M.A. Sociology, Presidency University",
        image: image17,
      },

      {
        name: "Romita Bardhan ",
        details: "Student, M.Sc., Economics, University of Calcutta",
        image: image23,
      },
      {
        name: "Rupsha Dey ",
        details: " Student, M.Sc., Economics, University of Calcutta",
        image: image6,
      },
      {
        name: "Samarpita Paul ",
        details: "  Student, M.Sc., Economics, University of Kalyani",
        image: image17,
      },
      {
        name: "Saradia Bhattacharya",
        details: " Student, M.Sc., Economics, University of Calcutta",
        image: image24,
      },
      {
        name: "Sagarika Sengupta",
        details: "Student, M.Sc., Economics, University of Calcutta",
        image: image17,
      },
      {
        name: "Soumi Banerjee",
        details: "  Student, M.Sc., Economics, University of Calcutta",
        image: image25,
      },
      {
        name: "Shristi Solomi Ghomes",
        details: "Student, M.Sc., Economics, University of Calcutta",
        image: image17,
      },
      {
        name: "Shaswati Mitra",
        details: " Student, M.Sc., Economics, University of Calcutta",
        image: image26,
      },
      {
        name: "Sheemanty Mukherjee",
        details: "Student, M.Sc., Economics, University of Calcutta",
        image: image27,
      },
      {
        name: "Siddhartha Mitra",
        details: " Student, M.Sc., Economics, University of Calcutta",
        image: image28,
      },
      {
        name: "Urfa Yasmin",
        details: "Student, M.Sc., Economics, University of Calcutta",
        image: image29,
      },
      {
        name: "Bodhisattwa Sarkar",
        details: "Student, M.Sc., Economics, University of Kalyani",
        image: image30,
      },
      {
        name: "Syamantak Chattopadhyay",
        details: "Student, M.Sc., Economics, University of Kalyani",
        image: image30,
      },
      {
        name: "Nilanjan Ghosh",
        details: "Student, M.Sc., Economics, University of Kalyani",
        image: image30,
      },
      {
        name: "Somashree Banerjee",
        details: " Student, M.Sc., Economics, University of Kalyani",
        image: image17,
      },
      {
        name: "Rupa Halder",
        details: " Student, M.Sc., Economics, University of Kalyani",
        image: image17,
      },
    ],
  },
  {
    year: "2016-2017",
    interns: [
      {
        name: "Shreya Seth",
        details: " Student, M.A. Sociology, Presidency University",
        image: image17,
      },
      {
        name: "Susmita Sikdar",
        details: " Student, M.Sc., Economics, Presidency University",
        image: image17,
      },
      {
        name: "Tandra Sarkar",
        details: "  Student, M.A., Social Welfare, Netaji Subhas Open University",
        image: image17,
      },
      {
        name: "Rosi Dutta,",
        details: "  Student, M.A. Sociology, Presidency University",
        image: image17,
      },
      {
        name: "Anindiata Dutta",
        details: " Student, M.Sc., Economics, University of Calcutta",
        image: image17,
      },
    ],
  },
  {
    year: "2015-2016",
    interns: [
      {
        name: "Nilashis Rana",
        details: "B.Statistics, Indian Statistical Institute, Kolkata (Summer 2015)",
        image: image30,
      },
      {
        name: "Rohit Das",
        details: " B.Statistics, Indian Statistical Institute, Kolkata (Summer 2015)",
        image: image30,
      },
      {
        name: "Sudip Kumar Paul",
        details: "M.Sc. Economics, University of Calcutta (Summer 2015)",
        image: image30,
      },
    ],
  },
];
// const profiles = [
//   {
//     name: "Surosree Nath",
//     image: advisor1,
//     description:
//       "Surosree Nath specialised in Industry, Environmental Resource and Finance. After  her brief experience in banking her interest in environmental economics led her to join C-DRASTA as a Research & Programme Associate. She is involved in preparation & submission of project proposals, programme implementation, dissemination and awareness campaigning & providing technical support, data collection and analysis, report writing. She loves cooking, painting, watching movies.",
//     cvLink: "#",
//     position: "Research & Programme Associate, C-DRASTA",
//     education: "M.SC, Economics, Calcutta University",
//   },
//   {
//     name: "Debarati Dutta",
//     image: advisor2,
//     description:
//       "Debarati Dutta has specialised in Finance. After her brief stint with the banking sector, her interest in the co-operative banking system, inclusive growth and sustainability issues led her to join C-DRASTA as a Research & Programme Associate. She is actively involved in preparation and submission of research proposals, data collection and analysis, report writing, dissemination and awareness campaigning. She is enthusiastic about managing events, designing, sketchingand painting. She is loves food and interested in travel.",
//     cvLink: "#",
//     position: "Research & Programme Associate, C-DRASTA",
//     education: "M.A, Economics, Rabindra Bharati University",
//   },
//   {
//     name: "Smt. Sheemanty Mukherjee",
//     image: advisor3,
//     description:
//       "Sheemanty Mukherjee holds a Master’s degree from Calcutta University in Economics with specialization in International Economics, Development Policy and Health Economics. As part of her M.Sc. curriculum she did a dissertation on “Changing Trends in the Level of Women Employment at Metropolitan Kolkata in India”. She has also participated in survey work on issues related to women empowerment and gender bias in the personal care and nursing sector. As a research intern at C-DRAṢṬᾹ in the summer of 2017 she participated in a pan India survey for a Niti Aayog Study on status of women in science . She is actively involved in data collection and analysis and giving research support for the ongoing projects at C-DRAṢṬᾹ.",
//     cvLink: "#",
//     position: "Chairperson",
//     education: "M.Sc,University of Calcutta",
//   },
//   {
//     name: "Smt. Agnibiva Paul",
//     image: advisor4,
//     description:
//       "Agnibiva Paul specialized in Industrial Psychology in M.A. programme from Calcutta University.She has done a dissertation on “A Psychological Exploration of the variables namely Motivation, Burnout, Psychological well – being and Resilience of two groups of Bank Officers.” as part of the M.A. programme. In the past she has been associated with educational and computer training institution in the capacity of programme co-ordinator and trainer. She has recently completed a special course of BCBF (Business Correspondent and Business Facilitators) from SLIEM (Saltlake Institute of Engineering and Management). She is currently providing research support in the ongoing projects at C- DRAṢṬĀ and she is also responsible for overall co -ordination of research activities.",
//     cvLink: "#",
//     position: "Research Assistant",
//     education: "M.A., University of Calcutta",
//   },
//   {
//     name: "Smt. Sreya Debnath",
//     image: advisor5,
//     description:
//       "Sreya Debnath’s M.Phil. dissertation is in the area of worker motivation differences across employer status, specifically non-profit and mission oriented vis-à-vis profit making organizations, using GSS data. She also has provided research assistance in a project on impact assessment of banking technology on rural areas conducted by SBI and also primary survey experience in rural areas for project on RSBY. She has a keen interest in empirical research in women empowerment and sustainability issues. She is actively involved in data collection and analysis and has been instrumental in co-ordination of field surveys for the ongoing projects at C-DRAṢṬᾹ",
//     cvLink: "#",
//     position: "Research Assistant",
//     education: "M.Phil, University of Calcutta",
//   },
//   {
//     name: "Smt. Debarati Mukherjee",
//     image: advisor6,
//     description:
//       "Debarati Mukherjee specialized in Operations Research in M.Sc. programme and has done a dissertation on regional variation in Eastern India. Her past experiences include co-ordination of an educational program for deprived children conducted by an NGO and working with international financial market and investment research firm. She has practical research interest in issues related to women empowerment, growth and development of MSMEs and issues pertaining to banking sectors. She is currently providing research support in the ongoing projects at C-DRAṢṬᾹ related to Higher Education.",
//     cvLink: "#",
//     position: "Research Assistant",
//     education: "M.Sc,University of Calcutta",
//   },
// ];


const API= import.meta.env.VITE_OLD_API_URL;
export const Researchers = () => {

const [profiles, setProfiles] = useState([]);

const [yearData, setYearData] = useState([]);
 const fetchProfiles = async () => {
   const response = await fetch(`${API}/api/v1/advisor`); // Adjust the API endpoint as needed
   const data = await response.json();
    setProfiles(data?.advisors || []); // Ensure data is in the expected format
    // console.log("Fetched Profiles:", data.advisors);
  }

 const fetchYearData = async () => {
    const response = await fetch(`${API}/api/v1/visitor-intern`); // Adjust the API endpoint as needed
    const data = await response.json();
    setYearData(data?.data?.years || []);// Ensure data is in the expected format
    console.log("Fetched Year Data:", data?.data?.years);
  }
useEffect(()=>{
 fetchProfiles();
  fetchYearData();
},[])



  const [openYearIndex, setOpenYearIndex] = useState(0);

  const toggleYear = (index) => {
    setOpenYearIndex(index === openYearIndex ? null : index);
  };

  return (
    <>
      <Header />
      <div
        className="h-14 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${legalBg})` }}
      ></div>

      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl  text-black">
          Researchers and Interns
          <span className="block h-[2px] w-20 bg-[#b2a65f] mt-1"></span>
        </h2>

        {/* Subtext */}
        <p className="text-sm md:text-base text-gray-700 mt-4 mb-10 max-w-5xl">
          Along with the senior researchers, experts & collaborators a major
          asset of C-DRASTA is its team of young, bright and talented Research &
          Programme Associates, Project & Programme Coordinators, Research
          Interns and Project Linked Personnel from economics, statistics,
          computer science, sociology and other disciplines.
        </p>

        {/* Profile Card */}
        {profiles?.map((person, index) => (
          <div
            key={index}
            className="grid md:grid-cols-4 gap-6 items-start mb-3 mt-3"
          >
            {/* Image */}
            <div className="md:col-span-1">
              <img
                src={person?.image || expert8}
                alt={person?.name}
                className="border-4 border-gray-300 shadow w-[200px]"
              />
            </div>

            {/* Text Content */}
            <div className="md:col-span-3">
              <h3 className="text-xl font-semibold mb-4 mt-2">{person?.name}</h3>
              <p className="text-sm md:text-[14px] text-gray-700 .contact_legal font-semibold">
                {person?.position}
              </p>
              <p className="text-sm md:text-[14px] text-gray-700 pb-3">
                {person?.education}
              </p>

              <p className="text-sm md:text-[14px] text-gray-700">
                {person?.bio}
              </p>
              <button
                onClick={() => window.open(person?.cv, "_blank")}
                className="w-full sm:w-auto text-black hover:text-[#96C346] transition-colors duration-200 mt-4"
              >
                View C.V
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-medium text-black relative inline-block">
          Visitors and Research Interns
          <span className="block h-[2px] w-20 bg-[#b2a65f] mt-1"></span>
        </h2>

        <p className="text-sm md:text-base text-gray-700 mt-4 mb-6">
          C-DRASTA provides a platform for students pursuing undergraduate and
          post graduate studies in various disciplines to gain experience by
          participating in live research projects.
        </p>

        <div className="space-y-4">
          {yearData.map((entry, index) => {
            console.log(entry);
            const isOpen = openYearIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-lg overflow-hidden transition-all duration-300 ${
                  isOpen ? "border-lime-400 shadow-md" : "border-gray-200"
                }`}
              >
                {/* Toggle Header */}
                <button
                  onClick={() => toggleYear(index)}
                  className={`w-full flex items-center justify-between px-4 py-3 transition-colors duration-200 ${
                    isOpen ? "bg-lime-50" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1 rounded-sm ${
                        isOpen ? "bg-lime-500" : "bg-gray-700"
                      } text-white`}
                    >
                      {isOpen ? (
                        <Minus
                          size={16}
                          className="transition-transform duration-300"
                        />
                      ) : (
                        <Plus
                          size={16}
                          className="transition-transform duration-300"
                        />
                      )}
                    </div>
                    <span className="font-medium text-sm text-gray-800">
                      {entry.year}
                    </span>
                  </div>
                </button>

                {/* Expandable Content */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-4 bg-gray-50 border-t">
                    {entry.interns.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">
                        No intern data available for this year.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {entry.interns.map((intern, idx) => (
                          <div
                            key={idx}
                            className="grid md:grid-cols-6 items-center gap-4 bg-white p-4 rounded-lg border border-gray-200"
                          >
                            <div className="col-span-1">
                              <img
                                src={intern.image || expert8}
                                alt={intern.name}
                                className="w-20 h-20 object-cover rounded-md border border-gray-300"
                              />
                            </div>
                            <div className="col-span-5 text-sm">
                              <p className="font-semibold uppercase text-gray-800">
                                {intern.name}
                              </p>
                              <p className="text-gray-600">{intern.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <Footer />
    </>
  );
};
