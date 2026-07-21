import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import store from "./V2/app/store";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./components/ThemeProvider";


import AppRouter from "./router";
import AppRoutes from "./V1/routes/AppRoutes";




const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ToastProvider>
          <AppRouter />
          {/* <AppRoutes /> */}
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
