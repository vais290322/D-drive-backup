import React from "react";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { Outlet } from "react-router";
import HeaderComponent from "./components/Header/HeaderComponent";
import FooterComponent from "./components/Footer/FooterComponent";
import { AppSidebar } from "./components/Sidebar/AppSidebar";
import { ThemeProvider } from "./context/ThemeContext";
import { BreadcrumbProvider } from "./context/BreadCrumbContext";

const App = () => {
  return (
    <ThemeProvider>
      <BreadcrumbProvider>
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col w-full">
              <HeaderComponent/>
              {/* <main className="flex-1 p-4 md:p-6"> */}
                <Outlet />
              {/* </main> */}
              <FooterComponent/>
            </SidebarInset>
        </SidebarProvider>
      </BreadcrumbProvider>
    </ThemeProvider>
  );
};

export default App;

