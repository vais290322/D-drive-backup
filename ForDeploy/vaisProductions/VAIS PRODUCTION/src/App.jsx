import { Footer, Header } from "./components";
import { About, Contact, ExpoPage, Home, Portfolio, Service, Testimonial } from "./pages";

function App() {
  return (
    <div className="bg-whita min-h-screen min-w-screen font-poppins cursor-pointer">
      <Header />
      <Home />
      <About />
      <Service />
      <Portfolio />
      <Testimonial />
      <Contact />
      {/* <ExpoPage /> */}
      <Footer />
    </div>
  );
}

export default App;
