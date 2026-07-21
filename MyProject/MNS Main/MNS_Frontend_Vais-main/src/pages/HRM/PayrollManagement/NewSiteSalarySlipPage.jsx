import axios from "axios";
import "jspdf-autotable";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiLoaderCircle } from "react-icons/bi";
import { FaFileExcel } from "react-icons/fa";
import {
  FiActivity,
  FiCalendar,
  FiDollarSign,
  FiDownload,
  FiEdit,
  FiEye,
  FiFileText,
  FiMapPin,
  FiPlus,
  FiSave,
  FiSearch,
  FiTrash2,
  FiTrendingDown,
  FiTrendingUp,
  FiUser,
  FiX,
} from "react-icons/fi";
import * as XLSX from "xlsx-js-style";
import { backendDomainR1 } from "../../../Common/index";

const NewSiteSalarySlipPage = () => {
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
  const [projects, setProjects] = useState([]);
  const [siteId, setSiteId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [updatingSalary, setUpdatingSalary] = useState(false);
  const [generatingExcel, setGeneratingExcel] = useState(false);
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

  // const getMonthName = (monthCode) => {
  //   return months.find((month) => month.value === monthCode)?.name;
  // };

  // console.log("employeeData : ", employeeData);


  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${backendDomainR1}/api/v1/payroll/fetch/wage-Details`
      );
      // console.log("response : ", response.data);
      setProjects(response?.data?.data || []);
    } catch (error) {
      toast.error("Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (month && year) {
      setEmployeeData([]);
      fetchEmployeeData();
    }
  }, [month, year, siteId]);

  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendDomainR1}/api/v1/salary/salaries?month=${month}-${year}&siteId=${siteId}`
      );

        const transformed = response.data.map(item => ({
      ...item.salary,       // flatten salary fields to top
      employee: item.employee // attach employee object
    }));

      // console.log("Employee Data for this month ", transformed);
      setEmployeeData(transformed);
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

  const downloadPDF = async () => {
    if (!month || !year) {
      toast.error("Please select a month, year first.");
      return;
    }

    setGeneratingPDF(true);
    try {
      const response = await axios.get(
        `${backendDomainR1}/api/v1/salary/sheet/${month}-${year}?siteId=${siteId}`,
        {
          responseType: "blob",
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Salary_Sheet_${getMonthName(month)}_${year}.pdf`
      );
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error(
        error?.response?.data?.message ||
        "Failed to download PDF for this month"
      );
    } finally {
      setGeneratingPDF(false);
    }
  };

  const downloadExcelOld = async () => {
    if (!month || !year) {
      toast.error("Please select a month, year first.");
      return;
    }

    // console.log("Employee Data for this month ", employeeData);

    const workbook = XLSX.utils.book_new();

    // Define the header row with subcells for grouped sections
    const header = [
      "Sl. No.",
      "ID NO.",
      "Name",
      "Site",
      "Total Days",
      "Present",
      "Total Present",
      "Absent",
      "OT",
      "SL",
      "CL",
      // Monthly Wages Entitle section
      // "Monthly Wages Entitle",
      // "",
      // "",
      // "",
      // "",
      // Take Home Salary section
      "Take Home Salary",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      // Employer Share section
      // "Employer Share",
      // "",
      // "",
      // Signature column
      "Signature",
    ];

    const subHeader = [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      // "", // Empty for non-grouped columns
      // Monthly Wages Entitle subcells
      // "Basic Salary",
      // "HRA",
      // "Washing Allowance",
      // "Other Allowance",
      // "Gross Salary",
      // Take Home Salary subcells
      "Basic Salary",
      "HRA",
      "DA",
      "ADA",
      "Washing Allowance",
      "Bonus",
      "Other Allowance",
      "Gross Salary",
      "PF @ 12%",
      "ESI @ 0.75%",
      "P.Tax",
      "Uniform & Registration",
      "Additional Pay",
      "Total Deduction",
      "Total Earnings",
      "Net Salary",
      // Employer Share subcells
      // "PF @ 13%",
      // "ESI @ 3.25%",
      // "Total",
    ];

    // Map employee data to rows
    const rows = employeeData?.map((employee, index) => {
      const siteName =
        employee?.siteWorks.length > 0 && employee?.siteWorks[0].siteName;

      const sc = employee.salaryComponents || {};

      // Monthly Wages entitle (full values)
      const fullBasic = Number(sc.fullbasicWages).toFixed(2) || 0;
      const fullHRA = Number(sc.fullhra).toFixed(2) || 0;
      const fullWashing = Number(sc.fullwashingAllowance).toFixed(2) || 0;
      const fullOther = Number(sc.fulladditionalDutyAllowance).toFixed(2) || 0;
      const fullGross = Number(sc.fullGross).toFixed(2) || 0; // (A)

      // Take Home Salary components
      const basicWages = Number(sc.basicWages).toFixed(2) || 0;
      const hra = Number(sc.hra).toFixed(2) || 0;
      const da = Number(sc.da).toFixed(2) || 0;
      const ada = Number(sc.additionalDutyAllowance).toFixed(2) || 0;
      const washingAllowance = Number(sc.washingAllowance).toFixed(2) || 0;
      const bonus = Number(sc.bonus).toFixed(2) || 0;
      const otherAllowance = Number(sc.otSalary).toFixed(2) || 0;
      const gross = Number(sc.totalEarnings).toFixed(2) || 0;

      // Deductions
      const pfDeduction = Number(sc.pfDeduction).toFixed(2) || 0; // PF @ 12%
      const esiDeduction = Number(sc.esiDeduction).toFixed(2) || 0; // ESI @ 0.75%
      const ptaxDeduction = Number(sc.ptaxDeduction).toFixed(2) || 0; // P.Tax
      const uniformRegistration = Number(sc.uniformDeductions).toFixed(2) || 0; // Uniform & Registration (fallback to additionalDeduction if uniformRegistration not available)
      const salaryAdvance = Number(sc.advancePayment).toFixed(2) || 0; // Salary Advance
      const totalDeduction =
        Number(sc.totalDeductions) ||
        Number(pfDeduction) +
        Number(esiDeduction) +
        Number(ptaxDeduction) +
        Number(uniformRegistration) +
        Number(salaryAdvance); // Total Deduction (B)

      // Additional Duty (for take home)
      const additionalDuty = Number(sc.additionalDutyAllowance || 0);

      // Sub Total (C) - typically Gross + Additional Duty
      const subTotal = Number(gross + additionalDuty); // (C)

      const totalEarnings = Number(sc.totalEarnings).toFixed(2) || 0;

      // Take Home Salary (A+C-B)
      const takeHomeSalary =
        Number(sc.netSalary) || fullGross + subTotal - totalDeduction;

      // Net Salary
      const netSalary = Number(sc.netSalary).toFixed(2) || 0;

      // Employer share
      const employerPF = (Number(fullBasic) * 13) / 100;
      const employerESI = (Number(fullBasic) * 3.25) / 100;
      const employerTotal = employerPF + employerESI;

      return [
        index + 1, // Sl. No.
        employee.employeeCode || "", // ID NO.
        employee.employeeName || "", // Name
        siteName || "", // Designation
        employee.totalDays || 0, // Month Day
        employee.presentDays || 0, // Working Day
        employee.totalPresentday || 0, // Working Day
        employee.absentDays || 0, // Additional Duty
        employee.otDays || 0, // Additional Duty
        employee.sickLeaveDays || 0, // Additional Duty
        employee.casualLeaveDays || 0, // Additional Duty
        // Monthly Wages entitle
        // fullBasic,
        // fullHRA,
        // fullWashing,
        // fullOther,
        // fullGross,
        // Take Home Salary - Deductions
        basicWages,
        hra,
        da,
        ada,
        washingAllowance,
        bonus,
        otherAllowance,
        gross, // (A)
        pfDeduction, // PF @ 12%
        esiDeduction, // ESI @ 0.75%
        ptaxDeduction, // P.Tax
        uniformRegistration, // Uniform & Registration
        salaryAdvance, // Salary Advance
        totalDeduction.toFixed(2), // Total Deduction (B)
        // additionalDuty, // Additional Duty
        totalEarnings,
        netSalary,
        // subTotal.toFixed(2), // Sub Total (C)
        // takeHomeSalary.toFixed(2), // Take Home Salary (A+C-B)
        // Employer share
        // employerPF.toFixed(2),
        // employerESI.toFixed(2),
        // employerTotal.toFixed(2),

        "", // Signature (empty for now)
      ];
    });

    const companyInfo = ["MNS SECURE SOLUTIONS PVT. LTD"];

    const wageInfo = [
      `${siteId
        ? employeeData[0]?.siteWorks.length > 0 &&
        employeeData[0]?.siteWorks[0].siteName
        : ""
      } Wage Details`,
    ];

    const monthInfo = ["For the Month of " + getMonthName(month) + " " + year];

    // Combine header, subheader, and rows
    const worksheetData = [
      companyInfo,
      wageInfo,
      monthInfo,
      header,
      subHeader,
      ...rows,
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Merge cells for grouped headers
    const merges = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 27 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 27 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 27 } },
      { s: { r: 3, c: 0 }, e: { r: 4, c: 0 } },
      { s: { r: 3, c: 1 }, e: { r: 4, c: 1 } },
      { s: { r: 3, c: 2 }, e: { r: 4, c: 2 } },
      { s: { r: 3, c: 3 }, e: { r: 4, c: 3 } },
      { s: { r: 3, c: 4 }, e: { r: 4, c: 4 } },
      { s: { r: 3, c: 5 }, e: { r: 4, c: 5 } },
      { s: { r: 3, c: 6 }, e: { r: 4, c: 6 } },
      { s: { r: 3, c: 7 }, e: { r: 4, c: 7 } },
      { s: { r: 3, c: 8 }, e: { r: 4, c: 8 } },
      { s: { r: 3, c: 9 }, e: { r: 4, c: 9 } },
      { s: { r: 3, c: 10 }, e: { r: 4, c: 10 } },
      // { s: { r: 3, c: 7 }, e: { r: 3, c: 11 } }, // Monthly Wages Entitle (5 cols)
      { s: { r: 3, c: 11 }, e: { r: 3, c: 26 } }, // Take Home Salary (14 cols)
      // { s: { r: 3, c: 26 }, e: { r: 3, c: 28 } }, // Employer Share (3 cols)
      // { s: { r: 3, c: 26 }, e: { r: 4, c: 26 } },
    ];

    worksheet["!merges"] = merges;

    const TOTAL_COLUMNS = 28;
    const TOTAL_ROWS = XLSX.utils.decode_range(worksheet["!ref"]).e.r;

    for (let r = 0; r <= TOTAL_ROWS; r++) {
      for (let c = 0; c < TOTAL_COLUMNS; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        if (!worksheet[addr]) continue;

        if (!worksheet[addr].s) worksheet[addr].s = {};

        // Column A
        if (c === 0) {
          worksheet[addr].s.alignment = {
            horizontal: "center",
            vertical: "center",
          };
        }
        // Columns B, C, D → leave as-is
        else if (c >= 1 && c <= 3) {
          continue;
        } else if (c >= 4 && c <= 11) {
          worksheet[addr].s.alignment = {
            horizontal: "center",
            vertical: "center",
          };
        }
        // Remaining columns
        else {
          worksheet[addr].s.alignment = {
            horizontal: "right",
            vertical: "center",
          };
        }
      }
    }

    // Center align the merged cells
    const headerRows = [0, 1, 2, 3, 4];

    headerRows.forEach((r) => {
      for (let c = 0; c <= 29; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        if (!worksheet[addr]) continue;

        worksheet[addr].s = {
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          font: { bold: r <= 5 },
        };
      }
    });

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      ...Array(TOTAL_COLUMNS - 11).fill({ wch: 12 }),
    ];

    worksheet["!rows"] = [
      { hpt: 28 },
      { hpt: 22 },
      { hpt: 22 },
      { hpt: 26 },
      { hpt: 32 },
      { hpt: 22 },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(
      workbook,
      `Salary_Sheet_${getMonthName(month)}_${year}.xlsx`,
      {
        cellStyles: true,
      }
    );
  };

  const downloadExcel = async () => {
    if (!month || !year) {
      toast.error("Please select a month, year first.");
      return;
    }

    console.log("Employee Data for this month ", employeeData);

    const workbook = XLSX.utils.book_new();

    const header = [
      "Sl. No.",
      "Month",
      "Emplyoyee ID",
      "Name",
      "Site",
      "Bank",
      "Branch",
      "IFSC",
      "Account No.",
      "Net Salary",
    ];

    // Map employee data to rows
    const rows = employeeData?.map((employee, index) => {
      const siteName =
        employee?.siteWorks.length > 0 && employee?.siteWorks[0].siteName;

      const sc = employee.salaryComponents || {};

      // Monthly Wages entitle (full values)
      const fullBasic = Number(sc.fullbasicWages).toFixed(2) || 0;
      const fullHRA = Number(sc.fullhra).toFixed(2) || 0;
      const fullWashing = Number(sc.fullwashingAllowance).toFixed(2) || 0;
      const fullOther = Number(sc.fulladditionalDutyAllowance).toFixed(2) || 0;
      const fullGross = Number(sc.fullGross).toFixed(2) || 0; // (A)

      // Take Home Salary components
      const basicWages = Number(sc.basicWages).toFixed(2) || 0;
      const hra = Number(sc.hra).toFixed(2) || 0;
      const da = Number(sc.da).toFixed(2) || 0;
      const ada = Number(sc.additionalDutyAllowance).toFixed(2) || 0;
      const washingAllowance = Number(sc.washingAllowance).toFixed(2) || 0;
      const bonus = Number(sc.bonus).toFixed(2) || 0;
      const otherAllowance = Number(sc.otSalary).toFixed(2) || 0;
      const gross = Number(sc.totalEarnings).toFixed(2) || 0;

      // Deductions
      const pfDeduction = Number(sc.pfDeduction).toFixed(2) || 0; // PF @ 12%
      const esiDeduction = Number(sc.esiDeduction).toFixed(2) || 0; // ESI @ 0.75%
      const ptaxDeduction = Number(sc.ptaxDeduction).toFixed(2) || 0; // P.Tax
      const uniformRegistration = Number(sc.uniformDeductions).toFixed(2) || 0; // Uniform & Registration (fallback to additionalDeduction if uniformRegistration not available)
      const salaryAdvance = Number(sc.advancePayment).toFixed(2) || 0; // Salary Advance
      const totalDeduction =
        Number(sc.totalDeductions) ||
        Number(pfDeduction) +
        Number(esiDeduction) +
        Number(ptaxDeduction) +
        Number(uniformRegistration) +
        Number(salaryAdvance); // Total Deduction (B)

      // Additional Duty (for take home)
      const additionalDuty = Number(sc.additionalDutyAllowance || 0);

      // Sub Total (C) - typically Gross + Additional Duty
      const subTotal = Number(gross + additionalDuty); // (C)

      const totalEarnings = Number(sc.totalEarnings).toFixed(2) || 0;

      // Take Home Salary (A+C-B)
      const takeHomeSalary =
        Number(sc.netSalary) || fullGross + subTotal - totalDeduction;

      // Net Salary
      const netSalary = Number(sc.netSalary).toFixed(2) || 0;

      // Employer share
      const employerPF = (Number(fullBasic) * 13) / 100;
      const employerESI = (Number(fullBasic) * 3.25) / 100;
      const employerTotal = employerPF + employerESI;

      return [
        index + 1, // Sl. No.
        getMonthName(month),
        employee.employeeCode || "", // ID NO.
        employee.employeeName || "", // Name
        siteName || "", // Site
        employee.employee.bankName || "", // Bank
        employee.employee.branch || "", // Branch (placeholder; populate if data available)
        employee.employee.ifscCode || "", // IFSC
        employee.employee.accountNo || "", // Account No.
        netSalary || 0, // Net Salary
      ];
    });

    const companyInfo = ["MNS SECURE SOLUTIONS PVT. LTD"];

    const wageInfo = [
      `${siteId
        ? employeeData[0]?.siteWorks.length > 0 &&
        employeeData[0]?.siteWorks[0].siteName
        : ""
      } Wage Details`,
    ];

    const monthInfo = ["For the Month of " + getMonthName(month) + " " + year];

    // Combine header, subheader, and rows
    const worksheetData = [companyInfo, wageInfo, monthInfo, header, ...rows];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const merges = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }, // Updated to span 10 columns
      { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } }, // Updated to span 10 columns
      { s: { r: 2, c: 0 }, e: { r: 2, c: 9 } }, // Updated to span 10 columns
    ];

    worksheet["!merges"] = merges;

    const TOTAL_COLUMNS = 28;
    const TOTAL_ROWS = XLSX.utils.decode_range(worksheet["!ref"]).e.r;

    for (let r = 0; r <= TOTAL_ROWS; r++) {
      for (let c = 0; c < TOTAL_COLUMNS; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        const cell = worksheet[addr];
        if (!cell) continue;

        // Initialize style object if missing
        if (!cell.s) cell.s = {};

        cell.s.alignment = {
          horizontal: "center",
          vertical: "center",
        };
      }
    }

    // Center align the merged cells
    const headerRows = [0, 1, 2, 3];

    headerRows.forEach((r) => {
      for (let c = 0; c <= 29; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        if (!worksheet[addr]) continue;

        worksheet[addr].s = {
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          font: { bold: r <= 5 },
        };
      }
    });

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 16 },
      { wch: 22 },
      { wch: 22 },
      { wch: 22 },
      { wch: 22 },
      { wch: 22 },
      { wch: 22 },
      { wch: 22 },
      { wch: 18 },
    ];

    worksheet["!rows"] = [
      { hpt: 28 },
      { hpt: 22 },
      { hpt: 22 },
      { hpt: 26 },
      { hpt: 22 },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(
      workbook,
      `Salary_Sheet_${getMonthName(month)}_${year}.xlsx`,
      {
        cellStyles: true,
      }
    );
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

  const SalaryDetailModal = ({ isOpen, onClose, employee }) => {
    if (!isOpen || !employee) return null;

    const { salaryComponents, siteWorks } = employee;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white relative">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                  <FiUser className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {employee.employeeName}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-blue-100/80 text-sm">
                    <span className="bg-white/10 px-2 py-0.5 rounded-md">
                      {employee.employeeCode}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      {getMonthName(month)} {year}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="group bg-blue-50/50 p-5 rounded-2xl border border-blue-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Total Days
                  </p>
                  <FiCalendar className="text-blue-400" />
                </div>
                <p className="text-3xl font-black text-blue-900">
                  {employee.totalDays}
                </p>
                <div className="mt-2 w-full bg-blue-200 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>

              <div className="group bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    Present Days
                  </p>
                  <FiActivity className="text-emerald-400" />
                </div>
                <p className="text-3xl font-black text-emerald-900">
                  {employee.presentDays}
                </p>
                <div className="mt-2 w-full bg-emerald-200 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full"
                    style={{
                      width: `${(employee.presentDays / employee.totalDays) * 100
                        }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="group bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    Gross Earnings
                  </p>
                  <FiTrendingUp className="text-indigo-400" />
                </div>
                <p className="text-3xl font-black text-indigo-900">
                  ₹{salaryComponents?.totalEarnings?.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="group bg-indigo-600 p-5 rounded-2xl shadow-xl shadow-indigo-200 transform md:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-2 text-indigo-100">
                  <p className="text-xs font-bold uppercase tracking-wider">
                    Net Pay
                  </p>
                  <FiDollarSign />
                </div>
                <p className="text-3xl font-black text-white">
                  ₹{salaryComponents?.netSalary?.toLocaleString("en-IN")}
                </p>
                <p className="text-[10px] text-indigo-200 italic mt-1 font-medium">
                  After all deductions
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Earnings Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span className="p-2 bg-emerald-100 rounded-lg">
                      <FiTrendingUp className="text-emerald-600" />
                    </span>
                    Earnings Details
                  </h3>
                </div>
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="divide-y divide-gray-50 uppercase text-[10px] font-bold text-gray-400">
                    <div className="px-6 py-2 bg-gray-50/50 flex justify-between">
                      <span>Component</span>
                      <span>Amount</span>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-50 text-sm">
                    {[
                      {
                        label: "Basic Wages",
                        value: salaryComponents?.basicWages,
                      },
                      { label: "DA", value: salaryComponents?.da },
                      { label: "HRA", value: salaryComponents?.hra },
                      {
                        label: "Washing Allowance",
                        value: salaryComponents?.washingAllowance,
                      },
                      {
                        label: "Add. Duty Allowance",
                        value: salaryComponents?.additionalDutyAllowance,
                      },
                      { label: "Bonus", value: salaryComponents?.bonus },
                      {
                        label: "Other Earnings",
                        value: salaryComponents?.additionalEarning,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="px-6 py-3.5 flex justify-between items-center hover:bg-gray-50/50 transition-colors"
                      >
                        <span className="text-gray-600 font-medium">
                          {item.label}
                        </span>
                        <span className="text-gray-900 font-bold">
                          ₹{item.value?.toLocaleString("en-IN") || "0"}
                        </span>
                      </div>
                    ))}
                    <div className="px-6 py-4 flex justify-between items-center bg-blue-50/30">
                      <span className="text-blue-700 font-bold">
                        Total Earnings
                      </span>
                      <span className="text-blue-700 text-lg font-black tracking-tight">
                        ₹
                        {salaryComponents?.totalEarnings?.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deductions Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span className="p-2 bg-rose-100 rounded-lg">
                      <FiTrendingDown className="text-rose-600" />
                    </span>
                    Deductions Details
                  </h3>
                </div>
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <div className="divide-y divide-gray-50 uppercase text-[10px] font-bold text-gray-400">
                    <div className="px-6 py-2 bg-gray-50/50 flex justify-between">
                      <span>Component</span>
                      <span>Amount</span>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-50 text-sm">
                    {[
                      {
                        label: "PF Deduction",
                        value: salaryComponents?.pfDeduction,
                      },
                      {
                        label: "ESI Deduction",
                        value: salaryComponents?.esiDeduction,
                      },
                      {
                        label: "P-Tax",
                        value: salaryComponents?.ptaxDeduction,
                      },
                      {
                        label: "Uniform",
                        value: salaryComponents?.uniformDeductions,
                      },
                      {
                        label: "Advance Payment",
                        value: salaryComponents?.advancePayment,
                      },
                      {
                        label: "Other Deductions",
                        value: salaryComponents?.additionalDeduction,
                      },
                      ...(salaryComponents?.deductionDetails || []).map(
                        (d) => ({ label: d.description, value: d.amount })
                      ),
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="px-6 py-3.5 flex justify-between items-center hover:bg-gray-50/50 transition-colors"
                      >
                        <span className="text-gray-600 font-medium">
                          {item.label}
                        </span>
                        <span className="text-rose-600 font-bold">
                          ₹{item.value?.toLocaleString("en-IN") || "0"}
                        </span>
                      </div>
                    ))}
                    <div className="px-6 py-4 flex justify-between items-center bg-rose-50/30 mt-auto">
                      <span className="text-rose-700 font-bold">
                        Total Deductions
                      </span>
                      <span className="text-rose-700 text-lg font-black tracking-tight">
                        ₹
                        {salaryComponents?.totalDeductions?.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Site breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="p-2 bg-blue-100 rounded-lg">
                  <FiMapPin className="text-blue-600" />
                </span>
                Site Deployment Breakdown
              </h3>
              <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        Location / Site Name
                      </th>
                      <th className="px-6 py-4 text-center w-32">Days</th>
                      <th className="px-6 py-4 text-right w-40">Site Wage</th>
                      <th className="px-6 py-4 text-right w-40">
                        Allocated Pay
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {siteWorks?.map((site, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                              <FiMapPin className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-gray-700">
                              {site.siteName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-gray-100 px-3 py-1 rounded-full font-bold text-gray-600 text-xs">
                            {site.daysWorked} d
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-gray-600">
                          ₹{site.siteWage?.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-black text-blue-600">
                            ₹{site.siteWiseSalary?.toLocaleString("en-IN")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-bold shadow-sm active:scale-95 cursor-pointer"
            >
              Close
            </button>
            {/* <button
              onClick={() => window.print()}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100 active:scale-95 flex items-center gap-2"
            >
              <FiFileText />
              Print Slip
            </button> */}
          </div>
        </div>
      </div>
    );
  };

  const EditSalaryModal = ({ isOpen, onClose, employee, onUpdate }) => {
    const [formData, setFormData] = useState(null);

    useEffect(() => {
      if (employee) {
        setFormData({
          ...employee.salaryComponents,
          additionalDetails: employee.salaryComponents?.additionalDetails || [],
          deductionDetails: employee.salaryComponents?.deductionDetails || [],
        });
      }
    }, [employee]);

    if (!isOpen || !employee || !formData) return null;

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    };

    const handleDynamicFieldChange = (index, field, value, type) => {
      const listKey =
        type === "earning" ? "additionalDetails" : "deductionDetails";
      const updatedList = [...(formData[listKey] || [])];
      updatedList[index] = {
        ...updatedList[index],
        [field]: field === "amount" ? parseFloat(value) || 0 : value,
      };
      setFormData((prev) => ({ ...prev, [listKey]: updatedList }));
    };

    const addDynamicField = (type) => {
      const listKey =
        type === "earning" ? "additionalDetails" : "deductionDetails";
      setFormData((prev) => ({
        ...prev,
        [listKey]: [...(prev[listKey] || []), { description: "", amount: 0 }],
      }));
    };

    const removeDynamicField = (index, type) => {
      const listKey =
        type === "earning" ? "additionalDetails" : "deductionDetails";
      const updatedList = (formData[listKey] || []).filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({ ...prev, [listKey]: updatedList }));
    };

    // Calculate totals on the fly
    const extraEarnings = (formData.additionalDetails || []).reduce(
      (sum, d) => sum + (d.amount || 0),
      0
    );
    const totalEarnings = (
      (formData.basicWages || 0) +
      (formData.da || 0) +
      (formData.hra || 0) +
      (formData.washingAllowance || 0) +
      (formData.additionalDutyAllowance || 0) +
      (formData.bonus || 0) +
      (formData.additionalEarning || 0) +
      extraEarnings
    ).toFixed(2);

    const totalDeductions = (
      (formData.pfDeduction || 0) +
      (formData.esiDeduction || 0) +
      (formData.ptaxDeduction || 0) +
      (formData.additionalDeduction || 0) +
      (formData.deductionDetails?.reduce(
        (sum, d) => sum + (d.amount || 0),
        0
      ) || 0)
    ).toFixed(2);

    const netSalary = (totalEarnings - totalDeductions).toFixed(2);

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-6 text-white relative">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                  <FiEdit className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Edit Salary Details
                  </h2>
                  <p className="text-amber-100 text-sm mt-1">
                    Modifying records for{" "}
                    <span className="font-bold underline">
                      {employee.employeeName}
                    </span>{" "}
                    ({employee.employeeCode})
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onUpdate({
                ...formData,
                totalEarnings,
                totalDeductions,
                netSalary,
              });
            }}
            className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-gray-50/30"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Additional Fields (Earnings) */}
              <div className="flex flex-col gap-6">
                <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-blue-900 flex items-center gap-2">
                      Additional Fields
                    </h3>
                    <button
                      type="button"
                      onClick={() => addDynamicField("earning")}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-blue-200"
                    >
                      <FiPlus /> Add Field
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Fixed Earnings */}
                    {[
                      { label: "Basic Salary", name: "basicWages" },
                      { label: "DA", name: "da" },
                      { label: "HRA", name: "hra" },
                      { label: "Convenience", name: "washingAllowance" }, // Mapping washing as convenience per image feel
                      { label: "Bonus", name: "bonus" },
                    ].map((field) => (
                      <div
                        key={field.name}
                        className="bg-white p-4 rounded-2xl border border-blue-50 shadow-sm space-y-2"
                      >
                        <label className="text-sm font-bold text-blue-800">
                          {field.label}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            disabled
                            value={field.label}
                            className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 w-full"
                          />
                          <div className="relative min-w-[140px]">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                              ₹
                            </span>
                            <input
                              type="number"
                              name={field.name}
                              placeholder="Amount"
                              value={formData[field.name] || ""}
                              onChange={handleInputChange}
                              className="w-full pl-6 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Dynamic Earnings */}
                    {(formData.additionalDetails || []).map((field, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-2xl border border-blue-50 shadow-sm space-y-2 animate-in slide-in-from-left-4 duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-blue-800">
                            Extra Earning {idx + 1}
                          </label>
                          <button
                            type="button"
                            onClick={() => removeDynamicField(idx, "earning")}
                            className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Description"
                            value={field.description}
                            onChange={(e) =>
                              handleDynamicFieldChange(
                                idx,
                                "description",
                                e.target.value,
                                "earning"
                              )
                            }
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <div className="relative min-w-[140px]">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                              ₹
                            </span>
                            <input
                              type="number"
                              placeholder="Amount"
                              value={field.amount || ""}
                              onChange={(e) =>
                                handleDynamicFieldChange(
                                  idx,
                                  "amount",
                                  e.target.value,
                                  "earning"
                                )
                              }
                              className="w-full pl-6 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-100/50 p-4 rounded-2xl flex justify-between items-center border border-blue-200">
                    <span className="font-black text-blue-900">
                      Total Additional:
                    </span>
                    <span className="text-xl font-black text-blue-900 tracking-tight">
                      ₹{totalEarnings}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deduction Fields (Deductions) */}
              <div className="flex flex-col gap-6">
                <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-rose-900 flex items-center gap-2">
                      Deduction Fields
                    </h3>
                    <button
                      type="button"
                      onClick={() => addDynamicField("deduction")}
                      className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-rose-200"
                    >
                      <FiPlus /> Add Deduction
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Fixed Deductions */}
                    {[
                      { label: "ESI", name: "esiDeduction" },
                      { label: "PF", name: "pfDeduction" },
                      { label: "P-Tax", name: "ptaxDeduction" },
                    ].map((field) => (
                      <div
                        key={field.name}
                        className="bg-white p-4 rounded-2xl border border-rose-50 shadow-sm space-y-2"
                      >
                        <label className="text-sm font-bold text-rose-800">
                          {field.label}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            disabled
                            value={field.label}
                            className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 w-full"
                          />
                          <div className="relative min-w-[140px]">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                              ₹
                            </span>
                            <input
                              type="number"
                              name={field.name}
                              placeholder="Amount"
                              value={formData[field.name] || ""}
                              onChange={handleInputChange}
                              className="w-full pl-6 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-bold text-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Dynamic Deductions */}
                    {(formData.deductionDetails || []).map((field, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-2xl border border-rose-50 shadow-sm space-y-2 animate-in slide-in-from-right-4 duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-rose-800">
                            Extra Deduction {idx + 1}
                          </label>
                          <button
                            type="button"
                            onClick={() => removeDynamicField(idx, "deduction")}
                            className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Description"
                            value={field.description}
                            onChange={(e) =>
                              handleDynamicFieldChange(
                                idx,
                                "description",
                                e.target.value,
                                "deduction"
                              )
                            }
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 w-full focus:ring-2 focus:ring-rose-500 outline-none"
                          />
                          <div className="relative min-w-[140px]">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                              ₹
                            </span>
                            <input
                              type="number"
                              placeholder="Amount"
                              value={field.amount || ""}
                              onChange={(e) =>
                                handleDynamicFieldChange(
                                  idx,
                                  "amount",
                                  e.target.value,
                                  "deduction"
                                )
                              }
                              className="w-full pl-6 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-bold text-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-rose-100/50 p-4 rounded-2xl flex justify-between items-center border border-rose-200">
                    <span className="font-black text-rose-900">
                      Total Deductions:
                    </span>
                    <span className="text-xl font-black text-rose-900 tracking-tight">
                      ₹{totalDeductions}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary Preview */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-100 flex flex-col md:flex-row justify-between items-center gap-6 border-4 border-white">
              <div className="flex items-center gap-6">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                  <FiDollarSign className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-indigo-100 font-bold uppercase tracking-widest text-xs">
                    Final Net Salary Payable
                  </p>
                  <h4 className="text-4xl font-black mt-1 tracking-tight">
                    ₹{netSalary}
                  </h4>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-indigo-100/80 font-medium italic">
                  Synchronizing all adjustments...
                </p>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-bold shadow-sm active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={updatingSalary}
              onClick={() => {
                onUpdate({
                  ...formData,
                  totalEarnings,
                  totalDeductions,
                  netSalary,
                });
              }}
              className="px-8 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all font-bold shadow-lg shadow-amber-100 active:scale-95 flex items-center gap-2 disabled:bg-gray-400 disabled:shadow-none cursor-pointer "
            >
              {updatingSalary ? (
                <BiLoaderCircle className="animate-spin" />
              ) : (
                <FiSave />
              )}
              {updatingSalary ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
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
                  Salary Slip Management For Tasks
                </h1>
                <p className="text-blue-100">
                  View all salary slips from your tasks and sites
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
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Site
                  </label>
                  <select
                    value={siteId}
                    onChange={(e) => setSiteId(e.target.value)}
                    className="w-full border cursor-pointer border-gray-300 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="">Select Site</option>
                    {(projects || [])
                      .filter((p) => p?.siteName && (p?.id || p?._id))
                      .map((p) => (
                        <option key={p.id || p._id} value={p.id || p._id}>
                          {p.siteName}
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

                  <div className="mt-4 md:mt-0 flex items-center">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-100 flex items-center">
                      <FiFileText className="text-indigo-600 mr-2" />
                      <span className="text-gray-700">
                        <span className="font-semibold">
                          {filteredEmployees.length}
                        </span>{" "}
                        Salary Slips Available
                      </span>
                    </div>
                    <button
                      onClick={downloadPDF}
                      disabled={generatingPDF || !employeeData.length}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg shadow-sm border border-green-100 flex items-center transition-colors duration-200 ml-2"
                    >
                      {generatingPDF ? (
                        <BiLoaderCircle className="animate-spin mr-2" />
                      ) : (
                        <FiDownload className="mr-2" />
                      )}
                      {generatingPDF ? "Generating PDF..." : "Download PDF"}
                    </button>
                    <button
                      onClick={downloadExcel}
                      disabled={generatingExcel || !employeeData.length}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg shadow-sm border border-green-100 flex items-center transition-colors duration-200 ml-2"
                    >
                      <FaFileExcel className="mr-2" />
                      Download Excel
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
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Employee Code
                        </th>
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Site Name
                        </th>
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Total Month's Days
                        </th>
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Present Days
                        </th>
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Net Pay (₹)
                        </th>
                        <th className="px-4 py-3 text-left font-semibold border-b">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentEmployees.length > 0 ? (
                        currentEmployees.map((employee) => (
                          <tr
                            key={employee.id}
                            className="hover:bg-blue-50 transition-colors duration-150"
                          >
                            <td className="px-4 py-3 font-medium text-gray-700">
                              {employee.employeeCode}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-700">
                              {employee.employeeName}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-700">
                              {employee.siteWorks?.[0]?.siteName || 0}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {employee.totalDays}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {employee.presentDays}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                {/* <FiDollarSign className="text-green-600 mr-1" /> */}
                                <span className="font-medium text-gray-700">
                                  ₹{" "}
                                  {employee.salaryComponents?.netSalary?.toLocaleString(
                                    "en-IN",
                                    { maximumFractionDigits: 2 }
                                  ) || "0.00"}
                                </span>
                              </div>
                            </td>

                            <td className="px-4 py-3 text-gray-600 flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedEmployee(employee);
                                  setIsViewModalOpen(true);
                                }}
                                className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                                title="View Details"
                              >
                                <FiEye className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedEmployee(employee);
                                  setIsEditModalOpen(true);
                                }}
                                className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-100 text-amber-600 transition-colors"
                                title="Edit"
                              >
                                <FiEdit className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center py-8 text-gray-500"
                          >
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
                          className={`w-8 h-8 flex cursor-pointer items-center justify-center rounded-md ${currentPage === pageNum
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
      <SalaryDetailModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
      />

      <EditSalaryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onUpdate={async (updatedComponents) => {
          setUpdatingSalary(true);
          try {
            // Reconstruct the full employee object with updated components
            const payload = {
              ...selectedEmployee,
              salaryComponents: updatedComponents,
            };

            // console.log("payload :", payload);
            // return;

            const response = await axios.put(
              `${backendDomainR1}/api/v1/salary?employeeCode=${selectedEmployee.employeeCode}&month=${selectedEmployee.month}&siteId=${selectedEmployee?.siteWorks?.[0]?.siteId}`,
              payload
            );

            if (response.status === 200 || response.status === 201) {
              // Update local state for immediate feedback
              setEmployeeData((prevData) =>
                prevData.map((emp) =>
                  emp.employeeCode === selectedEmployee.employeeCode
                    ? { ...emp, salaryComponents: updatedComponents }
                    : emp
                )
              );

              toast.success("Salary details updated successfully!");
              setIsEditModalOpen(false);
              setSelectedEmployee(null);
            }
          } catch (error) {
            console.error("Error updating salary:", error);
            toast.error(
              error?.response?.data?.message ||
              "Failed to update salary details"
            );
          } finally {
            setUpdatingSalary(false);
          }
        }}
      />
    </div>
  );
};

export default NewSiteSalarySlipPage;
