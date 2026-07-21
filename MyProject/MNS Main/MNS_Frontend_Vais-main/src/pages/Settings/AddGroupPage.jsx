import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUsers, FaEdit, FaTrash, FaPlus, FaRegSave } from "react-icons/fa";
import { MdDescription, MdOutlineCancel } from "react-icons/md";
import { BiLoaderCircle } from "react-icons/bi";
import Modal from "react-modal"; // Add this import if you use react-modal

const apiUrl = import.meta.env.VITE_BASE_URL_Local;

function AddGroupPage() {
  const [errors, setErrors] = useState({});
  const [groups, setGroups] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  
  
  // State for form values
  const [groupDetails, setGroupDetails] = useState({
    _id: "",
    groupName: "",
    description: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDetails, setEditDetails] = useState({
    _id: "",
    groupName: "",
    description: "",
  });

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/group/all`);
      if (response.data.success ) {
        setGroups(response.data.groups);
      }
    } catch (error) {
      toast.error("Failed to fetch groups");
      setGroups([]);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!groupDetails.groupName?.trim()) {
      newErrors.groupName = "Group name is required";
    }
    if (!groupDetails.description?.trim()) {
      newErrors.description = "Description is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const endpoint = isEditing
        ? `${apiUrl}/api/v1/group/update/${groupDetails._id}`
        : `${apiUrl}/api/v1/group/create`;
      const method = isEditing ? "put" : "post";

      // Ensure data is properly formatted
      const payload = {
        groupName: groupDetails.groupName.trim(),
        description: groupDetails.description.trim(),
        id: groupDetails._id
      };
      
      // Add ID only for update operations
      if (isEditing) {
        payload._id = groupDetails._id;
      }
      const response = await axios[method](endpoint, payload);
      if (response.data && response.data.success) {
        toast.success(
          isEditing
            ? "Group updated successfully!"
            : "Group added successfully!"
        );
        resetForm();
        fetchGroups();
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to process group details");
      } else {
        toast.error("Failed to process group details");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setGroupDetails({
      _id: "",
      groupName: "",
      description: "",
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleEdit = (group) => {
    setEditDetails({
      _id: group._id,
      groupName: group.groupName,
      description: group.description,
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // Optionally validate here
    try {
      const endpoint = `${apiUrl}/api/v1/group/update/${editDetails._id}`;
      const payload = {
        groupName: editDetails.groupName.trim(),
        description: editDetails.description.trim(),
        _id: editDetails._id,
      };
      const response = await axios.put(endpoint, payload);
      if (response.data && response.data.success) {
        toast.success("Group updated successfully!");
        setShowEditModal(false);
        fetchGroups();
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      toast.error("Failed to update group");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        const response = await axios.delete(`${apiUrl}/api/v1/group/delete/${id}`);
        if (response.data.success) {
          toast.success("Group deleted successfully!");
          fetchGroups();
        } else {
          toast.error(response.data.message || "Failed to delete group");
        }
      } catch (error) {
         toast.error("Failed to delete group");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl shadow-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-700 py-5 px-6 sm:px-10 flex items-center">
          <FaUsers className="text-white text-3xl mr-4" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            {isEditing ? "Update Group" : "Add New Group"}
          </h1>
        </div>
        
        <div className="p-4 sm:p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <FaUsers className="mr-2 text-purple-500" />
                  <span>Group Name</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="groupName"
                    value={groupDetails.groupName}
                    onChange={handleChange}
                    placeholder="Enter group name"
                    className={`w-full border ${
                      errors.groupName ? "border-red-400" : "border-gray-300"
                    } rounded-lg p-3 pl-3 outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-700`}
                  />
                </div>
                {errors.groupName && (
                  <p className="text-red-500 text-sm mt-1">{errors.groupName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <MdDescription className="mr-2 text-purple-500" />
                  <span>Description</span>
                </label>
                <div className="relative">
                  <textarea
                    name="description"
                    value={groupDetails.description}
                    onChange={handleChange}
                    placeholder="Enter group description"
                    rows="4"
                    className={`w-full border ${
                      errors.description ? "border-red-400" : "border-gray-300"
                    } rounded-lg p-3 pl-3 outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-700`}
                  ></textarea>
                </div>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center justify-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <MdOutlineCancel className="text-lg" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center cursor-pointer justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-700 text-white rounded-lg hover:from-purple-600 hover:to-indigo-800 transition-colors shadow-md disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <BiLoaderCircle className="animate-spin text-lg" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FaRegSave className="text-lg" />
                    <span>{isEditing ? "Update Group" : "Save Group"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Groups Table */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl shadow-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-700 py-4 px-6 sm:px-10 flex items-center justify-between">
          <div className="flex items-center">
            <FaUsers className="text-white text-2xl mr-3" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Group List
            </h2>
          </div>
          <div className="text-white text-sm">
            {groups.length} {groups.length === 1 ? 'group' : 'groups'} found
          </div>
        </div>
        
        <div className="p-4 sm:p-6 overflow-x-auto">
          {groups.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 font-bold text-left text-[16px]  text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-[16px]  font-bold text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-[16px] font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groups.map((group) => (
                  <tr key={group._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{group.groupName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">{group.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(group)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <FaEdit className="inline-block mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(group._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="inline-block mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10">
              <FaUsers className="mx-auto text-gray-300 text-5xl mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No Groups Found</h3>
              <p className="text-gray-400 mb-6">Start by adding your first group using the form above.</p>
              <button 
                onClick={() => document.querySelector('form').scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                Add New Group
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
      >
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Edit Group</h2>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Group Name</label>
              <input
                type="text"
                name="groupName"
                value={editDetails.groupName}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={editDetails.description}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default AddGroupPage

