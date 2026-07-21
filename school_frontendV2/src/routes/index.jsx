import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ClassPage from "@/pages/academic/ClassPage";
import ClassRoomPage from "@/pages/academic/ClassRoomPage";
import SubjectPage from "@/pages/academic/SubjectPage";
import SubjectAssignPage from "@/pages/academic/SubjectAssignPage";
import SectionPage from "@/pages/academic/SectionPage";
import AdmissionPage from "@/pages/AdmissionPage";
import AddTeacherPage from "@/pages/TeacherInfo/AddTeacherPage";
import ManageTeacherPage from "@/pages/TeacherInfo/ManageTeacherPage";
import GendersPage from "@/pages/Setting/GendersPage";
import BloodGroupPage from "@/pages/Setting/BloodGroupPage";
import ReligionsPage from "@/pages/Setting/ReligionsPage";
import SchoolInformationPage from "@/pages/Setting/InstituteInformationPage";
import StudentInformationPage from "@/pages/studentInfo/StudentInformationPage";
import GuardianInformationPage from "@/pages/studentInfo/GuardianInformationPage";
import ClassTimePage from "@/pages/Routines/ClassTimePage";
import ClassRoutinesPage from "@/pages/Routines/ClassRoutinesPage";
import ExamRoutinesPage from "@/pages/Routines/ExamRoutinesPage";
import ExamTypePage from "@/pages/Routines/ExamTypePage";
import GradeSystemPage from "@/pages/Result/GradeSystemPage";
import MarkRegisterPage from "@/pages/Result/MarkRegisterPage";
import MarksheetPage from "@/pages/Result/MarksheetPage";
import IdCardPage from "@/pages/Card/IdCardPage";
import AdmitCardPage from "@/pages/Card/AdmitCardPage";
import AttendancePage from "@/pages/Attendance/AttendancePage";
import AttendanceReportPage from "@/pages/Attendance/AttendanceReportPage";
import MarkAttendancePage from "@/pages/Attendance/MarkAttendancePage";
import DashboardPage from "@/pages/AllDashboard/DashboardPage";
import ViewMarksPage from "@/pages/Result/ViewMarksPage";
import AddEdpPage from "@/pages/Edp/AddEdpPage";
import ManageEdpPage from "@/pages/Edp/ManageEdpPage";
import IncomePage from "@/pages/Accounts/IncomePage";
import ExpensePage from "@/pages/Accounts/ExpensePage";
import ErrorPage from "@/pages/ErrorPage";
import AddBookCategoryPage from "@/pages/Library/AddBookCategoryPage";
import AddBookPage from "@/pages/Library/AddBookPage";
import IssueBookPage from "@/pages/Library/IssueBookPage";
import ReturnBookPage from "@/pages/Library/ReturnBookPage";
import ViewIssuedBookPage from "@/pages/Library/ViewIssuedBookPage";
import ClassFeesPage from "@/pages/Fees/ClassFeesPage";
import LibraryLateFeesPage from "@/pages/Fees/LibraryLateFeesPage";
import LateFeesPaymentPage from "@/pages/Fees/LateFeesPaymentPage";
import AbsentFeesPage from "@/pages/Fees/AbsentFeesPage";
import StudentFeeCollectionPage from "@/pages/Accounts/StudentFeeCollectionPage";
import BankTransactionPage from "@/pages/Accounts/BankTransactionPage";
import HomePage from "@/pages/AllDashboard/StudentDashboardPage";
import LoginPage from "@/pages/Auth/LoginPage";
import SignupPage from "@/pages/Auth/SignupPage";
import AddLibrarianPage from "@/pages/Librarian/AddLibrarianPage";
import ManageLibrarianPage from "@/pages/Librarian/ManageLibrarianPage";
import ProtectedRouteComponent from "@/components/ProtectedRoute/ProtectedRouteComponent";
import SignUpStep2Page from "@/pages/Auth/SignUpStep2Page";
import AddEventPage from "@/pages/AddEventPage";
import AddStudentFeesPage from "@/pages/Fees/AddStudentFeesPage";
import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
import CreateNewPasswordPage from "@/pages/Auth/CreateNewPasswordPage";
import TuitionFeesCollectionPage from "@/pages/Accounts/TuitionFeesCollectionPage";
import ReportsPage from "@/pages/Accounts/ReportsPage";


const router = createBrowserRouter([
  
  {
    path: "*",
    element: <ErrorPage />,
  }, 
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/signup-step2",
    element: <SignUpStep2Page />,
  },
  {
    path: "/forgot-password",
    element:<ForgotPasswordPage/>
  },

  {
    // https://vaisacademy.com/service4/api/auth/reset-password?token=9c8fbc8a-5735-4a29-9305-a5a34a817663
    path: "/api/auth/reset-password/:token",
    element:<CreateNewPasswordPage/>
  },

  {
    path: "/",
    element: <App />,
    children: [

      // for Procted routes

      {
        element:<ProtectedRouteComponent/>,
        children:[
           // for dashboard page
      {
        path: "",
        element: <div />,
      },
      // for admission
      {
        path: "admission",
        element: <AdmissionPage />,
      },
      {
        path: "home",
        element: <HomePage />,
      },

      // for teacher info
      {
        path: "add-teacher",
        element: <AddTeacherPage />,
      },
      {
        path: "manage-teacher",
        element: <ManageTeacherPage />,
      },
      // for edp
      {
        path: "add-edp",
        element: <AddEdpPage />,
      },
      {
        path: "manage-edp",
        element: <ManageEdpPage />,
      },
      // for librarian
      {
        path: "add-librarian",
        element: <AddLibrarianPage />,
      },
      {
        path: "manage-librarian",
        element: <ManageLibrarianPage />,
      },
      // for accoounts

      {
        path: "income",
        element: <IncomePage />,
      },
      {
        path: "expense",
        element: <ExpensePage />,
      },
      {
        path: "student-fees-collection",
        element: <StudentFeeCollectionPage />,
      },
      {
        path: "tuition-fees-collection",
        element: <TuitionFeesCollectionPage />,
      },
      {
        path: "bank-transaction",
        element: <BankTransactionPage />,
      },
      {
        path: "report",
        element: <ReportsPage />,
      },
      // for fees
      {
        path: "tuition-fees",
        element: <ClassFeesPage />,
      },
      {
        path: "library-late-fees",
        element: <LibraryLateFeesPage />,
      },
      {
        path: "absent-fees",
        element: <AbsentFeesPage />,
      },
      {
        path: "late-fees-payment",
        element: <LateFeesPaymentPage />,
      },
      {
        path: "add-student-fees",
        element: <AddStudentFeesPage />,
      },

      // for Student & parent info
      {
        path: "student",
        element: <StudentInformationPage />,
      },
      {
        path: "guardian",
        element: <GuardianInformationPage />,
      },

      // for academic pages
      {
        path: "academic/class",
        element: <ClassPage />,
      },
      {
        path: "academic/class-room",
        element: <ClassRoomPage />,
      },
      {
        path: "academic/subject",
        element: <SubjectPage />,
      },
      {
        path: "academic/subject-assign",
        element: <SubjectAssignPage />,
      },
      {
        path: "academic/section",
        element: <SectionPage />,
      },
      // for routines
      {
        path: "class-times",
        element: <ClassTimePage />,
      },
      {
        path: "class-routines",
        element: <ClassRoutinesPage />,
      },
      {
        path: "exam-routines",
        element: <ExamRoutinesPage />,
      },
      {
        path: "exam-types",
        element: <ExamTypePage />,
      },
      // for attendance page
      {
        path: "attendance",
        element: <AttendancePage />,
      },
      {
        path: "attendance-report",
        element: <AttendanceReportPage />,
      },
      {
        path: "mark-attendance",
        element: <MarkAttendancePage />,
      },
      // for card pages
      {
        path: "id-card",
        element: <IdCardPage />,
      },
      {
        path: "admit-card",
        element: <AdmitCardPage />,
      },
      // for result pages
      {
        path: "grade-system",
        element: <GradeSystemPage />,
      },
      {
        path: "mark-register",
        element: <MarkRegisterPage />,
      },
      {
        path: "marksheet",
        element: <MarksheetPage />,
      },
      {
        path: "view-marks",
        element: <ViewMarksPage />,
      },

      // for setting
      {
        path: "genders",
        element: <GendersPage />,
      },
      {
        path: "blood-groups",
        element: <BloodGroupPage />,
      },
      {
        path: "religions",
        element: <ReligionsPage />,
      },
      {
        path: "school-information",
        element: <SchoolInformationPage />,
      },
      // for Library
      {
        path: "add-book-category",
        element: <AddBookCategoryPage />,
      },
      {
        path: "add-book",
        element: <AddBookPage />,
      },
      {
        path: "issue-book",
        element: <IssueBookPage />,
      },
      {
        path: "return-book",
        element: <ReturnBookPage />,
      },
      {
        path: "view-issued-books",
        element: <ViewIssuedBookPage />,
      },
      // add event page 
      {
        path: "add-event",
        element: <AddEventPage />,
      },

        ]
       },

       
    ],
  },
]);

export default router;
