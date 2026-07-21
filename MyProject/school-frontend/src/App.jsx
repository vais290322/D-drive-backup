import { Outlet, useLocation } from "react-router-dom";
// import './App.css'
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import AppSidebar from "./components/Sidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { BreadcrumbProvider } from "./context/BreadCrumbContext";
import { useFetchAllBloodGroup, useFetchAllClass, useFetchAllClassTime, useFetchAllEvents, useFetchAllExamType, useFetchAllGender, useFetchAllReligion, useFetchAllSection, useFetchAllSubject, useFetchSchoolInformation } from "./helper/AllFetchFunction";


function App() {
  const location = useLocation();
  // const role = useSelector((state) => state.auth.user);
  // console.log("role from app page : ", role);
  // Define a list of routes where you want to hide specific components
  const hiddenRoutes =  ["/login", "/signup", "/signup-step2", ];

  const isErrorRoute = location.pathname === "*" || location.pathname.startsWith("/undefined");

  // Check if the current route matches any route in the `hiddenRoutes` array
  const shouldHideComponents = hiddenRoutes.includes(location.pathname) || isErrorRoute;

    useFetchAllClass();
    useFetchAllSection();
    useFetchAllSubject();
    useFetchAllExamType();
    useFetchAllGender();
    useFetchAllBloodGroup();
    useFetchAllReligion();
    useFetchSchoolInformation();
    useFetchAllClassTime();
    useFetchAllEvents();
  
   

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
          </SidebarInset>
        </SidebarProvider>
      </BreadcrumbProvider>
    </>
  );
}

export default App;
