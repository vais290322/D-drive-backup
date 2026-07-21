import React from "react";
import { X } from "lucide-react";

const ViewContact = ({ contact, onClose }) => {
  if (!contact) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm " />
      <div className="flex items-center justify-center min-h-screen p-4 ">
        <div className="relative bg-gradient-to-br from-[#f8f4e5] to-[#f1e9d2]  w-full mx-auto overflow-hidden max-w-4xl rounded-2xl shadow-xl border border-[#e8b245]/30">
          {/* Header */}
          <div className="bg-[#e8b245] px-6 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Contact Details</h3>
              <button
                onClick={onClose}
                className="text-gray-800 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
                <p className="text-lg font-semibold text-gray-900">{contact.name}</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                <p className="text-gray-900">{contact.email}</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Contact</h3>
                <p className="text-gray-900">{contact.contact}</p>
              </div>
              
              {/* Subject as textarea */}
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Subject</h3>
                <textarea
                  readOnly
                  value={contact.subject}
                  className="w-full bg-transparent text-gray-900 resize-none focus:outline-none"
                  rows={2}
                />
              </div>
              
              {/* Enquiry as textarea with more rows */}
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Enquiry</h3>
                <textarea
                  readOnly
                  value={contact.enquiry}
                  className="w-full bg-transparent text-gray-900 resize-none focus:outline-none"
                  rows={5}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-white/50 border-t border-[#e8b245]/20 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#e8b245] hover:bg-[#d6a23e] text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewContact;