import { Rectangle34 } from "@/V2/assets";
import { donate1, donate2 } from "@/assets";
import { motion } from "framer-motion";
import { useState } from "react";

const presetAmounts = [25, 100, 500, 1000];

export const DonateSection = ({ landingPage = false }) => {
  const [donationAmount, setDonationAmount] = useState("10000");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("1000");

  const handlePresetClick = (amount) => {
    setSelectedPreset(amount.toString());
    setDonationAmount(amount.toString());
    setCustomAmount("");
  };

  const handleCustomAmount = () => {
    setSelectedPreset("custom");
    setDonationAmount(customAmount);
  };

  return (
    <section id="donate" className="relative px-6 py-18 text-[24px] font-bold">
      {/* Torn Borders using one image */}

      <div
        className={`relative grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto w-full rounded-xl overflow-hidden z-20 ${
          !landingPage ? "shadow-xl" : ""
        }`}
      >
        {/* border  */}
        {landingPage && (
          <>
            <img
              src={donate1}
              alt="Helping hands"
              className="absolute top-0 h-[5%]  w-full object-fit z-20"
            />
            <img
              src={donate1}
              alt="Helping hands"
              className="absolute bottom-0 h-[5%]  w-full object-fit z-20 rotate-180"
            />

            <img
              src={donate2}
              alt="Helping hands"
              className="absolute top-0 left-0  object-contain z-20"
            />
            <img
              src={donate2}
              alt="Helping hands"
              className="absolute top-0 right-0  object-contain z-20 rotate-180"
            />
          </>
        )}

        {/* Left side – Animated Image */}
        <motion.div
          className="relative overflow-hidden w-full h-full z-10 bg-transparent"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.img
            src={Rectangle34}
            alt="Helping hands"
            className="w-full h-full object-cover"
            animate={{
              scale: [1, 1, 1.05, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Right side – Donation Form */}
        <motion.div
          className="bg-[#D50D07] text-white p-8 lg:p-12 flex flex-col justify-center z-10"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-[40px] font-bold mb-8">Donate</h2>

          <form className="space-y-6 text-[24px]">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                className="text-[18px] w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="text-[18px] w-full px-4 py-3 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your email"
              />
            </div>

            {/* Donation Amount */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Donation Amount
              </label>
              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  type="text"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handlePresetClick(amt)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors text-black ${
                      selectedPreset === amt.toString()
                        ? "bg-yellow-400"
                        : "bg-white hover:bg-white/70"
                    }`}
                  >
                    {amt}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleCustomAmount}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors text-black ${
                    selectedPreset === "custom"
                      ? "bg-yellow-400"
                      : "bg-white hover:bg-white/70"
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer text-[24px] md:text-[36px] w-full py-3 bg-[#DAFFE6] text-black font-bold rounded-md hover:bg-[#d2ffe1] transition-colors"
            >
              Donate
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default DonateSection;
