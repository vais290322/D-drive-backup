import React, { useState } from "react";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const layout = ({children,pages}) => {

  return (
    <div className=" flex flex-col w-full overflow-hidden">
      <Header/>

      {children}

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default layout;
