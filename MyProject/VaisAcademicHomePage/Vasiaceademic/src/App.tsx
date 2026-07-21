import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import CaseStudies from './components/CaseStudies';
import Resources from './components/Resources';
import { ThemeProvider } from './context/ThemeContext';
import Footer from './components/Footer';
function App() {
  return (
    <ThemeProvider>
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CaseStudies />
        <Pricing />
        <Resources />
        <Footer />
      </main>
    </div>
    </ThemeProvider>
  );
}

export default App;