import React, { useEffect, useState } from 'react';
import urls from "../../../src/common/url";
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiSearch, FiFilter, FiLoader } from 'react-icons/fi';

const { getResourceUrl, deleteResourceUrl, updateResourceUrl } = urls;

function ResourceTable({ handleSubmit }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
  
    // States for modals and the selected resource
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    // Edit form state (resourceName will be an array of objects like [{ names: "computer" }, ...])
    const [editForm, setEditForm] = useState({
      id: "",
      employeeName: '',
      email: '',
      empCode: '',
      resourceType: '',
      resourceName: [],
      resourceDescription: '',
      resourceStatus: '',
      resourceAvailability: '',
      resourceQuantity: ''
    });
  
    // Resource type options for filtering
    const resourceTypeOptions = ['Hardware', 'Software', 'Office Equipment', 'Furniture', 'Vehicle', 'Other'];
    const statusOptions = ['Available', 'In Use', 'Maintenance', 'Retired'];
    const availabilityOptions = ['Available', 'Limited', 'Unavailable'];
    const itemsPerPageOptions = [5, 10, 20, 50];

    // Populate editForm when selectedResource changes
    useEffect(() => {
      if (selectedResource) {
        setEditForm({
          id: selectedResource.id || "",
          employeeName: selectedResource.employeeName || '',
          email: selectedResource.email || '',
          empCode: selectedResource.empCode || '',
          resourceType: selectedResource.resourceType || '',
          resourceName: selectedResource.resourceName
            ? selectedResource.resourceName.map(item => item)
            : [],
          resourceDescription: selectedResource.resourceDescription || '',
          resourceStatus: selectedResource.resourceStatus || '',
          resourceAvailability: selectedResource.resourceAvailability || '',
          resourceQuantity: selectedResource.resourceQuantity || ''
        });
      }
    }, [selectedResource]);
  
    // Close modals
    const closeEditModal = () => {
      setIsEditModalOpen(false);
      setSelectedResource(null);
    };
  
    const closeDeleteModal = () => {
      setIsDeleteModalOpen(false);
      setSelectedResource(null);
    };
  
    // Confirm edit (update resource)
    const confirmEdit = async () => {
      setIsSubmitting(true);
      try {
        const updateData = await fetch(`${updateResourceUrl}/${editForm.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editForm)
        });
        const res = await updateData.json();
        if (!res) {
          toast.error("Resource not updated");
          return;
        }
        toast.success("Resource updated successfully");
        closeEditModal();
        getAllData(); // Refresh data after update
      } catch (error) {
        toast.error("Error updating resource");
      } finally {
        setIsSubmitting(false);
      }
    };
  
    // Handler to open the edit modal
    const handleEdit = (item) => {
      setSelectedResource(item);
      setIsEditModalOpen(true);
    };
  
    // Fetch all data from the API
    const getAllData = async () => {
      setLoading(true);
      try {
        const getData = await fetch(getResourceUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const jsonData = await getData.json();
        setData(jsonData?.data || []);
      } catch (error) {
        toast.error("Failed to fetch resources");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      getAllData();
    }, [handleSubmit]);
  
    // Filter data based on search term and filter type
    const filteredData = data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.empCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.resourceName?.some(r => r.names.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterType === '' || item.resourceType === filterType;
      
      return matchesSearch && matchesFilter;
    });
    
    // Pagination calculations
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);
  
    const handlePrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);
    const handleFirstPage = () => setCurrentPage(1);
    const handleLastPage = () => setCurrentPage(totalPages);
  
    // Delete handlers
    const handleDelete = (item) => {
      setSelectedResource(item);
      setIsDeleteModalOpen(true);
    };
  
    const confirmDelete = async () => {
      setIsSubmitting(true);
      try {
        const deleteData = await fetch(`${deleteResourceUrl}/${selectedResource.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const res = await deleteData.json();
        if (!res) {
          toast.error("Couldn't delete");
          return;
        }
        toast.success("Resource deleted successfully");
        closeDeleteModal();
        getAllData(); // Refresh data after deletion
      } catch (error) {
        toast.error("Server error");
      } finally {
        setIsSubmitting(false);
      }
    };
  
    // Reset filters
    const resetFilters = () => {
      setSearchTerm('');
      setFilterType('');
      setCurrentPage(1);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1); // Reset to first page when changing items per page
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Resource Inventory</h2>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search resources..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-64"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full appearance-none"
              >
                <option value="">All Resource Types</option>
                {resourceTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200"
            >
              Reset Filters
            </button>
          </div>
        </div>
        
        {/* Items per page selector */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Show:</label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {itemsPerPageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
        </div>
        
        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FiLoader className="animate-spin text-indigo-600 text-4xl" />
            <span className="ml-2 text-gray-600">Loading resources...</span>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource Names</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900">{item.employeeName}</div>
                            <div className="text-sm text-gray-500">{item.email || '-'}</div>
                            <div className="text-xs text-gray-400">ID: {item.empCode}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${item.resourceType === 'Hardware' ? 'bg-blue-100 text-blue-800' : 
                              item.resourceType === 'Software' ? 'bg-green-100 text-green-800' : 
                              item.resourceType === 'Office Equipment' ? 'bg-yellow-100 text-yellow-800' : 
                              item.resourceType === 'Furniture' ? 'bg-purple-100 text-purple-800' : 
                              item.resourceType === 'Vehicle' ? 'bg-red-100 text-red-800' : 
                              'bg-gray-100 text-gray-800'}`}>
                            {item.resourceType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs">
                            {item.resourceName ? (
                              item.resourceName.map((res, i) => (
                                <span key={i} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">
                                  {res.names}
                                </span>
                              ))
                            ) : (
                              '-'
                            )}
                          </div>
                          {item.resourceDescription && (
                            <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                              {item.resourceDescription}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${item.resourceStatus === 'Available' ? 'bg-green-100 text-green-800' : 
                              item.resourceStatus === 'In Use' ? 'bg-blue-100 text-blue-800' : 
                              item.resourceStatus === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {item.resourceStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${item.resourceAvailability === 'Available' ? 'bg-green-100 text-green-800' : 
                              item.resourceAvailability === 'Limited' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {item.resourceAvailability}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.resourceQuantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-indigo-600 cursor-pointer hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-full mr-2 transition-colors duration-200"
                            title="Edit Resource"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-600 cursor-pointer hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors duration-200"
                            title="Delete Resource"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                        {data.length === 0 ? "No resources found. Add some resources to get started." : "No matching resources found. Try adjusting your filters."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {filteredData.length > 0 && (
              <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredData.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredData.length}</span> resources
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleFirstPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="First Page"
                  >
                    <FiChevronsLeft size={16} />
                  </button>
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Previous Page"
                  >
                    <FiChevronLeft size={16} />
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Calculate page numbers to show (centered around current page)
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageClick(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded-md ${
                            currentPage === pageNum
                              ? "bg-indigo-600 text-white"
                              : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next Page"
                  >
                    <FiChevronRight size={16} />
                  </button>
                  <button
                    onClick={handleLastPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Last Page"
                  >
                    <FiChevronsRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <FiEdit className="mr-2 text-indigo-600" />
                Edit Resource
              </h2>
              {selectedResource && (
                <form onSubmit={(e) => { e.preventDefault(); confirmEdit(); }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee Name
                      </label>
                      <input
                        type="text"
                        value={editForm.employeeName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, employeeName: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee Code
                    </label>
                    <input
                      type="text"
                      value={editForm.empCode}
                      onChange={(e) =>
                        setEditForm({ ...editForm, empCode: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resource Type
                      </label>
                      <select
                        value={editForm.resourceType}
                        onChange={(e) =>
                          setEditForm({ ...editForm, resourceType: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Resource Type</option>
                        {resourceTypeOptions.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={editForm.resourceQuantity}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            resourceQuantity: e.target.value,
                          })
                        }
                        min="1"
                        className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resource Names
                    </label>
                    <input
                      type="text"
                      value={editForm.resourceName.map(item => item.names).join(', ')}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          resourceName: e.target.value
                            .split(',')
                            .map(name => ({ names: name.trim() }))
                            .filter(item => item.names !== '')
                        })
                      }
                      placeholder="Comma separated (e.g., Dell Laptop, Wireless Mouse)"
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate multiple resource names with commas</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editForm.resourceDescription}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          resourceDescription: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={editForm.resourceStatus}
                        onChange={(e) =>
                          setEditForm({ ...editForm, resourceStatus: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Status</option>
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability
                      </label>
                      <select
                        value={editForm.resourceAvailability}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            resourceAvailability: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Availability</option>
                        {availabilityOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="px-4 py-2 bg-gray-200 cursor-pointer hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-colors duration-200"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors duration-200 flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <FiTrash2 className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Confirm Deletion</h2>
                {selectedResource && (
                  <p className="text-gray-600">
                    Are you sure you want to delete the resource{" "}
                    <span className="font-semibold">
                      {selectedResource.resourceName?.map(r => r.names).join(', ')}
                    </span>{" "}
                    assigned to <span className="font-semibold">{selectedResource.employeeName}</span>?
                    <br />
                    <span className="text-sm text-red-500 mt-2 block">This action cannot be undone.</span>
                  </p>
                )}
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-200 cursor-pointer hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-4 py-2 cursor-pointer bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors duration-200 flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Resource"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}

export default ResourceTable;