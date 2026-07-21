import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import ViewExpertModal from "./ViewExpert";
import { MdDelete } from "react-icons/md";
const ExpertTable = ({ data, loading, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filteredData, setFilteredData] = useState(data || []);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [viewExpert, setViewExpert] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const filtered = data?.filter(
      (expert) =>
        expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.expertise.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered || []);
    setCurrentPage(1);
  }, [searchTerm, data]);

  // Pagination logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="p-4 text-white text-center">Loading...</div>;
  }

  return (
    <div className="space-y-4 px-2">
      {/* Search and Items Per Page Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-white" size={18} />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full text-white bg-transparent border-[#e8b245]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-normal">
          <span className="text-sm text-white whitespace-nowrap">
            Items per page:
          </span>
          <select
            className="border rounded-lg px-3 py-2 text-sm text-white bg-[#e8b245]"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isMobile ? (
          <div className="space-y-2">
            {currentItems.length > 0 ? (
              currentItems.map((expert) => (
                <div
                  key={expert._id}
                  className="border border-[#e8b245] rounded-lg p-3 text-white"
                >
                  {/* <div className="flex justify-center mb-3">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="h-16 w-16 object-cover rounded-full"
                    />
                  </div> */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Name:</span>
                    <span>{expert?.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Title:</span>
                    <span>{expert?.title}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Expertise:</span>
                    <span>{expert?.expertise}</span>
                  </div>
                  <div className="flex justify-end space-x-3 mt-3">
                    {/* <button
                      className="text-blue-400 hover:underline"
                      onClick={() => onEdit(expert)}
                    >
                      <Pencil size={18} />
                    </button> */}
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => onDelete(expert._id)}
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-white text-center">No experts found</div>
            )}
          </div>
        ) : (
          <table className="w-full border border-[#e8b245] text-center">
            <thead className="bg-[#e8b245]">
              <tr className="text-black">
                {/* <th className="p-2">Image</th> */}
                <th className="p-2">Name</th>
                <th className="p-2">Title</th>
                <th className="p-2">Expertise</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((expert) => (
                  <tr
                    key={expert._id}
                    className="border-t border-[#e8b245] text-white"
                  >
                    {/* <td className="p-2">
                      <img
                        src={expert.image}
                        alt={expert.name}
                        className="h-12 w-12 object-cover rounded-full mx-auto"
                      />
                    </td> */}
                    <td className="p-2">{expert?.name}</td>
                    <td className="p-2">{expert?.title}</td>
                    <td className="p-2">
                      {expert?.expertise
                        ? expert.expertise.length > 15
                          ? `${expert.expertise.substring(0, 15)}...`
                          : expert.expertise
                        : "No expertise available"}
                    </td>
                    <td className="p-2 space-x-2">
                      {/* <button
                        className="text-blue-400 hover:underline"
                        onClick={() => onEdit(expert)}
                      >
                        <Pencil size={18} />
                      </button> */}
                      <button
                        className="text-blue-400 hover:underline"
                        onClick={() => setViewExpert(expert)}
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => onDelete(expert._id)}
                      >
                        <MdDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-white">
                    No experts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
<div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4">
  <div className="text-sm text-white whitespace-nowrap">
    Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
    {totalItems} entries
  </div>

  <div className="flex items-center space-x-1">
    <button
      className={`px-1 py-1 rounded-lg border ${
        currentPage === 1
          ? "bg-gray-100 cursor-not-allowed"
          : "bg-gray-100 hover:bg-gray-200"
      }`}
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      <ChevronLeft
        className={currentPage === 1 ? "text-gray-400" : "text-black"}
      />
    </button>

    {Array.from(
      { length: Math.min(totalPages, isMobile ? 3 : totalPages) },
      (_, i) => {
        if (isMobile && totalPages > 3) {
          if (currentPage === 1) {
            return [1, 2, totalPages];
          } else if (currentPage === totalPages) {
            return [1, totalPages - 1, totalPages];
          } else {
            return [currentPage - 1, currentPage, currentPage + 1];
          }
        }
        return i + 1;
      }
    ).map((page, index, array) => (
      <React.Fragment key={page}>
        <button
          className={`px-3 py-1 rounded-lg border ${
            currentPage === page
              ? "bg-[#e8b245] text-white"
              : "bg-[#ebce94] text-black hover:bg-[#e8b245] hover:text-white"
          }`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
        {isMobile &&
          totalPages > 3 &&
          index < array.length - 1 &&
          array[index + 1] !== page + 1 && (
            <span className="px-1 text-white">...</span>
          )}
      </React.Fragment>
    ))}

    <button
      className={`px-1 py-1 rounded-lg border ${
        currentPage === totalPages
          ? "bg-gray-100 cursor-not-allowed"
          : "bg-gray-100 hover:bg-gray-200"
      }`}
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      <ChevronRight
        className={currentPage === totalPages ? "text-gray-400" : "text-black"}
      />
    </button>
  </div>
</div>
      <ViewExpertModal
        open={!!viewExpert}
        onClose={() => setViewExpert(null)}
        expert={viewExpert}
      />
    </div>
  );
};

export default ExpertTable;
