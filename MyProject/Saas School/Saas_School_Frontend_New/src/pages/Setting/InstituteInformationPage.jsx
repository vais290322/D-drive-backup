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
import { FaPlus, FaSchool, FaPhone, FaEnvelope, FaGlobe, FaIdCard, FaMapMarkerAlt, FaUser, FaEdit, FaSave, FaSignature } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import mainUrlApi from "@/common/main";

const InstituteInformationPage = () => {
  const { theme } = useTheme();
  const role = useSelector((state) => state?.auth?.user);
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  // console.log("school Id : ",schoolId);

  const [instituteInformation, setInstituteInformation] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentInstitute, setCurrentInstitute] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [headmasterSignatureDialogOpen, setHeadmasterSignatureDialogOpen] = useState(false);
  const [headmasterSignature, setHeadmasterSignature] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [signatureLoading, setSignatureLoading] = useState(false);
  const [editInput, setEditInput] = useState({
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
  const [logoPreview, setLogoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // console.log("headmasterSignature",headmasterSignature)

  // Add a new state for loading during form submission
  const [submitLoading, setSubmitLoading] = useState(false);

  // Rest of the state and handlers remain the same
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

  const editChangeEventHandler = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setEditInput({
        ...editInput,
        [name]: files[0],
      });

      // Create preview for images
      if (name === "schoolLogo") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      } else if (name === "schoolImage") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setEditInput({
        ...editInput,
        [name]: value,
      });
    }
  };

  const handleEditClick = (institute) => {
    setCurrentInstitute(institute);
    setEditInput({
      schoolName: institute.schoolName || "",
      schoolCode: institute.schoolCode || "",
      schoolRegistrationNumber: institute.schoolRegistrationNumber || "",
      schoolAddress: institute.schoolAddress || "",
      schoolEmail: institute.schoolEmail || "",
      schoolPhone: institute.schoolPhone || "",
      schoolWebsite: institute.schoolWebsite || "",
      schoolLogo: null, // File inputs can't be pre-filled
      schoolImage: null, // File inputs can't be pre-filled
      schoolDescription: institute.schoolDescription || "",
      schoolPrincipalName: institute.schoolPrincipalName || "",
      schoolPrincipalEmail: institute.schoolPrincipalEmail || "",
      schoolPrincipalPhone: institute.schoolPrincipalPhone || "",
    });
    setLogoPreview(institute.schoolLogo);
    setImagePreview(institute.schoolImage);
    setEditDialogOpen(true);
  };

  const updateInstituteInformation = async (e) => {
    e.preventDefault();

    if (!currentInstitute?.id) {
      toast.error("Institute ID not found");
      return;
    }

    try {
      setUpdateLoading(true);

      // Create FormData for file uploads
      const formData = new FormData();

      // Add all text fields
      Object.keys(editInput).forEach(key => {
        if (key !== "schoolLogo" && key !== "schoolImage") {
          formData.append(key, editInput[key]);
        }
      });

      // Add images only if they were changed
      if (editInput.schoolLogo) {
        formData.append("schoolLogo", editInput.schoolLogo);
      }

      if (editInput.schoolImage) {
        formData.append("schoolImage", editInput.schoolImage);
      }

      // Make the API request
      const response = await axios.put(
        `${mainUrlApi.instituteInfo.url}/${schoolId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response) {
        toast.success("Institute information updated successfully!");
        setEditDialogOpen(false);

        // Update the local state
        const updatedInstitutes = instituteInformation.map(institute =>
          institute.id === currentInstitute.id
            ? {
              ...institute,
              schoolName: editInput.schoolName,
              schoolCode: editInput.schoolCode,
              schoolRegistrationNumber: editInput.schoolRegistrationNumber,
              schoolAddress: editInput.schoolAddress,
              schoolEmail: editInput.schoolEmail,
              schoolPhone: editInput.schoolPhone,
              schoolWebsite: editInput.schoolWebsite,
              schoolDescription: editInput.schoolDescription,
              schoolPrincipalName: editInput.schoolPrincipalName,
              schoolPrincipalEmail: editInput.schoolPrincipalEmail,
              schoolPrincipalPhone: editInput.schoolPrincipalPhone,
              schoolLogo: logoPreview,
              schoolImage: imagePreview
            }
            : institute
        );

        setInstituteInformation(updatedInstitutes);

        // Refresh data from server
        fetchInstituteInformation();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update institute information");
    } finally {
      setUpdateLoading(false);
    }
  };

  const addInstituteInformation = async (e) => {
    e.preventDefault();

    // Create FormData object
    const formData = new FormData();
    for (const key in input) {
      formData.append(key, input[key]);
    }

    try {
      setSubmitLoading(true); // Set loading to true when submission starts

      // Make the API request
      const response = await axios.post(
        `${mainUrlApi.instituteInfo?.url}/${schoolId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response) {
        toast.success(response?.data?.message || "Institute information submitted successfully.");
        fetchInstituteInformation(); // Refresh data after successful submission
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit institute information.");
    } finally {
      setSubmitLoading(false); // Set loading to false when submission ends
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

  // Headmaster Signature Photo Functions
  const fetchHeadmasterSignature = async () => {
    try {
      const response = await axios.get(
        `${mainUrlApi.headmasterSignaturePhoto.url}/${schoolId}`
      );

      if (response?.data?.success && response?.data?.data) {
        setHeadmasterSignature(response.data.data);
        setSignaturePreview(response.data.data.photo.fileUrl);
      }
    } catch (error) {
      // Don't show error toast if signature doesn't exist (it's optional)
      if (error?.response?.status !== 404) {
        console.error("Error fetching headmaster signature:", error);
      }
    }
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignatureFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = async (e) => {
    e.preventDefault();

    if (!signatureFile) {
      toast.error("Please select a signature file");
      return;
    }

    try {
      setSignatureLoading(true);

      const formData = new FormData();
      formData.append("photo", signatureFile);
      formData.append("schoolId", schoolId);

      const endpoint = `${mainUrlApi.headmasterSignaturePhoto.url}`;

      const response = headmasterSignature ? await axios.put(
        endpoint,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ) : await axios.post(
        endpoint,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.success) {
        toast.success(headmasterSignature ? "Signature updated successfully!" : "Signature uploaded successfully!");
        setHeadmasterSignature(response.data.data);
        setSignaturePreview(response.data.data.photo.fileUrl);
        setHeadmasterSignatureDialogOpen(false);
        setSignatureFile(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload signature");
    } finally {
      setSignatureLoading(false);
    }
  };

  const handleSignatureDelete = async () => {
    try {
      if (!headmasterSignature) {
        toast.error("No signature found to delete");
        return;
      }

      const response = await axios.delete(
        `${mainUrlApi.headmasterSignaturePhoto.url}`,
        {
          data: { schoolId },
        }
      );

      if (response?.data?.success) {
        toast.success("Signature deleted successfully!");
        setHeadmasterSignature(null);
        setSignaturePreview(null);
        setSignatureFile(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete signature");
    }
  };

  useEffect(() => {
    fetchInstituteInformation();
    fetchHeadmasterSignature();
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
                        disabled={submitLoading}
                        className={`bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-full px-6 py-2 transition-all duration-300 shadow-md hover:shadow-lg ${submitLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {submitLoading ? (
                          <div className="flex items-center gap-2">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </div>
                        ) : (
                          <>
                            <FaSave className="mr-2" /> Save Information
                          </>
                        )}
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
                  className={`rounded-xl shadow-lg overflow-hidden mb-8 transition-all duration-300 hover:shadow-xl ${theme === "light" ? "bg-gray-700" : "bg-white"
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
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                            onClick={() => handleEditClick(institute)}
                          >
                            <FaEdit /> Edit Information
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
          {/* Headmaster Signature Section */}
          <div className="mt-6 flex justify-center mb-10 border">
            <div className={`rounded-lg p-4 ${theme === "light" ? "bg-gray-800" : "bg-gray-100"}`}>
              <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${theme === "light" ? "text-white" : "text-gray-800"}`}>
                <FaSignature className="text-purple-500" />
                Headmaster's Signature
              </h3>

              {signaturePreview ? (
                <div className="relative">
                  <img
                    src={signaturePreview}
                    alt="Headmaster Signature"
                    className="w-full h-32 object-contain bg-white rounded-md p-2"
                  />
                  {["admin", "edp", "vais"]?.includes(role) && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2"
                        onClick={() => setHeadmasterSignatureDialogOpen(true)}
                      >
                        <FaEdit className="mr-1" /> Update
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1 text-xs py-2"
                        onClick={handleSignatureDelete}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <FaSignature className={`text-4xl mx-auto mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`} />
                  <p className={`text-xs mb-3 ${theme === "light" ? "text-gray-400" : "text-gray-600"}`}>
                    No signature uploaded
                  </p>
                  {["admin", "edp", "vais"]?.includes(role) && (
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                      onClick={() => setHeadmasterSignatureDialogOpen(true)}
                    >
                      <FaPlus className="mr-1" /> Add Signature
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className={`  max-w-full sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] rounded-xl ${theme === "light" ? "bg-gray-800 " : "bg-white"}`}>
            <DialogHeader>
              <DialogTitle className={`text-xl font-bold text-center flex items-center justify-center gap-2 ${theme === "light" ? "text-white" : "text-gray-800"}`}>
                <FaEdit className="text-purple-500" />
                <span>Update Institute Information</span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={updateInstituteInformation} className="mt-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                {/* Left Column - Images */}
                <div className="space-y-6">
                  {/* Institute Logo Upload */}
                  <div className={`p-5 rounded-lg ${theme === "light" ? "bg-gray-700" : "bg-gray-50"
                    }`}>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <FaSchool className="w-5 h-5 mr-2 text-purple-500" />
                      Institute Logo
                    </h3>

                    <div className="flex flex-col items-center">
                      <div className="relative mb-4">
                        <img
                          src={logoPreview || "https://via.placeholder.com/150?text=Institute+Logo"}
                          alt="Logo Preview"
                          className="w-32 h-32 rounded-full object-cover border-4 shadow-md"
                          style={{ borderColor: theme === "light" ? "#4B5563" : "#E5E7EB" }}
                        />
                        <label
                          htmlFor="schoolLogo"
                          className={`absolute bottom-0 right-0 rounded-full p-1 cursor-pointer ${theme === "light" ? "bg-gray-700" : "bg-white"
                            }`}
                        >
                          <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-purple-600 transition-colors">
                            <FaEdit className="w-4 h-4" />
                          </div>
                        </label>
                      </div>

                      <input
                        type="file"
                        id="schoolLogo"
                        name="schoolLogo"
                        accept="image/*"
                        onChange={editChangeEventHandler}
                        className="hidden"
                      />

                      <Label
                        htmlFor="schoolLogo"
                        className={`text-sm cursor-pointer px-3 py-1 rounded-md ${theme === "light"
                            ? "bg-gray-600 hover:bg-gray-500"
                            : "bg-gray-200 hover:bg-gray-300"
                          } transition-colors`}
                      >
                        Choose Logo
                      </Label>
                    </div>
                  </div>

                  {/* Institute Image Upload */}
                  <div className={`p-5 rounded-lg ${theme === "light" ? "bg-gray-700" : "bg-gray-50"
                    }`}>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <FaSchool className="w-5 h-5 mr-2 text-purple-500" />
                      Institute Image
                    </h3>

                    <div className="flex flex-col items-center">
                      <div className="relative mb-4 w-full">
                        <img
                          src={imagePreview || "https://via.placeholder.com/300x200?text=Institute+Image"}
                          alt="Institute Preview"
                          className="w-full h-48 object-cover rounded-lg border-2 shadow-md"
                          style={{ borderColor: theme === "light" ? "#4B5563" : "#E5E7EB" }}
                        />
                        <label
                          htmlFor="schoolImage"
                          className={`absolute bottom-2 right-2 rounded-full p-1 cursor-pointer ${theme === "light" ? "bg-gray-700" : "bg-white"
                            }`}
                        >
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600 transition-colors">
                            <FaEdit className="w-4 h-4" />
                          </div>
                        </label>
                      </div>

                      <input
                        type="file"
                        id="schoolImage"
                        name="schoolImage"
                        accept="image/*"
                        onChange={editChangeEventHandler}
                        className="hidden"
                      />

                      <Label
                        htmlFor="schoolImage"
                        className={`text-sm cursor-pointer px-3 py-1 rounded-md ${theme === "light"
                            ? "bg-gray-600 hover:bg-gray-500"
                            : "bg-gray-200 hover:bg-gray-300"
                          } transition-colors`}
                      >
                        Choose Institute Image
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Right Column - Form Fields */}
                <div className="space-y-4">
                  {/* Basic Information */}
                  <div className={`p-5 rounded-lg ${theme === "light" ? "bg-gray-700" : "bg-gray-50"
                    }`}>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <FaSchool className="w-5 h-5 mr-2 text-purple-500" />
                      Basic Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="schoolName" className="text-sm font-medium">Institute's Name</Label>
                        <Input
                          id="schoolName"
                          name="schoolName"
                          value={editInput.schoolName}
                          onChange={editChangeEventHandler}
                          className={`border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === "light" ? "bg-gray-600" : ""}`}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="schoolCode" className="text-sm font-medium">Institute's Code</Label>
                        <Input
                          id="schoolCode"
                          name="schoolCode"
                          value={editInput.schoolCode}
                          onChange={editChangeEventHandler}
                          className={`border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === "light" ? "bg-gray-600" : ""}`}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="schoolRegistrationNumber" className="text-sm font-medium">Registration Number</Label>
                        <Input
                          id="schoolRegistrationNumber"
                          name="schoolRegistrationNumber"
                          value={editInput.schoolRegistrationNumber}
                          onChange={editChangeEventHandler}
                          className={`border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === "light" ? "bg-gray-600" : ""}`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className={`p-5 rounded-lg ${theme === "light" ? "bg-gray-700" : "bg-gray-50"
                    }`}>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <FaPhone className="w-5 h-5 mr-2 text-blue-500" />
                      Contact Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="schoolEmail" className="text-sm font-medium">Email Address</Label>
                        <Input
                          type="email"
                          id="schoolEmail"
                          name="schoolEmail"
                          value={editInput.schoolEmail}
                          onChange={editChangeEventHandler}
                          className={`border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === "light" ? "bg-gray-600" : ""}`}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="schoolPhone" className="text-sm font-medium">Phone Number</Label>
                        <Input
                          id="schoolPhone"
                          name="schoolPhone"
                          value={editInput.schoolPhone}
                          onChange={editChangeEventHandler}
                          className={`border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === "light" ? "bg-gray-600" : ""}`}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="schoolWebsite" className="text-sm font-medium">Website URL</Label>
                        <Input
                          id="schoolWebsite"
                          name="schoolWebsite"
                          value={editInput.schoolWebsite}
                          onChange={editChangeEventHandler}
                          className={`border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === "light" ? "bg-gray-600" : ""}`}
                        />
                      </div>

                      <div>
                        <Label htmlFor="schoolAddress" className="text-sm font-medium">Address</Label>
                        <textarea
                          id="schoolAddress"
                          name="schoolAddress"
                          value={editInput.schoolAddress}
                          onChange={editChangeEventHandler}
                          className={`w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === "light" ? "bg-gray-600" : ""}`}
                          rows={3}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Admin Information */}
                  <div className={`p-5 rounded-lg ${theme === "light" ? "bg-gray-700" : "bg-gray-50"
                    }`}>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <FaUser className="w-5 h-5 mr-2 text-green-500" />
                      Admin Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="schoolPrincipalName" className="text-sm font-medium">Admin's Name</Label>
                        <Input
                          id="schoolPrincipalName"
                          name="schoolPrincipalName"
                          value={editInput.schoolPrincipalName}
                          onChange={editChangeEventHandler}
                          className={`border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === "light" ? "bg-gray-600" : ""}`}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="schoolPrincipalEmail" className="text-sm font-medium">Admin's Email</Label>
                        <Input
                          type="email"
                          id="schoolPrincipalEmail"
                          name="schoolPrincipalEmail"
                          value={editInput.schoolPrincipalEmail}
                          onChange={editChangeEventHandler}
                          className={`border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === "light" ? "bg-gray-600" : ""}`}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="schoolPrincipalPhone" className="text-sm font-medium">Admin's Phone</Label>
                        <Input
                          id="schoolPrincipalPhone"
                          name="schoolPrincipalPhone"
                          value={editInput.schoolPrincipalPhone}
                          onChange={editChangeEventHandler}
                          className={`border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === "light" ? "bg-gray-600" : ""}`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className={`p-5 rounded-lg ${theme === "light" ? "bg-gray-700" : "bg-gray-50"
                    }`}>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <FaSchool className="w-5 h-5 mr-2 text-yellow-500" />
                      Additional Information
                    </h3>

                    <div>
                      <Label htmlFor="schoolDescription" className="text-sm font-medium">Description</Label>
                      <textarea
                        id="schoolDescription"
                        name="schoolDescription"
                        value={editInput.schoolDescription}
                        onChange={editChangeEventHandler}
                        className={`w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${theme === "light" ? "bg-gray-600" : ""}`}
                        rows={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  className="border-gray-300 hover:bg-gray-100 text-gray-700 rounded-full px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateLoading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-full px-6 py-2 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  {updateLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Headmaster Signature Dialog */}
        <Dialog open={headmasterSignatureDialogOpen} onOpenChange={setHeadmasterSignatureDialogOpen}>
          <DialogContent className={`max-w-md rounded-xl ${theme === "light" ? "bg-gray-800" : "bg-white"}`}>
            <DialogHeader>
              <DialogTitle className={`text-xl font-bold text-center flex items-center justify-center gap-2 ${theme === "light" ? "text-white" : "text-gray-800"}`}>
                <FaSignature className="text-purple-500" />
                <span>{headmasterSignature ? "Update" : "Add"} Headmaster's Signature</span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSignatureUpload} className="mt-4">
              <div className="space-y-4">
                {/* Signature Preview */}
                <div className={`p-4 rounded-lg ${theme === "light" ? "bg-gray-700" : "bg-gray-50"}`}>
                  <Label className={`text-sm font-medium mb-2 block ${theme === "light" ? "text-white" : "text-gray-800"}`}>
                    Signature Preview
                  </Label>
                  <div className="aspect-video bg-white rounded-md flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                    {signaturePreview ? (
                      <img
                        src={signaturePreview}
                        alt="Signature Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <FaSignature className="text-4xl text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Upload signature image</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <Label htmlFor="signature" className={`text-sm font-medium ${theme === "light" ? "text-white" : "text-gray-800"}`}>
                    Upload Signature Image
                  </Label>
                  <div className="mt-2">
                    <Input
                      type="file"
                      id="signature"
                      accept="image/*"
                      onChange={handleSignatureChange}
                      className={`${theme === "light" ? "bg-gray-700" : ""}`}
                      required={!signaturePreview}
                    />
                    <p className={`text-xs mt-1 ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>
                      Supported formats: PNG, JPG, JPEG. Max size: 2MB.
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setHeadmasterSignatureDialogOpen(false);
                    setSignatureFile(null);
                    if (!headmasterSignature) {
                      setSignaturePreview(null);
                    }
                  }}
                  className={`border-gray-300 hover:bg-gray-100 rounded-full px-4 py-2 ${theme === "light" ? "text-white" : ""}`}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={signatureLoading || !signatureFile}
                  className={`bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-full px-6 py-2 transition-all duration-300 shadow-md hover:shadow-lg ${signatureLoading || !signatureFile ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                  {signatureLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </div>
                  ) : (
                    <>
                      <FaSave className="mr-2" /> {headmasterSignature ? "Update" : "Upload"} Signature
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>


      </div>
    </div>
  );
};

export default InstituteInformationPage;