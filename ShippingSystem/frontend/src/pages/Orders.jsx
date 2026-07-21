import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, createDummyOrder, deleteOrder } from '../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateDummyOrder = async () => {
    try {
      setLoading(true);
      await createDummyOrder();
      fetchOrders();
    } catch (err) {
      setError('Failed to create dummy order');
      console.error(err);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(id);
        setOrders(orders.filter(order => order._id !== id));
      } catch (err) {
        setError('Failed to delete order');
        console.error(err);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && orders.length === 0) {
    return <div className="text-center py-10">Loading orders...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="space-x-2">
          <button 
            onClick={handleCreateDummyOrder} 
            className="btn btn-secondary"
          >
            Create Dummy Order
          </button>
          <Link to="/orders/create" className="btn btn-primary">
            Create New Order
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No orders found</p>
          <button 
            onClick={handleCreateDummyOrder} 
            className="btn btn-primary"
          >
            Create Dummy Order
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Order Number</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Shipping</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link to={`/orders/${order._id}`} className="text-blue-600 hover:underline">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{order.customer.name}</td>
                  <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">₹{order.totalAmount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {order.shippingDetails?.awbCode ? (
                      <span className="text-green-600">{order.shippingDetails.awbCode}</span>
                    ) : (
                      <span className="text-gray-400">Not shipped</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link to={`/orders/${order._id}`} className="text-blue-600 hover:underline">
                        View
                      </Link>
                      <button 
                        onClick={() => handleDeleteOrder(order._id)} 
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Orders;