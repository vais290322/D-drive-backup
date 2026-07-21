import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const FormModal = ({ open, onClose, onSubmit, initialData }) => {
  const [fileName, setFileName] = useState('No file selected');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        position: initialData.position || "",
        description: initialData.description || "",
        image: null,
      });
      setFileName(initialData.image ? "Image selected" : "No file selected");
    } else {
      setFormData({ name: "", position: "", description: "", image: null });
      setFileName("No file selected");
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
      setFileName(files[0].name);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name.trim());
      fd.append("position", formData.position.trim());
      fd.append("description", formData.description.trim());
      if (formData.image) {
        fd.append("image", formData.image);
      }
      await onSubmit(fd);
      setFormData({ name: "", position: "", description: "", image: null });
      setFileName("No file selected");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm bg-opacity-30 flex justify-center items-center z-50">
      <div className="relative bg-white text-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
          disabled={isSubmitting}
        >
          <X size={24} />
        </button>

        <h3 className="text-xl font-semibold mb-6">
          {initialData ? "Edit Admin" : "Add Admin"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block mb-2"><span className="text-red-600">*</span>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Admin name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block mb-2"><span className="text-red-600">*</span>Position</label>
            <input
              type="text"
              name="position"
              placeholder="Admin position"
              value={formData.position}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block mb-2"><span className="text-red-600">*</span>Description</label>
            <textarea
              name="description"
              placeholder="Admin description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block mb-2"><span className="text-red-600">*</span>Image</label>
            <div className="border border-gray-300 rounded-lg p-3 transition-all hover:border-blue-400">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label
                  className={`w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md cursor-pointer transition duration-200 flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Select Image
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    required={!initialData}
                    disabled={isSubmitting}
                  />
                </label>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate px-3 py-2">
                    {fileName || "No file selected"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className={`bg-blue-600 text-white px-6 py-2 rounded-md flex items-center justify-center min-w-24 ${
                isSubmitting ? "opacity-75" : "hover:bg-blue-700"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : initialData ? (
                "Update"
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;