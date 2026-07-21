import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import StepIndicatorForAdmission from "@/components/ForAdmission/StepIndicatorForAdmission";
import FormStep from "@/components/ForAdmission/FormStep";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import mainUrlApi from "@/common/main";

const AdmissionPage = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const steps = [
    "Admission Information",
    "Personal Information",
    "Parent Details",
    "Address Information",
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Admission information
    admissionNumber: "",
    studentName: "",
    rollNo: "",
    admissionDate: "",
    studentImage: null,
    className: "",
    section: "",
    // Personal information
    gender: "",
    bloodGroup: "",
    dob: "",
    religion: "",
    // Parent Information
    fatherName: "",
    motherName: "",
    phone: "",
    alternativePhone: "",
    email: "",
    jointImage: null,
    // Address information
    pincode: "",
    state: "",
    city: "",
    district: "",
    country: "",
    policeStation: "",
    villagePost: "",
  });

  // console.log("form data : ", formData);

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
    const formData1 = new FormData();
    for (const key in formData) {
      formData1.append(key, formData[key]);
    }
    try {
      // console.log("Form data:", formData1);/67600cdfa1f417347d879795
      const response = await axios.post(
        `${mainUrlApi.admissioin.url}/678b8ab07b0e235b046b43ac`,
        formData1,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("Form submitted:", formData);
      if (response) {
        toast.success("Admission Form submitted successfully");
        // console.log("response : ", response);

        setFormData({
          studentName: "",
          rollNo: "",
          admissionDate: "",
          studentImage: null,
          class: "",
          section: "",
          gender: "",
          bloodGroup: "",
          dob: "",
          religion: "",
          fatherName: "",
          motherName: "",
          phone: "",
          alternativePhone: "",
          email: "",
          jointImage: null,
          pinCode: "",
          state: "",
          city: "",
          district: "",
          country: "",
          policeStation: "",
          villPost: "",
        });
        setCurrentStep(0);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const downloadPDF = () => {
    const attendanceReport = document.getElementById("forpdf");
    const downloadButton = document.querySelector(".download-button"); 
  
    // Temporarily hide the "Download All" button and Pagination component
    if (downloadButton) {
      downloadButton.style.display = "none";
    }
    
  
    // Generate the PDF
    html2canvas(attendanceReport, { scale: 1.5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 0.5); // Lower quality for smaller size (50%)
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, "", "FAST"); // Use FAST compression
      pdf.save("AdmissionForm.pdf");
  
      // Restore visibility of the "Download All" button and Pagination component
      if (downloadButton) {
        downloadButton.style.display = "";
      }
      
    });
  };
  

  return (
    <div
      className={`  h-auto overflow-y-scroll ${
        theme === "light" ? "dark" : "light"
      }`}
    >
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
          <button
            onClick={
              currentStep === steps.length - 1 ? handleSubmit : handleNext
            }
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
      {/* for printing the form and payment section  */}
      {
        isLoading && ( <div
          className={`max-w-7xl mb-20 mx-auto mt-2 sm:mt-10 p-4 overflow-y-scroll shadow-md rounded-lg ${
            theme === "light" ? "bg-[#212121]" : "bg-white"
          } max-h-full shadow-lg rounded-lg`} id="forpdf"
        >
          <h2 className="text-3xl font-bold mb-4 justify-center items-center flex">Admission Form {new Date().getFullYear()}</h2>
  
          <div className="flex justify-between"> 
          <h1 className="text-2xl font-bold mb-4">Student Details</h1>
          <Button onClick={downloadPDF} variant="default" className="download-button bg-[#043072] hover:bg-[#9d1cc5] " > <DownloadIcon/> Downlaod</Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(formData).map(([key, value], index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <strong>{key}:</strong> {value || "N/A"}
              </div>
            ))}
          </div>
          <h1 className="text-2xl font-bold mb-4">Payment Details</h1>
          <div className="grid grid-cols-3 gap-4">
  
            <div className=" border-[1px] border-[#ccc] mb-[10px] p-[10px]">
              <strong>Admission Fee:</strong> N/A
            </div>
  
            
            <div className=" border-[1px] border-[#ccc] mb-[10px] p-[10px]">
              <strong>Tuition Fee:</strong> N/A
            </div>
  
            <div className=" border-[1px] border-[#ccc] mb-[10px] p-[10px]">
              <strong>Donation:</strong> N/A
            </div>
  
            <div className=" border-[1px] border-[#ccc] mb-[10px] p-[10px]">
              <strong>Books Fee:</strong> N/A
            </div>
  
            <div className=" border-[1px] border-[#ccc] mb-[10px] p-[10px]">
              <strong>Id Card's Charges:</strong> N/A
            </div>
  
            <div className=" border-[1px] border-[#ccc] mb-[10px] p-[10px]">
              <strong>Late Fee:</strong> N/A
            </div>
  
            <div className=" border-[1px] border-[#ccc] mb-[10px] p-[10px]">
              <strong>Fine Fee:</strong> N/A
            </div>
  
            <div className=" border-[1px] border-[#ccc] mb-[10px] p-[10px]">
              <strong>Miscellaneous:</strong> N/A
            </div>
  
            <div className=" border-[1px] border-[#ccc] mb-[10px] p-[10px]">
              <strong>Uniform Charges:</strong> N/A
            </div>
  
            <div className=" border-[1px] border-[#ccc] mb-[10px] p-[10px]">
              <strong>Transportation fee :</strong> N/A
            </div>
  
            <div className=" border-[1px] border-[#ccc] mb-[10px] p-[10px]">
              <strong>Other fee :</strong> N/A
            </div>
  
            <div className=" border-[1px] border-[#ccc] mb-[10px] p-[10px]">
              <strong>Total Amount :</strong> N/A
            </div>
  
  
            
          </div>
        </div>
        )
      }
     
    </div>
  );
};

export default AdmissionPage;
