import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"

import { ThemeProvider } from "@/components/theme-provider.tsx"
import { RouterProvider } from "react-router"
import router from "./router/route.tsx"
import { AuthProvider } from "./context/AuthContext.tsx"

import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from "./store/store"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
)

