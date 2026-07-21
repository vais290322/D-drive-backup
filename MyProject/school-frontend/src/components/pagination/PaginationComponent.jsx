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
}) => {
  const { theme } = useTheme();

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
    <div className="flex justify-between items-center p-4 mb-12">
      {/* Rows Per Page Dropdown */}
      <div>
        <select
          id="rowsPerPage"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className={`border  focus:outline-none mt-3 sm:mt-0 px-2 sm:px-4 py-1 rounded ${
            theme === "light" ? "bg-[#212121] border-[rgba(193,193,193,0.3)]" : "bg-white border-slate-200 "
          }`}
        >
          {[5, 10, 20, 30, 50].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="flex gap-2">
        <Button
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
          className="px-3 py-1 bg-[#452B90] hover:bg-[#c29732] rounded-full sm:rounded disabled:opacity-50 shadow-md shadow-[#452B90]"
        >
          <span>
            <FaArrowLeftLong />
          </span>{" "}
          <span className="hidden sm:block">Previous</span>
        </Button>
        <span className="font-semibold mt-2">
          {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
          className="px-3 py-1 bg-[#452B90] hover:bg-[#c29732] rounded-full sm:rounded disabled:opacity-50 shadow-md shadow-[#452B90]"
        >
          <span>
            <FaArrowRightLong />
          </span>{" "}
          <span className="hidden sm:block">Next</span>
        </Button>
      </div>
    </div>
  );
};

export default PaginationComponent;
