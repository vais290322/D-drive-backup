import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaPlus, FaSchool, FaPhone, FaEnvelope, FaGlobe, FaIdCard, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import mainUrlApi from "@/common/main";

const InstituteInformationPage = () => {
  const { theme } = useTheme();
  const role = useSelector((state) => state.auth.user);
  const schoolId = useSelector((state)=>state.auth.schoolId);
  const [instituteInformation, setInstituteInformation] = useState([]);
  // console.log("instituteInformation : ", instituteInformation);
  const [input, setInput] = useState({
    schoolName: "",
    schoolCode: "",
    schoolRegistrationNumber: "",
    schoolAddress: "",
    schoolEmail: "",
    schoolPhone: "",
    schoolWebsite: "",
    schoolLogo: null,
    schoolImage: null,
    schoolDescription: "",
    schoolPrincipalName: "",
    schoolPrincipalEmail: "",
    schoolPrincipalPhone: "",
  });

  // Rest of the state and handlers remain the same
  const changeEventHandler = (e) => {
    const { name, value, files } = e.target;
    setInput({
      ...input,
      [name]: files ? files[0] : value,
    });
  };

  const addInstituteInformation = async (e) => {
    e.preventDefault();

    // Create FormData object
    const formData = new FormData();
    for (const key in input) {
      formData.append(key, input[key]);
    }

    try {
      // Make the API request
      const response = await axios.post(
        `${mainUrlApi.instituteInfo.url}/${schoolId}`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response) {
        toast.success("Institute information submitted successfully.");
        fetchInstituteInformation(); // Refresh data after successful submission
      }
    } catch (error) {
      toast.error("Failed to submit institute information.");
    }
  };
  
  const fetchInstituteInformation = async () => {
    try {
      const response = await axios.get(
        `${mainUrlApi.instituteInfo.url}/sc/${schoolId}`
      );
      
      // Check if response.data.data exists and handle both array and object responses
      if (response?.data?.data) {
        // If it's an array, use it directly; if it's an object, wrap it in an array
        const dataToSet = Array.isArray(response.data.data) 
          ? response.data.data 
          : [response.data.data];
        
        setInstituteInformation(dataToSet);
      }
    } catch (error) {
      console.error("Error fetching institute information:", error);
      toast.error("Failed to fetch institute information");
    }
  };
  
  useEffect(() => {
    fetchInstituteInformation();
  }, []);

  return (
    <div className={`${theme === "light" ? "dark" : "light"} min-h-screen bg-gradient-to-b ${theme === "light" ? "from-gray-900 to-gray-800" : "from-gray-50 to-white"}`}>
      <div className="container mx-auto py-8 px-4">
        <div className={`rounded-xl shadow-lg overflow-hidden ${theme === "light" ? "bg-gray-800" : "bg-white"}`}>
          {/* Header */}
          <div className={`flex justify-between items-center p-6 ${theme === "light" ? "bg-gray-700" : "bg-gradient-to-r from-purple-600 to-indigo-600"}`}>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <FaSchool className="text-yellow-400" />
              <span>Institute Information</span>
            </h1>
            
            {instituteInformation && ["admin", "edp", "vais"]?.includes(role) && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-medium rounded-full px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2">
                    <FaPlus /> <span className="hidden md:inline">Add Institute Information</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-full sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-center">Institute Details</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={addInstituteInformation} className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                      {/* Form Fields */}
                      {[
                        { label: "Institute's Name", name: "schoolName", icon: <FaSchool /> },
                        { label: "Institute's Code", name: "schoolCode", icon: <FaIdCard /> },
                        {
                          label: "Registration Number",
                          name: "schoolRegistrationNumber",
                          icon: <FaIdCard />
                        },
                        {
                          label: "Address",
                          name: "schoolAddress",
                          type: "textarea",
                          icon: <FaMapMarkerAlt />
                        },
                        { label: "Email", name: "schoolEmail", type: "email", icon: <FaEnvelope /> },
                        { label: "Phone Number", name: "schoolPhone", icon: <FaPhone /> },
                        {
                          label: "Website URL",
                          name: "schoolWebsite",
                          optional: true,
                          icon: <FaGlobe />
                        },
                        {
                          label: "Description",
                          name: "schoolDescription",
                          type: "textarea",
                          icon: <FaSchool />
                        },
                        {
                          label: "Admin's Name",
                          name: "schoolPrincipalName",
                          icon: <FaUser />
                        },
                        {
                          label: "Admin's Email",
                          name: "schoolPrincipalEmail",
                          type: "email",
                          icon: <FaEnvelope />
                        },
                        {
                          label: "Admin's Phone",
                          name: "schoolPrincipalPhone",
                          icon: <FaPhone />
                        },
                        {
                          label: "Institute's Image",
                          name: "schoolImage",
                          type: "file",
                          icon: <FaSchool />
                        },
                        {
                          label: "Institute's Logo",
                          name: "schoolLogo",
                          type: "file",
                          icon: <FaSchool />
                        },
                      ].map(({ label, name, type = "text", optional, icon }) => (
                        <div key={name} className="flex flex-col gap-2">
                          <Label htmlFor={name} className="flex items-center gap-2 text-sm font-medium">
                            {icon}
                            {label}
                            {!optional ? (
                              <sup className="text-red-600">*</sup>
                            ) : (
                              <span className="text-xs text-gray-500">(optional)</span>
                            )}
                          </Label>
                          {type === "textarea" ? (
                            <textarea
                              id={name}
                              name={name}
                              value={input[name]}
                              onChange={changeEventHandler}
                              className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              required={!optional}
                              rows={3}
                            />
                          ) : (
                            <div className="relative">
                              <Input
                                type={type}
                                id={name}
                                name={name}
                                value={type === "file" ? undefined : input[name]}
                                onChange={changeEventHandler}
                                required={!optional}
                                className={`pl-2 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${type === "file" ? "pt-1" : ""}`}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <DialogFooter className="mt-6">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-full px-6 py-2 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Save Information
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Content */}
          <div className={`p-6 ${theme === "light" ? "text-white" : "text-gray-800"}`}>
            {instituteInformation.length > 0 ? (
              instituteInformation.map((institute, index) => (
                <div
                  key={index}
                  className={`rounded-xl shadow-lg overflow-hidden mb-8 transition-all duration-300 hover:shadow-xl ${
                    theme === "light" ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  <div className="md:flex">
                    {/* Left Column: Images */}
                    <div className="md:w-1/3 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900">
                      {institute.schoolLogo && (
                        <div className="mb-6 rounded-full p-2 bg-white dark:bg-gray-800 shadow-lg">
                          <img
                            src={institute.schoolLogo}
                            alt="School Logo"
                            className="w-32 h-32 object-contain rounded-full"
                          />
                        </div>
                      )}
                      {institute.schoolImage && (
                        <div className="w-full overflow-hidden rounded-lg shadow-md">
                          <img
                            src={institute.schoolImage}
                            alt="School Image"
                            className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      )}
                    </div>

                    {/* Right Column: Details */}
                    <div className="md:w-2/3 p-6">
                      <h2 className={`text-2xl font-bold mb-6 ${theme === "light" ? "text-yellow-400" : "text-purple-700"} border-b pb-2`}>
                        {institute.schoolName || "Institute Name Not Available"}
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <div className="flex items-start gap-3">
                          <FaIdCard className={`mt-1 ${theme === "light" ? "text-yellow-400" : "text-purple-600"}`} />
                          <div>
                            <p className="font-semibold">Registration Number</p>
                            <p className={`${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>
                              {institute.schoolRegistrationNumber || "N/A"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <FaIdCard className={`mt-1 ${theme === "light" ? "text-yellow-400" : "text-purple-600"}`} />
                          <div>
                            <p className="font-semibold">Institute Code</p>
                            <p className={`${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>
                              {institute.schoolCode || "N/A"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <FaMapMarkerAlt className={`mt-1 ${theme === "light" ? "text-yellow-400" : "text-purple-600"}`} />
                          <div>
                            <p className="font-semibold">Address</p>
                            <p className={`${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>
                              {institute.schoolAddress || "N/A"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <FaEnvelope className={`mt-1 ${theme === "light" ? "text-yellow-400" : "text-purple-600"}`} />
                          <div>
                            <p className="font-semibold">Email</p>
                            <p className={`${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>
                              {institute.schoolEmail || "N/A"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <FaPhone className={`mt-1 ${theme === "light" ? "text-yellow-400" : "text-purple-600"}`} />
                          <div>
                            <p className="font-semibold">Phone</p>
                            <p className={`${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>
                              {institute.schoolPhone || "N/A"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <FaGlobe className={`mt-1 ${theme === "light" ? "text-yellow-400" : "text-purple-600"}`} />
                          <div>
                            <p className="font-semibold">Website</p>
                            {institute.schoolWebsite ? (
                              <a
                                href={institute.schoolWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${theme === "light" ? "text-blue-300 hover:text-blue-400" : "text-blue-600 hover:text-blue-700"}`}
                              >
                                {institute.schoolWebsite}
                              </a>
                            ) : (
                              <p className={`${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>N/A</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <FaUser className={`mt-1 ${theme === "light" ? "text-yellow-400" : "text-purple-600"}`} />
                          <div>
                            <p className="font-semibold">Admin's Name</p>
                            <p className={`${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>
                              {institute.schoolPrincipalName || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <FaEnvelope className={`mt-1 ${theme === "light" ? "text-yellow-400" : "text-purple-600"}`} />
                          <div>
                            <p className="font-semibold">Admin's Email</p>
                            <p className={`${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>
                              {institute.schoolPrincipalEmail || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <FaPhone className={`mt-1 ${theme === "light" ? "text-yellow-400" : "text-purple-600"}`} />
                          <div>
                            <p className="font-semibold">Admin's Phone</p>
                            <p className={`${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>
                              {institute.schoolPrincipalPhone || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 col-span-2">
                          <FaSchool className={`mt-1 ${theme === "light" ? "text-yellow-400" : "text-purple-600"}`} />
                          <div>
                            <p className="font-semibold">Description</p>
                            <p className={`${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>
                              {institute.schoolDescription || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      {["admin", "edp", "vais"]?.includes(role) && (
                        <div className="mt-6 flex justify-end gap-3">
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg"
                            onClick={() => {
                              // Implement edit functionality if needed
                              toast.info("Edit functionality will be implemented soon");
                            }}
                          >
                            Edit Information
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className={`p-6 rounded-full ${theme === "light" ? "bg-gray-700" : "bg-gray-100"} mb-4`}>
                  <FaSchool className={`text-5xl ${theme === "light" ? "text-yellow-400" : "text-purple-600"}`} />
                </div>
                <p className="text-center text-lg font-medium mb-2">No Institute Information Available</p>
                <p className={`text-center ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>
                  Please add your institute information using the button above.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-8 text-center ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>
          <p>© {new Date().getFullYear()} Institute Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default InstituteInformationPage;