import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaDownload,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Rectangle4Copy } from "../assets";
import api from "../service";
import { Link } from "react-router-dom";
import { getFormattedDate } from "../utils";
import { useSelector } from "react-redux";
import { useToast } from "@/context/ToastContext";

const Dialog = ({ open, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target.id === "dialog-backdrop") onClose();
  };

  return (
    <div
      id="dialog-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start sm:items-center justify-center px-2 py-6"
    >
      <div className="relative w-full max-w-7xl sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl bg-white rounded-2xl shadow-xl p-4 sm:p-6 animate-fade-in-up border border-red-100 overflow-y-auto max-h-[90vh]">
        <button
          className="absolute cursor-pointer top-2 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold transition-transform duration-200 hover:scale-110"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
        <style>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(30px) scale(0.95); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.3s ease-out; }
        `}</style>
      </div>
    </div>
  );
};

export const Volunteer_log = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [eventsParticipated, setEventsParticipated] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [upcomingEvent, setUpcomingEvent] = useState([]);

  const {showToast} = useToast();

  const itemsPerPage = 5;

  useEffect(() => {
    getProfile();
    getStats();
    getEventParticipation();
    upcomingEvents();
  }, []);

  const getProfile = async () => {
    try {
      const res = await api.get("/volunteer/profile");
      setProfile(res.data?.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const getStats = async () => {
    try {
      const {
        data: { data },
      } = await api.get("/volunteer-dashboard/stats");
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const getEventParticipation = async () => {
    try {
      const {
        data: { data },
      } = await api.get("/event-participation/volunteer");
      setEventsParticipated(data);
    } catch (err) {
      console.error("Failed to fetch event participation", err);
    }
  };

  const upcomingEvents = async () => {
    try {
      const {
        data: { data },
      } = await api.get("/events/upcoming");
      setUpcomingEvent(data);
    } catch (err) {
      console.error("Failed to fetch upcoming events", err);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const {data: data} = await api.get(`/volunteer-certificate/admin/membership`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${new Date().toISOString()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      showToast("Failed to download certificate.", "error");
    }
  };

  const totalPages = Math.ceil(eventsParticipated.length / itemsPerPage);
  const paginatedEvents = eventsParticipated.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleEyeClick = (event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <span>Loading profile...</span>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <div className="relative max-w-7xl md:mt-5 mt-2 md:mx-auto rounded-2xl overflow-hidden shadow-md ml-5 mr-5">
        <div
          className="w-full h-[40vh] md:h-[60vh] bg-center bg-cover rounded-2xl overflow-hidden shadow-md relative"
          style={{ backgroundImage: `url(${Rectangle4Copy})` }}
        >
          <div className="absolute inset-0 bg-black/70 z-0" />
          <div className="absolute bottom-0 left-0 right-0 z-10 px-4 md:px-12 pb-6 md:pb-12 text-white">
            <div className="flex flex-col md:flex-row items-end gap-4">
              <img
                src={profile.profileImage}
                className="hidden md:block w-24 h-24 md:w-40 md:h-40 bg-gray-300 rounded-full flex-shrink-0 mb-4 md:mb-0"
              />
              <div className="w-full">
                <div className="flex md:flex-row md:items-end gap-2 md:gap-4">
                  <h1 className="text-2xl md:text-5xl font-semibold">
                    Welcome,
                  </h1>
                  <span
                    className={`bg-white text-xs md:text-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full font-semibold self-end ${
                      profile.active ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    ● {profile.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mt-1 md:mt-2">
                  {profile.fullName || "User"}
                </h1>
                <p className="text-base md:text-lg mt-2 md:mt-3">
                  Your presence is very important for us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="w-full max-w-7xl md:mx-auto px-5 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-[#fef7f7] border border-red-300 rounded-xl p-4 text-center shadow-sm">
          <h3 className="text-xl font-semibold mb-1">Events Participated</h3>
          <p className="text-3xl font-bold text-black">
            {stats?.eventsParticipated || 0}
          </p>
        </div>
        <div className="bg-[#fef7f7] border border-red-300 rounded-xl p-4 text-center shadow-sm">
          <h3 className="text-xl font-semibold mb-1">Hours Contributed</h3>
          <p className="text-3xl font-bold text-black">
            {stats?.hoursContributed || 0}
          </p>
        </div>
        <div onClick={handleDownloadCertificate} className="bg-[#fef7f7] border border-red-300 rounded-xl p-4 text-center shadow-sm">
          <h3 className="text-xl font-semibold mb-2">
            Download Volunteer Certificate
          </h3>
          <FaDownload className="mx-auto text-2xl text-black hover:text-red-600 cursor-pointer" />
        </div>
      </div>

      {/* Events Table */}
      <div className="max-w-7xl md:mx-auto m-5 mt-8 rounded-2xl overflow-hidden border border-red-300">
        <div className="bg-[#fef7f7] py-4 text-center border-b border-red-200">
          <h2 className="text-xl md:text-2xl font-bold">
            Participation Activities
          </h2>
        </div>
        <div className="overflow-x-auto">
  <table className="min-w-full table-fixed text-left">
    <thead className="sticky top-0 z-10 bg-[#fef7f7] text-black text-sm sm:text-base">
      <tr className="border-b border-red-200">
        <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-center w-12 sm:w-16">
          Sl
        </th>
        <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold w-[45%] text-left">
          Event Title
        </th>
        <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-center w-28 hidden sm:table-cell">
          Date
        </th>
        <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-center w-36 hidden sm:table-cell">
          Location
        </th>
        <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-center w-24 hidden sm:table-cell">
          Duration
        </th>
        <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-center w-20">
          Actions
        </th>
      </tr>
    </thead>

    <tbody className="text-base text-black">
      {paginatedEvents.map((row, index) => (
        <tr
          key={index}
          className="even:bg-[#fcf5f5] odd:bg-white border-b border-red-100"
        >
          <td className="px-2 py-2 sm:px-4 sm:py-3 text-center align-middle">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>

          <td className="px-2 py-2 sm:px-4 sm:py-3 truncate align-middle">
            <span className="block sm:hidden">
              {row.eventTitle.length > 20
                ? row.eventTitle.slice(0, 20) + "..."
                : row.eventTitle}
            </span>
            <span className="hidden sm:block">{row.eventTitle}</span>
          </td>

          <td className="px-2 py-2 sm:px-4 sm:py-3 hidden sm:table-cell text-center align-middle">
            {getFormattedDate(row.startDate)}
          </td>
          <td className="px-2 py-2 sm:px-4 sm:py-3 hidden sm:table-cell text-center align-middle">
            {row.location}
          </td>
          <td className="px-2 py-2 sm:px-4 sm:py-3 hidden sm:table-cell text-center align-middle">
            {row.totalHours} hr
          </td>

          <td className="px-2 py-2 sm:px-4 sm:py-3 text-center align-middle">
            <div className="flex justify-center items-center gap-2 sm:gap-3">
              <FaEye
                onClick={() => handleEyeClick(row)}
                className="cursor-pointer text-[18px] hover:text-green-600"
              />
              <FaDownload
                onClick={() => handleDownloadCertificate(row.id)}
                className="cursor-pointer text-[18px] hover:text-red-600"
              />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


        {/* Pagination */}
        <div className="py-4 flex justify-center items-center gap-3 text-sm text-black">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded-full hover:bg-gray-200 cursor-pointer text-xl text-center"
          >
            ←
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => handlePageChange(idx + 1)}
              className={`w-7 h-7 rounded-full font-semibold cursor-pointer ${
                currentPage === idx + 1
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded-full hover:bg-gray-200 cursor-pointer text-xl text-center"
          >
            →
          </button>
        </div>
      </div>

      {/* View Event Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        {selectedEvent && (
          <div className="w-full px-2 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[#972626] flex items-center justify-center gap-2">
              🎁 Event Details
            </h2>
            <div className="bg-white/80 backdrop-blur-lg p-4 sm:p-6 rounded-xl">
              <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Add your <dt> and <dd> pairs here as needed */}
                <div>
                  <dt className="font-semibold text-gray-800 mb-1">
                    Event Title
                  </dt>
                  <dd className="text-base text-gray-700">
                    {selectedEvent.eventTitle}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-800 mb-1">
                    Full Name
                  </dt>
                  <dd className="text-base text-green-700">
                    {selectedEvent.fullName}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-800 mb-1">Email</dt>
                  <dd className="text-base text-gray-700">
                    {selectedEvent.email}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-800 mb-1">
                    Start Date
                  </dt>
                  <dd className="text-base text-gray-700">
                    {selectedEvent.startDate
                      ? new Date(selectedEvent.startDate).toLocaleDateString(
                          "en-GB"
                        )
                      : ""}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-800 mb-1">End Date</dt>
                  <dd className="text-base text-gray-700">
                    {selectedEvent.endDate
                      ? new Date(selectedEvent.endDate).toLocaleDateString(
                          "en-GB"
                        )
                      : ""}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-800 mb-1">Location</dt>
                  <dd className="text-base text-gray-700">
                    {selectedEvent.location}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-800 mb-1">
                    Total Hours
                  </dt>
                  <dd className="text-base text-gray-700">
                    {selectedEvent.totalHours}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-800 mb-1">
                    Mobile Number
                  </dt>
                  <dd className="text-base text-gray-700">
                    {selectedEvent.mobileNumber}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-800 mb-1">Event ID</dt>
                  <dd className="text-base text-blue-700">
                    {selectedEvent.eventId}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </Dialog>

      {/* Upcoming Events */}
      <div className="max-w-7xl mx-auto p-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {upcomingEvent.map((event, index) => (
            <div
              key={index}
              className="relative bg-[#fdf5f5] border border-red-200 rounded-lg overflow-hidden shadow-md transition hover:shadow-lg"
            >
              <div className="relative">
                <img
                  src={event.eventBannerUrl}
                  alt={event.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm px-3 py-2 font-semibold">
                  {event.eventTitle}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center text-sm gap-2 mb-2">
                  <FaCalendarAlt />
                  <span>{getFormattedDate(event.eventDate)}</span>
                  <FaClock className="ml-4" />
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {event.totalHours} hr
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <FaMapMarkerAlt className="mt-0.5" />
                  <span>{event.location}</span>
                </div>
              </div>
              <Link
                to={`/event/${event.id}`}
                className="block bg-[#972626] text-white text-sm text-center font-semibold py-2 cursor-pointer"
              >
                View Full Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
