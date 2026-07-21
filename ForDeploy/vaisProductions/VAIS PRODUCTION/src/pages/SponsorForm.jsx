import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaCreditCard } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const goldPrice = import.meta.env.VITE_REACT_GOLD_PRICE;
const silverPrice = import.meta.env.VITE_REACT_SILVER_PRICE;
const bornzePrice = import.meta.env.VITE_REACT_BRONZ_PRICE;

const fadeInUp = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const price = [
  {
    level: "Gold Sponsor",
    desc: "Premium placement, large logo, media coverage",
    price: goldPrice,
  },
  {
    level: "Silver Sponsor",
    desc: "Standard placement, medium logo",
    price: silverPrice,
  },
  {
    level: "Bronze Sponsor",
    desc: "Logo on event materials only",
    price: bornzePrice,
  },
  {
    level: "Custom Sponsor Package",
    desc: "Contact us for details",
    price: " Custom",
  },
];

const baseUrl = import.meta.env.VITE_REACT_BASE_URL 
function SponsorForm({ onClose }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nameOrganization: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    boothSize: "",
    exhibitType: "",
    customExhibitType: "",
    setupNeeds: "",
    setupDetails: "",
    sponsorshipLevel: "",
    companyName: "",
    websiteSocialMedia: "",
    additionalNotes: "",
  });

  const [submissionState, setSubmissionState] = useState({
    submitting: false,
    submitted: false,
    error: null,
  });
  const [acknowledged, setAcknowledged] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionState({ submitting: true, submitted: false, error: null });

    if (formData.boothSize === "Custom" && formData.exhibitType === "Other") {
      formData.boothSize = formData.customBoothSize;
      formData.exhibitType = formData.customExhibitType;
    }
    const payload = {
      name: formData.nameOrganization,
      contact_person: formData.contactPerson,
      email: formData.email,
      phone_number: formData.phone,
      address: formData.address,
      booth_registration: {
        requested_size: formData.boothSize,
        exhibit_type: formData.exhibitType,
        additional_setup: formData.setupDetails,
      },
      sponsor_registration: {
        sponsorship_levels: formData.sponsorshipLevel,
        company_name: formData.companyName,
        website_links: formData.websiteSocialMedia,
        additional_note: formData.additionalNotes,
      },
    };

    try {
      const response = await fetch(
        `${baseUrl}/api/v1/sponsorship`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setSubmissionState({ submitting: false, submitted: true, error: null });
        setFormData({
          nameOrganization: "",
          contactPerson: "",
          email: "",
          phone: "",
          address: "",
          boothSize: "",
          exhibitType: "",
          customExhibitType: "",
          setupNeeds: "",
          setupDetails: "",
          sponsorshipLevel: "",
          companyName: "",
          websiteSocialMedia: "",
          additionalNotes: "",
          termConditions: false,
        });
        setAcknowledged(false);
        onClose(); // <-- move this after reset, or remove if you want to keep the form open
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      setSubmissionState({
        submitting: false,
        submitted: false,
        error: error.message || "An error occurred while submitting the form",
      });
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
      <div className="w-full min-h-screen flex flex-col ">
        <header className="w-full sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex items-center justify-center z-10">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-6 text-white hover:text-gray-200 flex items-center hover:scale-[1.04] transition-transform font-medium"
          >
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h2 className="text-2xl font-bold text-white text-center">
            Sponsorship Registration
          </h2>
        </header>
        <motion.div className="bg-gradient-to-br from-white to-gray-50 overflow-y-auto hide-scrollbar text-sm flex items-center justify-center py-4">
          <form onSubmit={handleSubmit} className="p-6 text-sm md:w-[80%]">
            {/* Basic Information */}
            <motion.div
              className="mb-10 bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
                <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  1
                </span>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-gray-700 font-medium">
                    Name / Organization
                  </label>
                  <input
                    type="text"
                    name="nameOrganization"
                    value={formData.nameOrganization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    required
                    placeholder="Enter organization name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-700 font-medium">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    required
                    placeholder="Contact person's name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-700 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-700 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    required
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
              <div className="mt-6 space-y-1">
                <label className="block text-gray-700 font-medium">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  required
                  placeholder="Full address with postal code"
                ></textarea>
              </div>
            </motion.div>

            {/* Exhibitor Booth Registration */}
            <motion.div
              className="mb-10 bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
                <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  2
                </span>
                Exhibitor Booth Registration
              </h3>
              <div className="space-y-6">
                <motion.div
                  className="pl-6 space-y-6 border-l-2 border-orange-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <label className="block text-gray-700 font-medium mb-3">
                      Booth Size Requested
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-400 cursor-pointer transition">
                        <input
                          type="radio"
                          name="boothSize"
                          value="Standard (10x10 ft)"
                          checked={formData.boothSize === "Standard (10x10 ft)"}
                          onChange={handleChange}
                          className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300"
                        />
                        <span className="ml-3">Standard (10x10 ft)</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-400 cursor-pointer transition">
                        <input
                          type="radio"
                          name="boothSize"
                          value="Large (20x20 ft)"
                          checked={formData.boothSize === "Large (20x20 ft)"}
                          onChange={handleChange}
                          className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300"
                        />
                        <span className="ml-3">Large (20x20 ft)</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-400 cursor-pointer transition">
                        <input
                          type="radio"
                          name="boothSize"
                          value="Custom"
                          checked={formData.boothSize === "Custom"}
                          onChange={handleChange}
                          className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300"
                        />
                        <span className="ml-3">Custom</span>
                        <input
                          type="text"
                          name="customBoothSize"
                          value={formData.customBoothSize}
                          onChange={handleChange}
                          className="ml-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 w-full"
                          disabled={formData.boothSize !== "Custom"}
                          placeholder="Specify size"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-3">
                      Type of Exhibit
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        "Dealership",
                        "Auto Accessories",
                        "Banker",
                        "Club / Community",
                        "Food & Beverage",
                      ].map((type) => (
                        <label
                          key={type}
                          className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-400 cursor-pointer transition"
                        >
                          <input
                            type="radio"
                            name="exhibitType"
                            value={type}
                            checked={formData.exhibitType === type}
                            onChange={handleChange}
                            className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300"
                          />
                          <span className="ml-3">{type}</span>
                        </label>
                      ))}
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-400 cursor-pointer transition">
                        <input
                          type="radio"
                          name="exhibitType"
                          value="Other"
                          checked={formData.exhibitType === "Other"}
                          onChange={handleChange}
                          className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300"
                        />
                        <span className="ml-3">Other</span>
                        <input
                          type="text"
                          name="customExhibitType"
                          value={formData.customExhibitType}
                          onChange={handleChange}
                          className="ml-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 w-full"
                          disabled={formData.exhibitType !== "Other"}
                          placeholder="Specify type"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-3">
                      Additional Setup Needs
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-400 cursor-pointer transition">
                        <input
                          type="radio"
                          name="setupNeeds"
                          value="Yes"
                          checked={formData.setupNeeds === "Yes"}
                          onChange={handleChange}
                          className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300"
                        />
                        <span className="ml-3">Yes</span>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-400 cursor-pointer transition">
                        <input
                          type="radio"
                          name="setupNeeds"
                          value="No"
                          checked={formData.setupNeeds === "No"}
                          onChange={handleChange}
                          className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300"
                        />
                        <span className="ml-3">No</span>
                      </label>
                    </div>
                    {formData.setupNeeds === "Yes" && (
                      <div className="mt-4 space-y-1">
                        <label className="block text-gray-700 font-medium">
                          Specify requirements
                        </label>
                        <textarea
                          name="setupDetails"
                          value={formData.setupDetails}
                          onChange={handleChange}
                          rows="2"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                          placeholder="Describe your electrical needs..."
                        ></textarea>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
            {/* Sponsor Registration */}
            <motion.div
              className="mb-10 bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
                <span className="bg-orange-100 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  3
                </span>
                Sponsor Registration
              </h3>
              <div className="space-y-6">
                <motion.div
                  className="pl-6 space-y-6 border-l-2 border-orange-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <label className="block text-gray-700 font-medium mb-3">
                      Sponsorship Levels
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {price.map((item) => (
                        <label
                          key={item.level}
                          className="block p-4 border border-gray-200 rounded-lg hover:border-orange-400 cursor-pointer transition"
                        >
                          <div className="flex items-start">
                            <input
                              type="radio"
                              name="sponsorshipLevel"
                              value={item.level}
                              checked={formData.sponsorshipLevel === item.level}
                              onChange={handleChange}
                              className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 mt-1"
                            />
                            <div className="ml-3">
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-900">
                                  {item.level}
                                </span>
                                <span className="text-orange-600 font-semibold">
                                  {item.price}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700 font-medium">
                      Company Name (for promotion)
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                      placeholder="As you'd like it to appear in promotions"
                    />
                  </div>
                  <div className="mt-6 space-y-6">
                    <div className="space-y-1">
                      <label className="block text-gray-700 font-medium">
                        Website / Social Media Handle
                      </label>
                      <input
                        type="text"
                        name="websiteSocialMedia"
                        value={formData.websiteSocialMedia}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                        placeholder="Enter website or social media handle link url"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-gray-700 font-medium">
                        Additional Notes or Requests
                      </label>
                      <textarea
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                        placeholder="Any additional information or special requests..."
                      ></textarea>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            {/* Terms and Conditions */}
            <div className="font-semibold space-y-6">
              <AnimatePresence>
                {acknowledged && (
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="flex items-center space-x-3">
                      <FaCreditCard className="h-6 w-6 text-orange-600" />
                      <h2 className="text-lg font-semibold text-gray-800">
                        Payment Terms &amp; Conditions
                      </h2>
                    </div>

                    <ol className="list-decimal list-inside space-y-2 text-gray-700 pl-8">
                      <li>
                        <strong>50% advance payment</strong> is required upon
                        registration confirmation.
                      </li>
                      <li>
                        The remaining <strong>50%</strong> must be paid at least{" "}
                        <strong>1 day before</strong> the event.
                      </li>
                      <li>
                        Payments can be made via:
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                          <li>
                            <strong>Bank Transfer:</strong> [Insert Bank
                            Details]
                          </li>
                          <li>
                            <strong>UPI/QR Code:</strong> [Insert UPI ID or
                            attach QR Code]
                          </li>
                          <li>
                            <strong>Cash/Cheque:</strong> To be submitted at
                            [Insert Office/Contact Info]
                          </li>
                        </ul>
                      </li>
                      <li>
                        Late payments may result in{" "}
                        <strong>cancellation</strong> of booth or sponsorship
                        placement.
                      </li>
                      <li>
                        No refunds will be issued for cancellations made within{" "}
                        <strong>5 days</strong> of the event.
                      </li>
                    </ol>

                    <p className="pl-8">Payment Acknowledgement:</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-2 mb-3"
              >
                <input
                  type="checkbox"
                  id="terms"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      termConditions: e.target.checked,
                    })
                  }
                  className="mt-1 h-5 w-5 text-blue-600"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I understand and agree to the{" "}
                </label>
                <span
                  onClick={() => setAcknowledged((v) => !v)}
                  className="underline cursor-pointer text-blue-600"
                >
                  payment terms and conditions.
                </span>
              </motion.div>
            </div>
            {/* Form Actions */}
            <motion.div
              className="flex justify-end pt-6 border-t border-gray-200"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <button
                type="submit"
                disabled={
                  submissionState.submitting || !formData.termConditions // <-- disable if not checked
                }
                className={`md:px-8 md:text-xl hover:scale-[1.04] py-3 px-2  rounded-lg transition font-medium flex items-center shadow-md hover:shadow-lg ${
                  submissionState.submitting || !formData.termConditions
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 cursor-pointer"
                }`}
              >
                {submissionState.submitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>Submit</>
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
      {/* </motion.div> */}
    </>
  );
}
export default SponsorForm;
