import { createRoot } from "react-dom/client";
import React from "react";
import App from "./App";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./route/index";


const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <>
    <RouterProvider router={router} />

    </>
  );
} else {
  console.error("Root element not found");
}
// This is the entry point for the renderer process in an Electron app using React and Vite.
// It initializes the React application and renders it into the root element of the HTML document.
// Ensure that the root element exists in your index.html file.
// If the root element is not found, it logs an error to the console.
