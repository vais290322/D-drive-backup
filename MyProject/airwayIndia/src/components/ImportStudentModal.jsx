import React, { useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
// Template file should be in the public folder (e.g. public/student_upload_template.xlsx)
const templateUrl = "/student_upload_template (1).xlsx";
const ImportStudentModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  if (!isOpen) return null;
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.match(/\.(xlsx|xls)$/i)) {
      setError("Please select a valid Excel file (.xlsx or .xls)");
      setSelectedFile(null);
      return;
    }
    setError("");
    setSelectedFile(file);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }
    onSubmit(selectedFile);
    setSelectedFile(null);
  };
  const handleCancel = () => {
    setSelectedFile(null);
    setError("");
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          onClick={handleCancel}
        >
          &times;
        </button>
        {/* Title */}
        <h2 className="text-lg font-semibold mb-4 text-center text-red-700">
          Upload Student List - Excel File
        </h2>
        {/* File Drop Zone */}
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-red-400 rounded-lg p-6 bg-red-600 text-white cursor-pointer mb-4"
          onClick={() => fileInputRef.current.click()}
        >
          <span className="text-3xl mb-2">
  <FaFileUpload size={40} />
</span>
          <span>{selectedFile ? selectedFile.name : "Select Your File in Excel"}</span>
          <input
            type="file"
            accept=".xlsx,.xls"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm mb-2 text-center">{error}</div>
        )}
        {/* Buttons */}
        <div className="flex justify-between gap-2 mt-4">
          <a
            href={templateUrl}
            download
            className="w-full px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 text-center font-medium"
          >
            Download Template
          </a>
          <button
            type="button"
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 font-medium"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 font-medium"
            onClick={handleSubmit}
            disabled={!selectedFile}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
export default ImportStudentModal;









