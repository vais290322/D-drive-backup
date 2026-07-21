import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder, processShiprocketOrder, trackShipment } from '../services/api';

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [tracking, setTracking] = useState(null);
  const [courierId, setCourierId] = useState('');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await getOrder(id);
      setOrder(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch order details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleProcessOrder = async () => {
    if (!courierId) {
      alert('Please enter a courier ID');
      return;
    }

    try {
      setProcessing(true);
      const response = await processShiprocketOrder({ 
        orderId: id, 
        courierId: parseInt(courierId) 
      });
      setOrder(response.data.order);
      alert('Order processed successfully!');
    } catch (err) {
      setError('Failed to process order with Shiprocket');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleTrackShipment = async () => {
    try {
      setLoading(true);
      const response = await trackShipment(id);
      setTracking(response.data.tracking);
      setError(null);
    } catch (err) {
      setError('Failed to track shipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !order) {
    return <div className="text-center py-10">Loading order details...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p>{error}</p>
        <button 
          onClick={fetchOrder} 
          className="mt-2 text-red-700 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-10">Order not found</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <Link to="/orders" className="btn btn-secondary">
          Back to Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Order #{order.orderNumber}</h2>
            <span className={`px-3 py-1 rounded-full text-sm ${
              order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
              order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
              order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
            </span>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap">{item.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.sku}</td>
                      <td className="px-4 py-2 whitespace-nowrap">₹{item.price}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{item.quantity}</td>
                      <td className="px-4 py-2 whitespace-nowrap">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="4" className="px-4 py-2 text-right font-semibold">Total:</td>
                    <td className="px-4 py-2 font-bold">₹{order.totalAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {order.shippingDetails?.awbCode && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">AWB Code</p>
                  <p className="font-semibold">{order.shippingDetails.awbCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Courier</p>
                  <p className="font-semibold">{order.shippingDetails.courierName}</p>
                </div>
                {order.shippingDetails.manifestUrl && (
                  <div>
                    <p className="text-sm text-gray-600">Manifest</p>
                    <a 
                      href={order.shippingDetails.manifestUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Manifest
                    </a>
                  </div>
                )}
                {order.shippingDetails.labelUrl && (
                  <div>
                    <p className="text-sm text-gray-600">Label</p>
                    <a 
                      href={order.shippingDetails.labelUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Label
                    </a>
                  </div>
                )}
                {order.shippingDetails.invoiceUrl && (
                  <div>
                    <p className="text-sm text-gray-600">Invoice</p>
                    <a 
                      href={order.shippingDetails.invoiceUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Invoice
                    </a>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <button 
                  onClick={handleTrackShipment}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Track Shipment'}
                </button>
              </div>
              
              {tracking && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h4 className="font-semibold mb-2">Tracking Information</h4>
                  {tracking.tracking_data?.track_status ? (
                    <div>
                      <p className="font-medium">Status: {tracking.tracking_data.track_status}</p>
                      <p className="text-sm text-gray-600">
                        Last Updated: {new Date(tracking.tracking_data.shipment_track_activities[0]?.date || '').toLocaleString()}
                      </p>
                      
                      <div className="mt-3">
                        <h5 className="text-sm font-medium mb-2">Tracking History</h5>
                        <div className="space-y-2">
                          {tracking.tracking_data.shipment_track_activities?.map((activity, index) => (
                            <div key={index} className="border-l-2 border-blue-500 pl-3 py-1">
                              <p className="text-sm font-medium">{activity.activity}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(activity.date).toLocaleString()} • {activity.location}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>No tracking information available yet.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {order.customer.name}</p>
              <p><span className="font-medium">Email:</span> {order.customer.email}</p>
              <p><span className="font-medium">Phone:</span> {order.customer.phone}</p>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
            <div className="space-y-2">
              <p>{order.customer.address.street}</p>
              <p>{order.customer.address.city}, {order.customer.address.state} {order.customer.address.pincode}</p>
              <p>{order.customer.address.country}</p>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Order Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><span className="font-medium">Payment Status:</span> {order.paymentStatus}</p>
              <p><span className="font-medium">Order Status:</span> {order.orderStatus}</p>
            </div>
          </div>
          
          {!order.shippingDetails?.awbCode && order.orderStatus !== 'cancelled' && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Process with Shiprocket</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="courierId" className="form-label">Courier ID</label>
                  <input
                    type="number"
                    id="courierId"
                    className="form-input"
                    value={courierId}
                    onChange={(e) => setCourierId(e.target.value)}
                    placeholder="Enter courier ID"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can get courier ID from Shiprocket serviceability API
                  </p>
                </div>
                
                <button
                  onClick={handleProcessOrder}
                  className="btn btn-primary w-full"
                  disabled={processing}
                >
                  {processing ? 'Processing...' : 'Process Order with Shiprocket'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;