import { useToast } from "@/context/ToastContext";
import {
  fetchGallery,
  uploadGalleryImage,
} from "@/V2/app/features/gallery/galleryAsyncThunk";
import { galleryCategories, STATUS } from "@/V2/config";
import { X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";

export function UploadImag() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const { showToast } = useToast();
  const { status } = useSelector((s) => s.gallery);
  const loading = status === STATUS.LOADING;

  const onDrop = useCallback((accepted) => {
    const selected = accepted[0];
    if (selected) {
      setFile(selected);
    }
  }, []);
  const dispatch = useDispatch();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      showToast("Please select an image to upload!", "error");
      return;
    }

    if (!category) {
      showToast("Category is required!", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      await dispatch(uploadGalleryImage(formData)).unwrap();

      showToast("Image uploaded successfully!", "success");
      // refetching the images
      dispatch(fetchGallery());

      setOpen(false);
      setFile(null);
      setCategory("");
    } catch (_) {
      showToast("Failed to upload image. Please try again!", "error");
    }
  };

  return (
    <section className="flex items-center justify-center ">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="text-2xl font-bold cursor-pointer p-12 border-1 rounded-md w-full bg-[#9224210D]"
        >
          Upload New Image
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg w-full max-w-2xl mx-4 shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <button type="button" onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
              <h2 className="text-lg font-semibold">Upload New Image</h2>
              <button
                type="submit"
                disabled={!file || loading}
                className="bg-black text-white px-4 py-1 rounded hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-8 space-y-8">
              {/* Drop Zone */}
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed ${
                  isDragActive ? "border-black" : "border-gray-300"
                } bg-gray-50 h-40 flex items-center justify-center text-gray-500 rounded-md cursor-pointer overflow-hidden`}
              >
                <input {...getInputProps()} />

                {file && (
                  <>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-contain z-0"
                    />

                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-sm px-3 py-1 z-10 truncate">
                      {file.name}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="absolute top-2 right-2 z-10 bg-white rounded-full p-[2px] hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 text-black" />
                    </button>
                  </>
                )}

                {!file && (
                  <span className="z-10 text-center px-2">
                    Drop or select an image
                  </span>
                )}
              </div>

              {/* Category Dropdown Only */}
              <div className="space-y-4">
                <h3 className="text-center text-xl font-semibold">
                  High Light Section
                </h3>

                <label className="flex flex-col">
                  <span className="mb-1 text-sm font-medium text-gray-700">
                    Type
                  </span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-2 py-1 border rounded-md"
                  >
                    <option value="">Select type…</option>
                    {galleryCategories.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
