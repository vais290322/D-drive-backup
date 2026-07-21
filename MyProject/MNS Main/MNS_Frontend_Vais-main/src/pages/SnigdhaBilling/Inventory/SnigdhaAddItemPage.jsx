import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Chip,
  Tooltip,
  Alert,
  MenuItem,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Description as DescriptionIcon,
  LocalOffer as LocalOfferIcon,
  Calculate as CalculateIcon,
  CloudDownload as CloudDownloadIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { backendDomainA } from "../../../Common/index";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const addItemUrl = import.meta.env.VITE_REACT_ADD_ITEM_SNI;
const fetchItemsUrl = import.meta.env.VITE_REACT_FETCH_ITEMS_SIN;
const updateItemUrl = import.meta.env.VITE_REACT_UPDATE_ITEM_SIN;
const deleteItemUrl = import.meta.env.VITE_REACT_DELETE_ITEM_SIN;
const fetchBulkUrl = import.meta.env.VITE_REACT_FETCH_BULK_SIN;
const uploadBulkUrl = import.meta.env.VITE_REACT_UPLOAD_BULK_SIN;
const groupApiUrl = import.meta.env.VITE_BASE_URL_Local;

const SnigdhaAddItemPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [groups, setGroups] = useState([]);
  const [uomData, setUomData] = useState([]);

  const [formData, setFormData] = useState({
    item_name: "",
    item_id: "",
    unit_prize: "",
    sellingPrice: "",
    total_prize: "",
    quantity: "",
    hsnCode: "",
    gst: "",
    uom: "",
    group: "",
    openingStock: ""
  });
  // console.log("formData", formData);
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
        if (response.data && response.data.success) {
          setUomData(response.data.data || []);
        }
      } catch (error) {
        toast.error("Failed to fetch UOMs");
      }
    };
    fetchUomData();
  }, []);

  // File upload handlers
  // File change handler
  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  // Simulate click on file input
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // File upload handler
  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", selectedFiles[0]);

    try {
      const response = await axios.post(uploadBulkUrl, formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || "File uploaded successfully");
        setSelectedFiles(null);
        // fetchItems(); // Refresh the items list if needed
        // setOpenDialog(false); // Close dialog if needed
      } else {
        toast.error(response.data.message || "Failed to upload file");
      }
    } catch (error) {
      // console.error("Error uploading file:", error);
      toast.error(
        error.response?.data?.message || "An error occurred during upload"
      );
    } finally {
      setIsUploading(false);
    }
  };

  // CSV template download handler

  // Form change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name?.includes("prize") ||
          name?.includes("sgst") ||
          name?.includes("igst") ||
          name?.includes("cgst") ||
          name?.includes("quantity")
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const calculateTotalPrice = () => {
    return formData.unit_prize * formData.quantity;
  };

  const handleBlur = () => {
    setFormData((prev) => ({
      ...prev,
      total_prize: calculateTotalPrice(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      total_prize: calculateTotalPrice(),
    };
    try {
      const response = await axios.post(addItemUrl, updatedFormData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        // Reset form after successful submission
        setFormData({
          item_name: "",
          item_id: "",
          unit_prize: "",
          sellingPrice: "",
          total_prize: "",
          openingStock: "",
          quantity: "",
          hsnCode: "",
          gst: "",
          uom: "",
        });
      }
      console.log("Response", response?.data);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.error);
      }
      // console.log("Error", error);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(fetchItemsUrl);
      // console.log("response : ",response);
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
  }, []);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setUpdatedData(item);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({
      ...updatedData,
      [name]: name === "quantity" ? parseFloat(value) || 0 : value,
    });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${updateItemUrl}/${selectedItem._id}`,
        updatedData
      );
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

  const downloadTemplete = async () => {
    try {
      const response = await axios.get(fetchBulkUrl, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "item_template.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Template downloaded successfully");
    } catch (error) {
      console.error("Download template error:", error);
      toast.error("Failed to download the template");
    }
  }

  const columns = [
    {
      field: "item_id",
      headerName: "Item Id",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ fontWeight: "medium" }}>{params.value}</Box>
      ),
    },
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
      flex: 1.5,
      minWidth: 100,
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
      field: "openingStock",
      headerName: "Opening Stock",
      flex: 1.5,
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
      field: "totalPurchase",
      headerName: "Total Purchase",
      flex: 1.5,
      minWidth: 100,
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
      field: "totalSales",
      headerName: "Total Sales",
      flex: 1.5,
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
    },
    {
      field: "sellingPrice",
      headerName: "Selling Price",
      flex: 0.8,
      minWidth: 110,
      type: "number",
    },
    {
      field: "total_prize",
      headerName: "Total Price",
      flex: 0.8,
      minWidth: 120,
      type: "number",
      valueFormatter: (params) => `$${params.value?.toFixed(2) || "0.00"}`,
      renderCell: (params) => (
        <Typography fontWeight="bold" color="primary.main">
          {params.value?.toFixed(2) || "0.00"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
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
    <div>
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
              alignItems: "center",
              gap: 2,
            }}
          >
            <InventoryIcon fontSize="large" />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Create New Item for Snigdha
            </Typography>
          </Box>

          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Basic Item Information */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <DescriptionIcon /> Basic Information
                    </Typography>
                    <Divider />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="item_name"
                        label="Item Name"
                        value={formData.item_name}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocalOfferIcon
                                color="primary"
                                fontSize="small"
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="item_id"
                        label="Item ID"
                        value={formData.item_id}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
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
                        name="group"
                        label="Group"
                        value={formData.group}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
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
                  </Grid>
                </Grid>

                {/* Pricing Information */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 2, mt: 2 }}>
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <CalculateIcon /> Pricing & Quantity
                    </Typography>
                    <Divider />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        name="openingStock"
                        type="number"
                        label="Opening Stock"
                        value={formData.openingStock}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        inputProps={{
                          min: "0",
                        }}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e') {
                            e.preventDefault();
                          }
                        }}
                        variant="outlined"
                        InputProps={{
                          // startAdornment: (
                          //   <InputAdornment position="start">₹</InputAdornment>
                          // ),
                        }}

                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        name="unit_prize"
                        type="number"
                        label="Unit Price"
                        value={formData.unit_prize}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        inputProps={{ min: "0",
                          step: "0.001", // Allows 3+ decimal places
                          inputMode: "decimal",
                         }}
                        steps={{
                          decimal: 2,
                        }}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e') {
                            e.preventDefault();
                          }
                        }}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        name="sellingPrice"
                        type="number"
                        label="Selling Price"
                        value={formData.sellingPrice}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        inputProps={{ min: "0",
                          step: "0.001", // Allows 3+ decimal places
                          inputMode: "decimal",
                         }}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e') {
                            e.preventDefault();
                          }
                        }}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        name="quantity"
                        type="number"
                        label="Quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        variant="outlined"
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
                        name="hsnCode"
                        label="HSN Code"
                        value={formData.hsnCode}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        name="gst"
                        label="GST%"
                        type="number"
                        value={formData.gst}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
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
                        value={formData.uom}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth

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
                  </Grid>
                </Grid>


                {/* Total Price */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      mt: 3,
                      p: 3,
                      bgcolor: "primary.lighter",
                      borderRadius: 2,
                      border: "1px dashed",
                      borderColor: "primary.main",
                    }}
                  >
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" color="primary.dark">
                          Total Price:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Unit Price × Quantity
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="total_prize"
                          type="number"
                          label="Total Price"
                          value={formData.total_prize}
                          disabled
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
                            readOnly: true,
                            sx: {
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                              color: "primary.main",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "30px",
                    }}
                  >
                    <Box>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<CloudDownloadIcon />}
                        onClick={downloadTemplete}
                        sx={{
                          bgcolor: "pink",
                          color: "primary.main",
                          "&:hover": {
                            bgcolor: "#027bd1",
                            color: "white",
                          },
                          mt: 1,
                        }}
                      >
                        Download Templete
                      </Button>
                    </Box>
                    <Box>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<CloudDownloadIcon />}
                        onClick={() => setOpenDialog(true)}
                        sx={{
                          bgcolor: "white",
                          color: "primary.main",
                          "&:hover": {
                            bgcolor: "#027bd1",
                            color: "white",
                          },
                          mt: 1,
                        }}
                      >
                        Upload File
                      </Button>
                    </Box>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: "1rem",
                        boxShadow:
                          "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
                        "&:hover": {
                          boxShadow:
                            "0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      Create Item
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Paper>
      </Container>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
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

          <IconButton onClick={() => setOpenDialog(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="body1" paragraph>
            Upload multiple items at once using an Excel file. Download the
            template below to ensure your data is formatted correctly.
          </Typography>

          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              border: "2px dashed",
              borderColor: "primary.light",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              bgcolor: "primary.lighter",
              mb: 2,
            }}
          >
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              style={{ display: "none" }}
              ref={fileInputRef}
            />

            <Typography variant="body1" color="primary.dark" gutterBottom>
              {selectedFiles ? selectedFiles[0]?.name : "No file selected"}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              startIcon={<UploadIcon />}
              onClick={handleUploadClick}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Upload File
            </Button>
          </Box>

          {selectedFiles && (
            <Alert severity="info" sx={{ mt: 2 }}>
              File selected: {selectedFiles[0]?.name}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: "background.paper" }}>
          <Button
            onClick={() => setOpenDialog(false)}
            color="inherit"
            sx={{
              borderRadius: 2,
              px: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleFileUpload}
            color="primary"
            variant="contained"
            startIcon={<UploadIcon />}
            disabled={!selectedFiles || isUploading}
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
            {isUploading ? "Uploading..." : "Upload Items"}
          </Button>
        </DialogActions>
      </Dialog>

      <div className="mt-4">
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
                  Items Inventory in Snigdha
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
                  onClick={() => (window.location.href = "/snigdha-add-item")}
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
                    name="openingStock"
                    type="number"
                    value={updatedData.openingStock || ""}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    inputProps={{ min: "0", }}
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
                    inputProps={{ min: "0", }}
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
                    inputProps={{ min: "0", }}
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
                    value={updatedData.quantity || 0}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                    inputProps={{ min: "0", }}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="GST(%)"
                    name="gst"
                    value={updatedData.gst || ""}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    label="UOM"
                    name="uom"
                    select
                    value={updatedData.uom || ""}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                    required
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
                {/* <Grid item xs={12} sm={6}>
              <TextField 
                label="CGST" 
                name="cgst" 
                type="number" 
                value={updatedData.cgst || ""} 
                onChange={handleInputChange} 
                fullWidth 
                margin="dense"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      $
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="SGST" 
                name="sgst" 
                type="number" 
                value={updatedData.sgst || ""} 
                onChange={handleInputChange} 
                fullWidth 
                margin="dense"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      $
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="IGST" 
                name="igst" 
                type="number" 
                value={updatedData.igst || ""} 
                onChange={handleInputChange} 
                fullWidth 
                margin="dense"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      $
                    </InputAdornment>
                  ),
                }}
              />
            </Grid> */}
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
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
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
                There are no items in your inventory yet. Add your first item to
                get started.
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
      </div>
    </div>
  );
};

export default SnigdhaAddItemPage;
