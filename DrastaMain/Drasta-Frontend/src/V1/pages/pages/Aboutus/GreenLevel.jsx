import React, { useEffect, useState } from "react";
import { FiEye, FiTrash2, FiSearch, FiX } from "react-icons/fi";

const baseUrl = import.meta.env.VITE_REACT_BASE_URL;
const ITEMS_PER_PAGE = 10;

const GreenLevel = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${baseUrl}/greenlabel`);
        const data = await res.json();
        setEntries(data.entries || []);
        setFilteredEntries(data.entries || []);
      } catch (err) {
        setError("Failed to fetch data");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = entries.filter((entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEntries(results);
    setCurrentPage(1);
  }, [searchTerm, entries]);

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`${baseUrl}/greenlabel/${confirmDelete._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      const updated = entries.filter((entry) => entry._id !== confirmDelete._id);
      setEntries(updated);
      setFilteredEntries(updated);
      setConfirmDelete(null);
    } catch (err) {
      alert("Delete failed");
    }
  };

  const paginatedData = filteredEntries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-black text-[#E8B245] px-2 sm:px-4 py-6 sm:py-8">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 border-b-2 border-[#E8B245] pb-2">Green Level Entries</h2>

      {/* Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-4 w-full">
        <div className="flex items-center bg-[#1a1a1a] border border-[#E8B245] rounded px-2 py-1 w-full max-w-full sm:max-w-md">
          <FiSearch className="text-[#E8B245] mr-2" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-[#E8B245] text-sm sm:text-base"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-24 sm:h-32">
          <svg className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-[#E8B245] mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#E8B245" strokeWidth="4"></circle>
            <path className="opacity-75" fill="#E8B245" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="text-[#E8B245] text-base sm:text-lg">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-[#E8B245]">
            <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
              <thead className="bg-[#E8B245] text-black">
                <tr>
                  <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Name</th>
                  <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Sex</th>
                  <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Occupation</th>
                  <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">State</th>
                  <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Contact</th>
                  <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Cell No</th>
                  <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Email</th>
                  <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Comments</th>
                  <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((entry) => (
                  <tr
                    key={entry._id}
                    className="hover:bg-[#2a2a2a] transition-colors duration-200"
                  >
                    <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[120px] md:max-w-none">{entry.name}</td>
                    <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[80px] md:max-w-none">{entry.sex}</td>
                    <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[120px] md:max-w-none">{entry.occupation}</td>
                    <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[100px] md:max-w-none">{entry.stateOfResidence}</td>
                    <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[120px] md:max-w-none">{entry.contactDetails}</td>
                    <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[100px] md:max-w-none">{entry.cellNo}</td>
                    <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[140px] md:max-w-none">{entry.email}</td>
                    <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[160px] md:max-w-none">{entry.comments && entry.comments.length > 20 ? entry.comments.slice(0, 20) + '...' : entry.comments}</td>
                    <td className="py-2 px-2 sm:px-4 border border-[#E8B245] text-center space-x-2">
                      <button
                        className="text-[#E8B245] hover:text-white cursor-pointer"
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <FiEye />
                      </button>
                      <button
                        className="text-red-500 hover:text-white cursor-pointer"
                        onClick={() => setConfirmDelete(entry)}
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
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
            <p className="text-xs sm:text-sm">
              Showing {paginatedData.length} of {filteredEntries.length} entries
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-1 border border-[#E8B245] rounded text-[#E8B245] disabled:opacity-50 cursor-pointer text-xs sm:text-base"
              >
                Previous
              </button>
              <span className="px-2 text-xs sm:text-base">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-3 py-1 border border-[#E8B245] rounded text-[#E8B245] disabled:opacity-50 cursor-pointer text-xs sm:text-base"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* View Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-all duration-300 px-2">
          <div className="bg-[#1a1a1a] text-[#E8B245] w-full max-w-xs sm:max-w-lg p-4 sm:p-6 rounded-lg border border-[#E8B245] relative flex flex-col items-center justify-center mx-auto">
            <button
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[#E8B245] cursor-pointer hover:text-white"
              onClick={() => setSelectedEntry(null)}
            >
              <FiX size={24} />
            </button>
            <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">View Entry</h3>
            <div className="space-y-2 w-full text-xs sm:text-sm md:text-base">
              {Object.entries(selectedEntry)
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-all duration-300 px-2">
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

export default GreenLevel;
