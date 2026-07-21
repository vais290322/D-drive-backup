import { motion } from "framer-motion";
import {
    BusinessNetworking,
    Certificate,
    ColleaguesDiscuss,
    WomanInWorkflow
} from "@/V2/assets";


const whatYouGet = [
  { img: Certificate, text: "Certificate of Appreciation" },
  { img: ColleaguesDiscuss, text: "Real-World Experience" },
  { img: WomanInWorkflow, text: "Skill Development" },
  { img: BusinessNetworking, text: "Skill Development" },
];

export function WhatYouGetSection() {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="w-full py-10 px-4 sm:px-8 md:px-24 space-y-8">
      <h1 className="text-[30px] font-bold text-center md:text-left">
        What You’ll Get as a Volunteer
      </h1>

      <motion.div
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {whatYouGet.map((data, i) => (
          <motion.div
            key={data.id ?? i}
            className="space-y-4 flex flex-col items-center"
            variants={item}
          >
            <img
              src={data.img}
              alt={data.text}
              className="h-[150px] w-[150px] sm:h-[180px] sm:w-[180px] md:h-[200px] md:w-[200px] object-cover"
            />
            <h1 className="text-[24px] text-center">{data.text}</h1>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
