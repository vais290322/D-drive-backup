import React, { useState } from "react";

export const DashboardForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form:", formData);
    // TODO: API call or form processing
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-2">Create New Notice</h2>
      <p className="text-center text-gray-600 mb-10">
        Fill in the details below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Event Title */}
        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            Event Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter event title"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Provide a brief description"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            rows={3}
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">Be concise.</p>
        </div>

        {/* Redirect Link */}
        <div>
          <label htmlFor="link" className="block font-medium mb-1">
            Redirect link
          </label>
          <input
            type="text"
            id="link"
            name="link"
            placeholder="example.com"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={formData.link}
            onChange={handleChange}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-6">
          <button
            type="button"
            className="border border-black px-6 py-2 rounded-md hover:bg-gray-100"
            onClick={() => setFormData({ title: "", description: "", link: "" })}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-md hover:opacity-90"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};
