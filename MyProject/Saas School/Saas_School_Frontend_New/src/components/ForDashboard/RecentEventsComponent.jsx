import { useTheme } from "@/context/ThemeContext";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import routineUrlApi from "@/common/routines";
import { addEvent } from "@/utils/event/eventSlice";
import {
  Calendar,
  Download,
  Trash2,
  Plus,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const RecentEventsComponent = () => {
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const role = useSelector((state) => state.auth.user);
  const allEvents = useSelector((state) => state.event.events) || [];
  const dispatch = useDispatch();
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  const { theme } = useTheme();
  const isDarkMode = theme === "light";

  const handleExpand = (index) => {
    setExpandedEvent(index === expandedEvent ? null : index);
  };

  // Format the date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const downloadEvent = async (event) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${routineUrlApi.addEvent.url}/generate-pdf/${event.id}/${schoolId}`,
        {
          responseType: "blob",
        }
      );

      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `event_${event.eventName}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        toast.success("PDF downloaded successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error downloading PDF");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async () => {
    if (eventToDelete) {
      try {
        setIsLoading(true);
        const response = await axios.delete(
          `${routineUrlApi.addEvent.url}/${eventToDelete}/${schoolId}`
        );
        if (response) {
          toast.success("Event deleted successfully!");
          const updatedEvents = allEvents.filter(
            (event) => event.id !== eventToDelete
          );
          dispatch(addEvent(updatedEvents));
          setIsModalOpen(false);
        }
      } catch (error) {
        toast.error("Failed to delete the event. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Open modal with event ID
  const openDeleteModal = (eventId) => {
    setEventToDelete(eventId);
    setIsModalOpen(true);
  };

  // Close the modal without deleting
  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setEventToDelete(null);
  };

  return (
    <div
      className={`h-full rounded-lg shadow-lg p-4 sm:p-6 border overflow-hidden flex flex-col ${
        isDarkMode
          ? "bg-[#111c38] text-white border-[#1e2a4a]"
          : "bg-white border-slate-200"
      }`}
    >
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h3
            className={`text-lg font-bold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Recent Events
          </h3>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            School activities and announcements
          </p>
        </div>
        {(role === "edp" || role === "admin") && (
          <Link to="/add-event">
            <Button
              className={`flex items-center gap-1.5 ${
                isDarkMode
                  ? "bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Event</span>
            </Button>
          </Link>
        )}
      </div>

      <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar">
        {allEvents && allEvents.length > 0 ? (
          <div
            className={`relative border-l-2 pl-4 ${
              isDarkMode ? "border-[#3b82f6]" : "border-green-500"
            }`}
          >
            {allEvents?.map((event, index) => (
              <div key={event.id} className="relative mb-6 last:mb-0">
                {/* Timeline Circle */}
                <div
                  className={`absolute -left-[20px] top-1.5 w-4 h-4 rounded-full border-2 ${
                    isDarkMode
                      ? "bg-[#3b82f6] border-[#111c38]"
                      : "bg-green-500 border-white"
                  }`}
                ></div>

                {/* Event Card */}
                <div
                  className={`rounded-lg shadow-sm p-4 transition-all ${
                    isDarkMode
                      ? "bg-[#1a2747] hover:bg-[#1e2e52] text-white border-[#1e2a4a]"
                      : "bg-white hover:bg-gray-50 border-gray-100 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h4
                      className={`text-base font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {event.eventName}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => downloadEvent(event)}
                        className={`p-1.5 rounded-full transition-colors ${
                          isDarkMode
                            ? "hover:bg-[#111c38] text-gray-300 hover:text-white"
                            : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        }`}
                        disabled={isLoading}
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      {(role === "edp" || role === "admin") && (
                        <button
                          onClick={() => openDeleteModal(event.id)}
                          className={`p-1.5 rounded-full transition-colors ${
                            isDarkMode
                              ? "hover:bg-[#111c38] text-gray-300 hover:text-red-400"
                              : "hover:bg-gray-100 text-gray-500 hover:text-red-600"
                          }`}
                          disabled={isLoading}
                          title="Delete Event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center mt-2 mb-3">
                    <Calendar
                      className={`h-4 w-4 mr-2 ${
                        isDarkMode ? "text-[#a3b1ff]" : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {formatDate(event.eventDate)}
                    </span>
                  </div>

                  <div
                    className={`text-sm mb-3 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {expandedEvent === index
                      ? event.description
                      : event.description?.length > 100
                      ? `${event.description.substring(0, 100)}...`
                      : event.description}
                  </div>

                  {event.description?.length > 100 && (
                    <button
                      onClick={() => handleExpand(index)}
                      className={`flex items-center text-xs font-medium ${
                        isDarkMode
                          ? "text-[#60a5fa] hover:text-[#93c5fd]"
                          : "text-blue-600 hover:text-blue-700"
                      }`}
                    >
                      {expandedEvent === index ? (
                        <>
                          <ChevronUp className="h-3 w-3 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3 mr-1" />
                          Read More
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center h-full py-8 ${
              isDarkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            <AlertCircle className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-center font-medium mb-1">No events found</p>
            <p className="text-center text-sm opacity-75 max-w-xs">
              There are no upcoming events scheduled at this time. Check back
              later or add a new event.
            </p>
            {(role === "edp" || role === "admin") && (
              <Link to="/add-event" className="mt-4">
                <Button
                  className={`flex items-center gap-1.5 ${
                    isDarkMode
                      ? "bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Add New Event
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`max-w-md w-full rounded-lg shadow-lg p-6 ${
              isDarkMode
                ? "bg-[#111c38] text-white border border-[#1e2a4a]"
                : "bg-white text-gray-900"
            }`}
          >
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p
              className={`mb-6 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={closeDeleteModal}
                className={`${
                  isDarkMode
                    ? "border-[#1e2a4a] text-gray-300 hover:bg-[#1a2747]"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteEvent}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </div>
                ) : (
                  "Delete Event"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentEventsComponent;
