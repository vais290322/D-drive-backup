import React, { useState } from "react";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import legalBg from "../assets/v1-footerimage.jpg";

const API = import.meta.env.VITE_OLD_API_URL;

export const GreenLeablepresent = () => {
  const [formData, setFormData] = useState({
    name: "",
    sex: "",
    occupation: "",
    state: "",
    contact: "",
    cell: "",
    email: "",
    comments: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const FormDatas = {
        name: formData.name,
        sex: formData.sex,
        occupation: formData.occupation,
        stateOfResidence: formData.state,
        contactDetails: formData.contact,
        cellNo: formData.cell,
        email: formData.email,
        comments: formData.comments,
      };
      const response = await fetch(`${API}/api/v1/greenlabel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(FormDatas),
      });
      const result = await response.json();

      if (result.success) {
        alert("Form submitted successfully");
        setFormData({
          name: "",
          sex: "",
          occupation: "",
          state: "",
          contact: "",
          cell: "",
          email: "",
          comments: "",
        });
      } else {
        alert("Failed to submit form");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <>
      <Header />

      <div
        className="h-14 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${legalBg})` }}
      ></div>
      <div className="max-w-6xl mx-auto p-6 bg-white rounded ">
        <h2 className="text-2xl font-semibold mb-1 ">
          How far Green Labels represent what they claim?
        </h2>
        <hr className="border-t-2 border-[#c0c09e] w-96  my-3" />
        <p className="text-sm text-center mb-6 text-gray-700">
          Your views would be screened by experts and you will be invited to
          participate in a Focus Group Discussion subject to your availability
          in e-conference mode.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Sex <span className="text-red-500">*</span>
              </label>
              <select
                name="sex"
                required
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Occupation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="occupation"
                required
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                State of Residence <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                required
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Contact Details <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contact"
                required
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Cell No.
              </label>
              <input
                type="text"
                name="cell"
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Comments (within 300 words){" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              name="comments"
              rows="5"
              required
              maxLength="2500"
              placeholder="Entry and Retention of Women in Higher Studies and Research in Science in India"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded resize-none"
            />
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="bg-[#a6d65e] hover:bg-[#92c750] text-white font-semibold px-6 py-2 rounded"
            >
              Send
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};
