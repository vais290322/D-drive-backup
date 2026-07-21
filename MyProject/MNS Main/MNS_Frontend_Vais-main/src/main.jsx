
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import store, { persistor } from "./utils/store/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import  { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
 
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
        <Toaster position="top-right" reverseOrder={false} />
      </PersistGate>
    </Provider>

);
