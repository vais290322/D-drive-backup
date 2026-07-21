import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, ArrowRight, X } from "lucide-react";
import expertImg from "../assets/v1-footerimage.jpg";
import entryImg from "../assets/v1-footerimage.jpg";
import awardImg from "../assets/v1-footerimage.jpg";
import img1 from "../assets/7-320x202.jpg";
import img2 from "../assets/8-320x202.jpg";
import img3 from "../assets/4-320x202.jpg";
import img4 from "../assets/5-320x202.jpg";
import img5 from "../assets/6-320x202.jpg";
import img6 from "../assets/10-320x202.jpg";
import img7 from "../assets/11-320x202.jpg";
import img8 from "../assets/img-6-5.jpg";
import img9 from "../assets/img-5-6.jpg";
import img10 from "../assets/img-4-5.jpg";
import img11 from "../assets/img-3-7.jpg";
import img12 from "../assets/img-2-7.jpg";
import img13 from "../assets/img-1-7.jpg";
import img14 from "../assets/AE_1-320x202.jpg";
import img15 from "../assets/AE_2-320x202.jpg";
import img16 from "../assets/AE_5-320x202.jpg";
import img17 from "../assets/AE_6-320x202.jpg";
import img18 from "../assets/AE_8-320x202.jpg";
import img19 from "../assets/AE_10-320x202.jpg";
import img20 from "../assets/AE_11-320x202.jpg";
import img21 from "../assets/AE_12-320x202.jpg";
import img22 from "../assets/RCWII_1-320x202.png";
import img23 from "../assets/RCWII_2-320x202.png";
import img24 from "../assets/RCWII_3-320x202.png";
import img25 from "../assets/RCWII_4-320x202.png";
import img26 from "../assets/RCWII_5-320x202.png";
import img27 from "../assets/RCWII_6-320x202.png";
import img28 from "../assets/RCWII_7-320x202.png";
import img29 from "../assets/RCWII_8-320x202.png";
import img30 from "../assets/RCWII_9-320x202.png";
import img31 from "../assets/RCWII_10-320x202.png";
import img32 from "../assets/RCWII_11-320x202.png";
import img33 from "../assets/RCWII_12-320x202.png";
import img34 from "../assets/RCWI_1-320x202.png";
import img35 from "../assets/RCWI_2-320x202.png";
import img36 from "../assets/RCWI_3-320x202.png";
import img37 from "../assets/RCWI_4-320x202.png";
import img38 from "../assets/RCWI_5-320x202.png";
import img39 from "../assets/RCWI_6-320x202.png";
import img40 from "../assets/RCWI_7-320x202.png";
import img41 from "../assets/RCWI_8-320x202.png";
import img42 from "../assets/RCWI_9-320x202.png";
import img43 from "../assets/RCWI_10-320x202.png";
import img44 from "../assets/RCWI_11-320x202.png";
import img45 from "../assets/RCWI_12-320x202.png";
import img46 from "../assets/img-2-1.jpg";
import img47 from "../assets/img-1-1.jpg";
import img48 from "../assets/img-6-1.jpg";
import img49 from "../assets/img-5.jpg";
import img50 from "../assets/img-5-1.jpg";
import img51 from "../assets/img-3-1.jpg";
import img52 from "../assets/img-1.jpg";
import img53 from "../assets/img-2.jpg";
import img54 from "../assets/img-3.jpg";
import img55 from "../assets/img-4.jpg";
import img56 from "../assets/img-5.jpg";
import img57 from "../assets/img-6.jpg";
import img58 from "../assets/img-7.jpg";
import img59 from "../assets/img-8.jpg";
import img60 from "../assets/img-1-2.jpg";
import img61 from "../assets/img-2-2.jpg";
import img62 from "../assets/img-3-2.jpg";
import img63 from "../assets/img-4-1.jpg";
import img64 from "../assets/img-5-2.jpg";
import img65 from "../assets/img-6-2.jpg";
import img66 from "../assets/img-5-5.jpg";
import img67 from "../assets/img-1-5.jpg";
import img68 from "../assets/img-2-5.jpg";
import img69 from "../assets/img-3-5.jpg";
import img70 from "../assets/img-4-4.jpg";
import img71 from "../assets/img-1-4.jpg";
import img72 from "../assets/img-6-4.jpg";
import img73 from "../assets/img-5-4.jpg";
import img74 from "../assets/img-4-3.jpg";
import img75 from "../assets/img-3-4.jpg";
import img76 from "../assets/img-2-4.jpg";
import img77 from "../assets/img-2-4.jpg";
import img78 from "../assets/img-1-3.jpg";
import img79 from "../assets/img-6-3.jpg";
import img80 from "../assets/img-5-3.jpg";
import img81 from "../assets/img-4-2.jpg";
import img82 from "../assets/img-3-3.jpg";
import img83 from "../assets/img-2-3.jpg";
import img84 from "../assets/img-1-6.jpg";
import img85 from "../assets/img-2-6.jpg";
import img86 from "../assets/img-3-6.jpg";








import { FaHandPointRight } from "react-icons/fa";


const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-0 z-10 p-2 bg-white/50 shadow -translate-y-1/2 top-1/2 hover:bg-gray-100"
  >
    <ChevronLeft className="w-5 h-5 text-gray-700" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-0 z-10 p-2 bg-white/50 shadow -translate-y-1/2 top-1/2 hover:bg-gray-100"
  >
    <ChevronRight className="w-5 h-5 text-gray-700" />
  </button>
);

// ... (imports remain same)

const GalleryImageSlider = () => {
  const [zoomedImage, setZoomedImage] = useState(null);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 3,
    // centerMode: true,
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
  const paintingPrograms = [
    {
      title: "P12 –",
      subtitle: "C-DRAṢṬĀ GREEN LIVING & LIVELIHOOD (GLL) QUIZ Meet (2021)",
      date: "",
      description1:
        "C-DRAṢṬĀ conducted its first and second online C-DRAṢṬĀ GREEN LIVING & LIVELIHOOD (GLL) QUIZ meet on 21ST November and 12th December 2021 respectively. The contestants are post graduate and undergraduate students and young professionals from various backgrounds.",
      description2:
        "",
      images: [img1, img2, img3,img4,img5,img6,img7], // Replace with your actual image imports/URLs
      expertProfileLink: "https://drasta.org/wp-content/uploads/2021/12/CDRASTA-GLL-QUIZ-MEET.pdf",
    },
    {
      title: "P11 –",
      subtitle: " C- DRAṢṬĀ’s Journey in the Post COVID World (2020-21)",
      date: "",
      description1:
        "Centre For Development Research, Sustainability and Technical Advancement (C-DRAṢṬᾹ) received the ‘STE Humanitarian Award for NGOs’ from Save the Environment (STE) which is a Society for Research Awareness and Social Development. Dr. Rajlakshmi Mallik, President and Head, Research and Training, Centre For Development Research, Sustainability and Technical Advancement (C-DRAṢṬᾹ), Kolkata, received this award on behalf of Team C-DRAṢṬᾹ. C-DRAṢṬĀ, being a non-profit development policy research organization with the Mission to Empower based on Observation and Reasoning. C-DRAṢṬĀ is committed to any effort at ensuring social sustainability and sustainable living and as part of its commitment to combat the COVID-19 virus pandemic it has been engaged in generating public awareness about the government advisory about practices and measures for arresting the transmission of COVID-19 virus infection.",
      description2:
        "COVID-19 Perception and Practice Survey which was about assessing the perception and practice in the context of coronavirus pandemic and government health advisory for combating the same and highlights issues pertaining to awareness, perception and practice in the context of COVID-19 pandemic.COVID-19 Prevention Survey which was related to alternative preventive practices and measures for arresting the transmission of COVID-19 virus infection.COVID-19 Prevention Survey which was related to alternative preventive practices and measures for arresting the transmission of COVID-19 virus infection.COVID-19 Tourism Perception Survey that was mainly about designing strategies for reorientation of tourism to the post COVID-19 world.",
      images: [img8, img9, img10,img11,img12,img13], // Replace with your actual image imports/URLs
      expertProfileLink: "https://drasta.org/wp-content/uploads/2022/07/K.pdf",
    },
    {
      title: "P10 –",
      subtitle: "Education among Adivasis in Hingalganj, Sundarban (2019)",
      date: "",
      description1:
        "Project Brief: Team C-DRAṢṬᾹ conducting the pilot survey for the study Education amongst Adivasis in Hinalganj Block of Sundarban, North 24 Parganas, West Bengal funded byRashtriyaUchhataraSiksha Abhiyan (RUSA- 2.0) and hosted by JU. The researchers at C-DRAṢṬᾹ were instrumental in developing thesurvey design, questionnaires for the field survey and field team trainingfor the above study.The study was designed to understand the status and reasons for dropout from school education among Adivasis.",
      description2:
        "",
      images: [img14, img15, img16,img17,img18,img19,img20,img21], // Replace with your actual image imports/URLs
      expertProfileLink: "https://drasta.org/wp-content/uploads/2021/07/Education-Among-Adivasi.pdf",
    },
    {
      title: "P9 –",
      subtitle: "Random Check Survey: Tobacco Use Among Adolescents Wave II (2019-20)",
      date: "",
      description1:
        "Project Brief: Team C-DRAṢṬᾹ conducting Random Check Survey of households from Wave II of Longitudinal Study of Adolescent Tobacco Use and Tobacco control Policy in India. This survey was about data quality check for the longitudinal study on tobacco use conducted by Healis Seksharia Institute of Public Health, Mumbai.",
      description2:
        "",
      images: [img21, img22, img23,img24,img25,img26,img27,img28,img29,img30,img31,img32,img33], // Replace with your actual image imports/URLs
      expertProfileLink: "https://drasta.org/wp-content/uploads/2021/07/Random-Check-Wave-II.pdf",
    },
    {
      title: "P8 –",
      subtitle: "Random Check Survey: Tobacco Use Among Adolescents Wave I (2019)",
      date: "",
      description1:
        "Project Brief: Team C-DRAṢṬᾹ conducting Random Check of 5% Eligible and Non-eligible Household in Kolkata from Base Line Survey for the Longitudinal Study on Adolescent Tobacco Use and Tobacco Control Policy in India. This survey was about data quality check for the longitudinal study on tobacco use conducted by Healis Sekhsaria Institute of Public Health, Mumbai.",
      description2:
        "",
      images: [img34, img35, img36,img37,img38,img39,img40,img41,img42,img43,img44,img45], // Replace with your actual image imports/URLs
      expertProfileLink: "https://drasta.org/wp-content/uploads/2021/07/Random-Check-Wave-I.pdf",
    },
    {
      title: "P7 –",
      subtitle: "Sikkim Green Vision Volume II (2019-20)",
      date: "",
      description1:
        "Preparing a book/report “Sikkim’s Green Vision: Strategies And Capacity Building Volume II: Intersections of Green Tourism and Capacity Building: Striving Towards a Green Economy through Green Tourism and Kitchen Gardens” based on primary research.",
      description2:
        "",
      images: [img46, img47, img48, img49, img50, img51], // Replace with your actual image imports/URLs
      expertProfileLink: "https://drasta.org/wp-content/uploads/2022/07/E.pdf",
    },
    {
      title: "P6 –",
      subtitle: "Sikkim Green Vision Volume II (2019-20)",
      date: "",
      description1:
        "Project Brief: As the first step in contributing towards the attainment of this goal C-DRAṢṬᾹ undertook extensive secondary research with support and funding from the Information and Public Relations Department of Government of Sikkim. The research involved an intensive and critical review of existing scientific studies, government reports and independent assessments of various green interventions implemented and experimented across the globe with special focus on Sikkim. Sikkim is the world’s first mover to experiment with these concepts under the auspice of the Honourable Chief Minister, Shri. Pawan Chamling, provided a suitable platform to explore these issues.",
      description2:
        "The research study culminated as a book – a two volume series on Sikkim’s Green Vision: Strategies and Capacity Building. The study helped to delineate some of the best practices that may be replicated in other regions with similar settings and highlighted how various green interventions specifically green tourism and organic farming may help to reinforce and catalyze each other thereby accelerating progress along the sustainable development path. The book attempted to explore the intersections of the different facets of Sikkim’s flagship programs. Eminent policy makers, educationists and experts from various fields contributed to the knowledge base of the book which was co-authored by Dr. Rajlakshmi Mallik, Director, C-DRAṢṬᾹ with Dr. Ajeya Jha, Professor and Head of Department, Sikkim Manipal Institute of Technology (SMIT) and Dr. Sherab Shenga, Secretary, Information and Public Relations Department, Government of Sikkim.The book was launched by Honourable Governor of Sikkim, Sri. Ganga Prasad Chaurasia during Republic Day Celebrations 2019 and Honourable Ex Chief Minister of Sikkim Sri. Pawan Chamling kindly consented to writing the foreword for the book.",
      images: [img52, img53, img54,img55,img56,img57,img58,img59], // Replace with your actual image imports/URLs
      expertProfileLink: "https://drasta.org/wp-content/uploads/2022/07/D.pdf",
    },
    {
      title: "P5 –",
      subtitle: " Status of Women in Science (2017)",
      date: "",
      description1:
        "Project Brief: As an extension on the Research theme Women Empowerment: Key to Sustainable Societies, topical study on Status of Women in Science, on pan India basis was conducted. The research study involved a national level survey of more than 1500 scientists and students of science covering 20 states in India and Delhi NCT. The research team consisting of in-house research assistants and 25 post graduate and undergraduate student research interns from several reputed universities and colleges of Kolkata viz. Presidency University, University of Calcutta, University of Kalyani, Bethune College and other were involved in data collection, processing and data analysis and preparation of the report. This project was funded by NITI AAYOG and conducted at C-DRAṢṬᾹ.",
      description2:
        "",
      images: [img61, img62, img63,img64,img65], // Replace with your actual image imports/URLs
      expertProfileLink: "https://drasta.org/wp-content/uploads/2022/07/F.pdf",
    },
    {
      title: "P4 –",
      subtitle: " C-DRAṢṬᾹ’s Mantras and Values (2018-21)",
      date: "",
      description1:
        "C-DRAṢṬᾹ Mantra and Value system : MESH standing for Method, Empathy, sincerity and Honesty . Green is a way of life and not just concepts related to production and consumption’. We have to integrate green practices in our everyday life and it is not just limited to market. It has to be essentially a part of our value system.",
      description2:
        "Education and capacity building for ensuring health, empowerment, financial inclusion and social inclusion through various sustainable “Green Practises”.",
      images: [img66, img67, img68,img69,img70], // Replace with your actual image imports/URLs
      expertProfileLink: "https://drasta.org/wp-content/uploads/2022/07/I.pdf",
    },
    {
      title: "P3 –",
      subtitle: " Life at C-DRAṢṬᾹ: Holi, Chirstmas, Durga Pujo, All Fun Occasions and Work Mode Group Photos (2018-21)",
      date: "",
      description1:
        "As an organisation C-DRAṢṬA’s core strength lies in its people and the wonderful complementarities that exist between them. All our actions and activities at all levels are organised and co-ordinated based on the above principle that ‘TOGETHER WE MAKE A PERFECT TEAM’.",
      description2:
        "Our belief in the underlying harmonisation of skills attributes and attitudes also extend to the realm of stakeholders whom we try to reach out through our activities. A hope that our efforts will culminate in propelling the formation of ever enlarging group of stakeholders coming together to work on the common cause of sustainable production and consumption thereby making way for a green world.",
      images: [img71, img72, img73,img74,img75,img76], // Replace with your actual image imports/URLs
      expertProfileLink: "https://drasta.org/wp-content/uploads/2022/07/H.pdf",
    },
    {
      title: "P2 –",
      subtitle: "Sikkim Green Vision Volume II (2019-20)",
      date: "",
      description1:
        "Research Team: C- DRAṢṬĀ’s research team consists of a core group of senior researchers in an advisory or supervisory role and a team of young, bright and talented junior researchers including research assistant, summer interns and project linked personnel from economics, statistics, computer science, sociology and other disciplines. The Board of Trustees, custodian of C – DRAṢṬĀ’s values and missions, consists of representatives from different walks of life including industry, academia, government and research. They are unified by their commitment to research and training for socio-economic development and philanthropic causes.",
      description2:
        "To strengthen the quality of research and ensure a multidisciplinary base C-DRAṢṬĀ seeks the expertise of independent professionals and undertakes collaborative research. The panel of Consultants and Collaboration comprises experienced professionals from various domains. In order to execute its Vision and chart out the future path of the organization, the Board of Trustees seek the advice and guidance of illustrious scholars, professionals and eminent social reformers. The panels of advisors help C – DRAṢṬĀ with their knowledge, experience and expert advice.",
      images: [img77, img78,img79,img80,img81 , img82 , img83], // Replace with your actual image imports/URLs
      expertProfileLink: "https://drasta.org/wp-content/uploads/2022/07/G.pdf",
    },
    {
      title: "P1 –",
      subtitle: "Sikkim Green Vision Volume II (2019-20)",
      date: "",
      description1:
        "Project Brief: C-DRAṢṬᾹ undertook a survey covering four districts of West Bengal viz. North 24 Parganas, Jalpaiguri, Malda and South Dinajpur for the study of Impact of Education on Youth Employment in Rural India with focus on West Bengal. The survey was based on research design developed at C-DRAṢṬᾹ as part of research advisory for the study with Dr. Rajlakshmi Mallik as the lead advisor from C-DRAṢṬᾹ. The project was hosted and conducted by Department of Economics, Rishi Bankim Chandra Evening College and funded by University Grants Commission.",
      description2:
        "The survey also provided an opportunity for student research interns to gain an understanding of the socio-economic issues being addressed such as presence of regional effects, sectoral effects and gender effects in the level and nature of employment among youth as also in the relationship between education and employment. It also enabled them to get field experience and develop an understanding of problems faced when theories are put into practice and provided them an opportunity to find practical solutions to such problems.",
      images: [img84, img85, img86], // Replace with your actual image imports/URLs
      expertProfileLink: "https://drasta.org/wp-content/uploads/2022/07/J.pdf",
    },
  ];
  return (
    <>
      {paintingPrograms.map((program, index) => (
        <section key={index} className="max-w-7xl mx-auto px-4 py-0 pb-8">
          <div className="border bg-[#FFE9AA] p-4 sm:p-6 md:p-10 rounded shadow-sm border-black">
            <h3 className="text-base sm:text-lg font-semibold text-center mb-4">
              <span className="text-[#993366] font-bold">{program.title}</span>{" "}
              <span className="text-[#747B84]">{program.subtitle} </span>
              <span className="font-medium text-[#747B84]">{program.date}</span>
            </h3>

            <p className="text-sm md:text-[14px] text-[#747476] mb-4 leading-relaxed">
              {program.description1}
            </p>

            <p className="text-sm md:text-[14px] text-[#747476] mb-6 leading-relaxed">
              {program.description2}
            </p>

            {/* Slider */}
            <div className="relative px-2 sm:px-0 mb-6">
              <Slider {...sliderSettings}>
                {program.images.map((img, imgIndex) => (
                  <div key={imgIndex} className="flex justify-center">
                    <img
                      src={img}
                      alt={`Slide ${imgIndex + 1}`}
                      onClick={() => setZoomedImage(img)}
                      className="w-full max-w-[200px] h-auto object-contain shadow cursor-zoom-in"
                    />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Button */}
            <div className="flex flex-wrap justify-end gap-4">
              <a
                href={program.expertProfileLink} target="_blank"
                className="inline-flex items-center gap-2 bg-[#96C346] hover:bg-[#96C346] text-white text-sm font-semibold px-4 py-2 rounded"
              >
                SEE MORE
                <FaHandPointRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      ))}

      {/* Zoom Modal */}
      {/* {zoomedImage && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setZoomedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2"
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
        )} */}

      {zoomedImage && (
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
      )}
    </>
  );
};

export default GalleryImageSlider;
