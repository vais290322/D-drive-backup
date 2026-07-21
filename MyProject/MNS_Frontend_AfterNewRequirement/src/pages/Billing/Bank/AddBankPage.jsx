import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendDomainA } from "../../../common/index";
import { Link } from 'react-router-dom';

const AddBankPage = () => {
  // State for bank accounts data
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for form dialog
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // State for form data
  const [formData, setFormData] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    openingAmount: 0
  });
  
  // State for alerts
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch all banks on component mount
  useEffect(() => {
    fetchBanks();
  }, []);

  // Function to fetch all banks
  const fetchBanks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendDomainA}/api/v1/bank/all`);
      // console.log(response.data.data);
      setBanks(response.data.data || []);
    } catch (error) {
      showAlert('Failed to fetch bank accounts', 'error');
      console.error('Error fetching banks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'openingAmount' ? Number(value) : value
    });
  };

  // Open dialog for adding new bank
  const handleAddNew = () => {
    setFormData({
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branch: '',
      openingAmount: 0
    });
    setIsEdit(false);
    setOpen(true);
  };

  // Open dialog for editing bank
  const handleEdit = (bank) => {
    setFormData({
      accountHolderName: bank.accountHolderName,
      bankName: bank.bankName,
      accountNumber: bank.accountNumber,
      ifscCode: bank.ifscCode,
      branch: bank.branch,
      openingAmount: bank.openingAmount
    });
    setCurrentId(bank._id);
    setIsEdit(true);
    setOpen(true);
  };

  // Handle form submission for update
  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await axios.put(`${backendDomainA}/api/v1/bank/update/${currentId}`, formData);
        showAlert('Bank account updated successfully', 'success');
      } else {
        await axios.post(`${backendDomainA}/api/v1/bank/create`, formData);
        showAlert('Bank account added successfully', 'success');
      }
      setOpen(false);
      fetchBanks();
    } catch (error) {
      showAlert(error.response?.data?.message || 'Operation failed', 'error');
      console.error('Error submitting form:', error);
    }
  };

  // Handle bank deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bank account?')) {
      try {
        await axios.delete(`${backendDomainA}/api/v1/bank/delete/${id}`);
        showAlert('Bank account deleted successfully', 'success');
        fetchBanks();
      } catch (error) {
        showAlert('Failed to delete bank account', 'error');
        console.error('Error deleting bank:', error);
      }
    }
  };

  // Show alert message
  const showAlert = (message, severity) => {
    setAlert({
      open: true,
      message,
      severity
    });
    
    // Auto hide alert after 5 seconds
    setTimeout(() => {
      setAlert(prev => ({ ...prev, open: false }));
    }, 5000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Modern Page Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-white p-3 rounded-lg shadow-md mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Bank Accounts Management</h1>
              <p className="text-blue-100 mt-1">Manage all your banking information in one place</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              className="flex items-center px-4 py-2 cursor-pointer bg-white text-blue-600 rounded-lg shadow-md hover:bg-blue-50 transition-colors"
              onClick={handleAddNew}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Bank
            </button>
            <button 
              className="flex items-center cursor-pointer px-4 py-2 bg-blue-800 bg-opacity-30 text-white border border-blue-300 border-opacity-30 rounded-lg hover:bg-opacity-40 transition-colors"
              onClick={fetchBanks}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Bank Accounts Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto max-h-[calc(100vh-280px)]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Holder</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bank Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Number</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">IFSC Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Opening Balance</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Balance</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                      <p className="text-sm text-gray-500">Loading bank accounts...</p>
                    </div>
                  </td>
                </tr>
              ) : banks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <p className="text-gray-500 mb-3 text-lg">No bank accounts found</p>
                      <button 
                        className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                        onClick={handleAddNew}
                      >
                        Add your first bank account
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                // Inside the banks.map function, modify the row to include a link to the bank details page
                banks.map((bank) => (
                  <tr key={bank._id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                          {bank.accountHolderName.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            <Link to={`/billing/bank/${bank._id}`} className="hover:text-blue-600 transition-colors">
                              {bank.accountHolderName}
                            </Link>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Link to={`/billing/bank/${bank._id}`} className="hover:text-blue-600 transition-colors">
                        {bank.bankName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bank.accountNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bank.ifscCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bank.branch}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{bank.openingAmount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{bank.currentAmount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          className="flex  items-center cursor-pointer justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                          onClick={() => handleEdit(bank)}
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          className="flex items-center cursor-pointer justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          onClick={() => handleDelete(bank._id)}
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Bank Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center">
                <div className={`p-2 mr-3 rounded-lg ${isEdit ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                  {isEdit ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEdit ? 'Edit Bank Account' : 'Add New Bank Account'}
                </h2>
              </div>
              <button 
                className="text-gray-500  hover:text-gray-700 cursor-pointer focus:outline-none"
                onClick={() => setOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4">
                  <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Holder Name*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="accountHolderName"
                      name="accountHolderName"
                      type="text"
                      value={formData.accountHolderName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <input
                      id="bankName"
                      name="bankName"
                      type="text"
                      value={formData.bankName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="accountNumber"
                      name="accountNumber"
                      type="text"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 mb-1">
                    IFSC Code*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                    </div>
                    <input
                      id="ifscCode"
                      name="ifscCode"
                      type="text"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
                    Branch*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      id="branch"
                      name="branch"
                      type="text"
                      value={formData.branch}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="openingAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Opening Amount*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <input
                      id="openingAmount"
                      name="openingAmount"
                      type="number"
                      value={formData.openingAmount}
                      onChange={handleChange}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      min={0}
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
              <button 
                className="px-4 cursor-pointer py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleSubmit}
              >
                {isEdit ? 'Update Account' : 'Save Account'}
              </button>
            </div>
          </div>
        </div>
      )}

{alert.open && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-md shadow-lg ${
          alert.severity === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 
          'bg-red-50 text-red-800 border-l-4 border-red-500'
        }`}>
          <div className="flex items-center">
            {alert.severity === 'success' ? (
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <p>{alert.message}</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddBankPage;