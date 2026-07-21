import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import CreateOrder from './pages/CreateOrder';
import OrderDetails from './pages/OrderDetails';
import ProductDetails from './pages/ProductDetails';
import ShiprocketIntegration from './pages/ShiprocketIntegration';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/create" element={<CreateOrder />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/shiprocket" element={<ShiprocketIntegration />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
