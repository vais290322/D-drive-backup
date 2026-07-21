import React, { useEffect, useState } from "react";
import { FiEye, FiTrash2, FiUpload, FiEdit, FiX,FiSearch } from "react-icons/fi";

const baseUrl = import.meta.env.VITE_REACT_BASE_URL;

const Slider = () => {
  // Helper to refetch images
  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/sliders`);
      const data = await res.json();
      if (Array.isArray(data.slides)) {
        setImages(data.slides);
        setFilteredImages(data.slides);
      } else if (data.slides) {
        setImages([data.slides]);
        setFilteredImages([data.slides]);
      } else {
        setImages([]);
        setFilteredImages([]);
      }
    } catch (err) {
      setError("Failed to fetch images");
    }
    setLoading(false);
  };
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const results = images.filter(img => {
      const searchStr = (img._id + (img.imageUrl || img.url)).toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    });
    setFilteredImages(results);
    setCurrentPage(1);
  }, [searchTerm, images]);

  const paginatedData = filteredImages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleUpload = async () => {
    if (!file || !title.trim() || !subtitle.trim()) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      const res = await fetch(`${baseUrl}/sliders`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload image");
      const data = await res.json();
      // Refetch images after upload
      await fetchImages();
      setFile(null);
      setTitle("");
      setSubtitle("");
      setAddMode(false);
      // Clear file input value
      if (document.getElementById('slider-file-input')) {
        document.getElementById('slider-file-input').value = "";
      }
    } catch (err) {
      setError("Upload failed");
    }
    setUploading(false);
  };

  const handleEdit = (img) => {
    setEditMode(true);
    setEditId(img._id);
    setEditTitle(img.title || "");
    setEditSubtitle(img.subtitle || "");
    setFile(null);
  };

  const handleUpdate = async () => {
    if (!file || !editId || !editTitle.trim() || !editSubtitle.trim()) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", editTitle);
      formData.append("subtitle", editSubtitle);
      const res = await fetch(`${baseUrl}/sliders/${editId}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update image");
      const data = await res.json();
      // Refetch images after update
      await fetchImages();
      setEditMode(false);
      setEditId(null);
      setFile(null);
      setEditTitle("");
      setEditSubtitle("");
      // Clear file input value
      if (document.getElementById('slider-edit-file-input')) {
        document.getElementById('slider-edit-file-input').value = "";
      }
    } catch (err) {
      setError("Update failed");
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/sliders/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete image");
      const data = await res.json();
      // Refetch images after delete
      await fetchImages();
    } catch (err) {
      setError("Delete failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-black text-[#E8B245] px-2 sm:px-4 py-6 sm:py-8 flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 border-b-2 border-[#E8B245] pb-2 w-full text-center">Slider Images</h2>
      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center w-full max-w-4xl mx-auto mb-4 sm:mb-6 gap-2 sm:gap-4">
        <div className="flex items-center bg-[#1a1a1a] border border-[#E8B245] rounded px-2 py-1 w-full max-w-full sm:max-w-md">
          <FiSearch className="text-[#E8B245] mr-2" />
          <input
            type="text"
            placeholder="Search by id or url..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-[#E8B245] text-sm sm:text-base"
          />
        </div>
        <button
          className="px-3 sm:px-4 py-2 bg-[#E8B245] text-black rounded hover:bg-[#cfa23c] font-bold cursor-pointer w-full sm:w-auto"
          onClick={() => { setAddMode(true); setFile(null); }}
        >
          <FiUpload className="inline-block mr-2" /> Add Image
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
        <>
      {/* Image Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        {paginatedData.length === 0 ? (
          <div className="col-span-full text-center text-base sm:text-lg text-white">No images found.</div>
        ) : (
          paginatedData.map((img) => (
            <div key={img._id} className="bg-[#181818] border border-[#E8B245] rounded-lg p-2 sm:p-4 flex flex-col items-center">
              <img
                src={img.image || img.imageUrl || img.url}
                alt="slider"
                className="w-full h-32 sm:h-40 object-cover rounded mb-2 cursor-pointer border border-[#E8B245]"
                onClick={() => setSelectedImage(img)}
              />
              <div className="w-full text-center text-[#E8B245] font-semibold mb-1 truncate text-xs sm:text-base" title={img.title}>{img.title || "No Title"}</div>
              <div className="w-full text-center text-[#E8B245] text-xs sm:text-sm mb-2 truncate" title={img.subtitle}>{img.subtitle || "No Subtitle"}</div>
              <div className="flex gap-2">
                {/* View button removed */}
                <button
                  className="text-blue-500 hover:text-white cursor-pointer"
                  onClick={() => handleEdit(img)}
                  title="Edit"
                >
                  <FiEdit />
                </button>
                <button
                  className="text-red-500 hover:text-white cursor-pointer"
                  onClick={() => setConfirmDeleteId(img._id)}
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 w-full max-w-4xl mx-auto gap-2">
            <p className="text-xs sm:text-sm">
              Showing {paginatedData.length} of {filteredImages.length} images
            </p>
            <div className="flex items-center space-x-2">
              <button
                className="px-2 sm:px-3 py-1 border border-[#E8B245] rounded text-[#E8B245] disabled:opacity-50 cursor-pointer text-xs sm:text-base"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="px-2 text-xs sm:text-base">{currentPage} / {totalPages}</span>
              <button
                className="px-2 sm:px-3 py-1 border border-[#E8B245] rounded text-[#E8B245] disabled:opacity-50 cursor-pointer text-xs sm:text-base"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-[#181818] text-[#E8B245] w-full max-w-sm p-6 rounded-lg border border-[#E8B245] relative flex flex-col items-center justify-center mx-auto">
            <button
              className="absolute top-3 right-3 text-[#E8B245] cursor-pointer hover:text-white"
              onClick={() => setConfirmDeleteId(null)}
            >
              <FiX size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">Confirm Deletion</h3>
            <p className="mb-6 text-center">Are you sure you want to delete this image?</p>
            <div className="flex gap-4 w-full justify-center">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded font-bold cursor-pointer hover:bg-red-700"
                onClick={async () => { await handleDelete(confirmDeleteId); setConfirmDeleteId(null); }}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded font-bold cursor-pointer hover:bg-gray-900"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {addMode && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-[#181818] text-[#E8B245] w-full max-w-lg p-6 rounded-lg border border-[#E8B245] relative flex flex-col items-center justify-center mx-auto">
            <button
              className="absolute top-3 right-3 text-[#E8B245] cursor-pointer hover:text-white"
              onClick={() => { setAddMode(false); setFile(null); setTitle(""); setSubtitle(""); }}
            >
              <FiX size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-4">Add Image</h3>
            <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mb-4 w-full px-3 py-2 rounded border border-[#E8B245] bg-black text-[#E8B245]"
            />
            <input
              type="text"
              placeholder="Enter subtitle"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              className="mb-4 w-full px-3 py-2 rounded border border-[#E8B245] bg-black text-[#E8B245]"
            />
            <label className="mb-4 w-full flex items-center border border-[#E8B245] rounded px-3 py-2 bg-black cursor-pointer">
              <FiUpload className="text-[#E8B245] mr-2" />
              <input
                id="slider-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-white w-full bg-black focus:outline-none cursor-pointer"
                style={{ display: 'inline-block' }}
              />
            </label>
            <button
              className="w-full px-4 py-2 bg-[#E8B245] text-black rounded hover:bg-[#cfa23c] font-bold cursor-pointer"
              onClick={handleUpload}
              disabled={uploading || !file || !title.trim() || !subtitle.trim()}
            >
              {uploading ? (
                <svg className="animate-spin h-5 w-5 text-black inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="black" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="black" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : null}
              Upload
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-[#181818] text-[#E8B245] w-full max-w-lg p-6 rounded-lg border border-[#E8B245] relative flex flex-col items-center justify-center mx-auto">
            <button
              className="absolute top-3 right-3 text-[#E8B245] cursor-pointer hover:text-white"
              onClick={() => { setEditMode(false); setEditId(null); setFile(null); setEditTitle(""); setEditSubtitle(""); }}
            >
              <FiX size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-4">Edit Image</h3>
            <input
              type="text"
              placeholder="Edit title"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              className="mb-4 w-full px-3 py-2 rounded border border-[#E8B245] bg-black text-[#E8B245]"
            />
            <input
              type="text"
              placeholder="Edit subtitle"
              value={editSubtitle}
              onChange={e => setEditSubtitle(e.target.value)}
              className="mb-4 w-full px-3 py-2 rounded border border-[#E8B245] bg-black text-[#E8B245]"
            />
            <label className="mb-4 w-full flex items-center border border-[#E8B245] rounded px-3 py-2 bg-black cursor-pointer">
              <FiUpload className="text-[#E8B245] mr-2" />
              <input
                id="slider-edit-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-white w-full bg-black focus:outline-none cursor-pointer"
                style={{ display: 'inline-block' }}
              />
            </label>
            <button
              className="w-full px-4 py-2 bg-[#E8B245] text-black rounded hover:bg-[#cfa23c] font-bold cursor-pointer"
              onClick={handleUpdate}
              disabled={uploading || !file || !editTitle.trim() || !editSubtitle.trim()}
            >
              {uploading ? (
                <svg className="animate-spin h-5 w-5 text-black inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="black" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="black" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              ) : null}
              Save
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );

}
export default Slider;