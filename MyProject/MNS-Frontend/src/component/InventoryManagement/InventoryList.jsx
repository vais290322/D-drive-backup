import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Box,
  Paper,
  Grid,
  IconButton,
  Divider,
  Tooltip,
  Tab,
  Tabs,
  InputAdornment,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { toast } from "react-hot-toast";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CalendarMonth as CalendarIcon,
  DateRange as DateRangeIcon,
} from "@mui/icons-material";

export default function InventoryList() {
  const [inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [searchDate, setSearchDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // console.log("inventory : ",inventory);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const inventoryUrl = import.meta.env.VITE_REACT_ALL_ITEMS;
  const searchByDateUrl = import.meta.env.VITE_REACT_SEARCH_DATE;
  const searchByTimePeriodUrl = import.meta.env.VITE_REACT_SEARCH_TIME_PERIOD;
  const updateInventoryUrl = import.meta.env.VITE_REACT_UPDATE_INVENTORY;
  const deleteInventoryUrl = import.meta.env.VITE_REACT_DELETE_INVENTORY;

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(inventoryUrl);
      setInventory(response?.data?.data || []);
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Failed to fetch inventory items");
    } finally {
      setLoading(false);
    }
  };

  const searchByDate = async () => {
    if (!searchDate) {
      toast.error("Please select a date");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${searchByDateUrl}/${searchDate}`);
      setInventory(response?.data?.data || []);
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error searching inventory by date:", error);
      toast.error("No items found for the selected date");
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const searchByTimePeriod = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `${searchByTimePeriodUrl}/${startDate}/${endDate}`
      );
      setInventory(response?.data?.data || []);
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error searching inventory by time period:", error);
      toast.error("No items found for the selected date range");
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setUpdatedData(item);
  };

  const calculateTotalPrice1 = (data) => {
    const { unit_prize = 0, quantity = 0, cgst = 0, sgst = 0, igst = 0 } = data;
    return (unit_prize * quantity);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({
      ...prev,
      [name]: name.includes("prize") || name.includes("quantity") || name.includes("gst")
        ? parseFloat(value) || 0
        : value,
      total_prize: calculateTotalPrice1({ ...prev, [name]: parseFloat(value) || 0 }),
    }));
  };

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
  
    setUpdatedData((prev) => {
      const keys = name.split("."); 
      let updatedObj = { ...prev };
  
      let temp = updatedObj;
      for (let i = 0; i < keys?.length - 1; i++) {
        temp[keys[i]] = temp[keys[i]] ? { ...temp[keys[i]] } : {}; 
        temp = temp[keys[i]];
      }
      temp[keys[keys?.length - 1]] = value; 
  
      return updatedObj;
    });
  };

  const handleTaxOptionChange1 = (e) => {
    const selectedTax = e.target.value;
    setUpdatedData((prev) => ({
      ...prev,
      taxOption: selectedTax,
      igst: selectedTax === "igst" ? prev.igst : 0,
      sgst: selectedTax === "sgst" ? prev.sgst : 0,
    }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${updateInventoryUrl}/${selectedItem._id}`,
        updatedData
      );
      
      fetchInventory();
      setSelectedItem(null);
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error updating inventory item:", error);
      toast.error("Failed to update inventory item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        setLoading(true);
        const response = await axios.delete(`${deleteInventoryUrl}/${id}`);
        fetchInventory();
        if (response.data.success) {
          toast.success(response.data.message);
        }
      } catch (error) {
        console.error("Error deleting inventory item:", error);
        toast.error("Failed to delete inventory item");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const columns = [
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
      
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Tooltip title="Edit Item">
            <IconButton 
              color="primary" 
              size="small" 
              onClick={() => handleEdit(params.row)}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(25, 118, 210, 0.08)' 
                } 
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Item">
            <IconButton 
              color="error" 
              size="small" 
              onClick={() => handleDelete(params.row._id)}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(211, 47, 47, 0.08)' 
                } 
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
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
        <Typography variant="h5" fontWeight="bold">
        MNS's Inventory Item Lists 
        </Typography>
        <Tooltip title="Refresh Inventory">
          <IconButton color="inherit" onClick={fetchInventory}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <CardContent sx={{ p: 3 }}>
        <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<CalendarIcon />} label={isMobile ? "" : "Single Date"} iconPosition="start" />
            <Tab icon={<DateRangeIcon />} label={isMobile ? "" : "Date Range"} iconPosition="start" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {tabValue === 0 ? (
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <TextField
                    label="Search by Date"
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button 
                    onClick={searchByDate} 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    startIcon={<SearchIcon />}
                    disabled={loading}
                    sx={{ height: '56px' }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Search"}
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    onClick={searchByTimePeriod} 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    startIcon={<SearchIcon />}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Search by Date Range"}
                  </Button>
                </Grid>
              </Grid>
            )}
          </Box>
        </Paper>
        
        <Paper 
          sx={{ 
            height: 500, 
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
              backgroundColor: '#1976d2', // or theme.palette.primary.main
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
          }}
        >
          <DataGrid 
            rows={inventory} 
            columns={columns} 
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
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
            sx={{ height: '100%' }}
          />
        </Paper>

      </CardContent>

      {/* Edit Dialog */}
      <Dialog 
        open={Boolean(selectedItem)} 
        onClose={() => setSelectedItem(null)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 24,
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <EditIcon /> Edit Inventory Item
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {selectedItem && (
            <Grid container spacing={3}>
              {/* Item Details */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                  Item Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="item_name"
                      label="Item Name"
                      value={updatedData.item_name || ""}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="item_id"
                      label="Item ID"
                      value={updatedData.item_id || ""}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="unit_prize"
                      label="Unit Price"
                      type="number"
                      value={updatedData.unit_prize || ""}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="sellingPrice"
                      label="Selling Price"
                      type="number"
                      value={updatedData.sellingPrice || ""}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="quantity"
                      label="Quantity"
                      type="number"
                      value={updatedData.quantity || ""}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="hsnCode"
                      label="HSN Code"
                      value={updatedData.hsnCode || ""}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Tax Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                  Tax Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="cgst"
                      label="CGST"
                      type="number"
                      value={updatedData.cgst || ""}
                      onChange={handleInputChange}
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Select Tax Type</FormLabel>
                      <RadioGroup
                        row
                        value={updatedData.taxOption || "igst"}
                        onChange={handleTaxOptionChange1}
                      >
                        <FormControlLabel value="igst" control={<Radio />} label="IGST" />
                        <FormControlLabel value="sgst" control={<Radio />} label="SGST" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="igst"
                      label="IGST"
                      type="number"
                      value={updatedData.igst || ""}
                      onChange={handleInputChange}
                      fullWidth
                      disabled={updatedData.taxOption !== "igst"}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="sgst"
                      label="SGST"
                      type="number"
                      value={updatedData.sgst || ""}
                      onChange={handleInputChange}
                      fullWidth
                      disabled={updatedData.taxOption !== "sgst"}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="total_prize"
                      label="Total Price"
                      type="number"
                      value={updatedData.total_prize || ""}
                      fullWidth
                      disabled
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontWeight: 'bold',
                          color: 'success.main',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Seller Details */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                  Seller Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="seller_details.seller_name"
                      label="Seller Name"
                      value={updatedData.seller_details?.seller_name || ""}
                      onChange={handleInputChange2}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="seller_details.ph_no"
                      label="Phone Number"
                      value={updatedData.seller_details?.ph_no || ""}
                      onChange={handleInputChange2}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="seller_details.email"
                      label="Email"
                      value={updatedData.seller_details?.email || ""}
                      onChange={handleInputChange2}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="seller_details.address"
                      label="Address"
                      value={updatedData.seller_details?.address || ""}
                      onChange={handleInputChange2}
                      fullWidth
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Buyer Details */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                  Buyer Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="buyier_details.buyer_name"
                      label="Buyer Name"
                      value={updatedData.buyier_details?.buyer_name || ""}
                      onChange={handleInputChange2}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="buyier_details.ph_no"
                      label="Phone Number"
                      value={updatedData.buyier_details?.ph_no || ""}
                      onChange={handleInputChange2}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="buyier_details.email"
                      label="Email"
                      value={updatedData.buyier_details?.email || ""}
                      onChange={handleInputChange2}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="buyier_details.address"
                      label="Address"
                      value={updatedData.buyier_details?.address || ""}
                      onChange={handleInputChange2}
                      fullWidth
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Import/Export Options */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                  Import/Export Status
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={updatedData.imported || false}
                        onChange={() => 
                          setUpdatedData((prev) => ({
                            ...prev,
                            imported: !prev.imported,
                          }))
                        }
                        color="primary"
                      />
                    }
                    label="Imported"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={updatedData.exported || false}
                        onChange={() => 
                          setUpdatedData((prev) => ({
                            ...prev,
                            exported: !prev.exported,
                          }))
                        }
                        color="primary"
                      />
                    }
                    label="Exported"
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={() => setSelectedItem(null)} 
            variant="outlined"
            startIcon={<DeleteIcon />}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate} 
            variant="contained" 
            color="primary"
            startIcon={<EditIcon />}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Update Item"}
          </Button>
        </DialogActions>
      </Dialog>

    </Card>
  );
};