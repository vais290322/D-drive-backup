import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendDomainA } from "../../../common/index";
import { format } from 'date-fns';

const ImprestFundPage = () => {
  // State for imprest fund data
  const [imprestFund, setImprestFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for form dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deductOpen, setDeductOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  
  // State for form data
  const [createFormData, setCreateFormData] = useState({
    accountHolderName: '',
    openingAmount: 0,
    openingDate: new Date().toISOString().split('T')[0]
  });
  
  const [updateFormData, setUpdateFormData] = useState({
    amount: 0,
    description: ''
  });
  
  const [deductFormData, setDeductFormData] = useState({
    amount: 0,
    description: ''
  });
  
  // State for history data
  const [history, setHistory] = useState([]);
  
  // State for alerts
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch imprest fund data on component mount
  useEffect(() => {
    fetchImprestFund();
  }, []);

  // Function to fetch imprest fund data
  const fetchImprestFund = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendDomainA}/api/v1/imprest-fund/all`);
      if (response.data.data && response.data.data.length > 0) {
        setImprestFund(response.data.data[0]); // Assuming there's only one imprest fund
      } else {
        setImprestFund(null);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching imprest fund:', error);
      setError('Failed to fetch imprest fund data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch imprest fund history
  const fetchImprestFundHistory = async (id) => {
    try {
      const response = await axios.get(`${backendDomainA}/api/v1/imprest-fund/history/${id}`);
      console.log("response : ",response)
      // Ensure history is always an array
      const historyData = Array.isArray(response.data.data.history) ? response.data.data.history : [];
      setHistory(historyData);
      setHistoryOpen(true);
    } catch (error) {
      console.error('Error fetching history:', error);
      showAlert('Failed to fetch history', 'error');
      // Set history to empty array on error
      setHistory([]);
    }
  };

  // Handle create form input changes
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData({
      ...createFormData,
      [name]: name === 'openingAmount' ? Number(value) : value
    });
  };

  // Handle update form input changes
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({
      ...updateFormData,
      [name]: name === 'amount' ? Number(value) : value
    });
  };

  // Handle deduct form input changes
  const handleDeductChange = (e) => {
    const { name, value } = e.target;
    setDeductFormData({
      ...deductFormData,
      [name]: name === 'amount' ? Number(value) : value
    });
  };

  // Handle create form submission
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!createFormData.accountHolderName || !createFormData.openingAmount) {
      showAlert('Please fill all required fields', 'error');
      return;
    }
    
    try {
      await axios.post(`${backendDomainA}/api/v1/imprest-fund/create`, createFormData);
      showAlert('Imprest fund created successfully', 'success');
      setCreateOpen(false);
      fetchImprestFund();
    } catch (error) {
      showAlert(error.response?.data?.message || 'Failed to create imprest fund', 'error');
      console.error('Error creating imprest fund:', error);
    }
  };

  // Handle update form submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!updateFormData.amount) {
      showAlert('Please enter an amount', 'error');
      return;
    }
    
    try {
      await axios.put(`${backendDomainA}/api/v1/imprest-fund/update/${imprestFund._id}`, updateFormData);
      showAlert('Amount added successfully', 'success');
      setUpdateOpen(false);
      fetchImprestFund();
    } catch (error) {
      showAlert(error.response?.data?.message || 'Failed to update imprest fund', 'error');
      console.error('Error updating imprest fund:', error);
    }
  };

  // Handle deduct form submission
  const handleDeductSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!deductFormData.amount) {
      showAlert('Please enter an amount', 'error');
      return;
    }
    
    try {
      await axios.put(`${backendDomainA}/api/v1/imprest-fund/deduct/${imprestFund._id}`, deductFormData);
      showAlert('Amount deducted successfully', 'success');
      setDeductOpen(false);
      fetchImprestFund();
    } catch (error) {
      showAlert(error.response?.data?.message || 'Failed to deduct from imprest fund', 'error');
      console.error('Error deducting from imprest fund:', error);
    }
  };

  // Handle delete imprest fund
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this imprest fund? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`${backendDomainA}/api/v1/imprest-fund/delete/${imprestFund._id}`);
      showAlert('Imprest fund deleted successfully', 'success');
      setImprestFund(null);
    } catch (error) {
      showAlert(error.response?.data?.message || 'Failed to delete imprest fund', 'error');
      console.error('Error deleting imprest fund:', error);
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

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Alert Message */}
      {alert.open && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          alert.severity === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className="flex items-center">
            {alert.severity === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span>{alert.message}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-white p-3 rounded-lg shadow-md mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Imprest Fund Management</h1>
              <p className="text-blue-100 mt-1">Manage your petty cash and imprest fund</p>
            </div>
          </div>
          {!imprestFund ? (
            <button
              onClick={() => setCreateOpen(true)}
              className="px-4 py-2 cursor-pointer bg-white text-blue-600 rounded-lg shadow-md hover:bg-blue-50 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Imprest Fund
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => setUpdateOpen(true)}
                className="px-4 cursor-pointer py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Amount
              </button>
              <button
                onClick={() => setDeductOpen(true)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Deduct Amount
              </button>
              <button
                onClick={() => fetchImprestFundHistory(imprestFund._id)}
                className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                View History
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mt-4">Error Loading Data</h3>
            <p className="text-gray-500 mt-2">{error}</p>
            <button
              onClick={fetchImprestFund}
              className="mt-4 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : !imprestFund ? (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mt-4">No Imprest Fund Found</h3>
            <p className="text-gray-500 mt-2">Create your first imprest fund to get started</p>
            <button
              onClick={() => setCreateOpen(true)}
              className="mt-4 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Imprest Fund
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Imprest Fund Details</h2>
              <button
                onClick={handleDelete}
                className="px-3 cursor-pointer py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete Fund
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Account Holder Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Account Holder</h3>
                    <p className="text-lg font-semibold text-gray-800">{imprestFund.accountHolderName}</p>
                  </div>
                </div>
              </div>
              
              {/* Opening Amount Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Opening Amount</h3>
                    <p className="text-lg font-semibold text-gray-800">₹{imprestFund.openingAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              {/* Opening Date Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Opening Date</h3>
                    <p className="text-lg font-semibold text-gray-800">{formatDate(imprestFund.openingDate)}</p>
                  </div>
                </div>
              </div>
              
              {/* Current Amount Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Current Amount</h3>
                    <p className="text-lg font-semibold text-gray-800">₹{imprestFund.currentAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              {/* Deduction Amount Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Deduction Amount</h3>
                    <p className="text-lg font-semibold text-gray-800">₹{imprestFund.deductionAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
                        

                        {/* Recent Transactions */}
                        {imprestFund.updateAmountAndDate && imprestFund.updateAmountAndDate.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {imprestFund.updateAmountAndDate.slice(0, 5).map((transaction, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {formatDate(transaction.date)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.amount < 0 ? '-' : '+'}
                            ₹{Math.abs(transaction.amount).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.amount < 0 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {transaction.amount < 0 ? 'Deduction' : 'Addition'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Imprest Fund Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Create Imprest Fund</h2>
                </div>
                <button 
                  className="text-gray-500  hover:text-gray-700 cursor-pointer focus:outline-none"
                  onClick={() => setCreateOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleCreateSubmit}>
                <div className="p-6">
                  <div className="mb-4">
                    <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700 mb-1">
                      Account Holder Name*
                    </label>
                    <input
                      type="text"
                      id="accountHolderName"
                      name="accountHolderName"
                      value={createFormData.accountHolderName}
                      onChange={handleCreateChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                  <label htmlFor="openingAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Opening Amount*
                    </label>
                    <input
                      type="number"
                      id="openingAmount"
                      name="openingAmount"
                      value={createFormData.openingAmount}
                      onChange={handleCreateChange}
                      min="0"
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e') {
                          e.preventDefault();
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="openingDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Opening Date*
                    </label>
                    <input
                      type="date"
                      id="openingDate"
                      name="openingDate"
                      value={createFormData.openingDate}
                      onChange={handleCreateChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 cursor-pointer py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      onClick={() => setCreateOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 cursor-pointer py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Update Imprest Fund Modal */}
      {updateOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Add Amount</h2>
                </div>
                <button 
                  className="text-gray-500  hover:text-gray-700 cursor-pointer focus:outline-none"
                  onClick={() => setUpdateOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleUpdateSubmit}>
                <div className="p-6">
                  <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                      Amount to Add*
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={updateFormData.amount}
                      onChange={handleUpdateChange}
                      min="0"
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e') {
                          e.preventDefault();
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={updateFormData.description}
                      onChange={handleUpdateChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    ></textarea>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 cursor-pointer py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      onClick={() => setUpdateOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 cursor-pointer py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add Amount
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Deduct from Imprest Fund Modal */}
      {deductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <div className="flex items-center">
                  <div className="bg-yellow-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Deduct Amount</h2>
                </div>
                <button 
                  className="text-gray-500  hover:text-gray-700 cursor-pointer focus:outline-none"
                  onClick={() => setDeductOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleDeductSubmit}>
                <div className="p-6">
                  <div className="mb-4">
                    <label htmlFor="deductAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Amount to Deduct*
                    </label>
                    <input
                      type="number"
                      id="deductAmount"
                      name="amount"
                      value={deductFormData.amount}
                      onChange={handleDeductChange}
                      min="0"
                      max={imprestFund?.currentAmount || 0}
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e') {
                          e.preventDefault();
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                    {imprestFund && (
                      <p className="mt-1 text-sm text-gray-500">
                        Available balance: ₹{imprestFund.currentAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="deductDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="deductDescription"
                      name="description"
                      value={deductFormData.description}
                      onChange={handleDeductChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    ></textarea>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 cursor-pointer py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      onClick={() => setDeductOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 cursor-pointer py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Deduct Amount
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none"
                  onClick={() => setHistoryOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                {!Array.isArray(history) || history.length === 0 ? (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No transaction history</h3>
                    <p className="mt-1 text-sm text-gray-500">No transactions have been recorded yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Before Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Update Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Resulting Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {history.map((transaction, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {formatDate(transaction.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ₹{transaction.beforeAmount?.toLocaleString() || 0}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                              transaction.updateAmount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.updateAmount > 0 ? '+' : ''}
                              ₹{transaction.updateAmount?.toLocaleString() || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ₹{transaction.resultingAmount?.toLocaleString() || 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="px-4 cursor-pointer py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => setHistoryOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprestFundPage;