import React, { useState, useEffect } from "react";
import urls from "../../../src/common/url.js";
import ResourceTable from "./ResourceTable.jsx";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiCode, FiBox, FiList, FiFileText, FiCheckCircle, FiClock, FiHash, FiPlus, FiTrash2, FiSearch } from "react-icons/fi";

const { getEmployeeUrl, createResourceUrl } = urls;

function Resource() {
  const [employeeName, setEmployeeName] = useState("");
  const [email, setEmail] = useState("");
  const [empCode, setEmpCode] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [resourceNames, setResourceNames] = useState([{ names: "" }]);
  const [resourceDescription, setResourceDescription] = useState("");
  const [resourceStatus, setResourceStatus] = useState("");
  const [resourceAvailability, setResourceAvailability] = useState("");
  const [resourceQuantity, setResourceQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // State for dropdown suggestions and visibility
  const [suggestions, setSuggestions] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Reset form after successful submission
  const resetForm = () => {
    setEmployeeName("");
    setEmail("");
    setEmpCode("");
    setResourceType("");
    setResourceNames([{ names: "" }]);
    setResourceDescription("");
    setResourceStatus("");
    setResourceAvailability("");
    setResourceQuantity("");
    setSuggestions([]);
    setDropdownVisible(false);
  };

  // Function to add a new resource name input field
  const handleAddResourceName = () => {
    setResourceNames([...resourceNames, { names: "" }]);
  };

  // Update a specific resource name
  const handleResourceNameChange = (index, value) => {
    const updatedResourceNames = resourceNames.map((item, idx) =>
      idx === index ? { ...item, names: value } : item
    );
    setResourceNames(updatedResourceNames);
  };

  // Function to fetch suggestions with debounce
  const getCustomer = async (name) => {
    // Update the email input value immediately
    setEmail(name);

    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout
    const timeout = setTimeout(async () => {
      if (name.trim() === "") {
        setSuggestions([]);
        setDropdownVisible(false);
        return;
      }

      try {
        const response = await fetch(`${getEmployeeUrl}${name}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        
        if (!data || data.length === 0) {
          toast.error("Employee does not exist");
          setSuggestions([]);
          setDropdownVisible(false);
          return;
        }
        
        setSuggestions(data);
        setDropdownVisible(true);
      } catch (error) {
        toast.error("Error fetching employee data");
        setSuggestions([]);
        setDropdownVisible(false);
      }
    }, 800); // Reduced from 1000ms to 800ms for better responsiveness

    setSearchTimeout(timeout);
  };

  const handleRemoveResourceName = (index) => {
    if (resourceNames.length > 1) {
      setResourceNames(resourceNames.filter((_, i) => i !== index));
    } else {
      toast.error("At least one resource name is required");
    }
  };

  // When a suggestion is clicked, update the email and hide the dropdown
  const handleSelectSuggestion = (selectedEmail) => {
    setEmail(selectedEmail.email);
    setEmployeeName(selectedEmail.employeeName);
    setEmpCode(selectedEmail.employeeCode);
    setDropdownVisible(false);
    setSuggestions([]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate resource names
    const emptyResourceNames = resourceNames.some(item => !item.names.trim());
    
    // Create the resource object
    if (
      !employeeName.trim() ||
      !email.trim() ||
      !empCode.trim() ||
      !resourceType.trim() ||
      emptyResourceNames ||
      !resourceDescription.trim() ||
      !resourceStatus.trim() ||
      !resourceAvailability.trim() ||
      !resourceQuantity.toString().trim()
    ) {
      toast.error("Please fill out all fields before submitting.");
      setLoading(false);
      return;
    }
    
    const resource = {
      employeeName,
      email,
      empCode,
      resourceType,
      resourceName: resourceNames,
      resourceDescription,
      resourceStatus,
      resourceAvailability,
      resourceQuantity,
    };
    
    try {
      const sendData = await fetch(createResourceUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resource),
      });
      
      const response = await sendData.json();
      
      if (response.message !== "Resource created successfully") {
        toast.error(response.message || "Resource not created");
        setLoading(false);
        return;
      }
      
      toast.success("Resource created successfully");
      setFormSubmitted(true);
      resetForm();
    } catch (error) {
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Effect to update ResourceTable when form is submitted
  useEffect(() => {
    if (formSubmitted) {
      setFormSubmitted(false);
    }
  }, [formSubmitted]);

  // Resource status options
  const statusOptions = ["Available", "In Use", "Maintenance", "Retired"];
  const availabilityOptions = ["Available", "Limited", "Unavailable"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Resource Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Resource Management</h1>
            <p className="text-blue-100">
              Assign and manage resources for employees
            </p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Employee Information */}
                <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FiUser className="mr-2 text-indigo-600" />
                    Employee Information
                  </h2>
                  
                  {/* Email field with dropdown */}
                  <div className="mb-4 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiMail className="mr-1 text-indigo-500" />
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => getCustomer(e.target.value)}
                        placeholder="Search by email..."
                        className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    {dropdownVisible && suggestions.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto shadow-lg">
                        {suggestions.map((item, index) => (
                          <li
                            key={index}
                            onClick={() => handleSelectSuggestion(item)}
                            className="cursor-pointer px-4 py-2.5 hover:bg-indigo-50 border-b border-gray-100 last:border-0 flex items-center"
                          >
                            <FiMail className="mr-2 text-indigo-500" />
                            <div>
                              <div className="font-medium text-gray-800">{item.email}</div>
                              <div className="text-sm text-gray-500">{item.employeeName}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  {/* Employee Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiUser className="mr-1 text-indigo-500" />
                      Employee Name
                    </label>
                    <input
                      type="text"
                      value={employeeName}
                      readOnly
                      placeholder="Employee name will appear here"
                      className="w-full border border-gray-300 rounded-lg py-2.5 px-3 bg-gray-50 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                  
                  {/* Employee Code */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiCode className="mr-1 text-indigo-500" />
                      Employee Code
                    </label>
                    <input
                      type="text"
                      value={empCode}
                      readOnly
                      placeholder="Employee code will appear here"
                      className="w-full border border-gray-300 rounded-lg py-2.5 px-3 bg-gray-50 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                {/* Resource Information */}
                <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FiBox className="mr-2 text-indigo-600" />
                    Resource Information
                  </h2>
                  
                  {/* Resource Type */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiBox className="mr-1 text-indigo-500" />
                      Resource Type
                    </label>
                    <select
                      value={resourceType}
                      onChange={(e) => setResourceType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    >
                      <option value="">Select Resource Type</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Software">Software</option>
                      <option value="Office Equipment">Office Equipment</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Vehicle">Vehicle</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  {/* Resource Status */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiCheckCircle className="mr-1 text-indigo-500" />
                      Resource Status
                    </label>
                    <select
                      value={resourceStatus}
                      onChange={(e) => setResourceStatus(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    >
                      <option value="">Select Status</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Resource Availability */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiClock className="mr-1 text-indigo-500" />
                      Resource Availability
                    </label>
                    <select
                      value={resourceAvailability}
                      onChange={(e) => setResourceAvailability(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    >
                      <option value="">Select Availability</option>
                      {availabilityOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Resource Quantity */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiHash className="mr-1 text-indigo-500" />
                      Resource Quantity
                    </label>
                    <input
                      type="number"
                      value={resourceQuantity}
                      onChange={(e) => setResourceQuantity(e.target.value)}
                      placeholder="Enter quantity"
                      min="1"
                      className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
              
              {/* Resource Names and Description */}
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiList className="mr-2 text-indigo-600" />
                  Resource Details
                </h2>
                
                {/* Resource Names */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 sm:flex items-center">
                    <FiList className="mr-1 text-indigo-500" />
                    Resource Names
                  </label>
                  
                  <div className="space-y-3">
                    {resourceNames?.map((resource, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={resource.names}
                          onChange={(e) => handleResourceNameChange(index, e.target.value)}
                          placeholder="Enter resource name (e.g., Dell Laptop XPS 15)"
                          className="flex-1 border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveResourceName(index)}
                          className="p-2.5 cursor-pointer rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                          title="Remove resource"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleAddResourceName}
                    className="mt-3 inline-flex items-center px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors duration-200"
                  >
                    <FiPlus className="mr-1" />
                    Add Another Resource
                  </button>
                </div>
                
                {/* Resource Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <FiFileText className="mr-1 text-indigo-500" />
                    Resource Description
                  </label>
                  <textarea
                    value={resourceDescription}
                    onChange={(e) => setResourceDescription(e.target.value)}
                    placeholder="Enter detailed description of the resource..."
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    rows="4"
                  ></textarea>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiBox className="mr-2" />
                      Submit Resource
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Resource Table */}
        <ResourceTable key={formSubmitted ? "updated" : "initial"} handleSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default Resource;