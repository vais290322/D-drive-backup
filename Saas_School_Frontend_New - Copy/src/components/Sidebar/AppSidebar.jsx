import React from "react";
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
import { FaRegAddressCard } from "react-icons/fa6";
import GradingIcon from "@mui/icons-material/Grading";
import { MdOutlineSettingsSuggest, MdAccountBalance } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { IoLibrary } from "react-icons/io5";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useSelector } from "react-redux";
import { useTheme } from "@/context/ThemeContext";

const AppSidebar = ({ ...props }) => {
  const role = useSelector((state) => state.auth.user);
  // console.log("role : ", role);
  // const { theme } = useTheme();
  // console.log("theme : ", theme);
  const data = {
    navMain: [
      // dashboard
      {
        title: "Dashboard",
        url: "/",
        icon: DashboardIcon,
        isActive: true,
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
      // edp
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
            title: "Tuation Fees",
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
          // {
          //   title: "Late Fees Payment",
          //   url: "/late-fees-payment",
          // },
          {
            title: "Add Student Fees",
            url: "/add-student-fees",
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
            title: "Student Information",
            url: "/student",
          },
          {
            title: "Guardian Information",
            url: "/guardian",
          },
        ],
      },
      // academic
      {
        title: "Academic",
        url: "/academic/class",
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
      // rouutines
      {
        title: "Routines",
        url: "/class-times",
        icon: AiOutlineSchedule,
        items: [
          {
            title: "Class Time ",
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
            title: "Mark Register",
            url: "/mark-register",
          },
          // {
          //   title: "Marksheet",
          //   url: "/marksheet",
          // },
          {
            title: "View Marks",
            url: "/view-marks",
          },
        ],
      },
      // setting
      {
        title: "Settings",
        url: "/genders",
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
            title: "School Information",
            url: "/school-information",
          },
        ],
      },
    ],
  };

  const filteredNavMain =
  role === "vais" || role === "admin"
    ? data.navMain // Show all sections for "hm"
    : role === "edp"
    ? data.navMain.filter((item) => item.title !== "Edp") // Exclude "Edp" for "edp"
    : role === "teacher"
    ? data.navMain.filter((item) =>
        ["Dashboard", "Student Info", "Attendance", "Result","Settings"].includes(item.title)
      ) // Only show specific sections for "teacher"
    : role === "student"
    ? data.navMain.filter((item) =>
        ["Dashboard","Routines"].includes(item.title)
      ) // Only show "Student Info" for "student"
    : role === "librarian"
    ? data.navMain.filter((item) =>
        ["Dashboard","Library"].includes(item.title)
      ) // Only show "Student Info" for "student"
    : [];


  // items={data.navMain}

  return (
    <Sidebar collapsible="icon" {...props} >
    
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
