import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { STATUS } from "@/V2/config";

export function BlogForm({
  initialTitle = "",
  initialContent = "",
  initialBanner = null,
  onSubmit,
  submitText = "Publish Blog Post",
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [bannerFile, setBannerFile] = useState(initialBanner);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({ title: "", content: "" });

  const quillRef = useRef(null);
  const { status } = useSelector((s) => s.blogs);

  useEffect(() => {
    if (bannerFile) {
      if (typeof bannerFile === "string") {
        setBannerPreview(bannerFile);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => setBannerPreview(reader.result);
        reader.readAsDataURL(bannerFile);
      }
    } else {
      setBannerPreview(null);
    }
  }, [bannerFile]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = { title: "", content: "" };
    let hasError = false;

    if (!title.trim()) {
      errors.title = "Title is required";
      hasError = true;
    }

    if (!content.trim() || content === "<p><br></p>") {
      errors.content = "Content is required";
      hasError = true;
    }

    setFieldErrors(errors);


    const payload = new FormData();
    payload.append("title", title);
    payload.append("content", content);

    if (bannerFile && typeof bannerFile !== "string") {
      payload.append("bannerImage", bannerFile);
    }

    onSubmit(payload);
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-white rounded-2xl shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Banner Upload */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-base sm:text-lg font-semibold text-[var(--text-color)] mb-2">
            Banner Image
          </label>
          <div className="relative border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[var(--primary-color)] transition-colors">
            {!bannerPreview && (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-400">Click or drop image here</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBannerFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {bannerPreview && (
              <img
                src={bannerPreview}
                alt="Banner Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>
        </motion.div>

        {/* Title Field */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-base sm:text-xl font-bold mb-2 text-[var(--text-color)]">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (fieldErrors.title) setFieldErrors((prev) => ({ ...prev, title: "" }));
            }}
            placeholder="Enter blog title"
            className="w-full px-4 py-3 text-lg sm:text-xl font-medium rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
          />
          {fieldErrors.title && (
            <p className="mt-1 text-sm text-red-500">{fieldErrors.title}</p>
          )}
        </motion.div>

        {/* Content Editor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <label className="block text-base sm:text-xl font-bold mb-2 text-[var(--text-color)]">
            Content
          </label>
          <ReactQuill
            ref={quillRef}
            value={content}
            onChange={(val) => {
              setContent(val);
              if (fieldErrors.content) setFieldErrors((prev) => ({ ...prev, content: "" }));
            }}
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image", "code-block"],
                ["clean"],
              ],
            }}
            formats={[
              "header",
              "bold",
              "italic",
              "underline",
              "list",
              "bullet",
              "link",
              "image",
              "code-block",
            ]}
            theme="snow"
            className="h-[50vh] text-base sm:text-lg rounded-lg mb-8"
          />
          {fieldErrors.content && (
            <p className="mt-2 text-sm text-red-500">{fieldErrors.content}</p>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className=" w-full py-3 bg-[var(--primary-color)] text-white rounded-lg text-base sm:text-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {status.update === STATUS.LOADING || status.create === STATUS.LOADING
            ? "Loading..."
            : submitText}
        </motion.button>
      </form>
    </motion.div>
  );
}
