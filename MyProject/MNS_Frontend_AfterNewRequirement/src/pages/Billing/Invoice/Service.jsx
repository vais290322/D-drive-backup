import React, { useState } from "react";
import toast from "react-hot-toast";

const New_Url = import.meta.env.VITE_REACT_SERVICE_INVOICE_MNS;

const ServiceInvoicepage = ({ customerDetails, isProforma }) => {
  return (
    <div className="container">
      <InvoiceForm customer={customerDetails} />
    </div>
  );
};
export default ServiceInvoicepage;

const InvoiceForm = ({ customer }) => {
  console.log("customerDetails", customer);

  // Initialize state with proper structure
  const initialServiceData = {
    items: [
      {
        id: 1,
        description: "",
        sacCode: "",
        noOfPerson: "",
        noOfDuites: "",
        rate: "",
        month: "",
        amount: "0.00",
      },
    ],
    total: {
      cgst: "0",
      sgst: "0",
      igst: "0",
      taxAmount: "0.00",
      grossAmount: "0.00",
      grandTotal: "0.00",
    },
  };

  const [serviceData, setServiceData] = useState(initialServiceData);

  // Function to handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedServiceData = { ...serviceData };
    updatedServiceData.items[index][field] = value;

    // Calculate amount if necessary fields are changed
    if (["noOfPerson", "noOfDuites", "rate", "month"].includes(field)) {
      const item = updatedServiceData.items[index];
      const noOfPersons = parseFloat(item.noOfPerson) || 0;
      const noOfDuties = parseFloat(item.noOfDuites) || 0;
      const ratePerMonth = parseFloat(item.rate) || 0;
      const monthDays = parseFloat(item.month) || 0;

      let amount = 0;
      if (monthDays > 0) {
        amount = (noOfDuties * ratePerMonth) / monthDays;
      } else {
        amount = noOfPersons * noOfDuties * ratePerMonth;
      }
      updatedServiceData.items[index].amount = amount.toFixed(2);
    }

    setServiceData(updatedServiceData);
    calculateTotals(updatedServiceData);
  };

  // Function to handle tax changes
  const handleTaxChange = (field, value) => {
    const updatedServiceData = { ...serviceData };
    updatedServiceData.total[field] = value;
    setServiceData(updatedServiceData);
    calculateTotals(updatedServiceData);
  };

  // Function to calculate totals
  const calculateTotals = (data) => {
    const grossAmount = data.items.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );

    const cgstAmount = (grossAmount * parseFloat(data.total.cgst || 0)) / 100;
    const sgstAmount = (grossAmount * parseFloat(data.total.sgst || 0)) / 100;
    const igstAmount = (grossAmount * parseFloat(data.total.igst || 0)) / 100;
    const taxAmount = cgstAmount + sgstAmount + igstAmount;
    const grandTotal = grossAmount + cgstAmount + sgstAmount + igstAmount;

    const updatedData = { ...data };
    updatedData.total.grossAmount = grossAmount.toFixed(2);
    updatedData.total.grandTotal = grandTotal.toFixed(2);
    updatedData.total.taxAmount = taxAmount.toFixed(2);

    setServiceData(updatedData);
  };

  // Function to add a new row
  const addNewRow = () => {
    const updatedServiceData = { ...serviceData };
    updatedServiceData.items.push({
      id: updatedServiceData.items.length + 1,
      description: "",
      sacCode: "",
      noOfPerson: "",
      noOfDuites: "",
      rate: "",
      month: "",
      amount: "0.00",
    });
    setServiceData(updatedServiceData);
  };

  // Function to delete a row
  const deleteRow = (index) => {
    if (serviceData.items.length > 1) {
      const updatedServiceData = { ...serviceData };
      updatedServiceData.items.splice(index, 1);
      setServiceData(updatedServiceData);
      calculateTotals(updatedServiceData);
    }
  };

  // Function to handle save and reset the form
  const handleSave = async () => {
    try {
      // Validate required fields
      if (!customer.customerName) {
        toast.error("Please enter customer name");
        return;
      }
      if (!serviceData.items[0].description) {
        toast.error("Please fill in at least one service with description");
        return;
      }

      // Prepare payload
      const payload = {
        ...serviceData,
        invoiceNumber: customer?.invoiceNumber || "",
        date: customer?.date || "",
        taxGroup: customer?.taxGroup || "",
        paymentType: customer?.paymentType || "",
        customerName: customer?.customerName || "",
        month: customer?.month || "",
        receiverDetails: {
          name: customer?.customerName || "",
          address:
            typeof customer.address === "object"
              ? customer.address
                  .map((part) => (part.includes("/") ? `"${part}"` : part))
                  .join(", ")
              : customer.address,
          phoneNumber: customer?.phone || "",
          gstin: customer?.gstnumber || "",
          state: customer?.state || "",
          monthYear: customer?.monthYear || "",
          year: customer?.year || "",
          vendorCode: customer?.vendorCode || "",
        },
        priceGroup: customer?.priceGroup || "",
        location: customer?.location || "",
      };

      // Send payload to backend
      const response = await fetch(New_Url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log("service page response", data);
      if (data.success === true) {
        toast.success(data.message);
        // Reset form state to its initial structure
        setServiceData(initialServiceData);
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error(error.message || "Error saving invoice");
    }
  };

  return (
    <div>
      <div className="bg-white">
        {/* Items Table */}
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
              <th className="border border-gray-300 w-[70px] font-normal">
                SL.No
              </th>
              <th className="border border-gray-300 p-1 font-normal">
                Description
              </th>
              <th className="border border-gray-300 p-1 font-normal">
                HSN/SAC Code
              </th>
              <th className="border border-gray-300 p-1 font-normal">
                No of Persons
              </th>
              <th className="border border-gray-300 p-1 font-normal">
                No of Duties
              </th>
              <th className="border border-gray-300 p-1 font-normal">
                Rate per month per Person
              </th>
              <th className="border border-gray-300 p-1 font-normal">
                Month Days
              </th>
              <th className="border border-gray-300 p-1 font-normal">
                Amount(Rs)
              </th>
              <th className="border border-gray-300 p-1 font-normal w-10"></th>
            </tr>
          </thead>
          <tbody>
            {serviceData?.items?.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-1 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 p-0">
                  <input
                    type="text"
                    className="w-full p-2 border-none outline-none"
                    name="description"
                    value={item?.description || ""}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    placeholder="Enter description"
                  />
                </td>
                <td className="border border-gray-300 p-0">
                  <input
                    type="text"
                    className="w-full p-1 border-none outline-none"
                    name="sacCode"
                    value={item?.sacCode || ""}
                    onChange={(e) =>
                      handleItemChange(index, "sacCode", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-300 p-0">
                  <input
                    type="number"
                    className="w-full p-1 border-none outline-none"
                    name="noOfPerson"
                    value={item?.noOfPerson || ""}
                    onChange={(e) =>
                      handleItemChange(index, "noOfPerson", e.target.value)
                    }
                    required
                  />
                </td>
                <td className="border border-gray-300 p-0">
                  <input
                    type="number"
                    className="w-full p-1 border-none outline-none"
                    name="noOfDuites"
                    value={item?.noOfDuites || ""}
                    onChange={(e) =>
                      handleItemChange(index, "noOfDuites", e.target.value)
                    }
                    required
                  />
                </td>
                <td className="border border-gray-300 p-0">
                  <input
                    type="number"
                    className="w-full p-1 border-none outline-none"
                    name="rate"
                    value={item?.rate || ""}
                    onChange={(e) =>
                      handleItemChange(index, "rate", e.target.value)
                    }
                    required
                  />
                </td>
                <td className="border border-gray-300 p-0">
                  <input
                    type="number"
                    className="w-full p-1 border-none outline-none"
                    name="month"
                    value={item?.month || ""}
                    onChange={(e) =>
                      handleItemChange(index, "month", e.target.value)
                    }
                    required
                  />
                </td>
                <td className="border border-gray-300 p-0">
                  <input
                    type="number"
                    className="w-full p-1 border-none outline-none bg-gray-50"
                    name="amount"
                    value={item?.amount || "0.00"}
                    readOnly
                  />
                </td>
                <td className="border border-gray-300 p-0.5 flex gap-1.5">
                  {serviceData?.items?.length > 1 && (
                    <button
                      onClick={() => deleteRow(index)}
                      className="w-1/2 h-full flex items-center justify-center text-red-600 hover:text-red-800 font-bold text-xl"
                    >
                      -
                    </button>
                  )}
                  {index === serviceData?.items?.length - 1 && (
                    <button
                      onClick={addNewRow}
                      className="w-1/2 h-full flex items-center justify-center text-blue-600 hover:text-blue-800 font-bold text-xl"
                    >
                      +
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex flex-col items-end justify-end gap-2 mt-3">
          {customer?.taxGroup === "State Tax" ? (
            <>
              <div className="flex justify-between gap-2">
                <label>CGST(%): </label>
                <input
                  type="number"
                  className="p-1 w-[150px] border outline-none"
                  value={serviceData?.total?.cgst || "0"}
                  onChange={(e) => handleTaxChange("cgst", e.target.value)}
                />
              </div>
              <div className="flex justify-between gap-2">
                <label>SGST(%): </label>
                <input
                  type="number"
                  className="p-1 w-[150px] border outline-none"
                  value={serviceData?.total?.sgst || "0"}
                  onChange={(e) => handleTaxChange("sgst", e.target.value)}
                />
              </div>
            </>
          ) : customer.taxGroup === "Other Tax" ? (
            <div className="flex justify-between gap-2">
              <label>IGST(%): </label>
              <input
                type="number"
                className="p-1 w-[150px] border outline-none"
                value={serviceData?.total?.igst || "0"}
                onChange={(e) => handleTaxChange("igst", e.target.value)}
              />
            </div>
          ) : (
            ""
          )}

          <div className="flex justify-between gap-2">
            <label>Gross Amount: </label>
            <input
              type="number"
              className="p-1 w-[150px] border outline-none bg-gray-50"
              value={serviceData?.total?.grossAmount || "0.00"}
              readOnly
            />
          </div>
          <div className="flex justify-between gap-2">
            <label>Tax Amount: </label>
            <input
              type="number"
              className="p-1 w-[150px] border outline-none bg-gray-50"
              value={serviceData?.total?.taxAmount || "0.00"}
              readOnly
            />
          </div>
          <div className="flex justify-between gap-2">
            <label>Grand Total: </label>
            <input
              type="number"
              className="p-1 w-[150px] border outline-none bg-gray-50"
              value={serviceData?.total?.grandTotal || "0.00"}
              readOnly
            />
          </div>
        </div>

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
    </div>
  );
};
