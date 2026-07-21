import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import StepIndicatorForAdmission from "@/components/ForAdmission/StepIndicatorForAdmission";
import FormStep from "@/components/ForTeacher/FormStep";
import { toast } from "sonner";
import axios from "axios";
import { useSelector } from "react-redux";
import teacherEdpLibraryanUrlApi from "@/common/teacherEdpLibraryan";
import {  Loader2 } from "lucide-react";


const AddTeacherPage = () => {
  const { theme } = useTheme();
  const [postLoading, setPostLoading] = useState(false);
  const steps = [
    "Personal Information",
    "Professional Information",
    "Address Information",
  ];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal information
    teachersName: "",
    teachersImage: null,
    email: "",
    gender: "",
    bloodGroup: "",
    religion: "",
    phone: "",
    alternativePhone: "",
    maritalStatus: "",

    // Professional information
    subject: "",
    joiningDate: "",

    // Address information
    pincode: "",
    state: "",
    city: "",
    district: "",
    country: "",
    policeStation: "",
    villagePost: "",
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

  const handleSubmit = async() => {
     // Create FormData object
     const formData1 = new FormData();
     for (const key in formData) {
       formData1.append(key, formData[key]);
     }
     
   try {
    setPostLoading(true)
     const response = await axios.post(`${teacherEdpLibraryanUrlApi.addTeacher.url}`, formData1, {
       headers: {
         "Content-Type": "multipart/form-data",
       },
     })

    //  console.log("Response:", response);
     
     if(response){
       toast.success("Teacher Added Successfully")
       setFormData({
         // Personal information
      teachersName: "",
      teachersImage: null,
      email: "",
      gender: "",
      bloodGroup: "",
      religion: "",
      phone: "",
      alternativePhone: "",
      maritalStatus: "",
  
      // Professional information
      subject: "",
      joiningDate: "",
  
      // Address information
      pincode: "",
      state: "",
      city: "",
      district: "",
      country: "",
      policeStation: "",
      villagePost: "",
      });
      setCurrentStep(0);
     }
   } catch (error) {
    // console.error("Error:", error);
    toast.error("Something went wrong")
   }finally{
    setPostLoading(false)
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
        <FormStep
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
            }`}
          >
            Back
          </button>


          {/* <button
            onClick={
              currentStep === steps.length - 1 ? handleSubmit : handleNext
            }
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
          </button> */}

          {currentStep === steps.length - 1 ? (
    <button
      onClick={handleSubmit}
      disabled={postLoading}
      className={`px-4 py-2 rounded-md ${
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
      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
    >
      Next
    </button>
  )}



        </div>
      </div>
    </div>
  );
};

export default AddTeacherPage;
