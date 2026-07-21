import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router";
import router from "./Routes/index.jsx";
import store , {persistor} from "./utils/store/store.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import {Toaster} from "./components/ui/sonner.jsx"

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <RouterProvider router={router} />
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  // </StrictMode>
);
