import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const createServiceInvoice = import.meta.env.VITE_BASE_URL_S;

function SnigdhaServiceInvoice({ receiverDetails }) {
  // console.log("All Receiver Details from service invoice", receiverDetails);

  const [items, setItems] = useState([
    {
      query: "",
      filteredSuggestions: [],
      id: "",
      description: "",
      item_id: "",
      quantity: "",
      uom: "",
      group: "", // Add group field here
      hsnCode: "",
      cgst: 0,
      sgst: 0,
      igst: 0,
      sellingPrice: 0,
      grossAmount: 0,
      netAmount: 0,
      taxRate: 0,
      taxAmount: 0,
      amount: 0,
    },
  ]);

  const [totals, setTotals] = useState({
    discount: 0,
    taxableAmount: 0,
    taxAmount: 0,
    transportationCharges: 0,
    grandTotal: 0,
    roundOff: 0,
    totalPayableAmount: 0,
  });

  const addNewRow = () => {
    const newItem = {
      id: items.length + 1,
      description: "",
      quantity: "",
      hsnCode: null,
      uom: null,
      cgst: "",
      sgst: "",
      igst: "",
      gst: "",
      group: null,
      unitPrice: "",
      sellingPrice: "",
      grossAmount: "",
      netAmount: "",
      taxRate: "",
      taxAmount: "",
      amount: "",
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const deleteRow = (index) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const calculateItemValues = (item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.sellingPrice) || 0;
    const cgst = Number(item.cgst) || 0;
    const sgst = Number(item.sgst) || 0;
    const igst = Number(item.igst) || 0;

    // Calculate gross amount
    const grossAmount = qty * price;

    // Calculate tax rate based on tax group
    let taxRate = 0;
    if (receiverDetails.taxGroup === "State Tax") {
      taxRate = cgst + sgst;
    } else if (receiverDetails.taxGroup !== "No Tax") {
      taxRate = igst;
    }

    // Calculate net amount (for now, same as gross - you can add discount logic later)
    const netAmount = grossAmount;

    // Calculate tax amount
    const taxAmount =
      receiverDetails.taxGroup !== "No Tax" ? (netAmount * taxRate) / 100 : 0;

    // Calculate final amount
    const amount = netAmount + taxAmount;

    return {
      ...item,
      grossAmount: Number(grossAmount.toFixed(2)),
      netAmount: Number(netAmount.toFixed(2)),
      taxRate: Number(taxRate.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      amount: Number(amount.toFixed(2)),
    };
  };

  const handleItemChange = (index, event) => {
    const { name, value, type } = event.target;
    let newValue = value;

    // Prevent negative numbers for number fields
    if (type === "number" && Number(newValue) < 0) {
      newValue = Number(newValue);
    }

    // Convert empty strings to null for specific text fields that should be nullable
    const nullableFields = ["group", "uom", "hsnCode"];
    if (nullableFields.includes(name) && newValue === "") {
      newValue = null;
    }

    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: newValue,
      };

      // Recalculate values for this item if it affects calculations
      const fieldsToRecalculate = [
        "quantity",
        "sellingPrice",
        "cgst",
        "sgst",
        "igst",
      ];
      if (fieldsToRecalculate.includes(name)) {
        updatedItems[index] = calculateItemValues(updatedItems[index]);
      }

      return updatedItems;
    });
  };

  useEffect(() => {
    if (!receiverDetails.taxGroup) return;

    setItems((prevItems) =>
      prevItems.map((item) => {
        let updatedItem = { ...item };
        if (receiverDetails.taxGroup === "State Tax") {
          updatedItem.cgst = updatedItem.igst / 2;
          updatedItem.sgst = updatedItem.igst / 2;
          updatedItem.igst = 0;
        } else if (receiverDetails.taxGroup === "No Tax") {
          updatedItem.cgst = 0;
          updatedItem.sgst = 0;
          updatedItem.igst = 0;
        } else {
          updatedItem.igst =
            Number(updatedItem.cgst) + Number(updatedItem.sgst);
          updatedItem.cgst = 0;
          updatedItem.sgst = 0;
        }

        console.log("Updated Items :: ", updatedItem);

        // Recalculate item values if needed
        return calculateItemValues(updatedItem);
      })
    );
  }, [receiverDetails.taxGroup]);

  const calculateTotals = (items) => {
    let taxableAmount = 0;
    let taxAmount = 0;
    let subtotal = 0;

    items.forEach((item) => {
      const net = Number(item.netAmount) || 0;
      const tax = Number(item.taxAmount) || 0;
      const amount = Number(item.amount) || 0;

      taxableAmount += net;
      taxAmount += tax;
      subtotal += amount;
    });

    // Get transportation charges from receiverDetails
    const transportationCharges =
      Number(receiverDetails.transportationCharges) || 0;

    // Calculate grand total including transportation charges
    const grandTotal = subtotal + transportationCharges;

    setTotals((prev) => ({
      ...prev,
      taxableAmount: taxableAmount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      transportationCharges: transportationCharges.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      totalPayableAmount: grandTotal.toFixed(2),
    }));
  };

  const resetForm = () => {
    setItems([
      {
        query: "",
        filteredSuggestions: [],
        id: "",
        description: "",
        item_id: "",
        quantity: "",
        uom: "",
        group: "", // Add group field here
        hsnCode: "",
        cgst: 0,
        sgst: 0,
        igst: 0,
        sellingPrice: 0,
        grossAmount: 0,
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
      transportationCharges: 0,
      grandTotal: 0,
      roundOff: 0,
      totalPayableAmount: 0,
    });
  };

  const handleRoundOffChange = (e) => {
    const value = e.target.value || 0;
    setTotals((prev) => ({
      ...prev,
      roundOff: value.toString(),
    }));
  };

  const handleTransportationChargesChange = (e) => {
    const value = e.target.value || 0;
    setTotals((prev) => ({
      ...prev,
      transportationCharges: value.toString(),
    }));
  };

  useEffect(() => {
    const grandTotal = parseFloat(totals.grandTotal) || 0;
    const transportationCharges = parseFloat(totals.transportationCharges) || 0;
    const roundOff = parseFloat(totals.roundOff) || 0;
    let totalPayableAmount = grandTotal + transportationCharges;

    if (roundOff !== 0) {
      const decimalPart = grandTotal % 1;

      // If decimal part is greater than 0.50, add the roundOff
      // If decimal part is less than or equal to 0.50, subtract the roundOff
      if (decimalPart >= 0.5) {
        totalPayableAmount += roundOff;
      } else {
        totalPayableAmount -= roundOff;
      }
    }

    setTotals((prev) => ({
      ...prev,
      totalPayableAmount: totalPayableAmount.toFixed(2),
    }));
  }, [totals.grandTotal, totals.roundOff, totals.transportationCharges]);

  const handleSave = async () => {
    try {
      // Generate invoice number if empty
      const invoiceNumber =
        receiverDetails.invoiceNumber || `INV-${Date.now()}`;

      // Clean up the items data before sending
      const cleanedItems = items.map((item) => ({
        ...item,
        // Convert empty strings to null for specific fields
        group: item.group === "" ? null : item.group,
        uom: item.uom === "" ? null : item.uom,
        hsnCode: item.hsnCode === "" ? null : item.hsnCode,
        // Convert empty strings to 0 for numeric fields
        cgst: item.cgst === "" ? 0 : Number(item.cgst),
        sgst: item.sgst === "" ? 0 : Number(item.sgst),
        igst: item.igst === "" ? 0 : Number(item.igst),
        quantity: item.quantity === "" ? 0 : Number(item.quantity),
        sellingPrice: item.sellingPrice === "" ? 0 : Number(item.sellingPrice),
      }));

      // Structure the payload according to backend schema
      const payload = {
        // Top-level required fields
        invoiceNumber: invoiceNumber,
        grandTotal: Number(totals.grandTotal),
        paymentType: receiverDetails.paymentType || "cash",
        transportationCharges: Number(totals.transportationCharges),
        roundOff: Number(totals.roundOff),
        totalPayableAmount: Number(totals.totalPayableAmount),

        // Receiver details (required)
        location: receiverDetails.location,
        receiverDetails: {
          id: receiverDetails.id,
          name: receiverDetails.customerName,
          address: Array.isArray(receiverDetails.address)
            ? receiverDetails.address.join(", ")
            : receiverDetails.address || "",
          deliveryAddress: Array.isArray(receiverDetails.deliveryAddress)
            ? receiverDetails.deliveryAddress.join(", ")
            : receiverDetails.deliveryAddress || "",
          phoneNumber: receiverDetails.phone,
          gstin: receiverDetails.gstnumber,
          state: receiverDetails.state,
          vendorCode: receiverDetails.vendorCode,
        },
        vendorCode: receiverDetails.vendorCode,

        // Items and totals
        items: cleanedItems,
        taxableAmount: Number(totals.taxableAmount),
        taxAmount: Number(totals.taxAmount),
        grandTotal: Number(totals.grandTotal),
        totalPayableAmount: Number(totals.totalPayableAmount),

        // Additional fields that might be expected
        date: receiverDetails.date || new Date().toISOString().split("T")[0],
        poDate: receiverDetails.poDate,
        poNumber: receiverDetails.poNumber,
        invoiceType: receiverDetails.invoiceType || "service",
        taxGroup: receiverDetails.taxGroup,
      };

      // console.log("Sending payload:", payload); // Debug log
      

      const response = await fetch(
        `${createServiceInvoice}/api/v1/service-invoice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create invoice");
      }

      const data = await response.json();
      toast.success("Invoice created successfully!");
      resetForm();
      console.log("Success response:", data);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Error creating invoice: " + error.message);
    }
  };

  useEffect(() => {
    calculateTotals(items);
  }, [items, receiverDetails.transportationCharges]);

  return (
    <div>
      {/* Items Table */}
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
            <th className="border border-gray-300 w-[70px] font-normal">
              SL.No
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
              Selling Price
            </th>
            <th className="border border-gray-300 p-1 font-normal w-24">
              Gross Amount
            </th>
            <th className="border border-gray-300 p-1 font-normal w-24">
              Net Amount
            </th>
            {receiverDetails.taxGroup !== "No Tax" &&
              (receiverDetails.taxGroup === "State Tax" ? (
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

            {receiverDetails.taxGroup === "No Tax" ? null : (
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
                  className="w-full p-1 border-none outline-none"
                  name="description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </td>

              <td className="border border-gray-300 p-0">
                <input
                  className="p-1 w-30 outline-none"
                  name="uom"
                  value={item.uom || ""}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-0">
                <input
                  className="p-1 w-30 outline-none"
                  name="group"
                  value={item.group || ""}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-0">
                <input
                  type="text"
                  className="w-full p-1 border-none outline-none"
                  name="hsnCode"
                  value={item.hsnCode || ""}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </td>

              <td className="border border-gray-300 p-0">
                <input
                  type="number"
                  min={0}
                  className="w-full p-1 border-none outline-none"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  required
                />
              </td>
              <td className="border border-gray-300 p-0">
                <input
                  type="number"
                  min={0}
                  className="w-full p-1 border-none outline-none"
                  name="sellingPrice"
                  value={item.sellingPrice}
                  onChange={(e) => handleItemChange(index, e)}
                />
              </td>
              <td className="border border-gray-300 p-0">
                <input
                  type="number"
                  min={0}
                  className="w-full p-1 border-none outline-none bg-gray-50"
                  name="grossAmount"
                  value={item.grossAmount}
                  readOnly
                />
              </td>
              <td className="border border-gray-300 p-0">
                <input
                  type="number"
                  min={0}
                  className="w-full p-1 border-none outline-none bg-gray-50"
                  value={item.netAmount}
                  name="netAmount"
                  readOnly
                />
              </td>
              {receiverDetails.taxGroup !== "No Tax" &&
                (receiverDetails.taxGroup === "State Tax" ? (
                  <>
                    <td className="border border-gray-300 p-0">
                      <input
                        className="w-full p-1 border-none outline-none"
                        name="cgst"
                        type="number"
                        min={0}
                        value={item.cgst}
                        onChange={(e) => handleItemChange(index, e)}
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        className="w-full p-1 border-none outline-none"
                        name="sgst"
                        type="number"
                        min={0}
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
                      type="number"
                      min={0}
                      value={item.igst}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </td>
                ))}
              {receiverDetails.taxGroup !== "No Tax" && (
                <>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="number"
                      value={item.taxRate}
                      className="w-full p-1 border-none outline-none bg-gray-50"
                      readOnly
                    />
                  </td>
                  <td className="border border-gray-300 p-0">
                    <input
                      type="text"
                      value={item.taxAmount}
                      readOnly
                      className="w-full p-1 border-none outline-none bg-gray-50"
                    />
                  </td>
                </>
              )}
              <td className="border border-gray-300 p-0">
                <input
                  type="number"
                  min={0}
                  className="w-full p-1 border-none outline-none bg-gray-50"
                  name="amount"
                  value={item.amount}
                  readOnly
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

      {/* Totals Section */}
      <div className="flex justify-between mt-4">
        <div className="flex-1"></div>
        <div className="w-72">
          <div className="grid grid-cols-2 gap-2 text-sm">
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

            <div className="text-right">Transportation Charges:</div>
            <input
              type="number"
              className="border p-1 bg-gray-50 outline-none"
              value={totals.transportationCharges}
              onChange={handleTransportationChargesChange}
            />

            <div className="text-right">Total:</div>
            <input
              type="number"
              className="border p-1 bg-gray-50 outline-none"
              value={
                Number(totals.transportationCharges || 0) +
                Number(totals.grandTotal || 0)
              }
              readOnly
            />
            <div className="text-right font-bold">Round Off:</div>
            <input
              type="number"
              className="border p-1 bg-gray-50 font-bold outline-none"
              value={totals.roundOff}
              onChange={handleRoundOffChange}
            />

            <div className="text-right font-bold">Total Payable Amount:</div>
            <input
              type="number"
              className="border p-1 bg-gray-50 font-bold outline-none"
              value={totals.totalPayableAmount}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={handleSave}
          className="px-12 py-1 text-lg cursor-pointer bg-gray-100 border hover:bg-gray-200"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default SnigdhaServiceInvoice;
