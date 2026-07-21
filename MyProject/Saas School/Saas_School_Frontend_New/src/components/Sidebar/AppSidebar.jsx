import NavMain from "./NavMain";
import TeamSwitcher from "./TeamSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import { FaWpforms } from "react-icons/fa";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import SchoolIcon from "@mui/icons-material/School";
import { AiOutlineSchedule } from "react-icons/ai";
import { LuBookOpenCheck } from "react-icons/lu";
import { FaRegAddressCard,FaMoneyBillTransfer } from "react-icons/fa6";
import GradingIcon from "@mui/icons-material/Grading";
import { MdOutlineSettingsSuggest, MdAccountBalance } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { IoLibrary } from "react-icons/io5";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useSelector } from "react-redux";
import { useTheme } from "@/context/ThemeContext";
import { PiCertificateBold } from "react-icons/pi";
import  {  useState } from "react";
import "./sidebar-custom.css";
import { LucideBookOpenCheck, MessageSquare } from "lucide-react";
import { MdAssignmentAdd } from "react-icons/md";
import Audit from "@/components/ForAudit/Audit";
import { FcFaq } from "react-icons/fc";



const AppSidebar = ({ ...props }) => {
  const role = useSelector((state) => state.auth.user);
  // console.log("role : ", role);
  const { theme } = useTheme();
  // console.log("theme : ", theme);
  const [isAuditOpen, setIsAuditOpen] = useState(false);


  const data = {
    navMain: [
      // dashboard
      {
        title: "Dashboard",
        url: "/",
        icon: DashboardIcon,
        isActive: true,
      },
      {
        title: "Cross Billing",
        url: "/billing",
        icon: FaMoneyBillTransfer,
      }, 
      // admission
      {
        title: "Admission",
        url: "/admission",
        icon: FaWpforms,
      },
      // teacher info
      {
        title: "Teacher Info",
        url: "/add-teacher",
        icon: PeopleIcon,
        items: [
          {
            title: "Add Teacher ",
            url: "/add-teacher",
          },
          {
            title: "Manage Teacher ",
            url: "/manage-teacher",
          },
        ],
      },
      // edp
      {
        title: "Edp",
        url: "/add-edp",
        icon: RiAdminFill,
        items: [
          {
            title: "Add Edp ",
            url: "/add-edp",
          },
          {
            title: "Manage Edp ",
            url: "/manage-edp",
          },
        ],
      },
      // accountant
      {
        title: "Accountant",
        url: "/manage-accountant",
        icon: RiAdminFill,
        items: [
          {
            title: "Add Accountant ",
            url: "/add-accountant",
          },
          {
            title: "Manage Accountant ",
            url: "/manage-accountant",
          },
        ],
      },
      // Librarian
      {
        title: "Librarian",
        url: "/add-librarian",
        icon: RiAdminFill,
        items: [
          {
            title: "Add Librarian ",
            url: "/add-librarian",
          },
          {
            title: "Manage Librarian ",
            url: "/manage-librarian",
          },
        ],
      },

      // accounts
      {
        title: "Accounts",
        url: "/income",
        icon: MdAccountBalance,
        items: [
          // {
          //   title: "Add Account Information",
          //   url: "/add-account",
          // },
          
          {
            title: "Income",
            url: "/income",
          },
          {
            title: "Expense",
            url: "/expense",
          },
          {
            title: "Student Fees Collection",
            url: "/student-fees-collection",
          },
          {
            title: "Tuition Fees Collection",
            url: "/tuition-fees-collection",
          },
          {
            title: "Bank Transaction",
            url: "/bank-transaction",
          },
          {
            title: "Report",
            url: "/report",
          },
        ],
      },
      // fees
      {
        title: "Fees",
        url: "/tuition-fees",
        icon: CurrencyRupeeIcon,
        items: [
          {
            title: "Tuition Fees",
            url: "/tuition-fees",
          },
          // {
          //   title: "Library Late Fees",
          //   url: "/library-late-fees",
          // },
          // {
          //   title: "Absent Fees",
          //   url: "/absent-fees",
          // },
        
          {
            title: "Add Student Fees",
            url: "/add-student-fees",
          },
          {
            title: "Service Fees",
            url: "/service-fees",
          },
        ],
      },
      // student info
      {
        title: "Student Info",
        url: "/student",
        icon: ContactEmergencyIcon,
        items: [
          {
            title: "Upload Student ",
            url: "/upload-student",
          },
          {
            title: "Student Information",
            url: "/student",
          },
          {
            title: "Guardian Information",
            url: "/guardian",
          },
          {
            title: "Promote Student",
            url: "/promote-student",
          },
        ],
      },
      // academic
      {
        title: "Academic",
        url: "#",
        icon: SchoolIcon,
        items: [
          {
            title: "Class",
            url: "/academic/class",
          },
          {
            title: "Section",
            url: "/academic/section",
          },
          {
            title: "Subject",
            url: "/academic/subject",
          },
          {
            title: "Subject Assign",
            url: "/academic/subject-assign",
          },
          {
            title: "Class Room",
            url: "/academic/class-room",
          },
        ],
      },

      {
        title: "Assignment",
        url: "#",
        icon: MdAssignmentAdd,
        items: [
          {
            title: "Add Assignment",
            url: "/add-assignment",
          },
          {
            title: "View Assignment",
            url: "/student-assignment",
          },
        ]
      },

      // rouutines
      {
        title: "Routines",
        url: "/class-times",
        icon: AiOutlineSchedule,
        items: [
          {
            title: "Class Time",
            url: "/class-times",
          },
          {
            title: "Class Routines",
            url: "/class-routines",
          },
          {
            title: "Exam Routines",
            url: "/exam-routines",
          },
          {
            title: "Exam Type",
            url: "/exam-types",
          },
        ],
      },
      // library
      {
        title: "Library",
        url: "/add-book-category",
        icon: IoLibrary,
        items: [
          {
            title: "Add Book Category ",
            url: "/add-book-category",
          },
          {
            title: "Add Book ",
            url: "/add-book",
          },
          {
            title: "Issue Book ",
            url: "/issue-book",
          },
          {
            title: "Return Book ",
            url: "/return-book",
          },
          {
            title: "View Issued Book ",
            url: "/view-issued-books",
          },
        ],
      },
      // attendance
      {
        title: "Attendance",
        url: "/mark-attendance",
        icon: LuBookOpenCheck,
        items: [
          // {
          //   title: "Attendance",
          //   url: "/attendance",
          // },
          {
            title: "Mark Attendance",
            url: "/mark-attendance",
          },
          {
            title: "Attendance Report",
            url: "/attendance-report",
          },
        ],
      },
      // card
      {
        title: "Card",
        url: "/id-card",
        icon: FaRegAddressCard,
        items: [
          {
            title: "Id Card",
            url: "/id-card",
          },
          {
            title: "Admit Card",
            url: "/admit-card",
          },
        ],
      },
      // result
      {
        title: "Result",
        url: "/grade-system",
        icon: GradingIcon,
        items: [
          {
            title: "Grade System",
            url: "/grade-system",
          },
          {
            title: "Set Marks",
            url: "/set-marks",
          },
          {
            title: "Mark Register",
            url: "/mark-register",
          },
          // {
          //   title: "Project's Marks",
          //   url: "/add-project",
          // },
          {
            title: "Additional Subject Mark Register",
            url: "/additional-subject-mark-register",
          },
          {
            title: "View Marks",
            url: "/view-marks",
          },
          {
            title: "Marksheet",
            url: "/marksheet",
          },
          {
            title: "Set Result Date",
            url: "/set-result-date",
          },
        ],
      },

      // for studen history for payment and academic year and class
      {
        title: "History",
        url: "#",
        icon: LucideBookOpenCheck,
        items: [
          {
            title: "Payment History",
            url: "/payment-history",
          }, 
          {
            title: "Previous Due",
            url: "/previous-due",
          }, 
          {
            title: "Promotion History",
            url: "/promotion-history",
          }, 
        ]
      },



      // for tc only
      {
        title: "TC",
        url: "#",
        icon: PiCertificateBold,
        items: [
          {
            title: "Apply For TC",
            url: "/apply-tc",
          },
          {
            title: "View all TC Application",
            url: "/view-all-tc",
          },
         
        ],
      },
      // for diary only
      {
        title: "Social Feed",
        url: "/posts",
        icon: MessageSquare,
      },

      // setting
      {
        title: "Settings",
        url: "#",
        icon: MdOutlineSettingsSuggest,
        items: [
          {
            title: "Genders",
            url: "/genders",
          },
          {
            title: "Religions",
            url: "/religions",
          },
          {
            title: "Blood Groups",
            url: "/blood-groups",
          },
          {
            title: "Add Service",
            url: "/add-service",
          },
          {
            title: "School Information",
            url: "/school-information",
          },
        ],
      },

      // Faq 
      {
        title: "FAQ",
        url: "/faq",
        icon: FcFaq,
        items: [
          {
            title: "Faq",
            url: "/faq",
          },
          
        ],
      },
    ],
  };

  if (role === "admin" || role === "edp") {
    data.navMain.push({
      render: (
        <button
          onClick={() => setIsAuditOpen(true)}
          className="w-full text-left px-4 py-2 my-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold shadow hover:from-purple-600 hover:to-pink-500 transition flex items-center gap-[12px]"
          style={{ outline: "none", border: "none" }}
        >
          Audit
        </button>
      ),
      isCustom: true
    });
  }
  const filteredNavMain =
  role === "vais" || role === "admin"
    ? data.navMain // Show all sections for "hm"
    : role === "edp"
    ? data.navMain.filter((item) => item.title !== "Edp") // Exclude "Edp" for "edp"
    : role === "teacher"
    ? data.navMain.filter((item) =>
        ["Dashboard", "Student Info", "Attendance","Assignment", "Result", "Routines", "Academic","Social Feed" ,"Settings"].includes(item.title)
      ).map(item => {
        // For "Student Info", only show specific sub-items for teachers
        if (item.title === "Student Info") {
          return {
            ...item,
            items: item.items.filter(subItem => 
              ["Student Information", "Guardian Information"].includes(subItem.title)
            )
          };
        }
        else if(item.title ==="Settings"){
          return {
            ...item,
            items: item.items.filter(subItem =>
              [ "School Information"].includes(subItem.title)
            )
          }; 
        }
        else if(item.title ==="Assignment"){
          return {
            ...item,
            items: item.items.filter(subItem =>
              [ "Add Assignment"].includes(subItem.title)
            )
          }; 
        }
        else if(item.title ==="Academic"){
          return {
            ...item,
            items: item.items.filter(subItem =>
              !["Subject Assign"].includes(subItem.title)
            )
          }; 
        }
        return item;
      })  
    : role === "student"
    ? data.navMain.filter((item) =>
        ["Dashboard", "Routines","Academic","Assignment","TC","History","Result","Social Feed"].includes(item.title)
      ).map(item => {
        // For "Student Info", only show specific sub-items for students
        if (item.title === "Routines") {
          return {
            ...item,
            items: item.items.filter(subItem =>
              ["Class Time","Exam Type"].includes(subItem.title)
            )
          };
        }

        if (item.title === "Academic") {
          return {
            ...item,
            items: item.items.filter(subItem =>
              ["Class Room"].includes(subItem.title)
            )
          };
        }
        if (item.title === "Assignment") {
          return {
           ...item,
            items: item.items.filter(subItem =>
              ["View Assignment"].includes(subItem.title)
            )
          };
        }
        if (item.title === "Result") {
          return {
            ...item,
            items: item.items.filter(subItem =>
              ["Grade System","Marksheet"].includes(subItem.title)
            )
          };
        }
        if (item.title === "TC") {
          return {
            ...item,
            items: item.items.filter(subItem =>
              ["Apply For TC"].includes(subItem.title)
            )
          };
        }
        return item;
      })
    : role === "librarian"
    ? data.navMain.filter((item) =>
        ["Dashboard", "Library","Social Feed"].includes(item.title)
      )
    : role === "accountant"
    ? data.navMain.filter((item) =>
        ["Dashboard", "Accounts","Settings","Social Feed"].includes(item.title)
      ).map(item =>{
        if(item.title === "Settings"){
          return {
            ...item,
            items: item.items.filter(subItem =>
              ["School Information"].includes(subItem.title)
            )
          };
        }
        return item;
      })
    : [];
 

     // Custom handler for nav item clicks
  const handleNavClick = (item) => {
    if (item.title === "Audit" && item.onClick) {
      item.onClick();
    } else if (item.url) {
      window.location.href = item.url;
    }
  };
    // console.log("from app sidebar:" ,filteredNavMain);


  // items={data.navMain}

  return (
    <>
    <Sidebar 
      className={`sidebar-custom ${theme === "light" ? "sidebar-light" : "sidebar-dark"}`} 
      collapsible="icon" 
      {...props} 
    >
      <SidebarHeader
       
       >
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent
       className={`${theme === "light" ? "" : " text-[#6b289e]"}`}
       >
        <NavMain items={filteredNavMain} onItemClick={handleNavClick} />
      </SidebarContent>

      <SidebarRail 
      // className={`${theme === "light" ? "" : "bg-purple-900 text-white"}`} 
      />
    </Sidebar>
    {isAuditOpen && (
      <Audit onClose={() => setIsAuditOpen(false)} />
    )}
    </>
  );
};

export default AppSidebar;
