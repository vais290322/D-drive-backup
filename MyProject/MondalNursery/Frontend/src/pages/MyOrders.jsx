import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common/index';
import displayINRCurrency from '../helpers/displayCurrency';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { FaArrowLeftLong } from "react-icons/fa6";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await fetch(SummaryApi.userOrders.url, {
        method: SummaryApi.userOrders.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseData = await response.json();
      console.log("responseData from my orders", responseData);
      if (responseData.success) {
        const sortedOrders = responseData.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
      } else {
        toast.error('Failed to fetch orders no data');
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(SummaryApi.deleteOrder.url, {
        method: SummaryApi.deleteOrder.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        toast.success(responseData.message);
        fetchOrders();
      } else {
        toast.error('Failed to delete order');
      }
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  console.log("currecent orders=", currentOrders)

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(SummaryApi.productDetails.url, {
        method: SummaryApi.productDetails.method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId })
      });
      const dataResponse = await response.json();
      return dataResponse?.data;
    } catch (error) {
      toast.error('Failed to fetch product details');
      return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <div className='hidden md:block ml-8 mt-4 text-4xl font-bold fixed text-blue-400 cursor-pointer hover:text-blue-600' onClick={() => navigate('/')}>
        <FaArrowLeftLong />
      </div> */}
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          currentOrders.map((order) => (
            <div key={order._id} className="border bg-white p-4 mb-4 rounded">
              <div className='flex justify-between'>
                <h2 className="text-xl font-bold">Order #{order._id}</h2>
                {order.deliveryStatus === 'Pending' && order.isPaid=== false && (
                  <button className='hidden md:block bg-red-500 rounded-full font-medium text-white p-2 hover:bg-red-700'
                    onClick={() => handleDeleteOrder(order._id)}>
                    Cancel Order
                  </button>
                )}
              </div>
              <div className='flex justify-between'>
                <p><strong>Date:</strong> {moment(order?.createdAt).format('LL')}</p>
                {order.deliveryStatus === 'Pending' && (
                  <button className='md:hidden block bg-red-500 rounded font-medium text-white p-1 hover:bg-red-700 active:bg-red-800' onClick={() => handleDeleteOrder(order._id)}>
                    Cancel Order
                  </button>
                )}
              </div>
              <p><strong>Payment Status:</strong> {order.isPaid ? 'Paid' : 'Not Paid'}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Total Price:</strong> {displayINRCurrency(order.totalPrice)}</p>
              <div>
                <h3 className="font-bold">Items:</h3>
                {order.orderItems.map((item, index) => (
                  <OrderItem key={index} item={item} fetchProductDetails={fetchProductDetails} />
                ))}
              </div>
              <div className="mt-2">
                <h3 className="font-bold">Shipping Address:</h3>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.streetAddress}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.phoneNumber}</p>
              </div>
              <DeliveryStatusIndicator status={order.deliveryStatus} order={order} />
            </div>
          ))
        )}
        <div className="flex justify-between items-center mt-4">
          <button
            className={`p-2 ${currentPage === 1 ? 'bg-gray-200' : 'bg-blue-500 text-white'} rounded`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            className={`p-2 ${currentPage === totalPages ? 'bg-gray-200' : 'bg-blue-500 text-white'} rounded`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const DeliveryStatusIndicator = ({ status }) => {
  const statusOrder = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStatusIndex = statusOrder.indexOf(status);

  return (
    <div>
      <p className='mt-7 font-bold tex-medium'>Delivery Status :</p>
      <div className="flex items-center mt-4">
        {statusOrder.map((statusLabel, index) => (
          <React.Fragment key={index}>
            <div style={{ width: '25%' }} className={`flex-1 flex-col border-t-2 ${index <= currentStatusIndex ? 'border-green-500' : 'border-gray-300'}`}></div>
            <div className={`relative w-6 h-6 rounded-full ${index <= currentStatusIndex ? 'bg-green-500' : 'bg-gray-300'}`}>
              <span className="absolute inset-0 flex items-center justify-center text-white text-sm">{statusLabel.charAt(0)}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className='flex justify-around'>
        <div className='pl-3'>Pending</div>
        <div className='pl-3'>Processing</div>
        <div className='pl-3'>Shipped</div>
        <div className='pl-3'>Delivered</div>
      </div>
    </div>
  );
};

const OrderItem = ({ item, fetchProductDetails }) => {
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProductDetails(item.productId);
      setProductData(data);
    };
    fetchData();
  }, [item.productId, fetchProductDetails]);

  if (!productData) {
    return <div>Loading product details...</div>;
  }

  return (
    <div className="w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]">
      <div className="w-32 h-32 bg-slate-200">
        <img src={productData.productImage[0]} alt="image" className="w-full h-full object-scale-down mix-blend-multiply" />
      </div>
      <div className="px-4 py-2 relative">
        <h2 className="text-lg lg:text-xl text-ellipsis line-clamp-1">{productData.productName}</h2>
        <p className="text-red-600 font-medium text-lg">{displayINRCurrency(productData.sellingPrice)}</p>
        <p className="text-red-600 font-medium text-lg">Quantity: {item.quantity}</p>
      </div>
    </div>
  );
};

export default MyOrders;
