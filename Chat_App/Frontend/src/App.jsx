import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate,  } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';




function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
