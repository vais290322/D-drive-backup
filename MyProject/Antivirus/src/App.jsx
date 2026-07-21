import React from "react";
import { Outlet } from "react-router";
import GoToTop from "./Pages/GoToTop";

const App = () => {
  return <div>{
    Outlet && <Outlet /> 
  }
  
   <GoToTop />
  </div>;
};

export default App;
