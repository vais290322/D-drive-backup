import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Simple pagination component with ellipsis support.
 * @param {{ totalPages: number; currentPage: number; onPageChange: (page: number) => void; }} props
 */
export const GalleryPagination = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  // Generate page numbers with simple ellipsis logic
  const getPageNumbers = useCallback(() => {
    const delta = 1;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }
    return [1, ...range, totalPages];
  }, [currentPage, totalPages]);

  const goToPage = (page) => onPageChange(page);
  const goToPrevious = () => onPageChange(Math.max(1, currentPage - 1));
  const goToNext = () => onPageChange(Math.min(totalPages, currentPage + 1));

  if (totalPages <= 1) return null;

  return (
    <motion.div
      className="mt-8 md:mt-12 flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] flex items-center space-x-1 md:space-x-2 bg-white rounded-full px-3 py-2 md:px-6 md:py-3 border border-slate-200">
        {/* Previous */}
        <motion.button
          className="p-1 md:p-2 cursor-pointer text-slate-600 disabled:opacity-30 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-50"
          disabled={currentPage === 1}
          onClick={goToPrevious}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
        </motion.button>

        {/* Page Numbers */}
        {getPageNumbers().map((page, idx) => (
          <span key={idx}>
            {page === "..." ? (
              <span className="px-1 md:px-3 text-slate-400 select-none">…</span>
            ) : (
              <motion.button
                className={`cursor-pointer w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-full font-medium transition-all duration-200 text-xs md:text-base ${
                  currentPage === page
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                onClick={() => goToPage(page)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {page}
              </motion.button>
            )}
          </span>
        ))}

        {/* Next */}
        <motion.button
          className="p-1 md:p-2 cursor-pointer text-slate-600 disabled:opacity-30 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-50"
          disabled={currentPage === totalPages}
          onClick={goToNext}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};
