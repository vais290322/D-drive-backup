import React from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";
import advisor1 from "../assets/A-Dhara-Member.jpg";
import advisor2 from "../assets/Abhinandan-Sinha.jpg";
import advisor3 from "../assets/Arun-Prasad-Mallik.jpg";
import advisor4 from "../assets/sourav.jpg";


export const GovernanceAndAdvisoryTrustees = () => {
  // Array of trustees
  const trustees = [
    {
      img: advisor3,
      name: "Sri. Arun Prasad Mallik, Chairperson",
      desc: "Arun Prasad Mallik has extensive experience in the pharmaceutical industry with Alembic Chemicals as a management professional. He is currently active with various philanthropic organizations and is the founding trustee of Sree Sree Radha Rani Trust, a charitable organization."
    },
    {
      img: advisor2,
      name: "Sri. Abhinandan Sinha, Secretary Cum Treasurer",
      desc: "Abhinandan Sinha, an alumnus of Indian Statistical Institute (ISI), Kolkata, is a researcher in development economics and political economy.An avid reader and keen debater he is interested in developing linkages between governance and socio-economic development through debate, discussion and popular writing."
    },
    {
      img: advisor1,
      name: "Dr. A. Dhara, Member",
      desc: "Aparajita Dhara is an academic with graduate and post-graduate teaching, research and field experience in both rural and urban Bengal with the Ministry of Social Justice and Empowerment and with the National Sample Survey Office, Government of India."
    },
    {
      img: advisor4,
      name: "Sri. Saurav Sarkar, Member",
      desc: "Saurav Sarkar is bureaucrat with the Department of Revenue, Ministry of Finance, Government of India, Kolkata. He is actively committed to promoting education among the economically distressed. He has background in Economics and special interest in research related to Finance and Financial Markets."
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-[49.6vh] bg-white">
        {/* Top Pattern Strip */}
        <div
          className="h-14 bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: `url(${legalBg})` }}
        ></div>

        {/* Content */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl  text-black relative inline-block">
            Trustees
            <span className="block h-[2px] w-16 bg-[#b2a65f] mt-1 "></span>
          </h2>

          <p className="text-sm md:text-base text-gray-700 mb-8 max-w-4xl">
            The Board of Trustees, custodian of C-DRASTA’s values and mission,
            consists of representatives from different walks of life, including
            industry, academia, government and research. Are unified by
            commitment to research and training for socio-economic development
            and philanthropic causes.
          </p>

          {/* Trustee Block */}
          {trustees.map((trustee, idx) => (
            <div key={idx} className="grid md:grid-cols-4 gap-6 items-start mb-3 mt-3">
              {/* Image */}
              <div className="md:col-span-1">
                <img
                  src={trustee.img}
                  alt={trustee.name}
                  className="border-4 border-gray-300 shadow w-[200px] h-[200px] object-cover"
                />
              </div>
              {/* Text Content */}
              <div className="md:col-span-3">
                <h3 className="text-xl font-semibold mb-4 mt-2">
                  {trustee.name}
                </h3>
                <p className="text-sm md:text-base text-gray-700">
                  {trustee.desc}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>
      <Footer />
    </>
  );
};
