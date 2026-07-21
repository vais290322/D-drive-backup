import React, { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaTrash,
  FaFilePdf,
} from "react-icons/fa";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { backendDomainR1 } from "../../Common";

export default function ViewProjectComponent() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewProject, setViewProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    // Fetch projects from backend
    fetch(`${backendDomainR1}/api/v1/payroll/fetch/wage-Details`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else if (Array.isArray(data.data)) {
          setProjects(data.data);
        } else {
          setProjects([]);
        }
      })
      .catch((err) => {
        toast.error("Failed to fetch projects!");
        console.error(err);
      });
  }, []);

  // --- Filtering and Pagination Logic ---
  const filteredProjects = Array.isArray(projects)
    ? projects.filter(
        (p) =>
          (p.vendorName || "").toLowerCase().includes(search.toLowerCase()) ||
          (p.vendorCode || "").toLowerCase().includes(search.toLowerCase()) ||
          (p.state || "").toLowerCase().includes(search.toLowerCase()) ||
          (p.siteName || "").toLowerCase().includes(search.toLowerCase()) ||
          (p.category || "").toLowerCase().includes(search.toLowerCase())
      )
    : [];
  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage) || 1;
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // --- Action Handlers ---
  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    const id = projectToDelete._id || projectToDelete.id;
    if (!id) {
      toast.error("No project ID found!");
      setDeleteDialogOpen(false);
      return;
    }
    try {
      const response = await fetch(
        `${backendDomainR1}/api/v1/payroll/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        toast.error("Failed to delete project!");
        setDeleteDialogOpen(false);
        return;
      }
      toast.success("Project deleted!");
      fetch(`${backendDomainR1}/api/v1/payroll/fetch/wage-Details`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setProjects(data);
          else if (Array.isArray(data.data)) setProjects(data.data);
          else setProjects([]);
        });
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (err) {
      toast.error("Error deleting project!");
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      console.error(err);
    }
  };

  const handlePDFDownload = (project) => {
    console.log("Generating PDF for project:", project);
    const id = project._id || project.id;
    if (!id) {
      toast.error("No project ID found!");
      return;
    }
    
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text("Project Details", 105, 15, { align: "center" });
      
      // Add project information
      doc.setFontSize(12);
      doc.text(`Vendor: ${project.vendorName || 'N/A'} (${project.vendorCode || 'N/A'})`, 14, 30);
      doc.text(`State: ${project.state || 'N/A'}`, 14, 40);
      doc.text(`Employee: ${project.siteName || 'N/A'}`, 14, 50);
      doc.text(`Category: ${project.category || 'N/A'}`, 14, 60);
      doc.text(`Work Hours: ${project.workHours || 'N/A'}`, 14, 70);
      doc.text(`Monthly Wage: ₹${project.monthlyWage || '0'}`, 14, 80);
      
      // Add salary components table
      doc.setFontSize(14);
      doc.text("Salary Components", 14, 95);
      
      const salaryData = [
        ["Component", "Percentage", "Amount"],
        ["Basic Wages", `${project.basicWagesPercentage || '0'}%`, `₹${project.basicWages || '0'}`],
        ["DA", `${project.daPercentage || '0'}%`, `₹${project.da || '0'}`],
        ["HRA", `${project.hraPercentage || '0'}%`, `₹${project.hra || '0'}`],
        ["Additional Duty Allowance", `${project.additionalDutyAllowancePercentage || '0'}%`, `₹${project.additionalDutyAllowance || '0'}`],
        ["Gross Salary", "", `₹${project.grossSalary || '0'}`],
        ["Washing Allowance", "", `₹${project.washingAllowance || '0'}`],
        ["Sub Total 1", "", `₹${project.subTotal1 || '0'}`],
      ];
      
      doc.autoTable({
        startY: 100,
        head: [salaryData[0]],
        body: salaryData.slice(1),
        theme: 'grid',
      });
      
      // Add deductions table
      const deductionsY = doc.previousAutoTable.finalY + 10;
      doc.text("Deductions", 14, deductionsY);
      
      const deductionsData = [
        ["Component", "Percentage", "Amount"],
        ["PF on Basic", `${project.pfOnBasicPercentage || '0'}%`, `₹${project.pfOnBasic || '0'}`],
        ["ESI/Medical/WC", `${project.esiMedicalWcPercentage || '0'}%`, `₹${project.esiMedicalWc || '0'}`],
        ["Bonus", `${project.bonusPercentage || '0'}%`, `₹${project.bonus || '0'}`],
        ["Uniform", "", `₹${project.uniform || '0'}`],
        ["Leave on Minimum Wage", "", `₹${project.leaveOnMinimumWage || '0'}`],
        ["LWF", "", `₹${project.lwf || '0'}`],
        ["Sub Total 2", "", `₹${project.subTotal2 || '0'}`],
        ["Service Charges", `${project.serviceChargesPercentage || '0'}%`, `₹${project.serviceCharges || '0'}`],
        ["Total", "", `₹${project.total || '0'}`],
        ["GST", "", `₹${project.gst || '0'}`],
      ];
      
      doc.autoTable({
        startY: deductionsY + 5,
        head: [deductionsData[0]],
        body: deductionsData.slice(1),
        theme: 'grid',
      });
      
      // Save the PDF
      doc.save(`project-details-${id}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      toast.error("Error generating PDF!");
      console.error(err);
    }
  };

  const handleBackendPDFDownload = async (report) => {
    const id = report._id || report.id;
    if (!id) {
      toast.error("No report ID found!");
      return;
    }
    const url = `${backendDomainR1}/api/v1/payroll/pdf/${id}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok) {
        toast.error("Failed to download PDF!");
        return;
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `Wage-details-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      toast.error("Error downloading PDF!");
      console.error(err);
    }
  };
  // --- Modal Dialog Overlay ---
  const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 backdrop-blur-[8px]"
        onClick={onClose}
      ></div>
      <div className="relative z-10 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-5xl">
        {children}
      </div>
    </div>
  );

  // --- Table Component ---
  return (
    <>
      <div className="p-0 w-full min-h-screen bg-transparent">
        {/* Table and Controls */}
        <div className="bg-white shadow rounded-lg p-6 border border-gray-200 mb-6 w-full max-w-full mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between p-4 bg-white shadow-sm rounded-lg">
              {/* Search Input */}
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search Vendor, site, State..."
                  className="pl-10 pr-4 py-2 w-full sm:w-80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85zm-5.242 1.156a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                </svg>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md px-2 py-1"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                    Vendor Code
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                    Vendor Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                    Site Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                    State
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">
                    Monthly Wage
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProjects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-400">
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  paginatedProjects?.map((p, idx) => {
                    const globalIdx = (currentPage - 1) * rowsPerPage + idx;
                    return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{p.vendorCode}</td>
                        <td className="px-4 py-2 text-sm">{p.vendorName}</td>
                        <td className="px-4 py-2 text-sm">{p.siteName}</td>
                        <td className="px-4 py-2 text-sm">{p.category}</td>
                        <td className="px-4 py-2 text-sm">{p.state}</td>
                        <td className="px-4 py-2 text-sm">₹{p.monthlyWage}</td>
                        <td className="px-4 py-2 flex text-center text-sm">
                          <button
                            className="inline-flex items-center gap-1 px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition cursor-pointer "
                            title="View"
                            onClick={() => setViewProject(p)}
                          >
                            <FaEye size={18} />
                          </button>
                          <button
                            className="inline-flex items-center gap-1 px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition cursor-pointer"
                            title="Delete"
                            onClick={() => handleDeleteClick(p)}
                          >
                            <FaTrash size={18} />
                          </button>
                          <button
                            className="inline-flex items-center gap-1 px-2 py-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition cursor-pointer"
                            title="Download PDF"
                            // onClick={() => handlePDFDownload(p)}
                            onClick={() => handleBackendPDFDownload(p)}
                          >
                            <FaFilePdf size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 w-full gap-4">
            <span className="text-sm text-gray-600">
              Showing{" "}
              {filteredProjects.length === 0
                ? 0
                : (currentPage - 1) * rowsPerPage + 1}
              -{Math.min(currentPage * rowsPerPage, filteredProjects.length)} of{" "}
              {filteredProjects.length}
            </span>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  className={`w-6 h-6 flex items-center justify-center rounded-full border transition-all ${
                    currentPage === 1
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-blue-100 text-blue-600 cursor-pointer"
                  }`}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                >
                  <FaChevronLeft />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`w-6 h-7 flex items-center justify-center rounded-full border transition-all mx-0.5
                      ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white shadow ring-2 ring-blue-300 border-blue-600 font-bold"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100 hover:text-blue-700"
                      }
                    `}
                    style={{ minWidth: 32 }}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className={`w-6 h-6 flex items-center justify-center rounded-full border transition-all ${
                    currentPage === totalPages
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-blue-100 text-blue-600 cursor-pointer"
                  }`}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View Project Modal */}
        {viewProject && (
          <Modal onClose={() => setViewProject(null)}>
            <div className="p-6 space-y-6 w-full relative">
              <button
                type="button"
                onClick={() => setViewProject(null)}
                className="absolute top-4 right-4 text-red-500 font-bold text-2xl cursor-pointer z-20"
              >
                &times;
              </button>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-blue-700">
                  Project Details
                </h2>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold">Client Code:</span> {viewProject.vendorCode}
                  </div>
                  <div>
                    <span className="font-semibold">Client Name:</span> {viewProject.vendorName}
                  </div>
                  <div>
                    <span className="font-semibold">Commercial Date:</span> {viewProject.commercialDate}
                  </div>
                  <div>
                    <span className="font-semibold">State:</span> {viewProject.state}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Site Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-semibold">Site Name:</span> {viewProject.siteName}
                  </div>
                  <div>
                    <span className="font-semibold">Category:</span> {viewProject.category}
                  </div>
                  <div>
                    <span className="font-semibold">Work Hours:</span> {viewProject.workHours}
                  </div>
                  <div>
                    <span className="font-semibold">Working Days :</span> {viewProject.workingDays}
                  </div>
                  <div>
                    <span className="font-semibold">Monthly Wages :</span> {viewProject.monthlyWage}
                  </div>
                  <div>
                    <span className="font-semibold">Invoice Amount :</span> {viewProject.invoiceAmount}
                  </div>
                </div>
              </div>
              
              {/* <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Salary Components</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">Component</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">Percentage</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-2 py-1 text-xs">Monthly Wage</td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.monthlyWage}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">Basic Wages</td>
                        <td className="px-2 py-1 text-xs">{viewProject.basicWagesPercentage}%</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.basicWages}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">DA</td>
                        <td className="px-2 py-1 text-xs">{viewProject.daPercentage}%</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.da}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">HRA</td>
                        <td className="px-2 py-1 text-xs">{viewProject.hraPercentage}%</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.hra}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">Additional Duty Allowance</td>
                        <td className="px-2 py-1 text-xs">{viewProject.additionalDutyAllowancePercentage}%</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.additionalDutyAllowance}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">Gross Salary</td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.grossSalary}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">Washing Allowance</td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.washingAllowance}</td>
                      </tr>
                      <tr className="bg-gray-100 font-semibold">
                        <td className="px-2 py-1 text-xs">Sub Total 1</td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.subTotal1}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div> */}
              
              {/* <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Deductions</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">Component</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">Percentage</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-2 py-1 text-xs">PF on Basic</td>
                        <td className="px-2 py-1 text-xs">{viewProject.pfOnBasicPercentage}%</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.pfOnBasic}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">ESI/Medical/WC</td>
                        <td className="px-2 py-1 text-xs">{viewProject.esiMedicalWcPercentage}%</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.esiMedicalWc}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">Bonus</td>
                        <td className="px-2 py-1 text-xs">{viewProject.bonusPercentage}%</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.bonus}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">Uniform</td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.uniform}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">Leave on Minimum Wage</td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.leaveOnMinimumWage}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">LWF</td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.lwf}</td>
                      </tr>
                      <tr className="bg-gray-100 font-semibold">
                        <td className="px-2 py-1 text-xs">Sub Total 2</td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.subTotal2}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">Service Charges</td>
                        <td className="px-2 py-1 text-xs">{viewProject.serviceChargesPercentage}%</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.serviceCharges}</td>
                      </tr>
                      <tr className="font-semibold">
                        <td className="px-2 py-1 text-xs">Total</td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.total}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">Note: </td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">{viewProject.gst}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div> */}
              
              {/* Take Home Salary Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Take Home Salary</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">Component</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">Percentage</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-700">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-2 py-1 text-xs">Basic Wages</td>
                        <td className="px-2 py-1 text-xs">{viewProject.thBasicWagesPercentage}%</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.thBasicWages}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">DA</td>
                        <td className="px-2 py-1 text-xs">{viewProject.thDaPercentage}%</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.thDa}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">HRA</td>
                        <td className="px-2 py-1 text-xs">{viewProject.thHraPercentage}%</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.thHra}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">Additional Duty Allowance</td>
                        <td className="px-2 py-1 text-xs">{viewProject.thAdditionalDutyAllowancePercentage}%</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.thAdditionalDutyAllowance}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">Gross Salary</td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.thGrossSalary}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">Washing Allowance</td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.thWashingAllowance}</td>
                      </tr>
                      <tr className="bg-gray-100 font-semibold">
                        <td className="px-2 py-1 text-xs">Sub Total 1</td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.thSubTotal1}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">PF on Salary</td>
                        <td className="px-2 py-1 text-xs">{viewProject.thPfOnSalaryPercentage}%</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.thPfOnSalary}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">ESI/Medical/WC</td>
                        <td className="px-2 py-1 text-xs">{viewProject.thEsiMedicalWcPercentage}%</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.thEsiMedicalWc}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">P Tax</td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.thPTax}</td>
                      </tr>
                      <tr className="bg-gray-100 font-semibold">
                        <td className="px-2 py-1 text-xs">Total Deductions</td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.thTotalDeductions}</td>
                      </tr>
                      <tr className="font-semibold">
                        <td className="px-2 py-1 text-xs">Take Home Salary</td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.thTakeHomeSalary}</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs">Bonus</td>
                        <td className="px-2 py-1 text-xs">{viewProject.thBonusPercentage}%</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.thBonus}</td>
                      </tr>
                      <tr className="font-semibold">
                        <td className="px-2 py-1 text-xs">Actual Effective Salary</td>
                        <td className="px-2 py-1 text-xs">-</td>
                        <td className="px-2 py-1 text-xs">₹{viewProject.thActualEffectiveSalary}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Modal>
        )}
        
        {/* Delete Confirmation Dialog */}
        {deleteDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-100 text-red-600 rounded-full p-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 3h6a1 1 0 011 1v1H8V4a1 1 0 011-1z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-red-600">
                  Delete Project
                </h2>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to permanently delete this project? This
                action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteDialogOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}