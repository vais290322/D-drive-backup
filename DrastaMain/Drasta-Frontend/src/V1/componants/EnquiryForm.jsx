import React, { useState } from "react";

const API= import.meta.env.VITE_OLD_API_URL;

const EnquiryModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    subject: "",
    enquiry: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

    const FormData ={
      name: formData.name,
      email: formData.email,
      contactNo: formData.contact,
      subject: formData.subject,
      message: formData.enquiry,
    }
      const res = await fetch(`${API}/api/v1/enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(FormData),
      });

      const result = await res.json();

      if (result.success) {
        alert("Enquiry sent successfully.");
        setFormData({
          name: "",
          email: "",
          contact: "",
          subject: "",
          enquiry: "",
        });
        onClose();
      } else {
        alert("Failed to send enquiry.");
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("An error occurred.");
    }
  };

  if (!isOpen) return null;

  return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-3xl rounded shadow-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Enquiry Form</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="contact"
            type="text"
            placeholder="Contact No"
            value={formData.contact}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="subject"
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <textarea
            name="enquiry"
            placeholder="Enquiry"
            value={formData.enquiry}
            onChange={handleChange}
            className="border p-2 rounded col-span-1 md:col-span-2 h-32 resize-none"
            required
          />
          <div className="col-span-1 md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-[#96C346] hover:bg-[#7ea733] text-white font-semibold px-6 py-2 rounded"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;
