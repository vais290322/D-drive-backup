import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { backendDomainA, backendDomainS } from "../../../common/index";
import converter from "number-to-words";
import toast from "react-hot-toast";

const RaisePoPage = () => {
  const [formData, setFormData] = useState({
    date: "",
    vendorQuoteRef: "",
    buyer: "",
    requestedBy: "",
    contactPerson: "",
    contactPersonNumber: "",
    department: "",
    poDescription: "",
    billLocation: "",
    shipLocation: "",
    paymentTerms: "",
    clientId: "",
    items: [{ itemId: "", quantity: "", gst1: "Cgst", gst2: "", uom: "" }],
  });

 
  const [comapny, setComapny] = useState([
    {
      id: 1,
      name: "MNS Company",
      address: "123 Main St, City, Country",
      cin: "U72200KA2013PSC096530",
      
    },
    {
      id: 2,
      name: "Singdha Company",
      address: "456 Elm St, City, Country",
      cin: "U72200KA2013PTC096530",
    },
  ]);

  const [currentCompany, setCurrentCompany] = useState({});

  // console.log("currentCompany : ", currentCompany);

  const [availableItems, setAvailableItems] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taxApplicable, setTaxApplicable] = useState(false);
  const [submitLodading, setSubmitLodading] = useState(false);
  const [pdfData, setPdfData] = useState(null);

  // console.log("pdf data : ", pdfData);

  // console.log("availableItems : ", selectedUnit);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `${backendDomainA}/api/v1/inventory/all-inventory-current-items`
        );
        setAvailableItems(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await axios.get(
          `${backendDomainA}/api/v1/company/all`
        );
        setSelectedClient(response?.data?.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

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

    fetchItems();
    fetchClients();
    fetchUnit();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Add these new state variables after your existing state declarations
  const [insufficientItemModal, setInsufficientItemModal] = useState(false);
  const [insufficientItemIndex, setInsufficientItemIndex] = useState(null);
  const [insufficientItemData, setInsufficientItemData] = useState(null);

  // console.log("ins : ",insufficientItemData)

  // Modify the handleItemChange function to check quantity with a delay
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];

    if (name === "itemId") {
      const selectedItem = JSON.parse(value);
      updatedItems[index] = {
        ...selectedItem,
        quantity: "",
        gst1: updatedItems[index].gst1 || "Cgst",
        gst2: "",
        uom: "",
      };
      setFormData((prevData) => ({
        ...prevData,
        items: updatedItems,
      }));
    } else if (name === "quantity") {
      // Update the quantity immediately for better UX
      updatedItems[index] = { ...updatedItems[index], [name]: value };
      setFormData((prevData) => ({
        ...prevData,
        items: updatedItems,
      }));
      
      // Then check with a delay if it exceeds available stock
      setTimeout(() => {
        const currentItem = updatedItems[index];
        // Find the original item from availableItems to get the actual available quantity
        const originalItem = availableItems.find(item => item._id === currentItem._id);
        
        if (!originalItem) return;
        
        const availableQuantity = parseInt(originalItem.quantity || 0);
        const requestedQuantity = parseInt(value || 0);
        
        if (requestedQuantity > availableQuantity) {
          // Show insufficient item modal
          setInsufficientItemIndex(index);
          setInsufficientItemData({
            ...currentItem,
            availableQuantity: originalItem.quantity, // Store the actual available quantity
            requestedQuantity: value
          });
          setInsufficientItemModal(true);
        }
      }, 2000); // 2 second delay
    } else {
      updatedItems[index] = { ...updatedItems[index], [name]: value };
      setFormData((prevData) => ({
        ...prevData,
        items: updatedItems,
      }));
    }
  };

  // Add function to handle confirmation from insufficient item modal
  const handleConfirmInsufficientItem = () => {
    // Here you would implement the logic to add from Snigdha inventory
    // For now, we'll just allow the user to proceed with the insufficient quantity
    if (insufficientItemIndex !== null && insufficientItemData) {
      const updatedItems = [...formData.items];
      updatedItems[insufficientItemIndex] = {
        ...updatedItems[insufficientItemIndex],
        quantity: document.getElementById(`quantity-${insufficientItemIndex}`).value,
      };
      
      setFormData((prevData) => ({
        ...prevData,
        items: updatedItems,
      }));
    }
    
    // Close the modal
    setInsufficientItemModal(false);
    setInsufficientItemIndex(null);
    setInsufficientItemData(null);
  };

  // Add function to handle cancellation from insufficient item modal
  // Add these new state variables for the enhanced dialog functionality
  const [snigdhaItem, setSnigdhaItem] = useState(null);
  const [isLoadingSnigdhaItem, setIsLoadingSnigdhaItem] = useState(false);
  const [quantityToAdd, setQuantityToAdd] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Add function to check item in Snigdha inventory
  const checkItemInSnigdha = async () => {
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
        toast.error("Item not found in Snigdha inventory");
      }
    } catch (error) {
      toast.error("Failed to fetch item from Snigdha inventory");
      console.error("Error fetching Snigdha item:", error);
    } finally {
      setIsLoadingSnigdhaItem(false);
    }
  };

  // Add function to add product to MNS inventory
  const addProductToMNS = async () => {
    if (!snigdhaItem || !quantityToAdd || parseInt(quantityToAdd) <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (parseInt(quantityToAdd) > parseInt(snigdhaItem.quantity)) {
      toast.error("Requested quantity exceeds available quantity in Snigdha inventory");
      return;
    }

    setIsLoadingSnigdhaItem(true);
    try {
      // Make API call to transfer inventory from Snigdha to MNS
      const transferData = {
        hsnCode: insufficientItemData.hsnCode,
        quantity: quantityToAdd
      };
      
      // Call the API endpoint for transferring inventory
      const response = await axios.post(
        `${backendDomainS}/api/v1/inventory/snig-transfer-by-hsn`, 
        transferData
      );
      
      if (response.data.success) {
        toast.success(`Successfully added ${quantityToAdd} units to MNS inventory`);
        
        // Update the available items list with the new quantity
        const updatedAvailableItems = [...availableItems];
        const itemIndex = updatedAvailableItems.findIndex(item => item._id === insufficientItemData._id);
        
        if (itemIndex !== -1) {
          updatedAvailableItems[itemIndex] = {
            ...updatedAvailableItems[itemIndex],
            quantity: parseInt(updatedAvailableItems[itemIndex].quantity) + parseInt(quantityToAdd)
          };
          setAvailableItems(updatedAvailableItems);
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
      toast.error("Failed to add product to MNS inventory");
      console.error("Error adding product to MNS inventory:", error);
    } finally {
      setIsLoadingSnigdhaItem(false);
    }
  };

  // Update the handleCancelInsufficientItem function to reset all states
  const handleCancelInsufficientItem = () => {
    // Reset the quantity input field
    if (insufficientItemIndex !== null) {
      const updatedItems = [...formData.items];
      updatedItems[insufficientItemIndex] = {
        ...updatedItems[insufficientItemIndex],
        quantity: "",
      };
      
      setFormData((prevData) => ({
        ...prevData,
        items: updatedItems,
      }));
    }
    
    // Close the modal and reset all related states
    setInsufficientItemModal(false);
    setInsufficientItemIndex(null);
    setInsufficientItemData(null);
    setSnigdhaItem(null);
    setShowAddForm(false);
    setQuantityToAdd("");
  };

  // Modify the addItem function to check if all current items have valid quantities
  const addItem = () => {
    // Check if any item has an invalid or empty quantity
    const hasInvalidQuantity = formData.items.some(item => {
      if (!item.itemId) return false; // Skip check for items that haven't been selected yet
      
      // Find the original item to get the available quantity
      const originalItem = availableItems.find(availableItem => 
        availableItem._id === (typeof item.itemId === 'string' ? JSON.parse(item.itemId)._id : item._id)
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
    setFormData((prevData) => ({
      ...prevData,
      items: [...prevData.items, { itemId: "", quantity: "", gst1: "Cgst", gst2: "", uom: "" }],
    }));
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      items: updatedItems,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsModalOpen(false);
      const submitData = { ...formData };
      if (!taxApplicable) {
        submitData.items = submitData.items.map(
          ({ gst1, gst2, ...rest }) => rest
        );
      }
      // console.log("formData : ", submitData);
      const response = await axios.post(
        `${backendDomainA}/api/v1/purchase-order/create`,
        submitData
      );
      // console.log("response : ", response);
      if (response) {
        // alert('Purchase Order created successfully');
        setFormData({
          date: "",
          vendorQuoteRef: "",
          buyer: "",
          requestedBy: "",
          contactPerson: "",
          contactPersonNumber: "",
          department: "",
          poDescription: "",
          billLocation: "",
          shipLocation: "",
          paymentTerms: "",
          clientId: "",
          items: [{ itemId: "", quantity: "", gst2: "", uom: "" }],
        });
        setTaxApplicable(false);
        setIsModalOpen(true);
        setPdfData(response?.data?.data);
      }
    } catch (error) {
      // console.error("Error creating PO:", error);
      toast.error(error?.response?.data?.message || "Failed to create Purchase Order");
      // alert('Failed to create Purchase Order');
    }
  };

  const handleCompanyChange = (e) => {
    const selectedCompanyName = e.target.value;
    const selectedCompany = comapny.find(
      (company) => company.name === selectedCompanyName
    );

    if (selectedCompany) {
      setCurrentCompany(selectedCompany);
    }
  };

  const downloadPDF = () => {
    const poReport = document.getElementById("forpdf");

    if (!poReport) {
      // console.error("PDF element not found");
      // alert("PDF content not available. Please submit the form first.");
      toast.error("PDF content not available. Please submit the form first.");
      return;
    }

    html2canvas(poReport, {
      scale: 1.5, // Higher scale for better resolution
      useCORS: true, // Handle cross-origin images if any
      logging: true, // Enable logging for debugging
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png", 1.0); // Use PNG for better quality
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, "", "FAST");
        pdf.save("po.pdf");
        setIsModalOpen(false);
      })
      .catch((error) => {
        // console.error("Error generating PDF:", error);
        // alert("Failed to generate PDF. Please check the console for details.");
        toast.error("Failed to generate PDF. Please check the console for details.");
      });
  };

  return (
    <div className="p-4 bg-white w-[80%] md:w-[90%] md:mx-auto">
      <h2 className="text-xl font-semibold mb-4">Sell Product from MNS </h2>

      {!isModalOpen && (
        <>
          <form onSubmit={handleSubmit} className="space-y-4  ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="border p-2 flex-1 mb-2"
                onChange={handleCompanyChange}
              >
                <option value="">Select Company</option>
                {comapny.map((company) => (
                  <option key={company.id} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
              <input
                type="text"
                name="vendorQuoteRef"
                value={formData.vendorQuoteRef}
                onChange={handleInputChange}
                placeholder="Vendor Quote Reference"
                className="border p-2 w-full"
              />
              <input
                type="text"
                name="buyer"
                value={formData.buyer}
                onChange={handleInputChange}
                placeholder="Buyer"
                className="border p-2 w-full"
              />
              <input
                type="text"
                name="requestedBy"
                value={formData.requestedBy}
                onChange={handleInputChange}
                placeholder="Requested By"
                className="border p-2 w-full"
              />
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                placeholder="Contact Person"
                className="border p-2 w-full"
              />
              <input
                type="text"
                name="contactPersonNumber"
                value={formData.contactPersonNumber}
                onChange={handleInputChange}
                placeholder="Contact Person Number"
                className="border p-2 w-full"
              />
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Department"
                className="border p-2 w-full"
              />
              <input
                type="text"
                name="billLocation"
                value={formData.billLocation}
                onChange={handleInputChange}
                placeholder="Bill Location"
                className="border p-2 w-full"
              />
              <input
                type="text"
                name="shipLocation"
                value={formData.shipLocation}
                onChange={handleInputChange}
                placeholder="Ship Location"
                className="border p-2 w-full"
              />
              <input
                type="text"
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleInputChange}
                placeholder="Payment Terms"
                className="border p-2 w-full"
              />
              <select
                name="clientId"
                value={formData.clientId}
                onChange={handleInputChange}
                className="border p-2 w-full"
              >
                <option value="">Select Client</option>
                {selectedClient.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.companyName}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              name="poDescription"
              value={formData.poDescription}
              onChange={handleInputChange}
              placeholder="PO Description"
              className="border p-2 w-full h-24"
            ></textarea>
            <div>
              <div className="flex items-center mb-6">
                <span className="mr-2">Apply Tax</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={taxApplicable}
                    onChange={() => setTaxApplicable(!taxApplicable)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row space-x-2 mb-2 gap-2"
                >
                  <select
                    name="itemId"
                    value={item.itemId}
                    onChange={(e) => handleItemChange(index, e)}
                    className="border p-2 flex-1"
                  >
                    <option value="">Select Item</option>
                    {availableItems.map((availableItem) => (
                      <option
                        key={availableItem._id}
                        value={JSON.stringify(availableItem)}
                      >
                        {availableItem.item_name} (Available:{" "}
                        {availableItem.quantity}) (Unit Prize :{" "}
                        {availableItem.unit_prize}) (Selling Price :{" "}
                        {availableItem.sellingPrice})
                      </option>
                    ))}
                  </select>

                  {taxApplicable && (
                    <>
                      <select
                        name="gst1"
                        value={formData.items[index]?.gst1 || "Cgst"}
                        onChange={(e) => handleItemChange(index, e)}
                        className="border p-2 flex-1"
                      >
                        {/* <option value="" disabled>Select GST 1</option> */}
                        <option value="Cgst">CGST</option>
                      </select>

                      <select
                        name="gst2"
                        value={formData.items[index]?.gst2 || ""}
                        onChange={(e) => handleItemChange(index, e)}
                        className="border p-2 flex-1"
                      >
                        <option value="" disabled>
                          Select GST 2
                        </option>
                        <option value="Igst">IGST</option>
                        <option value="Sgst">SGST</option>
                        <option value="">None</option>
                      </select>
                    </>
                  )}
                  <select
                    name="uom"
                    value={formData.items[index]?.uom || ""}
                    onChange={(e) => handleItemChange(index, e)}
                    className="border p-2 flex-1"
                  >
                    <option value="">Select Unit</option>
                    {selectedUnit.map((unit) => (
                      <option key={unit._id} value={unit.name}>
                        {unit.name}
                      </option>
                    ))}
                  </select>

                  
                  <input
                    type="number"
                    name="quantity"
                    id={`quantity-${index}`}
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    placeholder="Quantity"
                    className="border p-2 w-24"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                Add Item
              </button>
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
            >
              Submit
            </button>
          </form>
        </>
      )}

      {isModalOpen && (
        <>
          <div
            id="forpdf"
            className="p-6   rounded shadow-lg  bg-white max-w-4xl mx-auto "
          >
            {/* Header Section */}
            <div className="mb-4">
              <h1 className="text-xl font-bold text-center">{currentCompany?.name}</h1>
              <p className="text-sm text-center">
                {currentCompany?.address}
                <br />
                CIN: {currentCompany?.cin}
              </p>
            </div>

            {/* Purchase Order Title */}
            <h2 className="text-2xl font-bold text-center mb-3">
              PURCHASE ORDER
            </h2>

            {/* Order Info Section */}
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-semibold">Date: {pdfData?.date} </p>
                <p className="font-semibold">Order No: {pdfData?._id}</p>
              </div>
              <div>
                <p className="font-semibold">From: { currentCompany?.name}</p>
              </div>
            </div>

            {/* Company Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p>
                  <span className="font-semibold">Procurement BU:</span> {currentCompany?.name}
                </p>
                <p>
                  <span className="font-semibold">Buyer:</span> {pdfData?.buyer}
                </p>
                {/* <p>
                  <span className="font-semibold">PAN NO:</span> AAFC877070123
                </p> */}
              </div>
              <div>
                {/* <p>
                  <span className="font-semibold">GSTIN:</span> 09AAFC877070123
                </p> */}
                <p>
                  <span className="font-semibold">Requested By:</span> {
                    pdfData?.requestedBy}
                  
                </p>
              </div>
            </div>

            {/* Seller Section */}
            <div className="mb-4">
              <h3 className="font-bold mb-2">To (Seller/Provider):</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">
                    Name: {pdfData?.companyDetails?.companyName}
                  </p>
                  <p>Address:{pdfData?.companyDetails?.companyAddress} </p>
                  
                </div>
                <div>
                  <p>
                     <span className="font-semibold">PAN NO:</span> {pdfData?.companyDetails?.panNo}
                  </p>
                  <p>
                    <span className="font-semibold">GSTIN:</span>{" "}
                    {pdfData?.companyDetails?.GST_IN}
                  </p>
                </div>
              </div>
            </div>
                  <div className="mb-2 flex justify-between">
                  <p>
                     <span className="font-semibold">Billing Location:</span> {pdfData?.billLocation}
                  </p>
                  <p>
                     <span className="font-semibold">Shipping Location:</span> {pdfData?.shipLocation}
                  </p>
                  </div>
            <table className="w-full mb-4 border-collapse">
              <thead>
                <tr style={{ backgroundColor: "#accafa" }}>
                  <th className="border p-2 text-left">Item No.</th>
                  <th className="border p-2 text-left">Item Name</th>
                  <th className="border p-2 text-left">UOM</th>
                  <th className="border p-2 text-left">QTY</th>
                  <th className="border p-2 text-left">Rate in INR</th>
                  <th className="border p-2 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {pdfData?.items?.map((item,index) => (
                  <tr key={item.id}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{item?.item_name}</td>
                    <td className="border p-2">{item?.uom}</td>
                    <td className="border p-2">{item?.quantity}</td>
                    <td className="border p-2">{item?.total_prize}</td>
                    <td className="border p-2">{item?.total_prize}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Grand Total */}
            <div className="text-right mb-2">
              <p className="font-bold">GRAND TOTAL: ₹ {pdfData?.totalAmount}</p>
              <p className="text-sm">Currency: INR</p>
              <p className="text-sm">
                AMOUNT IN WORDS: {converter?.toWords(pdfData?.totalAmount)} INR
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className="border-t pt-4">
              <h3 className="font-bold mb-2">TERMS AND CONDITIONS:</h3>
              <ol className=" flex justify-between">
                <li className="">Payment Terms: {pdfData?.paymentTerms}</li>
                <li className="">Other Terms: No</li>
              </ol>
            </div>

            {/* Footer */}
            <div className="mt-4 text-sm " style={{ color: "#757575" }}>
              <p>
                {currentCompany.address}
              </p>
              <p className="mt-1">
                This is a system generated file - no sign required
              </p>
            </div>
          </div>

          <div
            className="flex justify-center space-x-4 mt-4"
            onClick={downloadPDF}
          >
            <button className="bg-blue-600 cursor-pointer text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">Download</button>
          </div>
        </>
      )}

{insufficientItemModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-red-600">Insufficient Stock</h3>
          <p className="mt-2 text-gray-700">
            Insufficient Item, please add from Snigdha inventory.
          </p>
          {insufficientItemData && (
            <div className="mt-3 p-3 bg-gray-100 rounded-md">
              <p><span className="font-semibold">Item :</span> {insufficientItemData.item_name}</p>
              <p><span className="font-semibold">HSN Code :</span> {insufficientItemData.hsnCode}</p>
              <p><span className="font-semibold">Available Quantity :</span> {insufficientItemData.availableQuantity}</p>
              <p><span className="font-semibold">Requested Quantity :</span> {insufficientItemData.requestedQuantity}</p>
            </div>
          )}
          
          {!showAddForm ? (
            <div className="mt-4">
              <button
                onClick={checkItemInSnigdha}
                disabled={isLoadingSnigdhaItem}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {isLoadingSnigdhaItem ? "Checking..." : "Check Item in Snigdha Inventory"}
              </button>
            </div>
          ) : (
            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold mb-2">Item Found in Snigdha Inventory</h4>
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
                  onClick={addProductToMNS}
                  disabled={isLoadingSnigdhaItem}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-green-300"
                >
                  {isLoadingSnigdhaItem ? "Adding..." : "Add to MNS Inventory"}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setSnigdhaItem(null);
                    setQuantityToAdd("");
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
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
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          {/* <button
            onClick={handleConfirmInsufficientItem}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Confirm Anyway
          </button> */}
        </div>
      </div>
    </div>
  )}
      
    </div>
  );
};

export default RaisePoPage;
