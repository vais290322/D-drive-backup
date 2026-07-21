import { useState } from "react";
import { Outlet } from "react-router";
import HeaderComponent from "../components/header/HeaderComponent";
import FooterComponent from "../components/footer/FooterComponent";
import SidebarComponent from "../components/sidebar/SidebarComponent";

/**
 * MainLayout — shared layout for all authenticated/protected pages.
 * Structure:
 *   ┌────────────────────────────────┐
 *   │  Sidebar │  Header             │
 *   │          │  <page content>     │
 *   │          │  Footer             │
 *   └────────────────────────────────┘
 */
const MainLayout = () => {
  const [toggled, setToggled] = useState(false);

  return (
    <div className="flex min-h-svh">
      {/* Sidebar */}
      <SidebarComponent toggled={toggled} setToggled={setToggled} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col relative w-full lg:w-auto">
        {/* Header */}
        <HeaderComponent onToggleSidebar={() => setToggled(!toggled)} />

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <FooterComponent />
      </div>
    </div>
  );
};

export default MainLayout;
