import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PdfFormate from "./ViewPDF";
import { backendDomainA, backendDomainS } from "../../../common";
import axios from "axios";

const New_Url = import.meta.env.VITE_REACT_INVOICE;
const Item_fetch_url = import.meta.env.VITE_REACT_FETCH_ITEMS_SIN;
const Customer_Url = import.meta.env.VITE_REACT_CUSTOMER_FETCH;

const invoiceFetchUrl = import.meta.env.VITE_BASE_URL_C;

const AddInvoicePageS = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Create New Invoice for Snigdha{" "}
      </h1>
      <InvoiceForm />
    </div>
  );
};

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
  const [lastSequence, setLastSequence] = useState(0);
  const [userEditedTransport, setUserEditedTransport] = useState(false);

  

  // for checking qunatity

  const [formData, setFormData] = useState({
    date: "",
    taxGroup: "State Tax",
    paymentType: "cash",
    customerName: "",
    invoiceNumber: "",
    location: "",
    vendorCode: "",
    poNumber: "",
    poDate: "",
    state: "",
    phone: "",
    address: "",
    deliveryAddress: "",
    gstnumber: "",
    transportationCharges: 0,
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
      description: "",
      quantity: "",
      hsnCode: "",
      uom: "",
      cgst: "",
      sgst: "",
      igst: "",
      gst: "",
      group:"",
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
  const [itemid, setitemid] = useState("");
  const [iditem, setidItem] = useState([]);

  const [invoiceData, setInvoiceData] = useState([]);
  // console.log("invoicedata : ", invoiceData);
  // console.log("invoicedata's length : ", invoiceData.length);

  const fetchInvoiceDetails = async () => {
    try {
      const response = await fetch(
        `${invoiceFetchUrl}/api/v2/invoice/invoices`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const jsonData = await response.json();
      console.log("response", jsonData);
      if (!response.ok) {
        throw new Error(jsonData?.message || "Failed to fetch invoices");
      }
      setInvoiceData(jsonData.data);
      if (jsonData.data && Array.isArray(jsonData.data)) {
        localStorage.setItem("invoiceCount", jsonData.data.length.toString());}
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error(error.message || "Error fetching invoices");
    }
    // credentials: "include", // Add this to include cookies
  };

  const generateInvoiceNumber = (paymentType) => {
    const currentDate = new Date();
    const currentYear = currentDate?.getFullYear().toString();
    const previousYear = (currentDate?.getFullYear() - 1).toString().slice(2);
    const nextYear = (currentDate?.getFullYear() + 1).toString().slice(2);
    // const yearFormat = `${previousYear}-${currentYear}`;
    const yearFormat = `${currentYear}-${nextYear}`;

    
    let invoiceCount = 0;

    const storedCount = localStorage.getItem("invoiceCount");
    if (storedCount && !isNaN(parseInt(storedCount))) {
      invoiceCount = parseInt(storedCount);
    } 
    else if (invoiceData && Array.isArray(invoiceData)) {
      invoiceCount = invoiceData.length;
    }

    // console.log("Using invoice count:", invoiceCount);

    const invoiceLength = invoiceData?.length;
    // console.log("invoiceLength", invoiceLength);

    const prefix = paymentType === "cash" ? "CASH" : "SE";

    return `${prefix}/${Number(invoiceCount) + 1}/${yearFormat}`;
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
      // console.log("item data",data)

      if (data && data.data && Array.isArray(data.data)) {
        setItemMainData(data.data);
        // Map only the customer names to the suggestions list
        setSuggestions(
          data.data.map((customer) => ({
            name: customer.item_name || "",
            id: customer._id || "",
            itemid: customer.item_id || "",
          }))
        );
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error generating item details:", error);
    }
  };

  const handleItemQueryChange = (index, e) => {
    const userInput = e.target.value;
    const newItems = [...items];
    newItems[index].query = userInput;

    if (userInput) {
      const filtered = itemMainData
        .filter((suggestion) =>
          suggestion.item_name.toLowerCase().includes(userInput.toLowerCase())
        )
        .map((suggestion) => ({
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

  const [itemStates, setItemStates] = useState([
    {
      query: "",
      itemid: "",
      iditem: "",
    },
  ]);

  const handleSelect = (index, suggestion) => {
    const selectedItem = itemMainData.find(
      (item) => item._id === suggestion.id
    );
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      query: suggestion.name,
      itemName: suggestion.name,
      itemid: suggestion.itemid,
      iditem: suggestion.id,
      hsnCode: selectedItem?.hsnCode || "",
      uom: selectedItem?.uom || "",
      group: selectedItem?.group || "",
      cgst: selectedItem?.cgst || "0",
      sgst: selectedItem?.sgst || "0",
      igst: selectedItem?.igst || "0",
      gst: selectedItem?.gst || "0",
      unitPrice: selectedItem?.unit_prize || "",
      sellingPrice: selectedItem?.sellingPrice || "",
      filteredSuggestions: [],
    };
    setItems(newItems);
  };

  

  useEffect(() => {

    fetchInvoiceDetails();
    
    const storedCount = localStorage.getItem("invoiceCount");
    if (storedCount && !isNaN(parseInt(storedCount))) {
      const initialInvoiceNumber = generateInvoiceNumber(formData.paymentType || "cash");
      setBillNumber(initialInvoiceNumber);
    }
  }, []);

  useEffect(() => {
    if (query && itemid) {
      const filtered = itemMainData.filter(
        (customer) => customer._id === itemid
      );
      //   console.log(query,itemid ,filtered)
      if (filtered.length > 0) {
        const selectedItem = filtered[0];
        setItems((prev) => [
          {
            ...prev[0],
            itemName: selectedItem.item_name || "",
            hsnCode: selectedItem.hsnCode || "",
            uom: selectedItem.uom || "",
            group: selectedItem.group || "",
            cgst: selectedItem.cgst ? selectedItem.cgst : "0",
            sgst: selectedItem.sgst ? selectedItem.sgst : "0",
            igst: selectedItem.gst ? selectedItem.gst : "0",
            gst: selectedItem.gst ? selectedItem.gst : "0",
            unitPrice: selectedItem.unit_prize || "",
            sellingPrice: selectedItem?.sellingPrice || "",
          },
        ]);
      }
    }
    // fetchInvoiceDetails();
  }, [query, itemid, itemMainData]);

  const addNewRow = () => {
    // Check if any item has an invalid or empty quantity
    const hasInvalidQuantity = items.some((item) => {
      if (!item.itemName) return false; // Skip check for items that haven't been selected yet

      // Find the original item to get the available quantity
      const originalItem = itemMainData.find(
        (availableItem) => availableItem._id === item.iditem
      );

      if (!originalItem) return false;

      const availableQuantity = parseInt(originalItem.quantity || 0);
      const requestedQuantity = parseInt(item.quantity || 0);

      // Check if quantity is empty or exceeds available
      return (
        !item.quantity ||
        requestedQuantity <= 0 ||
        requestedQuantity > availableQuantity
      );
    });

    if (hasInvalidQuantity) {
      toast.error(
        "Please settle the quantity for current items before adding more"
      );
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
      uom: "",
      group: "",
      cgst: "",
      sgst: "",
      igst: "",
      gst: "",
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

  //------------------------ ITEM SUGGETION ---------------------------------------------------

  //------------------------- Customer Name----------------------------------------------------

  const [customerid, setCustomerid] = useState("");
  const [customerMainData, setCustomerMainData] = useState([]);
  const [customerSuggestionsList, setcustomerSuggestionsList] = useState([]);
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  // console.log("customerMainData", customerMainData);

  useEffect(() => {
    generateCustomerDetails();
    generateItemDetails();
  }, []);
  useEffect(() => {
    if (customerQuery && customerid) {
      const filtered = customerMainData.filter(
        (customer) => customer.id === customerid
      );

      if (filtered.length > 0) {
        const customer = filtered[0];
        setFormData((prev) => ({
          ...prev,
          // customerName: customer.contactPersonName || '',
          phone: customer.companyNumber || "",
          address: customer.companyAddress || "",
          deliveryAddress: customer.deliveryAddress || "",
          gstnumber: customer.gstNumber || "",
          state: customer.state || "",
          location: customer.location || "",
          // vendorCode: customer.vendorCode || "",
        }));
      }
    }
    // fetchInvoiceDetails();
  }, [customerQuery, customerid, customerMainData]);

  const generateCustomerDetails = async () => {
    try {
      const response = await fetch(`${Customer_Url}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // credentials: "include", // Add this to include cookies
      });

      if (!response.ok) {
        throw new Error("Failed to fetch customer details");
      }

      const data = await response.json();
      // console.log("data",data);

      if (data && data.data && Array.isArray(data.data)) {
        setCustomerMainData(data.data);
        // Map only the customer names to the suggestions list
        setcustomerSuggestionsList(
          data.data
            .map((customer) => ({
              name: customer.companyName || "",
              email: customer.companyEmail || "",
              gst: customer.gstIn || "",
              id: customer.id || "",
            }))
            .filter((customer) => customer.name)
        );
      } else {
        setcustomerSuggestionsList([]);
      }
    } catch (error) {
      console.error("Error generating customer details:", error);
    }
  };

  const handleCustomerSearch = (e) => {
    const userInput = e.target.value;
    setCustomerQuery(userInput);
    setFormData((prev) => ({
      ...prev,
      customerName: userInput,
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
    setFormData((prev) => ({
      ...prev,
      customerName: customer,
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
    const newFormData = {
      ...formData,
      [name]: value,
    };
    if (name === "paymentType") {
      const newInvoiceNumber = generateInvoiceNumber(value);
      setBillNumber(newInvoiceNumber);
      setLastSequence((prev) => prev + 1);
    }
    setFormData(newFormData);
    // if (name === "transportationCharges") {
    //   setUserEditedTransport(true); 
    //   const transportCharges = parseFloat(value) || 0;
    //   const currentItems = [...items];
    //   const totals = currentItems.reduce(
    //     (acc, item) => ({
    //       grossAmount: acc.grossAmount + (parseFloat(item.grossAmount) || 0),
    //       discount: acc.discount + (parseFloat(item.discountAmount) || 0),
    //       taxableAmount: acc.taxableAmount + (parseFloat(item.netAmount) || 0),
    //       taxAmount: acc.taxAmount + (parseFloat(item.taxAmount) || 0),
    //     }),
    //     {
    //       grossAmount: 0,
    //       discount: 0,
    //       taxableAmount: 0,
    //       taxAmount: 0,
    //     }
    //   );

    //   const grandTotal =
    //     totals.taxableAmount + totals.taxAmount + transportCharges;
    //     calculateTotals();
    //   setTotals({
    //     discount: totals.discount.toFixed(2),
    //     taxableAmount: totals.taxableAmount.toFixed(2),
    //     taxAmount: totals.taxAmount.toFixed(2),
    //     grandTotal: grandTotal.toFixed(2),
    //   });
    // }

    if (name === "transportationCharges") {
      const updatedFormData = {
        ...formData,
        transportationCharges: value
      };

      setTimeout(() => {
        const baseAmount = parseFloat(totals.taxableAmount) + parseFloat(totals.taxAmount);
        const transportCharges = Number(value) || 0;
        const grandTotal = baseAmount + transportCharges;
        
        setTotals(prev => ({
          ...prev,
          grandTotal: grandTotal.toFixed(2)
        }));
      }, 0);
      
    }
      
  };

  //------------------------ CALCULATION ITEM-------------------------------------------------
  const calculateItemFields = (item, changedField) => {
    if (
      [
        "quantity",
        "unitPrice",
        "sellingPrice",
        "discountRate",
        "cgst",
        "sgst",
        "igst",
        "gst",
      ].includes(changedField)
    ) {

      const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const sellingPrice = parseFloat(item.sellingPrice) || 0;
    const discountRate = parseFloat(item.discountRate) || 0;
      const grossAmount = quantity * sellingPrice;
      const discountAmount = (grossAmount * discountRate) / 100;
      const netAmount = grossAmount - discountAmount

      // Handle tax rates based on tax group
      let totalTaxRate = 0;
      let taxAmount = 0;

         if (formData.taxGroup === "State Tax") {
          const gstRate = parseFloat(item.gst) || 0;
          totalTaxRate = gstRate;
          taxAmount = (netAmount * gstRate) / 100;
        } else if (formData.taxGroup === "Other Tax") {
          const igstRate = parseFloat(item.igst) || 0;
          totalTaxRate = igstRate;
          taxAmount = (netAmount * igstRate) / 100;
        }

      // const grossAmount = quantity * sellingPrice;
      // const discountAmount = (grossAmount * discountRate) / 100;
      // const netAmount = grossAmount - discountAmount;
      // if(formData.taxGroup === "State Tax"){
      //   const taxAmount = (grossAmount * totalTaxRate) / 100;
      // }
      // else if(formData.taxGroup === "Other Tax"){
      //   const taxAmount = (grossAmount * totalTaxRate) / 100;
      // }
      // else{
      //   const taxAmount = null;
      // }
      const amount = netAmount + (formData.taxGroup === "No Tax" ? 0 : taxAmount);

      return {
        grossAmount: grossAmount.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        netAmount: netAmount.toFixed(2),
        taxRate: formData.taxGroup === "No Tax" ? "0.00" : totalTaxRate.toFixed(2),
        taxAmount: formData.taxGroup === "No Tax" ? "0.00" : taxAmount.toFixed(2),
        amount: amount.toFixed(2),
        cgst: formData.taxGroup === "State Tax" ? (totalTaxRate / 2).toFixed(2) : "0.00",
        sgst: formData.taxGroup === "State Tax" ? (totalTaxRate / 2).toFixed(2) : "0.00",
        igst: formData.taxGroup === "Other Tax" ? totalTaxRate.toFixed(2) : "0.00",
        gst: formData.taxGroup === "No Tax" ? "0.00" : totalTaxRate.toFixed(2)
      };
    }
    return item;
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

    if (name === "gst") {
      const gstValue = parseFloat(value) || 0;
      if (formData.taxGroup === "State Tax") {
        newItems[index].cgst = (gstValue / 2).toString();
        newItems[index].sgst = (gstValue / 2).toString();
        newItems[index].igst = "0";
      } else {
        newItems[index].cgst = "0";
        newItems[index].sgst = "0";
        newItems[index].igst = value;
      }
    }
    if (name === "discountAmount") {
      const grossAmount = parseFloat(newItems[index].grossAmount) || 0;
      const discountAmount = parseFloat(value) || 0;
      if (grossAmount > 0) {
        const calculatedDiscountRate = (discountAmount / grossAmount) * 100;
        newItems[index].discountRate = calculatedDiscountRate.toFixed(2);
      }
    }

    // If the quantity field is being changed, check for insufficient inventory
    if (name === "quantity") {
      // Update the quantity immediately for better UX
      setItems(newItems);

      // Then check with a delay if it exceeds available stock
      setTimeout(() => {
        const currentItem = newItems[index];

        // Find the original item from itemMainData to get the actual available quantity
        const originalItem = itemMainData.find(
          (item) => item._id === currentItem.iditem
        );

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
            requestedQuantity: value,
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
      toast.error(
        "Requested quantity exceeds available quantity in MNS inventory"
      );
      return;
    }

    setIsLoadingSnigdhaItem(true);
    try {
      // Make API call to transfer inventory from MNS to Snigdha
      const transferData = {
        hsnCode: insufficientItemData.hsnCode,
        quantity: quantityToAdd,
      };

      // Call the API endpoint for transferring inventory
      const response = await axios.post(
        `${backendDomainA}/api/v1/inventory/snig-transfer-by-hsn`,
        transferData
      );

      if (response.data.success) {
        toast.success(
          `Successfully added ${quantityToAdd} units to Snigdha inventory`
        );

        // Update the available items list with the new quantity
        const updatedItemMainData = [...itemMainData];
        const itemIndex = updatedItemMainData.findIndex(
          (item) => item._id === insufficientItemData.iditem
        );

        if (itemIndex !== -1) {
          updatedItemMainData[itemIndex] = {
            ...updatedItemMainData[itemIndex],
            quantity:
              parseInt(updatedItemMainData[itemIndex].quantity) +
              parseInt(quantityToAdd),
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



const calculateTotals = (currentItems = items) => {
  const totals = currentItems.reduce((acc, item) => ({
    grossAmount: acc.grossAmount + (parseFloat(item.grossAmount) || 0),
    discount: acc.discount + (parseFloat(item.discountAmount) || 0),
    taxableAmount: acc.taxableAmount + (parseFloat(item.netAmount) || 0),
    taxAmount: formData.taxGroup === "No Tax" ? 0 : acc.taxAmount + (parseFloat(item.taxAmount) || 0)
  }), {
    grossAmount: 0,
    discount: 0,
    taxableAmount: 0,
    taxAmount: 0
  });

  const baseAmount = totals.taxableAmount + (formData.taxGroup === "No Tax" ? 0 : totals.taxAmount);

  // const defaultTransportCharges = baseAmount * 0.18;

  // Only use default if user hasn't edited the field
  // const transportCharges = userEditedTransport
  //   ? parseFloat(formData.transportationCharges) || 0
  //   : defaultTransportCharges;

  const transportCharges = Number(formData.transportationCharges) || 0;

  const grandTotal = baseAmount + transportCharges;

  setTotals({
    discount: totals.discount.toFixed(2),
    taxableAmount: totals.taxableAmount.toFixed(2),
    taxAmount: formData.taxGroup === "No Tax" ? "0.00" : totals.taxAmount.toFixed(2),
    grandTotal: grandTotal.toFixed(2)
  });

  // Only update transportationCharges if user hasn't edited it
  // if (!userEditedTransport) {
  //   setFormData(prev => ({
  //     ...prev,
  //     transportationCharges: defaultTransportCharges.toFixed(2)
  //   }));
  // }
};

  const getNextAvailableSequence = async (currentSequence) => {
    try {
      const response = await fetch(`${New_Url}/api/v2/invoice/invoices`);
      const data = await response.json();

      if (data?.success && data?.invoices && data?.invoices.length > 0) {
        // Extract all sequence numbers from existing invoices
        const sequences = data.invoices
          .map((invoice) => {
            const match = invoice.invoiceNumber.match(/-([\d]+)-/);
            return match ? parseInt(match[1], 10) : 0;
          })
          .filter((seq) => !isNaN(seq)); // Sort sequences in ascending order

        if (sequences.length > 0) {
          // Find the highest sequence number and add 1
          return Math.max(...sequences) + 1;
        }
      }
      return 1;
    } catch (error) {
      console.error("Error checking sequence:", error);
      return currentSequence;
    }
  };

  //------------------------ reset form----------------------------------------------

  const resetForm = () => {
    setFormData({
      date: "",
      taxGroup: "State Tax",
      paymentType: "cash",
      customerName: "",
      invoiceNumber: "",
      location: "",
      vendorCode: "",
      poDate: "",
      poNumber: "",
      state: "",
      phone: "",
      address: "",
      deliveryAddress: "",
      gstnumber: "",
      transportationCharges: 0,
      // paymentType: formData.paymentType,
      paymentType: "",
    });

    setItems([
      {
        id: 1,
        query: "",
        filteredSuggestions: [], // Ensure this is always an array
        itemName: "",
        itemid: "",
        iditem: "",
        description: "",
        quantity: "",
        hsnCode: "",
        uom: "",
        group: "",
        cgst: "",
        sgst: "",
        igst: "",
        gst: "",
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

  //----------------------------- DATA SAVE-------------------------------------------
  const handleSave = async () => {
    try {
      if (!customerQuery) {
        toast.error("Please enter customer name");
        return;
      }
      if (!billNumber) {
        toast.error("Invoice number is required");
        return;
      }
      // console.log("hi :  ",items[0].itemName)
      if (
        !items[0].itemName ||
        !items[0].quantity ||
        !items[0].unitPrice ||
        !items[0].sellingPrice
      ) {
        toast.error(
          "Please fill in at least one item with name, quantity, and unit price from inventory "
        );
        return;
      }
      //
      const payload = {
        receiverDetails: {
          name: customerQuery,
          state: formData.state,
          phoneNumber: formData.phone,
          // address: formData.address,

          address: typeof formData.address === 'object' ? 
          formData.address.map(part => part.includes('/') ? `"${part}"` : part).join(', ') : 
          formData.address,

          deliveryAddress: typeof formData.deliveryAddress === 'object' ? 
          formData.deliveryAddress.map(part => part.includes('/') ? `"${part}"` : part).join(', ') : 
          formData.deliveryAddress,

          gstin: formData.gstnumber,
          id: String(formData.id),
        },
        invoiceNumber: billNumber,
        date: formData.date,
        customerName: customerQuery,
        taxGroup: formData.taxGroup,
        paymentType: formData.paymentType,
        location: formData.location || "",
        vendorCode: formData.vendorCode || "",
        poDate: formData.poDate || "",
        poNumber: formData.poNumber || "",
        transportationCharges: formData.transportationCharges || 0,
        items: items.map((item) => ({
          id: item.itemid,
          itemName: item.itemName || "",
          description: item.description || "",
          quantity: parseFloat(item.quantity) || 0,
          unit: item.unit || "",
          hsnCode: item.hsnCode || "",
          uom: item.uom || "",
          group: item.group || "",
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
      // console.log("res from invoice in snigdha : ", data);
      if (data.success === true) {
        const currentCount = localStorage.getItem("invoiceCount");
        const newCount = currentCount ? parseInt(currentCount) + 1 : 1;
        localStorage.setItem("invoiceCount", newCount.toString());
        
        // Generate new invoice number with updated count
        const newInvoiceNumber = generateInvoiceNumber(formData.paymentType);
        setBillNumber(newInvoiceNumber);
        
        toast.success(data.message);
        resetForm();
        // navigate("SnigdhaBillingAddInvoicePage"); // Navigate to view page after successful save
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error.message || "Error saving invoice");
    }
  }; //----------------------------- DATA SAVE-------------------------------------------
  useEffect(() => {
    const initializeInvoiceNumber = async () => {
      try {
        const nextSequence = await getNextAvailableSequence();
        setLastSequence(nextSequence);
        const initialInvoiceNumber = generateInvoiceNumber(
          formData.paymentType || "cash"
        );
        setBillNumber(initialInvoiceNumber);
      } catch (error) {
        console.error("Error initializing invoice number:", error);
      }
    };

    initializeInvoiceNumber();
  }, []);
  //--------------------------- Reset data---------------------------------

  return (
    <div className="p-4">
      <div className="bg-white px-5 py-5 shadow-lg rounded-xl">
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex gap-4">
            <div>
              <label className="block text-gray-600 mb-1">Invoice Number</label>
              <input
                type="text"
                className="border p-1 bg-gray-50"
                name="billNumber"
                value={billNumber}
                readOnly
                placeholder="Auto-generated invoice number"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Date</label>
              <input
                type="date"
                className="border p-1"
                name="date"
                value={formData?.date}
                onChange={handleFormDataChange}
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Tax Group</label>
              <select
                className="border p-1 "
                name="taxGroup"
                value={formData?.taxGroup} // Controlled input
                onChange={handleFormDataChange}
              >
                <option value="State Tax">State Tax</option>
                <option value="Other Tax">Other Tax</option>
                <option value="No Tax">No Tax</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentType"
                value="cash"
                checked={formData?.paymentType === "cash"}
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
                checked={formData?.paymentType === "credit"}
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
                {customerSuggestions?.map((customer, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-blue-100"
                    onClick={() =>
                      handleCustomerSelect(customer.name, customer.id)
                    }
                  >
                    <div className="font-medium">{customer.name}</div>
                    {/* <div className="font-medium">{customer.gst}</div> */}
                    <div className="text-xs text-gray-500">
                      {customer.email}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="">
            <label className="block text-gray-600 mb-1">PO Number</label>
            <input
              type="text"
              className="border p-1 w-full"
              name="poNumber"
              value={formData.poNumber}
              onChange={handleFormDataChange}
              placeholder="Enter po number"
            />
          </div>
          <div className="">
            <label className="block text-gray-600 mb-1">PO Date</label>
            <input
              type="date"
              className="border p-1 w-full"
              name="poDate"
              value={formData.poDate}
              onChange={handleFormDataChange}
              placeholder="Enter po date"
            />
          </div>
          <div className="">
            <label className="block text-gray-600 mb-1">Vendor Code</label>
            <input
              type="text"
              className="border p-1 w-full"
              name="vendorCode"
              value={formData.vendorCode}
              onChange={handleFormDataChange}
              placeholder="Enter Vendor Code"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Location</label>
            <input
              type="text"
              className="border p-1 w-40"
              name="location"
              value={formData.location}
              onChange={handleFormDataChange}
              placeholder="Enter Location"
            />
          </div>
        </div>

        {/* Customer Details  */}

        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-4 mb-4 text-sm">
            {/* Email */}
            <div className="w-full">
              <label className="block text-gray-600 mb-1">Customer State</label>
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
            {/* deliveryAddress */}
            <div className="w-full">
              <label className="block text-gray-600 mb-1">
                Customer Delivery Address
              </label>
              <input
                type="text"
                className="border p-2 w-full"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleFormDataChange}
                placeholder="Enter delivery address"
              />
            </div>
            {/* deliveryAddress */}
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
            {/* Transportation Charges */}
            <div className="w-full">
              <label className="block text-gray-600 mb-1">
                Transportation Charges
              </label>
              <input
                type="number"
                className="border p-2 w-full"
                name="transportationCharges"
                value={formData.transportationCharges}
                onChange={handleFormDataChange}
                placeholder="Enter transportation charges"
              />
            </div>



          </div>
        </div>

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

              <th className="border border-gray-300 p-1 font-normal">
                Descriptions 
              </th>
            
              <th className="border border-gray-300 p-1 font-normal w-20">
                Quantity
              </th>
              <th className="border border-gray-300 p-1 font-normal w-20">
                Unit
              </th>
              <th className="border border-gray-300 p-1 font-normal w-20">
                Group
              </th>
              <th className="border border-gray-300 p-1 font-normal w-20">
                HSN Code
              </th>
              {formData.taxGroup !== "No Tax" &&
                (formData.taxGroup === "State Tax" ? (
                  <>
                    <th className="border border-gray-300 p-1 font-normal w-20">
                      CGST(%)
                    </th>
                    <th className="border border-gray-300 p-1 font-normal w-20">
                      SGST(%)
                    </th>
                  </>
                ) : (
                  <th className="border border-gray-300 p-1 font-normal w-20">
                    IGST(%)
                  </th>
                ))}

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
                Disc. Rate(%)
              </th>
              <th className="border border-gray-300 p-1 font-normal w-24">
                Disc. Amount
              </th>
             {formData.taxGroup === "No Tax" ? null: (
              <>
                  <th className="border border-gray-300 p-1 font-normal w-24">
                    Tax Rate(%)
                  </th>
               
                  <th className="border border-gray-300 p-1 font-normal w-24">
                  Tax Amount
                  </th>
                  </>
                )}
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
                  <input
                    type="text"
                    className="w-30 p-2  border-gray-300 outline-none"
                    placeholder="Search..."
                    value={item.query}
                    onChange={(e) => handleItemQueryChange(index, e)}
                  />
                  {item.filteredSuggestions.length > 0 && (
                    <ul className="absolute w-auto bg-white border border-gray-200 rounded-md mt-1 shadow-md z-10">
                      {item.filteredSuggestions.map(
                        (suggestion, idx) => (
                          console.log("sugge: ", suggestion),
                          (
                            <li
                              key={idx}
                              className="p-2 cursor-pointer hover:bg-blue-100"
                              onClick={() => handleSelect(index, suggestion)}
                            >
                              {suggestion?.name} (quantity:{" "}
                              {suggestion?.quantity}) (sellingPrice:{" "}
                              {suggestion?.sellingPrice})
                            </li>
                          )
                        )
                      )}
                    </ul>
                  )}
                </td>
                <td className="border border-gray-300 p-0">
                  <input
                    type="text"
                    className="w-full p-1 border-none outline-none"
                    name="description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, e)}
                  />
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
                  <input
                    className="p-1 w-30 outline-none"
                    name="uom"
                    value={item.uom}
                    onChange={(e) => handleItemChange(index, e)}
                    readOnly
                  ></input>
                </td>
                <td className="border border-gray-300 p-0">
                  <input
                    className="p-1 w-30 outline-none"
                    name="group"
                    value={item.group}
                    onChange={(e) => handleItemChange(index, e)}
                    readOnly
                  ></input>
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
                {formData.taxGroup !== "No Tax" &&
                  (formData.taxGroup === "State Tax" ? (
                    <>
                      <td className="border border-gray-300 p-0">
                        <input
                          className="w-full p-1 border-none outline-none"
                          name="cgst"
                          value={item.gst / 2}
                          readOnly
                        />
                      </td>
                      <td className="border border-gray-300 p-0">
                        <input
                          className="w-full p-1 border-none outline-none"
                          name="sgst"
                          value={item.gst / 2}
                          readOnly
                        />
                      </td>
                    </>
                  ) : (
                    <td className="border border-gray-300 p-0">
                      <input
                        className="w-full p-1 border-none outline-none"
                        name="igst"
                        value={item.gst}
                        readOnly
                      />
                    </td>
                  ))}
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
                {formData.taxGroup !== "No Tax" && (
                  <>
                    <td className="border border-gray-300 p-0">
                      <input
                        type="text"
                        value={item.taxRate}
                        readOnly
                        className="w-full p-1 border-none outline-none"
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        type="text"
                        value={item.taxAmount}
                        readOnly
                        className="w-full p-1 border-none outline-none"
                      />
                    </td>
                  </>
                )}
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
              <h3 className="text-xl font-bold text-red-600">
                Insufficient Stock
              </h3>
              <p className="mt-2 text-gray-700">
                Insufficient Item, please add from MNS inventory.
              </p>
              {insufficientItemData && (
                <div className="mt-3 p-3 bg-gray-100 rounded-md">
                  <p>
                    <span className="font-semibold">Item :</span>{" "}
                    {insufficientItemData.itemName}
                  </p>
                  <p>
                    <span className="font-semibold">Unit :</span>{" "}
                    {insufficientItemData.uom}
                  </p>
                  <p>
                    <span className="font-semibold">HSN Code :</span>{" "}
                    {insufficientItemData.hsnCode}
                  </p>
                  <p>
                    <span className="font-semibold">Available Quantity :</span>{" "}
                    {insufficientItemData.availableQuantity}
                  </p>
                  <p>
                    <span className="font-semibold">Requested Quantity :</span>{" "}
                    {insufficientItemData.requestedQuantity}
                  </p>
                </div>
              )}

              {!showAddForm ? (
                <div className="mt-4">
                  <button
                    onClick={checkItemInMNS}
                    disabled={isLoadingSnigdhaItem}
                    className="w-full px-4 cursor-pointer py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                  >
                    {isLoadingSnigdhaItem
                      ? "Checking..."
                      : "Check Item in MNS Inventory"}
                  </button>
                </div>
              ) : (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold mb-2">
                    Item Found in MNS Inventory
                  </h4>
                  {snigdhaItem && (
                    <div className="bg-green-50 p-3 rounded-md mb-3">
                      <p>
                        <span className="font-semibold">Item Name:</span>{" "}
                        {snigdhaItem.item_name}
                      </p>
                      <p>
                        <span className="font-semibold">
                          Available Quantity:
                        </span>{" "}
                        {snigdhaItem.quantity}
                      </p>
                      <p>
                        <span className="font-semibold">Unit Price:</span> ₹
                        {snigdhaItem.unit_prize}
                      </p>
                    </div>
                  )}

                  <div className="mb-3">
                    <label
                      htmlFor="quantityToAdd"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
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
                      {isLoadingSnigdhaItem
                        ? "Adding..."
                        : "Add to Snigdha Inventory"}
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
