import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Package,
  ArrowRight,
  Loader,
  Calendar,
  CreditCard,
  Truck,
} from "lucide-react";
import { motion as Motion } from "framer-motion";
import { useOrderDetails } from "@/shared/hooks/queries/useOrders";
import Button from "@/shared/components/ui/Button";
import Navigation from "@/user/components/navigation";
import BackButton from "@/shared/components/BackButton";
import Footer from "@/user/components/sections/Footer";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Redirect if no orderId
  React.useEffect(() => {
    if (!orderId) {
      navigate("/orders");
    }
  }, [orderId, navigate]);

  // Fetch order details
  const { data: orderResponse, isLoading, isError } = useOrderDetails(orderId);
  const order = orderResponse?.data;

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
        <div
          className="max-w-4xl mx-auto"
          style={{ paddingTop: "5rem", width: "100%", margin: "0 auto" }}
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 animate-pulse">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6" />
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-8" />
            <div className="h-64 bg-gray-100 rounded mb-4" />
            <div className="h-48 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div
          className="text-center p-8 max-w-md"
          style={{ width: "100%", margin: "0 auto" }}
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't find this order. It may have been removed or the link is
            incorrect.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => navigate("/orders")}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              View All Orders
            </Button>
            <Button onClick={() => navigate("/")} variant="outline">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <style>{` 
         @media (min-width: 768px) { .orders-container { padding-top: 100px !important; }}
         @media (max-width: 768px) { .orders-container { padding-top: 60px !important; } }
       `}</style>
      <div
        className="orders-container min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4"
        style={{ width: "100%", margin: "0 5px" }}
      >
      <div
        className="max-w-7xl mx-auto"
        style={{ width: "100%", margin: "0 auto" }}
      >
        <div className="mb-6" style={{ marginBottom: '1.5rem' }}>
          <BackButton fallbackRoute="/orders" label="Back to Orders" className="inline-flex" />
        </div>
        {/* Success Header */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center mb-6"
          style={{ padding: "10px 20px", marginBottom: '10px' }}
        >
          <div className="flex items-center justify-center" style={{ marginBottom: '10px' }}>
            <Motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-14 h-14 text-emerald-600" />
            </Motion.div>
          </div>

          <h1
            className="text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "Gyrotrope" }}
          >
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500 mb-6" style={{ fontFamily: "Gyrotrope" }}>
            Thank you for your order. We'll send you a confirmation email
            shortly.
          </p>

          {/* Order Metadata */}
          <div className="flex flex-wrap gap-4 justify-center text-sm mb-6">
            <div className="flex items-center gap-1 px-4 py-2 bg-gray-50 rounded-lg">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <div style={{marginTop: '5px'}}>
              <span className="text-gray-600">Order Date:</span>
              <span className="font-semibold text-gray-900">{order.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg" style={{marginTop: '5px'}}>
              <span className="text-gray-600">Status:</span>
              <span className="font-semibold text-emerald-600 capitalize">
                {order.status}
              </span>
            </div>
          </div>

          {/* Quick Order Summary */}
          <div className="bg-gray-50 rounded-2xl p-6 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm mb-1">Order ID</p>
                <p className="font-semibold text-gray-900">{order.id}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Payment Method</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Items</p>
                <p className="font-semibold text-gray-900">
                  {order.items?.length || 0} items
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Expected Delivery</p>
                <p className="font-semibold text-emerald-600">
                  {order.expectedDelivery}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              onClick={() => navigate("/orders")}
              size="full"
              className="bg-emerald-600 hover:bg-emerald-700 rounded-xl py-3"
            >
              View My Orders
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="full"
              className="rounded-xl py-3"
            >
              Continue Shopping
            </Button>
          </div>
        </Motion.div>

        <div className="md:flex w-full gap-4 items-center" style={{ marginBottom: '10px' }}>
        {/* Payment Breakdown */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white md:w-[50%] rounded-2xl shadow-lg p-6 mb-6"
          style={{ padding: "10px 20px", marginBottom: '10px' }}
        >
          <h3
            className="font-semibold text-gray-900 mb-4 flex items-center gap-1"
            style={{ fontFamily: "Gyrotrope" }}
          >
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span style={{marginTop: '5px'}}>Payment Summary</span>
          </h3>
          <div className="space-y-2" style={{ fontFamily: "Gyrotrope" }}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cart Total</span>
              <span className="font-medium text-gray-900">
                ₹{order.totals?.totalCartValue || 0}
              </span>
            </div>
            {order.totals?.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Product Discount</span>
                <span className="font-medium">-₹{order.totals.discount}</span>
              </div>
            )}
            {order.totals?.coupon > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Coupon ({order.appliedCoupon?.code})</span>
                <span className="font-medium">-₹{order.totals.coupon}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">GST (18%)</span>
              <span className="font-medium text-gray-900">
                ₹{order.totals?.gst || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Charges</span>
              <span className="font-medium text-gray-900">
                {order.totals?.deliveryCharges === 0 ? (
                  <span className="text-green-600 font-semibold">FREE</span>
                ) : (
                  `₹${order.totals?.deliveryCharges || 0}`
                )}
              </span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-bold text-lg">
                <span className="text-gray-900">Total Paid</span>
                <span className="text-emerald-600">
                  ₹{order.totals?.total || 0}
                </span>
              </div>
            </div>
          </div>
        </Motion.div>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white md:w-[50%] rounded-2xl shadow-lg p-6"
            style={{ padding: "10px 20px", marginBottom: '10px' }}
          >
            <h3
              className="font-semibold flex gap-1 text-gray-900 mb-3"
              style={{ fontFamily: "Gyrotrope" }}
            >
              <Truck className="w-5 h-5 text-emerald-600" />
              Delivery Address
            </h3>
            <div
              className="text-sm text-gray-600"
              style={{ fontFamily: "Gyrotrope" }}
            >
              <p className="font-semibold text-gray-900 mb-1">
                {order.deliveryAddress.name}
              </p>
              <p className="mb-1">{order.deliveryAddress.address}</p>
              {order.deliveryAddress.city && (
                <p className="mb-1">
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
                  {order.deliveryAddress.pincode}
                </p>
              )}
              <p className="mt-2">
                Phone:{" "}
                <span className="font-medium text-gray-900">
                  {order.deliveryAddress.phone}
                </span>
              </p>
            </div>
          </Motion.div>
          
        )}
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmation;
