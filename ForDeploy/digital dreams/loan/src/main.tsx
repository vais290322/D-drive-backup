import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ErrorBoundary } from "./components/common/ErrorBoundary.tsx";

console.log("=== MAIN.TSX LOADED ===");

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("❌ Root element not found!");
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1 style="color: red;">ERROR: Root element not found</h1>
      <p>The application cannot start because the root element is missing.</p>
    </div>
  `;
  throw new Error("Root element not found");
}

console.log("✓ Root element found");

try {
  console.log("Creating React root...");
  const root = createRoot(rootElement);
  
  console.log("Rendering app...");
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ErrorBoundary>
    </StrictMode>
  );
  
  console.log("✓ App rendered successfully");
} catch (error) {
  console.error("❌ Error rendering app:", error);
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1 style="color: red;">ERROR: Failed to render application</h1>
      <p>${error}</p>
      <pre style="background: #f5f5f5; padding: 10px; overflow: auto;">${error instanceof Error ? error.stack : String(error)}</pre>
    </div>
  `;
}
