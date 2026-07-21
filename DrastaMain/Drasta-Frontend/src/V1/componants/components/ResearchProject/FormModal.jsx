import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const FormModal = ({ open, onClose, onSubmit, initialData }) => {
  const [fileName, setFileName] = useState('No file selected');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pdfLink: "",
    image: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        pdfLink: initialData.pdfLink || "",
        image: null,
      });
      setFileName(initialData.image ? "Image selected" : "No file selected");
    } else {
      setFormData({ title: "", description: "", pdfLink: "", image: null });
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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const fd = new FormData();
//       fd.append("title", formData.title.trim());
//       fd.append("description", formData.description.trim());
//       fd.append("pdfLink", formData.pdfLink.trim());
//       if (formData.image) {
//         fd.append("image", formData.image);
//       }
//       await onSubmit(fd);
//       setFormData({ title: "", description: "", pdfLink: "", image: null });
//       setFileName("No file selected");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const fd = new FormData();
    fd.append("title", formData.title.trim());
    fd.append("description", formData.description.trim());
    
    // Always include pdfLink (empty string if not provided)
    fd.append("pdfLink", formData.pdfLink.trim());
    
    // Explicitly handle image null case
    if (formData.image) {
      fd.append("image", formData.image);
    } else {
      // Append null as a string (backend should parse this)
      fd.append("image", "null");
    }
    
    await onSubmit(fd);
    setFormData({ title: "", description: "", pdfLink: "", image: null });
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
          {initialData ? "Edit Project" : "Add Project"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block mb-2">Title<span className="text-red-600">*</span></label>
            <textarea
              name="title"
              placeholder="Project title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              rows="2"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block mb-2">Description<span className="text-red-600">*</span></label>
            <textarea
              name="description"
              placeholder="Project description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              rows="3"
              required
              disabled={isSubmitting}
            />
          </div>
        <div>
            <label className="block mb-2">PDF Link</label>
            <input
              type="text"
              name="pdfLink"
              placeholder="PDF Link"
              value={formData.pdfLink}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block mb-2">Image<span className="text-red-600">*</span></label>
            <div className="border border-gray-300 rounded-lg p-3">
              <label
                className={`w-full px-6 py-2 bg-blue-600 text-white rounded-md cursor-pointer flex items-center justify-center gap-2 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
              >
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
              <div className="text-sm text-gray-700 px-3 py-2">{fileName}</div>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className={`bg-blue-600 text-white px-6 py-2 rounded-md min-w-24 ${
                isSubmitting ? "opacity-75" : "hover:bg-blue-700"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;