import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import ProductsList from './pages/Products/ProductsList';
import ProductForm from './pages/Products/ProductForm';
import ProductDetails from './pages/Products/ProductDetails';
import OrdersList from './pages/Orders/OrdersList';
import OrderDetails from './pages/Orders/OrderDetails';
import CustomersList from './pages/Customers/CustomersList';
import CustomerDetails from './pages/Customers/CustomerDetails';
import CategoriesList from './pages/Categories/CategoriesList';
import CategoryForm from './pages/Categories/CategoryForm';
import AnnouncementsList from './pages/Announcements/AnnouncementsList';
import MarqueeForm from './pages/Announcements/MarqueeForm';
import FeaturedProducts from './pages/Products/FeaturedProducts';
import ContactList from './pages/Contact/ContactList';

const AdminRouter = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Products */}
        <Route path="products" element={<ProductsList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/featured" element={<FeaturedProducts />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        
        {/* Categories */}
        <Route path="categories" element={<CategoriesList />} />
        <Route path="categories/new" element={<CategoryForm />} />
        <Route path="categories/edit/:id" element={<CategoryForm />} />
        
        {/* Orders */}
        <Route path="orders" element={<OrdersList />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        
        {/* Customers */}
        <Route path="customers" element={<CustomersList />} />
        <Route path="customers/:id" element={<CustomerDetails />} />
        
        {/* Announcements */}
        <Route path="announcements" element={<AnnouncementsList />} />
        <Route path="announcements/marquee/new" element={<MarqueeForm />} />
        <Route path="announcements/marquee/:id/edit" element={<MarqueeForm />} />

        {/* Contact */}
        <Route path="/contact" element={<ContactList />} />

      </Route>

      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRouter;
