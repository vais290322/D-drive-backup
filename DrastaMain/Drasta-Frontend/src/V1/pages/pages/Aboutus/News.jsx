import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlus, FiEye, FiSearch, FiX } from "react-icons/fi";

const baseUrl = import.meta.env.VITE_REACT_BASE_URL;
const ITEMS_PER_PAGE = 10;
const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);
  const [editNews, setEditNews] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", readMoreLink: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/news`);
      const data = await res.json();
      setNewsList(data.news || []);
    } catch (err) {
      setError("Failed to fetch news");
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        readMoreLink: formData.readMoreLink
      };
      const res = await fetch(`${baseUrl}/news`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add news");
      setFormData({ title: "", content: "", readMoreLink: "" });
      setShowForm(false);
      fetchNews();
    } catch (err) {
      alert("Add failed");
    }
  };

  const handleEditNews = (news) => {
    setEditNews(news);
    setFormData({
      title: news.title || "",
      content: news.content || "",
      readMoreLink: news.readMoreLink || ""
    });
    setShowForm(true);
  };

  const handleUpdateNews = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        readMoreLink: formData.readMoreLink
      };
      const res = await fetch(`${baseUrl}/news/${editNews._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update news");
      setEditNews(null);
      setFormData({ title: "", content: "", readMoreLink: "" });
      setShowForm(false);
      fetchNews();
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDeleteNews = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/news/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete news");
      fetchNews();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredNews = newsList.filter((news) =>
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-black text-[#E8B245] px-2 sm:px-4 py-6 sm:py-8">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 border-b-2 border-[#E8B245] pb-2">News</h2>

      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-4 justify-between w-full">
        <div className="flex items-center bg-[#1a1a1a] border border-[#E8B245] rounded px-2 py-1 w-full max-w-full sm:max-w-md">
          <FiSearch className="text-[#E8B245] mr-2" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-[#E8B245] text-sm sm:text-base"
          />
        </div>
        <button
          className="px-3 sm:px-4 py-2 bg-[#E8B245] text-black rounded flex items-center gap-2 font-semibold hover:bg-yellow-600 cursor-pointer w-full sm:w-auto"
          onClick={() => { setShowForm(true); setEditNews(null); setFormData({ title: "", content: "" }); }}
        >
          <FiPlus /> Add News
        </button>
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
        <div className="overflow-x-auto rounded-lg border border-[#E8B245]">
          <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
            <thead className="bg-[#E8B245] text-black">
              <tr>
                <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Title</th>
                <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Content</th>
                <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Read More</th>
                <th className="py-2 px-2 sm:px-4 border border-black whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedNews.map((news) => (
                <tr key={news._id} className="hover:bg-[#2a2a2a] transition-colors duration-200">
                  <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[120px] md:max-w-none">{news.title}</td>
                  <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[160px] md:max-w-none">{news.content && news.content.length > 50 ? news.content.slice(0, 50) + '...' : news.content}</td>
                  <td className="py-2 px-2 sm:px-4 border border-[#E8B245] break-words max-w-[140px] md:max-w-none">
                    {news.readMoreLink ? (
                      <a href={news.readMoreLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline cursor-pointer break-all">Read More</a>
                    ) : "-"
                    }
                  </td>
                  <td className="py-2 px-2 sm:px-4 border border-[#E8B245] text-center space-x-2">
                    <button
                      className="text-[#E8B245] hover:text-white cursor-pointer"
                      onClick={() => setSelectedNews(news)}
                    >
                      <FiEye />
                    </button>
                    <button
                      className="text-blue-500 hover:text-white cursor-pointer"
                      onClick={() => handleEditNews(news)}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-white cursor-pointer"
                      onClick={() => setConfirmDelete(news)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
        <p className="text-xs sm:text-sm">
          Showing {paginatedNews.length} of {filteredNews.length} entries
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

      {/* View Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-[#1a1a1a] text-[#E8B245] w-full max-w-lg p-6 rounded-lg border border-[#E8B245] relative flex flex-col items-center justify-center mx-auto">
            <button
              className="absolute top-3 right-3 text-[#E8B245] cursor-pointer hover:text-white"
              onClick={() => setSelectedNews(null)}
            >
              <FiX size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-4">View News</h3>
            <div className="space-y-2 w-full">
              <div className="border-b border-[#E8B245] pb-1">
                <strong>Title:</strong> <span className="text-white">{selectedNews.title}</span>
              </div>
              <div className="border-b border-[#E8B245] pb-1">
                <strong>Content:</strong> <span className="text-white break-words whitespace-pre-line">{selectedNews.content}</span>
              </div>
              <div className="border-b border-[#E8B245] pb-1">
                <strong>Read More:</strong> {selectedNews.readMoreLink ? (
                  <a href={selectedNews.readMoreLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline break-all">{selectedNews.readMoreLink}</a>
                ) : <span className="text-white">-</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-[#1a1a1a] text-[#E8B245] w-full max-w-md p-6 rounded-lg border border-[#E8B245] relative flex flex-col items-center justify-center mx-auto">
            <button
              className="absolute top-3 right-3 text-[#E8B245] cursor-pointer hover:text-white"
              onClick={() => { setShowForm(false); setEditNews(null); setFormData({ title: "", content: "" }); }}
            >
              <FiX size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4">{editNews ? "Edit News" : "Add News"}</h3>
            <form onSubmit={editNews ? handleUpdateNews : handleAddNews} className="w-full space-y-4">
              <div>
                <label className="block mb-1 font-semibold">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded bg-black border border-[#E8B245] text-[#E8B245] focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 rounded bg-black border border-[#E8B245] text-[#E8B245] focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Read More Link</label>
                <input
                  type="url"
                  name="readMoreLink"
                  value={formData.readMoreLink}
                  onChange={handleInputChange}
                  placeholder="https://example.com/news"
                  className="w-full px-3 py-2 rounded bg-black border border-[#E8B245] text-[#E8B245] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E8B245] text-black rounded font-semibold hover:bg-yellow-600 cursor-pointer"
                >
                  {editNews ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-[#E8B245] text-[#E8B245] rounded font-semibold hover:bg-[#E8B245] hover:text-black cursor-pointer"
                  onClick={() => { setShowForm(false); setEditNews(null); setFormData({ title: "", content: "" }); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-[#1a1a1a] text-[#E8B245] w-full max-w-sm p-6 rounded-lg border border-[#E8B245] text-center flex flex-col items-center justify-center mx-auto">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete <span className="font-semibold">{confirmDelete.title}</span>?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-red-600 text-white cursor-pointer rounded hover:bg-red-700"
                onClick={async () => { await handleDeleteNews(confirmDelete._id); setConfirmDelete(null); }}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 border border-[#E8B245] text-[#E8B245] cursor-pointer rounded hover:bg-[#E8B245] hover:text-black"
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

export default News;