import React from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

const ViewExpertModal = ({ open, onClose, expert }) => {
  if (!expert) return null;

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="flex items-center justify-center min-h-screen p-4">
                {/* <di className="relative bg-gradient-to-br from-[#f8f4e5] to-[#f1e9d2] rounded-2xl w-full max-w-2xl lg:max-w-4xl mx-auto overflow-hidden shadow-xl border border-[#e8b245]/30"> */}
        <Dialog.Panel className="relative bg-gradient-to-br from-[#f8f4e5] to-[#f1e9d2] w-full max-w-2xl lg:max-w-4xl rounded-2xl mx-auto overflow-hidden shadow-xl border border-[#e8b245]/30">
          {/* Header */}
          <div className="bg-[#e8b245] px-6 py-4">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-bold text-gray-900">
                Expert Profile
              </Dialog.Title>
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
                <img
                  src={expert?.image}
                  alt={expert?.name}
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
            
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                <p className="text-lg font-semibold text-gray-900">{expert?.name}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Professional Title</h3>
                <p className="text-lg font-semibold text-gray-900">{expert?.title}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Areas of Expertise</h3>
                <p className="text-lg font-semibold text-gray-900">{expert?.expertise}</p>
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
        </Dialog.Panel>
        {/* </div> */}
      </div>
    </Dialog>
  );
};

export default ViewExpertModal;