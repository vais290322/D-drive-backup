import React, { useState, useEffect } from "react";
import Group13 from "../../../../assets/Home_images/home page/Group 13.png";
import Linked_service from "../../../../assets/Home_images/home page/linked_services(1).png";
import Ellips1 from "../../../../assets/Home_images/home page/Ellipse 5.png";
import Ellips2 from "../../../../assets/Home_images/home page/Ellipse5(3).jpg";
import Ellips3 from "../../../../assets/Home_images/home page/Ellipse5(2).jpg";
import { motion } from "framer-motion";

const cards = [
  {
    id: 1,
    quate: "“",
    title: "Exceptional Service & Reliability!",
    description: `MNS Secure Solutions has been a game-changer for our
                  business. Their security and housekeeping services are
                  top-notch, ensuring a safe and clean environment at all
                  times.`,
    image: Ellips1,
    imageTitle: "Priya S",
    imageDescription: "Facility Manager",
  },
  {
    id: 2,
    quate: "“",
    title: "Trustworthy & Professional Team!",
    description: `Their security guards are well-trained, and their 
    maintenance team is highly efficient. We’ve never had to worry 
    about safety or upkeep since partnering with them.`,
    image: Ellips2,
    imageTitle: "Rahul M",
    imageDescription: "Business Owner",
  },
  {
    id: 3,
    quate: "“",
    title: "Seamless & Hassle-Free Solutions!",
    description: `From payroll management to facility maintenance, they handle everything 
    with professionalism. Their dedication to quality service is truly commendable.`,
    image: Ellips3,
    imageTitle: "Amit K",
    imageDescription: "HR Manager",
  },
];

function TrustedByBusiness() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % cards.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-[620px] w-full flex flex-col lg:flex-row items-center justify-center bg-cover my-16 lg:my-32 px-6 md:px-16 lg:px-32 gap-10 text-white"
      style={{ backgroundImage: `url(${Group13})` }}
    >
      {/* Left Section */}
      <div className="flex flex-col w-full lg:w-1/2 pt-10 md:pt-0 text-center lg:text-left">
        <img
          src={Linked_service}
          alt="Linked Service"
          className="h-8 w-8 mx-auto lg:mx-0"
        />
        <p className="mt-7 font-unna text-3xl md:text-[49px] flex flex-col pt-5">
          <span className="font-semibold text-[#fff7ed]">
            Trusted by Businesses,
          </span>
          <span className="mt-[5px] md:mt-[15px] font-extralight text-2xl md:text-[46px] text-[#BFD7EA]">
            Driven by Excellence
          </span>
        </p>
        <p className="mt-6 md:mt-12 text-[15px] text-[#BFD7EA] lg:pr-24">
          At MNS Secure Solutions, we take pride in delivering reliable
          security, maintenance, and housekeeping services that our clients
          trust. Our commitment to quality, professionalism, and customer
          satisfaction has earned us long-term partnerships with businesses
          across various industries.
        </p>
      </div>

      {/* Right Section */}
      <div className="relative w-full lg:w-1/2 h-auto md:h-[350px] border-2 mb-10 md:mb-0 lg:mb-0 rounded-2xl border-blue-700 flex items-center justify-center overflow-hidden p-4">
        <div className="h-full w-full flex flex-col items-center justify-center rounded-2xl">
          {cards.map((card, i) =>
            i === index ? (
              <motion.div
                key={card.id}
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative border-none py-10 px-6 flex flex-col gap-2">
                  <span className="text-3xl text-blue-400">{card?.quate}</span>
                  <h2 className="text-xl md:text-2xl font-ubuntu text-[#BFD7EA]">
                    {card?.title}
                  </h2>
                  <p className="mt-2 italic text-[#BFD7EB] md:pr-12">
                    {card.description}
                  </p>

                  <div className="mt-4 flex items-center justify-start md:justify-start space-x-3">
                    <img
                      src={card?.image}
                      alt={card?.imageTitle}
                      className="w-12 h-12 bg-cover rounded-full border-2 border-blue-400"
                    />
                    <div>
                      <p className="text-sm font-semibold">
                        {card?.imageTitle}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {card?.imageDescription}
                      </p>
                    </div>
                  </div>

                  <div className="absolute inset-0 opacity-30"></div>
                </div>
              </motion.div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

export default TrustedByBusiness;
