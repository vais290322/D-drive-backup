import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import EmailSender from './pages/EmailSender';
import CampaignHistory from './pages/CampaignHistory';
import CampaignDetails from './pages/CampaignDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OAuthCallback from './pages/OAuthCallback';

const GOOGLE_CLIENT_ID = '736650183623-d9f4koo4jqnpllvh66vsiik5u36mu4d9.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <div className="app-shell">
            <Navbar />
            <main className="app-main">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/oauth-callback" element={<OAuthCallback />} />

                {/* Protected routes */}
                <Route path="/" element={<ProtectedRoute><EmailSender /></ProtectedRoute>} />
                <Route path="/campaigns" element={<ProtectedRoute><CampaignHistory /></ProtectedRoute>} />
                <Route path="/campaigns/:id" element={<ProtectedRoute><CampaignDetails /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#e2e8f0',
                border: '1px solid #334155',
              },
            }}
          />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
