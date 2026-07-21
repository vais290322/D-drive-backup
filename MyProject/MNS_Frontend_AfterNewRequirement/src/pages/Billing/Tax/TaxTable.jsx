import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
// const allTaxUrl = import.meta.env.VITE_GET_ALL_TAX;
// const updateDateUrl = import.meta.env.VITE_UPDATE_TAX;
// const updatActiveUrl = import.meta.env.VITE_UPDATE_ACTIVE_TAX;
// const deleteUrl = import.meta.env.VITE_DELETE_TAX
// console.log(allTaxUrl);
import urls from "../../../common/url"

const { updateDateUrl,allTaxUrl,updatActiveUrl,deleteUrl} = urls;
const TaxTable = ({ responce }) => {
  const [allTaxData, setAllTaxData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedPercentage, setEditedPercentage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taxToDelete, setTaxToDelete] = useState(null); // Store the tax item to be deleted

  const openModal = (tax) => {
    setSelectedTax(tax);
    setEditedName(tax.taxName);
    setEditedPercentage(tax.taxPercentage);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTax(null);
  };

  const openDeleteConfirmation = (tax) => {
    setTaxToDelete(tax);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setIsDeleteModalOpen(false);
    setTaxToDelete(null);
  };

  const saveChanges = async () => {
    if (selectedTax) {
      if (!editedName || !editedPercentage) {
        toast.error("Please fill all fields");
        return;
      }
      const editDeatils = {
        taxName: editedName,
        taxPercentage: editedPercentage,
      };
      try {
        const sendEdit = await fetch(`${updateDateUrl}/${selectedTax.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editDeatils),
        });
        const jsonRes = await sendEdit.json();
        if (jsonRes.message != "tax updated successfully") {
          toast.error("Tax Not updated");
          return;
        }
        toast.success("Tax updated successfully");
        setAllTaxData((prev) =>
          prev.map((tax) => (tax.id === jsonRes.data.id ? jsonRes.data : tax))
        );
      } catch (error) {
        toast.error("Server Error");
      }

      closeModal();
    }
  };

  const getAllTaxData = async () => {
    try {
      const taxData = await fetch(allTaxUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonData = await taxData.json();
      if (jsonData.message != "All tax retrieved successfully") {
        toast.error("Error fetching tax data");
        return;
      }
      toast.success("Successfully fetched Tax Data");
      setAllTaxData(jsonData.data.reverse() || []);
    } catch (error) {
      toast.error("Server Error");
      console.error(error);
    }
  };

  const onDelete = async () => {
    if (taxToDelete) {
      try {
        const sendDeleteRequest = await fetch(`${deleteUrl}/${taxToDelete.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const jsonRes = await sendDeleteRequest.json();
        if (jsonRes.message != "tax deleted successfully") {
          toast.error("Tax Not deleted");
          return;
        }
        toast.success("Tax deleted successfully");
        setAllTaxData((prev) => prev.filter((tax) => tax.id !== taxToDelete.id));
      } catch (error) {
        toast.error("Server Error");
      }
      closeDeleteConfirmation();
    }
  };

  const handelActive = async (id) => {
    try {
      const sendActive = await fetch(`${updatActiveUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonRes = await sendActive.json();
      if (jsonRes.message === "Tax activated successfully" || jsonRes.message === "Tax deactivated successfully") {
        toast.success(jsonRes.message);
        setAllTaxData((prev) =>
          prev.map((tax) => (tax.id === jsonRes.data.id ? jsonRes.data : tax))
        );
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Server Error");
      console.error(error);
    }
  };

  useEffect(() => {
    getAllTaxData();
  }, [responce]);

  const [currentPage, setCurrentPage] = useState(1);
  const [taxPerPage, setTaxPerPage] = useState(10); // Default to 10 items per page
  const [sortOrder, setSortOrder] = useState({ column: 'taxName', direction: 'asc' });

  // Sort function to handle sorting by column and order
  const sortData = (column) => {
    const newDirection = sortOrder.column === column && sortOrder.direction === 'asc' ? 'desc' : 'asc';
    setSortOrder({ column, direction: newDirection });

    const sortedTaxes = [...allTaxData].sort((a, b) => {
      if (column === 'taxName') {
        return newDirection === 'asc' ? a.taxName.localeCompare(b.taxName) : b.taxName.localeCompare(a.taxName);
      } else if (column === 'taxPercentage') {
        return newDirection === 'asc' ? a.taxPercentage - b.taxPercentage : b.taxPercentage - a.taxPercentage;
      }
      return 0;
    });

    setCurrentPage(1); // Reset to first page after sorting
    setAllTaxData(sortedTaxes); // Update sorted data
  };

  const indexOfLastTax = currentPage * taxPerPage;
  const indexOfFirstTax = indexOfLastTax - taxPerPage;
  const currentTaxes = allTaxData.slice(indexOfFirstTax, indexOfLastTax);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(allTaxData.length / taxPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleTaxPerPageChange = (e) => {
    setTaxPerPage(parseInt(e.target.value)); // Set the selected number of items per page
    setCurrentPage(1); // Reset to the first page when the number of items per page is changed
  };
  return (
    <>
    <h2 className="text-3xl font-bold text-gray-800 mt-6">Tax List</h2>
    <div className="flex justify-between items-center mb-4">
        <div>
          <label htmlFor="taxPerPage" className="text-sm font-medium text-gray-700">Show</label>
          <select
            id="taxPerPage"
            value={taxPerPage}
            onChange={handleTaxPerPageChange}
            className="ml-2 px-4 py-2 border rounded-md text-sm text-gray-700"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
          <span className="ml-2 text-sm text-gray-700">per page</span>
        </div>
      </div>

      <table className="w-full mt-6 border border-gray-200 rounded-lg overflow-hidden shadow-md">
        <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
          <tr>
            <th
              className="border-b p-4 text-left cursor-pointer"
              onClick={() => sortData('taxName')}
            >
              Tax Name
              {sortOrder.column === 'taxName' && (sortOrder.direction === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th
              className="border-b p-4 text-left cursor-pointer"
              onClick={() => sortData('taxPercentage')}
            >
              Tax Percentage
              {sortOrder.column === 'taxPercentage' && (sortOrder.direction === 'asc' ? ' ↑' : ' ↓')}
            </th>
            <th className="border-b p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentTaxes.map((tax, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-all duration-300"
            >
              <td className="p-4 text-gray-700">{tax.taxName}</td>
              <td className="p-4 text-gray-700">{tax.taxPercentage}%</td>
              <td className="p-4 flex justify-center space-x-4">
                <button
                  onClick={() => openModal(tax)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-600 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteConfirmation(tax)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
                {tax.active ? (
                  <button
                    onClick={() => handelActive(tax.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition duration-300"
                  >
                    Active
                  </button>
                ) : (
                  <button
                    onClick={() => handelActive(tax.id)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition duration-300"
                  >
                    Deactive
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <nav>
          <ul className="flex list-none space-x-2">
            <li>
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md cursor-pointer hover:bg-gray-400 disabled:opacity-50"
              >
                Previous
              </button>
            </li>
            {pageNumbers.map(number => (
              <li key={number}>
                <button
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded-md cursor-pointer ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {number}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === pageNumbers.length}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md cursor-pointer hover:bg-gray-400 disabled:opacity-50"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
  
    {/* Edit Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h3 className="text-xl font-semibold mb-6">Edit Tax</h3>
          <label className="block mb-4">
            Tax Name:
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full border p-3 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="block mb-6">
            Tax Percentage:
            <input
              type="number"
              value={editedPercentage}
              onChange={(e) => setEditedPercentage(e.target.value)}
              className="w-full border p-3 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <div className="flex justify-end space-x-4">
            <button
              onClick={closeModal}
              className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={saveChanges}
              className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}
  
    {/* Delete Confirmation Modal */}
    {isDeleteModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h3 className="text-xl font-semibold mb-6">Are you sure you want to delete this tax?</h3>
          <div className="flex justify-end space-x-4">
            <button
              onClick={closeDeleteConfirmation}
              className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 transition duration-300"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default TaxTable;
