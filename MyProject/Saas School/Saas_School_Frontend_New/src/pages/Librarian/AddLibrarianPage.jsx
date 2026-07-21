import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import StepIndicatorForAdmission from "@/components/ForAdmission/StepIndicatorForAdmission";
import axios from "axios";
import { toast } from "sonner";
import LibrarianFormStepComponent from "@/components/ForLibrarian/LibrarianFormStepComponent";
import teacherEdpLibraryanUrlApi from "@/common/teacherEdpLibraryan";
import { Loader2, UserPlus, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useSelector } from "react-redux";

const AddLibrarianPage = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "light";
  const steps = ["Personal Information", "Address Information"];
  const [postLoading, setPostLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal information
    librarianName: "",
    librarianImage: null, 
    email: "",
    gender: "",
    bloodGroup: "",
    religion: "",
    phone: "",
    alternativePhone: "",
    maritialStatus: "",
    joiningDate: "",

    // Address information
    pinCode: "",
    state: "",
    city: "",
    district: "",
    country: "",
    policeStation: "",
    villPost: "",
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const resetForm = () => {
    setFormData({
      librarianName: "",
      librarianImage: null,
      email: "",
      gender: "",
      bloodGroup: "",
      religion: "",
      phone: "",
      alternativePhone: "",
      maritialStatus: "",
      joiningDate: "",
      pinCode: "",
      state: "",
      city: "",
      district: "",
      country: "",
      policeStation: "",
      villPost: "",
    });
    setCurrentStep(0);
    setFormSubmitted(true);
    
    // Reset the form submitted state after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 3000);
  };

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString || !dateString.includes("-")) return "";

    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async() => {
    try {
      setPostLoading(true);
      const formData1 = new FormData();
      // for (const key in formData) {
      //   formData1.append(key, formData[key]);
      // }

       for (const key in formData) {
      if (key === "joiningDate") {
        formData1.append(key, formatDateToDDMMYYYY(formData[key]));
      } else {
        formData1.append(key, formData[key]);
      }
    }
      
      // Make the API request
      const response = await axios.post(
        `${teacherEdpLibraryanUrlApi.addLibraryan.url}/${schoolId}`,
        formData1,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response) {
        toast.success(response.data.message || "Librarian added successfully");
        resetForm();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <div className={`min-h-[86vh] ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto pt-6 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-6 p-4 rounded-lg shadow-md ${
          isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <UserPlus className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h1 className="text-2xl font-bold">Add New Librarian</h1>
          </div>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Fill in the details to add a new librarian to your school
          </p>
        </div>
        
        {formSubmitted ? (
          <div className={`mb-6 p-8 rounded-lg shadow-md flex flex-col items-center justify-center ${
            isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-gray-200'
          }`}>
            <div className={`p-4 rounded-full ${isDarkMode ? "bg-green-900/30" : "bg-green-100"} mb-4`}>
              <Loader2 className={`h-16 w-16 ${isDarkMode ? "text-green-400" : "text-green-600"} animate-spin`} />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Librarian Added Successfully!
            </h2>
            <p className={`text-center mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              The librarian has been added to your school database.
            </p>
            <button
              onClick={() => setFormSubmitted(false)}
              className={`px-6 py-2 rounded-md flex items-center gap-2 ${
                isDarkMode 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              } transition-colors`}
            >
              <UserPlus className="h-4 w-4" />
              Add Another Librarian
            </button>
          </div>
        ) : (
          <>
            {/* Step Indicator */}
            <div className={`mb-6 p-4 rounded-lg shadow-md ${
              isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-gray-200'
            }`}>
              <StepIndicatorForAdmission steps={steps} currentStep={currentStep} />
            </div>
            
            {/* Form */}
            <div className={`mb-6 rounded-lg shadow-md overflow-hidden ${
              isDarkMode ? 'bg-[#1e293b] border border-[rgba(193,193,193,0.2)]' : 'bg-white border border-gray-200'
            }`}>
              <div className={`p-4 border-b ${isDarkMode ? 'border-[rgba(193,193,193,0.2)]' : 'border-gray-200'}`}>
                <h2 className="text-lg font-semibold">
                  {steps[currentStep]}
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {currentStep === 0 
                    ? "Enter personal details of the librarian" 
                    : "Enter address information of the librarian"}
                </p>
              </div>
              
              <LibrarianFormStepComponent
                step={currentStep}
                formData={formData}
                handleChange={handleChange}
              />
              
              <div className={`flex justify-between p-4 border-t ${isDarkMode ? 'border-[rgba(193,193,193,0.2)]' : 'border-gray-200'}`}>
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                    currentStep === 0
                      ? "opacity-0 cursor-default"
                      : isDarkMode
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>

                {currentStep === steps.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={postLoading}
                    className={`px-5 py-2 rounded-md flex items-center gap-2 transition-colors ${
                      postLoading
                        ? "bg-gray-500 text-white cursor-not-allowed"
                        : isDarkMode
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {postLoading ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Submit
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className={`px-5 py-2 rounded-md flex items-center gap-2 transition-colors ${
                      isDarkMode
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddLibrarianPage;