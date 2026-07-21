import React, { useState } from 'react';
import { FaBuilding, FaPhone, FaEnvelope, FaUser, FaIdCard, FaUniversity, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';

const AddCustomer = ({ setIsAddCustomerOpen, handelSave }) => {
  const [newCustomer, setNewCustomer] = useState({
    companyName: "",
    companyAddress: "",
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
    location:"",
    // New fields
    gstNumber: "",
    panNumber: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    bankBranch: "",
    accountHolderName: "",
    deliveryAddress: "",
  });

  // Options for dropdowns
  const segments = ["Leads", "Prospects", "Clients"];
  const statuses = ["Engaged", "Inactive"];

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process addresses before saving
    const processedCustomer = {
      ...newCustomer,
      companyAddress: newCustomer.companyAddress ? newCustomer.companyAddress.split(',').map(addr => addr.trim()).filter(addr => addr !== "") : [],
      deliveryAddress: newCustomer.deliveryAddress ? newCustomer.deliveryAddress.split(',').map(addr => addr.trim()).filter(addr => addr !== "") : []
    };
    
    // Call the save handler with the processed customer data
    handelSave(processedCustomer);
    
    // Reset the form fields
    setNewCustomer({
      companyName: "",
      companyAddress: "",
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
      location:"",
      // Reset new fields
      gstNumber: "",
      panNumber: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      bankBranch: "",
      accountHolderName: "",
      deliveryAddress: "",
    });
    // Close the modal
    setIsAddCustomerOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
      {/* <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Add New Client</h2> */}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaBuilding className="inline mr-2 text-blue-600" />
                Client Name*
              </label>
              <input
                type="text"
                name="companyName"
                value={newCustomer.companyName}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {/* Company Category */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaBuilding className="inline mr-2 text-blue-600" />
                Client Category
              </label>
              <input
                type="text"
                name="companyCategory"
                value={newCustomer.companyCategory}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Company Email */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaEnvelope className="inline mr-2 text-blue-600" />
                Client Email
              </label>
              <input
                type="email"
                name="companyEmail"
                value={newCustomer.companyEmail}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Company Number */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaPhone className="inline mr-2 text-blue-600" />
                Client Number
              </label>
              <input
                type="text"
                name="companyNumber"
                value={newCustomer.companyNumber}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Company Alternate Number */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaPhone className="inline mr-2 text-blue-600" />
                Client Alternate Number
              </label>
              <input
                type="text"
                name="companyAlternateNumber"
                value={newCustomer.companyAlternateNumber}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Landline Number */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaPhone className="inline mr-2 text-blue-600" />
                Landline Number
              </label>
              <input
                type="text"
                name="landlineNumber"
                value={newCustomer.landlineNumber}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* GST Number */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaIdCard className="inline mr-2 text-blue-600" />
                GST Number
              </label>
              <input
                type="text"
                name="gstNumber"
                value={newCustomer.gstNumber}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* PAN Number */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaIdCard className="inline mr-2 text-blue-600" />
                PAN Number
              </label>
              <input
                type="text"
                name="panNumber"
                value={newCustomer.panNumber}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* location */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaMapMarkerAlt className="inline mr-2 text-blue-600" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={newCustomer.location}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Company Address as Textarea - Full Width */}
          <div className="mt-4">
            <label className="block mb-1 font-medium text-gray-700">
              <FaMapMarkerAlt className="inline mr-2 text-blue-600" />
              Client Address
            </label>
            <textarea
              name="companyAddress"
              value={newCustomer.companyAddress}
              onChange={handleNewCustomerChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Separate addresses with commas"
              rows="2"
            />
          </div>
          
          {/* Delivery Address as Textarea - Full Width */}
          <div className="mt-4">
            <label className="block mb-1 font-medium text-gray-700">
              <FaMapMarkerAlt className="inline mr-2 text-blue-600" />
              Delivery Address
            </label>
            <textarea
              name="deliveryAddress"
              value={newCustomer.deliveryAddress}
              onChange={handleNewCustomerChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Separate delivery addresses with commas"
              rows="2"
            />
          </div>
        </div>
        
        {/* Contact Person Section */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-green-800">Contact Person Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Person Name */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaUser className="inline mr-2 text-green-600" />
                Contact Person Name
              </label>
              <input
                type="text"
                name="contactPersonName"
                value={newCustomer.contactPersonName}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            {/* Contact Person Email */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaEnvelope className="inline mr-2 text-green-600" />
                Contact Person Email
              </label>
              <input
                type="email"
                name="contactPersonEmail"
                value={newCustomer.contactPersonEmail}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            {/* Contact Phone Number */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaPhone className="inline mr-2 text-green-600" />
                Contact Phone Number
              </label>
              <input
                type="text"
                name="contactPhoneNumber"
                value={newCustomer.contactPhoneNumber}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            {/* Alternate Number */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaPhone className="inline mr-2 text-green-600" />
                Alternate Number
              </label>
              <input
                type="text"
                name="alternateNumber"
                value={newCustomer.alternateNumber}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
        
        {/* Banking Details Section */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-purple-800">Banking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bank Name */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaUniversity className="inline mr-2 text-purple-600" />
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={newCustomer.bankName}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            {/* Account Number */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaCreditCard className="inline mr-2 text-purple-600" />
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={newCustomer.accountNumber}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            {/* IFSC Code */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaIdCard className="inline mr-2 text-purple-600" />
                IFSC Code
              </label>
              <input
                type="text"
                name="ifscCode"
                value={newCustomer.ifscCode}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            {/* Bank Branch */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaUniversity className="inline mr-2 text-purple-600" />
                Bank Branch
              </label>
              <input
                type="text"
                name="bankBranch"
                value={newCustomer.bankBranch}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            {/* Account Holder Name */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">
                <FaUser className="inline mr-2 text-purple-600" />
                Account Holder Name
              </label>
              <input
                type="text"
                name="accountHolderName"
                value={newCustomer.accountHolderName}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
        
        {/* Classification Section */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-yellow-800">Classification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Segment Select */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">Segment</label>
              <select
                name="segment"
                value={newCustomer.segment}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {segments.map((segment) => (
                  <option key={segment} value={segment}>
                    {segment}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Status Select */}
            <div className="flex flex-col">
              <label className="block mb-1 font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={newCustomer.status}
                onChange={handleNewCustomerChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setIsAddCustomerOpen(false)}
            className="bg-gray-500 cursor-pointer hover:bg-gray-600 text-white px-5 py-2 rounded-md transition-colors duration-300"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-colors duration-300 flex items-center"
          >
            <FaUser className="mr-2" /> Save Client
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;