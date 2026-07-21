import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PdfFormate from "./ViewPDF";
import { backendDomainA, backendDomainS } from "../../../common";
import axios from "axios";


const New_Url = import.meta.env.VITE_REACT_INVOICE;
const Item_fetch_url = import.meta.env.VITE_REACT_FETCH_INVENTORY_SIN;
const Customer_Url = import.meta.env.VITE_REACT_CUSTOMER_FETCH;

const AddInvoicePageS = () => {
  return (
    <div className="container mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold mb-6">Create New Invoice for Snigdha </h1>
    <InvoiceForm />
  </div>
  )
}

export default AddInvoicePageS;
 


const InvoiceForm = () => {
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [insufficientItemModal, setInsufficientItemModal] = useState(false);
  const [insufficientItemIndex, setInsufficientItemIndex] = useState(null);
  const [insufficientItemData, setInsufficientItemData] = useState(null);
  const [snigdhaItem, setSnigdhaItem] = useState(null);
  const [isLoadingSnigdhaItem, setIsLoadingSnigdhaItem] = useState(false);
  const [quantityToAdd, setQuantityToAdd] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // for checking qunatity 

 



    const [formData, setFormData] = useState({
      billFormat: "",
      date: "",
      taxGroup: "",
      paymentType: "cash",
      customerName: "",
      invoiceNumber: "",
      priceGroup: "",
      location: "",
      // name: customerQuery || "",
      state: "",
      phone: "",
      address: "",
      gstnumber: "",
      id: Math.floor(100000 + Math.random() * 900000),
    });
    const [items, setItems] = useState([
      {
        id: 1,
        query: "",
        filteredSuggestions: [],
        itemName: "",
        itemid: "",
        iditem: "",
        quantity: "",
        hsnCode: "",
        cgst: "",
        sgst: "",
        igst: "",
        unitPrice: "",
        sellingPrice: "",
        grossAmount: "",
        discountRate: "",
        discountAmount: "",
        netAmount: "",
        taxRate: "",
        taxAmount: "",
        amount: "",
      },
    ]);
    const [totals, setTotals] = useState({
      discount: "0.00",
      taxableAmount: "0.00",
      taxAmount: "0.00",
      grandTotal: "0.00",
    });
    //------------------------ ITEM SUGGETION ---------------------------------------------------
  
    const [query, setQuery] = useState("");
  
    const [itemMainData, setItemMainData] = useState([]);
    // console.log(itemMainData)
    const [suggestions, setSuggestions] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [itemid, setitemid] = useState("")
    const [iditem, setidItem] = useState([]);

    const fetchUnit = async () => {
      try {
        const response = await axios.get(
          `${backendDomainS}/api/v1/units/all-units`
        );
        setSelectedUnit(response?.data?.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast.error("Failed to fetch units");
      }
    };

    useEffect(()=>{
      fetchUnit();
    },[])

    const handleItemQueryChange = (index, e) => {
      const userInput = e.target.value;
      const newItems = [...items];
      newItems[index].query = userInput;
  
      if (userInput) {
        const filtered = itemMainData.filter((suggestion) =>
          suggestion.item_name.toLowerCase().includes(userInput.toLowerCase())
        ).map((suggestion) => ({
          name: suggestion.item_name,
          id: suggestion._id,
          itemid: suggestion.item_id,
          quantity: suggestion.quantity,
          sellingPrice: suggestion?.sellingPrice || "",
        }));
        newItems[index].filteredSuggestions = filtered;
      } else {
        newItems[index].filteredSuggestions = [];
      }
  
      setItems(newItems);
    };
  
    const [itemStates, setItemStates] = useState([{
      query: "",
      itemid: "",
      iditem: ""
    }]);
    
    const handleSelect = (index, suggestion) => {
      const selectedItem = itemMainData.find((item) => item._id === suggestion.id);
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        query: suggestion.name,
        itemName: suggestion.name,
        itemid: suggestion.itemid,
        iditem: suggestion.id,
        hsnCode: selectedItem?.hsnCode || "",
        cgst: selectedItem?.cgst || "0",
        sgst: selectedItem?.sgst || "0",
        igst: selectedItem?.igst || "0",
        unitPrice: selectedItem?.unit_prize || "",
        sellingPrice: selectedItem?.sellingPrice || "",
        filteredSuggestions: [],
      };
      setItems(newItems);
    };
  
    // const [suggestionsList, setsuggestionsList] = useState([]);
  
    //console.log(suggestions)
  
    useEffect(() => {
      if (query && itemid) {
  
        const filtered = itemMainData.filter((customer) =>
          customer._id === itemid
        );
        //   console.log(query,itemid ,filtered)
        if (filtered.length > 0) {
          const selectedItem = filtered[0];
          setItems(prev => [{
            ...prev[0],
            itemName: selectedItem.item_name || '',
            hsnCode: selectedItem.hsnCode || '',
            cgst: selectedItem.cgst ? selectedItem.cgst : '0',
            sgst: selectedItem.sgst ? selectedItem.sgst : '0',
            igst: selectedItem.igst ? selectedItem.igst : '0',
            unitPrice: selectedItem.unit_prize || '',
            sellingPrice: selectedItem?.sellingPrice || '',
          }]);
        }
      }
    }, [query, itemid, itemMainData]);
  
    const addNewRow = () => {
      // Check if any item has an invalid or empty quantity
      const hasInvalidQuantity = items.some(item => {
        if (!item.itemName) return false; // Skip check for items that haven't been selected yet
        
        // Find the original item to get the available quantity
        const originalItem = itemMainData.find(availableItem => 
          availableItem._id === item.iditem
        );
        
        if (!originalItem) return false;
        
        const availableQuantity = parseInt(originalItem.quantity || 0);
        const requestedQuantity = parseInt(item.quantity || 0);
        
        // Check if quantity is empty or exceeds available
        return !item.quantity || requestedQuantity <= 0 || requestedQuantity > availableQuantity;
      });
      
      if (hasInvalidQuantity) {
        toast.error("Please settle the quantity for current items before adding more");
        return;
      }
      
      // If all quantities are valid, add a new item
      const newItem = {
        id: items.length + 1,
        query: "",
        filteredSuggestions: [],
        itemName: "",
        itemid: "",
        iditem: "",
        quantity: "",
        hsnCode: "",
        cgst: "",
        sgst: "",
        igst: "",
        unitPrice: "",
        sellingPrice: "",
        grossAmount: "",
        discountRate: "",
        discountAmount: "",
        netAmount: "",
        taxRate: "",
        taxAmount: "",
        amount: "",
      };
      setItems((prevItems) => [...prevItems, newItem]);
    };
  
    const generateItemDetails = async () => {
      try {
        const response = await fetch(`${Item_fetch_url}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          // credentials: "include", // Add this to include cookies
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch item details");
        }
  
        const data = await response.json();
        // console.log(data.data)
  
        if (data && data.data && Array.isArray(data.data)) {
          setItemMainData(data.data);
          // Map only the customer names to the suggestions list
          setSuggestions(data.data.map(customer => ({
            name: customer.item_name || '',
            id: customer._id || '',
            itemid: customer.item_id || '',
          })));
        } else {
          setSuggestions([]);
        }
  
      } catch (error) {
        console.error("Error generating item details:", error);
      }
    }
  
    //------------------------ ITEM SUGGETION ---------------------------------------------------
  

    //------------------------- Customer Name----------------------------------------------------
  
    const [customerid, setCustomerid] = useState("")
    const [customerMainData, setCustomerMainData] = useState([]);
    const [customerSuggestionsList, setcustomerSuggestionsList] = useState([]);
    const [customerQuery, setCustomerQuery] = useState("");
    const [customerSuggestions, setCustomerSuggestions] = useState([]);
  
    useEffect(() => {
      generateCustomerDetails();
      generateItemDetails()
    }, []);
    useEffect(() => {
      if (customerQuery && customerid) {
  
        const filtered = customerMainData.filter((customer) =>
          customer.id === customerid
        );
  
        if (filtered.length > 0) {
          const customer = filtered[0];
          setFormData(prev => ({
            ...prev,
            // customerName: customer.contactPersonName || '',
            phone: customer.contactPhoneNumber || '',
            address: customer.personAddress || '',
            gstnumber: customer.gstNumber || '',
            state: customer.state || ''
          }));
        }
      }
    }, [customerQuery, customerid, customerMainData]);
  
  
    const generateCustomerDetails = async () => {
      try {
        const response = await fetch(`${Customer_Url}`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          // credentials: "include", // Add this to include cookies
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch customer details");
        }
  
        const data = await response.json();
  
        if (data && data.data && Array.isArray(data.data)) {
          setCustomerMainData(data.data);
          // Map only the customer names to the suggestions list
          setcustomerSuggestionsList(data.data.map(customer => ({
            name: customer.contactPersonName || '',
            email: customer.contactPersonEmail || '',
            id: customer.id || '',
          })).filter(customer => customer.name));
        } else {
          setcustomerSuggestionsList([]);
        }
  
      } catch (error) {
        console.error("Error generating customer details:", error);
      }
    }
  
    const handleCustomerSearch = (e) => {
      const userInput = e.target.value;
      setCustomerQuery(userInput);
      setFormData(prev => ({
        ...prev,
        customerName: userInput
      }));
  
      if (userInput) {
        const filtered = customerSuggestionsList.filter((customer) =>
          customer.name.toLowerCase().includes(userInput.toLowerCase())
        );
        setCustomerSuggestions(filtered);
      } else {
        setCustomerSuggestions([]);
      }
    };
  
  
    // Add customer select handler
    const handleCustomerSelect = (customer, id) => {
      setCustomerid(id);
      setCustomerQuery(customer);
      setFormData(prev => ({
        ...prev,
        customerName: customer
      }));
      setCustomerSuggestions([]);
    };
    //------------------------- Customer Name----------------------------------------------------
  
  
  
    const [billNumber, setBillNumber] = useState("");
  
  
   
  
    const deleteRow = (index) => {
      if (items.length > 1) {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
        calculateTotals(newItems);
      }
    };
    

    const handleFormDataChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value || "", // Ensure value is never undefined
      }));
    };
  
  
  
    //------------------------ CALCULATION ITEM-------------------------------------------------
    const calculateItemFields = (item, sourceField) => {
      if (sourceField === "amount" && item.amount) {
        const amount = parseFloat(item.amount) || 0;
        const quantity = parseFloat(item.quantity) || 1;
        const cgstRate = parseFloat(item.cgst) || 0;
        const sgstRate = parseFloat(item.sgst) || 0;
        const igstRate = parseFloat(item.igst) || 0;
        const discountRate = parseFloat(item.discountRate) || 0;
  
        // Calculate backwards from amount
        const totalTaxRate = cgstRate + sgstRate + igstRate;
        const netAmountWithTax = amount / (1 + totalTaxRate / 100);
        const taxAmount = amount - netAmountWithTax;
        const netAmount = netAmountWithTax;
        const grossAmount = netAmount / (1 - discountRate / 100);
        const discountAmount = grossAmount - netAmount;
        const unitPrice = grossAmount / quantity;
        const sellingPrice = grossAmount / quantity;

  
        return {
          grossAmount: grossAmount.toFixed(2),
          unitPrice: unitPrice.toFixed(2),
          sellingPrice: sellingPrice.toFixed(2),
          discountAmount: discountAmount.toFixed(2),
          netAmount: netAmount.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          amount: amount.toFixed(2),
        };
      } else {
        // Original forward calculation
        const quantity = parseFloat(item.quantity) || 0;
        const unitPrice = parseFloat(item.unitPrice) || 0;
        const sellingPrice = parseFloat(item.sellingPrice) || 0;
        const discountRate = parseFloat(item.discountRate) || 0;
        const cgstRate = parseFloat(item.cgst) || 0;
        const sgstRate = parseFloat(item.sgst) || 0;
        const igstRate = parseFloat(item.igst) || 0;
  
        const grossAmount = quantity * sellingPrice;
        const discountAmount = (grossAmount * discountRate) / 100;
        const netAmount = grossAmount - discountAmount;
  
        // Calculate total tax rate and amount using CGST, SGST, and IGST
        const totalTaxRate = cgstRate + sgstRate + igstRate;
        const taxAmount = (netAmount * totalTaxRate) / 100;
        const amount = netAmount + taxAmount;
  
        return {
          grossAmount: grossAmount.toFixed(2),
          discountAmount: discountAmount.toFixed(2),
          netAmount: netAmount.toFixed(2),
          taxRate: totalTaxRate.toFixed(2), // Add this line to update tax rate
          taxAmount: taxAmount.toFixed(2),
          amount: amount.toFixed(2),
        };
      }
    };
    //------------------------ CALCULATION-------------------------------------------------
  
  
  
  
    //------------------------ ITEM CHANGE LIST----------------------------------------------
    const handleItemChange = (index, e) => {
      const { name, value } = e.target;
      const newItems = [...items];
      
      // Update the item with the new value
      newItems[index] = {
        ...newItems[index],
        [name]: value,
      };
  
      // If the quantity field is being changed, check for insufficient inventory
      if (name === "quantity") {
        // Update the quantity immediately for better UX
        setItems(newItems);
        
        // Then check with a delay if it exceeds available stock
        setTimeout(() => {
          const currentItem = newItems[index];
          
          // Find the original item from itemMainData to get the actual available quantity
          const originalItem = itemMainData.find(item => item._id === currentItem.iditem);
          
          if (!originalItem) return;
          
          const availableQuantity = parseInt(originalItem.quantity || 0);
          const requestedQuantity = parseInt(value || 0);
          
          if (requestedQuantity > availableQuantity) {
            // Show insufficient item modal
            setInsufficientItemIndex(index);
            setInsufficientItemData({
              ...currentItem,
              ...originalItem,
              availableQuantity: originalItem.quantity,
              requestedQuantity: value
            });
            setInsufficientItemModal(true);
          }
        }, 2000); // 2 second delay
      }
      
      // Continue with the existing calculation logic
      if (
        [
          "quantity",
          "unitPrice",
          "sellingPrice",
          "discountRate",
          "cgst",
          "sgst",
          "igst",
          "amount",
        ].includes(name)
      ) {
        const computed = calculateItemFields(newItems[index], name);
        newItems[index] = {
          ...newItems[index],
          ...computed,
        };
      }
      
      setItems(newItems);
      calculateTotals(newItems);
    };

    const checkItemInMNS = async () => {
      if (!insufficientItemData?.hsnCode) {
        toast.error("HSN Code not available for this item");
        return;
      }
      
      setIsLoadingSnigdhaItem(true);
      try {
        const response = await axios.get(
          `${backendDomainA}/api/v1/inventory/current-items/hsn/${insufficientItemData.hsnCode}`
        );
        
        if (response.data.success && response.data.data.length > 0) {
          setSnigdhaItem(response.data.data[0]);
          setShowAddForm(true);
        } else {
          toast.error("Item not found in MNS inventory");
        }
      } catch (error) {
        toast.error("Failed to fetch item from MNS inventory");
      } finally {
        setIsLoadingSnigdhaItem(false);
      }
    };

    const addProductToSnigdha = async () => {
      if (!snigdhaItem || !quantityToAdd || parseInt(quantityToAdd) <= 0) {
        toast.error("Please enter a valid quantity");
        return;
      }
  
      if (parseInt(quantityToAdd) > parseInt(snigdhaItem.quantity)) {
        toast.error("Requested quantity exceeds available quantity in MNS inventory");
        return;
      }
  
      setIsLoadingSnigdhaItem(true);
      try {
        // Make API call to transfer inventory from MNS to Snigdha
        const transferData = {
          hsnCode: insufficientItemData.hsnCode,
          quantity: quantityToAdd
        };
        
        // Call the API endpoint for transferring inventory
        const response = await axios.post(
          `${backendDomainA}/api/v1/inventory/snig-transfer-by-hsn`, 
          transferData
        );
        
        if (response.data.success) {
          toast.success(`Successfully added ${quantityToAdd} units to Snigdha inventory`);
          
          // Update the available items list with the new quantity
          const updatedItemMainData = [...itemMainData];
          const itemIndex = updatedItemMainData.findIndex(item => item._id === insufficientItemData.iditem);
          
          if (itemIndex !== -1) {
            updatedItemMainData[itemIndex] = {
              ...updatedItemMainData[itemIndex],
              quantity: parseInt(updatedItemMainData[itemIndex].quantity) + parseInt(quantityToAdd)
            };
            setItemMainData(updatedItemMainData);
          }
          
          // Reset the form
          setShowAddForm(false);
          setQuantityToAdd("");
          setSnigdhaItem(null);
          
          // Close the modal
          setInsufficientItemModal(false);
          setInsufficientItemIndex(null);
          setInsufficientItemData(null);
        } else {
          toast.error(response.data.message || "Failed to transfer inventory");
        }
      } catch (error) {
        toast.error("Failed to add product to Snigdha inventory");
      } finally {
        setIsLoadingSnigdhaItem(false);
      }
    };

    const handleCancelInsufficientItem = () => {
      // Reset the quantity input field
      if (insufficientItemIndex !== null) {
        const updatedItems = [...items];
        updatedItems[insufficientItemIndex] = {
          ...updatedItems[insufficientItemIndex],
          quantity: "",
        };
        
        setItems(updatedItems);
        calculateTotals(updatedItems);
      }
      
      // Close the modal and reset all related states
      setInsufficientItemModal(false);
      setInsufficientItemIndex(null);
      setInsufficientItemData(null);
      setSnigdhaItem(null);
      setShowAddForm(false);
      setQuantityToAdd("");
    };



    //------------------------ ITEM CHANGE LIST----------------------------------------------
  
  
    //------------------------ calculateTotals----------------------------------------------
    const calculateTotals = (currentItems = items) => {
      const totalGrossAmount = currentItems?.reduce(
        (sum, item) => sum + parseFloat(item.grossAmount || 0),
        0
      );
      const totalDiscount = currentItems?.reduce(
        (sum, item) => sum + parseFloat(item.discountAmount || 0),
        0
      );
      const totalTaxableAmount = currentItems?.reduce(
        (sum, item) => sum + parseFloat(item.netAmount || 0),
        0
      );
      const totalTax = currentItems?.reduce(
        (sum, item) => sum + parseFloat(item.taxAmount || 0),
        0
      );
      const calculatedGrandTotal = totalTaxableAmount + totalTax;
  
      setTotals({
        discount: totalDiscount.toFixed(2),
        taxableAmount: totalTaxableAmount.toFixed(2),
        taxAmount: totalTax.toFixed(2),
        grandTotal: calculatedGrandTotal.toFixed(2),
      });
    };
    //------------------------ calculateTotals----------------------------------------------
  
  
  
    //----------------------------- DATA SAVE-------------------------------------------
    const handleSave = async () => {
      try {
        
        if (!customerQuery) {
          toast.error("Please enter customer name");
          return;
        }
        if (!items[0].itemName || !items[0].quantity || !items[0].unitPrice ||!items[0].sellingPrice) {
          toast.error("Please fill in at least one item with name, quantity, and unit price");
          return;
        }
        //   
        const payload = {
          receiverDetails: {
            name: customerQuery,
            state: formData.state,
            phoneNumber: formData.phone,
            address: formData.address,
            gstin: formData.gstnumber,
            id: String(formData.id),
          },
          invoiceNumber: billNumber,
          date: formData.date,
          customerName: customerQuery,
          billFormat: formData.billFormat,
          taxGroup: formData.taxGroup,
          paymentType: formData.paymentType,
          location: formData.location || "",
          priceGroup: formData.priceGroup || "",
          items: items.map((item) => ({
            id: item.itemid,
            itemName: item.itemName || "",
            quantity: parseFloat(item.quantity) || 0,
            unit: item.unit || "",
            hsnCode: item.hsnCode || "",
            cgst: parseFloat(item.cgst) || 0,
            sgst: parseFloat(item.sgst) || 0,
            igst: parseFloat(item.igst) || 0,
            unitPrice: parseFloat(item.unitPrice) || 0,
            sellingPrice: parseFloat(item.sellingPrice) || 0,
            grossAmount: parseFloat(item.grossAmount) || 0,
            discountRate: parseFloat(item.discountRate) || 0,
            discountAmount: parseFloat(item.discountAmount) || 0,
            netAmount: parseFloat(item.netAmount) || 0,
            taxRate: parseFloat(item.taxRate) || 0,
            taxAmount: parseFloat(item.taxAmount) || 0,
            amount: parseFloat(item.amount) || 0,
          })),
          discount: parseFloat(totals.discount) || 0,
          taxableAmount: parseFloat(totals.taxableAmount) || 0,
          taxAmount: parseFloat(totals.taxAmount) || 0,
          grandTotal: parseFloat(totals.grandTotal) || 0,
       
        };
    
        const response = await fetch(New_Url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
     
        
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.data?.message || "Failed to save invoice");
        }
    
        const data = await response.json();
        console.log("res from invoice in snigdha : ", data);
        if (data.success === true) {
          toast.success(data.message);
          resetForm();
          // navigate("SnigdhaBillingAddInvoicePage"); // Navigate to view page after successful save
        }
      } catch (error) {
        console.error("Save Error:", error);
        toast.error(error.message || "Error saving invoice");
      }
    };  //----------------------------- DATA SAVE-------------------------------------------
  
  
  
  
  
  
    //--------------------------- Reset data---------------------------------
    const resetForm = () => {
      setFormData({
        billFormat: "",
        date: "",
        taxGroup: "",
        // paymentType: "",
        customerName: "",
        invoiceNumber: "",
        priceGroup: "",
        location: "",
        name: "",
        state: "",
        phone: "",
        address: "",
        gstnumber: "",
      });
    
      setItems([
        {
          id: 1,
          query: "",
          filteredSuggestions: [], // Ensure this is always an array
          itemName: "",
          itemid: "",
          iditem: "",
          quantity: "",
          hsnCode: "",
          cgst: "",
          sgst: "",
          igst: "",
          unitPrice: "",
          sellingPrice: "",
          grossAmount: "",
          discountRate: "",
          discountAmount: "",
          netAmount: "",
          taxRate: "",
          taxAmount: "",
          amount: "",
        },
      ]);
    
      setTotals({
        discount: "0.00",
        taxableAmount: "0.00",
        taxAmount: "0.00",
        grandTotal: "0.00",
      });
    };
  
    //--------------------------- Reset data---------------------------------
  
  
  
  
  
    //------------------------- Download PDF----------------------------------
    const handleDownload = async () => {
      try {
        // Validate required fields
        if (!customerQuery) {
          toast.error("Please enter customer name");
          return;
        }
        if (!items[0].itemName || !items[0].quantity || !items[0].unitPrice  ||!items[0].sellingPrice) {
          toast.error(
            "Please fill in at least one item with name, quantity, and unit price"
          );
          return;
        }
  
        const payload = {
          receiverDetails: {
            name: customerQuery,
            state: formData.state,
            phoneNumber: formData.phone,
            address: formData.address,
            gstin: formData.gstnumber,
            id: String(formData.id),
          },
          invoiceNumber: billNumber,
          date: formData.date,
          customerName: customerQuery,
          billFormat: formData.billFormat,
          taxGroup: formData.taxGroup,
          paymentType: formData.paymentType,
          location: formData.location || "",
          priceGroup: formData.priceGroup || "",
          items: items.map((item) => ({
            // _id: itemid,
            id: item.itemid,
            itemName: item.itemName || "",
            quantity: parseFloat(item.quantity) || 0,
            unit: item.unit || "",
            hsnCode: item.hsnCode || "",
            cgst: parseFloat(item.cgst) || 0,
            sgst: parseFloat(item.sgst) || 0,
            igst: parseFloat(item.igst) || 0,
            unitPrice: parseFloat(item.unitPrice) || 0,
            sellingPrice: parseFloat(item.sellingPrice) || 0,
            grossAmount: parseFloat(item.grossAmount) || 0,
            discountRate: parseFloat(item.discountRate) || 0,
            discountAmount: parseFloat(item.discountAmount) || 0,
            netAmount: parseFloat(item.netAmount) || 0,
            taxRate: parseFloat(item.taxRate) || 0,
            taxAmount: parseFloat(item.taxAmount) || 0,
            amount: parseFloat(item.amount) || 0,
          })),
         
            discount: parseFloat(totals.discount) || 0,
            taxableAmount: parseFloat(totals.taxableAmount) || 0,
            taxAmount: parseFloat(totals.taxAmount) || 0,
            grandTotal: parseFloat(totals.grandTotal) || 0,
         
        };
        await PdfFormate(payload);
        
        toast.success("Invoice downloaded successfully");
      } catch (error) {
        console.error("PDF Generation Error:", error);
        toast.error(
          "Error downloading invoice: " + (error.message || "Unknown error")
        );
      }
    };
  
    //------------------------- Download PDF----------------------------------
  
  
  
  
    return (
      <div className="p-4">
        <div className="bg-white px-5 py-5 shadow-lg rounded-xl">
          {/* Header Controls */}
          <div className="flex justify-between items-center mb-4 text-sm">
            <div className="flex gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Bill Format</label>
                <select
                  className="border p-1 w-40"
                  name="billFormat"
                  value={formData.billFormat} // Controlled input
                  onChange={handleFormDataChange}
                >
                  <option value="">Select Bill Format</option>
                  <option value="Standard">Standard</option>
                  <option value="Sales">Sales</option>
                  <option value="Credit Memo">Credit Memo</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Invoice</label>
                <input
                  type="text"
                  className="border p-1"
                  name="billNumber"
                  value={formData.billNumber}
                  onChange={(e)=>setBillNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  className="border p-1"
                  name="date"
                  value={formData.date}
                  onChange={handleFormDataChange}
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Tax Group</label>
                <select
                  className="border p-1 w-32"
                  name="taxGroup"
                  value={formData.taxGroup} // Controlled input
                  onChange={handleFormDataChange}
                >
                  <option value="">Select Tax Group</option>
                  <option value="State Tax">State Tax</option>
                  <option value="Other Tax">Other Tax</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentType"
                  value="cash"
                  checked={formData.paymentType === "cash"}
                  onChange={handleFormDataChange}
                  className="mr-2"
                />
                Cash
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentType"
                  value="credit"
                  checked={formData.paymentType === "credit"}
                  onChange={handleFormDataChange}
                  className="mr-2"
                />
                Credit
              </label>
            </div>
          </div>
  
          {/* Bill Info */}
          <div className="flex gap-4 mb-4 text-sm">
           
            <div className="flex-1">
              <label className="block text-gray-600 mb-1">Customer Name</label>
              <input
                type="text"
                className="border p-1 w-full"
                name="customerName"
                value={customerQuery}
                onChange={handleCustomerSearch}
                placeholder="Search customer..."
              />
              {customerSuggestions.length > 0 && (
                <ul className="absolute w-64 bg-white border border-gray-200 rounded-md mt-1 shadow-md z-10">
                  {customerSuggestions.map((customer, index) => (
                    <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-blue-100"
                      onClick={() => handleCustomerSelect(customer.name, customer.id)}
                    >
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs text-gray-500">{customer.email}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Price Group</label>
              <select
                className="border p-1 w-40"
                name="priceGroup"
                value={formData.priceGroup}
                onChange={handleFormDataChange}
              >
                <option>Select Group</option>
                <option>All</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Location</label>
              <select
                className="border p-1 w-40"
                name="location"
                value={formData.location}
                onChange={handleFormDataChange}
              >
                <option>Select Location</option>
                <option>Kolkata</option>
                <option>Deganga</option>
              </select>
            </div>
          </div>
  
          {/* Customer Details  */}
          {formData.paymentType === "cash" ? (
            <div className="w-full">
              <div className="flex flex-col md:flex-row gap-4 mb-4 text-sm">
                {/* Email */}
                <div className="w-full">
                  <label className="block text-gray-600 mb-1">
                    Customer State
                  </label>
                  <input
                    type="text"
                    className="border p-2 w-full"
                    name="state"
                    value={formData.email}
                    onChange={handleFormDataChange}
                    placeholder="Enter State"
                  />
                </div>
  
                {/* Phone */}
                <div className="w-full">
                  <label className="block text-gray-600 mb-1">
                    Customer Phone No.
                  </label>
                  <input
                    type="tel"
                    className="border p-2 w-full"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormDataChange}
                    placeholder="Enter phone number"
                  />
                </div>
  
                {/* Address */}
                <div className="w-full">
                  <label className="block text-gray-600 mb-1">
                    Customer Address
                  </label>
                  <input
                    type="text"
                    className="border p-2 w-full"
                    name="address"
                    value={formData.address}
                    onChange={handleFormDataChange}
                    placeholder="Enter address"
                  />
                </div>
                {/* Address */}
                <div className="w-full">
                  <label className="block text-gray-600 mb-1">
                    Customer GST Number
                  </label>
                  <input
                    type="text"
                    className="border p-2 w-full"
                    name="gstnumber"
                    value={formData.gstnumber}
                    onChange={handleFormDataChange}
                    placeholder="Enter GST Number"
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
  
          {/* Items Table */}
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                <th className="border border-gray-300 w-[70px] font-normal">
                  SL.No
                </th>
                <th className="border border-gray-300 p-1 font-normal">
                  Item Name
                </th>
                <th className="border border-gray-300 p-1 font-normal w-20">
                  Quantity
                </th>
                <th className="border border-gray-300 p-1 font-normal w-20">
                  Unit
                </th>
                <th className="border border-gray-300 p-1 font-normal w-20">
                  HSN Code
                </th>
                <th className="border border-gray-300 p-1 font-normal w-20">
                  CGST
                </th>
                <th className="border border-gray-300 p-1 font-normal w-20">
                  IGST
                </th>
                <th className="border border-gray-300 p-1 font-normal w-20">
                  SGST
                </th>
                <th className="border border-gray-300 p-1 font-normal w-20">
                  Unit Price
                </th>
                <th className="border border-gray-300 p-1 font-normal w-20">
                  Selling Price
                </th>
                <th className="border border-gray-300 p-1 font-normal w-24">
                  Gross Amount
                </th>
                <th className="border border-gray-300 p-1 font-normal w-24">
                  Net Amount
                </th>
                <th className="border border-gray-300 p-1 font-normal w-20">
                  Disc. Rate
                </th>
                <th className="border border-gray-300 p-1 font-normal w-24">
                  Disc. Amount
                </th>
                <th className="border border-gray-300 p-1 font-normal w-20">
                  Tax Rate
                </th>
                <th className="border border-gray-300 p-1 font-normal w-24">
                  Tax Amount
                </th>
                <th className="border border-gray-300 p-1 font-normal w-24">
                  Amount
                </th>
                <th className="border border-gray-300 p-1 font-normal w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-1 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-0">
                    {/* <input
                      type="text"
                      className="w-full p-1 border-none outline-none"
                      name="itemName" // Changed from itemDescription to itemName
                      value={item.itemName}
                      onChange={(e) => handleItemChange(index, e)}
                    /> */}
  
                    <input
                      type="text"
                      className="w-30 p-2  border-gray-300 outline-none"
                      placeholder="Search..."
                      value={item.query}
                      onChange={(e) => handleItemQueryChange(index, e)}
                    />
                    {item.filteredSuggestions.length > 0 && (
                  <ul className="absolute w-auto bg-white border border-gray-200 rounded-md mt-1 shadow-md z-10">
                    {item.filteredSuggestions.map((suggestion, idx) => (
                      console.log("sugge: ",suggestion),
                      <li
                        key={idx}
                        className="p-2 cursor-pointer hover:bg-blue-100"
                        onClick={() => handleSelect(index, suggestion)}
                      >
                        {suggestion?.name} (quantity: {suggestion?.quantity}) (sellingPrice: {suggestion?.sellingPrice})
                      </li>
                    ))}
                  </ul>
                )}
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="number"
                      className="w-full p-1 border-none outline-none"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <select
                      className="p-1 w-30 outline-none"
                      name="unit"
                      value={item.unit}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    >
                      <option key="hi" value=""  >
                          select a unit
                        </option>
                      
                      {selectedUnit?.map((unit) => (
                       
                        
                      <option key={unit._id} value={unit.name}>
                        {unit.name}
                      </option>

                    ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="text"
                      className="w-full p-1 border-none outline-none"
                      name="hsnCode"
                      value={item.hsnCode}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      className="w-full p-1 border-none outline-none"
                      name="cgst"
                      value={item.cgst}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      className="w-full p-1 border-none outline-none"
                      name="igst"
                      value={item.igst}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      className="w-full p-1 border-none outline-none"
                      name="sgst"
                      value={item.sgst}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="number"
                      className="w-full p-1 border-none outline-none"
                      name="unitPrice"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="number"
                      className="w-full p-1 border-none outline-none"
                      name="sellingPrice"
                      value={item.sellingPrice}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="number"
                      className="w-full p-1 border-none  outline-none"
                      name="grossAmount"
                      value={item.grossAmount}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="number"
                      className="w-full p-1 border-none outline-none"
                      value={item.netAmount}
                      name="netAmount"
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="number"
                      className="w-full p-1 border-none outline-none"
                      name="discountRate"
                      value={item.discountRate}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="number"
                      className="w-full p-1 border-none outline-none"
                      value={item.discountAmount}
                      name="discountAmount"
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="number"
                      className="w-full p-1 border-none outline-none"
                      name="taxRate"
                      value={item.taxRate}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="number"
                      className="w-full p-1 border-none  outline-none"
                      value={item.taxAmount}
                      name="taxAmount"
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="number"
                      className="w-full p-1 border-none outline-none"
                      name="amount"
                      value={item.amount}
                      onChange={(e) => {
                        handleItemChange(index, {
                          target: {
                            name: "amount",
                            value: e.target.value,
                          },
                        });
                      }}
                    />
                  </td>
                  <td className="border border-gray-300 p-0.5 flex gap-1.5">
                    {items.length > 1 && (
                      <button
                        onClick={() => deleteRow(index)}
                        className="w-1/2 h-full flex cursor-pointer items-center justify-center text-red-600 hover:text-red-800 font-bold text-xl"
                      >
                        -
                      </button>
                    )}
   
  {index === items.length - 1 && (
                <td>
                  <button
                    onClick={addNewRow}
                    className="w-1/2 h-full flex items-center cursor-pointer justify-center text-blue-600 hover:text-blue-800 font-bold text-xl"
                  >
                    +
                  </button>
                </td>
              )}
  
  
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
          {/* Totals Section */}
          <div className="flex justify-between mt-4">
            <div className="flex-1"></div>
            <div className="w-72">
              {/* In the Totals Section, update the discount display */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-right">Discount:</div>
                <input
                  type="number"
                  className="border p-1 outline-none"
                  value={totals.discount}
                  readOnly
                />
                <div className="text-right">Taxable Amount:</div>
                <input
                  type="number"
                  className="border p-1 bg-gray-50 outline-none"
                  value={totals.taxableAmount}
                  readOnly
                />
                <div className="text-right">Tax Amount:</div>
                <input
                  type="number"
                  className="border p-1 bg-gray-50 outline-none"
                  value={totals.taxAmount}
                  readOnly
                />
                <div className="text-right font-bold">Grand Total:</div>
                <input
                  type="number"
                  className="border p-1 bg-gray-50 font-bold outline-none"
                  value={totals.grandTotal}
                  readOnly
                />
              </div>
            </div>
          </div>
  
          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleSave}
              className="px-12 py-1 text-lg cursor-pointer bg-gray-100 border hover:bg-gray-200"
            >
              Save
            </button>
            {/* <button
              onClick={handleDownload}
              className="px-4 py-1 bg-gray-100 border hover:bg-gray-200"
            >
              Download
            </button> */}
          </div>
        </div>
        {/* Add the insufficient item modal */}
      {insufficientItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-red-600">Insufficient Stock</h3>
              <p className="mt-2 text-gray-700">
                Insufficient Item, please add from MNS inventory.
              </p>
              {insufficientItemData && (
                <div className="mt-3 p-3 bg-gray-100 rounded-md">
                  <p><span className="font-semibold">Item :</span> {insufficientItemData.itemName}</p>
                  <p><span className="font-semibold">HSN Code :</span> {insufficientItemData.hsnCode}</p>
                  <p><span className="font-semibold">Available Quantity :</span> {insufficientItemData.availableQuantity}</p>
                  <p><span className="font-semibold">Requested Quantity :</span> {insufficientItemData.requestedQuantity}</p>
                </div>
              )}
              
              {!showAddForm ? (
                <div className="mt-4">
                  <button
                    onClick={checkItemInMNS}
                    disabled={isLoadingSnigdhaItem}
                    className="w-full px-4 cursor-pointer py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                  >
                    {isLoadingSnigdhaItem ? "Checking..." : "Check Item in MNS Inventory"}
                  </button>
                </div>
              ) : (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold mb-2">Item Found in MNS Inventory</h4>
                  {snigdhaItem && (
                    <div className="bg-green-50 p-3 rounded-md mb-3">
                      <p><span className="font-semibold">Item Name:</span> {snigdhaItem.item_name}</p>
                      <p><span className="font-semibold">Available Quantity:</span> {snigdhaItem.quantity}</p>
                      <p><span className="font-semibold">Unit Price:</span> ₹{snigdhaItem.unit_prize}</p>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <label htmlFor="quantityToAdd" className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity to Add:
                    </label>
                    <input
                      type="number"
                      id="quantityToAdd"
                      value={quantityToAdd}
                      onChange={(e) => setQuantityToAdd(e.target.value)}
                      placeholder="Enter quantity"
                      className="border p-2 w-full rounded"
                      min="1"
                      max={snigdhaItem?.quantity || 1}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={addProductToSnigdha}
                      disabled={isLoadingSnigdhaItem}
                      className="flex-1 px-4 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-green-300"
                    >
                      {isLoadingSnigdhaItem ? "Adding..." : "Add to Snigdha Inventory"}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setSnigdhaItem(null);
                        setQuantityToAdd("");
                      }}
                      className="px-4 py-2 cursor-pointer bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 border-t pt-4 mt-4">
              <button
                onClick={handleCancelInsufficientItem}
                className="px-4 py-2 cursor-pointer bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    );
  };