import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/V2/service";
import { BackButton } from "@/V2/components/BackButton";
import { useToast } from "@/context/ToastContext";
import { getFormattedDate } from "@/V2/utils";

export function ActivityById() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const {
          data: { data },
        } = await api.get(`/initiatives/events/category/${categoryId}`);
        setCategory(data || {});
      } catch (error) {
        showToast(
          error?.response?.data?.message ||
            error.message ||
            "Failed to fetch category",
          "error"
        );
        navigate("/activity");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [categoryId, navigate, showToast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="text-xl font-semibold">Loading...</span>
      </div>
    );
  }

  if (!category?.categoryId) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="text-xl font-semibold">Category not found.</span>
      </div>
    );
  }

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <>
      <div className="fixed z-10 flex items-center gap-3 px-4 sm:px-6 md:px-20 pt-6 pb-4">
        <BackButton
          className="
            text-[#8B1E3F] bg-white border border-[#F3C304] rounded-full
            p-2 sm:p-3 md:p-4 shadow-lg
            hover:bg-[#F3C304] hover:text-black hover:scale-105
            transition-transform duration-300
          "
        />
      </div>

      <div className="pt-28 px-4 sm:px-6 md:px-20 text-center">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {category.categoryTitle || "Untitled Category"}
        </motion.h2>
        <motion.p
          className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {category.categoryDescription || "No description available."}
        </motion.p>
      </div>

      <div className="px-4 sm:px-6 md:px-20 py-10">
        {category.events?.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <span className="text-lg font-semibold">No events found.</span>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 justify-center"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {category.events.map((event) => (
              <motion.div
                key={event.eventId}
                variants={cardVariants}
                className="
                  flex flex-col
                  bg-white border-t-4 border-[var(--secondary-color)]
                  rounded-xl overflow-hidden shadow-md hover:shadow-lg
                  transition
                "
              >
                <div className="w-full aspect-video overflow-hidden p-1 rounded-2xl">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <div className="flex-1 p-5 flex flex-col">
                  <h3 className="text-lg sm:text-xl font-semibold text-black mb-3">
                    {event.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm sm:text-base text-gray-700">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-black" />
                      <span>{getFormattedDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-black" />
                      <span>{event.totalHours}h</span>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <FaMapMarkerAlt className="text-black" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <Link
                    to={`/event/${event.eventId}`}
                    className="
                    
                      block w-full
                      bg-[rgba(var(--primary-color-rgb),0.9)]
                      hover:bg-[rgba(var(--primary-color-rgb),1)]
                      text-white text-sm sm:text-base font-semibold
                      text-center py-3 rounded-xl
                      transition-colors duration-300
                    "
                  >
                    View Full Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
