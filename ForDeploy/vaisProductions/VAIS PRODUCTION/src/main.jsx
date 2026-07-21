import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import SponsorForm from "./pages/SponsorForm.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/join-expo" element={<SponsorForm />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </>
);
