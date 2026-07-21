import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PdfFormate from "./PdfFormate";
import { backendDomainA, backendDomainS } from "../../../common";
import axios from "axios";
import ServiceInvoicepage from "./Service";

const New_Url = import.meta.env.VITE_REACT_PERFOMA_INVOICE_MNS;
const Item_fetch_url = import.meta.env.VITE_REACT_FETCH_INVENTORY;
const Customer_Url = import.meta.env.VITE_REACT_CUSTOMER_FETCH;




const ProformBill = ({customerDetails}) => {
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

  const [formData, setFormData] = useState({
    billFormat: "",
    date: "",
    taxGroup: "",
    paymentType: "cash",
    customerName: "",
    invoiceNumber: "",
    priceGroup: "",
    location: "",
    invoiceType: "product",
    // name: customerQuery || "",
    state: "",
    phone: "",
    address: "",
    gstnumber: "",
    id: Math.floor(100000 + Math.random() * 900000),
  });

  // console.log("form data for customer  : ",formData);

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
      discountRate: "0.00",
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

  const fetchUnit = async () => {
    try {
      const response = await axios.get(
        `${backendDomainA}/api/v1/units/all-units`
      );
      setSelectedUnit(response?.data?.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
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

  useEffect(() => {
    // Calculate totals when items change
    generateItemDetails()
  }, [items]);
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


  const deleteRow = (index) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
      calculateTotals(newItems);
    }
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
      const sellingPrice = unitPrice * quantity;

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
        if (!customerDetails.customerName) {
            toast.error("Please enter customer name");
            return;
          }
      if (!items[0].itemName || !items[0].quantity || !items[0].unitPrice) {
        toast.error(
          "Please fill in at least one item with name, quantity, and unit price"
        );
        return;
      }
    
      const payload = {
        receiverDetails: {
            name: customerDetails.customerName,
            state: customerDetails.state || "",
            phoneNumber: customerDetails.phone || "",
            address: customerDetails.address || "",
            gstin: customerDetails.gstnumber || "",
            id: String(customerDetails.id || ""),
        },
        invoiceNumber: customerDetails.invoiceNumber || "INV-DEFAULT",
        date: customerDetails.date, // Ensure it's a Date
        customerName: customerDetails.customerName || "",
        billFormat: customerDetails.billFormat || "",
        taxGroup: customerDetails.taxGroup || "",
        paymentType: customerDetails.paymentType || "Cash",
        location: customerDetails.location || "",
        priceGroup: customerDetails.priceGroup || "",
        items: items.map((item) => ({
            id: String(item.itemid || ""),
            itemName: item.itemName || "",
            quantity: parseFloat(item.quantity),
            unit: item.unit || "",
            hsnCode: item.hsnCode || "",
            cgst: parseFloat(item.cgst),
            sgst: parseFloat(item.sgst),
            igst: parseFloat(item.igst),
            unitPrice: parseFloat(item.unitPrice),
            sellingPrice: parseFloat(item.sellingPrice),
            grossAmount: parseFloat(item.grossAmount),
            discountRate: parseFloat(item.discountRate),
            discountAmount: parseFloat(item.discountAmount),
            netAmount: parseFloat(item.netAmount),
            taxRate: parseFloat(item.taxRate),
            taxAmount: parseFloat(item.taxAmount),
            amount: parseFloat(item.amount),
        })),
        discount: parseFloat(totals.discount),
        taxableAmount: parseFloat(totals.taxableAmount),
        taxAmount: parseFloat(totals.taxAmount),
        grandTotal: parseFloat(totals.grandTotal),
    };
    
      console.log(customerDetails)
      console.log(payload)
     
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
  }; //----------------------------- DATA SAVE-------------------------------------------

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

  return (
    <div>
      <div className="bg-white ">
      

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
                      value={item.query ||item.query}
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
                      <option key="hi" value="">
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
                      readOnly
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="number"
                      className="w-full p-1 border-none outline-none"
                      value={item.netAmount}
                      name="netAmount"
                      readOnly
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
                      value={item.discountAmount }
                      name="discountAmount"
                      readOnly
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="number"
                      className="w-full p-1 border-none outline-none"
                      name="taxRate"
                      value={item.taxRate}
                      readOnly
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
                      readOnly
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
        ) : (
          null
        )}

        {/* Totals Section if user select the product the total calculation will be visib;le */}
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
              </div>
            </div>
          </div>
        ) : (
        //   <ServiceInvoicepage customerDetails={formData}/>
        null
        )}

        {/* Action Buttons */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
          >
            Save Invoice
          </button>
          
        </div>
      </div>
      {/* Add the insufficient item modal */}
     
    </div>
  );
};
export default ProformBill