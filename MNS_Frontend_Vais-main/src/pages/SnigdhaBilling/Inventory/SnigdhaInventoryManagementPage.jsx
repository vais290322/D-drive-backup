import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Tabs, 
  Tab, 
  TextField, 
  Box, 
  Paper, 
  Grid, 
  IconButton, 
  Divider, 
  Tooltip, 
  CircularProgress,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Avatar
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import {
  Add as AddIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  LocalShipping as ShippingIcon,
  Store as StoreIcon,
  SellRounded
} from "@mui/icons-material";
import { InfoIcon, ShieldCloseIcon } from "lucide-react";

const fetchInventoryUrl = import.meta.env.VITE_REACT_FETCH_ITEMS_SIN;
// const holdingInventoryUrl = import.meta.env.VITE_REACT_HOLDING_INVENTORY_SIN;
// const addOneInventoryCurrentItemUrl = import.meta.env.VITE_REACT_ADD_ONE_INVENTORY_CURRENT_ITEM_SIN;
// const addInventoryCurrentItemsUrl = import.meta.env.VITE_REACT_ADD_INVENTORY_CURRENT_ITEMS_SIN;
// const sellItemUrl = import.meta.env.VITE_REACT_SELL_ITEM_SIN;

const SnigdhaInventoryManagementPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [currentInventory, setCurrentInventory] = useState([]);
  const [holdingInventory, setHoldingInventory] = useState([]);
  const [sellItemId, setSellItemId] = useState("");
  const [sellQuantity, setSellQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [addItemId, setAddItemId] = useState("");
  
  // New state for product view dialog
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // console.log("selected item : ",selectedItem);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchCurrentInventory();
    fetchHoldingInventory();
  }, []);

  const fetchCurrentInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(fetchInventoryUrl);
      setCurrentInventory(response?.data?.data);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching current inventory:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHoldingInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(holdingInventoryUrl);
      setHoldingInventory(response?.data?.data);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        console.error("Error fetching holding inventory:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const addOneItem = async () => {
    if (!addItemId) {
      toast.error("Please enter an Item ID to add");
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post(`${addOneInventoryCurrentItemUrl}/${addItemId}`);
      fetchCurrentInventory();
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setAddItemId("");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        console.error("Request failed:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const addInventoryCurrentItems = async () => {
    try {
      setLoading(true);
      const response = await axios.post(addInventoryCurrentItemsUrl);
      fetchCurrentInventory();
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        console.error("Error adding inventory current items:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const sellItem = async () => {
    if (!sellItemId || !sellQuantity) {
      toast.error("Please enter item ID and quantity to sell.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.delete(`${sellItemUrl}/${sellItemId}/${sellQuantity}`);
      fetchCurrentInventory();
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        setSellItemId("");
        setSellQuantity("");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        console.error("Error selling item:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Functions for viewing product details
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedItem(null);
  };

  // Updated columns including the View action

  const currentColumns = [
    { 
      field: "item_name", 
      headerName: "Item Name", 
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          width: '100%',
          py: 1
        }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.light',
              width: 32,
              height: 32,
              fontSize: '0.875rem'
            }}
          >
            {params.value?.charAt(0) || 'I'}
          </Avatar>
          <Typography variant="body2" fontWeight="medium">
            {params.value || 'N/A'}
          </Typography>
        </Box>
      )
    },
    { 
      field: "item_id", 
      headerName: "Item ID", 
      flex: 0.8,
      minWidth: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value || 'N/A'} 
          size="small" 
          color="primary" 
          variant="outlined"
          sx={{ fontWeight: 'medium' }}
        />
      )
    },
    { 
      field: "unit_prize", 
      headerName: "Unit Price", 
      flex: 0.7, 
      type: "number",
      minWidth: 110,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          ₹ {params.value?.toLocaleString() || '0'}
        </Typography>
      )
    },
    { 
      field: "sellingPrice", 
      headerName: "Selling Price", 
      flex: 0.7, 
      type: "number",
      minWidth: 120,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          fontWeight="medium"
          color="success.main"
        >
          ₹ {params.value?.toLocaleString() || '0'}
        </Typography>
      )
    },
    { 
      field: "quantity", 
      headerName: "Quantity", 
      flex: 0.5, 
      type: "number",
      minWidth: 100,
      renderCell: (params) => (
        <Chip 
          label={`${params.value || '0'} units`} 
          size="small" 
          color={params.value > 10 ? "success" : params.value > 5 ? "warning" : "error"}
          sx={{ fontWeight: 'medium' }}
        />
      )
    },
    { 
      field: "total_prize", 
      headerName: "Total Value", 
      flex: 0.8, 
      type: "number",
      minWidth: 120,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          fontWeight="bold" 
          color="success.dark"
          sx={{ 
            bgcolor: 'success.lighter', 
            px: 1.5, 
            py: 0.5, 
            borderRadius: 1,
            display: 'inline-block'
          }}
        >
          ₹ {params.value?.toLocaleString() || '0'}
        </Typography>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex',  }}>
          <Button
            variant="contained"
            color="info"
            size="small"
            onClick={() => handleViewDetails(params.row)}
            startIcon={<InfoIcon size={16} />}
            sx={{ 
              textTransform: 'none',
              boxShadow: 1,
              '&:hover': {
                boxShadow: 2
              }
            }}
          >
            View
          </Button>
          
        </Box>
      )
    },
  ];


  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Card sx={{ 
        maxWidth: '1200px', 
        mx: 'auto', 
        borderRadius: 2, 
        boxShadow: 3,
        overflow: 'hidden',
      }}>
        <Box sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon />
            <Typography variant="h5" fontWeight="bold">
              Snigdha's Inventory Management 
            </Typography>
          </Box>
          <Tooltip title="Refresh Data">
            <IconButton color="inherit" onClick={() => {
              fetchCurrentInventory();
              fetchHoldingInventory();
            }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant={isMobile ? "fullWidth" : "standard"}
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            bgcolor: 'background.paper',
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }
          }}
        >
          <Tab 
            icon={<StoreIcon />} 
            label={isMobile ? "" : "Current Inventory"} 
            iconPosition={isMobile ? "top" : "start"}
          />
          {/* <Tab 
            icon={<ShippingIcon />} 
            label={isMobile ? "" : "Holding Inventory"} 
            iconPosition={isMobile ? "top" : "start"}
          />
          <Tab 
            icon={<AddIcon />} 
            label={isMobile ? "" : "Add Inventory"} 
            iconPosition={isMobile ? "top" : "start"}
          /> */}
        </Tabs>

        <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        {tabValue === 0 && (
            <>
              <Paper 
                sx={{ 
                  height: 500, 
                  width: '100%', 
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 3,
                  boxShadow: 3,
                  '& .MuiDataGrid-root': {
                    border: 'none',
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    py: 1,
                  },
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'primary.main',
                    color: 'black',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    py: 1.5,
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    backgroundColor: 'background.paper',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '1px solid rgba(224, 224, 224, 1)',
                    backgroundColor: 'background.paper',
                  },
                  '& .MuiDataGrid-row': {
                    '&:nth-of-type(even)': {
                      backgroundColor: 'action.hover',
                    },
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'primary.lighter',
                  },
                  '& .MuiDataGrid-toolbarContainer': {
                    padding: '8px 16px',
                    backgroundColor: 'grey.50',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  },
                  '& .MuiButton-root': {
                    textTransform: 'none',
                  },
                }}
              >
               
                <DataGrid
                  rows={currentInventory}
                  columns={currentColumns}
                  pageSize={7}
                  rowsPerPageOptions={[7, 15, 25]}
                  getRowId={(row) => row._id}
                  components={{
                    Toolbar: GridToolbar,
                  }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                      sx: {
                        '& .MuiButton-root': {
                          color: 'primary.main',
                        },
                      }
                    },
                  }}
                  loading={loading}
                  disableSelectionOnClick
                  sx={{
                    '& .MuiDataGrid-row': {
                      cursor: 'pointer',
                    },
                  }}
                  onRowClick={(params) => handleViewDetails(params.row)}
                />
              </Paper>
            </>
          )}


{tabValue === 1 && (
            <>
              <Paper 
                sx={{ 
                  height: 500, 
                  width: '100%', 
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 3,
                  '& .MuiDataGrid-root': {
                    border: 'none',
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    py: 1,
                  },
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'info.main',
                    color: 'black',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    py: 1.5,
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    backgroundColor: 'background.paper',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '1px solid rgba(224, 224, 224, 1)',
                    backgroundColor: 'background.paper',
                  },
                  '& .MuiDataGrid-row': {
                    '&:nth-of-type(even)': {
                      backgroundColor: 'action.hover',
                    },
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'info.lighter',
                  },
                  '& .MuiDataGrid-toolbarContainer': {
                    padding: '8px 16px',
                    backgroundColor: 'grey.50',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  },
                  '& .MuiButton-root': {
                    textTransform: 'none',
                  },
                }}
              >
               
                <DataGrid
                  rows={holdingInventory}
                  columns={currentColumns}
                  pageSize={7}
                  rowsPerPageOptions={[7, 15, 25]}
                  getRowId={(row) => row._id}
                  components={{
                    Toolbar: GridToolbar,
                  }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                      sx: {
                        '& .MuiButton-root': {
                          color: 'info.main',
                        },
                      }
                    },
                  }}
                  loading={loading}
                  disableSelectionOnClick
                  sx={{
                    '& .MuiDataGrid-row': {
                      cursor: 'pointer',
                    },
                  }}
                  onRowClick={(params) => handleViewDetails(params.row)}
                />
              </Paper>
            </>
          )}

        

          {tabValue === 2 && (
            <Box sx={{ py: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2, 
                      height: '100%',
                      boxShadow: 2,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AddIcon /> Add Single Item
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Box sx={{ mb: 3 }}>
                      <TextField
                        label="Item ID"
                        variant="outlined"
                        fullWidth
                        value={addItemId}
                        onChange={(e) => setAddItemId(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                      
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        onClick={addOneItem}
                        disabled={loading}
                        startIcon={<AddIcon />}
                        sx={{ 
                          height: '56px',
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Add Item to Inventory"}
                      </Button>
                    </Box>
                    
                    <Box sx={{ 
                      bgcolor: 'info.lighter', 
                      p: 2, 
                      borderRadius: 2,
                      border: '1px dashed',
                      borderColor: 'info.main'
                    }}>
                      <Typography variant="body2" color="info.dark">
                        Enter the Item ID of an existing item in the holding inventory to add it to the current inventory.
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2, 
                      height: '100%',
                      boxShadow: 2,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InventoryIcon /> Add All Items
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: 'calc(100% - 60px)'
                    }}>
                      <Box sx={{ 
                        bgcolor: 'warning.lighter', 
                        p: 2, 
                        borderRadius: 2,
                        border: '1px dashed',
                        borderColor: 'warning.main',
                        mb: 3
                      }}>
                        <Typography variant="body2" color="warning.dark">
                          This action will add all items from the holding inventory to the current inventory. Use with caution.
                        </Typography>
                      </Box>
                      
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        fullWidth
                        onClick={addInventoryCurrentItems}
                        disabled={loading}
                        startIcon={<InventoryIcon />}
                        sx={{ 
                          height: '56px',
                          background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)',
                          boxShadow: '0 3px 5px 2px rgba(255, 152, 0, .3)',
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Add All Items to Inventory"}
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      mt: 2,
                      bgcolor: 'success.lighter',
                      border: '1px solid',
                      borderColor: 'success.light'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        bgcolor: 'success.main', 
                        color: 'white', 
                        p: 1, 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <InfoIcon />
                      </Box>
                      <Box>
                        <Typography variant="h6" color="success.dark" gutterBottom>
                          Inventory Management Tips
                        </Typography>
                        <Typography variant="body2" color="success.dark">
                          • Use the "Add Single Item" option to add specific items from holding inventory<br />
                          • The "Add All Items" option will transfer all items from holding to current inventory<br />
                          • You can view all current inventory items in the "Current Inventory" tab<br />
                          • To sell an item, go to the "Current Inventory" tab and use the sell form
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
        
        <Box sx={{ 
          bgcolor: 'grey.100', 
          p: 2, 
          borderTop: '1px solid', 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Typography variant="body2" color="text.secondary">
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                Processing...
              </Box>
            ) : (
              `Total Current Items: ${currentInventory.length} | Total Holding Items: ${holdingInventory.length}`
            )}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              size="small" 
              startIcon={<RefreshIcon />}
              onClick={() => {
                fetchCurrentInventory();
                fetchHoldingInventory();
              }}
              disabled={loading}
            >
              Refresh Data
            </Button>
          </Box>
        </Box>
      </Card>

    
      {/* Dialog for viewing product details */}
      <Dialog 
        open={detailsOpen} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InventoryIcon />
            <Typography variant="h6">
              {selectedItem?.item_name || 'Product Details'}
            </Typography>
          </Box>
          <IconButton 
            onClick={handleCloseDetails} 
            size="small" 
            sx={{ color: 'white' }}
          >
            <ShieldCloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          {selectedItem && (
            <Grid container spacing={3}>
              {/* Product Basic Info */}
              <Grid item xs={12}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    borderRadius: 2,
                    borderColor: 'primary.light'
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold" 
                    color="primary" 
                    gutterBottom
                    sx={{ 
                      borderBottom: '1px solid', 
                      borderColor: 'divider',
                      pb: 1,
                      mb: 2
                    }}
                  >
                    Basic Information
                  </Typography>
                  
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell 
                            component="th" 
                            sx={{ 
                              fontWeight: 'bold', 
                              bgcolor: 'grey.50', 
                              width: '30%' 
                            }}
                          >
                            Item Name
                          </TableCell>
                          <TableCell>{selectedItem.item_name || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell 
                            component="th" 
                            sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}
                          >
                            Item ID
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={selectedItem.item_id || 'N/A'} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
              
              {/* Pricing Information */}
              <Grid item xs={12} md={6}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    borderRadius: 2,
                    borderColor: 'success.light',
                    bgcolor: 'success.lighter'
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold" 
                    color="success.dark" 
                    gutterBottom
                    sx={{ 
                      borderBottom: '1px solid', 
                      borderColor: 'success.light',
                      pb: 1,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <ShoppingCartIcon fontSize="small" /> Pricing Information
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Unit Price
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          ₹ {selectedItem.unit_prize?.toLocaleString() || '0'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Selling Price
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="success.main">
                          ₹ {selectedItem.sellingPrice?.toLocaleString() || '0'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Quantity
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {selectedItem.quantity || '0'} units
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Total Value
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="success.dark">
                          ₹ {selectedItem.total_prize?.toLocaleString() || '0'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Opening Stock
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {selectedItem.openingStock || "N/A"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              {/* Tax Information */}
              <Grid item xs={12} md={6}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    borderRadius: 2,
                    borderColor: 'info.light',
                    bgcolor: 'info.lighter'
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold" 
                    color="info.dark" 
                    gutterBottom
                    sx={{ 
                      borderBottom: '1px solid', 
                      borderColor: 'info.light',
                      pb: 1,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <InfoIcon fontSize="small" /> Tax Information
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          HSN Code
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedItem.hsnCode || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          GST(%)
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedItem.gst ? `${selectedItem.gst}%` : 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          UOM
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedItem.uom ? `${selectedItem.uom}` : 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Group
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {selectedItem.group ? `${selectedItem.group}` : 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              {/* Seller Information */}
              {selectedItem?.seller_details && (
                <Grid item xs={12}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      borderColor: 'warning.light',
                      bgcolor: 'warning.lighter'
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="bold" 
                      color="warning.dark" 
                      gutterBottom
                      sx={{ 
                        borderBottom: '1px solid', 
                        borderColor: 'warning.light',
                        pb: 1,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <StoreIcon fontSize="small" /> Seller Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: 'warning.main', 
                              color: 'white',
                              mr: 2
                            }}
                          >
                            {selectedItem.seller_details.seller_name?.charAt(0) || 'S'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Seller Name
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {selectedItem.seller_details.seller_name || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Contact
                          </Typography>
                          <Typography variant="body1">
                            {selectedItem.seller_details.ph_no || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Email
                          </Typography>
                          <Typography variant="body1">
                            {selectedItem.seller_details.email || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Address
                          </Typography>
                          <Typography variant="body1">
                            {selectedItem.seller_details.address || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              )}
              
              {/* Profit Analysis */}
              <Grid item xs={12}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    borderColor: 'success.main',
                    bgcolor: 'success.lighter'
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold" 
                    color="success.dark" 
                    gutterBottom
                    sx={{ 
                      pb: 1,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <SellRounded fontSize="small" /> Profit Analysis
                  </Typography>
                  
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'white', 
                    borderRadius: 1,
                    boxShadow: 1
                  }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Unit Cost
                          </Typography>
                          <Typography variant="h6">
                            ₹ {selectedItem.unit_prize?.toLocaleString() || '0'}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Selling Price
                          </Typography>
                          <Typography variant="h6">
                            ₹ {selectedItem.sellingPrice?.toLocaleString() || '0'}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Profit per Unit
                          </Typography>
                          <Typography 
                            variant="h6" 
                            color={(selectedItem.sellingPrice - selectedItem.unit_prize) > 0 ? 'success.main' : 'error.main'}
                            fontWeight="bold"
                          >
                            ₹ {((selectedItem.sellingPrice || 0) - (selectedItem.unit_prize || 0)).toLocaleString()}
                            {(selectedItem.sellingPrice - selectedItem.unit_prize) > 0 && (
                              <Typography 
                                component="span" 
                                variant="caption" 
                                sx={{ ml: 1 }}
                              >
                                ({Math.round(((selectedItem.sellingPrice - selectedItem.unit_prize) / selectedItem.unit_prize) * 100)}%)
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Button 
            onClick={handleCloseDetails} 
            variant="outlined" 
            startIcon={<ShieldCloseIcon />}
          >
            Close
          </Button>
          
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SnigdhaInventoryManagementPage;
