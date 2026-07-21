import React from "react";
import Sidebar from "../componants/components/Sidebar";
import Navbar from "../componants/components/Navbar";
import Footer from "../componants/components/Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function V1Layout({ user, onLogout }) {
  const location = useLocation();
  const path = location.pathname.split("/")[2]; // Get the route after /v1/

  // List of routes that should render without layout
  const routesWithoutLayout = [
    "home",
    "our-coordinates",
    "legal-compliance", 
    "gallery",
    "reports",
    "database",
    "news",
    "csr",
    "abstractsandongoing",
    "drastaavalokan",
    "youngresearcher",
    "training-workshops",
    "training-themes",
    "research-projects",
    "research-themes",
    "governanceandadvisorytrustees",
    "advisors",
    "collaborators",
    "directors-desks",
    "researchers",
    "administrationandoperations",
    "womenscience",
    "greenleable",
    "career"
  ];

  // If current route is in the list, render without layout
  if (routesWithoutLayout.includes(path)) {
    return <Outlet />;
  }

  // Otherwise render with full layout
  return (
    <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }} className="ml-[252px] ">
      <Navbar user={user} onLogout={onLogout} />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, minHeight: 0 }}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
