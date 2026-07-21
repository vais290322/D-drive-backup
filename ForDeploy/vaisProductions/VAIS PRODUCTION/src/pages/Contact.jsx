import { motion } from "framer-motion";
import { useState } from "react";
import { ContactImg } from "../assets";

function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    let errors = {};

    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }
    if (!message.trim()) errors.message = "Message is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("https://formspree.io/f/xdkzgbvb", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(e.target),
        });
        if (response.ok) {
          setSuccess(true);
          setFirstName("");
          setLastName("");
          setPhone("");
          setEmail("");
          setMessage("");
          setErrors({});
          setTimeout(() => setSuccess(false), 3000);
        } else {
          alert("Failed to send. Please try again.");
        }
      } catch {
        alert("Failed to send. Please try again.");
      }
    }
  };

  const handleConsultantSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!firstName.trim()) validationErrors.firstName = "First name is required";
    if (!lastName.trim()) validationErrors.lastName = "Last name is required";
    if (!phone.trim()) {
      validationErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      validationErrors.phone = "Phone number must be exactly 10 digits";
    }
    if (!email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = "Invalid email format";
    }
    if (!message.trim()) validationErrors.message = "Message is required";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) return;

    // Build payload as required
    const payload = {
      name: `${firstName} ${lastName}`,
      phone,
      email,
      eventType: "Free Consultation",
      message,
    };

    try {
      const response = await fetch(
        "https://vais-production-backend.akshay-p.workers.dev/book-consultant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        setSuccess(true);
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setMessage("");
        setErrors({});
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Failed to send. Please try again.");
      }
    } catch {
      alert("Failed to send. Please try again.");
    }
  };

  return (
    <section id="contact" className="flex flex-col md:flex-row mt-[72px]">
      {/* Left Section */}
      <div className="w-full md:w-[60%] p-4 sm:p-6 md:p-10">
        <div className="flex items-center gap-3">
          <h1 className="h-[1px] w-12 sm:w-16 md:w-24 bg-[#f73801] font-extralight"></h1>
          <h3 className="text-base font-semibold text-gray-600 sm:text-lg md:text-xl">
            Contact Us
          </h3>
        </div>
        <h1 className="text-[28px] md:text-4xl xl:text-[50px] font-medium mt-4 sm:mt-5 md:mt-7 text-[#393939]">
          <span className="font-extralight">Free</span>{" "}
          <span className="text-black">Consultation</span>
        </h1>
        <p className="mt-4 sm:mt-5 md:mt-7 text-[16px] md:text-[18px] xl:text-[20px] text-[#555555]">
          We offer free consultations to help plan your perfect event with
          expert guidance and tailored solutions.
        </p>

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleConsultantSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <legend className="text-black text-sm sm:text-[18px]">
                First Name<span className="text-red-600">*</span>
              </legend>
              <input
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                className="w-full p-2 bg-transparent border-b border-gray-400 focus:outline-none"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div>
              <legend className="text-black text-sm sm:text-[18px]">
                Last Name<span className="text-red-600">*</span>
              </legend>
              <input
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                className="w-full p-2 bg-transparent border-b border-gray-400 focus:outline-none"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <legend className="text-black text-sm sm:text-[18px]">
                Phone No<span className="text-red-600">*</span>
              </legend>
              <input
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                className="w-full p-2 bg-transparent border-b border-gray-400 focus:outline-none"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
            <div>
              <legend className="text-black text-sm sm:text-[18px]">
                Email<span className="text-red-600">*</span>
              </legend>
              <input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full p-2 bg-transparent border-b border-gray-400 focus:outline-none"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <legend className="text-black text-sm sm:text-[18px]">
              How may I help you?<span className="text-red-600">*</span>
            </legend>
            <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 bg-transparent border-b border-gray-400 focus:outline-none"
            />
            {errors.message && (
              <p className="text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          <div className="flex justify-center pt-6 md:pt-12">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="border border-[#f73801] rounded-full px-6 py-3 hover:bg-[#f73801] hover:text-white transition"
            >
              Send Your Information
            </motion.button>
          </div>
          {success && (
            <div className="pt-4 text-center text-green-600">
              Thank you! Your message has been sent.
            </div>
          )}
        </form>
      </div>

      {/* Right Section */}
      <div
        className="w-full md:w-[40%] h-[700px] lg:h-[800px] bg-cover bg-center text-white flex flex-col justify-center p-4 sm:p-6 md:py-[152px] md:pl-[80px]"
        style={{ backgroundImage: `url(${ContactImg})` }}
      >
        <h2 className="text-[28px] md:text-4xl xl:text-[50px] font-medium text-white leading-tight">
          Visit <span className="text-[#fff7ed] font-extralight">Us Here</span>
        </h2>

        <div className="flex flex-col items-start gap-8 pt-10 text-sm sm:pt-12 md:pt-16">
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <p className="uppercase text-[18px] md:text-[22px] xl:text-[24px] font-semibold leading-snug">
              HEAD OFFICE ADDRESS
            </p>
            <p className="text-[16px] md:text-[18px] text-[#fff7ed] leading-snug">
              Deganga, Taki Road, North 24 PGS, 743423
            </p>
          </div>

          {/* <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <p className="uppercase text-[18px] md:text-[22px] xl:text-[24px] font-semibold leading-snug">
              CORPORATE OFFICE ADDRESS
            </p>
            <p className="text-[16px] md:text-[18px] text-[#fff7ed] leading-snug">
              2nd Floor, Flat No 2C, 151 Ajoy Nagar (Santoshpur), Kolkata - 75
            </p>
          </div> */}

          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <p className="uppercase text-[18px] md:text-[22px] xl:text-[24px] font-semibold leading-snug">
              PHONE
            </p>
            <p className="text-[16px] md:text-[18px] text-[#fff7ed]">
              +91 8343939495
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <p className="uppercase text-[18px] md:text-[22px] xl:text-[24px] font-semibold leading-snug">
              EMAIL
            </p>
            <p className="text-[16px] md:text-[18px] text-[#fff7ed]">
              info@vaisproductions.com
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <p className="uppercase text-[18px] md:text-[22px] xl:text-[24px] font-semibold leading-snug">
              WEBSITE
            </p>
            <p className="text-[16px] md:text-[18px] text-[#fff7ed]">
              www.vaisproductions.com
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
