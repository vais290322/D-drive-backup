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
  Container 
} from "@mui/material";
import { 
  Inventory as InventoryIcon, 
  Description as DescriptionIcon,
  LocalOffer as LocalOfferIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';
import axios from "axios"
import { useState } from "react";
import {toast} from "react-hot-toast"

const addItemUrl=import.meta.env.VITE_REACT_ADD_ITEM;

const AddItem = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isMedium = useMediaQuery(theme.breakpoints.down('md'));
    
    const [formData,setFormData]=useState({
        item_name:"",
        item_id:"",
        item_description:"",
        unit_prize:"",
        sellingPrice:"",
        total_prize:"",
        quantity:"",
        hsnCode:"",
        cgst:"",
        sgst:"",
        igst:"",
        taxOption:"sgst"
    });
    
    const handleChange=(e)=>{
         const {name,value}=e.target;
         setFormData((prev)=>({
            ...prev,
            [name]:name.includes("prize")  || name.includes("quantity")
            ? parseFloat(value) || 0 : value
         }))
    }
    
    const handleTaxOptionChange=(e)=>{
           const selectedTax=e.target.value;
           setFormData((prev)=>({
            ...prev,
            taxOption:selectedTax,
            igst:selectedTax==="igst"?prev.igst:0,
            sgst:selectedTax==="sgst"?prev.sgst:0

           }))
    }
    
    const calculateTotalPrice=()=>{
      return (formData.unit_prize*formData.quantity);
    }

    const handleBlur=()=>{
      setFormData((prev)=>({
        ...prev,
        total_prize:calculateTotalPrice()
      }))
    }

    const handleSubmit=async(e)=>{
      e.preventDefault();
      const updatedFormData={
        ...formData,
        total_prize:calculateTotalPrice()
      }
      try {
        const response=await axios.post(
          addItemUrl,
          updatedFormData,
          {headers:{
            "Content-Type":"application/json"
          }}
        )
        if(response?.data?.success){
          toast.success(response?.data?.message)
          // Reset form after successful submission
          setFormData({
            item_name:"",
            item_id:"",
            item_description:"",
            unit_prize:"",
            sellingPrice:"",
            total_prize:"",
            quantity:"",
            hsnCode:"",
            cgst:"",
            sgst:"",
            igst:"",
            taxOption:"sgst"
          });
        }
        // console.log("Response",response?.data);
        
      } catch (error) {
        if(error.response){
          toast.error(error.response.data?.error)
        }
        // console.log("Error",error);
      }
    }
    
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          background: 'linear-gradient(to right bottom, #ffffff, #f9fafb)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <InventoryIcon fontSize="large" />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Create New Item for MNS
          </Typography>
        </Box>
        
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Item Information */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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
                            <LocalOfferIcon color="primary" fontSize="small" />
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
                          <InputAdornment position="start">
                            #
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      name="item_description" 
                      label="Item Description" 
                      value={formData.item_description} 
                      onChange={handleChange} 
                      fullWidth 
                      required 
                      variant="outlined"
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
              </Grid>
              
              {/* Pricing Information */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2, mt: 2 }}>
                  <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CalculateIcon /> Pricing & Quantity
                  </Typography>
                  <Divider />
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField 
                      name="unit_prize" 
                      type="number" 
                      label="Unit Price" 
                      value={formData.unit_prize} 
                      onChange={handleChange} 
                      onBlur={handleBlur} 
                      fullWidth 
                      required 
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            ₹
                          </InputAdornment>
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
                      required 
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            ₹
                          </InputAdornment>
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
                      required 
                      variant="outlined"
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
                </Grid>
              </Grid>
              
              {/* Tax Information */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2, mt: 2 }}>
                  <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    Tax Information
                  </Typography>
                  <Divider />
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
                      <FormLabel component="legend" sx={{ mb: 1 }}>Select Tax Type</FormLabel>
                      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                        <RadioGroup 
                          row 
                          value={formData.taxOption} 
                          onChange={handleTaxOptionChange}
                          sx={{ 
                            justifyContent: 'space-around',
                            '& .MuiFormControlLabel-root': {
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              mx: 1,
                              flex: 1,
                              justifyContent: 'center'
                            },
                            '& .Mui-checked + .MuiFormControlLabel-label': {
                              fontWeight: 'bold',
                              color: 'primary.main'
                            }
                          }}
                        >
                          <FormControlLabel value="igst" control={<Radio color="primary" />} label="IGST" />
                          <FormControlLabel value="sgst" control={<Radio color="primary" />} label="SGST" />
                        </RadioGroup>
                      </Paper>
                    </FormControl>
                  </Grid>
                  
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
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            ₹
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      name="igst" 
                      type="number" 
                      label="IGST" 
                      value={formData.igst} 
                      onChange={handleChange} 
                      onBlur={handleBlur} 
                      fullWidth 
                      disabled={formData.taxOption !== "igst"} 
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            ₹
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        opacity: formData.taxOption !== "igst" ? 0.7 : 1
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      name="sgst" 
                      type="number" 
                      label="SGST" 
                      value={formData.sgst} 
                      onChange={handleChange} 
                      onBlur={handleBlur} 
                      fullWidth 
                      disabled={formData.taxOption !== "sgst"} 
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            ₹
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        opacity: formData.taxOption !== "sgst" ? 0.7 : 1
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              
              {/* Total Price */}
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    mt: 3, 
                    p: 3, 
                    bgcolor: 'primary.lighter', 
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'primary.main'
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
                            fontWeight: 'bold', 
                            fontSize: '1.2rem',
                            color: 'primary.main'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              
              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1rem',
                      boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
                      '&:hover': {
                        boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
                        transform: 'translateY(-1px)'
                      }
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
  )
}

export default AddItem;