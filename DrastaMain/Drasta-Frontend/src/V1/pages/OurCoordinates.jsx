import React, { useState } from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";

const API = import.meta.env.VITE_OLD_API_URL;

export const OurCoordinates = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    subject: "",
    enquiry: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/api/v1/contact-us`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Enquiry submitted successfully.");
        setFormData({
          name: "",
          email: "",
          contact: "",
          subject: "",
          enquiry: "",
        });
      } else {
        alert("Submission failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <>
      <Header />

      {/* Header Banner */}
      <div
        className="h-14 md:h-14 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${legalBg})` }}
      ></div>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl md:text-2xl inline-block mb-2">
          Our Coordinates
          <span className="block h-[2px] w-30 bg-[#b2a65f] mt-1 "></span>
        </h2>
        <h3 className="italic text-lg md:text-xl text-gray-700 mb-6 contact">
          Get in Touch
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-4 text-sm md:text-[12px] text-gray-700">
            <p>
              <strong className="text-[#747474] text-[12px]">City Office:</strong> <br />
              Gopal Bhawan, 42, Vidyasagar Street, Kolkata – 700009
            </p>
            <p>
              <strong className="text-[#747474] text-[12px]">Registered Office:</strong> <br />
              A/2/5, Pearl Apartment, 50b, Kailash Bose Street, Kolkata – 700006
            </p>
            <p>
              <strong className="text-[#747474] text-[12px]">Email Id:</strong> info@drasta.org, director@drasta.org
            </p>
            <p>
              <strong className="text-[#747474] text-[12px]">Contact:</strong> 9831792150
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Name"
                className="border p-2 rounded text-sm w-full"
                required
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email"
                className="border p-2 rounded text-sm w-full"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                type="text"
                placeholder="Contact No"
                className="border p-2 rounded text-sm w-full"
                required
              />
              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                type="text"
                placeholder="Subject"
                className="border p-2 rounded text-sm w-full"
              />
            </div>
            <textarea
              name="enquiry"
              value={formData.enquiry}
              onChange={handleChange}
              placeholder="Enquiry"
              rows={5}
              className="w-full border p-2 rounded text-sm"
              required
            />
            <button
              type="submit"
              className="bg-[#96C346] hover:bg-[#96C346] text-white font-semibold text-sm px-6 py-2 rounded"
            >
              Send
            </button>
          </form>
        </div>

        <div className="mt-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230.24375364247848!2d88.36886196512118!3d22.58284096848636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0276493ed12081%3A0xf8a4ea8bccb4befb!2zRFJB4bmi4bms4b65!5e0!3m2!1sen!2sin!4v1750930264034!5m2!1sen!2sin"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <Footer />
    </>
  );
};
