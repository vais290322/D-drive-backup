import React from "react";
import ImageGallary from "./ImageGallary";
import Header from "../../Header";
import Footer from "../../Footer";

function Gallary() {
  return (
    <>
    <Header />
      <div className="my-48">
      <ImageGallary/>
      </div>
      <Footer/>
    </>
      
  );
}

export default Gallary;
