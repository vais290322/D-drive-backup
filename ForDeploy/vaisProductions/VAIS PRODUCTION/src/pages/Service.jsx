import { motion } from "framer-motion";
import { ServicePoint1, ServicePoint2, ServicePoint3 } from "../assets";
import { Section } from "../components";

const services = [
  {
    title: "Event Planning Experts",
    description:
      "Memorable corporate conferences, product launches, and cultural programs tailored to your needs.",
    image: ServicePoint1,
  },
  {
    title: "BTL Marketing Solutions",
    description:
      "Experiential activations, roadshows, and in-store branding that connect your message with audiences.",
    image: ServicePoint2,
  },
  {
    title: "Creating engaging films, advertisements",
    description:
      "Documentaries with creativity & precision, High-Quality Film Production.",
    image: ServicePoint3,
  },
];

function Service() {
  return (
    <Section
      id="services"
      // className="mt-[100px] px-6 md:px-12 lg:px-20 mx-auto bg-red-300"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="flex items-center gap-3">
            <h1 className="h-[1px] w-24 bg-[#f73801] font-extralight"></h1>
            <h2 className="text-lg font-semibold text-gray-600">
              Our Services
            </h2>
          </div>
          <h1 className="text-[28px] md:text-4xl xl:text-5xl mt-5 text-[#393939] leading-snug">
            <span className="font-extralight">Seamless </span>
            <span className="font-medium">Production</span>{" "}
            <span className="text-[#f73801]">Memorable</span> Events
          </h1>
        </div>
        <div className="md:w-1/2">
          <p className="mt-4 text-gray-500">
            We specialize in high-quality films, events, and impactful BTL
            marketing solutions for your brand.
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mt-6 px-6 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition"
          >
            Learn More
          </motion.button>
        </div>
      </div>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-lg rounded-2xl overflow-hidden p-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: false }}
          >
            <motion.img
              src={service.image}
              alt={service.title}
              className="w-full h-64 object-cover rounded-lg"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <h3 className="text-xl font-semibold mt-4">{service.title}</h3>
            <p className="text-gray-500 mt-2 text-sm">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

export default Service;
