import React from "react";
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
  DialogTitle,
  DialogContent,
  DialogActions,
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
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { FaUsers } from "react-icons/fa";
import { backendDomainA } from "../../Common/index";

const addItemUrl = import.meta.env.VITE_REACT_ADD_ITEM;
const fetchBulk = import.meta.env.VITE_REACT_FETCH_BULK;
const uploadBulk = import.meta.env.VITE_REACT_UPLOAD_BULK;

const groupApiUrl = import.meta.env.VITE_BASE_URL_Local + "/api/v1/group/all"; // Add this line

const AddItem = () => {
  const [formData, setFormData] = useState({
    item_name: "",
    item_id: "",
    group: "", // will store groupName
    unit_prize: "",
    sellingPrice: "",
    total_prize: "",
    quantity: "",
    hsnCode: "",
    gst: "",
    uom: "", // will store description
    openingStock: "", // Add this line
  });

  // console.log("formData", formData);

  const [selectedFiles, setSelectedFiles] = useState(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [groups, setGroups] = useState([]);
  const [uomData, setUomData] = useState([]);
  // console.log("group", groups);

  const [newGroup, setNewGroup] = useState("");
  // console.log("newGroup", newGroup);

  new // Fetch groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(groupApiUrl);
        if (response.data && response.data.success) {
          setGroups(response.data.groups || []);
        }
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchGroups();
  }, []);

  // Fetch UOM data on mount
  useEffect(() => {
    const fetchUomData = async () => {
      try {
        const response = await axios.get(
          `${backendDomainA}/api/v1/units/all-units`
        );
        // console.log("UOM Data:", response.data);

        if (response.data && response.data.success) {
          setUomData(response.data.data || []);
        }
      } catch (error) {
        // console.error("Error fetching UOM data:", error);
      }
    };
    fetchUomData();
  }, []);
  // In the handleChange function, update the group selection logic
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = {
        ...prev,
        [name]:
          name.includes("prize") || name.includes("quantity")
            ? parseFloat(value) || 0
            : value,
      };

      if (name === "group") {
        const selectedGroup = groups.find(
          (group) => group.description === value
        );
        if (selectedGroup) {
          updatedFormData.group = selectedGroup.groupName;
          setNewGroup(selectedGroup); // Store the selected group object
        } else {
          updatedFormData.group = value;
          setNewGroup(null); // Reset if no match found
        }
      }

      return updatedFormData;
    });
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
      group: newGroup ? newGroup.groupName : formData.group,
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
          group: "",
          unit_prize: "",
          sellingPrice: "",
          total_prize: "",
          quantity: "",
          hsnCode: "",
          gst: "",
          uom: "",
          openingStock: "",
        });
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.error);
      }
    }
  };

  // Download template file

  // Trigger the hidden file input click
  const handleUploadButtonClick = () => {
    setOpenDialog(true);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Check file type
      const file = files[0];
      const fileType = file.type;
      if (
        fileType !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        fileType !== "application/vnd.ms-excel" &&
        fileType !== "text/csv"
      ) {
        toast.error("Please upload Excel or CSV files only");
        return;
      }

      setSelectedFiles(files);
      toast.success("File selected: " + files[0].name);
    }
  };

  // Upload the selected files using the uploadBulk API
  const handleBulkUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    const formDataUpload = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formDataUpload.append("file", selectedFiles[i]);
    }

    try {
      toast.loading("Uploading file...");
      const response = await axios.post(uploadBulk, formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.dismiss();
      if (response?.data?.success) {
        toast.success(response?.data?.message || "Files uploaded successfully");
        setOpenDialog(false);
        setSelectedFiles(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error(response?.data?.message || "Failed to upload files");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Upload error:", error);
      if (error.response) {
        toast.error(
          error.response.data?.message ||
            error.response.data?.error ||
            "Server error during upload"
        );
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Error preparing upload: " + error.message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await axios.get(fetchBulk, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "template.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Failed to download the template file");
    }
  }

  return (
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
            Create New Item for MNS
          </Typography>
        </Box>

        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <form>
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
                    <fieldset
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "10px",
                      }}
                    >
                      <legend
                        style={{
                          padding: "0 10px",
                          fontSize: "1rem",
                          color: "#666",
                        }}
                      >
                        Item Name *
                      </legend>
                      <TextField
                        name="item_name"
                        value={formData.item_name}
                        onChange={handleChange}
                        fullWidth
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
                    </fieldset>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <fieldset
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "10px",
                      }}
                    >
                      <legend
                        style={{
                          padding: "0 10px",
                          fontSize: "1rem",
                          color: "#666",
                        }}
                      >
                        Item ID *
                      </legend>
                      <TextField
                        name="item_id"
                        value={formData.item_id}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">#</InputAdornment>
                          ),
                        }}
                      />
                    </fieldset>
                  </Grid>
                  <Grid item xs={12}>
                    <fieldset
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "10px",
                      }}
                    >
                      <legend
                        style={{
                          padding: "0 10px",
                          fontSize: "1rem",
                          color: "#666",
                        }}
                      >
                        Group *
                      </legend>
                      <TextField
                        select
                        name="group" // Changed from "groups"
                        value={formData.group}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="Select group"
                        fullWidth
                      >
                        {groups.length === 0 ? (
                          <MenuItem value="" disabled>
                            Loading...
                          </MenuItem>
                        ) : (
                          groups.map((group) => (
                            <MenuItem key={group._id} value={group.groupName}>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <FaUsers
                                  style={{ marginRight: 8, color: "#7c3aed" }}
                                />
                                <span style={{ fontWeight: 500 }}>
                                  {group.groupName}
                                </span>
                                <span style={{ color: "#666", marginLeft: 8 }}>
                                  {group.description}
                                </span>
                              </Box>
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    </fieldset>
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
                    <fieldset
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "10px",
                      }}
                    >
                      <legend
                        style={{
                          padding: "0 10px",
                          fontSize: "1rem",
                          color: "#666",
                        }}
                      >
                        Opening Stock
                      </legend>
                      <TextField
                        name="openingStock"
                        type="number"
                        value={formData.openingStock || ""}
                        onChange={handleChange}
                        fullWidth
                        inputProps={{ min: "0",  }}
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
                    </fieldset>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <fieldset
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "10px",
                      }}
                    >
                      <legend
                        style={{
                          padding: "0 10px",
                          fontSize: "1rem",
                          color: "#666",
                        }}
                      >
                        Unit Price
                      </legend>
                      <TextField
                        name="unit_prize"
                        type="number"
                        value={formData.unit_prize}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                        }}
                        inputProps={{ min: "0",  }}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e') {
                            e.preventDefault();
                          }
                        }}
                      />
                    </fieldset>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <fieldset
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "10px",
                      }}
                    >
                      <legend
                        style={{
                          padding: "0 10px",
                          fontSize: "1rem",
                          color: "#666",
                        }}
                      >
                        Selling Price
                      </legend>
                      <TextField
                        name="sellingPrice"
                        type="number"
                        value={formData.sellingPrice}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                        }}
                        inputProps={{ min: "0",  }}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e') {
                            e.preventDefault();
                          }
                        }}
                      />
                    </fieldset>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <fieldset
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "10px",
                      }}
                    >
                      <legend
                        style={{
                          padding: "0 10px",
                          fontSize: "1rem",
                          color: "#666",
                        }}
                      >
                        Quantity
                      </legend>
                      <TextField
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        variant="outlined"
                        inputProps={{ min: "0",  }}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e') {
                            e.preventDefault();
                          }
                        }}
                      />
                    </fieldset>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <fieldset
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "10px",
                      }}
                    >
                      <legend
                        style={{
                          padding: "0 10px",
                          fontSize: "1rem",
                          color: "#666",
                        }}
                      >
                        HSN Code
                      </legend>
                      <TextField
                        name="hsnCode"
                        value={formData.hsnCode}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                      />
                    </fieldset>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <fieldset
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "10px",
                      }}
                    >
                      <legend
                        style={{
                          padding: "0 10px",
                          fontSize: "1rem",
                          color: "#666",
                        }}
                      >
                        GST(%)
                      </legend>
                      <TextField
                        name="gst"
                        value={formData.gst}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        inputProps={{ min: "0",  }}
                        onKeyDown={(e) => {
                          if (e.key === '-' || e.key === 'e') {
                            e.preventDefault();
                          }
                        }}
                      />
                    </fieldset>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <fieldset
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "10px",
                      }}
                    >
                      <legend
                        style={{
                          padding: "0 10px",
                          fontSize: "1rem",
                          color: "#666",
                        }}
                      >
                        UOM *
                      </legend>
                      <TextField
                        select
                        name="uom"
                        value={formData.uom}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="Select UOM"
                        fullWidth
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
                    </fieldset>
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
                            <InputAdornment position="start">₹</InputAdornment>
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

              {/* Hidden file input for bulk upload */}
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              {/* Buttons */}
              <Grid item xs={12}>
                <div className="flex items-end justify-end gap-5 ">
                  <Box
                    sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
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
                      onClick={downloadTemplate}
                    >
                      Download Tempelete
                    </Button>
                  </Box>
                  <Box
                    sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
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
                      onClick={handleUploadButtonClick}
                    >
                      Upload File
                    </Button>
                  </Box>
                  <Box
                    sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
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
                      onClick={handleSubmit}
                    >
                      Create Item
                    </Button>
                  </Box>
                </div>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Paper>

      {/* Upload Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{ bgcolor: "primary.main", color: "white", fontWeight: "bold" }}
        >
          Bulk Upload Items
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Upload multiple items at once using an Excel or CSV file.
          </Typography>

          <Box
            sx={{
              border: "2px dashed",
              borderColor: "primary.light",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              bgcolor: "background.paper",
              cursor: "pointer",
              "&:hover": {
                bgcolor: "primary.lighter",
              },
            }}
            onClick={() => fileInputRef.current.click()}
          >
            <Typography variant="h6" color="primary.main" gutterBottom>
              Click to select file
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supports Excel (.xlsx, .xls) and CSV files
            </Typography>

            {selectedFiles && selectedFiles.length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  p: 1,
                  bgcolor: "primary.lighter",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">
                  Selected: {selectedFiles[0].name}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBulkUpload}
            disabled={!selectedFiles || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddItem;
