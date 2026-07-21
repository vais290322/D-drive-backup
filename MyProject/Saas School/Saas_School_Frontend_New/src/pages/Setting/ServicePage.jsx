import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { BiBusSchool } from "react-icons/bi";
import { LiaEdit } from "react-icons/lia";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import axios from "axios";
import serviceUrlApi from "@/common/service";
import DeleteComponent from "@/components/DeleteData/DeleteComponent";
import { toast } from "sonner";

const ServicePage = () => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");
  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const schoolId = useSelector((state)=>state.auth.schoolId);
  useEffect(() => {

 const getServices = async () => {
    const getResp = await axios.get(`${serviceUrlApi.getServiceApi.url}/${schoolId}`);
    console.log(getResp.data.serviceType);
    console.log(schoolId);
    setServices(getResp.data);
 }
   getServices()

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${serviceUrlApi.postServiceApi.url}`, {
        serviceType: serviceName,
        description: serviceDescription,
        charge: serviceCharge,
        schoolId: schoolId
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const newService = response.data;
      setServices([
        ...services,
        newService,
      ]);
      setServiceName("");
      setServiceDescription("");
      setServiceCharge("");
      setShowModal(false);
      toast.success('Service added successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong!");
    }
  };

  // Open modal for editing
  const openEditModal = (service) => {
    setIsEditing(true);
    setEditingService(service);
    setServiceName(service.serviceType);
    setServiceDescription(service.description);
    setServiceCharge(service.charge);
    setShowModal(true);
  };

  // Handle edit submit
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${serviceUrlApi.putServiceApi.url}/${editingService?.id}`,
        {
          serviceType: serviceName,
          description: serviceDescription,
          charge: serviceCharge,
          schoolId: schoolId,
          id: editingService?.id
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      // Update local state
      setServices(services.map(s => s.id === editingService.id ? { ...s, serviceType: serviceName, description: serviceDescription, charge: serviceCharge } : s));
      setShowModal(false);
      setIsEditing(false);
      setEditingService(null);
      setServiceName("");
      setServiceDescription("");
      setServiceCharge("");
      toast.success('Service updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to update service!");
    }
  };

  // Handler to remove service from local state after deletion
  const handleDeleteService = (id) => {
    setServices(services.filter((service) => service.id !== id));
  };

  return (
    // Theme-based wrapper
    <div className={`${theme === "light" ? "dark" : "light"} min-h-screen bg-gradient-to-b ${theme === "light" ? "from-gray-900 to-gray-800" : "from-gray-50 to-white"}`}>
      <div className={`rounded-xl shadow-lg overflow-hidden ${theme === "light" ? "bg-gray-800" : "bg-white"} m-4`}>
        {/* Header */}
        <div className={`${theme === "light" ? "bg-gray-800"   : " bg-gradient-to-r from-[#d82878] to-[#2762ea]" } rounded-t-xl px-4 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3`}>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BiBusSchool className="text-white-800 text-2xl sm:text-3xl" />
            Services Management
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-700 hover:from-indigo-600 hover:to-purple-800 text-white font-medium rounded-full px-3 sm:px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 text-sm sm:text-base"
          >
            + Add New Service
          </button>
        </div>
        {/* Content */}
        <div className={`p-6 ${theme === "light" ? "bg-gray-800"   : "bg-white" }  rounded-b-xl shadow-lg overflow-x-auto`}>
          <table className={`${theme === "light" ? "bg-gray-800": "bg-white" } min-w-full text-left border-collapse `}>
            <thead >
              <tr className={`${theme === "light" ? "bg-gray-800": "bg-gradient-to-r from-pink-100 to-purple-100" } `}>
                <th className="py-2 px-2 sm:px-4 rounded-tl-xl text-xs sm:text-sm">S.No</th>
                <th className="py-2 px-2 sm:px-4 text-xs sm:text-sm">Service Name</th>
                <th className="py-2 px-2 sm:px-4 text-xs sm:text-sm">Description</th>
                <th className="py-2 px-2 sm:px-4 text-xs sm:text-sm">Charge</th>
                <th className="py-2 px-2 sm:px-4 rounded-tr-xl text-xs sm:text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, idx) => (
                <tr key={service.id || idx} className={`border-b last:border-b-0 ${theme === "light" ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"}`}>
                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{idx + 1}</td>
                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm break-words max-w-[120px] sm:max-w-[200px]">{service.serviceType}</td>
                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm break-words max-w-[150px] sm:max-w-[300px]">{service.description}</td>
                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{service.charge}</td>
                  <td className="py-2 px-2 sm:px-4 flex gap-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded transition text-lg sm:text-2xl"
                      onClick={() => openEditModal(service)}
                    >
                      <LiaEdit />
                    </button>
                    <DeleteComponent
                      deletePath={`${serviceUrlApi.deleteServiceApi.url}/${service.id}`}
                      name="Service"
                      onDelete={() => handleDeleteService(service.id)}
                      customData={service.serviceType}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination and other controls can be added here */}
        </div>
      </div>
            {/* Modal */}
            {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className={`rounded-xl shadow-lg p-4 sm:p-8 w-[95vw] max-w-md relative mx-2 ${
            theme === "light" 
              ? "bg-gray-800 border border-gray-700 text-white" 
              : "bg-white border border-gray-200"
          }`}>
            <button
              className={`absolute top-2 right-2 text-2xl ${
                theme === "light" 
                  ? "text-gray-400 hover:text-gray-200" 
                  : "text-gray-400 hover:text-gray-700"
              }`}
              onClick={() => {
                setShowModal(false);
                setIsEditing(false);
                setEditingService(null);
                setServiceName("");
                setServiceDescription("");
                setServiceCharge("");
              }}
            >
              &times;
            </button>
            <h3 className={`text-lg sm:text-xl font-bold mb-4 text-center pb-2 border-b ${
              theme === "light" 
                ? "text-indigo-300 border-gray-700" 
                : "text-purple-700 border-gray-200"
            }`}>
              <div className="flex items-center justify-center gap-2">
                <BiBusSchool className={`${theme === "light" ? "text-indigo-400" : "text-indigo-600"}`} />
                {isEditing ? "Edit Service" : "Add a New Service"}
              </div>
            </h3>
            <form onSubmit={isEditing ? handleEdit : handleSubmit}>
              <div className="mb-4">
                <label 
                  htmlFor="serviceName" 
                  className={`block text-base font-medium mb-2 ${
                    theme === "light" ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Service Type Name
                </label>
                <input
                  type="text"
                  id="serviceName"
                  name="serviceName"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Enter service type name"
                  required
                  className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition text-sm sm:text-base ${
                    theme === "light"
                      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-transparent"
                      : "bg-white border border-purple-300 text-gray-900 focus:ring-purple-400 focus:border-transparent"
                  }`}
                />
              </div>
              <div className="mb-4">
                <label 
                  htmlFor="serviceDescription" 
                  className={`block text-base font-medium mb-2 ${
                    theme === "light" ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Service Description
                </label>
                <textarea
                  id="serviceDescription"
                  name="serviceDescription"
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="Enter service description"
                  required
                  rows={2}
                  className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition resize-none text-sm sm:text-base ${
                    theme === "light"
                      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-transparent"
                      : "bg-white border border-purple-300 text-gray-900 focus:ring-purple-400 focus:border-transparent"
                  }`}
                />
              </div>
              <div className="mb-4">
                <label 
                  htmlFor="serviceCharge" 
                  className={`block text-base font-medium mb-2 ${
                    theme === "light" ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Service Charge
                </label>
                <input
                  type="number"
                  id="serviceCharge"
                  step="any"
                  name="serviceCharge"
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(e.target.value)}
                  placeholder="Enter service charge"
                  required
                  min="0"
                  className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition text-sm sm:text-base ${
                    theme === "light"
                      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-indigo-500 focus:border-transparent"
                      : "bg-white border border-purple-300 text-gray-900 focus:ring-purple-400 focus:border-transparent"
                  }`}
                />
              </div>
              <button
                type="submit"
                className={`w-full py-2 mt-4 text-white font-semibold rounded-lg shadow-md transition text-sm sm:text-base ${
                  theme === "light"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800"
                    : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                }`}
              >
                {isEditing ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePage;

