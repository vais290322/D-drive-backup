import { Toaster } from "react-hot-toast";
import "./App.css";
import LayoutComponent from "./component/sidebar/LayoutComponent";
import { PrimeReactProvider } from "primereact/api";
function App() {
  return (
    <PrimeReactProvider>
      <LayoutComponent />
      <Toaster position="top-right" />
    </PrimeReactProvider>
  );
}

export default App;
