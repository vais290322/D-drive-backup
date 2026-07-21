import { Mail, Phone, MapPin } from "lucide-react";
import footerImage from "../assets/bamboo.jpg";
import { LuSend } from "react-icons/lu";
import { FaPhoneSquareAlt } from "react-icons/fa";
import drastra from "../assets/drastra.png";
const Footer = () => {
  return (
    <footer
      style={{
        backgroundImage: `url(${footerImage})`,
        backgroundPosition: "top center",
      }}
      className="bg-[#1b7221f7] bg-cover bg-center bg-blend-multiply text-white py-12 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex justify-center">
        <img src={drastra} alt="Logo" className="w-20 h-20 mb-5 align-middle" />
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Column 1 */}
        <div>
          <h3 className="text-yellow-400 font-bold text-base sm:text-lg mb-4 footer">
            Career at C-DRASTA
          </h3>
          <ul className="space-y-2 leading-6 font-bold">
            <li><i>■ Apply for a Position</i></li>
            <li><i>■ Research Assistant</i></li>
            <li><i>■ Student Internship</i></li>
            <li><i>■ Student Research Grants</i></li>
            <li><i>■ Young Researcher's Column</i></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-yellow-400 font-bold text-base sm:text-lg mb-4 footer">
            Need Assistance?
          </h3>
          <ul className="space-y-2 leading-6 font-bold">
            <li><i>■ Field Surveys</i></li>
            <li><i>■ Survey for Quantitative Studies</i></li>
            <li><i>■ Survey for Qualitative Studies</i></li>
            <li><i>■ Personal & Telephonic Interview</i></li>
            <li><i>■ Web Based Survey</i></li>
            <li><i>■ Focus Group Discussion</i></li>
            <li><i>■ Depth Interview</i></li>
            <li><i>■ Observation Studies</i></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-yellow-400 font-bold text-base sm:text-lg mb-4 footer">
            Area of Expertise
          </h3>
          <ul className="space-y-2 leading-6 font-bold">
            <li><i>■ Corporate Social Responsibility</i></li>
            <li><i>■ Competency Enhancing Workshop</i></li>
            <li><i>■ Evaluation Studies</i></li>
            <li><i>■ Thrust Area Programme</i></li>
            <li><i>■ Perception Studies</i></li>
            <li><i>■ Exploratory Studies</i></li>
            <li><i>■ Multivariate Analysis</i></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-yellow-400 font-bold text-base sm:text-lg mb-4 footer">
            Get In Touch
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3 font-bold">
              <LuSend className="w-5 h-5 mt-1 shrink-0" />
              <span className="leading-snug">
                <strong>City Office:</strong>
                <br />
                <i> Gopal Bhawan, 42, Vidyasagar Street, Kolkata-700009 </i>
              </span>
            </li>
            <li className="flex items-start gap-3 font-bold">
              <LuSend className="w-5 h-5 mt-1 shrink-0" />
              <span className="leading-snug">
                <strong>Registered Office:</strong>
                <br />
                <i>  A/2/5, Pearl Apartment, 50b, Kailash Bose Street, Kolkata-700006 </i>
              </span>
            </li>
            <li className="flex items-start gap-3 font-bold">
              <Mail className="w-5 h-5 mt-1 shrink-0" />
              <span className="break-words leading-snug">
              <i>  info@drasta.org / director@drasta.org </i>
              </span>
            </li>
            <li className="flex items-start gap-3 font-bold">
              <FaPhoneSquareAlt className="w-5 h-5 mt-1 shrink-0" />
              <span><i>+91 9831792150</i></span>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-8 text-xs text-white px-4 sm:px-0 font-bold">
        © Copyright 2015 — 2025 | Drasta | All Rights Reserved | Powered by{" "}
        <a href="https://www.vais.co.in/" className="text-white underline">
          VAIS Engineering Private Limited
        </a>
      </div>
    </footer>
  );
};

export default Footer;
