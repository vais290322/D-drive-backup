import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PdfFormate from "./PdfFormate";
import { backendDomainA, backendDomainS } from "../../../Common/index";
import axios from "axios";
import ServiceInvoicepage from "./Service";
import ProformBill from "./ProformBill";
import ServiceProforma from "./ServiceProforma";

const New_Url = import.meta.env.VITE_REACT_INVOICE_MNS;
const Item_fetch_url = import.meta.env.VITE_REACT_FETCH_ITEMS;
const Customer_Url = import.meta.env.VITE_REACT_CUSTOMER_FETCH;

const AddInvoicePage = () => {
  return (
    <div className=" mx-auto px-2 py-4">
      <h1 className="text-2xl font-bold mb-6">Create New Invoice for MNS </h1>
      <InvoiceForm />
    </div>
  );
};

export default AddInvoicePage;

const InvoiceForm = () => {
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [insufficientItemModal, setInsufficientItemModal] = useState(false);
  const [insufficientItemIndex, setInsufficientItemIndex] = useState(null);
  const [insufficientItemData, setInsufficientItemData] = useState(null);
  const [snigdhaItem, setSnigdhaItem] = useState(null);
  const [isLoadingSnigdhaItem, setIsLoadingSnigdhaItem] = useState(false);
  const [quantityToAdd, setQuantityToAdd] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [billNumber, setBillNumber] = useState("");
  const [itemMainData, setItemMainData] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [itemid, setitemid] = useState("");
  const currentDate = new Date();
  const [transportationPercentage, setTransportationPercentage] = useState(0);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    taxGroup: "State Tax",
    paymentType: "cash",
    customerName: "",
    invoiceNumber: "",
    monthYear: "",
    year: "",
    vendorCode: "",
    location: "",
    transportationCharges: 0,
    invoiceType: "product",
    state: "",
    phone: "",
    address: "",
    gstnumber: "",
    id: Math.floor(100000 + Math.random() * 900000),
    poNumber: "", // <-- Add this line
    poDate: "",
    pf: "",
    esi: "",
    formDate: "",
    toDate: "",
    bankName: "",
    branch: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    remark: "",
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
      cgst: "",
      sgst: "",
      igst: "",
      gst: "",
      uom: "",
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

  const [totals, setTotals] = useState({
    discount: "0.00",
    taxableAmount: "0.00",
    taxAmount: "0.00",
    grandTotal: "0.00",
    roundOff: 0.0,
    totalPayableAmount: 0.0,
  });

  // handler for roundOff input
  const handleRoundOffChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setTotals((prev) => ({
      ...prev,
      roundOff: value,
    }));
  };

  // Calculate totalPayableAmount whenever grandTotal or roundOff changes
  useEffect(() => {
    const grandTotal = parseFloat(totals.grandTotal) || 0;
    const roundOff = parseFloat(totals.roundOff) || 0;
    let totalPayableAmount = grandTotal;

    if (roundOff !== 0) {
      const decimalPart = grandTotal % 1;

      if (decimalPart < 0.5) {
        totalPayableAmount = grandTotal - roundOff;
      } else {
        totalPayableAmount = grandTotal + roundOff;
      }
    }

    // console.log("Total Payable Amount:", totalPayableAmount);

    setTotals((prev) => ({
      ...prev,
      totalPayableAmount: totalPayableAmount.toFixed(2),
    }));
  }, [totals.grandTotal, totals.roundOff]);

  //------------------------ ITEM SUGGETION ---------------------------------------------------

  const fetchUnit = async () => {
    try {
      const response = await axios.get(
        `${backendDomainA}/api/v1/units/all-units`
      );

      setSelectedUnit(response?.data?.data);
    } catch (error) {
      // console.error("Error fetching clients:", error);
      toast.error("Failed to fetch units");
    }
  };

  useEffect(() => {
    fetchUnit();
  }, []);

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

  const handleSelect = (index, suggestion) => {
    const selectedItem = itemMainData.find(
      (item) => item._id === suggestion.id
    );
    const newItems = [...items];

    // Get the GST value from the selected item
    const gstValue = selectedItem?.gst || "0";

    newItems[index] = {
      ...newItems[index],
      query: suggestion.name,
      itemName: suggestion.name,
      itemid: suggestion.itemid,
      iditem: suggestion.id,
      hsnCode: selectedItem?.hsnCode || "",
      gst: gstValue,
      uom: selectedItem?.uom || "",
      group: selectedItem?.group || "",
      unitPrice: selectedItem?.unit_prize || "",
      sellingPrice: selectedItem?.sellingPrice || "",
      filteredSuggestions: [],
    };

    // Set tax values based on tax group
    if (formData.taxGroup === "State Tax") {
      newItems[index].cgst = (parseFloat(gstValue) / 2).toString();
      newItems[index].sgst = (parseFloat(gstValue) / 2).toString();
      newItems[index].igst = "0";
    } else {
      newItems[index].cgst = "0";
      newItems[index].sgst = "0";
      newItems[index].igst = gstValue;
    }

    setItems(newItems);
  };

  // Update the useEffect that sets item data when query and itemid change
  useEffect(() => {
    if (query && itemid) {
      const filtered = itemMainData.filter(
        (customer) => customer._id === itemid
      );
      if (filtered.length > 0) {
        const selectedItem = filtered[0];
        const gstValue = selectedItem.gst || "0";

        setItems((prev) => {
          const updatedItems = [...prev];
          updatedItems[0] = {
            ...updatedItems[0],
            itemName: selectedItem.item_name || "",
            hsnCode: selectedItem.hsnCode || "",
            gst: gstValue,
            unitPrice: selectedItem.unit_prize || "",
            sellingPrice: selectedItem?.sellingPrice || "",
          };

          // Set tax values based on tax group
          if (formData.taxGroup === "State Tax") {
            updatedItems[0].cgst = (parseFloat(gstValue) / 2).toString();
            updatedItems[0].sgst = (parseFloat(gstValue) / 2).toString();
            updatedItems[0].igst = "0";
          } else {
            updatedItems[0].cgst = "0";
            updatedItems[0].sgst = "0";
            updatedItems[0].igst = gstValue;
          }

          return updatedItems;
        });
      }
    }
  }, [query, itemid, itemMainData, formData.taxGroup]);

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
            cgst: selectedItem.cgst ? selectedItem.cgst : "0",
            sgst: selectedItem.sgst ? selectedItem.sgst : "0",
            igst: selectedItem.igst ? selectedItem.igst : "0",
            unitPrice: selectedItem.unit_prize || "",
            sellingPrice: selectedItem?.sellingPrice || "",
          },
        ]);
      }
    }
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
      // console.log("sdjajd", data.data);

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
      // console.error("Error generating item details:", error);
    }
  };

  //------------------------- Customer Name----------------------------------------------------

  const [customerid, setCustomerid] = useState("");
  const [customerMainData, setCustomerMainData] = useState([]);
  const [customerSuggestionsList, setcustomerSuggestionsList] = useState([]);
  const [customerQuery, setCustomerQuery] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState([]);

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
          gstnumber: customer.gstNumber || "",
          state: customer.state || "",
          id: customer.id || "",
        }));
      }
    }
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

      if (data && data.data && Array.isArray(data.data)) {
        setCustomerMainData(data.data);
        // Map only the customer names to the suggestions list
        setcustomerSuggestionsList(
          data.data
            .map((customer) => ({
              name: customer.companyName || "",
              email: customer.companyEmail || "",
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
        } else {
          return {
            ...item,
            cgst: "0",
            sgst: "0",
            igst: gstValue,
          };
        }
      });

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

  const calculateItemFields = (item, sourceField) => {
    if (sourceField === "amount" && item.amount) {
      const amount = parseFloat(item.amount) || 0;
      const quantity = parseFloat(item.quantity) || 1;
      const discountRate = parseFloat(item.discountRate) || 0;

      // Calculate total tax rate based on tax group
      let totalTaxRate = 0;
      if (formData.taxGroup === "State Tax") {
        const cgstRate = parseFloat(item.cgst) || 0;
        const sgstRate = parseFloat(item.sgst) || 0;
        totalTaxRate = cgstRate + sgstRate;
      } else if (formData.taxGroup === "Other Tax") {
        totalTaxRate = parseFloat(item.igst) || 0;
      } else if (formData.taxGroup === "No Tax") {
        totalTaxRate = 0;
      }

      // Calculate backwards from amount
      const netAmountWithTax = amount / (1 + totalTaxRate / 100);
      const taxAmount =
        formData.taxGroup === "No Tax" ? 0 : amount - netAmountWithTax;
      const netAmount = netAmountWithTax;
      const grossAmount = netAmount / (1 - discountRate / 100);
      const discountAmount = grossAmount - netAmount;
      const unitPrice = grossAmount / quantity;
      const sellingPrice = grossAmount / quantity;

      return {
        grossAmount: grossAmount.toFixed(2),
        unitPrice: unitPrice.toFixed(2),
        sellingPrice: sellingPrice.toFixed(2),
        discountAmount: discountAmount,
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

      // Calculate total tax rate based on tax group
      let totalTaxRate = 0;
      if (formData.taxGroup === "State Tax") {
        const cgstRate = parseFloat(item.cgst) || 0;
        const sgstRate = parseFloat(item.sgst) || 0;
        totalTaxRate = cgstRate + sgstRate;
      } else if (formData.taxGroup === "Other Tax") {
        totalTaxRate = parseFloat(item.igst) || 0;
      } else if (formData.taxGroup === "No Tax") {
        totalTaxRate = 0;
      }

      const grossAmount = quantity * sellingPrice;
      const discountAmount = (grossAmount * discountRate) / 100;
      const netAmount = grossAmount - discountAmount;
      const taxAmount =
        formData.taxGroup === "No Tax" ? 0 : (netAmount * totalTaxRate) / 100;
      const amount = netAmount + taxAmount;

      return {
        grossAmount: grossAmount.toFixed(2),
        discountAmount: discountAmount,
        netAmount: netAmount.toFixed(2),
        taxRate: totalTaxRate.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        amount: amount.toFixed(2),
      };
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...items];

    // Update the item with the new value
    newItems[index] = {
      ...newItems[index],
      [name]: value,
    };
    if (name === "discountAmount") {
      const grossAmount = Number(newItems[index].grossAmount) || 0;
      const discountAmount = Number(value) || 0;
      let discountRate = 0;
      if (grossAmount > 0) {
        discountRate = (discountAmount / grossAmount) * 100;
      }
      newItems[index].discountRate = discountRate;
      newItems[index].discountAmount = value; // Ensure discountAmount is set
    } else if (name === "discountRate") {
      const grossAmount = Number(newItems[index].grossAmount) || 0;
      const discountRate = Number(value) || 0;
      const discountAmount = (grossAmount * discountRate) / 100;
      newItems[index].discountAmount = discountAmount.toFixed(2);
    }
    // If GST is changed, update CGST, SGST, and IGST accordingly
    if (name === "gst") {
      const gstValue = value || "0";
      if (formData.taxGroup === "State Tax") {
        newItems[index].cgst = (parseFloat(gstValue) / 2).toString();
        newItems[index].sgst = (parseFloat(gstValue) / 2).toString();
        newItems[index].igst = "0";
      } else {
        newItems[index].cgst = "0";
        newItems[index].sgst = "0";
        newItems[index].igst = gstValue;
      }
    }

    // If CGST or SGST is changed directly, update GST and the other tax
    if (name === "cgst" && formData.taxGroup === "State Tax") {
      const cgstValue = parseFloat(value) || 0;
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

    if (name === "quantity") {
      setItems(newItems);
      setTimeout(() => {
        const currentItem = newItems[index];
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
    if (
      [
        "quantity",
        "unitPrice",
        "sellingPrice",
        "discountRate",
        "discountAmount",
        "cgst",
        "sgst",
        "igst",
        "gst",
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
        `${backendDomainS}/api/v1/inventory/current-items/hsn/${insufficientItemData.hsnCode}`
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

  const addProductToMNS = async () => {
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
      const transferData = {
        hsnCode: insufficientItemData.hsnCode,
        quantity: quantityToAdd,
      };
      const response = await axios.post(
        `${backendDomainS}/api/v1/inventory/snig-transfer-by-hsn`,
        transferData
      );
      if (response.data.success) {
        toast.success(
          `Successfully added ${quantityToAdd} units to MNS inventory`
        );
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
        setShowAddForm(false);
        setQuantityToAdd("");
        setSnigdhaItem(null);
        setInsufficientItemModal(false);
        setInsufficientItemIndex(null);
        setInsufficientItemData(null);
      } else {
        toast.error(response.data.message || "Failed to transfer inventory");
      }
    } catch (error) {
      toast.error("Failed to add product to MNS inventory");
    } finally {
      setIsLoadingSnigdhaItem(false);
    }
  };

  const handleCancelInsufficientItem = () => {
    if (insufficientItemIndex !== null) {
      const updatedItems = [...items];
      updatedItems[insufficientItemIndex] = {
        ...updatedItems[insufficientItemIndex],
        quantity: "",
      };
      setItems(updatedItems);
      calculateTotals(updatedItems);
    }
    setInsufficientItemModal(false);
    setInsufficientItemIndex(null);
    setInsufficientItemData(null);
    setSnigdhaItem(null);
    setShowAddForm(false);
    setQuantityToAdd("");
  };

  useEffect(() => {
    if (!Number(totals.taxableAmount)) return;

    const amountWithTax =
      Number(totals.taxableAmount) + Number(totals.taxAmount);
    const transportationPercentage =
      (Number(formData.transportationCharges) / amountWithTax) * 100;

    setTransportationPercentage(
      transportationPercentage === 0 ? 0 : Math.round(transportationPercentage)
    );
    const grandTotalWithTransportCharge =
      Number(totals.taxableAmount) +
      Number(totals.taxAmount) +
      Number(formData.transportationCharges || 0);

    setTotals((prev) => ({
      ...prev,
      grandTotal: grandTotalWithTransportCharge.toFixed(2),
      // totalPayableAmount: grandTotal-roundOff
    }));
  }, [formData.transportationCharges, totals.taxableAmount, totals.taxAmount]);

  const calculateTotals = (currentItems = items) => {
    const totalDiscount = currentItems?.reduce(
      (sum, item) => sum + (parseFloat(item.discountAmount) || 0),
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
    const grandTotalWithoutTransport = totalTaxableAmount + totalTax;
    const transportationCharges =
      parseFloat(formData.transportationCharges) || 0;
    const grandTotalWithTransportCharge =
      grandTotalWithoutTransport + transportationCharges;

    setTotals((prev) => ({
      ...prev,
      discount: totalDiscount.toFixed(2),
      taxableAmount: totalTaxableAmount.toFixed(2),
      taxAmount: totalTax.toFixed(2),
      grandTotal: grandTotalWithTransportCharge.toFixed(2),
      // totalPayableAmount will be set by useEffect
    }));
  };

  const handleSave = async () => {
    try {
      if (!customerQuery) {
        toast.error("Please enter customer name");
        return;
      }
      if (
        !items[0].itemName ||
        !items[0].quantity ||
        !items[0].unitPrice ||
        !items[0].sellingPrice
      ) {
        toast.error(
          "Please fill in at least one item with name, quantity, and unit price"
        );
        return;
      }

      // Make sure we have the latest grand total calculation
      const currentGrandTotal =
        Number(totals.taxableAmount) +
        Number(totals.taxAmount) +
        Number(formData.transportationCharges || 0);

      const payload = {
        receiverDetails: {
          name: customerQuery,
          state: formData.state,
          phoneNumber: formData.phone,
          address:
            typeof formData.address === "object"
              ? formData.address
                .map((part) => (part.includes("/") ? `"${part}"` : part))
                .join(", ")
              : formData.address,
          gstin: formData.gstnumber,
          id: String(formData.id),
        },
        invoiceNumber: billNumber,
        date: formData.date,
        customerName: customerQuery,
        taxGroup: formData.taxGroup,
        paymentType: formData.paymentType,
        location: formData.location || "",
        monthYear: formData.monthYear || "",
        year: formData.year || "",
        pf: formData.pf || "",
        esi: formData.esi || "",
        formDate: formData.formDate || "",
        toDate: formData.toDate || "",
        vendorCode: formData.vendorCode || "",
        poDate: formData.poDate,
        poNumber: formData.poNumber,
        remark: formData.remark,
        transportationCharges: parseFloat(formData.transportationCharges) || 0,
        items: items.map((item) => ({
          item_id: item.itemid,
          itemName: item.itemName || "",
          description: item.description || "",
          group: item.group || "",
          quantity: parseFloat(item.quantity) || 0,
          unit: item?.uom || item.unit || "",
          hsnCode: item.hsnCode || "",
          cgst: parseFloat(item.cgst) || 0,
          sgst: parseFloat(item.sgst) || 0,
          igst: parseFloat(item.igst) || 0,
          unitPrice: parseFloat(item.unitPrice) || 0,
          sellingPrice: parseFloat(item.sellingPrice) || 0,
          grossAmount: parseFloat(item.grossAmount) || 0,
          discountRate: parseFloat(item.discountRate) || 0,
          discountAmount: item.discountAmount || 0,
          netAmount: parseFloat(item.netAmount) || 0,
          taxRate: parseFloat(item.taxRate) || 0,
          taxAmount: parseFloat(item.taxAmount) || 0,
          amount: parseFloat(item.amount) || 0,
        })),
        discount: parseFloat(totals.discount) || 0,
        taxableAmount: parseFloat(totals.taxableAmount) || 0,
        taxAmount: parseFloat(totals.taxAmount) || 0,
        grandTotal: currentGrandTotal || 0,
        roundOff: parseFloat(totals.roundOff) || 0,
        totalPayableAmount:
          parseFloat(totals.totalPayableAmount) || currentGrandTotal || 0,
        bankName: formData.bankName || "",
        accountNumber: formData.accountNumber || "",
        branch: formData.branch || "",
        ifscCode: formData.ifscCode || "",
        accountHolderName: formData.accountHolderName || "",
      };

      // console.log("Payload:", payload);
      // return;

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
        console.error("Error:", errorData.message);
        throw new Error(errorData.message || "Failed to save invoice");
      }
      const data = await response.json();
      if (data.success === true) {
        toast.success(data.message);
        resetForm();
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error.message || "Error saving invoice");
    }
  };

  const resetForm = () => {
    setFormData({
      date: currentDate.toISOString().split("T")[0],
      taxGroup: "State Tax",
      paymentType: "cash",
      customerName: "",
      invoiceNumber: "",
      monthYear: "",
      year: "",
      vendorCode: "",
      transportationCharges: "",
      location: "",
      invoiceType: "product",
      state: "",
      phone: "",
      address: "",
      gstnumber: "",
      poDate: "",
      poNumber: "",
      id: Math.floor(100000 + Math.random() * 900000),
      pf: "",
      esi: "",
      formDate: "",
      toDate: "",
    });
    setCustomerQuery("");
    setCustomerid("");
    setCustomerSuggestions([]);
    setBillNumber("");
    setItems([
      {
        id: 1,
        query: "",
        filteredSuggestions: [],
        itemName: "",
        itemid: "",
        iditem: "",
        description: "",
        group: "",
        unit: "",
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
        transportationCharges: "",
      },
    ]);
    setTotals({
      discount: "0.00",
      taxableAmount: "0.00",
      taxAmount: "0.00",
      grandTotal: "0.00",
      roundOff: 0.0,
      totalPayableAmount: 0.0,
    });
  };

  return (
    <div className=" ">
      <div className="bg-white px-5 py-5 shadow-lg rounded-xl">
        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex gap-4">
            <div>
              <label className="block text-gray-600 mb-1">Invoice Number</label>
              <input
                type="text"
                name="billNumber"
                value={billNumber}
                placeholder="Enter Invoice Number"
                className="border p-1"
                onChange={(e) => {
                  setBillNumber(e.target.value);
                  setFormData({ ...formData, invoiceNumber: e.target.value });
                }}
                required
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
                <option value="serviceProforma">Service Proforma</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 items-center justify-center mt-5">
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
        <div className="flex gap-4 mb-4 text-sm ">
          <div className="">
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
                    onClick={() =>
                      handleCustomerSelect(customer.name, customer.id)
                    }
                  >
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-xs text-gray-500">
                      {customer.email}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* {formData.invoiceType === "product" ||
            formData.invoiceType === "prodectProforma" ? ( */}
            <>
              <div>
                <label className="block text-gray-600 mb-1">PO Number</label>
                <input
                  type="text"
                  className="border p-1 w-full"
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleFormDataChange}
                  placeholder="Enter PO Number"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">PO Date</label>
                <input
                  type="date"
                  className="border p-1 w-full"
                  name="poDate"
                  value={formData.poDate}
                  onChange={handleFormDataChange}
                  placeholder="Select PO Date"
                />
              </div>
            </>
          {/* ) : null} */}
          {formData.invoiceType === "service" || formData.invoiceType === "serviceProforma" ? (
            <div className="flex gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Month</label>
                <input
                  type="text"
                  name="monthYear"
                  value={formData?.monthYear}
                  onChange={handleFormDataChange}
                  className="border w-full p-1 "
                ></input>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData?.year}
                  onChange={handleFormDataChange}
                  className="border w-full p-1 "
                ></input>
              </div>
            </div>
          ) : null}

          <div>
            <label className="block text-gray-600 mb-1">Vendor Code</label>
            <input
              type="text"
              name="vendorCode"
              value={formData?.vendorCode}
              onChange={handleFormDataChange}
              className="border w-full p-1 "
              placeholder="Enter Vendor Code"
            ></input>
          </div>
          <div>
            {formData.invoiceType === "service" ||
              formData.invoiceType === "serviceProforma" ? (
              <label className="block text-gray-600 mb-1">Site</label>
            ) : (
              <label className="block text-gray-600 mb-1">Location</label>
            )}
            <input
              type="text"
              name="location"
              value={formData?.location}
              onChange={handleFormDataChange}
              className="border w-full p-1 "
              placeholder={
                formData.invoiceType === "service" ||
                  formData.invoiceType === "serviceProforma"
                  ? "Enter Site"
                  : "Enter Location"
              }
            />
          </div>
        </div>

        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-4 mb-4 text-sm">
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

            {formData.invoiceType === "product" ? (
              <div className="w-full">
                <label className="block text-gray-600 mb-1">
                  Transportation Charges(
                  {`${String(transportationPercentage) || 0}%`})
                </label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  name="transportationCharges"
                  value={formData.transportationCharges}
                  onChange={handleFormDataChange}
                  placeholder="Enter Charges"
                />
              </div>
            ) : formData.invoiceType === "prodectProforma" ? (
              <div className="w-full">
                <label className="block text-gray-600 mb-1">
                  Transportation Charges(
                  {`${String(transportationPercentage) || 0}%`})
                </label>
                <input
                  type="number"
                  className="border p-2 w-full"
                  name="transportationCharges"
                  value={formData.transportationCharges}
                  onChange={handleFormDataChange}
                  placeholder="Enter Charges"
                />
              </div>
            ) : null}
          </div>

          {formData.invoiceType === "service" || formData.invoiceType === "serviceProforma" ? (
            <div className="flex gap-8 mb-4 text-sm">
              <div className="">
                <label className="block text-gray-600 mb-1">PF</label>
                <input
                  type="text"
                  name="pf"
                  value={formData?.pf}
                  onChange={handleFormDataChange}
                  className="border w-full p-1 "
                ></input>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">ESI</label>
                <input
                  type="text"
                  name="esi"
                  value={formData?.esi}
                  onChange={handleFormDataChange}
                  className="border w-full p-1 "
                ></input>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">From Date</label>
                <input
                  type="date"
                  name="formDate"
                  value={formData?.formDate}
                  onChange={handleFormDataChange}
                  className="border w-full p-1 "
                ></input>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={formData?.toDate}
                  onChange={handleFormDataChange}
                  className="border w-full p-1 "
                ></input>
              </div>
              <div className=" w-full">
                <label className="block text-gray-600 mb-1">Remarks</label>
                <input
                  type="text"
                  name="remark"
                  value={formData?.remark}
                  onChange={handleFormDataChange}
                  className="border w-full p-1 "
                ></input>
              </div>
            </div>
          ) : null}
        </div>

        {/* bank section  */}
        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-4 mb-4 text-sm">
            <div className="w-full">
              <label className="block text-gray-600 mb-1">Bank Name</label>
              <input
                type="text"
                className="border p-2 w-full"
                name="bankName"
                value={formData.bankName}
                onChange={handleFormDataChange}
                placeholder="Enter Bank Name"
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-600 mb-1">Branch</label>
              <input
                type="text"
                className="border p-2 w-full"
                name="branch"
                value={formData.branch}
                onChange={handleFormDataChange}
                placeholder="Enter Branch Name"
              />
            </div>

            {/* account number */}
            <div className="w-full">
              <label className="block text-gray-600 mb-1">Account Number</label>
              <input
                type="text"
                className="border p-2 w-full"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleFormDataChange}
                placeholder="Enter Account Number"
              />
            </div>
            {/* IFSC */}
            <div className="w-full">
              <label className="block text-gray-600 mb-1">IFSC Code</label>
              <input
                type="text"
                className="border p-2 w-full"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleFormDataChange}
                placeholder="Enter IFSC Code"
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-600 mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                className="border p-2 w-full"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleFormDataChange}
                placeholder="Enter Account Holder Name"
              />
            </div>
          </div>
        </div>

        {/* Items Table */}
        {formData.invoiceType === "product" ? (
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

                {formData.taxGroup === "State Tax" ? (
                  <>
                    <th
                      className="border border-gray-300 p-1 font-normal w-20"
                      style={{
                        display: formData.taxGroup === "No Tax" ? "none" : "",
                      }}
                    >
                      CGST(%)
                    </th>
                    <th
                      className="border border-gray-300 p-1 font-normal w-20"
                      style={{
                        display: formData.taxGroup === "No Tax" ? "none" : "",
                      }}
                    >
                      SGST(%)
                    </th>
                  </>
                ) : formData.taxGroup === "Other Tax" ? (
                  <th
                    className="border border-gray-300 p-1 font-normal w-20"
                    style={{
                      display: formData.taxGroup === "No Tax" ? "none" : "",
                    }}
                  >
                    IGST(%)
                  </th>
                ) : null}

                {formData.taxGroup !== "No Tax" && (
                  <>
                    <th className="border border-gray-300 p-1 font-normal w-20">
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
                      title={item?.query}
                    />
                    {item.filteredSuggestions.length > 0 && (
                      <ul className="absolute w-auto bg-white border border-gray-200 rounded-md mt-1 shadow-md z-10">
                        {item.filteredSuggestions.map((suggestion, idx) => (
                          <li
                            key={idx}
                            className="p-2 cursor-pointer hover:bg-blue-100"
                            onClick={() => handleSelect(index, suggestion)}
                          >
                            {suggestion?.name} (quantity: {suggestion?.quantity}
                            ) (sellingPrice: {suggestion?.sellingPrice})
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
                      className="p-1 w-16 outline-none "
                      name="uom"
                      value={item.uom}
                      onChange={(e) => handleItemChange(index, e)}
                      title={item?.uom}
                    ></input>
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      className="p-1 w-30 outline-none"
                      name="group"
                      value={item.group}
                      onChange={(e) => handleItemChange(index, e)}
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
                      className="w-full p-1 border-none outline-none"
                      name="unitPrice"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, e)}
                      title={item?.unitPrice}
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="number"
                      className="w-20 p-1 border-none outline-none"
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
                      onChange={(e) => handleItemChange(index, e)}
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
                      name="discountAmount"
                      value={item.discountAmount || ""}
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
                      onChange={(e) => handleItemChange(index, e)}
                      title={item?.netAmount}
                    />
                  </td>

                  {formData.taxGroup === "State Tax" ? (
                    <>
                      <td
                        className="border border-gray-300 p-0"
                        style={{
                          display: formData.taxGroup === "No Tax" ? "none" : "",
                        }}
                      >
                        <div className="flex items-center">
                          <input
                            className="w-full p-1 border-none outline-none"
                            name="cgst"
                            value={item.cgst}
                            onChange={(e) => handleItemChange(index, e)}
                            title=
                            {(
                              (parseFloat(item.cgst || 0) / 100) *
                              parseFloat(item.grossAmount || 0)
                            ).toFixed(2)}
                          />
                          {/* <span className="ml-1 text-xs text-gray-500">
                            ₹
                            {(
                              (parseFloat(item.cgst || 0) / 100) *
                              parseFloat(item.grossAmount || 0)
                            ).toFixed(2)}
                          </span> */}
                        </div>
                      </td>
                      <td
                        className="border border-gray-300 p-0"
                        style={{
                          display: formData.taxGroup === "No Tax" ? "none" : "",
                        }}
                      >
                        <div className="flex items-center">
                          <input
                            className="w-full p-1 border-none outline-none"
                            name="sgst"
                            value={item.sgst}
                            onChange={(e) => handleItemChange(index, e)}
                            title={(
                              (parseFloat(item.sgst || 0) / 100) *
                              parseFloat(item.grossAmount || 0)
                            ).toFixed(2)}
                          />
                          {/* <span className="ml-1 text-xs text-gray-500">
                            ₹
                            {(
                              (parseFloat(item.sgst || 0) / 100) *
                              parseFloat(item.grossAmount || 0)
                            ).toFixed(2)}
                          </span> */}
                        </div>
                      </td>
                    </>
                  ) : formData.taxGroup === "Other Tax" ? (
                    <td
                      className="border border-gray-300 p-0"
                      style={{
                        display: formData.taxGroup === "No Tax" ? "none" : "",
                      }}
                    >
                      <div className="flex items-center">
                        <input
                          className="w-full p-1 border-none outline-none"
                          name="igst"
                          value={item.igst}
                          onChange={(e) => handleItemChange(index, e)}
                          title={(
                            (parseFloat(item.igst || 0) / 100) *
                            parseFloat(item.grossAmount || 0)
                          ).toFixed(2)}
                        />
                        {/* <span className="ml-1 text-xs text-gray-500">
                          ₹
                          {(
                            (parseFloat(item.igst || 0) / 100) *
                            parseFloat(item.grossAmount || 0)
                          ).toFixed(2)}
                        </span> */}
                      </div>
                    </td>
                  ) : null}

                  {formData.taxGroup !== "No Tax" && (
                    <>
                      <td className="border border-gray-300 p-0">
                        <input
                          type="number"
                          className="w-full p-1 border-none outline-none"
                          name="taxRate"
                          value={item.taxRate}
                          onChange={(e) => handleItemChange(index, e)}
                          title={item?.taxRate}
                        />
                      </td>
                      <td className="border border-gray-300 p-0">
                        <input
                          type="number"
                          className="w-full p-1 border-none  outline-none"
                          value={item.taxAmount}
                          name="taxAmount"
                          onChange={(e) => handleItemChange(index, e)}
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
                      value={item.amount}
                      onChange={(e) => {
                        handleItemChange(index, {
                          target: {
                            name: "amount",
                            value: e.target.value,
                          },
                        });
                      }}
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
        ) : null}

        {/* Totals Section if user select the product the total calculation will be visible */}
        {formData.invoiceType === "product" ? (
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
                <div className="text-right font-bold">Round Off :</div>
                <input
                  type="number"
                  step="0.0001"
                  className="border p-1 bg-gray-50 font-bold outline-none"
                  value={totals.roundOff}
                  onChange={handleRoundOffChange}
                />
                <div className="text-right font-bold">
                  Total Payable Amount :
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
        ) : formData.invoiceType === "service" ? (
          <ServiceInvoicepage customerDetails={formData} />
        ) : formData.invoiceType === "prodectProforma" ? (
          <ProformBill customerDetails={formData} />
        ) : (
          <ServiceProforma customer={formData} />
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          {formData.invoiceType === "product" ? (
            <button
              onClick={handleSave}
              className="px-12 py-1 text-lg cursor-pointer bg-gray-100 border hover:bg-gray-200"
            >
              Save
            </button>
          ) : null}
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
                Insufficient Item, please add from Snigdha inventory.
              </p>
              {insufficientItemData && (
                <div className="mt-3 p-3 bg-gray-100 rounded-md">
                  <p>
                    <span className="font-semibold">Item :</span>{" "}
                    {insufficientItemData.itemName}
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
                      : "Check Item in Snigdha Inventory"}
                  </button>
                </div>
              ) : (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold mb-2">
                    Item Found in Snigdha Inventory
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
                      onClick={addProductToMNS}
                      disabled={isLoadingSnigdhaItem}
                      className="flex-1 px-4 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-green-300"
                    >
                      {isLoadingSnigdhaItem
                        ? "Adding..."
                        : "Add to MNS Inventory"}
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
