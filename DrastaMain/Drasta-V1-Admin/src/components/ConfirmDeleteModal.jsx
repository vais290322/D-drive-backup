const ConfirmDeleteModal = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
<div className="fixed inset-0  bg-black/60 backdrop-blur-sm bg-opacity-40 flex justify-center items-center z-50">
  <div className="relative bg-white text-gray-800 p-6 rounded shadow w-full max-w-sm">
    {/* Close button at top right */}
    <button
      onClick={onClose}
      className="absolute top-2 right-2 text-gray-500 text-2xl leading-none hover:text-black"
    >
      &times;
    </button>

    <h4 className="text-lg font-medium mb-4">Confirm Deletion</h4>
    <p className="mb-6">Are you sure you want to delete this advisor?</p>

    <div className="flex justify-end">
      <button
        onClick={onConfirm}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Delete
      </button>
    </div>
  </div>
</div>

  );
};

export default ConfirmDeleteModal;
