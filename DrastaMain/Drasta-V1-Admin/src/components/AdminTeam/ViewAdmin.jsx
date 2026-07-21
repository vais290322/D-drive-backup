import React from "react";
import { X } from "lucide-react";

const ViewAdmin = ({ admin, onClose }) => {
  if (!admin) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Responsive width container - larger on big screens */}
        <div className="relative bg-gradient-to-br from-[#f8f4e5] to-[#f1e9d2] rounded-2xl w-full max-w-2xl lg:max-w-4xl mx-auto overflow-hidden shadow-xl border border-[#e8b245]/30">
          
          {/* Header */}
          <div className="bg-[#e8b245] px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Admin Profile</h3>
              <button
                onClick={onClose}
                className="text-gray-800 hover:text-gray-900 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Content - responsive layout */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Profile Image - smaller on mobile */}
            <div className="flex justify-center">
              <div className="relative">
                {admin.image ? (
                  <img
                    src={admin.image}
                    alt={admin.name}
                    className="h-28 w-28 sm:h-40 sm:w-40 rounded-full object-cover border-4 border-white shadow-lg"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-28 w-28 sm:h-40 sm:w-40 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm sm:text-lg">No Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Details - responsive grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg shadow-sm border border-white">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                <p className="text-base sm:text-lg font-semibold text-gray-900">{admin.name}</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg shadow-sm border border-white">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Position</h3>
                <p className="text-base sm:text-lg font-semibold text-gray-900">{admin.position}</p>
              </div>
              
              {/* Description spans full width on mobile, half on larger screens */}
              <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg shadow-sm border border-white sm:col-span-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p className="text-sm sm:text-base text-gray-900">
                  {admin.description || "No description available"}
                </p>
              </div>
            </div>
          </div>

          {/* Footer - responsive padding */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white/50 border-t border-[#e8b245]/20 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-1 sm:py-2 text-sm sm:text-base bg-[#e8b245] hover:bg-[#d6a23e] text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAdmin;