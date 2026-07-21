import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaUserCog, FaSearch } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { backendDomainA } from '../../common';
import { useSelector } from 'react-redux';

const AllUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const roleOptions = ["crm", "hrm", "billing","operation","mnsBilling","snigdhaBilling","executive"];
  const token = useSelector(state=>state.auth.token);
  const userDetails = useSelector(state=>state.auth.userDetails);




  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendDomainA}/api/v1/auth/all-users`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      // console.log("users : ", response);
      if (response.data.success) {
        setUsers(response?.data?.users || []);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // console.log("id : ", editingUser?._id);

  // Handle role change
  const handleRoleChange = async () => {
    if (!editingUser || !selectedRole) return;
    
    try {
      setLoading(true);
      const response = await axios.put(
        `${backendDomainA}/api/v1/auth/change-role`,
        { newRole: selectedRole,
          userId: editingUser?._id,
          // token: token
         },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("response : ", response);
      if (response.data.success) {
        // Update the user in the local state
        setUsers(users.map(user => 
          user._id === editingUser._id ? { ...user, role: selectedRole } : user
        ));
        toast.success(response?.data?.message  || "User role updated successfully");
        setEditingUser(null);
        setSelectedRole('');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update user role");
      console.error("Error updating user role:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if current user is admin
  const isAdmin = userDetails?.role === 'admin';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 bg-white p-2">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
        <p className="text-gray-600">Manage all users and their roles</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 relative bg-white p-2 ">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name, email or role..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading && !editingUser ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600">Loading users...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  {isAdmin && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? "4" : "3"} className="px-6 py-12 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-medium text-lg">
                              {user.username?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">Name: {user?.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs  leading-5 font-semibold rounded-full 
                          ${user.role === 'admin' ? 'bg-red-100 p-1 text-red-800' : 
                            user.role === 'crm' ? 'bg-blue-100 p-1 text-blue-800' : 
                            user.role === 'operation' ? 'bg-pink-100 p-1 text-purple-800' : 
                            user.role === 'hrm' ? 'bg-green-100 p-1 text-green-800' : 
                            user.role === 'billing' ? 'bg-yellow-100 p-1 text-yellow-800' : 
                            user.role === 'mnsBilling' ? 'bg-amber-100 p-1 text-yellow-800' : 
                            user.role === 'snigdhaBilling' ? 'bg-sky-100 p-1 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {user.role !== 'admin' ? (
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setSelectedRole(user.role);
                              }}
                              className="text-indigo-600 hover:text-indigo-900 cursor-pointer mr-4"
                            >
                              <FaEdit className="inline mr-1" /> Edit Role
                            </button>
                          ) : (
                            <span className="text-gray-400">Admin role (not editable)</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit User Role</h3>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setSelectedRole('');
                }}
                className="text-gray-400 cursor-pointer hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                Editing role for: <span className="font-medium  text-gray-900">{editingUser.username}</span>
              </p>
              <p className="text-sm text-gray-500">
                Current role: <span className="font-medium text-gray-900">{editingUser.role}</span>
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`py-2 px-4 cursor-pointer border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                      ${selectedRole === role 
                        ? 'bg-purple-600 text-white border-purple-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setEditingUser(null);
                  setSelectedRole('');
                }}
                className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChange}
                disabled={loading || selectedRole === editingUser.role}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                  ${loading || selectedRole === editingUser.role
                    ? 'bg-purple-300 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                  }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="inline-block h-4 w-4 animate-spin mr-1" />
                    Updating...
                  </>
                ) : (
                  'Update Role'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUserPage;