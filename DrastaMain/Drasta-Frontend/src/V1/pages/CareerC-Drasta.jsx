import React from "react";
import legalBg from "../assets/v1-footerimage.jpg";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
export const CareerSection = () => {
  return (
    <>
      <Header />
      <div
        className="h-14 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${legalBg})` }}
      ></div>
      <div className="max-w-6xl mx-auto px-4 py-8 text-gray-800">
        <h2 className="text-2xl md:text-3xl  mb-2 inline-block">
          Career at C-Drasta
        </h2>
        <hr className="w-24 border-t-2 border-[#c0c09e] mb-6" />

        {/* Apply for a Position */}
        <p className="italic font-medium mb-2">Apply for a Position</p>
        <p className="mb-4 text-sm md:text-base">
          C-DRASTĀ offers a dynamic platform for participation in live projects
          to aspiring young researchers. It welcomes candidates with a
          background in Economics, Statistics, Sociology, Computer Science,
          Psychology and Management Studies for research career in the following
          positions.
        </p>

        <ol className="list-decimal ml-6 space-y-2 text-sm md:text-base">
          <li>
            <strong>Research Assistant (RA)</strong>:{" "}
            <em>PG in any of the above disciplines can apply.</em>
          </li>
          <li>
            <strong>Project Linked Personnel (PLP)</strong>:{" "}
            <em>
              PG or UG in any of the above disciplines with good communication
              skills can apply.
            </em>
          </li>
          <li>
            <strong>Research Intern (RI)</strong>:{" "}
            <em>Students enrolled in PG and UG program may apply.</em>
          </li>
          <li>
            <strong>Research Operations Coordinator (ROC)</strong>:{" "}
            <em>
              PG or UG in any of the above disciplines can apply (Applicants
              from Commerce or Management Studies with exposure to Research
              Methods and Statistics will be given preference)
            </em>
          </li>
        </ol>

        {/* Apply for a Grant */}
        <p className="italic font-medium mt-8 mb-2">
          Apply for a Research Grant
        </p>
        <p className="mb-4 text-sm md:text-base">
          C-DRASTĀ offers an opportunity to students (including UG) and academic
          professionals and researchers from any discipline to come forward with
          innovative research proposals (based on primary or secondary data) in
          any area related to socio-economic development and sustainability.
        </p>

        <p className="mb-4 text-sm md:text-base">
          Request for proposal must include three sections: (a){" "}
          <strong>Technical Proposal</strong> specifying the study objective and
          research idea (<strong>300</strong> words), a brief review of
          literature (<strong>150</strong> words) and significance of the study
          (<strong>150</strong> words) (b) <strong>Financial Proposal</strong>{" "}
          or Budget (c) <strong>Time Budget</strong>.
        </p>

        <p className="text-sm md:text-base">
          Email your applications for a position or research grant with full CV
          to:{" "}
          <a
            href="mailto:drasta.org@gmail.com"
            className="font-semibold text-gray-700 underline hover:text-blue-600"
          >
            drasta.org@gmail.com
          </a>
        </p>
      </div>
      <Footer/>
    </>
  );
};
