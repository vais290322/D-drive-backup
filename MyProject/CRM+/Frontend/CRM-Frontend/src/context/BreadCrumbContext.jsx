import React, { createContext, useContext, useState } from "react";

// Create the context
const BreadcrumbContext = createContext();

// Hook to use the context
export const useBreadcrumb = () => {
  return useContext(BreadcrumbContext);
};

// Provider component
export const BreadcrumbProvider = ({ children }) => {
    
  const [breadcrumb, setBreadcrumb] = useState(["Dashboard"]); // Default breadcrumb

  const updateBreadcrumb = (path) => {
    setBreadcrumb(path);
  };

  return (
    <BreadcrumbContext.Provider value={{ breadcrumb, updateBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
