import React from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  ChevronRight,
} from "lucide-react";

const OrderCard = ({ order, index }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const statusColors = {
      PLACED: "#E58564",
      CONFIRMED: "#3B82F6",
      SHIPPED: "#F59E0B",
      DELIVERED: "#059669",
      CANCELLED: "#ef4444ff",
      RETURN_REQUESTED: "#f59f0bb6",
      RETURN_APPROVED: "#3b83f6a1",
      RETURN_COMPLETED: "#dc26268e",
    };
    return statusColors[status] || order.statusBg || "#6B7280";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const orderDate = order.createdAt ? formatDate(order.createdAt) : "";
  const itemsCount = order.items?.length || 1;
  const totalAmount = order.totals?.total || order.paymentBreakdown?.total || 0;

  return (
    <Motion.div
      key={order.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onClick={() => navigate(`/orders/${order.id}`, { state: { order } })}
      className="bg-white cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-emerald-400 active:scale-[0.995] group"
      style={{
        borderRadius: "8px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
        border: "1px solid #64E5B8",
        fontFamily: "Gyrotrope",
        margin: "8px 0px",
        padding: "5px 10px",
      }}
    >
      {/* Header Section */}
      <div className="w-full p-4 border-b border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="w-full flex items-center gap-2">
                <p
                  className="text-[8px] sm:text-xs text-gray-500"
                  style={{ fontFamily: "Gyrotrope" }}
                >
                  Order ID
                </p>
                <p
                  className="text-sm font-semibold text-gray-900"
                  style={{ fontFamily: "Gyrotrope" }}
                >
                  #{order.id}
                </p>
              </div>
              <div className="w-full flex items-center gap-2">
                {orderDate && (
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <p
                      className="text-[8px] sm:text-xs text-gray-500"
                      style={{ fontFamily: "Gyrotrope", marginTop: "5px" }}
                    >
                      {orderDate}
                    </p>
                  </div>
                )}

                {/* Status Badge */}
                <div
                  className="px-3 py-1.5 text-end rounded-md text-[8px] sm:text-xs font-semibold text-white"
                  style={{
                    backgroundColor: getStatusColor(order.status),
                    fontFamily: "Gyrotrope",
                    padding: "2px 10px",
                  }}
                >
                  {order.status}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4" style={{ paddingTop: "5px" }}>
        <div className="space-y-3">
          {/* Items Summary */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p
                className="text-[8px] sm:text-xs text-gray-500"
                style={{ fontFamily: "Gyrotrope" }}
              >
                Items ({itemsCount})
              </p>
              <p
                className="text-sm font-medium text-gray-900 line-clamp-2"
                style={{ fontFamily: "Gyrotrope" }}
              >
                {order.items
                  ? order.items
                      .map((item) => item.productName || item.name)
                      .join(", ")
                  : order.productName || "Order Items"}
              </p>
            </div>
            <div className="text-right ml-4 flex items-end gap-2">
              <p
                className="text-lg text-gray-700"
                style={{ fontFamily: "Gyrotrope" }}
              >
                Total:
              </p>
              <p
                className="text-lg font-bold text-emerald-500"
                style={{ fontFamily: "Gyrotrope" }}
              >
                ₹{totalAmount}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Delivery Info */}
            <div
              className="flex items-center gap-1 pt-2 border-t border-gray-100"
              style={{ paddingTop: "5px" }}
            >
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <p
                className="text-[8px] sm:text-xs text-gray-600 line-clamp-1"
                style={{ fontFamily: "Gyrotrope", marginTop: "5px" }}
              >
                {order.deliveryAddress?.address ||
                  order.address ||
                  order.customerAddress?.address}
              </p>
            </div>

            {/* Expected Delivery / Delivered Date */}
            {(order.expectedDelivery || order.deliveredDate) && (
              <div className="flex items-center justify-end pt-2 gap-1">
                <p
                  className="text-[8px] sm:text-xs text-gray-500"
                  style={{ fontFamily: "Gyrotrope" }}
                >
                  {order.deliveredDate
                    ? "Delivered on: "
                    : "Expected Delivery: "}
                </p>
                <p
                  className="text-[8px] sm:text-xs font-semibold text-emerald-600"
                  style={{ fontFamily: "Gyrotrope" }}
                >
                  {order.deliveredDate || order.expectedDelivery}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div
        className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl"
        style={{ paddingTop: "5px" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <p
              className="text-[8px] sm:text-xs text-gray-600 capitalize"
              style={{ fontFamily: "Gyrotrope", marginTop: "4px" }}
            >
              {order.paymentMethod || "Online Payment"}
            </p>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 group-hover:gap-2 transition-all">
            <p
              className="text-[8px] sm:text-xs font-semibold"
              style={{ fontFamily: "Gyrotrope" }}
            >
              View Details
            </p>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

export default OrderCard;
