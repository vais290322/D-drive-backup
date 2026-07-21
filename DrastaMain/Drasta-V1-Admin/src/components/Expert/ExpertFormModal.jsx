import React, { useState, useEffect } from "react";
import { Pencil, Trash, X } from "lucide-react";

const ExpertFormModal = ({ open, onClose, onSubmit, initialData }) => {
  const [fileName, setFileName] = useState('No file selected');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    expertise: "",
    image: null, 
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ 
        ...initialData, 
        image: null // Reset to null when editing to allow new file selection
      });
      setFileName(initialData.image ? 'Image selected' : 'No file selected');
    } else {
      setFormData({ name: "", title: "", expertise: "", image: null });
      setFileName('No file selected');
    }
  }, [initialData]);

const handleChange = (e) => {
  const { name, value, files } = e.target;
  const file = files ? files[0] : null;

  if (name === "image" && file) {
    setFileName(file.name);
    setFormData((prev) => ({ ...prev, image: file }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value.trimStart()
    }));
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const formPayload = new FormData();
    formPayload.append("name", formData.name.trim());
    formPayload.append("title", formData.title.trim());
    formPayload.append("expertise", formData.expertise.trim());

    if (formData.image) {
      formPayload.append("image", formData.image);
    }

    await onSubmit(formPayload, !!initialData); 
    setFormData({ name: "", title: "", expertise: "", image: null });
    setFileName('No file selected');
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
          {initialData ? "Edit Expert" : "Add Expert"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Name<span className="text-red-600">*</span></label>
            <input
              type="text"
              name="name"
              placeholder="Expert name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block mb-2">Title<span className="text-red-600">*</span></label>
            <input
              type="text"
              name="title"
              placeholder="Expert title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block mb-2">Expertise<span className="text-red-600">*</span></label>
            <textarea
              name="expertise"
              placeholder="Areas of expertise"
              value={formData.expertise}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* File Upload Section */}
          <div>
            <label className="block mb-2">Image</label>
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

          {/* Submit Button with Loader */}
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

export default ExpertFormModal;
