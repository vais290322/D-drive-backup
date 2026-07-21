import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "sonner";
import axios from "axios";
import * as XLSX from "xlsx";
import { FaFileExcel, FaUpload } from "react-icons/fa";
import { Loader2, CheckCircle, AlertCircle, FileText, Upload, Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import mainUrlApi from "@/common/main";

const StudentBulkUploadPage = () => {
  const schoolId = useSelector((state) => state.auth.schoolId);
//   console.log(schoolId);
  const { theme } = useTheme();
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState(1); // 1: Select file, 2: Preview, 3: Success
  const [dragActive, setDragActive] = useState(false);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const fileExtension = droppedFile.name.split('.').pop().toLowerCase();
      
      if (!['xlsx', 'xls'].includes(fileExtension)) {
        toast.error("Please upload an Excel file (.xlsx or .xls)");
        return;
      }
      
      setFile(droppedFile);
      processExcelFile(droppedFile);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check file type
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls'].includes(fileExtension)) {
      toast.error("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    setFile(selectedFile);
    processExcelFile(selectedFile);
  };

  // Process Excel file
  const processExcelFile = (selectedFile) => {
    const reader = new FileReader();
    
    reader.onload = (evt) => {
      try {
        const binaryData = evt.target.result;
        const workbook = XLSX.read(binaryData, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          toast.error("File appears to be empty or invalid");
          return;
        }

        // Extract headers and data
        const extractedHeaders = jsonData[0];
        const extractedData = jsonData.slice(1).map(row => {
          const rowData = {};
          extractedHeaders.forEach((header, index) => {
            rowData[header] = row[index] || '';
          });
          return rowData;
        });

        setHeaders(extractedHeaders);
        setPreviewData(extractedData);
        setUploadStep(2); // Move to preview step
      } catch (error) {
        console.error("Error parsing file:", error);
        toast.error("Failed to parse file. Please check the format.");
      }
    };

    reader.onerror = () => {
      toast.error("Error reading file");
    };

    reader.readAsBinaryString(selectedFile);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setLoading(true);
    
    try {
      // Create FormData object with 'file' as the field name
      const formData = new FormData();
      formData.append('file', file); 

      // Use the provided API endpoint
      const response = await axios.post(
        // 'http://192.168.0.156:3009/admissions/bulk/6803812e41a954774c53206b', 
           `${mainUrlApi?.admissioin?.url}/bulk/${schoolId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      toast.success(`Successfully uploaded  student records!`);
      setUploadStep(3); // Move to success step
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload students");
    } finally {
      setLoading(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setFile(null);
    setPreviewData([]);
    setHeaders([]);
    setUploadStep(1);
  };

  // Download sample template
  const downloadSampleTemplate = () => { 
    // Sample data structure
    const sampleData = [
      [
        'Student Name*', 'Roll No*', 'Admission Date (YYYY-MM-DD)*',
        'Class Name*', 'Section*', 'Gender (M/F)*', 'Blood Group',
        'Date of Birth (YYYY-MM-DD)*', 'Religion', 'Father Name*',
        'Mother Name*', 'Phone*', 'Alternative Phone', 'Email',
        'Pincode', 'State', 'City', 'District', 'Country',
        'Police Station', 'Village/Post', 'Academic Year*'
      ],
      [
        'John Doe', 'A001', '2023-06-15', 
        '10', 'A', 'male', 'O+', 
        '2008-03-12', 'Christianity', 'Robert Doe', 
        'Jane Doe', '1234567890', '0987654321', 'john@example.com', 
        '560001', 'Karnataka', 'Bangalore', 'Bangalore Urban', 'India', 
        'Central', 'MG Road', '2023-2024'
      ],
      [
        'Alice Smith', 'A002', '2023-06-16', 
        '9', 'B', 'female', 'A+', 
        '2009-05-22', 'Hinduism', 'Bob Smith', 
        'Sarah Smith', '9876543210', '8765432109', 'alice@example.com', 
        '110001', 'Delhi', 'New Delhi', 'New Delhi', 'India', 
        'Connaught Place', 'Janpath', '2023-2024'
      ]
    ];
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    
    // Generate and download file
    XLSX.writeFile(wb, "student_template.xlsx");
    
    toast.success("Sample template downloaded successfully!");
  };

  const isDarkTheme = theme === "light"; // Note: In your app "light" theme seems to be dark

  return (
    <div className={`p-8 rounded-lg shadow-lg h-full ${theme === "light" ? "bg-gray-800" : "bg-white"}`}>
    <h2 className={`text-2xl font-bold mb-8 ${theme === "light" ? "text-white" : "text-gray-800"}`}>
      Student Bulk Admission
    </h2>

    {/* Step indicator */}
    <div className="flex items-center justify-center mb-10">
      <div className={`flex flex-col items-center ${uploadStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
        <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${uploadStep >= 1 ? "border-blue-600 bg-blue-100" : "border-gray-400"}`}>
          <FileText className="h-5 w-5" />
        </div>
        <span className="mt-2 text-sm font-medium">Select File</span>
      </div>
      <div className={`w-16 h-1 mx-2 ${uploadStep >= 2 ? "bg-blue-600" : "bg-gray-300"}`}></div>
      <div className={`flex flex-col items-center ${uploadStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
        <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${uploadStep >= 2 ? "border-blue-600 bg-blue-100" : "border-gray-400"}`}>
          <Upload className="h-5 w-5" />
        </div>
        <span className="mt-2 text-sm font-medium">Preview</span>
      </div>
      <div className={`w-16 h-1 mx-2 ${uploadStep >= 3 ? "bg-blue-600" : "bg-gray-300"}`}></div>
      <div className={`flex flex-col items-center ${uploadStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>
        <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${uploadStep >= 3 ? "border-blue-600 bg-blue-100" : "border-gray-400"}`}>
          <CheckCircle className="h-5 w-5" />
        </div>
        <span className="mt-2 text-sm font-medium">Complete</span>
      </div>
    </div>

    {uploadStep === 1 && (
      <div className="space-y-8">
        {/* Add download template button */}
        <div className={`flex justify-end mb-4`}>
          <button
            onClick={downloadSampleTemplate}
            className={`flex items-center px-4 py-2 rounded-md transition-colors shadow-sm ${
              theme === "light"
                ? "bg-gray-700 text-white hover:bg-gray-600 border border-gray-600"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
            }`}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Sample Template
          </button>
        </div>

        <div 
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
            dragActive 
              ? "border-blue-500 bg-blue-50" 
              : theme === "light" 
                ? "border-gray-300 hover:border-blue-400 hover:bg-gray-700" 
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <FaFileExcel className={`mx-auto text-6xl mb-4 ${theme === "light" ? "text-green-500" : "text-green-500"}`} />
          <p className={`mb-4 text-lg ${theme === "light" ? "text-gray-300" : "text-gray-600"}`}>
            Drag & drop your Excel file here or click to browse
          </p>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors shadow-sm"
          >
            <FaUpload className="inline mr-2" />
            Select Excel File
          </label>
          {file && (
            <div className={`mt-6 p-4 rounded-md ${theme === "light" ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700"}`}>
              <p className="flex items-center">
                <FaFileExcel className="mr-2 text-green-500" />
                <span className="font-medium">{file.name}</span>
                <span className="ml-2 text-sm opacity-75">({(file.size / 1024).toFixed(2)} KB)</span>
              </p>
            </div>
          )}
        </div>
        
        {/* Add info box about the template */}
        <div className={`p-4 rounded-md ${
          theme === "light" 
            ? "bg-blue-900/30 border border-blue-800" 
            : "bg-blue-50 border border-blue-200"
        }`}>
          <div className={`flex items-start`}>
            <div className={`flex-shrink-0 mt-0.5`}>
              <AlertCircle className={`h-5 w-5 ${theme === "light" ? "text-blue-400" : "text-blue-500"}`} />
            </div>
            <div className={`ml-3`}>
              <h3 className={`text-sm font-medium ${theme === "light" ? "text-blue-300" : "text-blue-800"}`}>
                About the template
              </h3>
              <div className={`mt-2 text-sm ${theme === "light" ? "text-blue-200" : "text-blue-700"}`}>
                <p>
                  Download the sample template to see the required format for bulk student upload. 
                  Fields marked with * are mandatory. Please ensure your data follows this format.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {uploadStep === 2 && (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-semibold ${theme === "light" ? "text-gray-200" : "text-gray-800"}`}>
            Preview Data 
            <span className="ml-2 px-2.5 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
              {previewData.length} records
            </span>
          </h3>
          <button
            onClick={resetForm}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors shadow-sm"
          >
            Back
          </button>
        </div>

        <div className="table-div overflow-x-scroll max-w-[1500px] border border-gray-200 rounded-lg shadow-sm">
          <table className={` w-full  border rounded-lg shadow-sm" ${theme === "light" ? "divide-gray-700" : "divide-gray-200"}`}>
            <thead className={theme === "light" ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className={`px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === "light" ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === "light" ? "divide-gray-700" : "divide-gray-200"}`}>
              {previewData.slice(0, 5).map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? (theme === "light" ? "bg-gray-800" : "bg-white") : (theme === "light" ? "bg-gray-700" : "bg-gray-50")}>
                  {headers.map((header, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        theme === "light" ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {row[header] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {previewData.length > 5 && (
          <div className={`flex items-center text-sm italic ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Showing 5 of {previewData.length} records
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                Uploading...
              </span>
            ) : (
              "Upload Students"
            )}
          </button>
        </div>
      </div>
    )}

    {uploadStep === 3 && (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className={`mt-4 text-2xl font-medium ${theme === "light" ? "text-gray-200" : "text-gray-800"}`}>Upload Successful!</h3>
        <p className={`mt-3 text-lg ${theme === "light" ? "text-gray-400" : "text-gray-500"}`}>
          {previewData.length} student records have been successfully uploaded.
        </p>
        <div className="mt-8">
          <button
            onClick={resetForm}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            Upload More
          </button>
        </div>
      </div>
    )}
  </div>
  );
};

export default StudentBulkUploadPage;

