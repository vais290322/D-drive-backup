import React from "react";
import { Outlet } from "react-router";

const App = () => {
  return (
    <div>
      {/* This is where nested routes will render */}
      <Outlet />
    </div>
  );
};

export default App;
