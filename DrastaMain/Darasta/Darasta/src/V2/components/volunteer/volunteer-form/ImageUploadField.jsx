import { UploadCloud, X } from "lucide-react";

export function ImageUploadField({ 
  file, 
  setFile, 
  imageError, 
  setImageError, 
  dropRef,
  onFileChange,
  handleDrop,
  handleDragOver,
  handleDragLeave 
}) {
  return (
    <div className="col-span-1 flex flex-col h-full">
      <label className="mb-1">Upload Your Image</label>

      <div className="relative w-full rounded-md overflow-hidden flex justify-end bg-white">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            onFileChange(e);
            if (setImageError) setImageError("");
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="px-3 py-2 bg-[#F5DDDD] text-center text-black">
          {file ? file.name : "Choose A File"}
        </div>
      </div>

      <div
        ref={dropRef}
        onDrop={(e) => {
          handleDrop(e);
          if (setImageError) setImageError("");
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`mt-4 border border-red-200 bg-[#f6dbd9] rounded-md flex flex-col items-center justify-center p-4 flex-1 relative`}
      >
        {file ? (
          <>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-[var(--primary-color)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={URL.createObjectURL(file)} alt="Selected" className="w-24 h-24 object-cover rounded-full mb-2" />
          </>
        ) : (
          <>
            <UploadCloud className="w-6 h-6 text-gray-500 mb-2" />
            <p className="text-sm text-red-700">Drop Your Image</p>
          </>
        )}
      </div>

      {imageError && <span className="text-sm text-red-600 mt-2">{imageError}</span>}
    </div>
  );
}
