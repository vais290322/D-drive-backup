import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

const events = ["Wedding", "Conference", "Birthday", "Other"];
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function BookConsultant({ setIsOpen }) {
  const [eventType, setEventType] = useState("");
  const [customEvent, setCustomEvent] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!formData.name) validationErrors.name = "Name is required";
    if (!formData.phone) {
      validationErrors.phone = "Phone number is required";
    } else if (formData.phone.length < 10) {
      validationErrors.phone = "Invalid Phone number";
    }
    if (!formData.email) {
      validationErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      validationErrors.email = "Please enter a valid email address";
    }
    if (!eventType) {
      validationErrors.eventType = "Event type is required";
    } else if (eventType === "Other" && !customEvent) {
      validationErrors.customEvent = "Please specify the event type";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        // Build JSON payload
        const payload = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          eventType: eventType === "Other" ? customEvent : eventType,
          message: formData.message,
        };

        await fetch("https://vais-production-backend.akshay-p.workers.dev/book-consultant", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false);
      }
      toast.success("Form submitted successfully!");
      setIsOpen(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[1000] p-4 sm:p-6 md:p-8 lg:p-10 cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-lg p-6 sm:p-8 md:p-10 rounded-xl shadow-xl w-full max-w-md relative border border-white/20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button
          className="absolute top-3 right-3 text-white text-2xl hover:text-gray-300 transition"
          onClick={() => setIsOpen(false)}
        >
          <IoClose />
        </button>

        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Book Consultant
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border border-white/30 rounded-lg text-white placeholder:font-semibold  placeholder-white focus:outline-none"
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}

          <input
            type="number"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border border-white/30 rounded-lg text-white placeholder:font-semibold  placeholder-white  focus:outline-none"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm">{errors.phone}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border border-white/30 rounded-lg text-white placeholder:font-semibold  placeholder-white  focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}

          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full p-3 bg-transparent border border-white/30 rounded-lg cursor-pointer  font-semibold  text-white  focus:outline-none"
          >
            <option
              value=""
              className="text-white bg-transparent font-semibold"
            >
              Select Event Type
            </option>

            {events.map((event) => (
              <option
                key={event}
                value={event}
                className="text-orange-600 bg-transparent font-semibold"
              >
                {event}
              </option>
            ))}
          </select>

          {errors.eventType && (
            <p className="text-red-600 text-sm">{errors.eventType}</p>
          )}

          {eventType === "Other" && (
            <input
              type="text"
              name="customEvent"
              placeholder="Specify event"
              value={customEvent}
              onChange={(e) => setCustomEvent(e.target.value)}
              className="w-full p-3 bg-transparent border border-white/30 rounded-lg text-white placeholder:font-semibold  placeholder-white focus:outline-none"
            />
          )}
          {errors.customEvent && (
            <p className="text-red-600 text-sm">{errors.customEvent}</p>
          )}

          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border border-white/30 rounded-lg text-white placeholder:font-semibold  placeholder-white  focus:outline-none"
          ></textarea>

          <motion.button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Loading..." : "Submit"}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
