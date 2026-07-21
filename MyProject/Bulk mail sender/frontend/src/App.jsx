import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import EmailSender from './pages/EmailSender';
import CampaignHistory from './pages/CampaignHistory';
import CampaignDetails from './pages/CampaignDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<EmailSender />} />
            <Route path="/campaigns" element={<CampaignHistory />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
