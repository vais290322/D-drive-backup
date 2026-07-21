// import React, { createContext, useContext, useState } from "react";

// // Create the context
// const BreadcrumbContext = createContext();

// // Hook to use the context
// export const useBreadcrumb = () => {
//   return useContext(BreadcrumbContext);
// };

// // Provider component
// export const BreadcrumbProvider = ({ children }) => {
    
//   const [breadcrumb, setBreadcrumb] = useState(["Dashboard"]); // Default breadcrumb

//   const updateBreadcrumb = (path) => {
//     setBreadcrumb(path);
//   };

//   return (
//     <BreadcrumbContext.Provider value={{ breadcrumb, updateBreadcrumb }}>
//       {children}
//     </BreadcrumbContext.Provider>
//   );
// };

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Create the context
const BreadcrumbContext = createContext();

// Hook to use the context
export const useBreadcrumb = () => {
  return useContext(BreadcrumbContext);
};

// Function to parse pathnames into breadcrumb titles
const parsePathToBreadcrumb = (pathname) => {
  const pathParts = pathname.split("/").filter(Boolean); // Split by "/" and remove empty parts
  return pathParts.length > 0 ? pathParts.map(capitalize) : ["Dashboard"];
};

// Capitalize function for formatting breadcrumb parts
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Provider component
export const BreadcrumbProvider = ({ children }) => {
  const location = useLocation();
  const [breadcrumb, setBreadcrumb] = useState(parsePathToBreadcrumb(location.pathname)); // Initialize with current path

  // Update breadcrumb on location change
  useEffect(() => {
    setBreadcrumb(parsePathToBreadcrumb(location.pathname));
  }, [location.pathname]);

  const updateBreadcrumb = (path) => {
    setBreadcrumb(path);
  };

  return (
    <BreadcrumbContext.Provider value={{ breadcrumb, updateBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
