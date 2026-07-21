import React, { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export function BlogFormUI({
  title,
  setTitle,
  content,
  setContent,
  bannerFile,
  setBannerFile,
  bannerPreview,
  setBannerPreview,
  popular,
  setPopular,
  publish,
  setPublish,
  errors
}) {
  const quillRef = useRef(null);

  useEffect(() => {
    if (bannerFile) {
      const reader = new FileReader();
      reader.onloadend = () => setBannerPreview(reader.result);
      reader.readAsDataURL(bannerFile);
    }
  }, [bannerFile, setBannerPreview]);

  return (
    <div className="flex flex-col space-y-6 w-full">
      {/* Banner */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-2">Banner Image</label>
        <div className="relative border-2 border-gray-200 rounded-lg h-48 flex items-center justify-center cursor-pointer hover:border-gray-400 transition">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => setBannerFile(e.target.files[0])}
          />
          {bannerPreview ? (
            <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <p className="text-gray-400">Upload or drop image</p>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1E3F]"
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-2">Content</label>
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          modules={{ toolbar: [["bold", "italic"], [{ list: "bullet" }], ["link"]] }}
          className="h-56 rounded"
        />
        {errors.content && <p className="text-xs text-red-500 mt-14">{errors.content}</p>}
      </div>

      {/* Toggles */}
      <div className="flex space-x-6 mt-8">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={popular}
            onChange={() => {
              const newPopular = !popular;
              setPopular(newPopular);
              if (newPopular) setPublish(true);
            }}
            className="h-4 w-4"
          />
          <span className="text-sm text-gray-700">Popular</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={publish}
            onChange={() => !popular && setPublish(prev => !prev)}
            disabled={popular}
            className="h-4 w-4"
          />
          <span className="text-sm text-gray-700">Published</span>
        </label>
      </div>
    </div>
  );
}
