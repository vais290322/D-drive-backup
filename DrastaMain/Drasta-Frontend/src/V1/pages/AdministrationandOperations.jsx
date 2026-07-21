import React from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";
import advisor1 from "../assets/rajlakhmi_m.jpg";
import advisor2 from "../assets/R-Sarada.jpg";
import advisor3 from "../assets/sanjit.jpg";
import advisor4 from "../assets/suchismita-mallick.jpg";
import advisor5 from "../assets/Arnab-Dutta.jpg";
import advisor6 from "../assets/priyanka.png";
import advisor7 from "../assets/Samarpita-Paul.jpg";
import advisor8 from "../assets/Priya-Roychowdhury.jpg";

import expert8 from "../assets/profile-pic.jpg";
const API = import.meta.env.VITE_OLD_API_URL;
export const AdministrationandOperations = () => {
  // const data = [
  //   {
  //     img: advisor1,
  //     alt: "Rajlakshmi Mallik",
  //     name: "Rajlakshmi Mallik",
  //     title: "President & Head, Research and Training",
  //     desc: `Dr. Rajlakshmi Mallik is a development economist, policy researcher and an academic, with a rich experience of twenty two years. A Ph.D. in Economics from Indian Statistical Institute Kolkata, she has a long-standing interest and experience in policy-oriented development economics research on Financial Inclusion, Higher Education, Empowerment, Quality of Life, Sustainable Development and Vulnerability Assessment. She also has extensive teaching experience in various Economics and Management programmes.
  //        As Technical Advisor of SESS, Kolkata, she recently led and concluded a NITI Aayog, GOI project on Status of Women in Science among Select Institutions in India: Policy Implications. As President and Head, Research and Training of C-DRASTA which was founded in 2015, she is steering the non-profit research institution towards the realisation of its mission of Observe, Reason and Empower. C-DRASTA’s research team under her able leadership has been consistently working and successfully completed projects in the areas of Green Tourism and Organic Farming funded by the IPR Dept. Govt. of Sikkim along with other areas addressing social issues such as tobacco use among adolescents, adivasi educati`,
  //   },
  //   {
  //     img: advisor2,
  //     alt: "Sarada Ramamoorthy",
  //     name: "Sarada Ramamoorthy",
  //     title: "Expert & Head Project Management & Corporate Social Responsibilities",
  //     desc: `Sarada Ramamoorthy is the Head, Project Management and Corporate Social Responsibility (CSR) at Centre for Development Research, Sustainability and Technical Advancement (C-DRAṢṬᾹ), Kolkata. She has handled secretarial & legal matters, Issue management, share registry administration and joint ventures. She actively participates in various social issues and is highly interested in adopting green practices in her lifestyle. She is a yoga enthusiast and has participated in State level yoga competitions and has received awards.`,
  //   },
  //   {
  //     img: advisor3,
  //     alt: "Sanjit Mitra",
  //     name: "Sanjit Mitra",
  //     title: "Project and Programme Coordinator / M.Sc. in Applied Psychology, University of Calcutta",
  //     desc: `Suchismita Mullick is responsible for overseeing the operations and management information system of C-DRASTA. She specialised in Industrial and Organisational Psychology and has survey and research experience in the field of Organisational Psychology and Health Economics. A very organised and perceptive person by nature she is fond of nature tourism, gardening, reading, history as well as current affairs.`,
  //   },
  //   {
  //     img: advisor4,
  //     alt: "Sanjit Mitra",
  //     name: "Sanjit Mitra",
  //     title: "Project and Programme Coordinator / M.Sc. in Applied Psychology, University of Calcutta",
  //     desc: `Suchismita Mullick is responsible for overseeing the operations and management information system of C-DRASTA. She specialised in Industrial and Organisational Psychology and has survey and research experience in the field of Organisational Psychology and Health Economics. A very organised and perceptive person by nature she is fond of nature tourism, gardening, reading, history as well as current affairs.`,
  //   },
  //   {
  //     img: advisor5,
  //     alt: "Arnab Dutta",
  //     name: "Arnab Dutta",
  //     title: "Project and Programme Associate / B.Com, Calcutta University",
  //     desc: `Arnab Dutta is responsible for providing managerial support for the day to day operations and various projects and programmes of C-DRASTA. He is a commerce graduate with experience in accounts and finance. A meticulous person by nature he is fond of gardening, reading and listening to music. He is a nature lover and has a keen interest in cooking.`,
  //   },
  //   {
  //     img: advisor6,
  //     alt: "Priyanka Saha",
  //     name: "Priyanka Saha",
  //     title: "(February 2020-March 2021) / M.A. in Bengali, University of Calcutta",
  //     desc: `M.A. in Bengali, University of Calcutta`,
  //   },
  //   {
  //     img: advisor7,
  //     alt: "Samarpita Paul",
  //     name: "Samarpita Paul",
  //     title: "Research Operations Co-ordinator (June 2018-January 2020)",
  //     desc: `M.A. in Bengali, University of Calcutta `,
  //   },
  //   {
  //     img: advisor8,
  //     alt: "Priya Roy Chowdhury",
  //     name: "Priya Roy Chowdhury",
  //     title: "Research Operations Co-ordinator",
  //     desc: `M.Com, Calcutta University`,
  //   },
  //   // Add more profiles here if needed
  // ];

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
   const fetchGallery = async () => {
    try {
      const response = await fetch(`${API}/api/v1/administration`);
      const data = await response.json();
      setData(data.admins|| []);
      console.log("Fetched Gallery Items:", data.admins);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    }
  };

    fetchGallery();
  }, []);

  return (
    <>
      <Header />
      <div
        className="h-14 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${legalBg})` }}
      ></div>
      {/* Content */}

      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl  text-black">
          Administration and Operations
          <span className="block h-[2px] w-80 bg-[#b2a65f] mt-1"></span>
        </h2>

        {/* Profile Grid */}
        {data.map((profile, idx) => (
          <div key={idx} className="grid md:grid-cols-5 gap-6 mt-8">
            {/* Image */}
            <div className="md:col-span-2 flex justify-center items-center">
              <img
                src={profile.image || expert8}
                alt={profile.name}
                className="w-[200px] h-[200px]  border-4 border-grey-200 shadow"
              />
            </div>

            {/* Text Content */}
            <div className="md:col-span-3 text-sm text-gray-800 leading-relaxed">
              <h3 className="text-xl font-semibold">{profile.name}</h3>
              <p className="font-medium mb-2">{profile.position}</p>
              <p>{profile.description}</p>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </>
  );
};
