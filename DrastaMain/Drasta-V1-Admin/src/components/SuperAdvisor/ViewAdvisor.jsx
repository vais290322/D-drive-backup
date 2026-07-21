import React from "react";
import { X } from "lucide-react";

const ViewAdvisor = ({ advisor, onClose }) => {
  if (!advisor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-gradient-to-br from-[#f8f4e5] to-[#f1e9d2] max-w-2xl lg:max-w-4xl rounded-2xl   w-full mx-auto overflow-hidden shadow-xl border border-[#e8b245]/30">
          {/* Header */}
          <div className="bg-[#e8b245] px-6 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Advisor Profile</h3>
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
            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative">
                {advisor?.image ? (
                  <img
                    src={advisor?.image}
                    alt={advisor?.name}
                    className="h-40 w-40 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="h-40 w-40 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-gray-500 text-lg">No Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                <p className="text-lg font-semibold text-gray-900">{advisor?.name}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Qualification</h3>
                <p className="text-gray-900">{advisor?.qualification || "No qualification available"}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-white/50 border-t border-[#e8b245]/20 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#e8b245] hover:bg-[#d6a23e] text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAdvisor;