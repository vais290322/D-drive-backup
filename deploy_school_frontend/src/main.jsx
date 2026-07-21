import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import { RouterProvider } from "react-router";
import router from "./routes/index.jsx";
import store, { persistor } from "./utils/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
          {/* <App  /> */}
        </ThemeProvider>
      </PersistGate>
    </Provider>
  // </StrictMode>
);
