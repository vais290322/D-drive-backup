import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import StepIndicatorForAdmission from "@/components/ForAdmission/StepIndicatorForAdmission";
import FormStep from "@/components/ForAdmission/FormStep";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DownloadIcon, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import mainUrlApi, { accountApi } from "@/common/main";
import { useDispatch, useSelector } from "react-redux";
import { setStudentInfo } from "@/utils/studentInformation/studentInfoSlice";

const AdmissionPage = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);
  const instituteId = useSelector((state) => state?.institute?.institute) || [];
  const schoolId = useSelector((state)=>state?.auth?.schoolId);
  // console.log("instituteId : ", instituteId[4]);
  const [pdfData, setPdfData] = useState("");
  const [classFee, setClassFee] = useState("");
  const dispatch = useDispatch();

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


  // console.log("class ",pdfData?.className);

  const [imageData, setImageData] = useState({
    schoolLogo: "",
    studentImage: "",
    parentImage: "",
  });

  const convertImageToBase64 = async (imageUrl) => {
    if (!imageUrl) return "";
    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      // console.error("Error loading image: ", error);
      toast.error("Error loading image");
      return "";
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      const schoolLogo = await convertImageToBase64(instituteId?.schoolLogo);
      const studentImage = await convertImageToBase64(pdfData?.studentImage);
      const parentImage = await convertImageToBase64(pdfData?.jointImage);
      setImageData({ schoolLogo, studentImage, parentImage });
    };
    fetchImages();
  }, [instituteId, pdfData]);

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

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`${mainUrlApi.studentInfo.url}/${schoolId}`);

      console.log("response : ", response);

      if (response) {
        dispatch(setStudentInfo(response?.data?.data));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleSubmit = async () => {
    const formData1 = new FormData();
    for (const key in formData) {
      formData1.append(key, formData[key]);
    }
    try {
      setPostLoading(true);
      // console.log("Form data:", formData1);/67600cdfa1f417347d879795
      const response = await axios.post(
        `${mainUrlApi.admissioin.url}/${schoolId}`,
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
        setPdfData(response?.data?.data);

        setFormData({
          studentName: "",
          rollNo: "",
          admissionDate: "",
          studentImage: null,
          className: "",
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
        fetchStudentData();
      }
    } catch (error) {
      // console.error("Error submitting form:", error);
      toast.error(error?.response?.data?.message || "something went wrong");
    } finally {
      setPostLoading(false);
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
    html2canvas(attendanceReport, { scale: 1.5, useCORS: true, allowTaint: true,}).then((canvas) => {
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

  const fetchClsasFeeStructure = async () => {
    try {
      const response = await axios.get(
        `${accountApi}/api/fees-structure/${pdfData?.className}/${schoolId}`
      );

      // console.log("response : ", response);

      if (response) {
        setClassFee(response?.data?.data);
      }
    } catch (error) {
      toast.error("something went wrong ");
    }
  };

  useEffect(() => {
    fetchClsasFeeStructure();
    fetchStudentData();
  }, [pdfData?.className, pdfData]);

  const fullDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  // console.log(fullDate); 
  

  return (
    <div
      className={`  ${isLoading ? "h-auto " : "h-[100vh]"} overflow-y-scroll ${
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

      {/* for printing the form and payment section  */}
      {isLoading && (
        <div
          className={`relative max-w-7xl mb-20 mx-auto mt-2 sm:mt-10 p-[3px] overflow-y-scroll rounded-xl shadow-2xl 
       bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500`}
          id="forpdf"
        >
          <div
            className={`bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg backdrop-blur-lg`}
          >
            {/* Header Section */}
            <div className="text-center">
            {imageData?.schoolLogo && (
          <img
            src={imageData?.schoolLogo}
            alt="School Logo"
            className="w-16 h-16 mx-auto mb-4"
          />
        )}
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                {instituteId?.schoolName}
              </h1>
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
                Admission Date - {fullDate} 
              </h2>
            </div>

            {/* Download Button */}
            <div className="flex justify-between items-center mt-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-300">
                Student Details
              </h1>
              <Button
                onClick={downloadPDF}
                variant="default"
                className="download-button bg-[#043072] hover:bg-[#9d1cc5] text-white px-4 py-2 rounded-md shadow-md flex items-center gap-2"
              >
                <DownloadIcon /> Download
              </Button>
            </div>

            {/* Student Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
              {[
                {
                  label: "Admission Number",
                  value: pdfData?.admissionNumber || "N/A",
                },
                { label: "Student Name", value: pdfData?.studentName || "N/A" },
                { label: "Class", value: pdfData?.className || "N/A" },
                { label: "Section", value: pdfData?.section || "N/A" },
                { label: "Roll Number", value: pdfData?.rollNo || "N/A" },
                {
                  label: "Admission Date",
                  value: pdfData?.admissionDate || "N/A",
                },
                { label: "Gender", value: pdfData?.gender || "N/A" },
                { label: "Blood Group", value: pdfData?.bloodGroup || "N/A" },
                { label: "Date of Birth", value: pdfData?.dob || "N/A" },
                { label: "Religion", value: pdfData?.religion || "N/A" },
                { label: "Father Name", value: pdfData?.fatherName || "N/A" },
                { label: "Mother Name", value: pdfData?.motherName || "N/A" },
                { label: "Phone Number", value: pdfData?.phone || "N/A" },
                {
                  label: "Alternative Phone",
                  value: pdfData?.alternativePhone || "N/A",
                },
                { label: "Email", value: pdfData?.email || "N/A" },
                { label: "Pin Code", value: pdfData?.pinCode || "N/A" },
                { label: "State", value: pdfData?.state || "N/A" },
                { label: "City", value: pdfData?.city || "N/A" },
                { label: "District", value: pdfData?.district || "N/A" },
                { label: "Country", value: pdfData?.country || "N/A" },
                {
                  label: "Police Station",
                  value: pdfData?.policeStation || "N/A",
                },
                {
                  label: "Village, Post",
                  value: pdfData?.villagePost || "N/A",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-300 dark:border-gray-700 p-4 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm"
                >
                  <strong>{item.label}:</strong> {item.value}
                </div>
              ))}
            </div>

            {/* Student & Parent Images */}
            <div className="flex justify-center gap-10 mt-6">
            <div className="flex items-center space-x-4">
          {formData?.studentImage && (
            <img src={imageData?.studentImage} alt="Student" className="w-16 h-16 rounded-full" />
          )}
          <p className="text-lg font-medium">Student Name: {pdfData?.studentName}</p>
        </div>


        {/* <div className="flex items-center space-x-4 mt-4">
          {imageData?.parentImage && (
            <img src={imageData?.parentImage} alt="Parent" className="w-16 h-16 rounded-full" />
          )}
          <p className="text-lg font-medium">Parent Name: {pdfData?.fatherName} / {pdfData?.motherName}</p>
        </div> */}
            </div>

            {/* Payment Details */}
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-300 mt-10">
              Payment Details
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
              {[
                {
                  label: "Admission Fee",
                  value: classFee?.admission_Fees || "N/A",
                },
                { label: "Tuition Fee", value: classFee?.tuitionFees || "N/A" },
                { label: "Donation", value: classFee?.donation || "N/A" },
                { label: "Books Fee", value: classFee?.books || "N/A" },
                {
                  label: "ID Card's Charges",
                  value: classFee?.id_Card_Charges || "N/A",
                },
                { label: "Late Fee", value: classFee?.late_Fees || "N/A" },
                { label: "Fine Fee", value: classFee?.fine || "N/A" },
                {
                  label: "Miscellaneous",
                  value: classFee?.miscellaneous || "N/A",
                },
                {
                  label: "Uniform Charges",
                  value: classFee?.uniform_Charges || "N/A",
                },
                {
                  label: "Transportation Fee",
                  value: classFee?.transportationalFees || "N/A",
                },
                { label: "Other Fee", value: classFee?.other || "N/A" },
                { label: "Total Amount", value: classFee?.totalFees || "N/A" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-300 dark:border-gray-700 p-4 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm"
                >
                  <strong>{item.label}:</strong> {item.value}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is a computer-generated document no signature required.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionPage;
