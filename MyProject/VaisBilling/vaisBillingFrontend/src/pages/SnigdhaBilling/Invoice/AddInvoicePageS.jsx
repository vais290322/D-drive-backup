import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { backendDomainA, backendDomainS } from "../../../Common/index";
import SnigdhaServiceInvoice from "./SnigdhaServiceInvoice";

const New_Url = import.meta.env.VITE_REACT_INVOICE;
const Item_fetch_url = import.meta.env.VITE_REACT_FETCH_ITEMS_SIN;
const Customer_Url = import.meta.env.VITE_REACT_CUSTOMER_FETCH;
const invoiceFetchUrl = import.meta.env.VITE_BASE_URL_C;

const AddInvoicePageS = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Invoice</h1>
      <InvoiceForm />
    </div>
  );
};

export default AddInvoicePageS;

const InvoiceForm = () => {
  const [insufficientItemModal, setInsufficientItemModal] = useState(false);
  const [insufficientItemIndex, setInsufficientItemIndex] = useState(null);
  const [insufficientItemData, setInsufficientItemData] = useState(null);
  const [snigdhaItem, setSnigdhaItem] = useState(null);

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
      serviceCharge: "",
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
    roundOff: "0.00",
    totalPayableAmount: "0.00",
  });
  //------------------------ ITEM SUGGETION ---------------------------------------------------

  const [query, setQuery] = useState("");

  const [itemMainData, setItemMainData] = useState([]);
  // console.log(itemMainData)
  const [suggestions, setSuggestions] = useState([]);

  const [itemid, setitemid] = useState("");

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
          serviceCharge: suggestion?.serviceCharge || "",
        }));
      newItems[index].filteredSuggestions = filtered;
    } else {
      newItems[index].filteredSuggestions = [];
    }

    setItems(newItems);
  };

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
      serviceCharge: selectedItem?.serviceCharge || "",
      filteredSuggestions: [],
    };
    setItems(newItems);
  };

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
            serviceCharge: selectedItem?.serviceCharge || "",
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
      serviceCharge: "",
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
      const response = await fetch(`${Customer_Url}/s`, {
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

  const deleteRow = (index) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
      calculateTotals(newItems);
    }
  };

  // Fix 2: Update the handleFormDataChange function
  const handleFormDataChange = (e) => {
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

    setFormData(newFormData);

    if (name === "transportationCharges") {
      const updatedFormData = {
        ...formData,
        transportationCharges: value,
      };

      setTimeout(() => {
        const baseAmount =
          parseFloat(totals.taxableAmount) + parseFloat(totals.taxAmount);
        const transportCharges = Number(value) || 0;
        const serviceChargeTotal = parseFloat(totals.serviceChargeTotal) || 0;
        const grandTotal = baseAmount + transportCharges + serviceChargeTotal;

        setTotals((prev) => ({
          ...prev,
          grandTotal: grandTotal.toFixed(2),
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
        "serviceCharge",
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
      const serviceCharge = parseFloat(item.serviceCharge) || 0;
      const discountRate = parseFloat(item.discountRate) || 0;
      const grossAmount = quantity * sellingPrice;
      const discountAmount = (grossAmount * discountRate) / 100;
      const netAmount = grossAmount - discountAmount;

      // Include service charge in taxable amount
      const taxableAmount = netAmount + serviceCharge;

      // Handle tax rates based on tax group
      let totalTaxRate = 0;
      let taxAmount = 0;

      if (formData.taxGroup === "State Tax") {
        const gstRate = parseFloat(item.gst) || 0;
        totalTaxRate = gstRate;
        taxAmount = (taxableAmount * gstRate) / 100;
      } else if (formData.taxGroup === "Other Tax") {
        const igstRate = parseFloat(item.igst) || 0;
        totalTaxRate = igstRate;
        taxAmount = (taxableAmount * igstRate) / 100;
      }

      const amount =
        netAmount +
        serviceCharge +
        (formData.taxGroup === "No Tax" ? 0 : taxAmount);

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
        "serviceCharge",
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
  };

  const calculateTotals1 = (currentItems = items) => {
    const totals = currentItems.reduce(
      (acc, item) => ({
        grossAmount: acc.grossAmount + (parseFloat(item.grossAmount) || 0),
        discount: acc.discount + (parseFloat(item.discountAmount) || 0),
        taxableAmount: acc.taxableAmount + (parseFloat(item.netAmount) || 0),
        taxAmount:
          formData.taxGroup === "No Tax"
            ? 0
            : acc.taxAmount + (parseFloat(item.taxAmount) || 0),
      }),
      {
        grossAmount: 0,
        discount: 0,
        taxableAmount: 0,
        taxAmount: 0,
      }
    );

    const baseAmount =
      totals.taxableAmount +
      (formData.taxGroup === "No Tax" ? 0 : totals.taxAmount);

    const transportCharges = Number(formData.transportationCharges) || 0;

    const grandTotal = baseAmount + transportCharges;

    setTotals({
      discount: totals.discount.toFixed(2),
      taxableAmount: totals.taxableAmount.toFixed(2),
      taxAmount:
        formData.taxGroup === "No Tax" ? "0.00" : totals.taxAmount.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    });
  };

  const calculateTotals = (currentItems = items) => {
    const totals = currentItems.reduce(
      (acc, item) => {
        const serviceCharge = parseFloat(item.serviceCharge) || 0;

        const serviceChargeTotal = serviceCharge;

        return {
          grossAmount: acc.grossAmount + (parseFloat(item.grossAmount) || 0),
          discount: acc.discount + (parseFloat(item.discountAmount) || 0),
          taxableAmount: acc.taxableAmount + (parseFloat(item.netAmount) || 0),
          taxAmount:
            formData.taxGroup === "No Tax"
              ? 0
              : acc.taxAmount + (parseFloat(item.taxAmount) || 0),
          serviceChargeTotal: acc.serviceChargeTotal + serviceChargeTotal,
        };
      },
      {
        grossAmount: 0,
        discount: 0,
        taxableAmount: 0,
        taxAmount: 0,
        serviceChargeTotal: 0,
      }
    );

    const baseAmount =
      totals.taxableAmount +
      (formData.taxGroup === "No Tax" ? 0 : totals.taxAmount);

    const transportCharges = Number(formData.transportationCharges) || 0;

    const grandTotal =
      baseAmount + transportCharges + totals.serviceChargeTotal;

    setTotals({
      grossAmount: totals.grossAmount.toFixed(2),
      discount: totals.discount.toFixed(2),
      taxableAmount: totals.taxableAmount.toFixed(2),
      taxAmount:
        formData.taxGroup === "No Tax" ? "0.00" : totals.taxAmount.toFixed(2),
      serviceChargeTotal: totals.serviceChargeTotal.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    });
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
        serviceCharge: "",
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
  };

  // for round off

  const handleRoundOffChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setTotals((prev) => ({
      ...prev,
      roundOff: value.toString(),
    }));
  };

  useEffect(() => {
    const grandTotal = parseFloat(totals.grandTotal) || 0;
    const roundOff = parseFloat(totals.roundOff) || 0;
    let totalPayableAmount = grandTotal;

    if (roundOff !== 0) {
      const decimalPart = grandTotal % 1;

      // If decimal part is greater than 0.50, add the roundOff
      // If decimal part is less than or equal to 0.50, subtract the roundOff
      if (decimalPart > 0.5) {
        totalPayableAmount = grandTotal + roundOff;
      } else {
        totalPayableAmount = grandTotal - roundOff;
      }
    }

    setTotals((prev) => ({
      ...prev,
      totalPayableAmount: totalPayableAmount.toFixed(2),
    }));
  }, [totals.grandTotal, totals.roundOff]);

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
          formData.invoiceType === "prodectProforma"
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
          serviceCharge: parseFloat(item.serviceCharge) || 0,
          grossAmount: parseFloat(item.grossAmount) || 0,
          discountRate: parseFloat(item.discountRate) || 0,
          discountAmount: parseFloat(item.discountAmount) || 0,
          netAmount: parseFloat(item.netAmount) || 0,
          taxRate: parseFloat(item.taxRate) || 0,
          taxAmount: parseFloat(item.taxAmount) || 0,
          amount: parseFloat(item.amount) || 0,
        })),
        discount: parseFloat(totals.discount) || 0,
        grossAmount: parseFloat(totals.grossAmount) || 0,
        totalServiceCharge: parseFloat(totals.serviceChargeTotal) || 0,
        taxableAmount: parseFloat(totals.taxableAmount) || 0,
        taxAmount: parseFloat(totals.taxAmount) || 0,
        grandTotal: parseFloat(totals.grandTotal) || 0,
        roundOff: parseFloat(totals.roundOff) || 0,
        totalPayableAmount:
          parseFloat(totals.totalPayableAmount) ||
          parseFloat(totals.grandTotal) ||
          0,
        sequence: sequence,
      };

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
            formData.invoiceType === "prodectProforma" ? (
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
                  <th className="border border-gray-300 p-1 font-normal w-20">
                    Service Charge
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
                        value={item.query}
                        onChange={(e) => handleItemQueryChange(index, e)}
                      />
                      {item.filteredSuggestions.length > 0 && (
                        <ul className="absolute w-auto bg-white border border-gray-200 rounded-md mt-1 shadow-md z-10">
                          {item.filteredSuggestions.map((suggestion, idx) => (
                            // console.log("sugge: ", suggestion),
                            <li
                              key={idx}
                              className="p-2 cursor-pointer hover:bg-blue-100"
                              onClick={() => handleSelect(index, suggestion)}
                            >
                              {suggestion?.name} (quantity:{" "}
                              {suggestion?.quantity}) (sellingPrice:{" "}
                              {suggestion?.sellingPrice})
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
                            <div className="flex items-center gap-1">
                              <input
                                className="w-10 p-1 border-none outline-none"
                                name="cgst"
                                value={item.cgst}
                                readOnly
                              />
                              <span>
                                {item.netAmount && item.cgst
                                  ? `₹${(
                                      (parseFloat(item.netAmount) *
                                        parseFloat(item.cgst)) /
                                      100
                                    ).toFixed(2)}`
                                  : "₹0.00"}
                              </span>
                            </div>
                          </td>
                          <td className="border border-gray-300 p-0">
                            <div className="flex items-center gap-1">
                              <input
                                className="w-10 p-1 border-none outline-none"
                                name="sgst"
                                value={item.sgst}
                                readOnly
                              />
                              <span>
                                {item.netAmount && item.sgst
                                  ? `₹${(
                                      (parseFloat(item.netAmount) *
                                        parseFloat(item.sgst)) /
                                      100
                                    ).toFixed(2)}`
                                  : "₹0.00"}
                              </span>
                            </div>
                          </td>
                        </>
                      ) : (
                        <td className="border border-gray-300 p-0">
                          <div className="flex items-center gap-1">
                            <input
                              className="w-10 p-1 border-none outline-none"
                              name="igst"
                              value={item.igst}
                              readOnly
                            />
                            <span>
                              {item.netAmount && item.igst
                                ? `₹${(
                                    (parseFloat(item.netAmount) *
                                      parseFloat(item.igst)) /
                                    100
                                  ).toFixed(2)}`
                                : "₹0.00"}
                            </span>
                          </div>
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
                        className="w-full p-1 border-none outline-none"
                        name="serviceCharge"
                        value={item.serviceCharge}
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
                  <div className="text-right">Gross Amount:</div>
                  <input
                    type="number"
                    className="border p-1 outline-none"
                    value={totals.grossAmount}
                    readOnly
                  />
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
                  <div className="text-right">Service Charges:</div>
                  <input
                    type="number"
                    className="border p-1 bg-gray-50 outline-none"
                    value={totals.serviceChargeTotal}
                    readOnly
                  />
                  <div className="text-right font-bold">Grand Total:</div>
                  <input
                    type="number"
                    className="border p-1 bg-gray-50 font-bold outline-none"
                    value={totals.grandTotal}
                    readOnly
                  />

                  <div className="text-right font-bold">Round Off:</div>
                  <input
                    type="number"
                    className="border p-1 bg-gray-50 font-bold outline-none"
                    value={totals.roundOff}
                    onChange={handleRoundOffChange}
                    step={0.01}
                  />
                  <div className="text-right font-bold">
                    Total Payable Amount:
                  </div>
                  <input
                    type="number"
                    className="border p-1 bg-gray-50 font-bold outline-none"
                    value={totals.totalPayableAmount}
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
                Insufficient Item, please reduce the quantity.
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
