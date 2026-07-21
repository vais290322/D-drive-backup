import React, { useEffect, useState } from "react";
import { FiEye, FiTrash2, FiSearch, FiX } from "react-icons/fi";

const baseUrl = import.meta.env.VITE_REACT_BASE_URL;
const ITEMS_PER_PAGE = 10;

const Enquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${baseUrl}/enquiry`);
        const data = await res.json();
        setEnquiries(data.enquiries || []);
        setFilteredEnquiries(data.enquiries || []);
      } catch (err) {
        setError("Failed to fetch data");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = enquiries.filter((enquiry) =>
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEnquiries(results);
    setCurrentPage(1);
  }, [searchTerm, enquiries]);

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`${baseUrl}/enquiry/${confirmDelete._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      const updated = enquiries.filter((enquiry) => enquiry._id !== confirmDelete._id);
      setEnquiries(updated);
      setFilteredEnquiries(updated);
      setConfirmDelete(null);
    } catch (err) {
      alert("Delete failed");
    }
  };

  const paginatedData = filteredEnquiries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredEnquiries.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-black text-[#E8B245] px-2 py-4 md:px-4 md:py-8">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-4 md:mb-6 border-b-2 border-[#E8B245] pb-2 text-center md:text-left">
        Enquiry Entries
      </h2>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-center mb-4 gap-2">
        <div className="flex items-center bg-[#1a1a1a] border border-[#E8B245] rounded px-2 py-1 w-full max-w-md">
          <FiSearch className="text-[#E8B245] mr-2" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-[#E8B245]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <svg className="animate-spin h-8 w-8 text-[#E8B245] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#E8B245" strokeWidth="4"></circle>
            <path className="opacity-75" fill="#E8B245" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="text-[#E8B245] text-lg">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-[#E8B245]">
            <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
              <thead className="bg-[#E8B245] text-black">
                <tr>
                  <th className="py-2 px-2 md:px-4 border border-black whitespace-nowrap">Name</th>
                  <th className="py-2 px-2 md:px-4 border border-black whitespace-nowrap">Email</th>
                  <th className="py-2 px-2 md:px-4 border border-black whitespace-nowrap">Contact No</th>
                  <th className="py-2 px-2 md:px-4 border border-black whitespace-nowrap">Subject</th>
                  <th className="py-2 px-2 md:px-4 border border-black whitespace-nowrap">Message</th>
                  <th className="py-2 px-2 md:px-4 border border-black whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((enquiry) => (
                  <tr
                    key={enquiry._id}
                    className="hover:bg-[#2a2a2a] transition-colors duration-200"
                  >
                    <td className="py-2 px-2 md:px-4 border border-[#E8B245] break-words max-w-[120px] md:max-w-none">{enquiry.name}</td>
                    <td className="py-2 px-2 md:px-4 border border-[#E8B245] break-words max-w-[140px] md:max-w-none">{enquiry.email}</td>
                    <td className="py-2 px-2 md:px-4 border border-[#E8B245] break-words max-w-[100px] md:max-w-none">{enquiry.contactNo}</td>
                    <td className="py-2 px-2 md:px-4 border border-[#E8B245] break-words max-w-[100px] md:max-w-none">{enquiry.subject}</td>
                    <td className="py-2 px-2 md:px-4 border border-[#E8B245] break-words max-w-[160px] md:max-w-none">{enquiry.message && enquiry.message.length > 50 ? enquiry.message.slice(0, 50) + '...' : enquiry.message}</td>
                    <td className="py-2 px-2 md:px-4 border border-[#E8B245] text-center space-x-2">
                      <button
                        className="text-[#E8B245] hover:text-white cursor-pointer"
                        onClick={() => setSelectedEnquiry(enquiry)}
                      >
                        <FiEye />
                      </button>
                      <button
                        className="text-red-500 hover:text-white cursor-pointer"
                        onClick={() => setConfirmDelete(enquiry)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
            <p className="text-sm">
              Showing {paginatedData.length} of {filteredEnquiries.length} entries
            </p>
            <div className="space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-[#E8B245] rounded text-[#E8B245] disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
              <span className="px-2">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-[#E8B245] rounded text-[#E8B245] disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* View Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-[#1a1a1a] text-[#E8B245] w-full max-w-xs sm:max-w-md md:max-w-lg p-4 sm:p-6 rounded-lg border border-[#E8B245] relative flex flex-col items-center justify-center mx-auto">
            <button
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[#E8B245] cursor-pointer hover:text-white"
              onClick={() => setSelectedEnquiry(null)}
            >
              <FiX size={24} />
            </button>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">View Enquiry</h3>
            <div className="space-y-2 w-full text-xs sm:text-sm md:text-base">
              {Object.entries(selectedEnquiry)
                .filter(([key]) => !["_id", "createdAt", "updatedAt", "__v"].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="border-b border-[#E8B245] pb-1">
                    <strong className="capitalize">{key}:</strong>{" "}
                    <span className="text-white break-words">{String(value)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-[#1a1a1a] text-[#E8B245] w-full max-w-xs sm:max-w-sm p-4 sm:p-6 rounded-lg border border-[#E8B245] text-center flex flex-col items-center justify-center mx-auto">
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Confirm Delete</h3>
            <p className="mb-2 sm:mb-4">Are you sure you want to delete <span className="font-semibold">{confirmDelete.name}</span>?</p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 w-full">
              <button
                className="px-4 py-2 bg-red-600 text-white cursor-pointer rounded hover:bg-red-700 w-full sm:w-auto"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 border border-[#E8B245] text-[#E8B245] cursor-pointer rounded hover:bg-[#E8B245] hover:text-black w-full sm:w-auto"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiry;