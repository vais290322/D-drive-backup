
import { userOrderUrl } from "@/config/userApi";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAuthToken = () => {
    return localStorage.getItem("authToken") || sessionStorage.getItem("token");
  };
  // 🔹 Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${userOrderUrl.getAllOrders}`, {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        });

        setOrders(res.data.orders || []);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🔹 Loading / Error states
  if (loading) return <p style={{ textAlign: "center" }}>Loading orders...</p>;
  if (error)
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  if (!selectedOrder) {
    return (
      <div
        className=""
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "#ffffff",
          paddingTop: 104,
          paddingBottom: 64,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <div style={{ width: "100%", maxWidth: 640 }}>
          <h2
            className=""
            style={{
              fontSize: 30,
              fontWeight: "bold",
              marginBottom: 32,
              textAlign: "center",
              color: "#115e59",
              fontFamily: "Gyrotrope",
            }}
          >
            My Orders
          </h2>
          {orders.length === 0 && (
            <div
              className=""
              style={{
                textAlign: "center",
                color: "#6b7280",
                paddingTop: 48,
                paddingBottom: 48,
                fontSize: 18,
              }}
            >
              No orders found.
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {orders.map((order) => {
              const totalItems = order.orderItems.reduce(
                (sum, item) => sum + item.Quantity,
                0,
              );
              return (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className=""
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #ccfbf1",
                    borderRadius: 12,
                    padding: 24,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "box-shadow 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#0f766e" }}>
                      Order ID:
                    </span>
                    <span style={{ color: "#374151" }}>#{order._id}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: "#4b5563" }}>
                      Items:{" "}
                      <span style={{ fontWeight: 500 }}>{totalItems}</span>
                    </span>
                    <span style={{ color: "#4b5563" }}>
                      Status:{" "}
                      <span style={{ fontWeight: 500 }}>
                        {order.orderStatus}
                      </span>
                    </span>
                    <span style={{ color: "#4b5563" }}>
                      Total:{" "}
                      <span style={{ fontWeight: 500 }}>
                        ₹{order.totalPrice}
                      </span>
                    </span>
                    <span style={{ color: "#4b5563" }}>
                      Date:{" "}
                      <span style={{ fontWeight: 500 }}>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className=""
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#ffffff",
        paddingTop: 104,
        paddingBottom: 64,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <div style={{ width: "100%", maxWidth: 640 }}>
        <button
          onClick={() => setSelectedOrder(null)}
          className=""
          style={{
            marginBottom: 24,
            padding: "8px 16px",
            backgroundColor: "#14b8a6",
            color: "#ffffff",
            borderRadius: 8,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          ← Back to Orders
        </button>
        <h2
          className=""
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            color: "#115e59",
          }}
        >
          Order Details
        </h2>
        <div
          className=""
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #ccfbf1",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ fontWeight: 600, color: "#0f766e" }}>Order ID:</span>
            <span style={{ color: "#374151" }}>#{selectedOrder._id}</span>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <span style={{ color: "#4b5563" }}>
              Status:{" "}
              <span style={{ fontWeight: 500 }}>
                {selectedOrder.orderStatus}
              </span>
            </span>
            <span style={{ color: "#4b5563" }}>
              Payment:{" "}
              <span style={{ fontWeight: 500 }}>
                {selectedOrder.paymentMethod}
              </span>
            </span>
            <span style={{ color: "#4b5563" }}>
              Total:{" "}
              <span style={{ fontWeight: 500 }}>
                ₹{selectedOrder.totalPrice}
              </span>
            </span>
            <span style={{ color: "#4b5563" }}>
              Shipping:{" "}
              <span style={{ fontWeight: 500 }}>
                ₹{selectedOrder.shippingPrice}
              </span>
            </span>
            <span style={{ color: "#4b5563" }}>
              Discount:{" "}
              <span style={{ fontWeight: 500 }}>₹{selectedOrder.discount}</span>
            </span>
            <span style={{ color: "#4b5563" }}>
              Date:{" "}
              <span style={{ fontWeight: 500 }}>
                {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </span>
          </div>
        </div>
        <h3
          className=""
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#0f766e",
            marginBottom: 12,
          }}
        >
          Items
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 32,
          }}
        >
          {selectedOrder.orderItems.map((item, index) => (
            <div
              key={index}
              className=""
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                border: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb",
                padding: 16,
                borderRadius: 8,
              }}
            >
              {/* ✅ Product Image */}
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  flexShrink: 0,
                }}
                onError={(e) => {
                  e.target.src = "/placeholder.png"; // fallback image
                }}
              />

              {/* ✅ Product Details */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: 8,
                  width: "100%",
                }}
              >
                <span style={{ color: "#374151" }}>
                  Product Code:{" "}
                  <span style={{ fontWeight: 500 }}>{item.productCode}</span>
                </span>

                <span style={{ color: "#374151" }}>
                  Product Name:{" "}
                  <span style={{ fontWeight: 500 }}>{item.name}</span>
                </span>

                <span style={{ color: "#374151" }}>
                  Qty: <span style={{ fontWeight: 500 }}>{item.Quantity}</span>
                </span>

                <span style={{ color: "#374151" }}>
                  Free: <span style={{ fontWeight: 500 }}>{item.Free}</span>
                </span>

                <span style={{ color: "#374151", fontWeight: 600 }}>
                  ₹{item.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        <h3
          className=""
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#0f766e",
            marginBottom: 12,
          }}
        >
          Delivery Address
        </h3>
        <div
          className=""
          style={{
            border: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <p>{selectedOrder.address}</p>
          <p>{selectedOrder.street}</p>
          <p>
            {selectedOrder.city}, {selectedOrder.state} -{" "}
            {selectedOrder.postalCode}
          </p>
          <p>{selectedOrder.landmark}</p>
        </div>
      </div>
    </div>
  );
};

export default Orders;