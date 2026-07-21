import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendDomainS } from "../../../common/index";
import { format } from 'date-fns';
import { FaEdit, FaTrash, FaFilePdf, FaFileExcel, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SnigdhaAddNotePage = () => {
  // State for notes data
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [paginatedNotes, setPaginatedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    amountType: '',
    minAmount: '',
    maxAmount: '',
    title: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // State for modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  
  // State for form data
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    amountType: 'increase',
    description: '',
    invoiceNumber: '',
    amount: '',
    type: 'product'
  });
  
  // State for alerts
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch notes data on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Apply filters and search when they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [notes, searchTerm, filters]);

  // Update paginated notes when filtered notes or pagination settings change
  useEffect(() => {
    paginateNotes();
  }, [filteredNotes, currentPage, itemsPerPage]);

  // Calculate total pages when total items or items per page changes
  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  // Fetch all notes from the API
  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendDomainS}/api/v1/notes/all`);
      console.log(response.data);
      // Ensure notes is always an array
      const notesData = Array.isArray(response.data.data) ? response.data.data : [];
      setNotes(notesData);
      setFilteredNotes(notesData);
      setTotalItems(notesData.length);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notes');
      setNotes([]);
      setFilteredNotes([]);
      setTotalItems(0);
      setLoading(false);
    }
  };

  // Apply filters and search to the notes data
  const applyFiltersAndSearch = () => {
    if (!Array.isArray(notes)) {
        setFilteredNotes([]);
        setTotalItems(0);
        return;
      }
      
      let filtered = [...notes];
      
      // Apply search term
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter(note => 
          note.title?.toLowerCase().includes(search) ||
          note.description?.toLowerCase().includes(search) ||
          note.invoiceNumber?.toLowerCase().includes(search)
        );
      }
    
    // Apply date filters
    if (filters.startDate) {
      filtered = filtered.filter(note => new Date(note.date) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(note => new Date(note.date) <= new Date(filters.endDate));
    }
    
    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(note => note.type === filters.type);
    }
    
    // Apply amount type filter
    if (filters.amountType) {
      filtered = filtered.filter(note => note.amountType === filters.amountType);
    }
    
    // Apply amount filters
    if (filters.minAmount) {
      filtered = filtered.filter(note => note.amount >= parseFloat(filters.minAmount));
    }
    
    if (filters.maxAmount) {
      filtered = filtered.filter(note => note.amount <= parseFloat(filters.maxAmount));
    }
    
    // Apply title filter
    if (filters.title) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }
    
    setFilteredNotes(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1); // Reset to first page when filters change
  };

    // Paginate the filtered notes
    const paginateNotes = () => {
        if (!Array.isArray(filteredNotes)) {
          setPaginatedNotes([]);
          return;
        }
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setPaginatedNotes(filteredNotes.slice(startIndex, endIndex));
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
      startDate: '',
      endDate: '',
      type: '',
      amountType: '',
      minAmount: '',
      maxAmount: '',
      title: ''
    });
    setSearchTerm('');
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      amountType: 'increase',
      description: '',
      invoiceNumber: '',
      amount: '',
      type: 'product'
    });
  };

  // Open edit modal with note data
  const openEditModal = (note) => {
    setCurrentNote(note);
    setFormData({
      title: note.title,
      date: new Date(note.date).toISOString().split('T')[0],
      amountType: note.amountType,
      description: note.description,
      invoiceNumber: note.invoiceNumber,
      amount: note.amount,
      type: note.type
    });
    setEditModalOpen(true);
  };

  // Handle add note form submission
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendDomainS}/api/v1/notes/create`, formData);
      setAddModalOpen(false);
      resetForm();
      fetchNotes();
      setAlert({
        open: true,
        message: 'Note added successfully',
        severity: 'success'
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    } catch (err) {
      setAlert({
        open: true,
        message: err.response?.data?.message || 'Failed to add note',
        severity: 'error'
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    }
  };

  // Handle edit note form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendDomainS}/api/v1/notes/update/${currentNote._id}`, formData);
      setEditModalOpen(false);
      resetForm();
      fetchNotes();
      setAlert({
        open: true,
        message: 'Note updated successfully',
        severity: 'success'
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    } catch (err) {
      setAlert({
        open: true,
        message: err.response?.data?.message || 'Failed to update note',
        severity: 'error'
      });
      setTimeout(() => setAlert({ ...alert, open: false }), 3000);
    }
  };

  // Handle delete note
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axios.delete(`${backendDomainS}/api/v1/notes/delete/${id}`);
        fetchNotes();
        setAlert({
          open: true,
          message: 'Note deleted successfully',
          severity: 'success'
        });
        setTimeout(() => setAlert({ ...alert, open: false }), 3000);
      } catch (err) {
        setAlert({
          open: true,
          message: err.response?.data?.message || 'Failed to delete note',
          severity: 'error'
        });
        setTimeout(() => setAlert({ ...alert, open: false }), 3000);
      }
    }
  };

    // Export to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text('Notes Report', 14, 22);
        doc.setFontSize(11);
        doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy')}`, 14, 30);
        
        // Define the columns for the table
        const columns = [
          { header: 'Date', dataKey: 'date' },
          { header: 'Title', dataKey: 'title' },
          { header: 'Invoice #', dataKey: 'invoiceNumber' },
          { header: 'Type', dataKey: 'type' },
          { header: 'Amount Type', dataKey: 'amountType' },
          { header: 'Amount', dataKey: 'amount' }
        ];
        
        // Ensure filteredNotes is an array before mapping
        const notesToExport = Array.isArray(filteredNotes) ? filteredNotes : [];
        
        // Prepare the data
        const data = notesToExport.map(note => ({
          date: formatDate(note.date),
          title: note.title,
          invoiceNumber: note.invoiceNumber,
          type: note.type,
          amountType: note.amountType,
          amount: `₹${note.amount.toLocaleString()}`
        }));
        
        // Generate the table
        doc.autoTable({
          head: [columns.map(column => column.header)],
          body: data.map(item => columns.map(column => item[column.dataKey])),
          startY: 40,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [66, 139, 202] }
        });
        
        // Save the PDF
        doc.save('notes-report.pdf');
      };

  // Prepare CSV data for export
  const csvData = [
    ['Date', 'Title', 'Invoice #', 'Type', 'Amount Type', 'Amount', 'Description'],
    ...(Array.isArray(filteredNotes) ? filteredNotes.map(note => [
      formatDate(note.date),
      note.title,
      note.invoiceNumber,
      note.type,
      note.amountType,
      note.amount,
      note.description
    ]) : [])
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Alert */}
      {alert.open && (
        <div className={`mb-4 p-4 rounded-lg ${
          alert.severity === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {alert.message}
        </div>
      )}
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notes Management</h1>
        <p className="text-gray-600">Add, edit, and manage notes for your business</p>
      </div>
      
      {/* Actions Bar */}
      <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <button
                onClick={() => setAddModalOpen(true)}
                className="flex cursor-pointer items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                Add Note
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={exportToPDF}
                  className="flex cursor-pointer items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FaFilePdf className="mr-2" />
                  PDF
                </button>
                <CSVLink
                  data={csvData}
                  filename="notes-report.csv"
                  className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaFileExcel className="mr-2" />
                  CSV
                </CSVLink>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex cursor-pointer items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <FaFilter className="mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                    <option value="purchase">Purchase</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="amountType" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Type
                  </label>
                  <select
                    id="amountType"
                    name="amountType"
                    value={filters.amountType}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Amount Types</option>
                    <option value="increase">Increase</option>
                    <option value="decrease">Decrease</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Min Amount
                  </label>
                  <input
                    type="number"
                    id="minAmount"
                    name="minAmount"
                    value={filters.minAmount}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Max Amount
                  </label>
                  <input
                    type="number"
                    id="maxAmount"
                    name="maxAmount"
                    value={filters.maxAmount}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={filters.title}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4  py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes Table */}
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
              onClick={fetchNotes}
              className="mt-4  px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : paginatedNotes.length === 0 ? (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mt-4">No Notes Found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm || Object.values(filters).some(val => val !== '') 
                ? 'Try adjusting your search or filters' 
                : 'Add your first note to get started'}
            </p>
            <button
              onClick={() => setAddModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Add New Note
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th> */}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedNotes.map((note) => (
                    <tr key={note._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(note.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {note.title}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {note.description}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {note.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          note.type === 'product' 
                            ? 'bg-blue-100 text-blue-800' 
                            : note.type === 'service'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {note.type.charAt(0).toUpperCase() + note.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          note.amountType === 'increase' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {note.amountType.charAt(0).toUpperCase() + note.amountType.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{note.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(note)}
                            className="text-indigo-600 cursor-pointer hover:text-indigo-900 focus:outline-none"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(note._id)}
                            className="text-red-600 cursor-pointer hover:text-red-900 focus:outline-none"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

 {/* Summary Rows */}
 {paginatedNotes.length > 0 && (
                    <>
                      {/* Page Summary - Increase */}
                      <tr className="bg-green-50 font-medium">
                        <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-green-900 text-right">
                          <strong>Page Total (Increase):</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Increase
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-900">
                          ₹{paginatedNotes
                            .filter(note => note.amountType === 'increase')
                            .reduce((sum, note) => sum + note.amount, 0)
                            .toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                      
                      {/* Page Summary - Decrease */}
                      <tr className="bg-red-50 font-medium">
                        <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-red-900 text-right">
                          <strong>Page Total (Decrease):</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Decrease
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-900">
                          ₹{paginatedNotes
                            .filter(note => note.amountType === 'decrease')
                            .reduce((sum, note) => sum + note.amount, 0)
                            .toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                      
                      {/* Page Net Total */}
                      <tr className="bg-gray-100 font-medium">
                        <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          <strong>Page Net Total:</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-gray-800">
                            Net
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          ₹{(paginatedNotes
                            .filter(note => note.amountType === 'increase')
                            .reduce((sum, note) => sum + note.amount, 0) - 
                            paginatedNotes
                            .filter(note => note.amountType === 'decrease')
                            .reduce((sum, note) => sum + note.amount, 0))
                            .toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                      
                      {/* Grand Total - Increase */}
                      <tr className="bg-green-100 font-medium">
                        <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-green-900 text-right">
                          <strong>Grand Total (Increase):</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-200 text-green-800">
                            Increase
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-900">
                          ₹{filteredNotes
                            .filter(note => note.amountType === 'increase')
                            .reduce((sum, note) => sum + note.amount, 0)
                            .toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                      
                      {/* Grand Total - Decrease */}
                      <tr className="bg-red-100 font-medium">
                        <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-red-900 text-right">
                          <strong>Grand Total (Decrease):</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-800">
                            Decrease
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-900">
                          ₹{filteredNotes
                            .filter(note => note.amountType === 'decrease')
                            .reduce((sum, note) => sum + note.amount, 0)
                            .toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                      
                      {/* Grand Net Total */}
                      <tr className="bg-blue-100 font-medium">
                        <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 text-right">
                          <strong>Grand Net Total ({filteredNotes.length} notes):</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-200 text-blue-800">
                            Net
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">
                          ₹{(filteredNotes
                            .filter(note => note.amountType === 'increase')
                            .reduce((sum, note) => sum + note.amount, 0) - 
                            filteredNotes
                            .filter(note => note.amountType === 'decrease')
                            .reduce((sum, note) => sum + note.amount, 0))
                            .toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                    </>
                  )}

                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-sm text-gray-700 mr-4">
                  Showing {paginatedNotes.length} of {totalItems} entries
                </span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>
              
              <div className="flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 cursor-pointer hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">First</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 cursor-pointer hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {[...Array(totalPages).keys()].map(number => {
                    const pageNumber = number + 1;
                    // Show only a window of 5 pages around the current page
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`relative cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === pageNumber
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    
                    // Add ellipsis
                    if (
                      (pageNumber === currentPage - 3 && currentPage > 4) ||
                      (pageNumber === currentPage + 3 && currentPage < totalPages - 3)
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 cursor-pointer hover:bg-gray-50'
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
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 cursor-pointer hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Last</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Note Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Note</h3>
                    <form onSubmit={handleAddSubmit}>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="amountType" className="block text-sm font-medium text-gray-700 mb-1">
                            Amount Type
                          </label>
                          <select
                            id="amountType"
                            name="amountType"
                            value={formData.amountType}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="increase">Increase</option>
                            <option value="decrease">Decrease</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice Number
                          </label>
                          <input
                            type="text"
                            id="invoiceNumber"
                            name="invoiceNumber"
                            value={formData.invoiceNumber}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                          </label>
                          <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="product">Product</option>
                            {/* <option value="service">Service</option> */}
                            <option value="purchase">Purchase</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full cursor-pointer inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Add Note
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddModalOpen(false);
                            resetForm();
                          }}
                          className="mt-3 cursor-pointer w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Note Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Note</h3>
                    <form onSubmit={handleEditSubmit}>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            id="edit-title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            id="edit-date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-amountType" className="block text-sm font-medium text-gray-700 mb-1">
                            Amount Type
                          </label>
                          <select
                            id="edit-amountType"
                            name="amountType"
                            value={formData.amountType}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="increase">Increase</option>
                            <option value="decrease">Decrease</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            id="edit-description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice Number
                          </label>
                          <input
                            type="text"
                            id="edit-invoiceNumber"
                            name="invoiceNumber"
                            value={formData.invoiceNumber}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                          </label>
                          <input
                            type="number"
                            id="edit-amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select
                            id="edit-type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="product">Product</option>
                            {/* <option value="service">Service</option> */}
                            <option value="purchase">Purchase</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full cursor-pointer inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Update Note
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditModalOpen(false);
                            resetForm();
                          }}
                          className="mt-3 cursor-pointer w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnigdhaAddNotePage;

