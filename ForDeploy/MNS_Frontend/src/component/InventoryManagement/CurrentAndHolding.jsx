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
  InputAdornment
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
import { InfoIcon } from "lucide-react";

const fetchInventoryUrl=import.meta.env.VITE_REACT_FETCH_INVENTORY
const holdingInventoryUrl=import.meta.env.VITE_REACT_HOLDING_INVENTORY
const addOneInventoryCurrentItemUrl =import.meta.env.VITE_REACT_ADD_ONE_INVENTORY_CURRENT_ITEM
const addInventoryCurrentItemsUrl=import.meta.env.VITE_REACT_ADD_INVENTORY_CURRENT_ITEMS
const sellItemUrl=import.meta.env.VITE_REACT_SELL_ITEM


export default function CurrentAndHolding() {
  const [tabValue, setTabValue] = useState(0);
  const [currentInventory,setCurrentInventory]=useState([])
  const [holdingInventory,setHoldingInventory]=useState([])
  const [sellItemId,setSellItemId]=useState("");
  const [sellQuantity,setSellQuantity]=useState("");
  const [loading, setLoading] = useState(false);
  const [addItemId, setAddItemId] = useState("");
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  // console.log("current inventory : ", currentInventory)


  useEffect(() => {
    fetchCurrentInventory();
    fetchHoldingInventory()
  }, []);

  const fetchCurrentInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        fetchInventoryUrl
      );
      setCurrentInventory(response?.data?.data);
      if(response?.data?.success){
        toast.success(response?.data?.message)
      }
    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message)
      }else{
        console.error("Error fetching current inventory:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHoldingInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        holdingInventoryUrl
      );
      setHoldingInventory(response?.data?.data);
      if(response?.data?.success){
        toast.success(response?.data?.message)
      }
    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message)
      }else{
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
      const response = await axios.post(
        `${addOneInventoryCurrentItemUrl}/${addItemId}`
      );
      fetchCurrentInventory();
      if(response?.data?.success){
        toast.success(response?.data?.message);
        setAddItemId("");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message)
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
      if(response?.data?.success){
        toast.success(response?.data?.message)
      }
    } catch (error) {
      if(error.response){
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
      const response = await axios.delete(
        `${sellItemUrl}/${sellItemId}/${sellQuantity}`
      );
      fetchCurrentInventory();
      if(response?.data?.success){
        toast.success(response?.data?.message);
        setSellItemId("");
        setSellQuantity("");
      }
    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message)
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

  const currentColumns = [
    { 
      field: "item_name", 
      headerName: "Item Name", 
      flex: 1,
      minWidth: 150,
     
    },
    { 
      field: "item_id", 
      headerName: "Item ID", 
      flex: 0.8,
      minWidth: 120,
    },
    { 
      field: "unit_prize", 
      headerName: "Unit Price", 
      flex: 0.8, 
      type: "number",
      minWidth: 100,
    },
    { 
      field: "sellingPrice", 
      headerName: "Selling Price", 
      flex: 0.8, 
      type: "number",
      minWidth: 100,
    },
    { 
      field: "quantity", 
      headerName: "Quantity", 
      flex: 0.6, 
      type: "number",
      minWidth: 90,
     
    },
    { 
      field: "total_prize", 
      headerName: "Total Price", 
      flex: 0.8, 
      type: "number",
      minWidth: 120,
      cellClassName: 'total-price-cell',
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
            MNS's Inventory Management
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
          <Tab 
            icon={<ShippingIcon />} 
            label={isMobile ? "" : "Holding Inventory"} 
            iconPosition={isMobile ? "top" : "start"}
          />
          <Tab 
            icon={<AddIcon />} 
            label={isMobile ? "" : "Add Inventory"} 
            iconPosition={isMobile ? "top" : "start"}
          />
        </Tabs>

        <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          {tabValue === 0 && (
            <>
              <Paper 
                sx={{ 
                  height: 450, 
                  width: '100%', 
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 3,
                  '& .MuiDataGrid-root': {
                    border: 'none',
                  },
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'primary.light',
                    color: '#000',
                    fontSize: '1rem',
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    backgroundColor: 'background.paper',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '1px solid rgba(224, 224, 224, 1)',
                    backgroundColor: 'background.paper',
                  },
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: 'action.hover',
                  },
                  '& .total-price-cell': {
                    fontWeight: 'bold',
                    color: 'success.main',
                  },
                  '& .MuiDataGrid-toolbarContainer': {
                    padding: '8px 16px',
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  },
                  '& .MuiButton-root': {
                    textTransform: 'none',
                  },
                }}
              >
                <DataGrid
                  rows={currentInventory}
                  columns={currentColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  getRowId={(row) => row._id}
                  components={{
                    Toolbar: GridToolbar,
                  }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                    },
                  }}
                  loading={loading}
                  disableSelectionOnClick
                />
              </Paper>

             
            </>
          )}

          {tabValue === 1 && (
            <Paper 
              sx={{ 
                height: 450, 
                width: '100%', 
                borderRadius: 2,
                overflow: 'hidden',
                '& .MuiDataGrid-root': {
                  border: 'none',
                },
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'info.light',
                  color: '#000',
                  fontSize: '1rem',
                },
                '& .MuiDataGrid-virtualScroller': {
                  backgroundColor: 'background.paper',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: '1px solid rgba(224, 224, 224, 1)',
                  backgroundColor: 'background.paper',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'action.hover',
                },
                '& .total-price-cell': {
                  fontWeight: 'bold',
                  color: 'success.main',
                },
                '& .MuiDataGrid-toolbarContainer': {
                  padding: '8px 16px',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                },
              }}
            >
              <DataGrid
                rows={holdingInventory}
                columns={currentColumns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                getRowId={(row) => row._id}
                components={{
                  Toolbar: GridToolbar,
                }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                loading={loading}
                disableSelectionOnClick
              />
            </Paper>
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
                        sx={{
                          mb: 2,
                        }}
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
    </Box>
  );
};