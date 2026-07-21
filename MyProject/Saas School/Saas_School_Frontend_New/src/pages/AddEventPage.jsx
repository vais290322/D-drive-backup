import routineUrlApi from "@/common/routines";
import { useFetchAllEvents } from "@/helper/AllFetchFunction";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { FaCalendarAlt, FaEdit, FaClock } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { addEvent } from "@/utils/event/eventSlice";

const AddEventPage = () => {
  const { theme } = useTheme();
  const isDarkTheme = theme === "light"; // In your app "light" seems to be dark theme
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    eventDate: "",
  });
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${routineUrlApi.addEvent.url}/${schoolId}`);
      if (response) {
        dispatch(addEvent(response?.data?.data));
      }
    } catch (error) {
      toast.error("Something went wrong to fetch events");  
    }
  }

  useEffect(() => {
    fetchEvent();
  }, [schoolId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare the data for submission
    const data = {
      eventName: formData.eventName,
      description: formData.eventDescription,
      eventDate: formData.eventDate,
    };

    try {
      const response = await axios.post(`${routineUrlApi.addEvent.url}/${schoolId}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
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
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex justify-center items-center p-4 sm:p-6 md:p-8 ${
      isDarkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
    }`}>
      <div className={`w-full max-w-3xl rounded-xl shadow-xl overflow-hidden ${
        isDarkTheme ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
      }`}>
        {/* Header with gradient */}
        <div className={`p-6 ${
          isDarkTheme 
            ? "bg-gradient-to-r from-purple-900 to-indigo-900" 
            : "bg-gradient-to-r from-blue-500 to-purple-500"
        }`}>
          <div className="flex items-center justify-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isDarkTheme ? "bg-gray-800" : "bg-white"
            }`}>
              <FaCalendarAlt className={`text-2xl ${
                isDarkTheme ? "text-purple-400" : "text-purple-600"
              }`} />
            </div>
            <h1 className="text-3xl font-bold text-white">Add New Event</h1>
          </div>
          <p className="mt-2 text-center text-sm opacity-80 text-white">
            Create and schedule important events for your school calendar
          </p>
        </div>

        {/* Form section */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="eventName"
                className={`block text-sm font-medium mb-2 ${
                  isDarkTheme ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Event Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEdit className={isDarkTheme ? "text-purple-400" : "text-purple-500"} />
                </div>
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  required
                  placeholder="Enter event name"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    isDarkTheme 
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                  } transition-colors duration-200`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="eventDescription"
                className={`block text-sm font-medium mb-2 ${
                  isDarkTheme ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Event Description
              </label>
              <div className="relative">
                <textarea
                  id="eventDescription"
                  name="eventDescription"
                  value={formData.eventDescription}
                  onChange={handleChange}
                  required
                  placeholder="Describe the event details"
                  rows="5"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkTheme 
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500" 
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
                  } transition-colors duration-200`}
                ></textarea>
              </div>
            </div>

            <div>
              <label
                htmlFor="eventDate"
                className={`block text-sm font-medium mb-2 ${
                  isDarkTheme ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Event Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaClock className={isDarkTheme ? "text-purple-400" : "text-purple-500"} />
                </div>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    isDarkTheme 
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500" 
                      : "bg-white border-gray-300 text-gray-900 focus:ring-purple-500 focus:border-purple-500"
                  } transition-colors duration-200`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ${
                isSubmitting 
                  ? "opacity-70 cursor-not-allowed" 
                  : "transform hover:scale-[1.02]"
              } ${
                isDarkTheme 
                  ? "bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white" 
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              } shadow-lg`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Creating Event...</span>
                </>
              ) : (
                <>
                  <FaCalendarAlt className="mr-2" />
                  <span>Create Event</span>
                </>
              )}
            </button>
          </form>

          {/* Tips section */}
          <div className={`mt-8 p-4 rounded-lg text-sm ${
            isDarkTheme 
              ? "bg-gray-700/50 text-gray-300" 
              : "bg-gray-100 text-gray-600"
          }`}>
            <h3 className={`font-medium mb-2 ${
              isDarkTheme ? "text-purple-400" : "text-purple-600"
            }`}>
              Tips for creating effective events:
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use clear, descriptive names for your events</li>
              <li>Include all important details in the description</li>
              <li>Set the correct date to ensure proper scheduling</li>
              <li>Events will be visible on the school's recent event's secions after creation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventPage;
