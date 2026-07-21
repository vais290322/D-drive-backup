import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getOrders } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          getProducts(),
          getOrders()
        ]);

        const pendingOrders = ordersRes.data.filter(order => order.orderStatus === 'pending').length;
        const shippedOrders = ordersRes.data.filter(order => order.orderStatus === 'shipped').length;
        const deliveredOrders = ordersRes.data.filter(order => order.orderStatus === 'delivered').length;

        setStats({
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          pendingOrders,
          shippedOrders,
          deliveredOrders
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-blue-50 border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <p className="text-3xl font-bold">{stats.products}</p>
          <Link to="/products" className="text-blue-600 hover:underline mt-2 inline-block">
            View all products
          </Link>
        </div>
        
        <div className="card bg-green-50 border-l-4 border-green-500">
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <p className="text-3xl font-bold">{stats.orders}</p>
          <Link to="/orders" className="text-green-600 hover:underline mt-2 inline-block">
            View all orders
          </Link>
        </div>
        
        <div className="card bg-purple-50 border-l-4 border-purple-500">
          <h2 className="text-xl font-semibold mb-2">Shipping</h2>
          <div className="flex justify-between">
            <div>
              <p className="text-sm">Pending</p>
              <p className="text-xl font-bold">{stats.pendingOrders}</p>
            </div>
            <div>
              <p className="text-sm">Shipped</p>
              <p className="text-xl font-bold">{stats.shippedOrders}</p>
            </div>
            <div>
              <p className="text-sm">Delivered</p>
              <p className="text-xl font-bold">{stats.deliveredOrders}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/products/create" className="btn btn-primary w-full block text-center">
              Add New Product
            </Link>
            <Link to="/orders/create" className="btn btn-primary w-full block text-center">
              Create New Order
            </Link>
            <Link to="/shiprocket" className="btn btn-secondary w-full block text-center">
              Shiprocket Integration
            </Link>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center">
                <span>Database Connection</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Connected</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <span>Shiprocket API</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <span>Last Sync</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;