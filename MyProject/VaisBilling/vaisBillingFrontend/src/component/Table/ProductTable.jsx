import { useState } from "react";

const PaginatedTable = ({ data, onUpdate, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Calculate total pages
  const totalPages = Math.ceil(data?.length / itemsPerPage);

  // Paginate data
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handle delete confirmation
  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete.item_id);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 ">
    <div className="max-w-4xl mx-auto p-4 w-full">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 w-full">
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-semibold text-gray-900">Item List</h2>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.item_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.item_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.item_description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onUpdate(item)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(item)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-center space-x-4">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
       <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
       <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-gray-200">
         <div className="flex flex-col items-center sm:flex-row sm:items-start">
           <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:h-10 sm:w-10">
             <svg
               className="h-6 w-6 text-red-600"
               fill="none"
               viewBox="0 0 24 24"
               strokeWidth="1.5"
               stroke="currentColor"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
               />
             </svg>
           </div>
           <div className="mt-3 text-center sm:ml-4 sm:text-left">
             <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
             <p className="mt-2 text-sm text-gray-600">
               Are you sure you want to delete <span className="font-medium text-gray-900">{itemToDelete?.item_name}</span>? This action cannot be undone.
             </p>
           </div>
         </div>
         <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
           <button
             type="button"
             className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
             onClick={() => setShowDeleteModal(false)}
           >
             Cancel
           </button>
           <button
             type="button"
             className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-500 transition focus:outline-none focus:ring-2 focus:ring-red-500"
             onClick={handleDelete}
           >
             Delete
           </button>
         </div>
       </div>
     </div>
      )}


    </div>
  </div>
  );
};

export default PaginatedTable;