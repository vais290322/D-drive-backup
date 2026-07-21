import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import StepIndicatorForAdmission from "@/components/ForAdmission/StepIndicatorForAdmission";
import FormStep from "@/components/ForTeacher/FormStep";
import IssueFormComponent from "@/components/ForLibrary/IssueFormComponent";
import { toast } from "sonner";
import axios from "axios";
import libraryUrlApi from "@/common/library";
import { useSelector } from "react-redux";

const IssueBookPage = () => {
  const { theme } = useTheme();
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const steps = [
    "Book Information",
    "Student Information",
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Book information
    bookName: "",
    bookNumber: "",
   quantity: "",
    // Student information
    studentName: "",
    studentId: "",
    classAssigned: "",
    section: "",
    // Issue information
    issueDate: "",
    returnDate: "",
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
  
    // Proceed with submission if all fields are valid
     try {
      const response = await axios.post(`${libraryUrlApi.issueBook.url}/${schoolId}`, formData);
        // console.log("response : ", response);
      if (response) {
        toast.success("Book issued successfully!");
        setFormData({
          bookName: "",
          bookNumber: "",
          author: "",
          quantity: "",
          studentName: "",
          studentId: "",
          classAssigned: "",
          section: "",
          issueDate: "",
          returnDate: "",
        });
        setCurrentStep(0);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred. Please try again.");
    }
  };
  

  return (
    <div className={`  h-[86vh] ${theme === "light" ? "dark" : "light"}`}>
      <div
        className={`max-w-7xl mx-2 sm:mx-auto mt-4 sm:mt-10 p-4  shadow-md rounded-lg ${
          theme === "light"
            ? "bg-[#212121] "
            : "bg-white"
        } max-h-full`}
      >
        <StepIndicatorForAdmission steps={steps} currentStep={currentStep} />
        <IssueFormComponent
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
          <button
            onClick={
              currentStep === steps.length - 1 ? handleSubmit : handleNext
            }
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            {currentStep === steps.length - 1 ? "Issue Book" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default IssueBookPage