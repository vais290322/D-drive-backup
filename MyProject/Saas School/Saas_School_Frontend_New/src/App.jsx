import { Outlet, useLocation } from "react-router-dom";
// import './App.css'
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import AppSidebar from "./components/Sidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { BreadcrumbProvider } from "./context/BreadCrumbContext";
import {
  useFetchAllBloodGroup,
  useFetchAllClass,
  useFetchAllClassTime,
  useFetchAllEvents,
  useFetchAllExamType,
  useFetchAllGender,
  useFetchAllReligion,
  useFetchAllSection,
  useFetchAllSubject,
  useFetchAllTeachers,
  useFetchSchoolInformation,
  useFetchAllStudent,
} from "./helper/AllFetchFunction";
import { connectWebSocket, disconnectWebSocket } from "@/services/websocket";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocialFeed } from "./utils/auth/socialFeedAuth";
import { disconnectSocket } from "./utils/socket";
import GoToTopComponent from "./components/Scroll/GoToTopComponent";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  // const role = useSelector((state) => state.auth.user);
  // console.log("role from app page : ", role);

  const isLogin = useSelector((state) => state?.auth?.islogin);
  // console.log("is login from app page : ", isLogin);


  // Define a list of routes where you want to hide specific components
  const hiddenRoutes = ["/login", "/signup", "/signup-step2"];

  const isErrorRoute =
    location.pathname === "*" || location.pathname.startsWith("/undefined");

  // Check if the current route matches any route in the `hiddenRoutes` array
  const shouldHideComponents =
    hiddenRoutes.includes(location.pathname) || isErrorRoute;

  const { user, userDetails, schoolId, token } = useSelector(
    (state) => state.auth
  );

  if (isLogin) {
    useFetchSchoolInformation();
    useFetchAllClass();
    useFetchAllSection();
    useFetchAllSubject();
    useFetchAllExamType();
    useFetchAllGender();
    useFetchAllBloodGroup();
    useFetchAllReligion();
    useFetchAllClassTime();
    useFetchAllEvents();
    useFetchAllTeachers();
    useFetchAllStudent();
  }

  // Initialize social feed when user data is available
  useEffect(() => {
    if (user && schoolId && !token) {
      initializeSocialFeed(user, userDetails, schoolId, dispatch);
    }

    // Initialize socket connection when token is available
    if (token) {
      // Socket initialization is handled in initializeSocialFeed
    }

    return () => {
      disconnectSocket();
    };
  }, [user, schoolId, token, dispatch]);

  return (
    <>
      <BreadcrumbProvider>
        <SidebarProvider>
          {/* Conditionally render the sidebar */}
          {!shouldHideComponents && <AppSidebar />}
          <SidebarInset>
            {/* Conditionally render the header */}
            {!shouldHideComponents && <Header />}
            <Outlet />

            {/* <ChatWithSupport/> */}

            {/* Conditionally render the footer */}
            {!shouldHideComponents && <Footer />}
            <GoToTopComponent />
          </SidebarInset>
        </SidebarProvider>
      </BreadcrumbProvider>
    </>
  );
}

export default App;
