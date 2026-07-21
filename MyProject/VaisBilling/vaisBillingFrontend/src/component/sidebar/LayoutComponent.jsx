
import { useState, useEffect } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaCog,
  FaUsers,
  FaFileInvoice,
  FaTasks,
  FaHome,
  FaBoxOpen,
  FaChartLine,
  FaShoppingCart,
  FaMoneyBillWave,
  FaReceipt,
  FaClipboardList,
  FaExchangeAlt,
  FaStore,
  FaFileAlt,
  FaRupeeSign,
} from "react-icons/fa";
import { SiMockserviceworker } from "react-icons/si";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import { BsBank2 } from "react-icons/bs";
import { MdAccountBalance, MdOutlineInventory2 } from "react-icons/md";
import { BiTransfer } from "react-icons/bi";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { Link, Outlet, useLocation } from "react-router-dom"; 
// import mns from "../../assets/mns.jpg";
import ganita from "../../assets/ganita.png"
import { useSelector } from "react-redux";
import { RiBillFill } from "react-icons/ri";
import BankSidebarLinks from "../../components/BankSidebarLinks";
import SnigdhaBankSidebarLinks from "../../components/SnigdhaBankSidebarLinks";
import { IndianRupee } from "lucide-react";

const LayoutComponent = () => {
  const userRole = useSelector((state) => state?.auth?.user);
  const location = useLocation();

  // console.log("role from side bar : ", role);

  const hasAccess = (section) => {
    if (userRole === "admin") return true;

    switch (section) {
      case "CRM":
        return userRole === "crm" || userRole === "admin" || userRole === "billing" || userRole === "mnsBilling";
      case "Snigdha CRM":
        return (
          userRole === "snigdhaCrm" ||
          userRole === "admin" ||
          userRole === "snigdhaBilling"
        );
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
    SnigdhaCRM: false,
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

  // Auto-expand section based on current route
  useEffect(() => {
    const path = location.pathname;
    
    // Logic to determine which section should be open based on the current path
    if (path.includes('add-customer') || path.includes('client-list') || path.includes('add-vendor')) {
      setOpenSections(prev => ({ ...prev, CRM: true }));
    } else if (path.includes('add-invoice') || path.includes('inventory') || path.includes('purchase')) {
      setOpenSections(prev => ({ ...prev, Billing: true }));
    } else if (path.includes('set-units') || path.includes('add-groups') || path.includes('all-users')) {
      setOpenSections(prev => ({ ...prev, Setting: true }));
    }
  }, [location]);

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

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`flex flex-col bg-gradient-to-b from-slate-800 to-teal-900 text-white h-full fixed top-0 left-0 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        } transition-all duration-300 shadow-xl z-50`}
      >
        {/* Sidebar Toggle Button */}
        <div className="flex items-center justify-between p-4 border-b border-teal-800 bg-slate-800">
          {!isSidebarCollapsed && (
            <img src={ganita} alt="logo" className="w-36 h-12 rounded-md shadow-md" />
            // <p>Ganita360</p>
          )}
          <button
            className="text-xl focus:outline-none cursor-pointer hover:text-teal-300 transition-colors duration-200"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            {isSidebarCollapsed ? (
              <TbLayoutSidebarRightCollapse className="text-2xl" />
            ) : (
              <TbLayoutSidebarLeftCollapse className="text-2xl" />
            )}
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Dashboard */}
          <Link to="/" className="block">
            <div className={`px-4 py-3 cursor-pointer flex items-center transition-all duration-200 ${isActive('/') ? 'bg-slate-700 border-l-4 border-teal-400' : 'hover:bg-slate-700 hover:border-l-4 hover:border-teal-500'}`}>
              <FaHome className={`${isSidebarCollapsed ? 'text-2xl mx-auto' : 'mr-3'} text-teal-400`} />
              {!isSidebarCollapsed && <span className="font-semibold text-lg">Dashboard</span>}
            </div>
          </Link>

         
          {/* Sections */}
          {[
            {
              name: "CRM",
              icon: <FaUsers className={`${isSidebarCollapsed ? 'text-2xl mx-auto' : 'mr-3'} text-cyan-300`} />,
              links: [
                { to: "/add-customer", label: "Customer Management" },
                { to: "/client-list", label: "Client List" },
                { to: "/add-vendor", label: "Vendor Management" },
              ],
            },
          
            
            // Billing section
            {
              name: "Billing",
              icon: <RiBillFill className={`${isSidebarCollapsed ? 'text-2xl mx-auto' : 'mr-3'} text-amber-300`} />,
              subSections: [
                {
                  name: "Invoice",
                  icon: <FaFileInvoice className="text-teal-300 mr-2" />,
                  stateKey: "SNIInvoice",
                  links: [
                    { to: "/add-invoice", label: "Add Invoice" },
                    { to: "/view-invoice", label: "View Invoice" },
                    { to: "/view-service-invoice", label: "View Service Invoice" },
                    { to: "/view-proforma-invoice", label: "View Proforma Invoice" },
                  ],
                },
                {
                  name: "Product Receipt Invoice",
                  icon: <FaRupeeSign className="text-cyan-300 mr-2" />,
                  links: [
                   {
                      to: "/product-payment-invoice",
                      label: "Add Receipt For Invoice",
                    },
                    {
                      to: "/ladger-report",
                      label: "Manage Ledger Report",
                    },
                  ],
                },
                {
                  name: "Service Receipt Invoice",
                  icon: <IndianRupee className="text-amber-300 mr-2 w-4 h-4" />,
                  links: [
                    {
                      to: "/add-service-receipt",
                      label: "Add Service Receipt Invoice ",
                    },
                    {
                      to: "/update-service-receipt",
                      label: "Update Service Receipt Invoice  ",
                    },
                  ],
                },
                {
                  name: "Inventory",
                  icon: <MdOutlineInventory2 className="text-blue-400 mr-2" />,
                  stateKey: "SNIInventory",
                  links: [
                    { to: "/add-item", label: "Add Item" },
                    // { to: "/add-product", label: "Add Product" },
                    {
                      to: "/inventory-management",
                      label: "Inventory Management",
                    },
                  ],
                },
                {
                  name: "Reports",
                  icon: <FaChartLine className="text-orange-300 mr-2" />,
                  stateKey: "SNIReports",
                  links: [
                    { to: "/gst-report", label: "GST Report" },
                  
                    // { to: "/acctually-profit-loss", label: "Acctual Profit & Loss" },
                    {
                      to: "/inventory-report",
                      label: "Inventory Report",
                    },
                    {
                      to: "/sales-report",
                      label: "Sales Report",
                    },
                    {
                      to: "/pending-ledger-report",
                      label: "Pending Ledger Report",
                    },
                      
                    {
                      to: "/master-ledger",
                      label: "Master Ledger Report",
                    },
                    {
                      to: "/purchase-report",
                      label: "Purchase Report",
                    },
                    {
                      to: "/profit-report",
                      label: "Profit Report",
                    },
                      { to: "/profit-loss", label: "Transaction Report" },
                    // {
                    //   to: "/sell-list",
                    //   label: "All transfer report to mns ",
                    // },
                  ],
                },
                
                {
                  name: "Purchase",
                  icon: <FaShoppingCart className="text-amber-300 mr-2" />,
                  stateKey: "SNIPO",
                  links: [
                    {
                      to: "/purchase-order",
                      label: "Create Purchase ",
                    },
                    {
                      to: "/view-purchase-order",
                      label: "View All Purchase ",
                    },
                    {
                      to: "/add-purchase-payment",
                      label: "Add Payment For Purchase ",
                    },
                    {
                      to: "/update-purchase-payment",
                      label: "Update Payment For Purchase ",
                    },
                  ],
                },

                {
                  name: "Bank",
                  icon: <BsBank2 className="text-teal-300 mr-2" />,
                  stateKey: "BankSnigdha",
                  links: [
                    {
                      to: "/imprest-fund",
                      label: "Imprest Fund Or Petty Cash ",
                    },
                    {
                      to: "/add-bank",
                      label: "Add Bank",
                    },
                    
                    {
                      to: "/withdraw",
                      label: "Withdraw From Bank",
                    },
                    {
                      to: "/add-expense",
                      label: "Add Expense ",
                    },
                    {
                      to: "/add-deposit",
                      label: "Add Deposit",
                    },
                    {
                      to: "/add-note",
                      label: "Add Note",
                    },
                    {
                      to: "/money-transfer",
                      label: "Contra",
                    },
                    {
                      to: "/manage-purchase-transaction",
                      label: "Manage Purchase Transaction",
                    },
                    {
                      to: "/bank-statement",
                      label: "Bank's Statement",
                    },
                  ],
                 
                },
              ],
              component: <SnigdhaBankSidebarLinks />,
            },
          ].map(
            ({ name, icon, links, subSections, component }) =>
              hasAccess(name) && (
                <div key={name} className="mb-1">
                  <div
                    className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-all duration-200 ${openSections[name] ? 'bg-slate-700' : 'hover:bg-slate-700'}`}
                    onClick={() => toggleSection(name)}
                  >
                    <div className="flex items-center">
                      {icon}
                      {!isSidebarCollapsed && <span className="font-semibold">{name}</span>}
                    </div>
                    {!isSidebarCollapsed &&
                      (openSections[name] ? (
                        <FaChevronUp className="text-teal-300" />
                      ) : (
                        <FaChevronDown className="text-teal-300" />
                      ))}
                  </div>
                  
                  {openSections[name] && !isSidebarCollapsed && (
                    <div className="bg-slate-700 bg-opacity-50 py-1">
                      {links &&
                        links.map(({ to, label }) => (
                          <Link
                            to={to}
                            key={to}
                          >
                            <div className={`pl-8 pr-4 py-2 cursor-pointer transition-all duration-200 ${isActive(to) ? 'bg-slate-600 border-l-2 border-teal-400' : 'hover:bg-slate-600'} flex items-center`}>
                              <div className="w-2 h-2 rounded-full bg-teal-400 mr-2"></div>
                              <span>{label}</span>
                            </div>
                          </Link>
                        ))}
                        {component && component}
                      {subSections &&
                        subSections.map(
                          ({ name: subName, icon: subIcon, stateKey, links: subLinks, component }) => (

                            <div key={subName} className="mt-1">
                              
                              <div
                                className={`pl-6 pr-4 py-2 cursor-pointer flex justify-between items-center ${openSubSections[stateKey || subName] ? 'bg-slate-500' : 'hover:bg-slate-600'} transition-all duration-200`}
                                onClick={() =>
                                  toggleSubSection(stateKey || subName)
                                }
                              >
                                <span className="text-teal-300 font-medium flex items-center">
                                  {subIcon || <div className="w-2 h-2 rounded-full bg-teal-300 mr-2"></div>}
                                  {subName}
                                </span>
                                {openSubSections[stateKey || subName] ? (
                                  <FaChevronUp className="text-teal-300 text-xs" />
                                ) : (
                                  <FaChevronDown className="text-teal-300 text-xs" />
                                )}
                              </div>
                              {component && component}
                              {openSubSections[stateKey || subName] && (
                                <div className="bg-slate-800 bg-opacity-50">
                                  
                                  {subLinks.map(({ to, label }) => (
                                    <Link
                                      to={to}
                                      key={to}
                                    >
                                      <div className={`pl-10 pr-4 py-2 cursor-pointer transition-all duration-200 ${isActive(to) ? 'bg-slate-700 border-l-2 border-teal-300' : 'hover:bg-slate-700'} flex items-center`}>
                                        <div className="w-1 h-1 rounded-full bg-teal-200 mr-2"></div>
                                        <span className="text-sm">{label}</span>
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



          {/* Settings */}
          {hasAccess("Setting") && (
            <div className="mb-1">
              <div
                className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-all duration-200 ${openSections.Setting ? 'bg-slate-700' : 'hover:bg-slate-700'}`}
                onClick={() => toggleSection("Setting")}
              >
                <div className="flex items-center">
                  <FaCog className={`${isSidebarCollapsed ? 'text-2xl mx-auto' : 'mr-3'} text-teal-300`} />
                  {!isSidebarCollapsed && <span className="font-semibold">Settings</span>}
                </div>
                {!isSidebarCollapsed &&
                  (openSections.Setting ? <FaChevronUp className="text-teal-300" /> : <FaChevronDown className="text-teal-300" />)}
              </div>
              {openSections.Setting && !isSidebarCollapsed && (
                <div className="bg-slate-700 bg-opacity-50 py-1">

                  <Link to="/set-units">
                    <div className={`pl-8 pr-4 py-2 cursor-pointer transition-all duration-200 ${isActive('/set-units') ? 'bg-slate-600 border-l-2 border-teal-300' : 'hover:bg-slate-600'} flex items-center`}>
                      <div className="w-2 h-2 rounded-full bg-teal-300 mr-2"></div>
                      <span>Add Units</span>
                    </div>
                  </Link>

                  <Link to="/add-groups">
                    <div className={`pl-8 pr-4 py-2 cursor-pointer transition-all duration-200 ${isActive('/add-groups') ? 'bg-slate-600 border-l-2 border-teal-300' : 'hover:bg-slate-600'} flex items-center`}>
                      <div className="w-2 h-2 rounded-full bg-teal-300 mr-2"></div>
                      <span>Add Groups</span>
                    </div>
                  </Link>

                  <Link to="/all-users">
                    <div className={`pl-8 pr-4 py-2 cursor-pointer transition-all duration-200 ${isActive('/all-users') ? 'bg-slate-600 border-l-2 border-teal-300' : 'hover:bg-slate-600'} flex items-center`}>
                      <div className="w-2 h-2 rounded-full bg-teal-300 mr-2"></div>
                      <span>All Users</span>
                    </div>
                  </Link>

                  <Link to="/add-dummy-slip">
                    <div className={`pl-8 pr-4 py-2 cursor-pointer transition-all duration-200 ${isActive('/add-dummy-slip') ? 'bg-slate-600 border-l-2 border-teal-300' : 'hover:bg-slate-600'} flex items-center`}>
                      <div className="w-2 h-2 rounded-full bg-teal-300 mr-2"></div>
                      <span>Create Dummy Slip</span>
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
        } transition-all duration-300`}
      >
        <Header />
        <main className="flex-1 bg-gray-50 p-4 flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

// Add this CSS to your global CSS file or create a style tag in your component
// .custom-scrollbar::-webkit-scrollbar {
//   width: 6px;
// }
// .custom-scrollbar::-webkit-scrollbar-track {
//   background: #1e1e2d;
// }
// .custom-scrollbar::-webkit-scrollbar-thumb {
//   background-color: #4f46e5;
//   border-radius: 20px;
// }

export default LayoutComponent;
