import { Provider } from "react-redux";
import AppRouter from "./router";
import store from "./V2/app/store";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./components/ThemeProvider";


const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
