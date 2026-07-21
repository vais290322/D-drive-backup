import React, { useState } from 'react';

const AddCustomer = ({ setIsAddCustomerOpen, handelSave }) => {
  const [newCustomer, setNewCustomer] = useState({
    companyName: "",
    companyAddress: [],
    landlineNumber: "",
    companyNumber: "",
    companyEmail: "",
    companyDemand: "",
    companyCategory: "",
    companyAlternateNumber: "",
    contactPersonName: "",
    contactPersonEmail: "",
    contactPhoneNumber: "",
    alternateNumber: "",
    personAddress: "",
    segment: "Leads",
    status: "Inactive",
  });

  // Options for dropdowns
  const segments = ["Leads", "Prospects", "Clients"];
  const statuses = ["Engaged", "Inactive"];

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    if (name === "companyAddress") {
      // Split the input string by commas into an array, trimming extra spaces
      setNewCustomer((prev) => ({
        ...prev,
        companyAddress: value.split(',').map(addr => addr.trim()).filter(addr => addr !== ""),
      }));
    } else {
      setNewCustomer((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the save handler with the new customer data
    handelSave(newCustomer);
    // Reset the form fields
    setNewCustomer({
      companyName: "",
      companyAddress: [],
      landlineNumber: "",
      companyNumber: "",
      companyEmail: "",
      companyDemand: "",
      companyCategory: "",
      companyAlternateNumber: "",
      contactPersonName: "",
      contactPersonEmail: "",
      contactPhoneNumber: "",
      alternateNumber: "",
      personAddress: "",
      segment: "Leads",
      status: "Inactive",
    });
    // Close the modal
    setIsAddCustomerOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      {/* Company Name */}
      <div>
        <label className="block mb-1">Company Name</label>
        <input
          type="text"
          name="companyName"
          value={newCustomer.companyName}
          onChange={handleNewCustomerChange}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>
      {/* Company Address as Textarea */}
      <div>
        <label className="block mb-1">Company Address</label>
        <textarea
          name="companyAddress"
          // Display the address array as a comma separated string
          value={newCustomer.companyAddress.join(', ')}
          onChange={handleNewCustomerChange}
          className="w-full border px-2 py-1 rounded"
          placeholder="Separate addresses with commas"
          rows="3"
        />
      </div>
      {/* Landline Number */}
      <div>
        <label className="block mb-1">Landline Number</label>
        <input
          type="text"
          name="landlineNumber"
          value={newCustomer.landlineNumber}
          onChange={handleNewCustomerChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      {/* Company Number */}
      <div>
        <label className="block mb-1">Company Number</label>
        <input
          type="text"
          name="companyNumber"
          value={newCustomer.companyNumber}
          onChange={handleNewCustomerChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      {/* Company Email */}
      <div>
        <label className="block mb-1">Company Email</label>
        <input
          type="email"
          name="companyEmail"
          value={newCustomer.companyEmail}
          onChange={handleNewCustomerChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      {/* Company Demand */}
      <div>
        <label className="block mb-1">Company Demand</label>
        <input
          type="text"
          name="companyDemand"
          value={newCustomer.companyDemand}
          onChange={handleNewCustomerChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      {/* Company Category */}
      <div>
        <label className="block mb-1">Company Category</label>
        <input
          type="text"
          name="companyCategory"
          value={newCustomer.companyCategory}
          onChange={handleNewCustomerChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      {/* Company Alternate Number */}
      <div>
        <label className="block mb-1">Company Alternate Number</label>
        <input
          type="text"
          name="companyAlternateNumber"
          value={newCustomer.companyAlternateNumber}
          onChange={handleNewCustomerChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      {/* Contact Person Name */}
      <div>
        <label className="block mb-1">Contact Person Name</label>
        <input
          type="text"
          name="contactPersonName"
          value={newCustomer.contactPersonName}
          onChange={handleNewCustomerChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      {/* Contact Person Email */}
      <div>
        <label className="block mb-1">Contact Person Email</label>
        <input
          type="email"
          name="contactPersonEmail"
          value={newCustomer.contactPersonEmail}
          onChange={handleNewCustomerChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      {/* Contact Phone Number */}
      <div>
        <label className="block mb-1">Contact Phone Number</label>
        <input
          type="text"
          name="contactPhoneNumber"
          value={newCustomer.contactPhoneNumber}
          onChange={handleNewCustomerChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      {/* Alternate Number */}
      <div>
        <label className="block mb-1">Alternate Number</label>
        <input
          type="text"
          name="alternateNumber"
          value={newCustomer.alternateNumber}
          onChange={handleNewCustomerChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>
      {/* Person Address (Full Width) */}
      <div className="col-span-2">
        <label className="block mb-1">Person Address</label>
        <textarea
          name="personAddress"
          value={newCustomer.personAddress}
          onChange={handleNewCustomerChange}
          className="w-full border px-2 py-1 rounded"
          rows="3"
        />
      </div>
      {/* Segment Select */}
      <div>
        <label className="block mb-1">Segment</label>
        <select
          name="segment"
          value={newCustomer.segment}
          onChange={handleNewCustomerChange}
          className="w-full border px-2 py-1 rounded"
        >
          {segments.map((segment) => (
            <option key={segment} value={segment}>
              {segment}
            </option>
          ))}
        </select>
      </div>
      {/* Status Select */}
      <div>
        <label className="block mb-1">Status</label>
        <select
          name="status"
          value={newCustomer.status}
          onChange={handleNewCustomerChange}
          className="w-full border px-2 py-1 rounded"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      {/* Action Buttons (Full Width) */}
      <div className="col-span-2 flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={() => setIsAddCustomerOpen(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </form>
  );
};

export default AddCustomer;