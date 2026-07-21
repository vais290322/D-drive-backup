// 4th version 

import { useTheme } from '@/context/ThemeContext';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import routineUrlApi from '@/common/routines';
import { addEvent } from '@/utils/event/eventSlice';
import { Delete, Download } from 'lucide-react';
import { DeleteForeverRounded, DownloadForOfflineRounded } from '@mui/icons-material';

const RecentEventsComponent = () => {
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const role = useSelector((state) => state.auth.user);
  const allEvents = useSelector((state) => state.event.events) || [];
  const dispatch = useDispatch();
  const schoolId=useSelector((state)=>state?.auth?.schoolId)

  // console.log('role from edp dashboard : ', allEvents);

  const { theme } = useTheme();

  const handleExpand = (index) => {
    setExpandedEvent(index === expandedEvent ? null : index);
  };

  // Format the date to YYYY-MM-DD
  const formatDate = (dateString) => {
    return dateString.split('T')[0];
  };

  const downloadEvent = async (event) => { 
    try {
      const response = await axios.get(
        `${routineUrlApi.addEvent.url}/generate-pdf/${event.id}/${schoolId}`,
        {
          responseType: "blob",
        }
      );

      // console.log("response : ", response);

      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        // Set the filename for the download
        link.setAttribute(
          "download",
          `event_${event.eventName}.pdf`
        );

        // Append the link to the document and trigger a click to download
        document.body.appendChild(link);
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);

        // console.log("PDF downloaded successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error downloading PDF");
    }
  };




  // Handle event deletion
  const handleDeleteEvent = () => {
    if (eventToDelete) {
      const response = axios.delete(`${routineUrlApi.addEvent.url}/${eventToDelete}/${schoolId}`);
      if (response) {
        toast.success('Event deleted successfully!');
        const updatedEvents = allEvents.filter((event) => event.id !== eventToDelete);
        dispatch(addEvent(updatedEvents));
        // Ideally, dispatch an action to refresh the event list
        setIsModalOpen(false);
      } else {
        toast.error('Failed to delete the event. Please try again.');
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
      className={`rounded-lg shadow-lg p-6 sm:mx-auto h-[666px] border overflow-auto mb-4 ${
        theme === 'light'
          ? 'bg-[#212121] text-white border-gray-800'
          : 'bg-white border-slate-200'
      }`}
    >
      <div className="mb-6">
        <div className="flex justify-between">
          <h3
            className={`text-lg font-bold ${
              theme === 'light' ? 'text-white' : 'text-gray-800'
            }`}
          >
            Recent Events
          </h3>
          {role === 'edp' || role === "admin" && (
            <Link to="/add-event">
              <Button className="bg-[#2b65bb] hover:bg-[#34588f]">
                Add Event
              </Button>
            </Link>
          )}
        </div>
        <a href="#!" className="text-sm text-blue-500 hover:underline">
          See our most recent events lists
        </a>
      </div>
      <div
        className={`relative border-l-2 pl-6 ${
          theme === 'light' ? 'border-[#969090]' : 'border-green-500'
        }`}
      >
        {allEvents?.map((event, index) => (
          <div key={event.id} className="relative mb-8 last:mb-0">
            {/* Green Circle */}
            <div
              className={`absolute -left-8 top-1.5 w-4 h-4 border-2 border-white rounded-full ${
                theme === 'light' ? 'bg-[#969090]' : 'bg-green-500'
              }`}
            ></div>
            {/* Event Content */}
            <div
              className={`rounded-lg shadow-sm p-4 ${
                theme === 'light'
                  ? 'bg-[#302c2c] text-white border-gray-800'
                  : 'bg-white border-slate-200'
              }`}
            >
              <h4
                className={`text-base font-semibold ${
                  theme === 'light' ? 'text-white' : 'text-gray-800'
                }`}
              >
                {event.eventName}
              </h4>
              <p
                className={`text-sm ${
                  theme === 'light' ? 'text-white' : 'text-gray-800'
                }`}
              >
                {expandedEvent === index
                  ? event.description || 'No description available.'
                  : `${
                      event.description
                        ? event.description.substring(0, 50)
                        : 'No description available.'
                    }...`}
                {event.description && event.description.length > 50 && (
                  <button
                    onClick={() => handleExpand(index)}
                    className="text-blue-500 ml-1"
                  >
                    {expandedEvent === index ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">
                  {formatDate(event.createdAt) || 'No date provided'}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) =>{ e.preventDefault(); downloadEvent(event)}}
                    className="text-xs text-blue-500 hover:underline"
                  >
                  <DownloadForOfflineRounded/>  Download PDF
                  </button>

                  { 
                  role === 'edp' || role === 'admin' || role ==="vais" && ( 
                  <button
                    onClick={() => openDeleteModal(event.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                   <DeleteForeverRounded/> Delete Event
                  </button>
                  )
                  }
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this event?</h3>
            <div className="flex justify-between">
              <Button
                className="bg-red-500 text-white"
                onClick={handleDeleteEvent}
              >
                Yes, Delete
              </Button>
              <Button
                className="bg-gray-300"
                onClick={closeDeleteModal}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentEventsComponent;
