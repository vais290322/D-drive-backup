import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import StepIndicatorForAdmission from "@/components/ForAdmission/StepIndicatorForAdmission";
import IssueFormComponent from "@/components/ForLibrary/IssueFormComponent";
import { toast } from "sonner";
import axios from "axios";
import libraryUrlApi from "@/common/library";
import { useSelector } from "react-redux";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const IssueBookPage = () => {
  const { theme } = useTheme();
  const schoolId = useSelector((state) => state?.auth?.schoolId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    // Validate first step before proceeding
    if (currentStep === 0) {
      if (!formData.bookName || !formData.bookNumber) {
        toast.error("Please fill in all required book information fields");
        return;
      }
    }
    
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
    // Validate final step before submission
    if (!formData.studentName || !formData.studentId || !formData.classAssigned || !formData.issueDate) {
      toast.error("Please fill in all required student information fields");
      return;
    }
    
    // Proceed with submission if all fields are valid
    try {
      setIsSubmitting(true);
      const response = await axios.post(`${libraryUrlApi.issueBook.url}/${schoolId}`, formData);
      
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      <div className="container mx-auto py-8 px-4">
        {/* Page Header with Gradient */}
        <div className={`mb-6 ${theme === "light" ? "text-white" : "text-gray-800"}`}>
          <h1 className="text-2xl md:text-3xl font-bold relative inline-block">
            Issue Book
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></span>
          </h1>
          <p className="mt-2 text-sm md:text-base opacity-80">
            Issue books to students from your library
          </p>
        </div>

        {/* Main Content Card */}
        <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
          theme === "light" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        }`}>
          {/* Card Header */}
          <div className={`p-4 sm:p-6 border-b ${
            theme === "light" ? "border-gray-700" : "border-gray-200"
          }`}>
            <div className="flex items-center justify-center">
              <BookOpen className={`h-6 w-6 mr-2 ${theme === "light" ? "text-purple-400" : "text-purple-600"}`} />
              <h2 className={`text-xl font-bold ${theme === "light" ? "text-white" : "text-gray-800"}`}>
                Book Issue Form
              </h2>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="px-4 sm:px-6 pt-6">
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= index 
                        ? `${theme === "light" 
                            ? "border-purple-400 bg-purple-900 text-white" 
                            : "border-purple-600 bg-purple-100 text-purple-600"}`
                        : `${theme === "light"
                            ? "border-gray-600 bg-gray-700 text-gray-400"
                            : "border-gray-300 bg-gray-100 text-gray-400"}`
                    } transition-all duration-300`}
                  >
                    {currentStep > index ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span 
                    className={`mt-2 text-sm font-medium ${
                      currentStep >= index
                        ? theme === "light" ? "text-purple-400" : "text-purple-600"
                        : theme === "light" ? "text-gray-400" : "text-gray-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
              
              {/* Progress Line */}
              <div 
                className={`absolute top-[6.5rem] left-1/2 h-0.5 -translate-x-1/2 ${
                  theme === "light" ? "bg-gray-600" : "bg-gray-200"
                }`} 
                style={{ 
                  width: `${(steps.length - 1) * 100}px`,
                  zIndex: 0 
                }}
              >
                <div 
                  className={`h-full ${
                    theme === "light" ? "bg-purple-400" : "bg-purple-600"
                  } transition-all duration-300`}
                  style={{ 
                    width: `${currentStep / (steps.length - 1) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6">
            <IssueFormComponent
              step={currentStep}
              formData={formData}
              handleChange={handleChange}
              theme={theme}
            />
          </div>

          {/* Form Navigation */}
          <div className={`flex justify-between p-4 sm:p-6 border-t ${
            theme === "light" ? "border-gray-700 text-black" : "border-gray-200"
          }`}>
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant={theme === "light" ? "outline" : "outline"}
              className={`${
                currentStep === 0
                  ? "opacity-0 cursor-default"
                  : theme === "light" 
                    ? "border-gray-600 text-black hover:bg-gray-700" 
                    : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Button
              onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={isSubmitting}
              className={`${
                currentStep === steps.length - 1
                  ? "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
                  : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
              } transition-all duration-300 shadow-md hover:shadow-lg`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : currentStep === steps.length - 1 ? (
                <>
                  Issue Book
                  <CheckCircle className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueBookPage;