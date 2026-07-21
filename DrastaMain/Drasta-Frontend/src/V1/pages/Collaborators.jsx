import React from "react";
import expert1 from "../assets/rajlaxmi.jpg";
import expert2 from "../assets/R-Sarada.jpg";
import expert3 from "../assets/sanjit.jpg";
import expert4 from "../assets/AGD-1.jpg";
import expert5 from "../assets/profile-pic.jpg";
import expert6 from "../assets/Ruchira-Bhattamishra.jpg";
import expert7 from "../assets/profile-pic.jpg";
import expert8 from "../assets/profile-pic.jpg";
import expert9 from "../assets/Sudip-Ratan-Chandra.jpg";
import expert10 from "../assets/Sahana-Roy-Chowdhry-1.jpg";
import expert11 from "../assets/a.jpg";
import expert12 from "../assets/sourav.jpg";
import expert13 from "../assets/b.jpg";

import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";

// const experts = [
//   {
//     name: "Dr. Rajlakshmi Mallik",
//     role: "Expert, President and Head, Research & Training",
//     expertise: `Green Living and Livelihood Awareness and Perception Studies, Sustainable Development and Climate Actions, Financial Inclusion, Microeconomics Theory, Applications of Principles of Microeconomics to Business Decision Making, Financial Structuring and Budgeting, CAPM`,
//     image: expert1,
//   },
//   {
//     name: "Smt. Sarada Ramamoorthy",
//     role: "Expert & Head, Project Management & ESG",
//     expertise: `CSR compliance, Need Analysis and Impact Assessment, Financial Inclusion, Corporate Governance, Legal Compliance and Company Law`,
//     image: expert2,
//   },
//   {
//     name: "Sri Sanjit Mitra",
//     role: "Expert & Head, Finance & Community Project Implementation",
//     expertise: `Accounts Management, Liasoning and Collaboration, Field Coordination, Team Management and Institutional Building`,
//     image: expert3,
//   },
//   {
//     name: "Dr. Ananya Ghosh Dastidar",
//     role: "Expert & Member, Review Panel, Young Researchers’ Column",
//     expertise: `International Economics, Macro Economics, Econometric Methodology`,
//     image: expert4,
//   },
//   {
//     name: "Dr. Pravat Kumar Mohanty",
//     role: "Expert",
//     expertise: `Business Administration, Human Resource Management`,
//     image: expert5,
//   },
//   {
//     name: "Dr. Ruchira Bhattamishra ",
//     role: "Expert",
//     expertise: `Data Science, Risk Analytics, Applied Machine Learning, Natural Language Processing`,
//     image: expert6,
//   },
//   {
//     name: "Sri. Tipti Kumar Paik",
//     role: "Expert, Drasta-Avalokan",
//     expertise: ` Rural Development, Tribal Development, NGO, Banks`,
//     image: expert7,
//   },
//   {
//     name: "Dr. Mukul Mitra",
//     role: "Expert",
//     expertise: `Financial Management, Human Resource Management, Banking`,
//     image: expert8,
//   },
//   {
//     name: "Sri. Sudip Ratan Chandra",
//     role: "Expert",
//     expertise: `Data Science, Risk Analytics, Applied Machine Learning, Natural Language Processing`,
//     image: expert9,
//   },
//   {
//     name: "Dr. Sahana Roy Chowdhry",
//     role: "Expert & Member, Drasta-Avalokan",
//     expertise: `Development Economics, Labour Economics, Fiscal Policy Issues, Public Finance`,
//     image: expert10,
//   },
//   {
//     name: "Dr. Chandralekha Basu(Ghosh)",
//     role: "Expert, & Member, Editorial Board, Drasta-Avalokan",
//     expertise: `Develpoment Economics, Econometric tools`,
//     image: expert11,
//   },
//   {
//     name: "Sri. Saurav Sarkar",
//     role: "Expert",
//     expertise: `Macro Economics, Finance and Financial Markets`,
//     image: expert12,
//   },
//   {
//     name: "Dr. A Dhara",
//     role: "Expert, & Member, Editorial Board, Drasta-Avalokan",
//     expertise: `Expert, & Member, Editorial Board, Drasta-Avalokan`,
//     image: expert13,
//   },
// ];
const API= import.meta.env.VITE_OLD_API_URL;
const Collaborators = () => {

  const [experts, setExperts] = React.useState([]);

  React.useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await fetch(`${API}/api/v1/experts`);
        const data = await response.json();
        setExperts(data?.experts || []); // Ensure data is in the expected format
        console.log("Fetched Experts:", data?.experts);
      } catch (error) {
        console.error("Error fetching experts:", error);
      }
    }
    fetchExperts();

  }, []);
  return (
    <>
      <Header />

      <div
        className="h-14 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${legalBg})` }}
      ></div>
      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl  text-black relative inline-block">
          Experts and Collaborators
          <span className="block h-[2px] w-64 bg-[#b2a65f] mt-1"></span>
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base text-gray-700 mt-4 mb-8 max-w-5xl">
          Team C-DRASTA consists of core group of senior researchers from
          multidisciplinary base to give direction to research at C-DRASTA. To
          strengthen the quality of research C-DRASTA seeks the expertise of
          independent professionals and undertakes collaborative research. The
          panel of Research Consultants and Collaborators comprises experienced
          professionals from various domains.
        </p>

        {/* Profiles */}
        <div className="grid md:grid-cols-2 gap-8">
          {experts.map((expert, index) => (
            <div key={index} className="flex gap-6 items-start">
              <img
                src={expert.image || expert8}
                alt={expert.name}
                className="w-35 h-32 object-fill border-4 border-gray-200"
              />
              <div>
                <h3 className="text-lg font-semibold mb-1">{expert.name}</h3>
                <p className="text-sm text-black font-medium mb-1">
                  {expert?.title}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Expertise:</span>{" "}
                  {expert?.expertise}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Collaborators;
