import React from "react";
import { useNavigate } from "react-router-dom";
import Group11 from "../../../../assets/Home_images/home page/Group 11.png";
import Button from "../../Others/Button";

function DiscoverTheDifference() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/contact"); // Navigate to the Contact page
  };

  return (
    <div
      className="relative bg-cover bg-center m-4 md:m-16 h-[580px] rounded-3xl flex items-center justify-center text-center px-4 md:px-6"
      style={{ backgroundImage: `url(${Group11})` }}
    >
      <div className="relative max-w-3xl text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold">
          Discover the Difference with
          <span className="block font-bold text-white">MNS Secure Solutions</span>
        </h1>
        <p className="mt-6 md:mt-10 mb-6 md:mb-10 text-base sm:text-lg">
          Want to learn more about how our security, housekeeping, and maintenance services can benefit your business?
          We’re here to answer your questions and provide tailored solutions to meet your specific needs. Connect with us
          today to explore our comprehensive services and see how we can help create a safer, cleaner, and well-maintained
          environment for you.
        </p>
        <Button title="Get In Touch →" onClick={handleNavigate} />
      </div>
    </div>
  );
}

export default DiscoverTheDifference;
