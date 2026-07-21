import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "../ui/button";

const PaginationComponent = ({
  currentPage,
  rowsPerPage,
  totalPages,
  onRowsPerPageChange,
  onPageChange,
  dataLength,
  isDarkMode,
}) => {
  const { theme } = useTheme();
  const darkMode = isDarkMode !== undefined ? isDarkMode : theme === "light";

  const handleRowsPerPageChange = (e) => {
    onRowsPerPageChange(Number(e.target.value));
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination-component flex flex-col sm:flex-row justify-between items-center p-4">
      {/* Rows Per Page and Data Info */}
      <div className="flex flex-col sm:flex-row items-center gap-2 mb-4 sm:mb-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Rows per page:
          </span>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className={`border focus:outline-none px-2 py-1 rounded text-sm ${
              darkMode 
                ? "bg-[#1a2747] text-white border-[#1e2a4a]" 
                : "bg-white border-slate-200 text-gray-800"
            }`}
          >
            {[5, 10, 20, 30, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        {dataLength !== undefined && (
          <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Showing {Math.min((currentPage - 1) * rowsPerPage + 1, dataLength)} to {Math.min(currentPage * rowsPerPage, dataLength)} of {dataLength} entries
          </span>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-3">
        <Button
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
          className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
            darkMode 
              ? "bg-[#1a2747] hover:bg-[#243660] text-white border border-[#1e2a4a] disabled:bg-[#111c38] disabled:text-gray-500" 
              : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
          }`}
        >
          <FaArrowLeftLong className="h-3 w-3" />
          <span className="hidden sm:block">Previous</span>
        </Button>
        
        <div className="flex items-center gap-1">
          <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Page
          </span>
          <span className={`font-semibold px-1 ${darkMode ? "text-white" : "text-gray-800"}`}>
            {currentPage}
          </span>
          <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            of {totalPages}
          </span>
        </div>
        
        <Button
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
          className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
            darkMode 
              ? "bg-[#1a2747] hover:bg-[#243660] text-white border border-[#1e2a4a] disabled:bg-[#111c38] disabled:text-gray-500" 
              : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
          }`}
        >
          <span className="hidden sm:block">Next</span>
          <FaArrowRightLong className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationComponent;