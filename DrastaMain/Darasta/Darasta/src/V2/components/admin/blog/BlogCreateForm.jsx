import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BlogFormUI } from "./BlogFormUI";

export function BlogCreateForm({ onSubmit, submitText = "Create Blog" }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [popular, setPopular] = useState(false);
  const [publish, setPublish] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bannerFile) {
      const reader = new FileReader();
      reader.onloadend = () => setBannerPreview(reader.result);
      reader.readAsDataURL(bannerFile);
    }
  }, [bannerFile]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = "Title is required.";
    if (!content.trim() || content === "<p><br></p>") errs.content = "Content cannot be empty.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setBannerFile(null);
    setBannerPreview(null);
    setPopular(false);
    setPublish(false);
    setErrors({});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (popular) formData.append("popular", popular);
    if (publish) formData.append("publish", publish);
    if (bannerFile) formData.append("bannerImage", bannerFile);
    await onSubmit(formData, resetForm);
    setLoading(false);
  };

  return (
    <motion.div className="max-w-2xl w-full mx-auto bg-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <BlogFormUI
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          bannerFile={bannerFile}
          setBannerFile={setBannerFile}
          bannerPreview={bannerPreview}
          setBannerPreview={setBannerPreview}
          popular={popular}
          setPopular={setPopular}
          publish={publish}
          setPublish={setPublish}
          errors={errors}
        />
        <motion.button
          type="submit"
          className="w-full py-3 bg-[#8B1E3F] text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          {loading ? `${submitText.split(' ')[0]}ing...` : submitText}
        </motion.button>
      </form>
    </motion.div>
  );
}
