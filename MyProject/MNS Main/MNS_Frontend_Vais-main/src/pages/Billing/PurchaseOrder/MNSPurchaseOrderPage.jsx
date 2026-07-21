import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaSave, FaSpinner } from "react-icons/fa";
import {
  backendDomainA,
  backendDomainR1
} from "../../../Common/index";

const createPoData = import.meta.env.VITE_REACT_PO_ADD_ITEMS;

const apiUrl = import.meta.env.VITE_BASE_URL_Local;
const Item_fetch_url = import.meta.env.VITE_REACT_FETCH_ITEMS;
const MNSPurchaseOrderPage = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    taxGroup: "State Tax",
    invoiceNumber: "",
    location: "",
    paymentType: "cash",
    vendorCode: "",
    items: [
      {
        id: "",
        itemName: "",
        item_id: "",
        quantity: "",
        unit: "",
        hsnCode: "",
        cgst: 0,
        sgst: 0,
        igst: 0,
        unitPrice: 0,
        grossAmount: 0,
        discountRate: 0,
        discountAmount: 0,
        netAmount: 0,
        taxRate: 0,
        taxAmount: 0,
        amount: 0,
      },
    ],
    discount: 0,
    taxableAmount: 0,
    taxAmount: 0,
    grandTotal: 0,
    receiverDetails: {
      id: "",
      name: "",
      address: "",
      phoneNumber: "",
      gstin: "",
      state: "",
    },
    paidOne: false,
  });

  // console.log("formdata",formData);

  // For vendor search
  const [group, setGroup] = useState([]);
  const [customerQuery, setCustomerQuery] = useState("");
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([
    {
      query: "",
      filteredSuggestions: [],
      id: "",
      itemName: "",
      item_id: "",
      quantity: "",
      unit: "",
      group: "", // Add group field here
      hsnCode: "",
      cgst: 0,
      sgst: 0,
      igst: 0,
      unitPrice: 0,
      grossAmount: 0,
      discountRate: 0,
      discountAmount: 0,
      netAmount: 0,
      taxRate: 0,
      taxAmount: 0,
      amount: 0,
    },
  ]);
  const [totals, setTotals] = useState({
    grossAmount: 0,
    discount: 0,
    taxableAmount: 0,
    taxAmount: 0,
    grandTotal: 0,
    roundOff: 0,
    totalPayableAmount: 0,
  });

  // Fetch units on component mount

  // Calculate totals whenever items change
  useEffect(() => {
    calculateTotals();
  }, [items]);

  // Fetch units from API
  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await axios.get(
        `${backendDomainA}/api/v1/units/all-units`
      );
      if (response.data && response.data.data) {
        setSelectedUnit(response.data.data);
        // console.log(response.data.data);
      }
    } catch (error) {
      // console.error("Error fetching units:", error);
      toast.error("Failed to fetch units");
    }
  };

  const fetchGroup = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/group/all`);
      // console.log(response.data.groups);
      if (response.data && response.data.groups) {
        setGroup(response.data.groups);
      }
    } catch (error) {
      // console.error("Error fetching group:", error);
      toast.error("Failed to fetch group");
    }
  };
  useEffect(() => {
    fetchGroup();
  }, []);

  // Handle form data changes
  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle customer search
  // Add these state variables after your other state declarations
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [showVendorList, setShowVendorList] = useState(false);

  // Add this useEffect to fetch vendors when component mounts
  useEffect(() => {
    fetchVendors();
  }, []);

  // Add this function to fetch vendors
  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${backendDomainR1}/api/v1/mns/vendor`);
      if (response.data && response.data.data) {
        setVendors(response.data.data);
      }
    } catch (error) {
      // console.error("Error fetching vendors:", error);
      toast.error(`Failed to fetch vendors: ${error.message}`);

      // Set empty vendors array to prevent further errors
      setVendors([]);
    }
  };

  // Update the handleCustomerSearch function
  const handleCustomerSearch = (e) => {
    const value = e.target.value;
    setCustomerQuery(value);

    // Filter vendors based on search query
    if (value.trim() !== "") {
      const filtered = vendors.filter((vendor) =>
        vendor.vendorName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredVendors(filtered);
      setShowVendorList(true);
    } else {
      setFilteredVendors([]);
      setShowVendorList(false);
    }

    // Update receiver details name
    setFormData((prev) => ({
      ...prev,
      receiverDetails: {
        ...prev.receiverDetails,
        name: value,
      },
    }));
  };

  // Handle receiver details changes
  const handleReceiverDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      receiverDetails: {
        ...prev.receiverDetails,
        [name]: value,
      },
    }));
  };

  // Handle item query change
  // Add these state variables and functions after your other state declarations
  const [products, setProducts] = useState([]);

  // Add this useEffect to fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Add this function to fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${Item_fetch_url}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.data) {
        setProducts(data.data);
        // console.log(data.data);
      }
    } catch (error) {
      // console.error("Error fetching products:", error);
      toast.error(`Failed to fetch products: ${error.message}`);

      // Set empty products array to prevent further errors
      setProducts([]);
    }
  };
  // Handle item query change
  // Handle item query change
  const handleItemQueryChange = (index, e) => {
    const value = e.target.value;
    const updatedItems = [...items];

    updatedItems[index] = {
      ...updatedItems[index],
      query: value,
      itemName: value, // Update itemName with the typed value
    };

    // Filter products based on search query
    if (value.trim() !== "") {
      const filtered = products.filter(
        (product) =>
          product.item_name?.toLowerCase().includes(value.toLowerCase()) ||
          product.item_id?.toLowerCase().includes(value.toLowerCase()) ||
          product.hsnCode?.toLowerCase().includes(value.toLowerCase())
      );
      updatedItems[index].filteredSuggestions = filtered;
    } else {
      updatedItems[index].filteredSuggestions = [];
    }

    setItems(updatedItems);
  };

  // Handle item selection from dropdown
  // Handle item selection from dropdown
  const handleSelect = (index, product) => {
    // console.log("product", product);
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      id: product._id || "",
      itemName: product.item_name || "",
      item_id: product.item_id || "",
      hsnCode: product.hsnCode || "",
      unit: product.uom || updatedItems[index].uom,
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
  // Handle item field changes
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value,
    };

    // Calculate amounts
    calculateItemAmounts(updatedItems, index);
    setItems(updatedItems);
  };

  // Calculate item amounts
  const calculateItemAmounts = (updatedItems, index) => {
    const item = updatedItems[index];
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;

    // Calculate gross amount
    const grossAmount = quantity * unitPrice;
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

    if ((formData.taxGroup === "State Tax")) {
      const taxRate = cgst + sgst;
      const taxAmount = (netAmount * taxRate) / 100;

      updatedItems[index].taxAmount = taxAmount;
      updatedItems[index].taxRate = taxRate;

      // Calculate final amount
      const amount = netAmount + taxAmount;
      updatedItems[index].amount = amount;
    } else {
      const taxRate = igst;
      const taxAmount = (grossAmount * taxRate) / 100;

      updatedItems[index].taxAmount = taxAmount;
      updatedItems[index].taxRate = taxRate;

      // Calculate final amount
      const amount = netAmount + taxAmount;
      updatedItems[index].amount = amount;
    }
  };

  // Calculate totals
  // In the calculateTotals function, add roundOff calculation:
  const calculateTotals = () => {
    let grossAmount = 0;
    let discount = 0;
    let taxableAmount = 0;
    let taxAmount = 0;
    let grandTotal = 0;
    let roundOff = 0;


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

    // console.log({
    //   grossAmount,
    //   discount,
    //   taxableAmount,
    //   taxAmount,
    //   grandTotal,
    //   totalPayableAmount,
    //   roundOff: totals.roundOff
    // })

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

  // Add new row
  const addNewRow = () => {
    setItems([
      ...items,
      {
        query: "",
        filteredSuggestions: [],
        id: "",
        itemName: "",
        item_id: "",
        quantity: "",
        unit: "",
        group: "", // Add group field here
        hsnCode: "",
        cgst: 0,
        sgst: 0,
        igst: 0,
        unitPrice: 0,
        grossAmount: 0,
        discountRate: 0,
        discountAmount: 0,
        netAmount: 0,
        taxRate: 0,
        taxAmount: 0,
        amount: 0,
      },
    ]);
  };

  // Delete row
  const deleteRow = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  // Handle save
  const handleSave = async () => {
    // console.log("formData before save", items);

    try {
      setIsLoading(true);
      // Update formData with items before sending
      const updatedFormData = {
        ...formData,
        items: items.map((item) => {
          let cgst = Number(item.cgst);
          let sgst = Number(item.sgst);
          let igst = Number(item.igst);

          // ✅ Apply tax group rules
          if (formData.taxGroup === "State Tax") {
            // Only CGST + SGST apply
            igst = 0;
          } else if (formData.taxGroup === "Other Tax") {
            // Only IGST applies
            cgst = 0;
            sgst = 0;
          } else if (formData.taxGroup === "No Tax") {
            // No tax at all
            cgst = 0;
            sgst = 0;
            igst = 0;
          }

          const grossAmount = Number(parseFloat(item.grossAmount).toFixed(2)) || 0;
          const discountAmount = Number(parseFloat(item.discountAmount).toFixed(2)) || 0;
          const netAmount = Number(parseFloat(item.netAmount).toFixed(2)) || 0;
          const tax= Number(item.taxRate) || Number(cgst+sgst+igst)

          // ✅ Recalculate taxAmount based on applied taxes
          const taxableAmount = Number(item.netAmount || 0);
          const taxAmount = Number(parseFloat((taxableAmount * tax) / 100).toFixed(2));

          // console.log("taxAmount", taxAmount);

          const amount = Number(netAmount) + Number(taxAmount);
          const quantity = Number(item.quantity);
          const discountRate = Number(item.discountRate)
          const unitPrice = Number(item.unitPrice)
          

          return {
            ...item,
            cgst,
            sgst,
            igst,
            quantity,
            discountRate,
            unitPrice,
            taxAmount,
            amount,
            grossAmount,
            discountAmount,
            netAmount,
          };
        }),
        receiverDetails: {
          ...formData.receiverDetails,
          name: customerQuery,
        },
        // ✅ Add roundOff and adjusted grandTotal to payload
        discount: Number(parseFloat(totals.discount).toFixed(2)),
        taxableAmount: Number(parseFloat(totals.taxableAmount).toFixed(2)),
        taxAmount: Number(parseFloat(totals.taxAmount).toFixed(2)),
        roundOff: Number(parseFloat(totals.roundOff).toFixed(2)),
        grandTotal: Number(parseFloat(totals.grandTotal).toFixed(2)),
        totalPayableAmount: Number(parseFloat(totals.totalPayableAmount).toFixed(2)),
      };

      // console.log("updatedFormData", updatedFormData);

// return;
      // Send data to API
      const response = await axios.post(createPoData, updatedFormData);

      if (response.data.success) {
        toast.success("Purchase order created successfully");
        // Reset form
        resetForm();
      } else {
        toast.error(response.data.message || "Failed to create purchase order");
      }
    } catch (error) {
      // console.error("Error creating purchase order:", error);
      toast.error("Failed to create purchase order");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setCustomerQuery("");
    setFormData({
      date: new Date().toISOString().split("T")[0],
      taxGroup: "State Tax",
      invoiceNumber: "",
      location: "",
      paymentType: "cash",
      // transportationCharges: "0",
      vendorCode: "",
      items: [
        {
          id: "",
          itemName: "",
          item_id: "",
          quantity: "",
          unit: "",
          group: "",
          hsnCode: "",
          cgst: 0,
          sgst: 0,
          igst: 0,
          unitPrice: 0,
          grossAmount: 0,
          discountRate: 0,
          discountAmount: 0,
          netAmount: 0,
          taxRate: 0,
          taxAmount: 0,
          amount: 0,
        },
      ],
      discount: 0,
      taxableAmount: 0,
      taxAmount: 0,
      grandTotal: 0,
      receiverDetails: {
        id: "",
        name: "",
        address: "",
        phoneNumber: "",
        gstin: "",
        state: "",
      },
      paidOne: false,
    });
    setItems([
      {
        query: "",
        filteredSuggestions: [],
        id: "",
        itemName: "",
        item_id: "",
        quantity: "",
        unit: "",
        group: "",
        hsnCode: "",
        cgst: 0,
        sgst: 0,
        igst: 0,
        unitPrice: 0,
        grossAmount: 0,
        discountRate: 0,
        discountAmount: 0,
        netAmount: 0,
        taxRate: 0,
        taxAmount: 0,
        amount: 0,
      },
    ]);
    setTotals({
      discount: 0,
      taxableAmount: 0,
      taxAmount: 0,
      grandTotal: 0,
      roundOff: 0,
      totalPayableAmount: 0,
    });
  };

  const handleVendorSelect = (vendor) => {
    setCustomerQuery(vendor.vendorName);
    console.log("vendoer : ",vendor)

    // Get the first address if available
    const address =
      vendor.vendorAddress && vendor.vendorAddress.length > 0
        ? vendor.vendorAddress[0]
        : "";

    // Update form data with vendor details
    setFormData((prev) => ({
      ...prev,
      vendorCode: vendor.vendorCode || "",
      location: vendor.location || "",
      receiverDetails: {
        ...prev.receiverDetails,
        id: vendor.id || "",
        name: vendor.vendorName || "",
        address: address,
        phoneNumber: vendor.vendorNumber || "",
        gstin: vendor.gstNumber || "",
        state: vendor.state || "",
      },
    }));

    setShowVendorList(false);
  };

  return (
    <div className="p-4 ">
      <div className="bg-white px-5 py-5 shadow-lg rounded-xl">
        {/* Header Controls */}
        <h1 className="text-3xl mb-10 font-bold">
          Create Purchase Invoice for MNS
        </h1>
        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex gap-4">
            <div>
              <label className="block text-gray-600 mb-1">Invoice Number</label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleFormDataChange}
                placeholder="Enter Invoice Number"
                className="border p-1"
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
                value={formData.taxGroup}
                onChange={handleFormDataChange}
              >
                <option value="State Tax">State Tax</option>
                <option value="Other Tax">Other Tax</option>
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
        <div className="flex gap-4 mb-4 text-sm">
          {/* Replace the vendor dropdown section with this */}
          <div className="flex-1 relative">
            <label className="block text-gray-600 mb-1">Vendor Name</label>
            <input
              type="text"
              className="border p-1 w-full"
              name="customerName"
              value={customerQuery}
              onChange={handleCustomerSearch}
              placeholder="Enter Name"
              autoComplete="off"
            />

            {/* Vendor list */}
            {showVendorList && filteredVendors.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredVendors.map((vendor) => (
                  <div
                    key={vendor._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleVendorSelect(vendor)}
                  >
                    <div className="font-medium">{vendor.vendorName}</div>
                    <div className="text-xs text-gray-500">
                      {vendor.vendorNumber} | {vendor.gstNumber || "No GST"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Vendor Code</label>
            <input
              type="text"
              name="vendorCode"
              value={formData?.vendorCode}
              onChange={handleFormDataChange}
              className="border w-full p-1"
              placeholder="Enter Code"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData?.location}
              onChange={handleFormDataChange}
              className="border w-full p-1"
              placeholder="Enter Location"
            />
          </div>
        </div>

        {/* Customer Details  */}
        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-4 mb-4 text-sm">
            {/* Email */}
            <div className="w-full">
              <label className="block text-gray-600 mb-1">Vendor State</label>
              <input
                type="text"
                className="border p-2 w-full"
                name="state"
                value={formData.receiverDetails.state}
                onChange={handleReceiverDetailsChange}
                placeholder="Enter State"
              />
            </div>

            {/* Phone */}
            <div className="w-full">
              <label className="block text-gray-600 mb-1">
                Vendor Phone No.
              </label>
              <input
                type="tel"
                className="border p-2 w-full"
                name="phoneNumber"
                value={formData.receiverDetails.phoneNumber}
                onChange={handleReceiverDetailsChange}
                placeholder="Enter phone number"
              />
            </div>

            {/* Address */}
            <div className="w-full">
              <label className="block text-gray-600 mb-1">Vendor Address</label>
              <input
                type="text"
                className="border p-2 w-full"
                name="address"
                value={formData.receiverDetails.address}
                onChange={handleReceiverDetailsChange}
                placeholder="Enter address"
              />
            </div>
            {/* Address */}
            <div className="w-full">
              <label className="block text-gray-600 mb-1">
                Vendor GST Number
              </label>
              <input
                type="text"
                className="border p-2 w-full"
                name="gstin"
                value={formData.receiverDetails.gstin}
                onChange={handleReceiverDetailsChange}
                placeholder="Enter GST Number"
              />
            </div>
            {/* <div className="w-full"> */}
            {/* <label className="block text-gray-600 mb-1">
                Transportation Charges
              </label>
              <input
                type="number"
                className="border p-2 w-full"
                name="transportationCharges"
                value={formData.transportationCharges}
                onChange={handleFormDataChange}
                placeholder="Enter Charges Number"
              /> */}
            {/* </div> */}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
              <th className="border border-gray-300 w-[70px] font-normal">
                SL
              </th>
              <th className="border border-gray-300 p-1 font-normal ">
                Item Name
              </th>
              <th className="border border-gray-300 p-1 font-normal">
                Item Id
              </th>

              <th className="border border-gray-300 p-1 font-normal ">
                Unit
              </th>
              <th className="border border-gray-300 p-1 font-normal ">
                Group
              </th>
              <th className="border border-gray-300 p-1 font-normal ">
                HSN Code
              </th>
              <th className="border border-gray-300 p-1 font-normal ">
                Quantity
              </th>
              <th className="border border-gray-300 p-1 font-normal ">
                Unit Price
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
              )}
              <th className="border border-gray-300 p-1 font-normal w-20">
                Tax Rate(%)
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
                  <div className="relative">
                    <input
                      type="text"
                      name="query"
                      className="w-auto p-2 border-gray-300 outline-none text-wrap "
                      placeholder="Search items..."
                      value={item.query || item.itemName}
                      onChange={(e) => handleItemQueryChange(index, e)}
                    />
                    {item.filteredSuggestions &&
                      item.filteredSuggestions.length > 0 && (
                        <ul className="absolute w-[250px] bg-white border border-gray-200 rounded-md mt-1 shadow-md z-10 max-h-60 overflow-y-auto">
                          {item.filteredSuggestions.map((suggestion, idx) => (
                            <li
                              key={idx}
                              className="p-2 cursor-pointer hover:bg-blue-100"
                              onClick={() => handleSelect(index, suggestion)}
                            >
                              {suggestion.item_name}
                              {suggestion.quantity !== undefined &&
                                ` (Qty: ${suggestion.quantity})`}
                              {suggestion.sellingPrice !== undefined &&
                                ` (₹${parseFloat(suggestion.sellingPrice).toFixed(2)})`}
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>
                </td>
                <td className="border border-gray-300 p-0">
                  <input
                    type="text"
                    name="item_id"
                    className="w-16 p-2  border-gray-300 outline-none"
                    placeholder="Item id"
                    value={item.item_id}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>

                <td className="border border-gray-300 p-0">
                  <select
                    className="w-16 p-1 border-none outline-none"
                    name="unit"
                    value={item.unit}
                    onChange={(e) => handleItemChange(index, e)}
                  >
                    <option value="">Select Unit</option>
                    {selectedUnit.map((unit, i) => (
                      <option key={i} value={unit.name}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 p-0">
                  <select
                    className="w-16 p-1 border-none outline-none"
                    name="group"
                    value={item.group}
                    onChange={(e) => handleItemChange(index, e)}
                  >
                    <option value="">Select Group</option>
                    {group.map((unit, i) => (
                      <option key={i} value={unit.groupName}>
                        {unit.groupName}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 p-0">
                  <input
                    type="text"
                    className="w-16 p-1 border-none outline-none"
                    name="hsnCode"
                    value={item.hsnCode}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td className="border border-gray-300 p-0">
                  <input
                    type="number"
                    className="w-12 p-1 border-none outline-none"
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                </td>

                <td className="border border-gray-300 p-0">
                  <input
                    type="number"
                    className="w-16 p-1 border-none outline-none"
                    name="unitPrice"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                </td>

                <td className="border border-gray-300 p-0">
                  <input
                    type="number"
                    className="w-16 p-1 border-none  outline-none"
                    name="grossAmount"
                    value={parseFloat(item.grossAmount).toFixed(2)}
                    readOnly
                    // onChange={(e) => handleItemChange(index, e)}
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
                    value={parseFloat(item.discountAmount).toFixed(2)}
                    name="discountAmount"
                    readOnly
                    // onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td className="border border-gray-300 p-0">
                  <input
                    type="number"
                    className="w-16 p-1 border-none outline-none"
                    value={parseFloat(item.netAmount).toFixed(2)}
                    name="netAmount"
                    readOnly
                    // onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                {formData.taxGroup === "State Tax" ? (
                  <>
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
                        name="sgst"
                        value={item.sgst}
                        onChange={(e) => handleItemChange(index, e)}
                      />
                    </td>
                  </>
                ) : (
                  <td className="border border-gray-300 p-0">
                    <input
                      className="w-full p-1 border-none outline-none"
                      name="igst"
                      value={item.igst}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                )}
                <td className="border border-gray-300 p-0">
                  <input
                    type="number"
                    className="w-full p-1 border-none outline-none"
                    name="taxRate"
                    value={item.taxRate}
                    readOnly
                    // onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td className="border border-gray-300 p-0">
                  <input
                    type="number"
                    className="w-full p-1 border-none  outline-none"
                    value={parseFloat(item.taxAmount).toFixed(2)}
                    name="taxAmount"
                    readOnly
                    // onChange={(e) => handleItemChange(index, e)}
                  />
                </td>
                <td className="border border-gray-300 p-0">
                  <input
                    type="number"
                    className="w-16 p-1 border-none outline-none"
                    name="amount"
                    value={parseFloat(item.amount).toFixed(2)}
                    readOnly
                    // onChange={(e) => {
                    //   handleItemChange(index, {
                    //     target: {
                    //       name: "amount",
                    //       value: e.target.value,
                    //     },
                    //   });
                    // }}
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
                    <button
                      onClick={addNewRow}
                      className="w-1/2 h-full flex items-center cursor-pointer justify-center text-blue-600 hover:text-blue-800 font-bold text-xl"
                    >
                      +
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section if user select the product the total calculation will be visible */}
        <div className="flex justify-between mt-4">
          <div className="flex-1"></div>
          <div className="w-72">
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
              <div className="text-right">Round Off:</div>
              <input
                type="number"
                className="border p-1 bg-gray-50 outline-none"
                value={totals.roundOff}
                onChange={(e) => {
                  const roundOff = Number(parseFloat(e.target.value)) || 0;
                  const grandTotal = Number(parseFloat(totals.grandTotal).toFixed(2)) || 0;
                  const decimalPart = grandTotal % 1;
                  let totalPayableAmount = grandTotal;

                  if (decimalPart < 0.5) {
                    totalPayableAmount = grandTotal - roundOff;
                  } else if (decimalPart >= 0.5) {
                    totalPayableAmount = grandTotal + roundOff;
                  }

                  setTotals((prev) => ({
                    ...prev,
                    roundOff,
                    totalPayableAmount,
                  }));
                }}
              />
              <div className="text-right font-bold">Payable Amount:</div>
              <input
                type="number"
                className="border p-1 bg-gray-50 font-bold outline-none"
                value={parseFloat(totals.totalPayableAmount).toFixed(2)}
                readOnly
              />
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-12 py-1 text-lg cursor-pointer bg-gray-100 border hover:bg-gray-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" /> Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MNSPurchaseOrderPage;
