import React from "react";
import { X } from "lucide-react";

const ViewResearchPoject = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-gradient-to-br from-[#f8f4e5] to-[#f1e9d2] max-w-2xl lg:max-w-4xl rounded-2xl  w-full mx-auto overflow-hidden shadow-xl border border-[#e8b245]/30">
          {/* Header */}
          <div className="bg-[#e8b245] px-6 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Project Details</h3>
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
            {/* Project Image */}
            <div className="flex justify-center">
              <div className="relative">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
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
                <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
                <pre className="text-lg font-semibold text-gray-900 whitespace-pre-wrap break-words bg-transparent border-none p-0 m-0">{project.title}</pre>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <pre className="text-gray-900 whitespace-pre-wrap break-words bg-transparent border-none p-0 m-0">{project.description || "No description available"}</pre>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white">
                <h3 className="text-sm font-medium text-gray-500 mb-1">PDF Link</h3>
                <a
                  href={project.pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {project.pdfLink || "No PDF link"}
                </a>
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

export default ViewResearchPoject;