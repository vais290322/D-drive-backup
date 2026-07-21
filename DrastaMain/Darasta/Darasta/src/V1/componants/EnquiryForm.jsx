// components/EnquiryModal.js
import React from "react";

const EnquiryModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-3xl rounded shadow-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Enquiry Form</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Contact No"
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Subject"
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Enquiry"
            className="border p-2 rounded col-span-1 md:col-span-2 h-32 resize-none"
          />
          <div className="col-span-1 md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-[#96C346] hover:bg-[#7ea733] text-white font-semibold px-6 py-2 rounded"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;
