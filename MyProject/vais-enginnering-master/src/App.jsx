
import Career from "./components/Career/Career"
import Home from "./components/Home/Home"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Service from "./components/Service/Service";
import AboutUs from "./components/AboutUs/AboutUs";
import Portfolio from "./components/Portfolio/Portfolio";
import Contact from "./components/Contact/Contact";
import Booknow from "./components/Book/Booknow";
import AnimatedCursor from "react-animated-cursor"

function App() {


  return (
    <>
    <Router>
      {/* <AnimatedCursor
       innerSize={8}
       outerSize={8}
       color='193, 11, 111'
       outerAlpha={0.2}
       innerScale={0.7}
       outerScale={5}
       clickables={[
         'a',
         'input[type="text"]',
         'input[type="email"]',
         'input[type="number"]',
         'input[type="submit"]',
         'input[type="image"]',
         'label[for]',
         'select',
         'textarea',
         'button',
         '.link'
       ]}
      /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/careers" element={<Career />} />
        <Route path="/services" element={<Service />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route  path="/booknow" element={<Booknow/>}/>
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
    </>
                    
 
  )
}

export default App
