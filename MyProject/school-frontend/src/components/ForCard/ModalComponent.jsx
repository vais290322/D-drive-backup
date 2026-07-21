import React from 'react'

const ModalComponent = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[90%] h-[90%] rounded-lg shadow-lg overflow-hidden relative"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  )
}

export default ModalComponent