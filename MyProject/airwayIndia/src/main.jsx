import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast'; 
import './index.css'; 

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRoutes />
  </React.StrictMode>
);
