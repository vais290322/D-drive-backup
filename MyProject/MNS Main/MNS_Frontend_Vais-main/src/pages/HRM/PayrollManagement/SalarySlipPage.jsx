import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import converter from "number-to-words";
import mns from "../../../assets/mns.jpg";
import toast from "react-hot-toast";
import { backendDomainN } from "../../../Common/index";
import { BiLoaderCircle } from "react-icons/bi";
import { FiDownload, FiEye, FiCalendar, FiSearch, FiSave, FiFileText, FiDollarSign } from "react-icons/fi";

const SalarySlipPage = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [savingData, setSavingData] = useState(false);

  const itemsPerPageOptions = [5, 10, 20, 30, 50, 100];
  
  const months = [
    { name: "January", value: "01" },
    { name: "February", value: "02" },
    { name: "March", value: "03" },
    { name: "April", value: "04" },
    { name: "May", value: "05" },
    { name: "June", value: "06" },
    { name: "July", value: "07" },
    { name: "August", value: "08" },
    { name: "September", value: "09" },
    { name: "October", value: "10" },
    { name: "November", value: "11" },
    { name: "December", value: "12" },
  ];

  useEffect(() => {
    if (month && year) {
      setEmployeeData([]);
      fetchEmployeeData();
    }
  }, [month, year]);

  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendDomainN}/salary/month/${month}-${year}`
      );
      // console.log("Employee Data for this month ", response);
      setEmployeeData(response?.data);
      toast.success("Data fetched successfully!");
    } catch (error) {
      // console.error("Failed to fetch employee data", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch data for this month"
      );
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async (employee) => {
    setGeneratingPDF(true);
    const doc = new jsPDF();

    // Convert image to Base64 before adding it to PDF
    const getBase64 = (imgPath) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = imgPath;
        img.crossOrigin = "anonymous"; // Avoid CORS issues
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg"));
        };
      });
    };

    const mnsBase64 = await getBase64(mns);

    // Set border color and thickness
    doc.setDrawColor(0, 51, 102); // Dark Blue
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 278); // (x, y, width, height)

    // Add MNS Logo
    doc.addImage(mnsBase64, "jpg", 80, 12, 50, 15); // (image, type, x, y, width, height)

    // Company Details
    doc.setFontSize(10);
    doc.text("123, Tech Park, New York, NY - 10001", 65, 32);
    doc.text("Email: hr@mns.com | Contact: +1 234 567 890", 60, 38);

    // Title Line
    doc.setLineWidth(0.5);
    doc.line(20, 42, 190, 42);
    doc.setFontSize(16);
    doc.text(`Salary Slip for ${employee?.month}`, 75, 52);

    // Personal Details Section
    doc.setFontSize(14);
    doc.text("Personal Details", 16, 60);

    // Employee Details Table
    doc.autoTable({
      startY: 65,
      head: [["Field", "Details"]],
      body: [
        ["Employee Name", employee?.name || "N/A"],
        ["Employee Code", employee?.employeeCode || "N/A"],
        ["Email", employee?.email || "N/A"],
        ["Department", employee?.department || "N/A"],
        ["Total Days", employee?.totalDays || "N/A"],
        ["Total Present", employee?.present || "N/A"],
        ["Leaves Taken", employee?.allLeaves || "N/A"],
        ["Bank Name", employee?.bankName || "N/A"],
        ["Bank Number", employee?.bankNumber || "N/A"],
        ["IFSC Code", employee?.ifscCode || "N/A"],
      ],
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
    });

    // Calculate the position below the employee details table
    const employeeTableY = doc.autoTable.previous.finalY + 10;

    // Salary Details Section
    doc.setFontSize(14);
    doc.text("Salary Details", 16, employeeTableY);

    // Prepare salary breakdown data
    const salaryRows = [
     
    ];

    // Add additional fields if they exist
    let additionalTotal = 0;
    if (employee?.additionalFields && employee.additionalFields.length > 0) {
      employee.additionalFields.forEach((field) => {
        const amount = parseFloat(field.amount) || 0;
        additionalTotal += amount;
        salaryRows.push([
          field.description || "Additional",
          amount.toFixed(2),
          amount.toFixed(2),
          "",
          "",
        ]);
      });
    }

    // Add deduction fields if they exist
    let deductionTotal = 0;
    if (employee?.deductionFields && employee.deductionFields.length > 0) {
      employee.deductionFields.forEach((field) => {
        const amount = parseFloat(field.amount) || 0;
        deductionTotal += amount;
        // Find an empty row or add a new one for deductions
        const emptyRowIndex = salaryRows.findIndex(row => row[3] === "");
        if (emptyRowIndex !== -1 && salaryRows[emptyRowIndex][0] !== "Total Earnings") {
          salaryRows[emptyRowIndex][3] = field.description || "Deduction";
          salaryRows[emptyRowIndex][4] = amount.toFixed(2);
        } else {
          salaryRows.push([
            "",
            "",
            "",
            field.description || "Deduction",
            amount.toFixed(2),
          ]);
        }
      });
    }

    
    // Add totals row
    const totalEarnings = (
      additionalTotal
    ).toFixed(2);
    
    const totalPayableGross = (
      additionalTotal
    ).toFixed(2);
    
    const totalDeductions = (
      deductionTotal
    ).toFixed(2);

    salaryRows.push([
      "Total Earnings",
      totalEarnings,
      totalPayableGross,
      "Total Deductions",
      totalDeductions,
    ]);

    // Salary Breakdown Table
    doc.autoTable({
      startY: employeeTableY + 5,
      head: [["Earnings", "Amount", "Pay Amount", "Deductions", "Amount"]],
      body: salaryRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
      columnStyles: {
        1: { halign: "right" }, // Amount column for Earnings
        2: { halign: "right" }, // Pay Amount column
        4: { halign: "right" }, // Amount column for Deductions
      },
      didDrawCell: (data) => {
        // Apply green color to the "Total Earnings" row
        if (data.row.index === salaryRows.length - 1) {
          doc.setTextColor(0, 128, 0); // Green
        }
      },
    });

    // Calculate Y position below the table dynamically
    const tableFinalY = doc.autoTable.previous.finalY + 10;

    doc.text(
      `Net Pay = ((Total Earnings - Total Deductions)*present count )/total days`,
      20,
      tableFinalY + 30
    );

    // Net Pay Section
    // const netPay = (parseFloat(totalPayableGross) - parseFloat(totalDeductions)).toFixed(2);
    const netPay = employee?.totalSalary?.toFixed(2);

    doc.autoTable({
      startY: tableFinalY, // Position below the last table
      head: [["Net Pay"]],
      body: [[`${netPay} (${converter.toWords(Number(netPay))} rupees only)`]],
      theme: "grid",
      styles: { fontSize: 12, fontStyle: "bold" },
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
      columnStyles: {
        0: { halign: "left" }, // Net Pay (Left Align)
      },
    });

    // Signature & Footer
    doc.setFontSize(12);
    doc.text("Authorized Signatory", 140, tableFinalY + 60);
    doc.text("Pvt Ltd", 160, tableFinalY + 74);
    doc.addImage(mnsBase64, "jpg", 130, tableFinalY + 65, 30, 10);

    // Footer Line
    doc.line(20, 280, 190, 280);
    doc.setFontSize(10);
    doc.text(
      "This is a system-generated document. No signature required.",
      50,
      285
    );

    // Save PDF
    doc.save(`${employee.name}_SalarySlip.pdf`);
    setGeneratingPDF(false);
  };

  const handleViewPDF = async (employee) => {
    setGeneratingPDF(true);
    const doc = new jsPDF();

    // Convert image to Base64 before adding it to PDF
    const getBase64 = (imgPath) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = imgPath;
        img.crossOrigin = "anonymous"; // Avoid CORS issues
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg"));
        };
      });
    };

    const mnsBase64 = await getBase64(mns);

    // Set border color and thickness
    doc.setDrawColor(0, 51, 102); // Dark Blue
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 278); // (x, y, width, height)

    // Add MNS Logo
    doc.addImage(mnsBase64, "jpg", 80, 12, 50, 15); // (image, type, x, y, width, height)

    // Company Details
    doc.setFontSize(10);
    doc.text("123, Tech Park, New York, NY - 10001", 65, 32);
    doc.text("Email: hr@mns.com | Contact: +1 234 567 890", 60, 38);

    // Title Line
    doc.setLineWidth(0.5);
    doc.line(20, 42, 190, 42);
    doc.setFontSize(16);
    doc.text(`Salary Slip for ${employee?.month}`, 75, 52);

    // Personal Details Section
    doc.setFontSize(14);
    doc.text("Personal Details", 16, 60);

    // Employee Details Table
    doc.autoTable({
      startY: 65,
      head: [["Field", "Details"]],
      body: [
        ["Employee Name", employee?.name || "N/A"],
        ["Employee Code", employee?.employeeCode || "N/A"],
        ["Email", employee?.email || "N/A"],
        ["Department", employee?.department || "N/A"],
        ["Total Days", employee?.totalDays || "N/A"],
        ["Total Present", employee?.totalPresent || "N/A"],
        ["Leaves Taken", employee?.allLeaves || "N/A"],
        ["Bank Name", employee?.bankName || "N/A"],
        ["Bank Number", employee?.bankNumber || "N/A"],
        ["IFSC Code", employee?.ifscCode || "N/A"],
      ],
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
    });

    // Calculate the position below the employee details table
    const employeeTableY = doc.autoTable.previous.finalY + 10;

    // Salary Details Section
    doc.setFontSize(14);
    doc.text("Salary Details", 16, employeeTableY);

    // Prepare salary breakdown data
    const salaryRows = [
      
    ];

    // Add additional fields if they exist
    let additionalTotal = 0;
    if (employee?.additionalFields && employee.additionalFields.length > 0) {
      employee.additionalFields.forEach((field) => {
        const amount = parseFloat(field.amount) || 0;
        additionalTotal += amount;
        salaryRows.push([
          field.description || "Additional",
          amount.toFixed(2),
          amount.toFixed(2),
          "",
          "",
        ]);
      });
    }

    // Add deduction fields if they exist
    let deductionTotal = 0;
    if (employee?.deductionFields && employee.deductionFields.length > 0) {
      employee.deductionFields.forEach((field) => {
        const amount = parseFloat(field.amount) || 0;
        deductionTotal += amount;
        // Find an empty row or add a new one for deductions
        const emptyRowIndex = salaryRows.findIndex(row => row[3] === "");
        if (emptyRowIndex !== -1 && salaryRows[emptyRowIndex][0] !== "Total Earnings") {
          salaryRows[emptyRowIndex][3] = field.description || "Deduction";
          salaryRows[emptyRowIndex][4] = amount.toFixed(2);
        } else {
          salaryRows.push([
            "",
            "",
            "",
            field.description || "Deduction",
            amount.toFixed(2),
          ]);
        }
      });
    }

    // Add totals row
    const totalEarnings = (
     
      additionalTotal
    ).toFixed(2);
    
    const totalPayableGross = (
     
      additionalTotal
    ).toFixed(2);
    
    const totalDeductions = (
      
      deductionTotal
    ).toFixed(2);

    salaryRows.push([
      "Total Earnings",
      totalEarnings,
      totalPayableGross,
      "Total Deductions",
      totalDeductions,
    ]);

    // Salary Breakdown Table
    doc.autoTable({
      startY: employeeTableY + 5,
      head: [["Earnings", "Amount", "Pay Amount", "Deductions", "Amount"]],
      body: salaryRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
      columnStyles: {
        1: { halign: "right" }, // Amount column for Earnings
        2: { halign: "right" }, // Pay Amount column
        4: { halign: "right" }, // Amount column for Deductions
      },
      didDrawCell: (data) => {
        // Apply green color to the "Total Earnings" row
        if (data.row.index === salaryRows.length - 1) {
          doc.setTextColor(0, 128, 0); // Green
        }
      },
    });

    // Calculate Y position below the table dynamically
    const tableFinalY = doc.autoTable.previous.finalY + 10;

    doc.text(
      ` Net Pay = ((Total Earnings - Total Deductions)*present count )/total days`,
      20,
      tableFinalY + 30
    );

    // Net Pay Section
    // const netPay = (parseFloat(totalPayableGross) - parseFloat(totalDeductions)).toFixed(2);
    const netPay = employee?.totalSalary?.toFixed(2);

    doc.autoTable({
      startY: tableFinalY, // Position below the last table
      head: [["Net Pay"]],
      body: [[`${netPay} (${converter.toWords(Number(netPay))} rupees only)`]],
      theme: "grid",
      styles: { fontSize: 12, fontStyle: "bold" },
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
      columnStyles: {
        0: { halign: "left" }, // Net Pay (Left Align)
      },
    });

    // Signature & Footer
    doc.setFontSize(12);
    doc.text("Authorized Signatory", 140, tableFinalY + 60);
    doc.text("Pvt Ltd", 160, tableFinalY + 74);
    doc.addImage(mnsBase64, "jpg", 130, tableFinalY + 65, 30, 10);

    // Footer Line
    doc.line(20, 280, 190, 280);
    doc.setFontSize(10);
    doc.text(
      "This is a system-generated document. No signature required.",
      50,
      285
    );

    // Open PDF in a new tab
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
    setGeneratingPDF(false);
  };

  const handleDownload = (employee) => {
    generatePDF(employee);
  };

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter employees based on search query
  const filteredEmployees = employeeData?.filter(
    (employee) =>
      employee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 when search is modified
  };

  const totalPages = Math.ceil(filteredEmployees?.length / itemsPerPage);

  const handleSave = () => {
    // Open confirmation modal
    setIsModalOpen(true);
  };

  const cancelSave = () => {
    setIsModalOpen(false);
  };

  const confirmSave = async () => {
    setSavingData(true);
    try {
      const response = await axios.post(`${backendDomainN}/salary/month/${month}-${year}`);
      if(response) {
        toast.success("Data saved successfully!");
      }
    } catch (error) {
      toast.error("Failed to save data!");
    } finally {
      setSavingData(false);
      setIsModalOpen(false);
    }
  };

  const getMonthName = (monthValue) => {
    const monthObj = months.find(m => m.value === monthValue);
    return monthObj ? monthObj.name : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Salary Slip Management</h1>
                <p className="text-blue-100">
                  Generate and manage employee salary slips
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                {month && year && (
                  <button
                    onClick={handleSave}
                    disabled={savingData || !month || !year || employeeData.length === 0}
                    className="inline-flex cursor-pointer items-center px-5 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingData ? (
                      <BiLoaderCircle className="animate-spin mr-2" />
                    ) : (
                      <FiSave className="mr-2" />
                    )}
                    {savingData ? "Saving..." : "Save Data"}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Period Selection */}
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FiCalendar className="mr-2 text-indigo-600" />
                Select Period
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Month</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full border cursor-pointer border-gray-300 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="">Select Month</option>
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.name} - {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="w-full border cursor-pointer border-gray-300 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Period Summary */}
            {month && year && employeeData.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 mb-6 border border-indigo-100 shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-indigo-800 mb-1">
                      {getMonthName(month)} {year} Salary Data
                    </h3>
                    <p className="text-gray-600">
                      Total Employees: <span className="font-semibold">{filteredEmployees.length}</span>
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-100 flex items-center">
                      <FiFileText className="text-indigo-600 mr-2" />
                      <span className="text-gray-700">
                        <span className="font-semibold">{filteredEmployees.length}</span> Salary Slips Available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by employee name or email or  code..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
              </div>
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <BiLoaderCircle className="animate-spin text-indigo-600 w-12 h-12" />
                <span className="ml-3 text-lg text-gray-600">Loading employee data...</span>
              </div>
            )}
            
            {/* No Data Found Message */}
            {!loading && month && year && employeeData.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-10 border border-gray-200 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-full bg-red-100 p-3 mb-4">
                    <FiFileText className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Salary Data Found</h3>
                  <p className="text-gray-600 max-w-md mb-6">
                    No salary data found for {getMonthName(month)} {year}
                  </p>
                  <button
                    onClick={fetchEmployeeData}
                    className="px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Refresh Data
                  </button>
                </div>
              </div>
            )}
            
            {/* Table */}
            {!loading && employeeData.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
                        <th className="px-4 py-3 text-left font-semibold border-b">Employee Code</th>
                        <th className="px-4 py-3 text-left font-semibold border-b">Name</th>
                        <th className="px-4 py-3 text-left font-semibold border-b">Email</th>
                        <th className="px-4 py-3 text-left font-semibold border-b">Net Pay (₹)</th>
                        <th className="px-4 py-3 text-center font-semibold border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentEmployees.length > 0 ? (
                        currentEmployees.map((employee) => (
                          <tr key={employee.id} className="hover:bg-blue-50 transition-colors duration-150">
                            <td className="px-4 py-3 font-medium text-gray-700">
                              {employee.employeeCode}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-700">
                              {employee.name}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {employee.email}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                {/* <FiDollarSign className="text-green-600 mr-1" /> */}
                                <span className="font-medium text-gray-700">
                                ₹ {employee.totalSalary?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || "0.00"}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-center space-x-2">
                                <button
                                  onClick={() => handleViewPDF(employee)}
                                  disabled={generatingPDF}
                                  className="inline-flex cursor-pointer items-center px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
                                >
                                  <FiEye className="mr-1" />
                                  View
                                </button>
                                <button
                                  onClick={() => handleDownload(employee)}
                                  disabled={generatingPDF}
                                  className="inline-flex cursor-pointer items-center px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-200"
                                >
                                  <FiDownload className="mr-1" />
                                  Download
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-8 text-gray-500">
                            No matching employee data found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Pagination Controls */}
            {!loading && employeeData.length > 0 && (
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Items per page:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {itemsPerPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => paginate(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 cursor-pointer rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 cursor-pointer rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Calculate page numbers to show (centered around current page)
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`w-8 h-8 flex cursor-pointer items-center justify-center rounded-md ${
                            currentPage === pageNum
                              ? "bg-indigo-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 cursor-pointer rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => paginate(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 cursor-pointer rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstEmployee + 1} to{" "}
                  {Math.min(indexOfLastEmployee, filteredEmployees.length)} of{" "}
                  {filteredEmployees.length} entries
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                <svg
                  className="h-10 w-10 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Confirm Save</h3>
              <p className="text-gray-600">
                Are you sure you want to save the salary data for {getMonthName(month)} {year}?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={cancelSave}
                className="px-4 py-2 cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                disabled={savingData}
                className="px-4 py-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors duration-200 flex items-center"
              >
                {savingData ? (
                  <>
                    <BiLoaderCircle className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalarySlipPage;