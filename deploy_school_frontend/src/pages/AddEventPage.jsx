import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";

const AddEventPage = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    eventPdf: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, eventPdf: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Create a FormData object for submission
    const data = new FormData();
    data.append("eventName", formData.eventName);
    data.append("eventDescription", formData.eventDescription);
    data.append("eventPdf", formData.eventPdf);
  
    // Submit the form data using Axios
    // console.log("Form Data:", data);
    axios
      .post("/api/submit-event", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // Success notification
        toast.success("Event submitted successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        // console.log("Success:", response.data);
      })
      .catch((error) => {
        // Error notification
        toast.error("Failed to submit the event. Please try again.", {
          position: "top-center",
          autoClose: 3000,
        });
        console.error("Error:", error);
      });
  };
  

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Add New Event</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="eventName"
            className="block text-sm font-medium text-gray-700"
          >
            Event Name
          </label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="eventDescription"
            className="block text-sm font-medium text-gray-700"
          >
            Event Description
          </label>
          <textarea
            id="eventDescription"
            name="eventDescription"
            value={formData.eventDescription}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows="4"
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="eventPdf"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Event PDF
          </label>
          <input
            type="file"
            id="eventPdf"
            name="eventPdf"
            accept=".pdf"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        >
          Submit Event
        </button>
      </form>
    </div>
  );
};

export default AddEventPage;
