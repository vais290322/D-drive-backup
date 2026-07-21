import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { backendDomainA, backendDomainS, backendDomainR1 } from "../../../Common/index";
import axios from "axios";
import SnigdhaServiceInvoice from "./SnigdhaServiceInvoice";

const New_Url = import.meta.env.VITE_REACT_INVOICE;
const Item_fetch_url = import.meta.env.VITE_REACT_FETCH_ITEMS_SIN;
const Customer_Url = import.meta.env.VITE_REACT_CUSTOMER_FETCH;
const forProductProfoma = import.meta.env.VITE_BASE_URL_S;

const invoiceFetchUrl = import.meta.env.VITE_BASE_URL_C;
// import {  } from './../../../Common/index';

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
  const [billNumber, setBillNumber] = useState("");

  const [counters, setCounters] = useState({
    cash: 1,
    credit: 1,
  });
  const [deletedNumbers, setDeletedNumbers] = useState({
    cash: new Set(),
    credit: new Set(),
  });

  // for checking qunatity

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0], // Default to today's date
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
    invoiceType: "product",
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
      group: "",
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

  // console.log("formData", items);

  const [totals, setTotals] = useState({
    grossAmount: 0,
    discount: 0,
    taxableAmount: 0,
    taxAmount: 0,
    grandTotal: 0,
    transportationCharges: 0,
    roundOff: 0,
    totalPayableAmount: 0,
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
      // console.log("response", jsonData);
      if (!response.ok) {
        throw new Error(jsonData?.message || "Failed to fetch invoices");
      }
      setInvoiceData(jsonData.data);
      if (jsonData.data && Array.isArray(jsonData.data)) {
        localStorage.setItem("invoiceCount", jsonData.data.length.toString());
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error(error.message || "Error fetching invoices");
    }
    // credentials: "include", // Add this to include cookies
  };

  // Generate financial year suffix
  const getFinancialYear = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (currentMonth >= 4) {
      return `${currentYear}-${(currentYear + 1).toString()?.slice(-2)}`;
    } else {
      return `${currentYear - 1}-${currentYear.toString()?.slice(-2)}`;
    }
  };

  // Fix 4: Update the generateInvoiceNumber function to handle edge cases
  const generateInvoiceNumber = (paymentType, sequence) => {
    if (!paymentType || !sequence) {
      console.error("Missing paymentType or sequence:", {
        paymentType,
        sequence,
      });
      return "";
    }

    const prefix = paymentType === "cash" ? "CASH" : "SE";
    const paddedSequence = sequence.toString().padStart(4, "0");
    // console.log("padded sequence: ", sequence, "for type:", paymentType);
    const financialYear = getFinancialYear();
    return `${prefix}/${paddedSequence}/${financialYear}`;
  };

  // Fix 5: Add a separate useEffect to handle initial invoice number generation
  useEffect(() => {
    // Only generate initial invoice number when counters are properly set
    if (counters.cash > 0 && counters.credit > 0 && !billNumber) {
      const type = formData.paymentType || "cash";
      const sequence = counters[type];

      if (sequence) {
        const initialInvoiceNumber = generateInvoiceNumber(type, sequence);
        setBillNumber(initialInvoiceNumber);
      }
    }
  }, [counters]);

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
    const value = e.target.value;
    const updatedItems = [...items];

    updatedItems[index] = {
      ...updatedItems[index],
      query: value,
      itemName: value, // Update itemName with the typed value
    };

    if (formData.invoiceType === "prodectProforma") {
      updatedItems[index].itemName = value || "";
      // do not force iditem here; if user selects suggestion later, handleSelect will set it
    }

    console.log({ itemMainData });

    if (value.trim() !== "") {
      const filtered = itemMainData.filter((suggestion) =>
        suggestion.item_name.toLowerCase().includes(value.toLowerCase())
      );

      console.log({
        filtered,
      });

      updatedItems[index].filteredSuggestions = filtered;
    } else {
      updatedItems[index].filteredSuggestions = [];

      // Ensure itemName cleared only when empty input
      if (formData.invoiceType === "prodectProforma") {
        updatedItems[index].itemName = "";
      }
    }

    // console.log("updated items :: ", updatedItems);

    setItems(updatedItems);
  };

  const handleSelect = (index, product) => {
    // console.log("product", product);

    const updatedItems = [...items];

    updatedItems[index] = {
      ...updatedItems[index],
      id: product._id || "",
      itemName: product.item_name || "",
      item_id: product.item_id || "",
      hsnCode: product.hsnCode || "",
      uom: product.uom || updatedItems[index].uom,
      group: product.group || updatedItems[index].group,
      cgst: product.gst / 2 || updatedItems[index].cgst,
      sgst: product.gst / 2 || updatedItems[index].sgst,
      igst: product.gst || updatedItems[index].igst,
      hsnCode: product.hsnCode || "",
      unitPrice: parseFloat(product.unit_prize).toFixed(2) || 0,

      query: product.item_name || "",
      filteredSuggestions: [],
    };

    // console.log("updatedItems after select", updatedItems);

    // Calculate amounts after selection
    calculateItemAmounts(updatedItems, index);
    setItems(updatedItems);
  };

  const calculateItemAmounts = (updatedItems, index) => {
    const item = updatedItems[index];
    const quantity = parseFloat(item.quantity) || 0;
    const sellingPrice = parseFloat(item.sellingPrice) || 0;

    // Calculate gross amount
    const grossAmount = quantity * sellingPrice;
    updatedItems[index].grossAmount = grossAmount;

    // Calculate discount amount
    const discountRate = parseFloat(item.discountRate) || 0;
    const discountAmount = (grossAmount * discountRate) / 100;
    updatedItems[index].discountAmount = discountAmount;

    // Calculate net amount
    const netAmount = grossAmount - discountAmount;
    updatedItems[index].netAmount = netAmount;

    // Calculate tax amount
    const cgst = parseFloat(item.cgst) || 0;
    const sgst = parseFloat(item.sgst) || 0;
    const igst = parseFloat(item.igst) || 0;

    if (formData.taxGroup === "State Tax") {
      const taxRate = cgst + sgst;
      const taxAmount = (netAmount * taxRate) / 100;

      updatedItems[index].taxAmount = taxAmount;
      updatedItems[index].taxRate = taxRate;

      // Calculate final amount
      const amount = netAmount + taxAmount;
      updatedItems[index].amount = amount;
    } else if (formData.taxGroup === "Other Tax") {
      const taxRate = igst;
      const taxAmount = (grossAmount * taxRate) / 100;

      updatedItems[index].taxAmount = taxAmount;
      updatedItems[index].taxRate = taxRate;

      // Calculate final amount
      const amount = netAmount + taxAmount;
      updatedItems[index].amount = amount;
    } else {
      updatedItems[index].taxAmount = 0;
      updatedItems[index].taxRate = 0;
      updatedItems[index].amount = netAmount;
    }

    setItems(updatedItems);
  };
 
  const calculateTotals = () => {
    let grossAmount = 0;
    let discount = 0;
    let taxableAmount = 0;
    let taxAmount = 0;
    let grandTotal = 0;
    let roundOff = 0;

    // console.log("items", items);

    items.forEach((item) => {
      grossAmount += parseFloat(item.grossAmount) || 0;
      discount += parseFloat(item.discountAmount) || 0;
      taxableAmount += parseFloat(item.netAmount) || 0;
      taxAmount += parseFloat(item.taxAmount) || 0;
      grandTotal += parseFloat(item.amount) || 0;
    });

    let totalPayableAmount = grandTotal;

    const decimalPart = grandTotal % 1;

    if (decimalPart < 0.5 && decimalPart !== 0) {
      totalPayableAmount = grandTotal - roundOff;
    } else if (decimalPart >= 0.5) {
      totalPayableAmount = grandTotal + roundOff;
    }

    setTotals((prev) => ({
      ...prev,
      grossAmount,
      discount,
      taxableAmount,
      taxAmount,
      grandTotal,
      totalPayableAmount,
    }));

    

    // Update formData with calculated totals
    setFormData((prev) => ({
      ...prev,
      discount,
      taxableAmount,
      taxAmount,
      grandTotal,
      totalPayableAmount,
    }));
  };

  useEffect(() => {
    calculateTotals();
  }, [items]);

  useEffect(() => {
    fetchInvoiceDetails();
  }, []);

  // Fix 3: Update the useEffect that sets initial counters
  useEffect(() => {
    if (invoiceData && invoiceData.length > 0) {
      // Calculate next counters based on existing data
      const cashInvoices = invoiceData.filter(
        (inv) => inv.paymentType === "cash"
      );
      const creditInvoices = invoiceData.filter(
        (inv) => inv.paymentType === "credit"
      );

      const maxCash =
        cashInvoices.length > 0
          ? Math.max(...cashInvoices.map((inv) => inv.sequence || 0))
          : 0;

      const maxCredit =
        creditInvoices.length > 0
          ? Math.max(...creditInvoices.map((inv) => inv.sequence || 0))
          : 0;

      const newCounters = {
        cash: maxCash + 1,
        credit: maxCredit + 1,
      };

      // console.log("Setting new counters:", newCounters);
      setCounters(newCounters);

      // Track deleted numbers
      const deletedCash = new Set(
        invoiceData
          .filter((inv) => inv.paymentType === "cash" && inv.isDeleted)
          .map((inv) => inv.sequence)
      );
      const deletedCredit = new Set(
        invoiceData
          .filter((inv) => inv.paymentType === "credit" && inv.isDeleted)
          .map((inv) => inv.sequence)
      );

      setDeletedNumbers({
        cash: deletedCash,
        credit: deletedCredit,
      });
    } else {
      // If no invoice data, set initial counters
      setCounters({
        cash: 1,
        credit: 1,
      });
    }
  }, [invoiceData]);

  // Fix 1: Update the useEffect that handles invoice number generation
  useEffect(() => {
    const type = formData.paymentType;
    const sequence = counters[type];
    // console.log(
    //   "sequence from counters useEffect: ",
    //   sequence,
    //   formData.paymentType
    // );
    // console.log("current counters object: ", counters);

    if (sequence && sequence > 0) {
      // Add validation for sequence
      const newInvoiceNumber = generateInvoiceNumber(
        formData.paymentType,
        sequence
      );
      setBillNumber(newInvoiceNumber);
    }
  }, [counters, formData.paymentType]);

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
    // NEW: Skip stock validation for Product Proforma
    if (formData.invoiceType !== "prodectProforma") {
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

  //------------------------- Customer

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
      const response = await fetch(`${backendDomainR1}/api/v1/mns/crm/s`, {
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
    // console.log("customer", id);
    setCustomerQuery(customer);
    setFormData((prev) => ({
      ...prev,
      customerName: customer,
      id:id,
    }));
    setCustomerSuggestions([]);
  };
  //------------------------- Customer Name----------------------------------------------------

  const deleteRow = (index) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
      calculateTotals(newItems);
    }
  };

  // Fix 2: Update the handleFormDataChange function
  const handleFormDataChangeold = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };

    // Handle payment type change immediately
    if (name === "paymentType") {
      // console.log("Payment type changed to:", value);
      // console.log("Current counters:", counters);

      const sequence = counters[value];
      // console.log("sequence for", value, ":", sequence);

      if (sequence && sequence > 0) {
        const newInvoiceNumber = generateInvoiceNumber(value, sequence);
        // console.log("Generated invoice number:", newInvoiceNumber);
        setBillNumber(newInvoiceNumber);
      }
    }

    // Handle tax group change - recalculate all items

    setFormData(newFormData);

    // if (name === "transportationCharges") {
    //   const updatedFormData = {
    //     ...formData,
    //     transportationCharges: value,
    //   };

    //   setTimeout(() => {
    //     const baseAmount =
    //       parseFloat(totals.taxableAmount) + parseFloat(totals.taxAmount);
    //     const transportCharges = Number(value) || 0;
    //     const grandTotal = baseAmount + transportCharges;

    //     setTotals((prev) => ({
    //       ...prev,
    //       grandTotal: grandTotal.toFixed(2),
    //     }));
    //   }, 0);
    // }
  };

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);

    // If tax group changes, update all items' tax values
    if (name === "taxGroup") {
      const updatedItems = items.map((item) => {
        const gstValue = item.gst || "0";
        if (value === "State Tax") {
          return {
            ...item,
            cgst: (parseFloat(gstValue) / 2).toString(),
            sgst: (parseFloat(gstValue) / 2).toString(),
            igst: "0",
          };
        } else if (value === "Other Tax") {
          return {
            ...item,
            cgst: "0",
            sgst: "0",
            igst: gstValue,
          };
        } else {
          return {
            ...item,
            gst: "0",
            cgst: "0",
            sgst: "0",
            igst: "0",
            amount: item.netAmount,
            taxAmount: "0",
            taxRate: "0",
          };
        }
      });

      console.log("updatedItems", updatedItems);

      setItems(updatedItems);
      calculateTotals(updatedItems);
    }

    // Immediately recalculate totals with the new transportation charges
    // if (name === "transportationCharges") {
    //   const transportCharges = parseFloat(value) || 0;
    //   const grandTotalWithoutTransport = totals.taxableAmount + totals.taxAmount;

    //   if (grandTotalWithoutTransport > 0) {
    //     const newPercentage = ((transportCharges / grandTotalWithoutTransport) * 100).toFixed(2);
    //     setTransportationPercentage(newPercentage);
    //   }
    // }
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
      const netAmount = grossAmount - discountAmount;

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
      const amount =
        netAmount + (formData.taxGroup === "No Tax" ? 0 : taxAmount);

      return {
        grossAmount: grossAmount.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        netAmount: netAmount.toFixed(2),
        taxRate:
          formData.taxGroup === "No Tax" ? "0.00" : totalTaxRate.toFixed(2),
        taxAmount:
          formData.taxGroup === "No Tax" ? "0.00" : taxAmount.toFixed(2),
        amount: amount.toFixed(2),
        cgst:
          formData.taxGroup === "State Tax"
            ? (totalTaxRate / 2).toFixed(2)
            : "0.00",
        sgst:
          formData.taxGroup === "State Tax"
            ? (totalTaxRate / 2).toFixed(2)
            : "0.00",
        igst:
          formData.taxGroup === "Other Tax" ? totalTaxRate.toFixed(2) : "0.00",
        gst: formData.taxGroup === "No Tax" ? "0.00" : totalTaxRate.toFixed(2),
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
      } else if (formData.taxGroup === "Other Tax") {
        newItems[index].cgst = "0";
        newItems[index].sgst = "0";
        newItems[index].igst = value;
      } else {
        newItems[index].cgst = "0";
        newItems[index].sgst = "0";
        newItems[index].igst = "0";
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

    if (name === "cgst" && formData.taxGroup === "State Tax") {
      const cgstValue = parseFloat(value) || 0;
      // const cgstValue = value || 0;
      newItems[index].gst = (cgstValue * 2).toString();
      newItems[index].sgst = value;
    }

    if (name === "sgst" && formData.taxGroup === "State Tax") {
      const sgstValue = parseFloat(value) || 0;
      newItems[index].gst = (sgstValue * 2).toString();
      newItems[index].cgst = value;
    }

    // If IGST is changed directly, update GST
    if (name === "igst" && formData.taxGroup !== "State Tax") {
      newItems[index].gst = value;
    }

    // If the quantity field is being changed, check for insufficient inventory
    //* NEW: Only check inventory for non-proforma invoices
    if (name === "quantity" && formData.invoiceType !== "prodectProforma") {
      // Update the quantity immediately for better UX
      setItems(newItems);

      // Then check with a delay if it exceeds available stock
      setTimeout(() => {
        const currentItem = newItems[index];

        // Find the original item from itemMainData to get the actual available quantity
        const originalItem = itemMainData.find(
          (item) => item._id === currentItem.id
        );

        if (!originalItem) return;

        const availableQuantity = originalItem.totalDamageQty
          ? parseInt(originalItem.quantity - originalItem.totalDamageQty)
          : parseInt(originalItem.quantity) || 0; // change on 15-12-2025
        // console.log("avaible qty : ",availableQuantity)
        const requestedQuantity = parseInt(value || 0);

        if (requestedQuantity > availableQuantity) {
          // Show insufficient item modal
          setInsufficientItemIndex(index);
          setInsufficientItemData({
            ...currentItem,
            ...originalItem,
            availableQuantity: availableQuantity, // change on same date
            requestedQuantity: value,
            totalDamageQty: originalItem.totalDamageQty,
          });
          setInsufficientItemModal(true);
        }
      }, 2000); // 2 second delay
    }

    calculateItemAmounts(newItems, index);
    setItems(newItems);

 
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

  // const calculateTotals = (currentItems = items) => {
  //   const totals = currentItems.reduce(
  //     (acc, item) => ({
  //       grossAmount: acc.grossAmount + (parseFloat(item.grossAmount) || 0),
  //       discount: acc.discount + (parseFloat(item.discountAmount) || 0),
  //       taxableAmount: acc.taxableAmount + (parseFloat(item.netAmount) || 0),
  //       taxAmount:
  //         formData.taxGroup === "No Tax"
  //           ? 0
  //           : acc.taxAmount + (parseFloat(item.taxAmount) || 0),
  //     }),
  //     {
  //       grossAmount: 0,
  //       discount: 0,
  //       taxableAmount: 0,
  //       taxAmount: 0,
  //     }
  //   );

  //   const baseAmount =
  //     totals.taxableAmount +
  //     (formData.taxGroup === "No Tax" ? 0 : totals.taxAmount);

  //   // const defaultTransportCharges = baseAmount * 0.18;

  //   // Only use default if user hasn't edited the field
  //   // const transportCharges = userEditedTransport
  //   //   ? parseFloat(formData.transportationCharges) || 0
  //   //   : defaultTransportCharges;

  //   const transportCharges = Number(formData.transportationCharges) || 0;

  //   const grandTotal = baseAmount + transportCharges;

  //   setTotals({
  //     discount: totals.discount.toFixed(2),
  //     taxableAmount: totals.taxableAmount.toFixed(2),
  //     taxAmount:
  //       formData.taxGroup === "No Tax" ? "0.00" : totals.taxAmount.toFixed(2),
  //     grandTotal: grandTotal.toFixed(2),
  //   });

  //   // Only update transportationCharges if user hasn't edited it
  //   // if (!userEditedTransport) {
  //   //   setFormData(prev => ({
  //   //     ...prev,
  //   //     transportationCharges: defaultTransportCharges.toFixed(2)
  //   //   }));
  //   // }
  // };

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
      invoiceType: "product", // Reset to default product invoice
      
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
      roundOff: "0.00",
      totalPayableAmount: "0.00",
    });
    setCustomerid("");
    setCustomerQuery("");
    
  };

  // for round off

  const handleRoundOffChange = (e) => {
    const value = e.target.value || 0;
    setTotals((prev) => ({
      ...prev,
      roundOff: value.toString(),
    }));
  };

  // useEffect(() => {
  //   const grandTotal = parseFloat(totals.grandTotal) || 0;
  //   const roundOff = parseFloat(totals.roundOff) || 0;
  //   let totalPayableAmount = grandTotal;

  //   if (roundOff !== 0) {
  //     const decimalPart = grandTotal % 1;

  //     // If decimal part is greater than 0.50, add the roundOff
  //     // If decimal part is less than or equal to 0.50, subtract the roundOff
  //     if (decimalPart > 0.5) {
  //       totalPayableAmount = grandTotal + roundOff;
  //     } else {
  //       totalPayableAmount = grandTotal - roundOff;
  //     }
  //   }

  //   setTotals((prev) => ({
  //     ...prev,
  //     totalPayableAmount: totalPayableAmount.toFixed(2),
  //   }));
  // }, [totals.grandTotal, totals.roundOff]);

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
        formData.invoiceType !== "prodectProforma" &&
        (!items[0].itemName ||
          !items[0].quantity ||
          !items[0].unitPrice ||
          !items[0].sellingPrice)
      ) {
        toast.error(
          "Please fill in at least one item with name, quantity, and unit price from inventory "
        );
        return;
      }
      const currentPaymentType = formData.paymentType;
      const sequence = counters[currentPaymentType];
      // console.log("sequence for save: ", sequence, currentPaymentType);
      //
      const payload = {
        receiverDetails: {
          name: customerQuery,
          state: formData.state,
          phoneNumber: formData.phone,
          // address: formData.address,

          address:
            typeof formData.address === "object"
              ? formData.address
                  .map((part) => (part.includes("/") ? `"${part}"` : part))
                  .join(", ")
              : formData.address,

          deliveryAddress:
            typeof formData.deliveryAddress === "object"
              ? formData.deliveryAddress
                  .map((part) => (part.includes("/") ? `"${part}"` : part))
                  .join(", ")
              : formData.deliveryAddress,

          gstin: formData.gstnumber,
          id: String(formData.id),
        },
        invoiceNumber:
          formData.invoiceType === "prodectProforma" ||
          formData.invoiceType === "product"
            ? formData.invoiceNumber
            : billNumber,
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
          id: item.item_id || "",
          item_id: item.item_id || "",
          itemName: item.itemName || "",
          description: item.description || "",
          quantity: parseFloat(item.quantity) || 0,
          unit: item.unit || "",
          hsnCode: item.hsnCode || "",
          uom: item.uom || "",
          group: item.group || "",
          cgst: formData.taxGroup === "State Tax" ? parseFloat(item.cgst) : 0,
          sgst: formData.taxGroup === "State Tax" ? parseFloat(item.sgst) : 0,
          igst: formData.taxGroup === "Other Tax" ? parseFloat(item.igst) : 0,
          unitPrice: parseFloat(item.unitPrice) || 0,
          sellingPrice: parseFloat(item.sellingPrice) || 0,
          grossAmount: parseFloat(item.grossAmount) || 0,
          discountRate: parseFloat(item.discountRate) || 0,
          discountAmount:
            Number(parseFloat(item.discountAmount).toFixed(2)) || 0,
          netAmount: Number(parseFloat(item.netAmount).toFixed(2)) || 0,
          taxRate: parseFloat(item.taxRate) || 0,
          taxAmount: Number(parseFloat(item.taxAmount).toFixed(2)) || 0,
          amount: Number(parseFloat(item.amount).toFixed(2)) || 0,
        })),
        discount: Number(parseFloat(totals.discount).toFixed(2)) || 0,
        taxableAmount: Number(parseFloat(totals.taxableAmount).toFixed(2)) || 0,
        taxAmount: Number(parseFloat(totals.taxAmount).toFixed(2)) || 0,
        grandTotal: Number(parseFloat(totals.grandTotal).toFixed(2)) || 0,
        transportationCharges: Number(totals.transportationCharges) || 0,
        roundOff: Number(parseFloat(totals.roundOff).toFixed(2)) || 0,
        totalPayableAmount:
          Number(parseFloat(totals.totalPayableAmount).toFixed(2)) || 0,
        sequence: sequence,
      };

      // console.log("payload :: ", payload);
      // return;

      // Choose the correct API endpoint
      let apiUrl = New_Url; // Default: normal invoice
      if (formData.invoiceType === "prodectProforma") {
        apiUrl = `${backendDomainS}/api/v1/proforma`;
      }

      const response = await fetch(apiUrl, {
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
      if (data.success === true) {
        const currentCount = localStorage.getItem("invoiceCount");
        const newCount = currentCount ? parseInt(currentCount) + 1 : 1;
        localStorage.setItem("invoiceCount", newCount.toString());

        // Update counters state - increment the counter for the current payment type
        const updatedCounters = {
          ...counters,
          [currentPaymentType]: counters[currentPaymentType] + 1,
        };

        // console.log(
        //   "Updating counters from:",
        //   counters,
        //   "to:",
        //   updatedCounters
        // );
        setCounters(updatedCounters);

        // Generate new invoice number immediately with the updated counter
        const nextSequence = updatedCounters[currentPaymentType];
        const newInvoiceNumber = generateInvoiceNumber(
          currentPaymentType,
          nextSequence
        );
        // console.log("Setting new invoice number:", newInvoiceNumber);
        setBillNumber(newInvoiceNumber);

        toast.success(data.message);
        resetForm();
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error.message || "Error saving invoice");
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white px-5 py-5 shadow-lg rounded-xl">
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex gap-4">
            {formData.invoiceType === "service" ||
            formData.invoiceType === "prodectProforma" ||
            formData.invoiceType === "product" ? (
              <div>
                <label className="block text-gray-600 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  className="border p-1 bg-gray-50"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleFormDataChange}
                  placeholder="Enter Invoice Number"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-gray-600 mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    className="border p-1 bg-gray-50"
                    name="billNumber"
                    value={billNumber}
                    placeholder="Enter Invoice Number"
                  />
                </div>
              </>
            )}
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
            <div>
              <label className="block text-gray-600 mb-1">Invoice Type</label>
              <select
                className="border p-1 w-40"
                name="invoiceType"
                value={formData.invoiceType}
                onChange={handleFormDataChange}
              >
                <option value="product">Product Invoice</option>
                <option value="service">Service Invoice</option>
                <option value="prodectProforma">Product Proforma</option>
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
                value={formData.state}
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
            {/* <div className="w-full">
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
            </div> */}
          </div>
        </div>

        {/* Items Table */}
        {formData.invoiceType === "product" ||
        formData.invoiceType === "prodectProforma" ? (
          <>
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
                    Unit
                  </th>
                  <th className="border border-gray-300 p-1 font-normal w-20">
                    Group
                  </th>
                  <th className="border border-gray-300 p-1 font-normal w-20">
                    HSN Code
                  </th>
                  <th className="border border-gray-300 p-1 font-normal w-20">
                    Quantity
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

                  <th className="border border-gray-300 p-1 font-normal w-20">
                    Disc. Rate(%)
                  </th>
                  <th className="border border-gray-300 p-1 font-normal w-24">
                    Disc. Amount
                  </th>
                  <th className="border border-gray-300 p-1 font-normal w-24">
                    Net Amount
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
                  {formData.taxGroup === "No Tax" ? null : (
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
                        value={item.query || item.itemName}
                        onChange={(e) => handleItemQueryChange(index, e)}
                        title={item?.query || item?.itemName}
                      />
                      {item.filteredSuggestions.length > 0 && (
                        <ul className="absolute w-auto bg-white border border-gray-200 rounded-md mt-1 shadow-md z-10">
                          {item.filteredSuggestions.map((suggestion, idx) => (
                            // console.log("sugge items : ", suggestion),
                            <li
                              key={idx}
                              className="p-2 cursor-pointer hover:bg-blue-100"
                              onClick={() => handleSelect(index, suggestion)}
                            >
                              {suggestion?.item_name} (quantity:{" "}
                              {suggestion?.quantity}) (sellingPrice:{" "}
                              {suggestion?.sellingPrice}) (damage:{" "}
                              {suggestion?.totalDamageQty})
                            </li>
                          ))}
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
                        title={item?.description}
                      />
                    </td>

                    <td className="border border-gray-300 p-0">
                      <input
                        className="p-1 w-30 outline-none"
                        name="uom"
                        value={item.uom}
                        onChange={(e) => handleItemChange(index, e)}
                        // NEW: Editable for Product Proforma
                        // readOnly={formData.invoiceType !== "prodectProforma"}
                        title={item?.uom}
                      ></input>
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        className="p-1 w-30 outline-none"
                        name="group"
                        value={item.group}
                        onChange={(e) => handleItemChange(index, e)}
                        // NEW: Editable for Product Proforma
                        // readOnly={formData.invoiceType !== "prodectProforma"}
                        title={item?.group}
                      ></input>
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        type="text"
                        className="w-full p-1 border-none outline-none"
                        name="hsnCode"
                        value={item.hsnCode}
                        onChange={(e) => handleItemChange(index, e)}
                        title={item?.hsnCode}
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
                        title={item?.quantity}
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        type="number"
                        className="w-16 p-1 border-none outline-none"
                        name="unitPrice"
                        value={item.unitPrice}
                        // onChange={(e) => handleItemChange(index, e)}
                        readOnly
                        title={item?.unitPrice}
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        type="number"
                        className="w-full p-1 border-none outline-none"
                        name="sellingPrice"
                        value={item.sellingPrice}
                        onChange={(e) => handleItemChange(index, e)}
                        title={item?.sellingPrice}
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        type="number"
                        className="w-full p-1 border-none  outline-none"
                        name="grossAmount"
                        value={item.grossAmount}
                        readOnly
                        title={item?.grossAmount}
                      />
                    </td>

                    <td className="border border-gray-300 p-0">
                      <input
                        type="number"
                        className="w-full p-1 border-none outline-none"
                        name="discountRate"
                        value={item.discountRate}
                        onChange={(e) => handleItemChange(index, e)}
                        title={item?.discountRate}
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        type="number"
                        className="w-full p-1 border-none outline-none"
                        value={item.discountAmount}
                        name="discountAmount"
                        onChange={(e) => handleItemChange(index, e)}
                        title={item?.discountAmount}
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        type="number"
                        className="w-full p-1 border-none outline-none"
                        value={item.netAmount}
                        name="netAmount"
                        // onChange={(e) => handleItemChange(index, e)}
                        title={item?.netAmount}
                      />
                    </td>
                    {formData.taxGroup !== "No Tax" &&
                      (formData.taxGroup === "State Tax" ? (
                        <>
                          <td className="border border-gray-300 p-0">
                            <div className="flex items-center gap-1">
                              <input
                                className="w-16 p-1 border-none outline-none "
                                name="cgst"
                                value={item.cgst}
                                onChange={(e) => handleItemChange(index, e)}
                                title={item?.cgst}
                              />
                              <span>
                                {item.netAmount && item.cgst
                                  ? `₹${(
                                      (parseFloat(item.netAmount) *
                                        parseFloat(item.cgst)) /
                                      100
                                    ).toFixed(2)}`
                                  : "₹0"}
                              </span>
                            </div>
                          </td>
                          <td className="border border-gray-300 p-0">
                            <div className="flex items-center gap-1">
                              <input
                                className="w-16 p-1 border-none outline-none"
                                name="sgst"
                                value={item.sgst}
                                onChange={(e) => handleItemChange(index, e)}
                                title={item?.sgst}
                              />
                              <span>
                                {item.netAmount && item.sgst
                                  ? `₹${(
                                      (parseFloat(item.netAmount) *
                                        parseFloat(item.sgst)) /
                                      100
                                    ).toFixed(2)}`
                                  : "₹0"}
                              </span>
                            </div>
                          </td>
                        </>
                      ) : (
                        <td className="border border-gray-300 p-0">
                          <div className="flex items-center gap-1">
                            <input
                              className="w-16 p-1 border-none outline-none"
                              name="igst"
                              value={item.igst}
                              onChange={(e) => handleItemChange(index, e)}
                              title={item?.igst}
                            />
                            <span>
                              {item.netAmount && item.igst
                                ? `₹${(
                                    (parseFloat(item.netAmount) *
                                      parseFloat(item.igst)) /
                                    100
                                  ).toFixed(2)}`
                                : "₹0"}
                            </span>
                          </div>
                        </td>
                      ))}

                    {formData.taxGroup !== "No Tax" && (
                      <>
                        <td className="border border-gray-300 p-0">
                          <input
                            type="text"
                            value={item.taxRate}
                            readOnly
                            className="w-full p-1 border-none outline-none"
                            title={item?.taxRate}
                          />
                        </td>
                        <td className="border border-gray-300 p-0">
                          <input
                            type="text"
                            value={
                              Number(parseFloat(item.taxAmount).toFixed(2)) || 0
                            }
                            readOnly
                            className="w-full p-1 border-none outline-none"
                            title={item?.taxAmount}
                          />
                        </td>
                      </>
                    )}
                    <td className="border border-gray-300 p-0">
                      <input
                        type="number"
                        className="w-full p-1 border-none outline-none"
                        name="amount"
                        value={Number(parseFloat(item.amount).toFixed(2)) || 0}
                        readOnly
                        title={item?.amount}
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
              <div className="w-80">
                {/* In the Totals Section, update the discount display */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-right">Gross Amount:</div>
                  <input
                    type="number"
                    className="border p-1 outline-none"
                    value={parseFloat(totals.grossAmount).toFixed(2)}
                    readOnly
                  />
                  <div className="text-right">Discount:</div>
                  <input
                    type="number"
                    className="border p-1 outline-none"
                    value={parseFloat(totals.discount).toFixed(2)}
                    readOnly
                  />
                  <div className="text-right">Taxable Amount:</div>
                  <input
                    type="number"
                    className="border p-1 bg-gray-50 outline-none"
                    value={parseFloat(totals.taxableAmount).toFixed(2)}
                    readOnly
                  />
                  <div className="text-right">Tax Amount:</div>
                  <input
                    type="number"
                    className="border p-1 bg-gray-50 outline-none"
                    value={parseFloat(totals.taxAmount).toFixed(2)}
                    readOnly
                  />
                  <div className="text-right font-bold">Grand Total:</div>
                  <input
                    type="number"
                    className="border p-1 bg-gray-50 font-bold outline-none"
                    value={parseFloat(totals.grandTotal).toFixed(2)}
                    readOnly
                  />
                  <div className="text-right">Transportation Charges:</div>
                  <input
                    type="number"
                    className="border p-1 bg-gray-50 outline-none"
                    value={totals.transportationCharges}
                    onChange={(e) => {
                      const transportationCharges = Number(e.target.value) || 0;

                      const totalPayableAmount =
                        (Number(totals.grandTotal) || 0) +
                        (Number(transportationCharges) || 0) +
                        (Number(totals.roundOff) || 0);

                      const updatedFormData = {
                        ...formData,
                        transportationCharges,
                        totalPayableAmount,
                      };

                      // console.log({
                      //   grandTotal: totals.grandTotal,
                      //   transportationCharges,
                      //   totalPayableAmount,
                      // });

                      setTotals(updatedFormData);
                    }}
                  />
                  <div className="text-right">Total:</div>
                  <input
                    type="number"
                    className="border p-1 bg-gray-50 outline-none"
                    value={(
                      Number(totals.transportationCharges || 0) +
                      Number(totals.grandTotal || 0)
                    ).toFixed(2)}
                    readOnly
                  />
                  <div className="text-right font-bold">Round Off:</div>
                  <input
                    type="number"
                    className="border p-1 bg-gray-50 font-bold outline-none"
                    value={totals.roundOff}
                    onChange={(e) => {
                      const roundOff = Number(parseFloat(e.target.value)) || 0;
                      const grandTotal =
                        Number(parseFloat(totals.grandTotal).toFixed(2)) || 0;
                      const transportationCharges =
                        Number(
                          parseFloat(totals.transportationCharges).toFixed(2)
                        ) || 0;
                      const total = grandTotal + transportationCharges;
                      const decimalPart = total % 1;
                      let totalPayableAmount = total;

                      if (decimalPart < 0.5) {
                        totalPayableAmount = total - roundOff;
                      } else if (decimalPart >= 0.5) {
                        totalPayableAmount = total + roundOff;
                      }

                      // console.log({
                      //   grandTotal,
                      //   transportationCharges,
                      //   total,
                      //   totalPayableAmount,
                      // });
                      setTotals((prev) => ({
                        ...prev,
                        roundOff,
                        totalPayableAmount,
                      }));
                    }}
                  />
                  <div className="text-right font-bold">
                    Total Payable Amount:
                  </div>
                  <input
                    type="number"
                    className="border p-1 bg-gray-50 font-bold outline-none"
                    value={parseFloat(totals.totalPayableAmount).toFixed(2)}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <SnigdhaServiceInvoice receiverDetails={formData} />
        )}

        {/* Action Buttons */}
        {formData.invoiceType === "service" ? null : (
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
        )}
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
                    <span className="font-semibold">Damage Quantity :</span>{" "}
                    {insufficientItemData.totalDamageQty || 0}
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
