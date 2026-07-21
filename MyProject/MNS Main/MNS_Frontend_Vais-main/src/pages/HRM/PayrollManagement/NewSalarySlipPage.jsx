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
import {
  FiDownload,
  FiEye,
  FiCalendar,
  FiSearch,
  FiSave,
  FiFileText,
  FiDollarSign,
} from "react-icons/fi";

const NewSalarySlipPage = () => {
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
        error?.response?.data?.message || "Failed to fetch data for this month"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter employees based on search query
  const filteredEmployees = employeeData?.filter(
    (employee) =>
      employee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeCode
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
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

  const getMonthName = (monthValue) => {
    const monthObj = months.find((m) => m.value === monthValue);
    return monthObj ? monthObj.name : "";
  };


  const generatePDFOld = async () => {
    if (!employeeData || employeeData.length === 0) {
      toast.error("No data available to generate PDF");
      return;
    }

    setGeneratingPDF(true);
    try {
      const doc = new jsPDF("landscape", "mm", "a4");
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Salary Sheet", pageWidth / 2, 15, { align: "center" });

      // Subtitle
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`${getMonthName(month)} ${year}`, pageWidth / 2, 22, {
        align: "center",
      });

      // Process employee data
      const processedData = filteredEmployees.map((employee) => {
        const rows = [];

        const row1 = [];
        row1.push(`Name : ${employee.name || ""}`);
        row1.push(`Ph: ${employee.phNumber || "0123456789"}`);

        employee.additionalFields?.forEach((field) => {
          row1.push(
            `${field.description} : ${parseFloat(field.amount).toFixed(2)}`
          );
        });

        employee.deductionFields?.forEach((field) => {
          row1.push(
            `${field.description} : ${parseFloat(field.amount).toFixed(2)}`
          );
        });

        const totalSalary = Number(employee.totalSalary);
        row1.push(
          `Payable : ${!isNaN(totalSalary) ? totalSalary.toFixed(2) : "0.00"}`
        );

        // Split row1 into chunks to avoid too many columns
        const chunkSize = 6;
        for (let i = 0; i < row1.length; i += chunkSize) {
          rows.push(row1.slice(i, i + chunkSize));
        }

        // Second row - Additional info
        const row2 = [];
        row2.push(`Email : ${employee.email || "example@gmail.com"}`);
        row2.push(
          `Pan NO : ${employee.panNumber || employee.bankName || "Address"}`
        );
        if (employee.totalDays) row2.push(`Total Days : ${employee.totalDays}`);
        if (employee.present) row2.push(`Present : ${employee.present}`);
        if (employee.allLeaves) row2.push(`Leaves : ${employee.allLeaves}`);
        if (employee.bankName) row2.push(`Bank : ${employee.bankName}`);
        if (employee.ifscCode) row2.push(`IFSC : ${employee.ifscCode}`);
        row2.push(`Emp Code : ${employee.employeeCode}`);

        // Split row2 into chunks (like row1)
        const chunkSizeRow2 = 6;
        for (let i = 0; i < row2.length; i += chunkSizeRow2) {
          rows.push(row2.slice(i, i + chunkSizeRow2));
        }

        return rows;
      });

      // PDF page limits
      const rowsPerEmployee = 3; // approx based on row1 chunking & row2
      const availableHeight = pageHeight - 40;
      const rowHeight = 6;
      const maxEmployeesPerPage = Math.max(
        10,
        Math.floor(availableHeight / (rowsPerEmployee * rowHeight))
      );

      let currentPage = 0;
      let employeeIndex = 0;

      while (employeeIndex < processedData.length) {
        if (currentPage > 0) {
          doc.addPage();
        }

        const endIndex = Math.min(
          employeeIndex + maxEmployeesPerPage,
          processedData.length
        );
        const pageEmployees = processedData.slice(employeeIndex, endIndex);

        // Flatten all employee rows for autoTable
        const allRows = [];
        pageEmployees.forEach((employeeRows) => {
          employeeRows.forEach((row) => {
            allRows.push(row);
          });
        });

        // For drawing borders, calculate start indices and counts of rows per employee on this page
        const employeeRowCounts = pageEmployees.map(
          (empRows) => empRows.length
        );
        let employeeRowStartIndices = [];
        employeeRowCounts.reduce((acc, count, idx) => {
          employeeRowStartIndices[idx] = acc;
          return acc + count;
        }, 0);

        doc.autoTable({
          body: allRows,
          startY: currentPage === 0 ? 30 : 15,
          theme: "plain",
          showHead: false,
          bodyStyles: {
            fontSize: 8,
            cellPadding: 1,
            textColor: [0, 0, 0],
          },
          margin: { top: 15, right: 10, bottom: 15, left: 10 },

          didParseCell: function (data) {
            if (
              data.section === "body" &&
              data.cell.text[0]?.startsWith("Payable :")
            ) {
              data.cell.styles.fontStyle = "bold";
            }
          },

          didDrawPage: function () {
            doc.setFontSize(8);
            doc.text(
              `Page ${currentPage + 1}`,
              pageWidth - 20,
              pageHeight - 10
            );
          },

          didDrawCell: function (data) {
            if (data.section === "body") {
              employeeRowStartIndices.forEach((startRowIndex, idx) => {
                const rowCount = employeeRowCounts[idx];
                const endRowIndex = startRowIndex + rowCount - 1;

                if (
                  data.row.index === startRowIndex &&
                  data.column.index === 0
                ) {
                  const startY = data.cell.y;
                  const startX = data.table.settings.margin.left;
                  const endX = pageWidth - data.table.settings.margin.right;
                  const height = rowCount * data.cell.height;

                  // Draw rectangle border around employee block
                  doc.setDrawColor(0, 0, 0);
                  doc.setLineWidth(0.5);
                  doc.rect(startX, startY, endX - startX, height);
                }
              });
            }
          },
        });

        employeeIndex = endIndex;
        currentPage++;
      }

      const fileName = `Salary_Sheet_${getMonthName(month)}_${year}.pdf`;
      doc.save(fileName);
      toast.success(`PDF generated successfully with ${currentPage} page(s)!`);
    } catch (error) {
      // console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const generatePDF1 = async () => {
    if (!employeeData || employeeData.length === 0) {
      toast.error("No data available to generate PDF");
      return;
    }

    setGeneratingPDF(true);
    try {
      const doc = new jsPDF("landscape", "mm", "a4");
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Salary Sheet", pageWidth / 2, 15, { align: "center" });
      doc.text("MNS SECURE SOLUTIONS PVT LTD ", pageWidth / 2, 8, { align: "center" });

      // Subtitle
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`${getMonthName(month)} ${year}`, pageWidth / 2, 22, {
        align: "center",
      });

      // Process employee data
      const processedData = filteredEmployees.map((employee) => {
        const rows = [];

        const row1 = [];
        row1.push(`Emp Code: ${employee.employeeCode || "N/A"}`);
        row1.push(`Name : ${employee.name || "N/A"}`);
        row1.push(`Ph: ${employee.phNumber || "N/A"}`);
        row1.push(`Designation: ${employee.designation || "N/A"}`);
        row1.push(`PAN: ${employee.panNumber || "N/A"}`);
        row1.push(`PF No.: ${employee.uanNumber || "N/A"}`);
        row1.push(`ESI No.: ${employee.esicNumber || "N/A"}`);
        row1.push(`Total Days: ${employee.totalPresent || "0"}`);
        row1.push(`Present: ${employee.present || "0"}`);
        row1.push(`Leaves: ${employee.allLeaves || "0"}`);


        // Split row1 into chunks to avoid too many columns
        const chunkSize = 6;
        for (let i = 0; i < row1.length; i += chunkSize) {
          rows.push(row1.slice(i, i + chunkSize));
        }

        // Second row - Additional info
        const row2 = [];

        row2.push(`Bank: ${employee.bankName || "N/A"}`);
        row2.push(`IFSC: ${employee.ifscCode || "N/A"}`);
        row2.push(`Branch: ${employee.branch || "N/A"}`);
        row2.push(`Bank Number: ${employee.bankNumber || "N/A"}`);


        // Split row2 into chunks (like row1)
        const chunkSizeRow2 = 6;
        for (let i = 0; i < row2.length; i += chunkSizeRow2) {
          rows.push(row2.slice(i, i + chunkSizeRow2)); 
        }

        // Third Row
        const row3 = []

        row3.push(`Basic Pay: ${employee.additionalFields[0].amount || "0.00"}`);
        row3.push(`HRA: ${employee.additionalFields[1].amount || "0.00"}`);
        row3.push(`Convenience: ${employee.additionalFields[2].amount || "0.00"}`);
        row3.push(`Other Allowance: ${employee.additionalFields[3]?.amount || "0.00"}`);
        row3.push(`PF: ${employee.deductionFields[0].amount || "0.00"}`);
        row3.push(`ESI: ${employee.deductionFields[1].amount || "0.00"}`);
        row3.push(`P Tax: ${employee.deductionFields[2].amount || "0.00"}`);
        row3.push(`Total Additional: ${employee.totalAditional || "0.00"}`);
        row3.push(`Total Deduction: ${employee.totalDeduction || "0.00"}`);
        row3.push(`Net Pay: ${employee.totalSalary || "0.00"}`);

        // Split row3 into chunks (like row1)
        const chunkSizeRow3 = 6;
        for (let i = 0; i < row3.length; i += chunkSizeRow3) {
          rows.push(row3.slice(i, i + chunkSizeRow3));
        }

        return rows;
      });

      // PDF page limits
      const rowsPerEmployee = 3; // approx based on row1 chunking & row2
      const availableHeight = pageHeight - 40;
      const rowHeight = 6;
      const maxEmployeesPerPage = Math.max(
        10,
        Math.floor(availableHeight / (rowsPerEmployee * rowHeight))
      );

      let currentPage = 0;
      let employeeIndex = 0;

      while (employeeIndex < processedData.length) {
        if (currentPage > 0) {
          doc.addPage();
        }

        const endIndex = Math.min(
          employeeIndex + maxEmployeesPerPage,
          processedData.length
        );
        const pageEmployees = processedData.slice(employeeIndex, endIndex);

        // Flatten all employee rows for autoTable
        const allRows = [];
        pageEmployees.forEach((employeeRows) => {
          employeeRows.forEach((row) => {
            allRows.push(row);
          });
        });

        // For drawing borders, calculate start indices and counts of rows per employee on this page
        const employeeRowCounts = pageEmployees.map(
          (empRows) => empRows.length
        );
        let employeeRowStartIndices = [];
        employeeRowCounts.reduce((acc, count, idx) => {
          employeeRowStartIndices[idx] = acc;
          return acc + count;
        }, 0);

        doc.autoTable({
          body: allRows,
          startY: currentPage === 0 ? 30 : 15,
          theme: "plain",
          showHead: false,
          bodyStyles: {
            fontSize: 8,
            cellPadding: 1,
            textColor: [0, 0, 0],
          },
          margin: { top: 15, right: 10, bottom: 15, left: 10 },

          didParseCell: function (data) {
            if (
              data.section === "body" &&
              data.cell.text[0]?.startsWith("Payable :")
            ) {
              data.cell.styles.fontStyle = "bold";
            }
          },

          didDrawPage: function () {
            doc.setFontSize(8);
            doc.text(
              `Page ${currentPage + 1}`,
              pageWidth - 20,
              pageHeight - 10
            );
          },

          didDrawCell: function (data) {
            if (data.section === "body") {
              employeeRowStartIndices.forEach((startRowIndex, idx) => {
                const rowCount = employeeRowCounts[idx];
                const endRowIndex = startRowIndex + rowCount - 1;

                if (
                  data.row.index === startRowIndex &&
                  data.column.index === 0
                ) {
                  const startY = data.cell.y;
                  const startX = data.table.settings.margin.left;
                  const endX = pageWidth - data.table.settings.margin.right;
                  const height = rowCount * data.cell.height;

                  // Draw rectangle border around employee block
                  doc.setDrawColor(0, 0, 0);
                  doc.setLineWidth(0.2);
                  doc.rect(startX, startY, endX - startX, height);
                }
              });
            }
          },
        });

        employeeIndex = endIndex;
        currentPage++;
      }

      const fileName = `Salary_Sheet_${getMonthName(month)}_${year}.pdf`;
      doc.save(fileName);
      toast.success(`PDF generated successfully with ${currentPage} page(s)!`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const generatePDF = async () => {
  if (!filteredEmployees || filteredEmployees.length === 0) {
    toast.error("No data available to generate PDF");
    return;
  }

  setGeneratingPDF(true);

  try {
    const doc = new jsPDF("landscape", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // ------------------ HEADER ------------------
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("MNS SECURE SOLUTIONS PVT LTD", pageWidth / 2, 8, {
      align: "center",
    });
    doc.text("Salary Sheet", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${getMonthName(month)} ${year}`, pageWidth / 2, 22, {
      align: "center",
    });

    // ------------------ PROCESS EMPLOYEE DATA ------------------
    const processedData = filteredEmployees.map((employee) => {
      const rows = [];

      // ---------- ROW 1 : BASIC DETAILS ----------
      const row1 = [
        `Emp Code: ${employee.employeeCode || "N/A"}`,
        `Name: ${employee.name || "N/A"}`,
        `Ph: ${employee.phNumber || "N/A"}`,
        `Designation: ${employee.desigNation || "N/A"}`,
        `PAN: ${employee.panNumber || "N/A"}`,
        `PF No.: ${employee.pfNumber || "N/A"}`,
        `ESI No.: ${employee.esicNumber || "N/A"}`,
        `Total Days: ${employee.totalDays || "0"}`,
        `Present: ${employee.present || "0"}`,
        `Leaves: ${employee.allLeaves || "0"}`,
      ];

      for (let i = 0; i < row1.length; i += 6) {
        rows.push(row1.slice(i, i + 6));
      }

      // ---------- ROW 2 : BANK DETAILS ----------
      const row2 = [
        `Bank: ${employee.bankName || "N/A"}`,
        `IFSC: ${employee.ifscCode || "N/A"}`,
        `Branch: ${employee.branch || "N/A"}`,
        `Account No: ${employee.bankNumber || "N/A"}`,
      ];

      for (let i = 0; i < row2.length; i += 6) {
        rows.push(row2.slice(i, i + 6));
      }

      // ---------- ROW 3 : DYNAMIC ADDITION + DEDUCTION ----------
      const row3 = [];

      const formatAmount = (val) =>
        Number(val || 0).toFixed(2);

      // 🔹 ADDITIONAL FIELDS FIRST
      if (Array.isArray(employee.additionalFields)) {
        employee.additionalFields.forEach((item) => {
          row3.push(
            `${item.description || "Allowance"}: ${formatAmount(
              item.amount
            )}`
          );
        });
      }

      // 🔹 DEDUCTION FIELDS AFTER
      if (Array.isArray(employee.deductionFields)) {
        employee.deductionFields.forEach((item) => {
          row3.push(
            `${item.description || "Deduction"}: ${formatAmount(
              item.amount
            )}`
          );
        });
      }

      // 🔹 TOTALS (ALWAYS LAST)
      row3.push(`Total Additional: ${formatAmount(employee.totalAditional)}`);
      row3.push(`Total Deduction: ${formatAmount(employee.totalDeduction)}`);
      row3.push(`Net Pay: ${formatAmount(employee.totalSalary)}`);

      for (let i = 0; i < row3.length; i += 6) {
        rows.push(row3.slice(i, i + 6));
      }

      return rows;
    });

    // ------------------ PAGINATION ------------------
    const rowHeight = 6;
    const availableHeight = pageHeight - 40;
    const rowsPerEmployee = 5;
    const maxEmployeesPerPage = Math.max(
      8,
      Math.floor(availableHeight / (rowsPerEmployee * rowHeight))
    );

    let currentPage = 0;
    let employeeIndex = 0;

    while (employeeIndex < processedData.length) {
      if (currentPage > 0) doc.addPage();

      const endIndex = Math.min(
        employeeIndex + maxEmployeesPerPage,
        processedData.length
      );

      const pageEmployees = processedData.slice(employeeIndex, endIndex);

      const allRows = [];
      pageEmployees.forEach((emp) => emp.forEach((r) => allRows.push(r)));

      const employeeRowCounts = pageEmployees.map((e) => e.length);
      const employeeRowStartIndices = [];
      employeeRowCounts.reduce((acc, c, i) => {
        employeeRowStartIndices[i] = acc;
        return acc + c;
      }, 0);

      doc.autoTable({
        body: allRows,
        startY: currentPage === 0 ? 30 : 15,
        theme: "plain",
        bodyStyles: {
          fontSize: 8,
          cellPadding: 1,
        },
        margin: { left: 10, right: 10 },

        didDrawCell: (data) => {
          if (data.section === "body") {
            employeeRowStartIndices.forEach((start, idx) => {
              if (
                data.row.index === start &&
                data.column.index === 0
              ) {
                const height =
                  employeeRowCounts[idx] * data.cell.height;
                doc.rect(
                  data.cell.x,
                  data.cell.y,
                  pageWidth - 20,
                  height
                );
              }
            });
          }
        },

        didDrawPage: () => {
          doc.setFontSize(8);
          doc.text(
            `Page ${currentPage + 1}`,
            pageWidth - 20,
            pageHeight - 10
          );
        },
      });

      employeeIndex = endIndex;
      currentPage++;
    }

    doc.save(`Salary_Sheet_${getMonthName(month)}_${year}.pdf`);
    toast.success("PDF generated successfully");

  } catch (error) {
    console.error(error);
    toast.error("PDF generation failed");
  } finally {
    setGeneratingPDF(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Salary Slip Management
                </h1>
                <p className="text-blue-100">
                  Generate and manage employee salary slips
                </p>
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
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Month
                  </label>
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
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Year
                  </label>
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
                      Total Employees:{" "}
                      <span className="font-semibold">
                        {filteredEmployees.length}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center gap-4">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-100 flex items-center">
                      <FiFileText className="text-indigo-600 mr-2" />
                      <span className="text-gray-700">
                        <span className="font-semibold">
                          {filteredEmployees.length}
                        </span>{" "}
                        Salary Slips Available
                      </span>
                    </div>

                    {/* PDF Download Button */}
                    <button
                      onClick={generatePDF}
                      disabled={generatingPDF || !employeeData.length}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg shadow-sm border border-green-100 flex items-center transition-colors duration-200"
                    >
                      {generatingPDF ? (
                        <BiLoaderCircle className="animate-spin mr-2" />
                      ) : (
                        <FiDownload className="mr-2" />
                      )}
                      {generatingPDF ? "Generating PDF..." : "Download PDF"}
                    </button>
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

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">Salary Sheet</h2>
              <p className="text-sm text-gray-600">
                {getMonthName(month)} {year}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <BiLoaderCircle className="animate-spin text-indigo-600 w-12 h-12" />
                <span className="ml-3 text-lg text-gray-600">
                  Loading employee data...
                </span>
              </div>
            )}

            {/* No Data Found Message */}
            {!loading && month && year && employeeData.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-10 border border-gray-200 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-full bg-red-100 p-3 mb-4">
                    <FiFileText className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No Salary Data Found
                  </h3>
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
                  <table className="w-full text-sm">
                    <tbody>
                      {currentEmployees.map((employee, index) => (
                        <React.Fragment key={employee.id}>
                          {/* Employee Header Row */}
                          <tr
                            className={
                              index > 0 ? "border-t-2 border-gray-300" : ""
                            }
                          >
                            <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200">
                              Name :
                            </td>
                            <td className="px-3 py-2 border-r border-gray-200">
                              {employee.name}
                            </td>
                            <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200">
                              Ph:
                            </td>
                            <td className="px-3 py-2 border-r border-gray-200">
                              {employee.phNumber || "0123456789"}
                            </td>
                            <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200">
                              Employee Code:
                            </td>
                            <td className="px-3 py-2 border-r border-gray-200">
                              {employee.employeeCode || "N/A"}
                            </td>
                            <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200">
                              Email:
                            </td>
                            <td className="px-3 py-2 border-r border-gray-200">
                              {employee.email || "example@gmail.com"}
                            </td>
                            <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200">
                              Joining Date :
                            </td>
                            <td className="px-3 py-2">
                              {employee.joiningDate || "00/00/0000"}
                            </td>
                          </tr>

                          {/* Additional Fields Row */}
                          <tr>
                            <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200">
                              Total Days:
                            </td>
                            <td className="px-3 py-2 border-r border-gray-200">
                              {employee.totalDays}
                            </td>
                            <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200">
                              Present:
                            </td>
                            <td className="px-3 py-2 border-r border-gray-200">
                              {employee.present}
                            </td>
                            <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200">
                              Leaves:
                            </td>
                            <td className="px-3 py-2 border-r border-gray-200">
                              {employee.allLeaves}
                            </td>
                            <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200">
                              Bank Name:
                            </td>
                            <td className="px-3 py-2 border-r border-gray-200">
                              {employee.bankName || "bank..."}
                            </td>
                            <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200">
                              IFSC Code:
                            </td>
                            <td className="px-3 py-2">
                              {employee.ifscCode || "IFSC..."}
                            </td>
                          </tr>

                          {/* Bank Details Row */}
                          <tr>
                            <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200">
                              Bank Number:
                            </td>
                            <td className="px-3 py-2 border-r border-gray-200">
                              {employee.bankNumber || "0123456789"}
                            </td>
                            <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200">
                              Branch:
                            </td>
                            <td className="px-3 py-2 border-r border-gray-200">
                              {employee.branch || "Branch..."}
                            </td>

                            {/* Additional Fields */}
                            {employee.additionalFields
                              ?.slice(0, 3)
                              .map((field, idx) => (
                                <React.Fragment key={`add-${idx}`}>
                                  <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200">
                                    {field.description} :
                                  </td>
                                  <td
                                    className={`px-3 py-2 ${
                                      idx < 2 ? "border-r border-gray-200" : ""
                                    }`}
                                  >
                                    ₹{" "}
                                    {parseFloat(field.amount).toLocaleString(
                                      "en-IN",
                                      { minimumFractionDigits: 2 }
                                    )}
                                  </td>
                                </React.Fragment>
                              ))}
                          </tr>

                          {/* More Additional Fields if needed */}
                          {employee.additionalFields?.length > 3 && (
                            <tr>
                              {employee.additionalFields
                                ?.slice(3, 8)
                                .map((field, idx) => (
                                  <React.Fragment key={`add-extra-${idx}`}>
                                    <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200">
                                      {field.description} :
                                    </td>
                                    <td
                                      className={`px-3 py-2 ${
                                        idx < 4
                                          ? "border-r border-gray-200"
                                          : ""
                                      }`}
                                    >
                                      ₹{" "}
                                      {parseFloat(field.amount).toLocaleString(
                                        "en-IN",
                                        { minimumFractionDigits: 2 }
                                      )}
                                    </td>
                                  </React.Fragment>
                                ))}
                            </tr>
                          )}

                          {/* Deduction Fields Row */}
                          {employee.deductionFields?.length > 0 && (
                            <tr>
                              {employee.deductionFields
                                ?.slice(0, 5)
                                .map((field, idx) => (
                                  <React.Fragment key={`ded-${idx}`}>
                                    <td className="px-3 py-2 font-medium text-red-600 border-r border-gray-200">
                                      {field.description} :
                                    </td>
                                    <td
                                      className={`px-3 py-2 text-red-600 ${
                                        idx < 4
                                          ? "border-r border-gray-200"
                                          : ""
                                      }`}
                                    >
                                      ₹{" "}
                                      {parseFloat(field.amount).toLocaleString(
                                        "en-IN",
                                        { minimumFractionDigits: 2 }
                                      )}
                                    </td>
                                  </React.Fragment>
                                ))}
                            </tr>
                          )}

                          {/* Totals Row */}
                          <tr>
                            <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200">
                              Total Additional:
                            </td>
                            <td className="px-3 py-2 text-green-600 font-medium border-r border-gray-200">
                              ₹{" "}
                              {employee.totalAditional?.toLocaleString(
                                "en-IN",
                                { minimumFractionDigits: 2 }
                              )}
                            </td>
                            <td className="px-3 py-2 font-medium text-gray-700 border-r border-gray-200">
                              Total Deduction:
                            </td>
                            <td className="px-3 py-2 text-red-600 font-medium border-r border-gray-200">
                              ₹{" "}
                              {employee.totalDeduction?.toLocaleString(
                                "en-IN",
                                { minimumFractionDigits: 2 }
                              )}
                            </td>
                            <td className="px-3 py-2 font-bold text-gray-700 border-r border-gray-200">
                              Net Payable:
                            </td>
                            <td className="px-3 py-2 font-bold text-lg text-blue-600">
                              ₹{" "}
                              {employee.totalSalary?.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-3 py-2 border-r border-gray-200"></td>
                            <td className="px-3 py-2 border-r border-gray-200"></td>
                            <td className="px-3 py-2 border-r border-gray-200"></td>
                            <td className="px-3 py-2"></td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && employeeData.length > 0 && (
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">
                    Items per page:
                  </label>
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
    </div>
  );
};

export default NewSalarySlipPage;
