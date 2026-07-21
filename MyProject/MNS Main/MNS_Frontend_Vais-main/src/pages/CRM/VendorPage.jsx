import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaFileExcel, FaUpload, FaEye, FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaIdCard,
  FaDownload,
  FaCheckCircle
} from 'react-icons/fa';
import { BsBank } from 'react-icons/bs';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { backendDomainR1 } from '../../Common/index';
import ExcelJS from "exceljs";
import { Download } from 'lucide-react';

const VendorPage = () => {
  // State for vendors data
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [paginatedVendors, setPaginatedVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);

  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [excelUploadError, setExcelUploadError] = useState(null);
  const [excelUploading, setExcelUploading] = useState(false);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    vendorCategory: '',
    location: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // State for vendor form
  const [vendorForm, setVendorForm] = useState({
    vendorName: '',
    vendorAddress: [''],
    landlineNumber: '',
    vendorNumber: '',
    vendorEmail: '',
    vendorCategory: '',
    vendorAlternateNumber: '',
    gstNumber: '',
    panNumber: '',
    state: '',
    location: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    bankBranch: '',
    accountHolderName: '',
    deliveryAddress: ['']
  });

  // State for modals
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // State for file upload
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // State for alerts
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Vendor categories
  const vendorCategories = [
    'Supplier',
    'Manufacturer',
    'Distributor',
    'Service Provider',
    'Contractor',
    'Consultant',
    'Other'
  ];

  // Fetch data on component mount
  useEffect(() => {
    fetchVendors();
  }, []);

  // Apply filters and search when they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [vendors, searchTerm, filters]);

  // Update paginated vendors when filtered vendors or pagination settings change
  useEffect(() => {
    paginateVendors();
  }, [filteredVendors, currentPage, itemsPerPage]);

  // Calculate total pages when total items or items per page changes
  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  // Fetch all vendors
  const fetchVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      // http://192.168.0.156:3009
      const response = await axios.get(`${backendDomainR1}/api/v1/mns/vendor`);
      const vendorsData = Array.isArray(response.data.data) ? response.data.data : [];
      setVendors(vendorsData);
      setFilteredVendors(vendorsData);
      setTotalItems(vendorsData.length);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vendors');
      setVendors([]);
      setFilteredVendors([]);
      setTotalItems(0);
      setLoading(false);
    }
  };

  const openDeleteModal = (vendor) => {
    setVendorToDelete(vendor);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!vendorToDelete) return;

    try {
      await axios.delete(`${backendDomainR1}/api/v1/mns/vendor/delete/${vendorToDelete.id}`);
      fetchVendors();
      setAlert({
        open: true,
        message: 'Vendor deleted successfully',
        severity: 'success'
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    } catch (err) {
      setAlert({
        open: true,
        message: err.response?.data?.message || 'Failed to delete vendor',
        severity: 'error'
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    } finally {
      setDeleteModalOpen(false);
      setVendorToDelete(null);
    }
  };

  const handleExcelFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        setExcelUploadError('Please upload an Excel file (.xlsx or .xls)');
        setExcelFile(null);
        return;
      }

      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setExcelUploadError('File size exceeds 10MB limit');
        setExcelFile(null);
        return;
      }

      setExcelFile(file);
      setExcelUploadError(null);
    }
  };

  const handleExcelUpload = async () => {
    if (!excelFile) return;

    setExcelUploading(true);
    setExcelUploadError(null);

    const formData = new FormData();
    formData.append('file', excelFile);

    try {
      const response = await axios.post(`${backendDomainR1}/vendors/upload-excel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setToast({
          visible: true,
          type: 'success',
          message: 'Vendors uploaded successfully!'
        });

        // Close modal and reset
        setExcelModalOpen(false);
        setExcelFile(null);

        // Refresh vendor list
        fetchVendors();
      } else {
        setExcelUploadError(response.data.message || 'Failed to upload vendors');
      }
    } catch (error) {
      console.error('Excel upload error:', error);
      setExcelUploadError(error.response?.data?.message || 'An error occurred during upload');
    } finally {
      setExcelUploading(false);
    }
  };


  // Apply filters and search
  const applyFiltersAndSearch = () => {
    if (!Array.isArray(vendors)) {
      setFilteredVendors([]);
      setTotalItems(0);
      return;
    }

    let filtered = [...vendors];

    // Apply search term (search in vendor name, email, phone, GST, PAN)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(vendor =>
        vendor.vendorName?.toLowerCase().includes(search) ||
        vendor.vendorEmail?.toLowerCase().includes(search) ||
        vendor.vendorNumber?.includes(search) ||
        vendor.gstNumber?.toLowerCase().includes(search) ||
        vendor.panNumber?.toLowerCase().includes(search)
      );
    }

    // Apply category filter
    if (filters.vendorCategory) {
      filtered = filtered.filter(vendor => vendor.vendorCategory === filters.vendorCategory);
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(vendor => vendor.location?.toLowerCase().includes(filters.location.toLowerCase()));
    }

    setFilteredVendors(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Paginate the filtered vendors
  const paginateVendors = () => {
    if (!Array.isArray(filteredVendors)) {
      setPaginatedVendors([]);
      return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedVendors(filteredVendors.slice(startIndex, endIndex));
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      vendorCategory: '',
      location: '',
    });
    setSearchTerm('');
  };

  // Handle vendor form input change
  const handleVendorFormChange = (e) => {
    const { name, value } = e.target;
    setVendorForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle array field changes (addresses)
  const handleArrayFieldChange = (field, index, value) => {
    setVendorForm(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  // Add new item to array field
  const addArrayItem = (field) => {
    setVendorForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  // Remove item from array field
  const removeArrayItem = (field, index) => {
    setVendorForm(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [field]: newArray.length ? newArray : [''] // Always keep at least one empty field
      };
    });
  };

  // Reset vendor form
  const resetVendorForm = () => {
    setVendorForm({
      vendorName: '',
      vendorAddress: [''],
      landlineNumber: '',
      vendorNumber: '',
      vendorEmail: '',
      vendorCategory: '',
      vendorAlternateNumber: '',
      gstNumber: '',
      panNumber: '',
      location: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      bankBranch: '',
      accountHolderName: '',
      deliveryAddress: ['']
    });
    setIsEditing(false);
  };

  // Open vendor modal for editing
  const openEditModal = (vendor) => {
    // Format the vendor data for the form
    const formattedVendor = {
      ...vendor,
      vendorAddress: vendor.vendorAddress || [''],
      deliveryAddress: vendor.deliveryAddress || ['']
    };

    setVendorForm(formattedVendor);
    setIsEditing(true);
    setVendorModalOpen(true);
  };

  // Open view modal with vendor data
  const openViewModal = (vendor) => {
    setCurrentVendor(vendor);
    setViewModalOpen(true);
  };

  // Handle vendor form submission
  const handleVendorSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // Update existing vendor
        await axios.put(`${backendDomainR1}/api/v1/mns/vendor/update/${vendorForm.id}`, vendorForm);
        setAlert({
          open: true,
          message: 'Vendor updated successfully',
          severity: 'success'
        });
      } else {
        // Create new vendor
        await axios.post(`${backendDomainR1}/api/v1/mns/vendor/create`, vendorForm);
        setAlert({
          open: true,
          message: 'Vendor created successfully',
          severity: 'success'
        });
      }

      setVendorModalOpen(false);
      resetVendorForm();
      fetchVendors();
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    } catch (err) {
      setAlert({
        open: true,
        message: err.response?.data?.message || 'Failed to save vendor',
        severity: 'error'
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    }
  };

  // Handle vendor deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await axios.delete(`${backendDomainR1}/api/v1/mns/vendor/delete/${id}`);
        fetchVendors();
        setAlert({
          open: true,
          message: 'Vendor deleted successfully',
          severity: 'success'
        });
        setTimeout(() => setAlert({ ...alert, open: false }), 3000);
      } catch (err) {
        setAlert({
          open: true,
          message: err.response?.data?.message || 'Failed to delete vendor',
          severity: 'error'
        });
        setTimeout(() => setAlert({ ...alert, open: false }), 3000);
      }
    }
  };

  // Handle file selection for upload
  const handleFileSelect = (e) => {
    setUploadFile(e.target.files[0]);
  };

  // Handle Excel file upload
  const handleFileUpload = async () => {
    if (!uploadFile) {
      setAlert({
        open: true,
        message: 'Please select a file to upload',
        severity: 'error'
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      setUploadProgress(0);

      await axios.post(`${backendDomainR1}/api/v1/mns/vendor/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      setUploadModalOpen(false);
      setUploadFile(null);
      setUploadProgress(0);
      fetchVendors();

      setAlert({
        open: true,
        message: 'Vendors uploaded successfully',
        severity: 'success'
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    } catch (err) {
      setAlert({
        open: true,
        message: err.response?.data?.message || 'Failed to upload vendors',
        severity: 'error'
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    }
  };

  // Download Excel template
  const downloadTemplate = () => {
    // Create template data
    const templateData = [
      {
        vendorName: 'Example Vendor',
        vendorAddress: 'Address Line 1, Address Line 2',
        landlineNumber: '0123456789',
        vendorNumber: '9876543210',
        vendorEmail: 'example@vendor.com',
        vendorCategory: 'Supplier',
        vendorAlternateNumber: '9876543211',
        gstNumber: 'GST123456789',
        panNumber: 'PAN123456789',
        state: 'WB',
        location: 'City',
        bankName: 'Example Bank',
        accountNumber: '1234567890',
        ifscCode: 'IFSC12345',
        bankBranch: 'Example Branch',
        accountHolderName: 'Example Holder',
        deliveryAddress: 'Delivery Address Line 1, Delivery Address Line 2'
      }
    ];

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vendors');

    // Save file
    XLSX.writeFile(wb, 'vendor_template.xlsx');
  };

  const downloadAllVendorsAsExcel = () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Vendors');

  worksheet.columns = [
    { header: 'S.No', key: 'sno', width: 8 },
    { header: 'Vendor Name', key: 'vendorName', width: 25 },
    { header: 'Category', key: 'vendorCategory', width: 15 },
    { header: 'Mobile Number', key: 'vendorNumber', width: 15 },
    { header: 'Alternate Number', key: 'vendorAlternateNumber', width: 15 },
    { header: 'Landline', key: 'landlineNumber', width: 15 },
    { header: 'Email', key: 'vendorEmail', width: 25 },
    { header: 'GST Number', key: 'gstNumber', width: 18 },
    { header: 'PAN Number', key: 'panNumber', width: 18 },
    { header: 'Location', key: 'location', width: 15 },
    { header: 'State', key: 'state', width: 15 },
    { header: 'Vendor Address', key: 'vendorAddress', width: 30 },
    { header: 'Delivery Address', key: 'deliveryAddress', width: 30 },
    { header: 'Bank Name', key: 'bankName', width: 18 },
    { header: 'Account Number', key: 'accountNumber', width: 18 },
    { header: 'IFSC Code', key: 'ifscCode', width: 15 },
    { header: 'Bank Branch', key: 'bankBranch', width: 15 },
    { header: 'Account Holder Name', key: 'accountHolderName', width: 20 },
  ];

  // Header color
  worksheet.getRow(1).eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1976D2' }, // Blue
    };
    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  vendors.forEach((item, idx) => {
    worksheet.addRow({
      sno: idx + 1,
      vendorName: item.vendorName || '',
      vendorCategory: item.vendorCategory || '',
      vendorNumber: item.vendorNumber || '',
      vendorAlternateNumber: item.vendorAlternateNumber || '',
      landlineNumber: item.landlineNumber || '',
      vendorEmail: item.vendorEmail || '',
      gstNumber: item.gstNumber || '',
      panNumber: item.panNumber || '',
      location: item.location || '',
      state: item.state || '',
      vendorAddress: Array.isArray(item.vendorAddress) ? item.vendorAddress.join(', ') : item.vendorAddress || '',
      deliveryAddress: Array.isArray(item.deliveryAddress) ? item.deliveryAddress.join(', ') : item.deliveryAddress || '',
      bankName: item.bankName || '',
      accountNumber: item.accountNumber || '',
      ifscCode: item.ifscCode || '',
      bankBranch: item.bankBranch || '',
      accountHolderName: item.accountHolderName || '',
    });
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MNS_All_Vendors_List.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  });
  toast.success('Excel file downloaded!');
};

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Alert */}
      {alert.open && (
        <div className={`mb-4 p-4 rounded-lg ${alert.severity === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {alert.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vendor Management</h1>
        <p className="text-gray-600">Add, edit, and manage your vendors</p>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <button
                onClick={() => {
                  resetVendorForm();
                  setVendorModalOpen(true);
                }}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <FaPlus className="mr-2" />
                Add Vendor
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                >
                  <FaUpload className="mr-2" />
                  Upload Excel
                </button>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  <FaFileExcel className="mr-2" />
                  Download Template
                </button>

                <button
                  onClick={() => downloadAllVendorsAsExcel()}
                  className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  <Download className="mr-2" />
                  Download All Vendors
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
              >
                <FaFilter className="mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vendorCategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor Category
                  </label>
                  <select
                    id="vendorCategory"
                    name="vendorCategory"
                    value={filters.vendorCategory}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Categories</option>
                    {vendorCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Filter by location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vendors Table */}
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
            <p className="mt-4 text-lg font-medium text-gray-800">{error}</p>
            <button
              onClick={fetchVendors}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : paginatedVendors.length === 0 ? (
          <div className="p-8 text-center">
            <FaBuilding className="h-16 w-16 mx-auto text-gray-400" />
            <p className="mt-4 text-lg font-medium text-gray-800">No vendors found</p>
            <p className="text-gray-600">Create a new vendor or adjust your filters</p>
            <button
              onClick={() => {
                resetVendorForm();
                setVendorModalOpen(true);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Add New Vendor
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GST Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedVendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {vendor.vendorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex flex-col">
                          <span>{vendor.vendorNumber}</span>
                          <span className="text-xs text-gray-500">{vendor.vendorEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {vendor.vendorCategory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {vendor.gstNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {vendor.location || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openViewModal(vendor)}
                            className="text-blue-600 hover:text-blue-900 focus:outline-none cursor-pointer"
                            title="View Details"
                          >
                            <FaEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openEditModal(vendor)}
                            className="text-indigo-600 hover:text-indigo-900 focus:outline-none cursor-pointer"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(vendor.id)}
                            className="text-red-600 hover:text-red-900 focus:outline-none cursor-pointer"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-sm text-gray-700 mr-4">
                  Showing {paginatedVendors.length} of {totalItems} entries
                </span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                      }`}
                  >
                    <span className="sr-only">First</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M7.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L3.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                      }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show current page, first and last page, and pages around current page
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there are gaps
                      const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                      const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;

                      return (
                        <React.Fragment key={page}>
                          {showEllipsisBefore && (
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === page
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white text-gray-500 hover:bg-gray-50 cursor-pointer'
                              }`}
                          >
                            {page}
                          </button>
                          {showEllipsisAfter && (
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                          )}
                        </React.Fragment>
                      );
                    })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                      }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                      }`}
                  >
                    <span className="sr-only">Last</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M12.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L16.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Vendor Form Modal */}
      {vendorModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaBuilding className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {isEditing ? 'Edit Vendor' : 'Add New Vendor'}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleVendorSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Basic Information */}
                          <div className="col-span-1 md:col-span-2">
                            <h4 className="text-md font-medium text-gray-900 mb-2">Basic Information</h4>
                          </div>

                          <div>
                            <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-1">
                              Vendor Name*
                            </label>
                            <input
                              type="text"
                              id="vendorName"
                              name="vendorName"
                              value={vendorForm.vendorName}
                              onChange={handleVendorFormChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="vendorCategory" className="block text-sm font-medium text-gray-700 mb-1">
                              Vendor Category*
                            </label>
                            <select
                              id="vendorCategory"
                              name="vendorCategory"
                              value={vendorForm.vendorCategory}
                              onChange={handleVendorFormChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select Category</option>
                              {vendorCategories.map(category => (
                                <option key={`form-${category}`} value={category}>{category}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label htmlFor="vendorNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              Mobile Number
                            </label>
                            <input
                              type="text"
                              id="vendorNumber"
                              name="vendorNumber"
                              value={vendorForm.vendorNumber}
                              onChange={handleVendorFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="vendorAlternateNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              Alternate Mobile Number
                            </label>
                            <input
                              type="text"
                              id="vendorAlternateNumber"
                              name="vendorAlternateNumber"
                              value={vendorForm.vendorAlternateNumber}
                              onChange={handleVendorFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="landlineNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              Landline Number
                            </label>
                            <input
                              type="text"
                              id="landlineNumber"
                              name="landlineNumber"
                              value={vendorForm.landlineNumber}
                              onChange={handleVendorFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="vendorEmail" className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              id="vendorEmail"
                              name="vendorEmail"
                              value={vendorForm.vendorEmail}
                              onChange={handleVendorFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                              Location*
                            </label>
                            <input
                              type="text"
                              id="location"
                              name="location"
                              value={vendorForm.location}
                              onChange={handleVendorFormChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              GST Number
                            </label>
                            <input
                              type="text"
                              id="gstNumber"
                              name="gstNumber"
                              value={vendorForm.gstNumber}
                              onChange={handleVendorFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              PAN Number
                            </label>
                            <input
                              type="text"
                              id="panNumber"
                              name="panNumber"
                              value={vendorForm.panNumber}
                              onChange={handleVendorFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              State
                            </label>
                            <input
                              type="text"
                              id="state"
                              name="state"
                              value={vendorForm.state}
                              onChange={handleVendorFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          {/* Vendor Address */}
                          <div className="col-span-1 md:col-span-2 mt-4">
                            <h4 className="text-md font-medium text-gray-900 mb-2">Vendor Address</h4>
                            {vendorForm.vendorAddress.map((address, index) => (
                              <div key={`vendor-address-${index}`} className="flex items-center mb-2">
                                <input
                                  type="text"
                                  value={address}
                                  onChange={(e) => handleArrayFieldChange('vendorAddress', index, e.target.value)}
                                  placeholder={`Address Line ${index + 1}`}
                                  className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="flex ml-2">
                                  {vendorForm.vendorAddress.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeArrayItem('vendorAddress', index)}
                                      className="p-2 text-red-600 hover:text-red-800 cursor-pointer"
                                    >
                                      <FaTrash className="h-4 w-4" />
                                    </button>
                                  )}
                                  {index === vendorForm.vendorAddress.length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => addArrayItem('vendorAddress')}
                                      className="p-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                                    >
                                      <FaPlus className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Delivery Address */}
                          <div className="col-span-1 md:col-span-2">
                            <h4 className="text-md font-medium text-gray-900 mb-2">Delivery Address</h4>
                            {vendorForm.deliveryAddress.map((address, index) => (
                              <div key={`delivery-address-${index}`} className="flex items-center mb-2">
                                <input
                                  type="text"
                                  value={address}
                                  onChange={(e) => handleArrayFieldChange('deliveryAddress', index, e.target.value)}
                                  placeholder={`Address Line ${index + 1}`}
                                  className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="flex ml-2">
                                  {vendorForm.deliveryAddress.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeArrayItem('deliveryAddress', index)}
                                      className="p-2 text-red-600 hover:text-red-800 cursor-pointer"
                                    >
                                      <FaTrash className="h-4 w-4" />
                                    </button>
                                  )}
                                  {index === vendorForm.deliveryAddress.length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => addArrayItem('deliveryAddress')}
                                      className="p-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                                    >
                                      <FaPlus className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Bank Details */}
                          <div className="col-span-1 md:col-span-2 mt-4">
                            <h4 className="text-md font-medium text-gray-900 mb-2">Bank Details</h4>
                          </div>

                          <div>
                            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                              Bank Name
                            </label>
                            <input
                              type="text"
                              id="bankName"
                              name="bankName"
                              value={vendorForm.bankName}
                              onChange={handleVendorFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              Account Number
                            </label>
                            <input
                              type="text"
                              id="accountNumber"
                              name="accountNumber"
                              value={vendorForm.accountNumber}
                              onChange={handleVendorFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 mb-1">
                              IFSC Code
                            </label>
                            <input
                              type="text"
                              id="ifscCode"
                              name="ifscCode"
                              value={vendorForm.ifscCode}
                              onChange={handleVendorFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="bankBranch" className="block text-sm font-medium text-gray-700 mb-1">
                              Bank Branch
                            </label>
                            <input
                              type="text"
                              id="bankBranch"
                              name="bankBranch"
                              value={vendorForm.bankBranch}
                              onChange={handleVendorFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700 mb-1">
                              Account Holder Name
                            </label>
                            <input
                              type="text"
                              id="accountHolderName"
                              name="accountHolderName"
                              value={vendorForm.accountHolderName}
                              onChange={handleVendorFormChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                          <button
                            type="button"
                            onClick={() => setVendorModalOpen(false)}
                            className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm cursor-pointer"
                          >
                            {isEditing ? 'Update Vendor' : 'Create Vendor'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Vendor Modal */}
      {viewModalOpen && currentVendor && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaBuilding className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Vendor Details</h3>
                    <div className="mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="col-span-1 md:col-span-2">
                            <h4 className="text-md font-semibold text-gray-900 flex items-center">
                              <FaBuilding className="mr-2 text-blue-600" />
                              Basic Information
                            </h4>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Vendor Name</p>
                            <p className="text-sm font-semibold text-gray-900">{currentVendor.vendorName}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Category</p>
                            <p className="text-sm font-semibold text-gray-900">{currentVendor.vendorCategory || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Location</p>
                            <p className="text-sm font-semibold text-gray-900">{currentVendor.location || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">State</p>
                            <p className="text-sm font-semibold text-gray-900">{currentVendor?.state || 'N/A'}</p>
                          </div>

                          <div className="col-span-1 md:col-span-2 mt-2">
                            <h4 className="text-md font-semibold text-gray-900 flex items-center">
                              <FaPhone className="mr-2 text-blue-600" />
                              Contact Information
                            </h4>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Mobile Number</p>
                            <p className="text-sm font-semibold text-gray-900">{currentVendor.vendorNumber || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Alternate Mobile</p>
                            <p className="text-sm font-semibold text-gray-900">{currentVendor.vendorAlternateNumber || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Landline</p>
                            <p className="text-sm font-semibold text-gray-900">{currentVendor.landlineNumber || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="text-sm font-semibold text-gray-900">{currentVendor.vendorEmail || 'N/A'}</p>
                          </div>

                          <div className="col-span-1 md:col-span-2 mt-2">
                            <h4 className="text-md font-semibold text-gray-900 flex items-center">
                              <FaIdCard className="mr-2 text-blue-600" />
                              Tax Information
                            </h4>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">GST Number</p>
                            <p className="text-sm font-semibold text-gray-900">{currentVendor.gstNumber || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">PAN Number</p>
                            <p className="text-sm font-semibold text-gray-900">{currentVendor.panNumber || 'N/A'}</p>
                          </div>

                          <div className="col-span-1 md:col-span-2 mt-2">
                            <h4 className="text-md font-semibold text-gray-900 flex items-center">
                              <FaMapMarkerAlt className="mr-2 text-blue-600" />
                              Addresses
                            </h4>
                          </div>

                          <div className="col-span-1 md:col-span-2">
                            <p className="text-sm font-medium text-gray-500">Vendor Address</p>
                            {currentVendor.vendorAddress && currentVendor.vendorAddress.length > 0 ? (
                              <ul className="list-disc pl-5 mt-1">
                                {currentVendor.vendorAddress.map((address, index) => (
                                  <li key={`view-vendor-address-${index}`} className="text-sm text-gray-900">
                                    {address}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-900">N/A</p>
                            )}
                          </div>

                          <div className="col-span-1 md:col-span-2">
                            <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                            {currentVendor.deliveryAddress && currentVendor.deliveryAddress.length > 0 ? (
                              <ul className="list-disc pl-5 mt-1">
                                {currentVendor.deliveryAddress.map((address, index) => (
                                  <li key={`view-delivery-address-${index}`} className="text-sm text-gray-900">
                                    {address}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-900">N/A</p>
                            )}
                          </div>

                          <div className="col-span-1 md:col-span-2 mt-2">
                            <h4 className="text-md font-semibold text-gray-900 flex items-center">
                              <BsBank className="mr-2 text-blue-600" />
                              Bank Details
                            </h4>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Bank Name</p>
                            <p className="text-sm font-semibold text-gray-900">{currentVendor.bankName || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Account Number</p>
                            <p className="text-sm font-semibold text-gray-900">{currentVendor.accountNumber || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">IFSC Code</p>
                            <p className="text-sm font-semibold text-gray-900">{currentVendor.ifscCode || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Bank Branch</p>
                            <p className="text-sm font-semibold text-gray-900">{currentVendor.bankBranch || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-500">Account Holder</p>
                            <p className="text-sm font-semibold text-gray-900">{currentVendor.accountHolderName || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setViewModalOpen(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => openEditModal(currentVendor)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                >
                  Edit Vendor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Excel Upload Modal */}
      {excelModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaFileExcel className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Vendors Excel</h3>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-4">
                        Upload an Excel file containing vendor information. The file should have the following columns:
                      </p>
                      <div className="bg-gray-50 p-3 rounded-lg mb-4 text-xs">
                        <p className="font-medium mb-1">Required columns:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Vendor Name</li>
                          <li>Vendor Category</li>
                          <li>Mobile Number</li>
                          <li>Email</li>
                          <li>Location</li>
                        </ul>
                        <p className="font-medium mt-2 mb-1">Optional columns:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Alternate Mobile Number</li>
                          <li>Landline Number</li>
                          <li>GST Number</li>
                          <li>PAN Number</li>
                          <li>Vendor Address</li>
                          <li>Delivery Address</li>
                          <li>Bank Name</li>
                          <li>Account Number</li>
                          <li>IFSC Code</li>
                          <li>Bank Branch</li>
                          <li>Account Holder Name</li>
                        </ul>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Excel File
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  accept=".xlsx, .xls"
                                  onChange={handleExcelFileChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">XLSX or XLS up to 10MB</p>
                          </div>
                        </div>
                        {excelFile && (
                          <div className="mt-3 flex items-center text-sm text-green-600">
                            <FaCheckCircle className="mr-2" />
                            <span>File selected: {excelFile.name}</span>
                          </div>
                        )}
                        {excelUploadError && (
                          <div className="mt-3 flex items-center text-sm text-red-600">
                            <FaExclamationCircle className="mr-2" />
                            <span>{excelUploadError}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <a
                          href="/templates/vendor_template.xlsx"
                          download
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <FaDownload className="mr-1" />
                          Download Template
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleExcelUpload}
                  disabled={!excelFile || excelUploading}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${!excelFile || excelUploading
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {excelUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    'Upload'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExcelModalOpen(false);
                    setExcelFile(null);
                    setExcelUploadError(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Vendor</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this vendor? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.visible && (
        <div
          className={`fixed bottom-4 right-4 z-50 rounded-lg shadow-lg px-6 py-4 flex items-center space-x-3 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            } text-white transition-opacity duration-500 ${toast.visible ? 'opacity-100' : 'opacity-0'}`}
        >
          {toast.type === 'success' ? (
            <FaCheckCircle className="h-5 w-5" />
          ) : (
            <FaExclamationCircle className="h-5 w-5" />
          )}
          <p>{toast.message}</p>
          <button
            onClick={() => setToast({ ...toast, visible: false })}
            className="ml-auto text-white hover:text-gray-200 focus:outline-none"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaUpload className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Vendor Documents</h3>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-4">
                        Upload documents related to vendors such as contracts, agreements, or other important files.
                      </p>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select File
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="document-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="document-upload"
                                  name="document-upload"
                                  type="file"
                                  className="sr-only"
                                  onChange={handleFileSelect}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX, XLS, XLSX up to 10MB</p>
                          </div>
                        </div>
                        {uploadFile && (
                          <div className="mt-3 flex items-center text-sm text-green-600">
                            <FaCheckCircle className="mr-2" />
                            <span>File selected: {uploadFile.name}</span>
                          </div>
                        )}
                      </div>

                      {uploadProgress > 0 && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-right">{uploadProgress}% uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleFileUpload}
                  disabled={!uploadFile || uploadProgress > 0}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${!uploadFile || uploadProgress > 0
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {uploadProgress > 0 ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadModalOpen(false);
                    setUploadFile(null);
                    setUploadProgress(0);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default VendorPage;