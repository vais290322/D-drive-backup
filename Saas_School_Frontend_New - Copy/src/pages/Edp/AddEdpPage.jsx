import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import StepIndicatorForAdmission from "@/components/ForAdmission/StepIndicatorForAdmission";
import FormStepComponent from "@/components/ForEdp/FormStepComponent";
import axios from "axios";
import { toast } from "sonner";
import teacherEdpLibraryanUrlApi from "@/common/teacherEdpLibraryan";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const AddEdpPage = () => {
  const { theme } = useTheme();
  const steps = ["Personal Information", "Address Information"];
  const [postLoading, setPostLoading] = useState(false);
  const schoolId = useSelector((state) => state?.auth?.schoolId);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal information
    edpName: "",
    edpImage: null,
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

  const handleSubmit = async () => {
    try {
      setPostLoading(true);

      const formData1 = new FormData();
      for (const key in formData) {
        formData1.append(key, formData[key]);
      }

      // Make the API request
      const response = await axios.post(
        `${teacherEdpLibraryanUrlApi.addEdp.url}/${schoolId}`,
        formData1,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response) {
        toast.success(response.data.message || "Data submitted successfully");
        // console.log("Response:", response);
      }

      // Optionally reset form data after submission
      setFormData({
        // Personal information
        edpName: "",
        edpImage: null,
        email: "",
        gender: "",
        bloodGroup: "",
        religion: "",
        phone: "",
        alternativePhone: "",
        maritialStatus: "",

        // Professional information
        subject: "",
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

      setCurrentStep(0); // Reset to first step after submission
    } catch (error) {
      toast.error("something went wrong");
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <div className={`  h-[86vh] ${theme === "light" ? "dark" : "light"}`}>
      <div
        className={`max-w-7xl mx-auto mt-2 sm:mt-10 p-4 overflow-y-scroll shadow-md rounded-lg ${
          theme === "light" ? "bg-[#212121]" : "bg-white"
        } max-h-full`}
      >
        <StepIndicatorForAdmission steps={steps} currentStep={currentStep} />
        <FormStepComponent
          step={currentStep}
          formData={formData}
          handleChange={handleChange}
        />
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-md ${
              currentStep === 0
                ? " opacity-0"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } mb-12`}
          >
            Back
          </button>
          

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={postLoading}
              className={`px-5  h-12 rounded-md ${
                postLoading
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {postLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4 " />
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={postLoading}
              className="px-5  h-12 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEdpPage;
