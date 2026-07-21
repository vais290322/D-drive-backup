import { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaCog,
  FaUsers,
  FaFileInvoice,
  FaTasks,
} from "react-icons/fa";
import { SiMockserviceworker } from "react-icons/si";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { Link, Outlet } from "react-router-dom"; 
import mns from "../../assets/mns.jpg";
import { useSelector } from "react-redux";
import { RiBillFill } from "react-icons/ri";
import BankSidebarLinks from "../../components/BankSidebarLinks";
import SnigdhaBankSidebarLinks from "../../components/SnigdhaBankSidebarLinks";
const LayoutComponent = () => {
  const userRole = useSelector((state) => state?.auth?.user);

  // console.log("role from side bar : ", role);

  const hasAccess = (section) => {
    if (userRole === "admin") return true;

    switch (section) {
      case "CRM":
        return userRole === "crm" || userRole === "admin";
      case "MNS Billing":
        return (
          userRole === "billing" ||
          userRole === "admin" ||
          userRole === "mnsBilling"
        );
      case "Snigdha Billing":
        return (
          userRole === "billing" ||
          userRole === "admin" ||
          userRole === "snigdhaBilling"
        );
      case "HRM":
        return userRole === "hrm" || userRole === "admin";
      case "Operation":
        return userRole === "operation" || userRole === "admin";
      case "Setting":
        return (
          userRole === "admin" ||
          userRole === "mnsBilling" ||
          userRole === "snigdhaBilling" ||
          userRole === "billing"
        );
      default:
        return false;
    }
  };

  const [openSections, setOpenSections] = useState({
    CRM: false,
    "MNS Billing": false,
    "Snigdha Billing": false,
    HRM: false,
    Operation: false,
    Setting: false,
  });
  const [openSubSections, setOpenSubSections] = useState({
    Invoice: false,
    Inventory: false,
    Reports: false,
    PO: false,
    BankMns: false,
    BankSnigdha: false,

    SNIInvoice: false,
    SNIInventory: false,
    SNIReports: false,
    SNIPO: false,

    EmployeeManagement: false,
    IndirectStaff: false,
    LeaveManagement: false,
    Attendance: false,
    RFIDAttendance: false,
    PayrollManagement: false,
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleSubSection = (subSection) => {
    setOpenSubSections((prev) => ({
      ...prev,
      [subSection]: !prev[subSection],
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`flex flex-col bg-gray-800 text-white h-full fixed top-0 left-0 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        } transition-all`}
      >
        {/* Sidebar Toggle Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!isSidebarCollapsed && (
            // <span className="text-lg font-bold">Logo</span>
            <img src={mns} alt="logo" className="w-36 h-12 " />
          )}
          <button
            className="text-xl focus:outline-none cursor-pointer"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            {isSidebarCollapsed ? (
              <TbLayoutSidebarRightCollapse />
            ) : (
              <TbLayoutSidebarLeftCollapse />
            )}
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto">
          {/* Dashboard */}
          <Link to="/" className="py-2 hover:text-gray-300">
            <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-blue-500 font-bold text-xl flex items-center">
              <FaTasks className="mr-2" />
              {!isSidebarCollapsed && <span>Dashboard</span>}
            </div>
          </Link>

          {/* <BankSidebarLinks /> */}
          {/* <SnigdhaBankSidebarLinks /> */}

         
          {/* Sections */}
          {[
            // crm section
            {
              name: "CRM",
              icon: <FaUsers className="mr-2" />,
              links: [
                { to: "/add-customer", label: "-- Customer Management" },
                // { to: "/modify-client", label: "-- Modify & Delete Client" },
                { to: "/client-list", label: "-- Client List" },
                { to: "/add-vendor", label: "-- Vendor Management" },
              ],
            },
            // MNS billing section
            {
              name: "MNS Billing",
              icon: <FaFileInvoice className="mr-2" />,
              subSections: [
                {
                  name: "Invoice",
                  stateKey: "Invoice",
                  links: [
                    { to: "/add-invoice", label: "-- Add Invoice" },
                    { to: "/view-invoice", label: "-- View Invoice" },
                    
                    {
                      to: "/view-proforma-invoice",
                      label: "-- View Proforma Invoice",
                    },
                    {
                      to: "/service-invoice-reports",
                      label: "-- View Service Invoice ",
                    },
                    {
                      to: "/service-perfroma-invoice",
                      label: "-- View Service Proforma Invoice ",
                    },

                    
                  ],
                },
                {
                  name: "Product Receipt Invoice",
                  links: [
                    {
                      to: "/product-payment-invoice",
                      label: "--Add Product Receipt Invoice",
                    },
                    {
                      to: "/view-product-payment-invoice",
                      label: "-- Manage Ledger Report",
                    },
                  ],
                },
                {
                  name: "Service Receipt Invoice",
                  links: [
                    {
                      to: "/add-service-receipt-mns",
                      label: "-- Add Service Receipt Invoice ",
                    },
                    {
                      to: "/update-service-receipt-mns",
                      label: "-- Update Service Receipt Invoice  ",
                    },
                  ],
                },
                {
                  name: "Inventory",
                  stateKey: "Inventory",
                  links: [
                    { to: "/add-item", label: "-- Add Item" },
                    // { to: "/add-product", label: "-- Add Product" },
                    // { to: "/modify-product", label: "-- Modify Product" },
                    {
                      to: "/inventory-management",
                      label: "-- Inventory Management",
                    },

                    // { to: "/add-product-from-snigdha", label: "-- Add Product From Snigdha" },
                  ],
                },
                {
                  name: "Reports",
                  stateKey: "Reports",
                  links: [
                    { to: "/gst-report", label: "-- GST Report" },
                    // { to: "/balance-sheet", label: "-- Balance Sheet" },
                    { to: "/profit-loss", label: "-- Profit & Loss" },
                    { to: "/acctually-profit-loss", label: "-- Acctual Profit & Loss" },
                    { to: "/inventory-report", label: "-- Inventory Report" },

                    { to: "/salses-report-mns", label: "-- Sales Report" },
                    
                    {
                      to: "/pending-ledger-report-mns",
                      label: "-- Pending Ledger Report",
                    },
                    {
                      to: "/master-ledger-report-mns",
                      label: "-- Master Ledger Report",
                    },
                    {
                      to: "/received-po",
                      label: "-- All transfer report to snigdha",
                    },
                  ],
                },
                // {
                //   name: "Selling",
                //   links: [
                //     { to: "/add-client", label: "-- Add Client" },
                //     { to: "/raise-po", label: "-- Seel Product " },
                //   ],
                // },
                {
                  name: "Purchase",
                  stateKey: "PO",
                  links: [
                    {
                      to: "/mns-purchase-order",
                      label: "-- Create Purchase ",
                    },
                    {
                      to: "/mns-view-purchase-order",
                      label: "-- View All Purchase ",
                    },

                    {
                      to: "/add-purchase-payment-mns",
                      label: "-- Add Payment For Purchase ",
                    },
                    {
                      to: "/update-purchase-payment-mns",
                      label: "-- Update Payment For Purchase ",
                    },

                  ],
                },

                {
                  name: "Bank",
                  stateKey: "BankMns",
                  links: [
                    {
                      to: "/imprest-fund-mns",
                      label: "-- Imprest Fund Or Petty Cash ",
                    },
                    {
                      to: "/add-bank-mns",
                      label: "-- Add Bank",
                    },
                    
                    {
                      to: "/withdraw-mns",
                      label: "-- Withdraw From Bank",
                    },
                    {
                      to: "/add-expense-mns",
                      label: "-- Add Expense ",
                    },
                    {
                      to: "/add-deposit-mns",
                      label: "-- Add Deposit",
                    },
                    {
                      to: "/add-note-mns",
                      label: "-- Add Note",
                    },
                    {
                      to: "/money-transfer-mns",
                      label: "-- Money Transfer",
                    },
                    {
                      to: "/manage-purchase-transaction-mns",
                      label: "-- Manage Purchase Transaction",
                    },
                    {
                      to: "/bank-statement-mns",
                      label: "-- Bank's Statement",
                    },
                  ],
                },
              ],
              component: <BankSidebarLinks />,

            },
            
            // Snigdha billing section - Changed from MNS Billing to Snigdha Billing
            {
              name: "Snigdha Billing",
              icon: <RiBillFill className="mr-2" />,
              subSections: [
                {
                  name: "Invoice",
                  stateKey: "SNIInvoice",
                  links: [
                    { to: "/snigdha-add-invoice", label: "-- Add Invoice" },
                    { to: "/snigdha-view-invoice", label: "-- View Invoice" },
                    {
                      to: "/snigdha-product-payment-invoice",
                      label: "--Add Receipt For Invoice",
                    },
                    {
                      to: "/snigdha-ladger-report",
                      label: "-- Manage Ledger Report",
                    },
                  ],
                },
                {
                  name: "Inventory",
                  stateKey: "SNIInventory",
                  links: [
                    { to: "/snigdha-add-item", label: "-- Add Item" },
                    // { to: "/snigdha-add-product", label: "-- Add Product" },
                    {
                      to: "/snigdha-inventory-management",
                      label: "-- Inventory Management",
                    },
                  ],
                },
                {
                  name: "Reports",
                  stateKey: "SNIReports",
                  links: [
                    { to: "/snigdha-gst-report", label: "-- GST Report" },
                    { to: "/snigdha-profit-loss", label: "-- Profit & Loss" },
                    { to: "/snigdha-acctually-profit-loss", label: "--Acctual Profit & Loss" },
                    {
                      to: "/snigdha-inventory-report",
                      label: "-- Inventory Report",
                    },
                    {
                      to: "/snigdha-sales-report",
                      label: "-- Sales Report",
                    },
                    {
                      to: "/snigdha-pending-ledger-report",
                      label: "-- Pending Ledger Report",
                    },
                      
                    {
                      to: "/snigdha-master-ledger",
                      label: "-- Master Ledger Report",
                    },
                    {
                      to: "/snigdha-sell-list",
                      label: "-- All transfer report to mns ",
                    },
                  ],
                },
                // {
                //   name: "Selling",
                //   links: [
                //     { to: "/snigdha-add-client", label: "-- Add Client" },
                //     { to: "/snigdha-sell-product", label: "-- Seel Product " },

                //   ],
                // },
                {
                  name: "Purchase",
                  stateKey: "SNIPO",
                  links: [
                    {
                      to: "/snigdha-purchase-order",
                      label: "-- Create Purchase ",
                    },
                    {
                      to: "/snigdha-view-purchase-order",
                      label: "-- View All Purchase ",
                    },
                    {
                      to: "/add-purchase-payment-snigdha",
                      label: "-- Add Payment For Purchase ",
                    },
                    {
                      to: "/update-purchase-payment-snigdha",
                      label: "-- Update Payment For Purchase ",
                    },
                  ],
                },

                {
                  name: "Bank",
                  stateKey: "BankSnigdha",
                  links: [
                    {
                      to: "/imprest-fund-snigdha",
                      label: "-- Imprest Fund Or Petty Cash ",
                    },
                    {
                      to: "/add-bank-snigdha",
                      label: "-- Add Bank",
                    },
                    
                    {
                      to: "/withdraw-snigdha",
                      label: "-- Withdraw From Bank",
                    },
                    {
                      to: "/add-expense-snigdha",
                      label: "-- Add Expense ",
                    },
                    {
                      to: "/add-deposit-snigdha",
                      label: "-- Add Deposit",
                    },
                    {
                      to: "/add-note-snigdha",
                      label: "-- Add Note",
                    },
                    {
                      to: "/money-transfer-snigdha",
                      label: "-- Money Transfer",
                    },
                    {
                      to: "/manage-purchase-transaction-snigdha",
                      label: "-- Manage Purchase Transaction",
                    },
                    {
                      to: "/bank-statement-snigdha",
                      label: "-- Bank's Statement",
                    },
                  ],
                  component: <SnigdhaBankSidebarLinks />,
                },
              ],
            },
          ].map(
            ({ name, icon, links, subSections,component }) =>
              hasAccess(name) && (
                <div key={name}>
                  <div
                    className={`px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center justify-between ${
                      name === "MNS Billing" || name === "Snigdha Billing" ? "text-red-400 font-semibold" : "text-fuchsia-500 font-semibold"
                    }`}
                    onClick={() => toggleSection(name)}
                  >
                    <div className="flex items-center">
                      {icon}
                      {!isSidebarCollapsed && <span>{name}</span>}
                    </div>
                    {!isSidebarCollapsed &&
                      (openSections[name] ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      ))}
                  </div>
                  
                  {openSections[name] && !isSidebarCollapsed && (
                    <div className="ml-6">
                      {links &&
                        links.map(({ to, label }) => (
                          <Link
                            to={to}
                            key={to}
                            className="py-2 hover:text-gray-300"
                          >
                            <div className="py-2 hover:text-gray-300 cursor-pointer">
                              {label}
                            </div>
                          </Link>
                        ))}
                        {component && component}
                      {subSections &&
                        subSections.map(
                          ({ name: subName, stateKey, links: subLinks,component }) => (

                            <div key={subName}>
                              
                              <div
                                className="py-2 hover:text-gray-300 cursor-pointer flex justify-between text-green-400 font-medium"
                                onClick={() =>
                                  toggleSubSection(stateKey || subName)
                                }
                              >
                                <span>{`-- ${subName}`}</span>
                                {openSubSections[stateKey || subName] ? (
                                  <FaChevronUp />
                                ) : (
                                  <FaChevronDown />
                                )}
                              </div>
                              {component && component}
                              {openSubSections[stateKey || subName] && (
                                <div className="ml-6">
                                  
                                  {subLinks.map(({ to, label }) => (
                                    <Link
                                      to={to}
                                      key={to}
                                      className="py-2 hover:text-gray-300"
                                    >
                                      <div className="py-2 hover:text-gray-300 cursor-pointer">
                                        {label}
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        )}
                    </div>
                  )}
                </div>
              )
          )}

          {/* HRM Section */}
          {hasAccess("HRM") && (
            <div>
              <div
                className={`px-4 py-2 hover:bg-gray-700 cursor-pointer text-amber-400 font-semibold flex items-center  ${
                  isSidebarCollapsed ? "" : "justify-between"
                }`}
                onClick={() => toggleSection("HRM")}
              >
                <div className="flex items-center">
                  <FaUsers className="mr-2" />
                  {!isSidebarCollapsed && <span>HRM</span>}
                </div>
                {!isSidebarCollapsed &&
                  (openSections.HRM ? <FaChevronUp /> : <FaChevronDown />)}
              </div>
              {openSections.HRM && !isSidebarCollapsed && (
                <div className="ml-6">
                  {/* for direct staff  */}
                  {/* <div>
                  <div
                    className="py-2 hover:text-gray-300 cursor-pointer flex justify-between"
                    onClick={() => toggleSubSection("EmployeeManagement")}
                  >
                    <span>-- Employee Management</span>
                    {openSubSections.EmployeeManagement ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                 
                    {openSubSections.EmployeeManagement && (
                    <div className="ml-6">
                      
                      <Link
                        to="/employee-management"
                        className="py-2 hover:text-gray-300"
                      >
                        <div className="py-2 hover:text-gray-300 cursor-pointer">
                          -- Employee Management
                        </div>
                      </Link>
                    </div>
                  )}
                </div> */}

                  <Link
                    to="/employee-management"
                    className="py-2 hover:text-gray-300"
                  >
                    <div className="py-2 hover:text-gray-300 cursor-pointer">
                      -- Employee Management
                    </div>
                  </Link>

                  {/* for indirect staff  */}
                  {/* <div>
                  <div
                    className="py-2 hover:text-gray-300 cursor-pointer flex justify-between"
                    onClick={() => toggleSubSection("IndirectStaff")}
                  >
                    <span>-- Indirect Staff</span>
                    {openSubSections.IndirectStaff ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                  {openSubSections.IndirectStaff && (
                    <div className="ml-6">
                      <Link
                        to="/security-guard"
                        className="py-2 hover:text-gray-300"
                      >
                        <div className="py-2 hover:text-gray-300 cursor-pointer">
                          -- Security Guard
                        </div>
                      </Link>

                      <Link
                        to="/house-keeping"
                        className="py-2 hover:text-gray-300"
                      >
                        <div className="py-2 hover:text-gray-300 cursor-pointer">
                          -- House Keeping
                        </div>
                      </Link>

                      <Link
                        to="/casual-labor"
                        className="py-2 hover:text-gray-300"
                      >
                        <div className="py-2 hover:text-gray-300 cursor-pointer">
                          -- Casual Labor
                        </div>
                      </Link>
                    </div>
                  )}
                </div> */}

                  {/* for leave mangagement  */}
                  <div>
                    <div
                      className="py-2 hover:text-gray-300 cursor-pointer flex text-sky-500 font-medium justify-between"
                      onClick={() => toggleSubSection("LeaveManagement")}
                    >
                      <span>-- Leave Management </span>
                      {openSubSections.LeaveManagement ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </div>
                    {openSubSections.LeaveManagement && (
                      <div className="ml-6">
                        <Link
                          to="/apply-leave"
                          className="py-2 hover:text-gray-300"
                        >
                          <div className="py-2 hover:text-gray-300 cursor-pointer">
                            -- Apply Leave
                          </div>
                        </Link>

                        <Link
                          to="/approve-leave"
                          className="py-2 hover:text-gray-300"
                        >
                          <div className="py-2 hover:text-gray-300 cursor-pointer">
                            -- Approve Leave
                          </div>
                        </Link>

                        <Link
                          to="/leave-report"
                          className="py-2 hover:text-gray-300"
                        >
                          <div className="py-2 hover:text-gray-300 cursor-pointer">
                            -- Leave Report
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* for Attendance  */}
                  <div>
                    <div
                      className="py-2 hover:text-gray-300 cursor-pointer text-sky-500 font-medium flex justify-between"
                      onClick={() => toggleSubSection("Attendance")}
                    >
                      <span>-- Attendance </span>
                      {openSubSections.Attendance ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </div>
                    {openSubSections.Attendance && (
                      <div className="ml-6">
                        <Link
                          to="/mark-attendance"
                          className="py-2 hover:text-gray-300"
                        >
                          <div className="py-2 hover:text-gray-300 cursor-pointer">
                            -- Mark Attendance
                          </div>
                        </Link>

                        <Link
                          to="/attendance-report"
                          className="py-2 hover:text-gray-300"
                        >
                          <div className="py-2 hover:text-gray-300 cursor-pointer">
                            -- Attendance Report
                          </div>
                        </Link>

                        <Link
                          to="/employee-shift-management"
                          className="py-2 hover:text-gray-300"
                        >
                          <div className="py-2 hover:text-gray-300 cursor-pointer">
                            -- Shift Management
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* for attendance with rfid */}

                  <div>
                    <div
                      className="py-2 hover:text-gray-300 cursor-pointer text-sky-500 font-medium flex justify-between"
                      onClick={() => toggleSubSection("RFIDAttendance")}
                    >
                      <span>--RFID Attendance </span>
                      {openSubSections.RFIDAttendance ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </div>
                    {openSubSections.RFIDAttendance && (
                      <div className="ml-6">
                        <Link
                          to="/rfid-register-employee"
                          className="py-2 hover:text-gray-300"
                        >
                          <div className="py-2 hover:text-gray-300 cursor-pointer">
                            -- Register Employee
                          </div>
                        </Link>

                        <Link
                          to="/rfid-attendance-report"
                          className="py-2 hover:text-gray-300"
                        >
                          <div className="py-2 hover:text-gray-300 cursor-pointer">
                            -- Attendance Report
                          </div>
                        </Link>

                        <Link
                          to="/rfid-today-attendance"
                          className="py-2 hover:text-gray-300"
                        >
                          <div className="py-2 hover:text-gray-300 cursor-pointer">
                            -- Today's Attendance
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* for payroll management  */}
                  <div>
                    <div
                      className="py-2 hover:text-gray-300 cursor-pointer text-sky-500 font-medium flex justify-between"
                      onClick={() => toggleSubSection("PayrollManagement")}
                    >
                      <span>-- Payroll Management </span>
                      {openSubSections.PayrollManagement ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </div>
                    {openSubSections.PayrollManagement && (
                      <div className="ml-6">
                        <Link
                          to="/create-salary"
                          className="py-2 hover:text-gray-300"
                        >
                          <div className="py-2 hover:text-gray-300 cursor-pointer">
                            -- Create Salary
                          </div>
                        </Link>

                        {/* <Link
                        to="/view-salary"
                        className="py-2 hover:text-gray-300"
                      >
                        <div className="py-2 hover:text-gray-300 cursor-pointer">
                          -- View Salary
                        </div>
                      </Link> */}

                        {/* <Link
                        to="/manage-deductions"
                        className="py-2 hover:text-gray-300"
                      >
                        <div className="py-2 hover:text-gray-300 cursor-pointer">
                          --  Manage Deductions
                        </div>
                      </Link>

                      <Link
                        to="/process-bonuses"
                        className="py-2 hover:text-gray-300"
                      >
                        <div className="py-2 hover:text-gray-300 cursor-pointer">
                          --  Process Bonuses
                        </div>
                      </Link>

                      <Link
                        to="/tax-calculation"
                        className="py-2 hover:text-gray-300"
                      >
                        <div className="py-2 hover:text-gray-300 cursor-pointer">
                          --  Tax Calculation
                        </div>
                      </Link> */}

                        <Link
                          to="/salary-slip"
                          className="py-2 hover:text-gray-300"
                        >
                          <div className="py-2 hover:text-gray-300 cursor-pointer">
                            -- Salary Slip
                          </div>
                        </Link>
                        {/* <Link
                        to="/view-salary-history"
                        className="py-2 hover:text-gray-300"
                      >
                        <div className="py-2 hover:text-gray-300 cursor-pointer">
                          --  View Salary History
                        </div>
                      </Link> */}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Operation Section */}
          {hasAccess("Operation") && (
            <div>
              <div
                className={`px-4 py-2 hover:bg-gray-700 cursor-pointer text-pink-500 font-semibold flex items-center  ${
                  isSidebarCollapsed ? "" : "justify-between"
                }`}
                onClick={() => toggleSection("Operation")}
              >
                <div className="flex items-center">
                  <SiMockserviceworker className="mr-2" />
                  {!isSidebarCollapsed && <span>Operation</span>}
                </div>
                {!isSidebarCollapsed &&
                  (openSections.Operation ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  ))}
              </div>
              {openSections.Operation && !isSidebarCollapsed && (
                <div className="ml-6">
                  {/* <Link to="/admin" className="py-2 hover:text-gray-300">
                  <div className="py-2 hover:text-gray-300 cursor-pointer">
                    -- Admin
                  </div>
                </Link> */}
                  <Link to="/resource" className="py-2 hover:text-gray-300">
                    <div className="py-2 hover:text-gray-300 cursor-pointer">
                      -- Resource
                    </div>
                  </Link>

                  <Link
                    to="/task-management"
                    className="py-2 hover:text-gray-300"
                  >
                    <div className="py-2 hover:text-gray-300 cursor-pointer">
                      -- Task Management
                    </div>
                  </Link>

                  <Link to="/add-project" className="py-2 hover:text-gray-300">
                    <div className="py-2 hover:text-gray-300 cursor-pointer">
                      -- Project Management
                    </div>
                  </Link>

                  <Link
                    to="/recruitment-training"
                    className="py-2 hover:text-gray-300"
                  >
                    <div className="py-2 hover:text-gray-300 cursor-pointer">
                      -- Recruitment & Training
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Settings */}
          {hasAccess("Setting") && (
            <div>
              <div
                className={`px-4 py-2 hover:bg-gray-700 cursor-pointer text-green-500 font-medium flex items-center  ${
                  isSidebarCollapsed ? "" : "justify-between"
                }`}
                onClick={() => toggleSection("Setting")}
              >
                <div className="flex items-center">
                  <FaCog className="mr-2" />
                  {!isSidebarCollapsed && <span>Settings</span>}
                </div>
                {!isSidebarCollapsed &&
                  (openSections.Setting ? <FaChevronUp /> : <FaChevronDown />)}
              </div>
              {openSections.Setting && !isSidebarCollapsed && (
                <div className="ml-6">

                  <Link to="/set-units" className="py-2 hover:text-gray-300">
                    <div className="py-2 hover:text-gray-300 cursor-pointer">
                      -- Add Units
                    </div>
                  </Link>

                  

                  <Link to="/add-groups" className="py-2 hover:text-gray-300">
                    <div className="py-2 hover:text-gray-300 cursor-pointer">
                      -- Add Groups
                    </div>
                  </Link>

                  <Link to="/all-users" className="py-2 hover:text-gray-300">
                    <div className="py-2 hover:text-gray-300 cursor-pointer">
                      -- All User
                    </div>
                  </Link>

                  <Link to="/add-dummy-slip" className="py-2 hover:text-gray-300">
                    <div className="py-2 hover:text-gray-300 cursor-pointer">
                      -- Create Dummy Slip
                    </div>
                  </Link>

                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        } transition-all`}
      >
        <Header />
        <main className="flex-1 bg-gray-100 p-4 flex-grow ">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LayoutComponent;
