import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import HeaderComponent from "./components/HeaderComponent";
import HomePage from "./pages/HomePage";
import Gallerypage from "./pages/Gallerypage";
import ServicesPage from "./pages/ServicesPage";
import AcademyPage from "./pages/AcademyPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";
import FooterComponent from "./components/FooterComponent";
import ScrollToTopComponent from "./components/ScrollToTopComponent";
import ErrorPage from "./pages/ErrorPage";

const App = () => {
  return (
    // <BrowserRouter>
    //   {/* <div className=" "> */}
    //     <HeaderComponent />
    //   {/* </div> */}

    //   {/* <div className=""> */}
    //     <Routes>
    //       <Route path="/" element={<HomePage />} />
    //       <Route path="/gallery" element={<Gallerypage />} />
    //       <Route path="/services" element={<ServicesPage />} />
    //       <Route path="/academy" element={<AcademyPage />} />
    //       <Route path="/about-us" element={<AboutUsPage />} />
    //       <Route path="/contact-us" element={<ContactUsPage />} />
    //     </Routes>
    //   {/* </div> */}
    //   <ScrollToTopComponent />
    //   <div >
    //     <FooterComponent />
    //   </div>
    // </BrowserRouter>
    <div className="relative min-h-screen flex flex-col">
      <BrowserRouter>
        <nav className=" fixed top-0 left-0 right-0 z-50">
          <HeaderComponent />
        </nav>
        <main className="absolute inset-0 flex-grow">
          <Routes>
            <Route path="*" element={<ErrorPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<Gallerypage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/academy" element={<AcademyPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
          </Routes>
          <ScrollToTopComponent />
           <FooterComponent />
        </main>
        
      </BrowserRouter>
    </div>
  );
};

export default App;
