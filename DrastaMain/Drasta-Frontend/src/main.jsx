import App from "./App";
// import { Toaster } from "react-hot-toast";
import "./index.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
  <BrowserRouter>
  <ToastProvider position="top-right" reverseOrder={false} />
    <App />
    </BrowserRouter>
  </StrictMode>
);
