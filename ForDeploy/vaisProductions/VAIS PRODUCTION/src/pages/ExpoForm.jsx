import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaRegCommentDots,
  FaPaperPlane,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const baseUrl = import.meta.env.VITE_REACT_BASE_URL 
function ExpoForm({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [interestedIn, setInterestedIn] = useState("");
  const [formData, setFormData] = useState({
    dealer_name: "",
    brand_name: "",
    interested_in: "",
    interested_in_other: "",
    user_email: "",
    user_phone: "",
    user_address: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "interested_in") setInterestedIn(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Build payload
    const payload = {
      email: formData.user_email,
      dealer_name: formData.dealer_name,
      brand_name: formData.brand_name,
      interested_in:
        formData.interested_in === "Other"
          ? formData.interested_in_other
          : formData.interested_in,
      phone_number: formData.user_phone,
      message: formData.message,
    };

    try {
      const response = await fetch(`${baseUrl}/api/v1/shout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setLoading(false);
      if (response.ok) {
        setSuccess(true);
        setFormData({
          dealer_name: "",
          brand_name: "",
          interested_in: "",
          interested_in_other: "",
          user_email: "",
          user_phone: "",
          user_address: "",
          message: "",
        });
        setInterestedIn("");
        setTimeout(() => {
          setSuccess(false);
          if (onClose) onClose();
        }, 2000);
      } else {
        alert("Failed to send message, please try again.");
      }
    } catch (error) {
      setLoading(false);
      alert("Failed to send message, please try again.");
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <FaCheckCircle className="text-green-500 text-5xl mb-4 animate-bounce" />
              <div className="text-xl font-semibold text-gray-800 mb-2 text-center">
                Message Sent Successfully!
              </div>
              <div className="text-gray-600 text-center">
                Thank you for contacting us.<br />We will reach out to you soon.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-blue-100 via-white to-purple-100 p-3 sm:p-6 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg mx-auto"
        style={{
          marginLeft: 10,
          marginRight: 10,
          filter: success ? "blur(2px)" : "none",
          pointerEvents: success ? "none" : "auto",
        }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="flex justify-end">
          <button
            className="text-2xl text-gray-600 hover:text-black z-10 mt-2 mr-2 sm:mt-0 sm:mr-0"
            onClick={onClose}
            aria-label="Close"
            type="button"
            style={{ lineHeight: 1 }}
          >
            &times;
          </button>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-purple-700 mb-4 sm:mb-6 tracking-wide col-span-2">
          <FaRegCommentDots className="inline-block mr-2 text-purple-500" />
          Give Us a Shout!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-xs sm:text-sm" htmlFor="dealer_name">
              Dealer Name
            </label>
            <div className="flex items-center bg-white rounded-lg shadow-sm px-2 py-1.5 sm:px-3 sm:py-2">
              <FaUser className="text-blue-400 mr-2 text-base" />
              <input
                type="text"
                name="dealer_name"
                id="dealer_name"
                required
                className="w-full outline-none bg-transparent text-gray-800 text-xs sm:text-sm"
                placeholder="Your Name"
                value={formData.dealer_name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-xs sm:text-sm" htmlFor="brand_name">
              Brand Name
            </label>
            <div className="flex items-center bg-white rounded-lg shadow-sm px-2 py-1.5 sm:px-3 sm:py-2">
              <FaUser className="text-blue-400 mr-2 text-base" />
              <input
                type="text"
                name="brand_name"
                id="brand_name"
                required
                className="w-full outline-none bg-transparent text-gray-800 text-xs sm:text-sm"
                placeholder="Your Brand Name"
                value={formData.brand_name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-xs sm:text-sm" htmlFor="interested_in">
              Interested In
            </label>
            <div className="flex items-center bg-white rounded-lg shadow-sm px-2 py-1.5 sm:px-3 sm:py-2">
              <select
                name="interested_in"
                id="interested_in"
                required
                className="w-full outline-none bg-transparent text-gray-800 text-xs sm:text-sm"
                value={formData.interested_in}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="2wheeler">Stall Booking 10/10 2 Wheeler</option>
                <option value="4wheeler">Stall Booking 10/10 4 Wheeler</option>
                <option value="bankerDesk">Banker Desk</option>
                <option value="sponcer">Sponcer Counter</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          {formData.interested_in === "Other" && (
            <div className="animate-fade-in">
              <label className="block text-gray-700 font-semibold mb-1 text-xs sm:text-sm" htmlFor="interested_in_other">
                Please specify
              </label>
              <div className="flex items-center bg-white rounded-lg shadow-sm px-2 py-1.5 sm:px-3 sm:py-2">
                <input
                  type="text"
                  name="interested_in_other"
                  id="interested_in_other"
                  required={formData.interested_in === "Other"}
                  className="w-full outline-none bg-transparent text-gray-800 text-xs sm:text-sm"
                  placeholder="Your interest"
                  value={formData.interested_in_other}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-xs sm:text-sm" htmlFor="user_email">
              Email
            </label>
            <div className="flex items-center bg-white rounded-lg shadow-sm px-2 py-1.5 sm:px-3 sm:py-2">
              <FaEnvelope className="text-blue-400 mr-2 text-base" />
              <input
                type="email"
                name="user_email"
                id="user_email"
                required
                className="w-full outline-none bg-transparent text-gray-800 text-xs sm:text-sm"
                placeholder="your@email.com"
                value={formData.user_email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-xs sm:text-sm" htmlFor="user_phone">
              Phone Number
            </label>
            <div className="flex items-center bg-white rounded-lg shadow-sm px-2 py-1.5 sm:px-3 sm:py-2">
              <FaPhoneAlt className="text-blue-400 mr-2 text-base" />
              <input
                type="tel"
                name="user_phone"
                id="user_phone"
                required
                pattern="[0-9]{10,15}"
                className="w-full outline-none bg-transparent text-gray-800 text-xs sm:text-sm"
                placeholder="Your Phone Number"
                value={formData.user_phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1 text-xs sm:text-sm" htmlFor="user_address">
              Address
            </label>
            <div className="flex items-center bg-white rounded-lg shadow-sm px-2 py-1.5 sm:px-3 sm:py-2">
              <FaMapMarkerAlt className="text-blue-400 mr-2 text-base" />
              <input
                type="text"
                name="user_address"
                id="user_address"
                required
                className="w-full outline-none bg-transparent text-gray-800 text-xs sm:text-sm"
                placeholder="Your Address"
                value={formData.user_address}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1 text-xs sm:text-sm" htmlFor="message">
              Message
            </label>
            <div className="flex items-start bg-white rounded-lg shadow-sm px-2 py-1.5 sm:px-3 sm:py-2">
              <FaRegCommentDots className="text-blue-400 mr-2 mt-1 text-base" />
              <textarea
                name="message"
                id="message"
                required
                className="w-full outline-none bg-transparent text-gray-800 text-xs sm:text-sm resize-none"
                placeholder="Type your message..."
                rows={3}
                value={formData.message}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <motion.button
          type="submit"
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-2 rounded-lg shadow-lg hover:scale-105 hover:from-blue-500 hover:to-purple-500 transition-all duration-200 active:scale-95 disabled:opacity-60 text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full border-2 border-white border-t-transparent h-4 w-4"></span>
              Sending...
            </span>
          ) : (
            <>
              <FaPaperPlane className="text-base" />
              Send
            </>
          )}
        </motion.button>
      </motion.form>
    </div>
  );
}

export default ExpoForm;