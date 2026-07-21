import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import routes from './routes';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminFlights from '@/pages/admin/AdminFlights';
import AdminHotels from '@/pages/admin/AdminHotels';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminPackages from '@/pages/admin/AdminPackages';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminBlogPosts from '@/pages/admin/AdminBlogPosts';
import AdminResources from '@/pages/admin/AdminResources';
import AdminContacts from '@/pages/admin/AdminContacts';
import CustomerLayout from '@/components/customer/CustomerLayout';
import CustomerDashboard from '@/pages/customer/CustomerDashboard';
import HotelierLayout from '@/components/hotelier/HotelierLayout';
import HotelierDashboard from '@/pages/hotelier/HotelierDashboard';
import StaffLayout from '@/components/staff/StaffLayout';
import StaffDashboard from '@/pages/staff/StaffDashboard';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Public Layout Component with Header and Footer
const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Admin Routes - No Header/Footer */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="flights" element={<AdminFlights />} />
            <Route path="hotels" element={<AdminHotels />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="blog-posts" element={<AdminBlogPosts />} />
            <Route path="resources" element={<AdminResources />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>

          {/* Customer Routes - No Header/Footer */}
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="bookings" element={<div className="text-center py-12">Bookings coming soon...</div>} />
            <Route path="flights" element={<div className="text-center py-12">Flights coming soon...</div>} />
            <Route path="hotels" element={<div className="text-center py-12">Hotels coming soon...</div>} />
            <Route path="orders" element={<div className="text-center py-12">Orders coming soon...</div>} />
            <Route path="profile" element={<div className="text-center py-12">Profile coming soon...</div>} />
          </Route>

          {/* Hotelier Routes - No Header/Footer */}
          <Route path="/hotelier" element={<HotelierLayout />}>
            <Route index element={<HotelierDashboard />} />
            <Route path="hotels" element={<div className="text-center py-12">Hotels management coming soon...</div>} />
            <Route path="bookings" element={<div className="text-center py-12">Bookings coming soon...</div>} />
            <Route path="guests" element={<div className="text-center py-12">Guests coming soon...</div>} />
            <Route path="analytics" element={<div className="text-center py-12">Analytics coming soon...</div>} />
            <Route path="settings" element={<div className="text-center py-12">Settings coming soon...</div>} />
          </Route>

          {/* Staff Routes - No Header/Footer */}
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<StaffDashboard />} />
            <Route path="tasks" element={<div className="text-center py-12">Tasks coming soon...</div>} />
            <Route path="customers" element={<div className="text-center py-12">Customers coming soon...</div>} />
            <Route path="support" element={<div className="text-center py-12">Support coming soon...</div>} />
            <Route path="reports" element={<div className="text-center py-12">Reports coming soon...</div>} />
            <Route path="settings" element={<div className="text-center py-12">Settings coming soon...</div>} />
          </Route>

          {/* Public Routes - With Header/Footer */}
          <Route element={<PublicLayout />}>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;
