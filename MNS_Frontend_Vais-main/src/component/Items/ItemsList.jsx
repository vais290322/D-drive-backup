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
  Box,
  Paper,
  Container,
  IconButton,
  Divider,
  Chip,
  InputAdornment,
  Tooltip,
  Grid,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  MenuItem
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Inventory as InventoryIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { toast } from "react-hot-toast";
import { backendDomainA } from "../../common";

const fetchItemsUrl = import.meta.env.VITE_REACT_FETCH_ITEMS;
const updateItemUrl = import.meta.env.VITE_REACT_UPDATE_ITEM;
const deleteItemUrl = import.meta.env.VITE_REACT_DELETE_ITEM;

const groupApiUrl = import.meta.env.VITE_BASE_URL_Local;

export default function ItemsList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [items, setItems] = useState([]);
  // console.log("items is:''''", items);
  const [groups, setGroups] = useState([]); // Add this
  const [uomData, setUomData] = useState([]); // Add this
  const [uom, setUom] = useState([]); // Add this

  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(fetchItemsUrl);
      // console.log("response 5475467546: ", response);
      setItems(response?.data?.data || []);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      // console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();

     // Fetch groups
     const fetchGroups = async () => {
      try {
        const response = await axios.get(`${groupApiUrl}/api/v1/group/all`);
        if (response.data && response.data.success) {
          setGroups(response.data.groups || []);
        }
      } catch (error) {
        toast.error("Failed to fetch groups");
      }
    };
    fetchGroups();

    // Fetch UOMs
    const fetchUomData = async () => {
      try {
        const response = await axios.get(
          `${backendDomainA}/api/v1/units/all-units`
        );
        // console.log("rsehhgdjsghjjd", response);
        if (response.data && response.data.success) {
          setUomData(response.data.data || []);
        }
      } catch (error) {
        toast.error("Failed to fetch UOMs");
      }
    };
    fetchUomData();

  }, []);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setUpdatedData({
      ...item,
      openningStock: item.openningStock || 0, // Ensure openningStock is included
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newUpdatedData = {
      ...updatedData,
      [name]:
        name === "quantity" || name === "unit_prize" || name === "sellingPrice"
          ? parseFloat(value) || 0
          : value,
    };

    // Calculate total price whenever relevant fields change
    if (["quantity", "unit_prize", "gst", "uom"].includes(name)) {
      const quantity = parseFloat(newUpdatedData.quantity) || 0;
      const unitPrice = parseFloat(newUpdatedData.unit_prize) || 0;
      const cgst = parseFloat(newUpdatedData.cgst) || 0;
      const sgst = parseFloat(newUpdatedData.sgst) || 0;
      const igst = parseFloat(newUpdatedData.igst) || 0;

      // Calculate base price
      const basePrice = quantity * unitPrice;

      // Calculate tax amounts
      const cgstAmount = (basePrice * cgst) / 100;
      const sgstAmount = (basePrice * sgst) / 100;
      const igstAmount = (basePrice * igst) / 100;

      // Calculate total price
      const totalPrice = basePrice;

      // Update the total price in the state
      newUpdatedData.total_prize = parseFloat(totalPrice.toFixed(2));
    }

    setUpdatedData(newUpdatedData);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${updateItemUrl}/${selectedItem._id}`,
        updatedData
      );
      console.log("response5656 :", response);

      if (response.data.success) {
        toast.success(response.data.message);
      }
      fetchItems();
      setSelectedItem(null);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      // console.error("Error updating item:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`${deleteItemUrl}/${itemToDelete}`);
      if (response.data.success) {
        toast.success(response.data.message);
      }
      fetchItems();
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      // console.error("Error deleting item:", error);
    } finally {
      setLoading(false);
    }
  };



  // Update the columns to show percentage for tax fields
  const columns = [
    {
      field: "item_name",
      headerName: "Item Name",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ fontWeight: "medium" }}>{params.value}</Box>
      ),
    },
    {
      field: "group",
      headerName: "Group",
      flex: 0.8,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.value} arrow>
          <Typography
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "openningStock",
      headerName: "Opening Stock",
      flex: 1.2,
      minWidth: 100,
      type: "number",
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value?.toLocaleString() || "0"}
        </Typography>
      ),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 0.7,
      minWidth: 100,
      type: "number",
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value > 10
              ? "success"
              : params.value > 0
              ? "warning"
              : "error"
          }
          size="small"
        />
      ),
    },
    {
      field: "unit_prize",
      headerName: "Unit Price",
      flex: 0.8,
      minWidth: 110,
      type: "number",
      renderCell: (params) => (
        <Typography variant="body2">
          ₹ {params.value?.toLocaleString() || "0"}
        </Typography>
      ),
    },
    {
      field: "sellingPrice",
      headerName: "Selling Price",
      flex: 0.8,
      minWidth: 110,
      type: "number",
      renderCell: (params) => (
        <Typography variant="body2" color="success.main">
          ₹ {params.value?.toLocaleString() || "0"}
        </Typography>
      ),
    },
    {
      field: "gst",
      headerName: "GST",
      flex: 0.7,
      minWidth: 90,
      type: "number",
      renderCell: (params) => (
        <Typography variant="body2">{params.value}%</Typography>
      ),
    },
    {
      field: "uom",
      headerName: "UOM",
      flex: 0.7,
      minWidth: 90,
      type: "number",
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
    {
      field: "total_prize",
      headerName: "Total Price",
      flex: 0.8,
      minWidth: 120,
      type: "number",
      valueFormatter: (params) =>
        `₹ ${params.value?.toLocaleString() || "0.00"}`,
      renderCell: (params) => (
        <Typography fontWeight="bold" color="primary.main">
          ₹ {params.value?.toLocaleString() || "0.00"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.2,
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Edit Item">
            <IconButton
              color="primary"
              onClick={() => handleEdit(params.row)}
              size="small"
              sx={{
                border: "1px solid",
                borderColor: "primary.light",
                "&:hover": {
                  bgcolor: "primary.lighter",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Item">
            <IconButton
              color="error"
              onClick={() => confirmDelete(params.row._id)}
              size="small"
              sx={{
                border: "1px solid",
                borderColor: "error.light",
                "&:hover": {
                  bgcolor: "error.lighter",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background: "linear-gradient(to right bottom, #ffffff, #f9fafb)",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <InventoryIcon fontSize="large" />
            <Typography variant="h4" component="h1" fontWeight="bold">
              MNS's Items Inventory
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<RefreshIcon />}
              onClick={fetchItems}
              disabled={loading}
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                },
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={() => (window.location.href = "/add-item")}
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                },
              }}
            >
              Add Item
            </Button>
          </Box>
        </Box>

        <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={items}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 20, 50]}
              checkboxSelection
              getRowId={(row) => row._id}
              autoHeight={false}
              loading={loading}
              disableSelectionOnClick
              components={{
                Toolbar: GridToolbar,
              }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "primary.lighter",
                  color: "primary.dark",
                  fontSize: "1rem",
                },
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "action.hover",
                },
                border: "none",
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid",
                  borderColor: "divider",
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid",
                  borderColor: "divider",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: "background.paper",
                },
              }}
            />
          </Box>
        </CardContent>
      </Paper>

      {/* Edit Dialog */}
      <Dialog
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.lighter",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EditIcon color="primary" />
            <Typography variant="h6" color="primary.dark">
              Edit Item
            </Typography>
          </Box>
          <IconButton onClick={() => setSelectedItem(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Item Name"
                name="item_name"
                value={updatedData.item_name || ""}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon color="primary" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Item ID"
                name="item_id"
                value={updatedData.item_id || ""}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">#</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Group"
                name="group"
                value={updatedData.group || ""}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                required
              >
                {groups.length === 0 ? (
                  <MenuItem value="" disabled>
                    Loading...
                  </MenuItem>
                ) : (
                  groups.map((group) => (
                    <MenuItem key={group._id} value={group.groupName}>
                      {group.groupName}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Opening Stock"
                name="openningStock"
                type="number"
                value={
                  updatedData.openningStock || updatedData.openningStock || ""
                }
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                InputProps={{
                  inputProps: { min: 0 },
                }}
                inputProps={{ min: "0" }}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e') {
                    e.preventDefault();
                  }
                }}

              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Unit Price"
                name="unit_prize"
                type="number"
                value={updatedData.unit_prize || ""}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
                inputProps={{ min: "0" }}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e') {
                    e.preventDefault();
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Selling Price"
                name="sellingPrice"
                type="number"
                value={updatedData.sellingPrice || 0}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
                inputProps={{ min: "0" }}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e') {
                    e.preventDefault();
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={updatedData.quantity || ""}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                inputProps={{ min: "0" }}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e') {
                    e.preventDefault();
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="HSN Code"
                name="hsnCode"
                value={updatedData.hsnCode || ""}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="gst"
                label="GST(%)"
                value={updatedData?.gst}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
                inputProps={{ min: "0" }}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e') {
                    e.preventDefault();
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                name="uom"
                label="UOM"
                value={updatedData.uom || ""}
                onChange={handleInputChange}
                fullWidth
                margin="dense"
              >
                {uomData.length === 0 ? (
                  <MenuItem value="" disabled>
                    Loading...
                  </MenuItem>
                ) : (
                  uomData.map((unit) => (
                    <MenuItem key={unit._id} value={unit.name}>
                      {unit.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "primary.lighter",
                  borderRadius: 2,
                  border: "1px dashed",
                  borderColor: "primary.main",
                }}
              >
                <Typography
                  variant="subtitle1"
                  color="primary.dark"
                  gutterBottom
                >
                  Total Price Calculation
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Unit Price × Quantity
                </Typography>
                <TextField
                  label="Total Price"
                  name="total_prize"
                  type="number"
                  value={updatedData.total_prize || ""}
                  fullWidth
                  margin="dense"
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                    readOnly: true,
                    sx: {
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: "primary.main",
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: "background.paper" }}>
          <Button
            onClick={() => setSelectedItem(null)}
            color="inherit"
            startIcon={<CloseIcon />}
            sx={{
              borderRadius: 2,
              px: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
              boxShadow:
                "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
              "&:hover": {
                boxShadow:
                  "0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)",
              },
            }}
          >
            {loading ? "Updating..." : "Update Item"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "error.lighter",
            color: "error.dark",
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DeleteIcon color="error" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Alert>
          <Typography variant="body1">
            Are you sure you want to delete this item? This will permanently
            remove the item from your inventory.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            color="inherit"
            sx={{
              borderRadius: 2,
              px: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
            }}
          >
            {loading ? "Deleting..." : "Delete Item"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Empty State */}
      {items.length === 0 && !loading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 5,
            mt: 4,
            bgcolor: "#f8fafc",
            borderRadius: 2,
            border: "1px dashed #cbd5e1",
          }}
        >
          <InventoryIcon sx={{ fontSize: 60, color: "#94a3b8", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Items Found
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ maxWidth: 400, mb: 3 }}
          >
            There are no items in your inventory yet. Add your first item to get
            started.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => (window.location.href = "/add-item")}
          >
            Add New Item
          </Button>
        </Box>
      )}
    </Container>
  );
} // Add this closing curly brace to fix the error
