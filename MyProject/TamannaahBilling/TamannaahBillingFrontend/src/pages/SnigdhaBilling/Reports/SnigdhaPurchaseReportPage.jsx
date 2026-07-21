import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  TextField,
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  FileDownload as ExcelIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
  Close as CloseIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { backendDomainS } from '../../../Common/index';

const SnigdhaPurchaseReportPage = () => {
  // State variables
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [filteredPurchaseOrders, setFilteredPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('orders'); // 'orders', 'items', 'vendors'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [reportSummary, setReportSummary] = useState({
    totalOrders: 0,
    totalAmount: 0,
    totalItems: 0,
    uniqueVendors: 0
  });
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);
  
  // Refs
  const pdfRef = useRef(null);

  // Fetch all purchase orders
  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendDomainS}/api/v1/po/all`);
      
      if (response && response.data && response.data.purchaseOrders) {
        const purchaseData = response.data.purchaseOrders;
        setPurchaseOrders(purchaseData);
        setFilteredPurchaseOrders(purchaseData);
        
        // Extract unique vendors and items for filters
        const uniqueVendors = [...new Set(purchaseData.map(po => 
          po.receiverDetails?.name).filter(Boolean))];
        
        setVendors(uniqueVendors.map(name => ({ name })));
        
        // Extract all items from all purchase orders
        const allItems = [];
        purchaseData.forEach(po => {
          if (po.items && Array.isArray(po.items)) {
            po.items.forEach(item => {
              if (item.itemName) {
                allItems.push({
                  name: item.itemName,
                  id: item.item_id || ''
                });
              }
            });
          }
        });
        
        // Get unique items by name
        const uniqueItems = [...new Map(allItems.map(item => 
          [item.name, item])).values()];
        
        setItems(uniqueItems);
        
        // Calculate report summary
        calculateReportSummary(purchaseData);
        
        toast.success('Purchase data loaded successfully');
      } else {
        setPurchaseOrders([]);
        setFilteredPurchaseOrders([]);
        toast.error('No purchase data found');
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      toast.error('Failed to fetch purchase data');
      setPurchaseOrders([]);
      setFilteredPurchaseOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary statistics for the report
  const calculateReportSummary = (data) => {
    if (!Array.isArray(data)) return;
    
    const totalOrders = data.length;
    
    const totalAmount = data.reduce((sum, po) => 
      sum + (parseFloat(po.grandTotal) || 0), 0);
    
    // Count total items purchased
    let totalItems = 0;
    data.forEach(po => {
      if (po.items && Array.isArray(po.items)) {
        po.items.forEach(item => {
          totalItems += (parseInt(item.quantity) || 0);
        });
      }
    });
    
    // Count unique vendors
    const uniqueVendors = new Set(data.map(po => 
      po.receiverDetails?.name).filter(Boolean)).size;
    
    setReportSummary({
      totalOrders,
      totalAmount,
      totalItems,
      uniqueVendors
    });
  };

  // Initial data fetch
  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  // Apply filters when search criteria change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, searchField, dateRange, selectedVendor, selectedItem, purchaseOrders, viewMode]);

  // Apply all filters to the purchase orders
  const applyFilters = () => {
    if (!Array.isArray(purchaseOrders)) return;
    
    let result = [...purchaseOrders];
    
    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59); // Set to end of day
      
      result = result.filter(po => {
        const poDate = new Date(po.date);
        return poDate >= fromDate && poDate <= toDate;
      });
    }
    
    // Apply vendor filter
    if (selectedVendor) {
      result = result.filter(po => 
        po.receiverDetails?.name === selectedVendor);
    }
    
    // Apply item filter
    if (selectedItem) {
      result = result.filter(po => {
        if (!po.items || !Array.isArray(po.items)) return false;
        return po.items.some(item => item.itemName === selectedItem);
      });
    }
    
    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      
      result = result.filter(po => {
        if (searchField === 'all') {
          return (
            (po.invoiceNumber && po.invoiceNumber.toLowerCase().includes(term)) ||
            (po.receiverDetails?.name && po.receiverDetails.name.toLowerCase().includes(term)) ||
            (po.receiverDetails?.phoneNumber && po.receiverDetails.phoneNumber.toLowerCase().includes(term)) ||
            (po.items && Array.isArray(po.items) && po.items.some(item => 
              item.itemName && item.itemName.toLowerCase().includes(term)))
          );
        } else if (searchField === 'invoiceNumber') {
          return po.invoiceNumber && po.invoiceNumber.toLowerCase().includes(term);
        } else if (searchField === 'vendorName') {
          return po.receiverDetails?.name && po.receiverDetails.name.toLowerCase().includes(term);
        } else if (searchField === 'itemName') {
          return po.items && Array.isArray(po.items) && po.items.some(item => 
            item.itemName && item.itemName.toLowerCase().includes(term));
        }
        return false;
      });
    }
    
    setFilteredPurchaseOrders(result);
    calculateReportSummary(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSearchField('all');
    setDateRange({ from: '', to: '' });
    setSelectedVendor('');
    setSelectedItem('');
    setFilteredPurchaseOrders(purchaseOrders);
    calculateReportSummary(purchaseOrders);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredPurchaseOrders) 
    ? filteredPurchaseOrders.slice(indexOfFirstItem, indexOfLastItem) 
    : [];
  const totalPages = Math.ceil(
    (Array.isArray(filteredPurchaseOrders) ? filteredPurchaseOrders.length : 0) / itemsPerPage
  );

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  // View purchase order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate PDF report
  const generatePDF = () => {
    setIsGeneratingPdf(true);
    
    try {
      const doc = new jsPDF('landscape');
      
      // Add title
      doc.setFontSize(18);
      doc.text('Purchase Report', 14, 22);
      
      // Add report metadata
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      
      if (dateRange.from && dateRange.to) {
        doc.text(`Date Range: ${formatDate(dateRange.from)} to ${formatDate(dateRange.to)}`, 14, 35);
      }
      
      if (selectedVendor) {
        doc.text(`Vendor: ${selectedVendor}`, 14, 40);
      }
      
      if (selectedItem) {
        doc.text(`Item: ${selectedItem}`, 14, 45);
      }
      
      // Add summary section
      doc.setFontSize(12);
      doc.text('Summary', 14, 55);
      
      doc.setFontSize(10);
      doc.text(`Total Orders: ${reportSummary.totalOrders}`, 14, 62);
      doc.text(`Total Amount: ₹${reportSummary.totalAmount.toFixed(2)}`, 80, 62);
      doc.text(`Total Items: ${reportSummary.totalItems}`, 150, 62);
      doc.text(`Unique Vendors: ${reportSummary.uniqueVendors}`, 210, 62);
      
      // Add table data
      const tableColumn = viewMode === 'orders' 
        ? ["Invoice No.", "Date", "Vendor", "Items", "Amount"]
        : viewMode === 'items'
        ? ["Item Name", "Total Quantity", "Average Price", "Total Value"]
        : ["Vendor Name", "Orders", "Total Value"];
      
      let tableRows = [];
      
      if (viewMode === 'orders') {
        // Purchase orders table
        tableRows = filteredPurchaseOrders.map(po => [
          po.invoiceNumber || 'N/A',
          formatDate(po.date),
          po.receiverDetails?.name || 'N/A',
          po.items?.length || 0,
          `₹${parseFloat(po.grandTotal || 0).toFixed(2)}`
        ]);
      } else if (viewMode === 'items') {
        // Items summary table
        const itemSummary = {};
        
        filteredPurchaseOrders.forEach(po => {
          if (po.items && Array.isArray(po.items)) {
            po.items.forEach(item => {
              if (!item.itemName) return;
              
              if (!itemSummary[item.itemName]) {
                itemSummary[item.itemName] = {
                  quantity: 0,
                  totalValue: 0,
                  pricePoints: 0,
                  totalPrice: 0
                };
              }
              
              const quantity = parseInt(item.quantity) || 0;
              const unitPrice = parseFloat(item.unitPrice) || 0;
              const value = quantity * unitPrice;
              
              itemSummary[item.itemName].quantity += quantity;
              itemSummary[item.itemName].totalValue += value;
              
              if (unitPrice > 0) {
                itemSummary[item.itemName].pricePoints += 1;
                itemSummary[item.itemName].totalPrice += unitPrice;
              }
            });
          }
        });
        
        tableRows = Object.entries(itemSummary).map(([itemName, data]) => [
          itemName,
          data.quantity.toString(),
          `₹${(data.pricePoints > 0 ? data.totalPrice / data.pricePoints : 0).toFixed(2)}`,
          `₹${data.totalValue.toFixed(2)}`
        ]);
      } else {
        // Vendors summary table
        const vendorSummary = {};
        
        filteredPurchaseOrders.forEach(po => {
          const vendorName = po.receiverDetails?.name;
          if (!vendorName) return;
          
          if (!vendorSummary[vendorName]) {
            vendorSummary[vendorName] = {
              orders: 0,
              totalValue: 0
            };
          }
          
          vendorSummary[vendorName].orders += 1;
          vendorSummary[vendorName].totalValue += parseFloat(po.grandTotal || 0);
        });
        
        tableRows = Object.entries(vendorSummary).map(([vendorName, data]) => [
          vendorName,
          data.orders.toString(),
          `₹${data.totalValue.toFixed(2)}`
        ]);
      }
      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255
        }
      });
      
      // Save the PDF
      doc.save('purchase_report.pdf');
      toast.success('PDF report generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Generate Excel report
  const generateExcel = () => {
    setIsGeneratingExcel(true);
    
    try {
      let data = [];
      let sheetName = '';
      
      if (viewMode === 'orders') {
        // Purchase orders data
        sheetName = 'Purchase Orders';
        
        data = filteredPurchaseOrders.map(po => ({
          'Invoice Number': po.invoiceNumber || 'N/A',
          'Date': formatDate(po.date),
          'Vendor': po.receiverDetails?.name || 'N/A',
          'Phone': po.receiverDetails?.phoneNumber || 'N/A',
          'Payment Type': po.paymentType || 'N/A',
          'Items Count': po.items?.length || 0,
          'Total Amount': parseFloat(po.grandTotal || 0).toFixed(2)
        }));
      } else if (viewMode === 'items') {
        // Items summary data
        sheetName = 'Items Summary';
        
        const itemSummary = {};
        
        filteredPurchaseOrders.forEach(po => {
          if (po.items && Array.isArray(po.items)) {
            po.items.forEach(item => {
              if (!item.itemName) return;
              
              if (!itemSummary[item.itemName]) {
                itemSummary[item.itemName] = {
                  quantity: 0,
                  totalValue: 0,
                  pricePoints: 0,
                  totalPrice: 0,
                  vendors: new Set()
                };
              }
              
              const quantity = parseInt(item.quantity) || 0;
              const unitPrice = parseFloat(item.unitPrice) || 0;
              const value = quantity * unitPrice;
              
              itemSummary[item.itemName].quantity += quantity;
              itemSummary[item.itemName].totalValue += value;
              
              if (unitPrice > 0) {
                itemSummary[item.itemName].pricePoints += 1;
                itemSummary[item.itemName].totalPrice += unitPrice;
              }
              
              if (po.receiverDetails?.name) {
                itemSummary[item.itemName].vendors.add(po.receiverDetails.name);
              }
            });
          }
        });
        
        data = Object.entries(itemSummary).map(([itemName, data]) => ({
          'Item Name': itemName,
          'Total Quantity': data.quantity,
          'Average Price': (data.pricePoints > 0 ? data.totalPrice / data.pricePoints : 0).toFixed(2),
          'Total Value': data.totalValue.toFixed(2),
          'Vendors Count': data.vendors.size,
          'Vendors': Array.from(data.vendors).join(', ')
        }));
      } else {
        // Vendors summary data
        sheetName = 'Vendors Summary';
        
        const vendorSummary = {};
        
        filteredPurchaseOrders.forEach(po => {
          const vendorName = po.receiverDetails?.name;
          if (!vendorName) return;
          
          if (!vendorSummary[vendorName]) {
            vendorSummary[vendorName] = {
              orders: 0,
              totalValue: 0,
              items: new Set(),
              phoneNumber: po.receiverDetails?.phoneNumber || 'N/A',
              address: po.receiverDetails?.address || 'N/A'
            };
          }
          
          vendorSummary[vendorName].orders += 1;
          vendorSummary[vendorName].totalValue += parseFloat(po.grandTotal || 0);
          
          if (po.items && Array.isArray(po.items)) {
            po.items.forEach(item => {
              if (item.itemName) {
                vendorSummary[vendorName].items.add(item.itemName);
              }
            });
          }
        });
        
        data = Object.entries(vendorSummary).map(([vendorName, data]) => ({
          'Vendor Name': vendorName,
          'Phone Number': data.phoneNumber,
          'Address': data.address,
          'Orders Count': data.orders,
          'Total Value': data.totalValue.toFixed(2),
          'Unique Items': data.items.size,
          'Items': Array.from(data.items).join(', ')
        }));
      }
      
      // Create a worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Create a workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      
      // Generate Excel file
      XLSX.writeFile(wb, 'purchase_report.xlsx');
      
      toast.success('Excel report generated successfully');
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Failed to generate Excel report');
    } finally {
      setIsGeneratingExcel(false);
    }
  };

  // Get item-wise summary data
  const getItemSummary = () => {
    const itemSummary = {};
    
    filteredPurchaseOrders.forEach(po => {
      if (po.items && Array.isArray(po.items)) {
        po.items.forEach(item => {
          if (!item.itemName) return;
          
          if (!itemSummary[item.itemName]) {
            itemSummary[item.itemName] = {
              quantity: 0,
              totalValue: 0,
              vendors: new Set(),
              lastPurchaseDate: null
            };
          }
          
          const quantity = parseInt(item.quantity) || 0;
          const unitPrice = parseFloat(item.unitPrice) || 0;
          const value = quantity * unitPrice;
          
          itemSummary[item.itemName].quantity += quantity;
          itemSummary[item.itemName].totalValue += value;
          
          if (po.receiverDetails?.name) {
            itemSummary[item.itemName].vendors.add(po.receiverDetails.name);
          }
          
          // Track last purchase date
          const poDate = new Date(po.date);
          if (!itemSummary[item.itemName].lastPurchaseDate || 
              poDate > new Date(itemSummary[item.itemName].lastPurchaseDate)) {
            itemSummary[item.itemName].lastPurchaseDate = po.date;
          }
        });
      }
    });
    
    return Object.entries(itemSummary).map(([itemName, data]) => ({
      name: itemName,
      quantity: data.quantity,
      totalValue: data.totalValue,
      vendorCount: data.vendors.size,
      lastPurchaseDate: data.lastPurchaseDate
    }));
  };

  // Get vendor-wise summary data
  const getVendorSummary = () => {
    const vendorSummary = {};
    
    filteredPurchaseOrders.forEach(po => {
      const vendorName = po.receiverDetails?.name;
      if (!vendorName) return;
      
      if (!vendorSummary[vendorName]) {
        vendorSummary[vendorName] = {
          orders: 0,
          totalValue: 0,
          items: new Set(),
          lastOrderDate: null,
          phoneNumber: po.receiverDetails?.phoneNumber || 'N/A'
        };
      }
      
      vendorSummary[vendorName].orders += 1;
      vendorSummary[vendorName].totalValue += parseFloat(po.grandTotal || 0);
      
      // Track last order date
      const poDate = new Date(po.date);
      if (!vendorSummary[vendorName].lastOrderDate || 
          poDate > new Date(vendorSummary[vendorName].lastOrderDate)) {
        vendorSummary[vendorName].lastOrderDate = po.date;
      }
      
      if (po.items && Array.isArray(po.items)) {
        po.items.forEach(item => {
          if (item.itemName) {
            vendorSummary[vendorName].items.add(item.itemName);
          }
        });
      }
    });
    
    return Object.entries(vendorSummary).map(([vendorName, data]) => ({
      name: vendorName,
      orders: data.orders,
      totalValue: data.totalValue,
      itemCount: data.items.size,
      lastOrderDate: data.lastOrderDate,
      phoneNumber: data.phoneNumber
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Purchase Report 
          </h2>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={viewMode === 'orders' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setViewMode('orders')}
              startIcon={<CalendarIcon />}
              size="small"
            >
              Orders
            </Button>
            <Button
              variant={viewMode === 'items' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setViewMode('items')}
              startIcon={<InventoryIcon />}
              size="small"
            >
              Items
            </Button>
            <Button
              variant={viewMode === 'vendors' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setViewMode('vendors')}
              startIcon={<PersonIcon />}
              size="small"
            >
              Vendors
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <div className="text-blue-500 text-sm font-medium mb-1">Total Orders</div>
            <div className="text-2xl font-bold">{reportSummary.totalOrders}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <div className="text-green-500 text-sm font-medium mb-1">Total Amount</div>
            <div className="text-2xl font-bold">₹{reportSummary.totalAmount.toFixed(2)}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
            <div className="text-purple-500 text-sm font-medium mb-1">Total Items's Quantity</div>
            <div className="text-2xl font-bold">{reportSummary.totalItems}</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg shadow-sm">
            <div className="text-amber-500 text-sm font-medium mb-1">Unique Vendors</div>
            <div className="text-2xl font-bold">{reportSummary.uniqueVendors}</div>
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-grow">
              <TextField
                fullWidth
                variant="outlined"
                placeholder={`Search ${viewMode === 'orders' ? 'purchase orders' : viewMode === 'items' ? 'items' : 'vendors'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </div>
            
            <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
              <InputLabel>Search In</InputLabel>
              <Select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                label="Search In"
              >
                <MenuItem value="all">All Fields</MenuItem>
                <MenuItem value="invoiceNumber">Invoice Number</MenuItem>
                <MenuItem value="vendorName">Vendor Name</MenuItem>
                <MenuItem value="itemName">Item Name</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<FilterIcon />}
              size="small"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            
            <Button
              variant="outlined"
              color="secondary"
              onClick={resetFilters}
              startIcon={<RefreshIcon />}
              size="small"
            >
              Reset
            </Button>
          </div>
          
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                  <TextField
                    fullWidth
                    label="Date From"
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <TextField
                    fullWidth
                    label="Date To"
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Vendor</InputLabel>
                    <Select
                      value={selectedVendor}
                      onChange={(e) => setSelectedVendor(e.target.value)}
                      label="Vendor"
                    >
                      <MenuItem value="">All Vendors</MenuItem>
                      {vendors.map((vendor, index) => (
                        <MenuItem key={index} value={vendor.name}>
                          {vendor.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Item</InputLabel>
                    <Select
                      value={selectedItem}
                      onChange={(e) => setSelectedItem(e.target.value)}
                      label="Item"
                    >
                      <MenuItem value="">All Items</MenuItem>
                      {items.map((item, index) => (
                        <MenuItem key={index} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </div>
          )}
          
          {/* Export Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outlined"
              color="primary"
              onClick={generatePDF}
              startIcon={isGeneratingPdf ? <CircularProgress size={20} /> : <PdfIcon />}
              size="small"
              disabled={isGeneratingPdf || filteredPurchaseOrders.length === 0}
            >
              Export PDF
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={generateExcel}
              startIcon={isGeneratingExcel ? <CircularProgress size={20} /> : <ExcelIcon />}
              size="small"
              disabled={isGeneratingExcel || filteredPurchaseOrders.length === 0}
            >
              Export Excel
            </Button>
            <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
              <InputLabel>Items Per Page</InputLabel>
              <Select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                label="Items Per Page"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        
        {/* Data Tables */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <CircularProgress />
            <span className="ml-3">Loading purchase data...</span>
          </div>
        ) : filteredPurchaseOrders.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <InfoIcon color="info" style={{ fontSize: 48 }} />
            <Typography variant="h6" className="mt-2 mb-1">No Purchase Orders Found</Typography>
            <Typography variant="body2" color="textSecondary">
              Try adjusting your search criteria or filters to see more results.
            </Typography>
          </div>
        ) : (
          <>
            {/* Orders View */}
            {viewMode === 'orders' && (
              <TableContainer component={Paper} className="mb-4">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-bold">Invoice No.</TableCell>
                      <TableCell className="font-bold">Date</TableCell>
                      <TableCell className="font-bold">Vendor</TableCell>
                      <TableCell className="font-bold">Phone</TableCell>
                      <TableCell className="font-bold">Items</TableCell>
                      <TableCell className="font-bold">Amount</TableCell>
                      <TableCell className="font-bold">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((po, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{po.invoiceNumber || 'N/A'}</TableCell>
                        <TableCell>{formatDate(po.date)}</TableCell>
                        <TableCell>{po.receiverDetails?.name || 'N/A'}</TableCell>
                        <TableCell>{po.receiverDetails?.phoneNumber || 'N/A'}</TableCell>
                        <TableCell>{po.items?.length || 0}</TableCell>
                        <TableCell>₹{parseFloat(po.grandTotal || 0).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => viewOrderDetails(po)}
                            color="primary"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            {/* Items View */}
            {viewMode === 'items' && (
              <TableContainer component={Paper} className="mb-4">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-bold">Item Name</TableCell>
                      <TableCell className="font-bold">Total Quantity</TableCell>
                      <TableCell className="font-bold">Average Price</TableCell>
                      <TableCell className="font-bold">Total Value</TableCell>
                      <TableCell className="font-bold">Vendors</TableCell>
                      <TableCell className="font-bold">Last Purchase</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getItemSummary().slice(indexOfFirstItem, indexOfLastItem).map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          ₹{(item.totalValue / item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell>₹{item.totalValue.toFixed(2)}</TableCell>
                        <TableCell>{item.vendorCount}</TableCell>
                        <TableCell>{formatDate(item.lastPurchaseDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            {/* Vendors View */}
            {viewMode === 'vendors' && (
              <TableContainer component={Paper} className="mb-4">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-bold">Vendor Name</TableCell>
                      <TableCell className="font-bold">Phone Number</TableCell>
                      <TableCell className="font-bold">Orders</TableCell>
                      <TableCell className="font-bold">Total Value</TableCell>
                      <TableCell className="font-bold">Unique Items</TableCell>
                      <TableCell className="font-bold">Last Order</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getVendorSummary().slice(indexOfFirstItem, indexOfLastItem).map((vendor, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{vendor.name}</TableCell>
                        <TableCell>{vendor.phoneNumber}</TableCell>
                        <TableCell>{vendor.orders}</TableCell>
                        <TableCell>₹{vendor.totalValue.toFixed(2)}</TableCell>
                        <TableCell>{vendor.itemCount}</TableCell>
                        <TableCell>{formatDate(vendor.lastOrderDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            {/* Pagination */}
            <div className="flex justify-between items-center">
              <Typography variant="body2" color="textSecondary">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPurchaseOrders.length)} of {filteredPurchaseOrders.length} entries
              </Typography>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="small"
              />
            </div>
          </>
        )}
      </div>
      
      {/* Purchase Order Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <span>Purchase Order Details</span>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Invoice Number</Typography>
                  <Typography variant="body1">{selectedOrder.invoiceNumber || 'N/A'}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Date</Typography>
                  <Typography variant="body1">{formatDate(selectedOrder.date)}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Vendor</Typography>
                  <Typography variant="body1">{selectedOrder.receiverDetails?.name || 'N/A'}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                  <Typography variant="body1">{selectedOrder.receiverDetails?.phoneNumber || 'N/A'}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Payment Type</Typography>
                  <Typography variant="body1">{selectedOrder.paymentType || 'N/A'}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="textSecondary">Total Amount</Typography>
                  <Typography variant="body1">₹{parseFloat(selectedOrder.grandTotal || 0).toFixed(2)}</Typography>
                </div>
              </div>
              
              <Divider className="my-4" />
              
              <Typography variant="h6" className="mb-3">Items</Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-bold">Item Name</TableCell>
                      <TableCell className="font-bold">Quantity</TableCell>
                      <TableCell className="font-bold">Unit Price</TableCell>
                      <TableCell className="font-bold">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items && Array.isArray(selectedOrder.items) ? (
                      selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.itemName || 'N/A'}</TableCell>
                          <TableCell>{item.quantity || 0}</TableCell>
                          <TableCell>₹{parseFloat(item.unitPrice || 0).toFixed(2)}</TableCell>
                          <TableCell>
                            ₹{((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">No items found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {selectedOrder.notes && (
                <>
                  <Divider className="my-4" />
                  <Typography variant="subtitle2" color="textSecondary">Notes</Typography>
                  <Typography variant="body2">{selectedOrder.notes}</Typography>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SnigdhaPurchaseReportPage;
