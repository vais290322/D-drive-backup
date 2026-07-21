import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  InputAdornment,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
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
  Chip,
  CircularProgress,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  FileDownload as ExcelIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

const fetchInvoice = import.meta.env.VITE_BASE_URL_C;

const SnigdhaProfitPage = () => {
  // State variables
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [profitRange, setProfitRange] = useState({ min: '', max: '' });
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('invoices'); // 'invoices', 'items'
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [reportSummary, setReportSummary] = useState({
    totalInvoices: 0,
    totalSales: 0,
    totalCost: 0,
    totalProfit: 0,
    profitMargin: 0
  });
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);
  
  // Fetch all invoices
  const getAllInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${fetchInvoice}/api/v2/invoice/invoices`);
      
      if (response && response.data && response.data.data) {
        const invoiceData = response.data.data;
        
        // Calculate profit for each invoice and its items
        const processedInvoices = invoiceData.map(invoice => {
          let totalCost = 0;
          let totalSales = 0;
          let totalProfit = 0;
          
          // Process items to calculate profit
          const itemsWithProfit = (invoice.items || []).map(item => {
            const quantity = Number(item.quantity) || 0;
            const unitPrice = Number(item.unitPrice) || 0;
            const sellingPrice = Number(item.sellingPrice) || 0;
            
            const cost = unitPrice * quantity;
            const sales = sellingPrice * quantity;
            const profit = sales - cost;
            const profitMargin = cost > 0 ? (profit / cost) * 100 : 0;
            
            totalCost += cost;
            totalSales += sales;
            totalProfit += profit;
            
            return {
              ...item,
              cost,
              sales,
              profit,
              profitMargin
            };
          });
          
          const profitMargin = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
          
          return {
            ...invoice,
            items: itemsWithProfit,
            totalCost,
            totalSales,
            totalProfit,
            profitMargin
          };
        });
        
        // Sort by date (newest first)
        const sortedInvoices = processedInvoices.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        setInvoices(sortedInvoices);
        setFilteredInvoices(sortedInvoices);
        
        // Extract unique items and customers for filters
        const uniqueItems = new Set();
        const uniqueCustomers = new Set();
        
        processedInvoices.forEach(invoice => {
          if (invoice.receiverDetails?.name) {
            uniqueCustomers.add(invoice.receiverDetails.name);
          }
          
          (invoice.items || []).forEach(item => {
            if (item.itemName) {
              uniqueItems.add(item.itemName);
            }
          });
        });
        
        setItems(Array.from(uniqueItems).map(name => ({ name })));
        setCustomers(Array.from(uniqueCustomers).map(name => ({ name })));
        
        // Calculate report summary
        calculateReportSummary(sortedInvoices);
        
        toast.success('Profit data loaded successfully');
      } else {
        setInvoices([]);
        setFilteredInvoices([]);
        toast.error('No invoice data found');
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to fetch invoice data');
      setInvoices([]);
      setFilteredInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary statistics for the report
  const calculateReportSummary = (data) => {
    if (!Array.isArray(data)) return;
    
    const totalInvoices = data.length;
    const totalSales = data.reduce((sum, invoice) => sum + (invoice.totalSales || 0), 0);
    const totalCost = data.reduce((sum, invoice) => sum + (invoice.totalCost || 0), 0);
    const totalProfit = data.reduce((sum, invoice) => sum + (invoice.totalProfit || 0), 0);
    const profitMargin = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
    
    setReportSummary({
      totalInvoices,
      totalSales,
      totalCost,
      totalProfit,
      profitMargin
    });
  };

  // Initial data fetch
  useEffect(() => {
    getAllInvoices();
  }, []);

  // Apply filters when search criteria change
  useEffect(() => {
    applyFilters();
  }, [
    searchTerm, 
    searchField, 
    dateRange, 
    amountRange, 
    profitRange, 
    selectedItem, 
    selectedCustomer, 
    invoices, 
    viewMode
  ]);

  // Apply all filters to the invoices
  const applyFilters = () => {
    if (!Array.isArray(invoices)) return;
    
    let result = [...invoices];
    
    // Apply date range filter
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59); // Set to end of day
      
      result = result.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        return invoiceDate >= fromDate && invoiceDate <= toDate;
      });
    }
    
    // Apply amount range filter
    if (amountRange.min !== '') {
      result = result.filter(invoice => 
        invoice.totalSales >= parseFloat(amountRange.min)
      );
    }
    
    if (amountRange.max !== '') {
      result = result.filter(invoice => 
        invoice.totalSales <= parseFloat(amountRange.max)
      );
    }
    
    // Apply profit range filter
    if (profitRange.min !== '') {
      result = result.filter(invoice => 
        invoice.totalProfit >= parseFloat(profitRange.min)
      );
    }
    
    if (profitRange.max !== '') {
      result = result.filter(invoice => 
        invoice.totalProfit <= parseFloat(profitRange.max)
      );
    }
    
    // Apply customer filter
    if (selectedCustomer) {
      result = result.filter(invoice => 
        invoice.receiverDetails?.name === selectedCustomer
      );
    }
    
    // Apply item filter
    if (selectedItem) {
      result = result.filter(invoice => {
        if (!invoice.items || !Array.isArray(invoice.items)) return false;
        return invoice.items.some(item => item.itemName === selectedItem);
      });
    }
    
    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      
      result = result.filter(invoice => {
        if (searchField === 'all') {
          return (
            (invoice.invoiceNumber && invoice.invoiceNumber.toLowerCase().includes(term)) ||
            (invoice.receiverDetails?.name && invoice.receiverDetails.name.toLowerCase().includes(term)) ||
            (invoice.receiverDetails?.phoneNumber && invoice.receiverDetails.phoneNumber.toLowerCase().includes(term)) ||
            (invoice.items && Array.isArray(invoice.items) && invoice.items.some(item => 
              item.itemName && item.itemName.toLowerCase().includes(term)))
          );
        } else if (searchField === 'invoiceNumber') {
          return invoice.invoiceNumber && invoice.invoiceNumber.toLowerCase().includes(term);
        } else if (searchField === 'customerName') {
          return invoice.receiverDetails?.name && invoice.receiverDetails.name.toLowerCase().includes(term);
        } else if (searchField === 'itemName') {
          return invoice.items && Array.isArray(invoice.items) && invoice.items.some(item => 
            item.itemName && item.itemName.toLowerCase().includes(term));
        }
        return false;
      });
    }
    
    setFilteredInvoices(result);
    calculateReportSummary(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSearchField('all');
    setDateRange({ from: '', to: '' });
    setAmountRange({ min: '', max: '' });
    setProfitRange({ min: '', max: '' });
    setSelectedItem('');
    setSelectedCustomer('');
    setFilteredInvoices(invoices);
    calculateReportSummary(invoices);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredInvoices) 
    ? filteredInvoices.slice(indexOfFirstItem, indexOfLastItem) 
    : [];
  const totalPages = Math.ceil(
    (Array.isArray(filteredInvoices) ? filteredInvoices.length : 0) / itemsPerPage
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

  // View invoice details
  const viewInvoiceDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedInvoice(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Get item-wise profit data
  const getItemProfitData = () => {
    const itemProfitMap = {};
    
    filteredInvoices.forEach(invoice => {
      if (invoice.items && Array.isArray(invoice.items)) {
        invoice.items.forEach(item => {
          if (!item.itemName) return;
          
          if (!itemProfitMap[item.itemName]) {
            itemProfitMap[item.itemName] = {
              totalQuantity: 0,
              totalCost: 0,
              totalSales: 0,
              totalProfit: 0,
              invoiceCount: 0,
              lastSoldDate: null
            };
          }
          
          const quantity = Number(item.quantity) || 0;
          
          itemProfitMap[item.itemName].totalQuantity += quantity;
          itemProfitMap[item.itemName].totalCost += item.cost || 0;
          itemProfitMap[item.itemName].totalSales += item.sales || 0;
          itemProfitMap[item.itemName].totalProfit += item.profit || 0;
          itemProfitMap[item.itemName].invoiceCount += 1;
          
          // Track last sold date
          const invoiceDate = new Date(invoice.date);
          if (!itemProfitMap[item.itemName].lastSoldDate || 
              invoiceDate > new Date(itemProfitMap[item.itemName].lastSoldDate)) {
            itemProfitMap[item.itemName].lastSoldDate = invoice.date;
          }
        });
      }
    });
    
    return Object.entries(itemProfitMap).map(([itemName, data]) => ({
      name: itemName,
      quantity: data.totalQuantity,
      cost: data.totalCost,
      sales: data.totalSales,
      profit: data.totalProfit,
      profitMargin: data.totalCost > 0 ? (data.totalProfit / data.totalCost) * 100 : 0,
      invoiceCount: data.invoiceCount,
      lastSoldDate: data.lastSoldDate
    })).sort((a, b) => b.profit - a.profit); // Sort by profit (highest first)
  };

  // Generate PDF report
  const generatePDF = () => {
    setIsGeneratingPdf(true);
    
    try {
      const doc = new jsPDF('landscape');
      
      // Add title
      doc.setFontSize(18);
      doc.text('Profit Report', 14, 22);
      
      // Add report metadata
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      
      if (dateRange.from && dateRange.to) {
        doc.text(`Date Range: ${formatDate(dateRange.from)} to ${formatDate(dateRange.to)}`, 14, 35);
      }
      
      if (selectedCustomer) {
        doc.text(`Customer: ${selectedCustomer}`, 14, 40);
      }
      
      if (selectedItem) {
        doc.text(`Item: ${selectedItem}`, 14, 45);
      }
      
      // Add summary section
      doc.setFontSize(12);
      doc.text('Summary', 14, 55);
      
      doc.setFontSize(10);
      doc.text(`Total Invoices: ${reportSummary.totalInvoices}`, 14, 62);
      doc.text(`Total Sales: ${formatCurrency(reportSummary.totalSales)}`, 80, 62);
      doc.text(`Total Cost: ${formatCurrency(reportSummary.totalCost)}`, 150, 62);
      doc.text(`Total Profit: ${formatCurrency(reportSummary.totalProfit)}`, 210, 62);
      doc.text(`Profit Margin: ${reportSummary.profitMargin.toFixed(2)}%`, 270, 62);
      
      // Add table data
      const tableColumn = viewMode === 'invoices' 
        ? ["Invoice No.", "Date", "Customer", "Sales Amount", "Cost", "Profit", "Margin (%)"]
        : ["Item Name", "Quantity Sold", "Sales Amount", "Cost", "Profit", "Margin (%)", "Invoices"];
      
      let tableRows = [];
      
      if (viewMode === 'invoices') {
        // Invoice profit table
        tableRows = filteredInvoices.map(invoice => [
          invoice.invoiceNumber || 'N/A',
          formatDate(invoice.date),
          invoice.receiverDetails?.name || 'N/A',
          invoice.totalSales.toFixed(2),
          invoice.totalCost.toFixed(2),
          invoice.totalProfit.toFixed(2),
          invoice.profitMargin.toFixed(2)
        ]);
      } else {
        // Item profit table
        tableRows = getItemProfitData().map(item => [
          item.name,
          item.quantity.toString(),
          item.sales.toFixed(2),
          item.cost.toFixed(2),
          item.profit.toFixed(2),
          item.profitMargin.toFixed(2),
          item.invoiceCount.toString()
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
      doc.save('profit_report.pdf');
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
      
      if (viewMode === 'invoices') {
        // Invoice profit data
        sheetName = 'Invoice Profit';
        
        data = filteredInvoices.map(invoice => ({
          'Invoice Number': invoice.invoiceNumber || 'N/A',
          'Date': formatDate(invoice.date),
          'Customer': invoice.receiverDetails?.name || 'N/A',
          'Phone': invoice.receiverDetails?.phoneNumber || 'N/A',
          'Payment Type': invoice.paymentType || 'N/A',
          'Sales Amount': invoice.totalSales.toFixed(2),
          'Cost': invoice.totalCost.toFixed(2),
          'Profit': invoice.totalProfit.toFixed(2),
          'Profit Margin (%)': invoice.profitMargin.toFixed(2),
          'Items Count': invoice.items?.length || 0
        }));
      } else {
        // Item profit data
        sheetName = 'Item Profit';
        
        data = getItemProfitData().map(item => ({
          'Item Name': item.name,
          'Quantity Sold': item.quantity,
          'Sales Amount': item.sales.toFixed(2),
          'Cost': item.cost.toFixed(2),
          'Profit': item.profit.toFixed(2),
          'Profit Margin (%)': item.profitMargin.toFixed(2),
          'Invoices Count': item.invoiceCount,
          'Last Sold Date': formatDate(item.lastSoldDate)
        }));
      }
      
      // Create a worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      
      // Create a workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      
      // Generate Excel file
      XLSX.writeFile(wb, 'profit_report.xlsx');
      
      toast.success('Excel report generated successfully');
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Failed to generate Excel report');
    } finally {
      setIsGeneratingExcel(false);
    }
  };

  return (
    <div className="p-4">
      <Paper elevation={3} className="p-4 mb-4">
        <Box className="mb-4 flex justify-between items-center flex-wrap">
          <Typography variant="h5" component="h1" className="font-bold">
            Profit Report
          </Typography>
          
          <Box className="flex gap-2 flex-wrap">
            <Button
              variant={viewMode === 'invoices' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setViewMode('invoices')}
              size="small"
            >
              Invoice View
            </Button>
            <Button
              variant={viewMode === 'items' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setViewMode('items')}
              size="small"
            >
              Item View
            </Button>
          </Box>
        </Box>
        
        {/* Summary Cards */}
        <Grid container spacing={2} className="mb-4">
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={1} className="p-3 bg-blue-50">
              <Typography variant="subtitle2" color="primary">Total Invoices</Typography>
              <Typography variant="h6">{reportSummary.totalInvoices}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={1} className="p-3 bg-green-50">
              <Typography variant="subtitle2" color="success">Total Sales</Typography>
              <Typography variant="h6">{formatCurrency(reportSummary.totalSales)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={1} className="p-3 bg-amber-50">
              <Typography variant="subtitle2" style={{ color: '#ff8f00' }}>Total Cost</Typography>
              <Typography variant="h6">{formatCurrency(reportSummary.totalCost)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={1} className="p-3 bg-purple-50">
              <Typography variant="subtitle2" style={{ color: '#7e57c2' }}>Total Profit</Typography>
              <Typography variant="h6">{formatCurrency(reportSummary.totalProfit)}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={1} className="p-3 bg-teal-50">
              <Typography variant="subtitle2" style={{ color: '#00897b' }}>Profit Margin</Typography>
              <Typography variant="h6">{reportSummary.profitMargin.toFixed(2)}%</Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Search and Filter Section */}
        <Box className="mb-4">
          <Grid container spacing={2} className="mb-3">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={`Search ${viewMode === 'invoices' ? 'invoices' : 'items'}...`}
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
            </Grid>
            
            <Grid item xs={12} sm={4} md={2}>
              <FormControl variant="outlined" size="small" fullWidth>
                <InputLabel>Search In</InputLabel>
                <Select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  label="Search In"
                >
                  <MenuItem value="all">All Fields</MenuItem>
                  <MenuItem value="invoiceNumber">Invoice Number</MenuItem>
                  <MenuItem value="customerName">Customer Name</MenuItem>
                  <MenuItem value="itemName">Item Name</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} sm={4} md={2}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowFilters(!showFilters)}
                startIcon={<FilterIcon />}
                size="small"
                fullWidth
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </Grid>
            
            <Grid item xs={6} sm={4} md={2}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={resetFilters}
                startIcon={<RefreshIcon />}
                size="small"
                fullWidth
              >
                Reset
              </Button>
            </Grid>
          </Grid>
          
          {showFilters && (
            <Paper elevation={0} className="p-3 bg-gray-50 mb-3">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
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
                <Grid item xs={12} sm={6} md={3}>
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
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Customer</InputLabel>
                    <Select
                      value={selectedCustomer}
                      onChange={(e) => setSelectedCustomer(e.target.value)}
                      label="Customer"
                    >
                      <MenuItem value="">All Customers</MenuItem>
                      {customers.map((customer, index) => (
                        <MenuItem key={index} value={customer.name}>
                          {customer.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
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
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Min Amount"
                    type="number"
                    value={amountRange.min}
                    onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Max Amount"
                    type="number"
                    value={amountRange.max}
                    onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Min Profit"
                    type="number"
                    value={profitRange.min}
                    onChange={(e) => setProfitRange({ ...profitRange, min: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Max Profit"
                    type="number"
                    value={profitRange.max}
                    onChange={(e) => setProfitRange({ ...profitRange, max: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Paper>
          )}
          
          {/* Export Buttons */}
          <Box className="flex gap-2 mt-4 mb-2">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PdfIcon />}
              onClick={generatePDF}
              disabled={isGeneratingPdf || loading || filteredInvoices.length === 0}
              size="small"
            >
              {isGeneratingPdf ? (
                <>
                  <CircularProgress size={16} className="mr-2" />
                  Generating PDF...
                </>
              ) : (
                'Export PDF'
              )}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ExcelIcon />}
              onClick={generateExcel}
              disabled={isGeneratingExcel || loading || filteredInvoices.length === 0}
              size="small"
            >
              {isGeneratingExcel ? (
                <>
                  <CircularProgress size={16} className="mr-2" />
                  Generating Excel...
                </>
              ) : (
                'Export Excel'
              )}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<RefreshIcon />}
              onClick={getAllInvoices}
              disabled={loading}
              size="small"
            >
              {loading ? (
                <>
                  <CircularProgress size={16} className="mr-2" />
                  Refreshing...
                </>
              ) : (
                'Refresh Data'
              )}
            </Button>
          </Box>
        </Box>
        
        {/* Data Table */}
        {loading ? (
          <Box className="flex justify-center items-center p-8">
            <CircularProgress />
            <Typography variant="body1" className="ml-3">
              Loading profit data...
            </Typography>
          </Box>
        ) : filteredInvoices.length === 0 ? (
          <Box className="p-8 text-center">
            <Typography variant="body1" color="textSecondary">
              No data found. Try adjusting your filters or refreshing the data.
            </Typography>
          </Box>
        ) : (
          <>
            {viewMode === 'invoices' ? (
              <TableContainer component={Paper} className="mt-4">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Invoice No.</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Sales Amount</TableCell>
                      <TableCell align="right">Cost</TableCell>
                      <TableCell align="right">Profit</TableCell>
                      <TableCell align="right">Margin (%)</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((invoice, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{invoice.invoiceNumber || 'N/A'}</TableCell>
                        <TableCell>{formatDate(invoice.date)}</TableCell>
                        <TableCell>{invoice.receiverDetails?.name || 'N/A'}</TableCell>
                        <TableCell align="right">{formatCurrency(invoice.totalSales)}</TableCell>
                        <TableCell align="right">{formatCurrency(invoice.totalCost)}</TableCell>
                        <TableCell align="right">
                          <Box className="flex items-center justify-end">
                            {invoice.totalProfit > 0 ? (
                              <TrendingUpIcon fontSize="small" color="success" className="mr-1" />
                            ) : invoice.totalProfit < 0 ? (
                              <TrendingDownIcon fontSize="small" color="error" className="mr-1" />
                            ) : null}
                            {formatCurrency(invoice.totalProfit)}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${invoice.profitMargin.toFixed(2)}%`}
                            size="small"
                            color={invoice.profitMargin > 20 ? 'success' : invoice.profitMargin > 0 ? 'primary' : 'error'}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => viewInvoiceDetails(invoice)}
                          >
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer component={Paper} className="mt-4">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Name</TableCell>
                      <TableCell align="right">Quantity Sold</TableCell>
                      <TableCell align="right">Sales Amount</TableCell>
                      <TableCell align="right">Cost</TableCell>
                      <TableCell align="right">Profit</TableCell>
                      <TableCell align="right">Margin (%)</TableCell>
                      <TableCell align="center">Invoices</TableCell>
                      <TableCell>Last Sold</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getItemProfitData().slice(indexOfFirstItem, indexOfLastItem).map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.sales)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.cost)}</TableCell>
                        <TableCell align="right">
                          <Box className="flex items-center justify-end">
                            {item.profit > 0 ? (
                              <TrendingUpIcon fontSize="small" color="success" className="mr-1" />
                            ) : item.profit < 0 ? (
                              <TrendingDownIcon fontSize="small" color="error" className="mr-1" />
                            ) : null}
                            {formatCurrency(item.profit)}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${item.profitMargin.toFixed(2)}%`}
                            size="small"
                            color={item.profitMargin > 20 ? 'success' : item.profitMargin > 0 ? 'primary' : 'error'}
                          />
                        </TableCell>
                        <TableCell align="center">{item.invoiceCount}</TableCell>
                        <TableCell>{formatDate(item.lastSoldDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            {/* Pagination */}
            <Box className="flex justify-between items-center mt-4 flex-wrap">
              <Box className="flex items-center">
                <Typography variant="body2" className="mr-2">
                  Rows per page:
                </Typography>
                <FormControl variant="outlined" size="small">
                  <Select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="body2" className="ml-4">
                  Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredInvoices.length)} of {filteredInvoices.length} records
                </Typography>
              </Box>
              
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="small"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        )}
      </Paper>
      
      {/* Invoice Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex justify-between items-center">
            <Typography variant="h6">
              Invoice Details
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedInvoice && (
            <>
              <Grid container spacing={2} className="mb-4">
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Invoice Number
                  </Typography>
                  <Typography variant="body1">
                    {selectedInvoice.invoiceNumber || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedInvoice.date)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Customer
                  </Typography>
                  <Typography variant="body1">
                    {selectedInvoice.receiverDetails?.name || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {selectedInvoice.receiverDetails?.phoneNumber || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Payment Type
                  </Typography>
                  <Typography variant="body1">
                    {selectedInvoice.paymentType || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Amount
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(selectedInvoice.totalSales)}
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider className="my-3" />
              
              <Typography variant="subtitle1" className="mb-2">
                Profit Summary
              </Typography>
              
              <Grid container spacing={2} className="mb-4">
                <Grid item xs={12} sm={4}>
                  <Paper elevation={1} className="p-3 bg-green-50">
                    <Typography variant="subtitle2" color="success">Sales</Typography>
                    <Typography variant="h6">{formatCurrency(selectedInvoice.totalSales)}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={1} className="p-3 bg-amber-50">
                    <Typography variant="subtitle2" style={{ color: '#ff8f00' }}>Cost</Typography>
                    <Typography variant="h6">{formatCurrency(selectedInvoice.totalCost)}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={1} className="p-3 bg-purple-50">
                    <Typography variant="subtitle2" style={{ color: '#7e57c2' }}>Profit</Typography>
                    <Typography variant="h6">
                      {formatCurrency(selectedInvoice.totalProfit)} 
                      <span className="text-sm ml-1">
                        ({selectedInvoice.profitMargin.toFixed(2)}%)
                      </span>
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              <Divider className="my-3" />
              
              <Typography variant="subtitle1" className="mb-2">
                Items ({selectedInvoice.items?.length || 0})
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Selling Price</TableCell>
                      <TableCell align="right">Cost</TableCell>
                      <TableCell align="right">Sales</TableCell>
                      <TableCell align="right">Profit</TableCell>
                      <TableCell align="right">Margin (%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedInvoice.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.sellingPrice)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.cost)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.sales)}</TableCell>
                        <TableCell align="right">
                          <Box className="flex items-center justify-end">
                            {item.profit > 0 ? (
                              <TrendingUpIcon fontSize="small" color="success" className="mr-1" />
                            ) : item.profit < 0 ? (
                              <TrendingDownIcon fontSize="small" color="error" className="mr-1" />
                            ) : null}
                            {formatCurrency(item.profit)}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${item.profitMargin.toFixed(2)}%`}
                            size="small"
                            color={item.profitMargin > 20 ? 'success' : item.profitMargin > 0 ? 'primary' : 'error'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SnigdhaProfitPage;