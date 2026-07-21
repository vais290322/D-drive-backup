import { useState, useEffect } from "react";
import { 
  Card, CardContent, Button, TextField, FormControlLabel, Switch, 
  Radio, RadioGroup, FormControl, FormLabel, Select, MenuItem, 
  InputLabel, Typography, Box, Paper, Divider, Grid, CircularProgress 
} from "@mui/material";
import axios from "axios";
import { toast } from "react-hot-toast"; 

const addInventoryUrl = import.meta.env.VITE_REACT_ADD_INVENTORY;
const itemListUrl = import.meta.env.VITE_REACT_FETCH_ITEMS; // API to fetch item list

const AddInventoryItem = () => {
  const [items, setItems] = useState([]); // Store the fetched item list
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    item_name: "",
    item_id: "",
    unit_prize: "",
    sellingPrice:"",
    total_prize: "",
    quantity: "",
    hsnCode: "",
    cgst: "",
    igst: "",
    sgst: "",
    taxOption: "igst",
    seller_details: {
      seller_name: "",
      ph_no: "",
      address: "",
      email: "",
    },
    buyier_details: {
      buyer_name: "",
      ph_no: "",
      address: "",
      email: "",
    },
    imported: false,
    exported: false,
  });

  // Fetch the item list on mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(itemListUrl);
        setItems(response?.data?.data || []); 
      } catch (error) {
        toast.error("Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Handle item selection change - Fixed to prevent overriding values
  const handleItemChange = (e) => {
    const selectedItemName = e.target.value;
    const selectedItem = items.find((item) => item.item_name === selectedItemName);
    
    if(selectedItem) {
      setFormData((prev) => ({
        ...prev,
        item_name: selectedItem.item_name,
        item_id: selectedItem.item_id,
        unit_prize: selectedItem.unit_prize || "",
        sellingPrice: selectedItem.sellingPrice || "",
        quantity: selectedItem.quantity || "",
        hsnCode: selectedItem.hsnCode || "",
        cgst: selectedItem.cgst || "",
        igst: selectedItem.igst || "",
        sgst: selectedItem.sgst || "",
        taxOption: selectedItem.igst ? "igst" : "sgst"
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        item_name: selectedItemName,
        item_id: "",
        unit_prize: "",
        sellingPrice: "",
        quantity: "",
        hsnCode: "",
        cgst: "",
        sgst: "",
        igst: "",
        taxOption: "igst"
      }));
    }
    // Removed the problematic override that was causing item_name and item_id to be lost
  };

  // ... existing code ...
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("prize") || name.includes("cgst") || name.includes("igst") || name.includes("sgst") || name.includes("quantity")
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleTaxOptionChange = (e) => {
    const selectedTax = e.target.value;
    setFormData((prev) => ({
      ...prev,
      taxOption: selectedTax,
      igst: selectedTax === "igst" ? prev.igst : 0,
      sgst: selectedTax === "sgst" ? prev.sgst : 0,
    }));
  };

  const handleNestedChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleSwitchChange = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const calculateTotalPrice = () => {
    return (formData.unit_prize * formData.quantity);
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
      setLoading(true);
      const response = await axios.post(
        addInventoryUrl,
        updatedFormData,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        // Reset form after successful submission
        setFormData({
          item_name: "",
          item_id: "",
          unit_prize: "",
          sellingPrice:"",
          total_prize: "",
          quantity: "",
          hsnCode: "",
          cgst: "",
          igst: "",
          sgst: "",
          taxOption: "igst",
          seller_details: {
            seller_name: "",
            ph_no: "",
            address: "",
            email: "",
          },
          buyier_details: {
            buyer_name: "",
            ph_no: "",
            address: "",
            email: "",
          },
          imported: false,
          exported: false,
        });
      } else {
        toast.error(response?.data?.message || "Failed to add inventory item");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message  || "Error submitting form");
      // console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Paper elevation={3} className="max-w-4xl mx-auto rounded-xl overflow-hidden">
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        p: 2, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          Create Inventory Item for MNS
        </Typography>
      </Box>
      
      <CardContent sx={{ p: 4 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Item Selection Section */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, mb: 3, borderColor: 'primary.light' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Item Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Item Name</InputLabel>
                      <Select
                        name="item_name"
                        value={formData.item_name}
                        onChange={handleItemChange}
                        onBlur={handleBlur}
                      >
                        {items.map((item) => (
                          <MenuItem key={item.id || item._id} value={item.item_name}>
                            {item.item_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      name="item_id" 
                      label="Item ID" 
                      value={formData.item_id} 
                      disabled 
                      fullWidth 
                      sx={{ bgcolor: 'action.hover' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      name="unit_prize" 
                      type="number" 
                      label="Unit Price" 
                      value={formData.unit_prize} 
                      onChange={handleChange} 
                      onBlur={handleBlur} 
                      fullWidth 
                      required 
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      name="sellingPrice" 
                      type="number" 
                      label="Selling Price" 
                      value={formData.sellingPrice} 
                      onChange={handleChange} 
                      onBlur={handleBlur} 
                      fullWidth 
                      required 
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      name="quantity" 
                      type="number" 
                      label="Quantity" 
                      value={formData.quantity} 
                      onChange={handleChange} 
                      onBlur={handleBlur} 
                      fullWidth 
                      required 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      name="hsnCode" 
                      label="HSN Code" 
                      value={formData.hsnCode} 
                      onChange={handleChange} 
                      fullWidth 
                      required 
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Tax Section */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, mb: 3, borderColor: 'primary.light' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Tax Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      name="cgst" 
                      type="number" 
                      label="CGST" 
                      value={formData.cgst} 
                      onChange={handleChange} 
                      onBlur={handleBlur} 
                      fullWidth 
                      required 
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Select Tax Type</FormLabel>
                      <RadioGroup 
                        row 
                        value={formData.taxOption} 
                        onChange={handleTaxOptionChange}
                      >
                        <FormControlLabel value="igst" control={<Radio />} label="IGST" />
                        <FormControlLabel value="sgst" control={<Radio />} label="SGST" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      name="igst" 
                      type="number" 
                      label="IGST" 
                      value={formData.igst} 
                      onChange={handleChange} 
                      onBlur={handleBlur} 
                      fullWidth 
                      disabled={formData.taxOption !== "igst"} 
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      name="sgst" 
                      type="number" 
                      label="SGST" 
                      value={formData.sgst} 
                      onChange={handleChange} 
                      onBlur={handleBlur} 
                      fullWidth 
                      disabled={formData.taxOption !== "sgst"} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      name="total_prize" 
                      type="number" 
                      label="Total Price" 
                      value={formData.total_prize} 
                      disabled 
                      fullWidth 
                      sx={{ 
                        bgcolor: 'action.hover',
                        '& .MuiInputBase-input': { 
                          fontWeight: 'bold', 
                          color: 'success.main' 
                        } 
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Seller Details */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%', borderColor: 'primary.light' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Seller Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField 
                      name="seller_name" 
                      label="Seller Name" 
                      value={formData.seller_details.seller_name} 
                      onChange={(e) => handleNestedChange(e, "seller_details")} 
                      fullWidth 
                      required 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      name="ph_no" 
                      label="Phone Number" 
                      value={formData.seller_details.ph_no} 
                      onChange={(e) => handleNestedChange(e, "seller_details")} 
                      fullWidth 
                      required 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      name="email" 
                      label="Email" 
                      value={formData.seller_details.email} 
                      onChange={(e) => handleNestedChange(e, "seller_details")} 
                      fullWidth 
                      required 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      name="address" 
                      label="Address" 
                      value={formData.seller_details.address} 
                      onChange={(e) => handleNestedChange(e, "seller_details")} 
                      fullWidth 
                      required 
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Buyer Details */}
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%', borderColor: 'primary.light' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Buyer Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField 
                      name="buyer_name" 
                      label="Buyer Name" 
                      value={formData.buyier_details.buyer_name} 
                      onChange={(e) => handleNestedChange(e, "buyier_details")} 
                      fullWidth 
                      required 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      name="ph_no" 
                      label="Phone Number" 
                      value={formData.buyier_details.ph_no} 
                      onChange={(e) => handleNestedChange(e, "buyier_details")} 
                      fullWidth 
                      required 
                    />
                  </Grid>
                  <Grid item xs={12}>
                  <TextField 
                      name="email" 
                      label="Email" 
                      value={formData.buyier_details.email} 
                      onChange={(e) => handleNestedChange(e, "buyier_details")} 
                      fullWidth 
                      required 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      name="address" 
                      label="Address" 
                      value={formData.buyier_details.address} 
                      onChange={(e) => handleNestedChange(e, "buyier_details")} 
                      fullWidth 
                      required 
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Import/Export Options */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, mb: 3, borderColor: 'primary.light' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Import/Export Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.imported}
                        onChange={() => handleSwitchChange("imported")}
                        color="primary"
                      />
                    }
                    label="Imported"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.exported}
                        onChange={() => handleSwitchChange("exported")}
                        color="primary"
                      />
                    }
                    label="Exported"
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    minWidth: '150px',
                    py: 1.5,
                    boxShadow: 3,
                    '&:hover': {
                      boxShadow: 5,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s'
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Add Inventory Item"
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Paper>
  );
};

export default AddInventoryItem;