// ConfirmDeleteModal.jsx
import React from 'react';
import { Dialog } from '@headlessui/react';

const ConfirmDeleteModal = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto z-50">
        <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">Confirm Deletion</Dialog.Title>
        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this plan? This action cannot be undone.</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
