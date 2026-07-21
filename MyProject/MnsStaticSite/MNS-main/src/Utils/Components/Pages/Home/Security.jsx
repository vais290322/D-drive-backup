import React from "react";
import Linked_Services2 from "../../../../assets/Home_images/home page/linked_services.png";
import Button from "../../Others/Button";
import Rectangle9 from "../../../../assets/Home_images/home page/Rectangle 8(1).png";
import Rectangle0 from "../../../../assets/Home_images/home page/Rectangle 8(2).png";
import Rectangle8 from "../../../../assets/Home_images/home page/Rectangle 8.jpg";

function Security() {
  const services = [
    {
      title: "Housekeeping Services:",
      subtitle: "Spotless Spaces, Healthier Environments",
      description:
        "Our expert housekeeping services ensure impeccable cleanliness and hygiene, creating a fresh & welcoming atmosphere for your facilities.",
      image: Rectangle8,
    },
    {
      title: "Guard Services:",
      subtitle: "Unwavering Security, Trusted Protection",
      description:
        "Our professional security guard services provide round-the-clock safety and protection for your premises, assets, and personnel.",
      image: Rectangle9,
    },
    {
      title: "Maintenance Services:",
      subtitle: "Keeping Your Facilities Running Smoothly",
      description:
        "Our reliable maintenance services ensure your facilities and equipment remain in top condition with regular upkeep, timely repairs, and preventive solutions.",
      image: Rectangle0,
    },
  ];

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col justify-start mt-20 px-6 md:px-16 lg:px-24 gap-6 md:gap-9 py-10">
        <img src={Linked_Services2} alt="no image" className="h-10 w-10" />
        <p className="font-unna text-3xl md:text-[42px] lg:text-[49px] flex flex-col">
          <span className="font-semibold text-[#232C33]">Excellence in Security &</span>
          <span className="mt-[5px] md:mt-[10px] lg:mt-[18px] font-extralight text-2xl md:text-[36px] lg:text-[49px] text-[#197BBD]">
            Workforce Solutions
          </span>
        </p>
        <p className="text-[14px] md:text-[16px] text-[#232C33] leading-relaxed">
          We offer comprehensive security, maintenance, and manpower solutions designed to keep your business running smoothly and securely.
          From trained security personnel ensuring protection to expert facility management and housekeeping services, we cover every aspect of
          operational efficiency. Our tailored approach ensures that each service meets your unique business needs with precision and professionalism.
        </p>
        <p className="text-[14px] md:text-[16px] text-[#232C33] mt-4 md:mt-6">
          With a commitment to quality and reliability, we help create a safe, well-maintained, and productive environment for your organization.
        </p>
        <div className="mt-4 md:mt-6">
          <Button title="Read More →" />
        </div>
      </div>

      {/* Services Section */}
      <div className="flex flex-wrap justify-center gap-6 px-6 md:px-10 lg:px-20 py-10">
        {services.map((service, index) => (
          <div
            key={index}
            className="relative w-full sm:w-[300px] md:w-[350px] lg:w-[390px] h-[500px] rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 bg-white bg-opacity-50 backdrop-blur-md p-6 rounded-t-2xl h-[35%]">
              <h3 className="text-lg md:text-[22px] font-bold text-[#232C33]">{service.title}</h3>
              <p className="text-sm md:text-[18px] opacity-90 text-white">{service.subtitle}</p>
              <p className="text-xs md:text-[12px] mt-2 opacity-80  text-[#232C33]">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Security;
