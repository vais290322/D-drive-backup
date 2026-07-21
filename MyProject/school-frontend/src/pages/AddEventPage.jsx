import routineUrlApi from "@/common/routines";
import { useFetchAllEvents } from "@/helper/AllFetchFunction";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const AddEventPage = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    eventDate: "",
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${routineUrlApi.addEvent.url}`);
      // console.log("response : ", response); // Log the response data
      if (response) {
        dispatch(addEvent(response?.data?.data));
      }
    } catch (error) {
      toast.error("Something went wrong to fetch events");  
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data for submission
    const data = {
      eventName: formData.eventName,
      description: formData.eventDescription,
      eventDate: formData.eventDate,
    };

    try {
      const response =await axios.post(`${routineUrlApi.addEvent.url}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log("response : ", response);
      if (response) {
        toast.success("Event added successfully");
        setFormData({
          eventName: "",
          eventDescription: "",
          eventDate: "",
        });
        fetchEvent();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  

  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Add New Event
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="eventName"
              className="block text-lg font-medium text-gray-700 mb-2"
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
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="eventDescription"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Event Description
            </label>
            <textarea
              id="eventDescription"
              name="eventDescription"
              value={formData.eventDescription}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              rows="5"
            ></textarea>
          </div>

          <div className="mb-6">
            <label
              htmlFor="eventDate"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Event Date
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-blue-700 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
          >
            Submit Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEventPage;
